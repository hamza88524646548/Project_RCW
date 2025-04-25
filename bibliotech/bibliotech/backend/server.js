require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// 📁 Fichiers statiques
app.use("/images", express.static(path.join(__dirname, "public/images")));

// 🔐 Création automatique de l’admin
async function ensureAdminExists() {
  db.query("SELECT * FROM users WHERE email = ?", ["admin@gmail.com"], async (err, results) => {
    if (err) return console.error("❌ Erreur admin:", err);
    if (results.length === 0) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      db.query(
        "INSERT INTO users (nom, email, mot_de_passe, role, status) VALUES (?, ?, ?, ?, ?)",
        ["Admin", "admin@gmail.com", hashedPassword, "admin", "actif"],
        (err) => {
          if (err) console.error("❌ Ajout admin échoué:", err);
          else console.log("✅ Admin créé !");
        }
      );
    }
  });
}
ensureAdminExists();

// 🔔 Vérification automatique des retards
function verifierRetards() {
  const now = new Date();
  const query = `
    SELECT e.*, u.id AS user_id, u.nom, d.titre AS titre_livre
    FROM emprunts e
    JOIN users u ON e.id_user = u.id
    JOIN exemplaires ex ON e.id_exemplaire = ex.id
    JOIN documents d ON ex.id_document = d.id
    WHERE e.statut = 'en cours' AND e.date_retour_prevu < ?
  `;

  db.query(query, [now], (err, emprunts) => {
    if (err) return console.error("❌ Erreur vérification retards :", err);

    if (emprunts.length > 0) {
      emprunts.forEach((emprunt) => {
        const messageUser = `⏰ Vous avez un retard pour le livre \"${emprunt.titre_livre}\" aller à la page de mes amendes pour payer .`;
        const messageAdmin = `⚠️ L'utilisateur ${emprunt.nom} est en retard pour le livre \"${emprunt.titre_livre}\".`;

        db.query("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, 'retard')", [emprunt.user_id, messageUser]);

        db.query("SELECT id FROM users WHERE role = 'admin'", (adminErr, admins) => {
          if (adminErr) return console.error("❌ Erreur admins:", adminErr);
          admins.forEach((admin) => {
            db.query("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, 'retard')", [admin.id, messageAdmin]);
          });
        });

        db.query("UPDATE emprunts SET statut = 'en retard' WHERE id = ?", [emprunt.id]);

        const montant = 10.00;
        db.query("SELECT * FROM amendes WHERE id_user = ? AND id_emprunt = ?", [emprunt.user_id, emprunt.id], (checkErr, result) => {
          if (checkErr) return console.error("❌ Erreur vérif amende :", checkErr);
          if (result.length === 0) {
            db.query("INSERT INTO amendes (id_user, id_emprunt, montant) VALUES (?, ?, ?)", [emprunt.user_id, emprunt.id, montant], (errAmende) => {
              if (errAmende) console.error("❌ Erreur ajout amende :", errAmende);
              else console.log(`💰 Amende ajoutée pour user ${emprunt.user_id}`);
            });
          }
        });
      });

      console.log(`📢 ${emprunts.length} retards détectés et notifications + amendes envoyées.`);
    }
  });
}
setInterval(verifierRetards, 60000); // Chaque 60 secondes

// ✅ Routes
const userRoutes = require("./routes/users");
const documentRoutes = require("./routes/documents");
const reservationRoutes = require("./routes/reservations");
const empruntRoutes = require("./routes/emprunts");
const statsRoutes = require("./routes/stats");
const notificationRoutes = require("./routes/notifications");
const amendeRoutes = require("./routes/amendes");
const paypalRoutes = require("./routes/paypalRoutes");

app.use("/users", userRoutes);
app.use("/documents", documentRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/emprunts", empruntRoutes);
app.use("/stats", statsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/amendes", amendeRoutes);
app.use("/api/paypal", paypalRoutes);

// 🔍 Recherche intelligente
app.get("/api/recherche-livres", (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Mot clé manquant." });

  const likeQuery = `%${query.toLowerCase()}%`;
  const sql = `
    SELECT id, titre, auteur, image_url
    FROM documents
    WHERE LOWER(titre) LIKE ? OR LOWER(description) LIKE ? OR LOWER(auteur) LIKE ?
  `;

  db.query(sql, [likeQuery, likeQuery, likeQuery], (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    if (results.length > 0) return res.json(results);

    const mots = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (mots.length === 0) return res.json([]);

    const conditions = mots.map(() =>
      "(LOWER(titre) LIKE ? OR LOWER(description) LIKE ? OR LOWER(auteur) LIKE ?)"
    ).join(" OR ");

    const valeurs = [];
    mots.forEach((mot) => {
      const like = `%${mot}%`;
      valeurs.push(like, like, like);
    });

    const fallbackSql = `SELECT id, titre, auteur, image_url FROM documents WHERE ${conditions}`;
    db.query(fallbackSql, valeurs, (err2, results2) => {
      if (err2) return res.status(500).json({ error: "Erreur serveur." });
      res.json(results2);
    });
  });
});

// 🤖 Chatbot IA OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Clé API OpenAI manquante. Vérifie ton fichier .env !");
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
app.post("/api/chatbot", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message manquant." });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const botReply = completion.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (err) {
    console.error("❌ Erreur OpenAI:", err);
    res.status(500).json({ error: "Erreur avec le chatbot IA (OpenAI)." });
  }
});

// 🚀 Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur actif sur http://localhost:${PORT}`);
});