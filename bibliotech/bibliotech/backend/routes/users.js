const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
require("dotenv").config(); // Charger les variables d'environnement
const twilio = require("twilio");
const router = express.Router();
const faceapi = require("face-api.js");

// 📲 Configuration Twilio avec des variables d'environnement
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// 📌 Générer un ID utilisateur unique (6 chiffres)
const generateUserId = () => {
    return Math.floor(100000 + Math.random() * 900000);
};


/* ==============================
   📌 Récupérer l'ID unique par téléphone
   ============================== */
   router.post("/recover-id", (req, res) => {
    const { telephone } = req.body;
 
    if (!telephone) {
        return res.status(400).json({ error: "Numéro de téléphone requis." });
    }
 
    db.query("SELECT id_unique FROM users WHERE telephone = ?", [telephone], async(err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur." });
 
        if (results.length === 0) {
            return res.status(404).json({ error: "Aucun compte associé à ce numéro." });
        }
 
        const id_unique = results[0].id_unique;
 
        try {
            await client.messages.create({
                body: `📌 Votre ID Bibliothèque est : ${id_unique}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: telephone
            });
        } catch (smsError) {
            console.error("❌ Erreur envoi SMS :", smsError);
            return res.status(500).json({ error: "Impossible d'envoyer le SMS." });
        }
 
        res.json({ message: "📩 Votre ID a été envoyé par SMS !" });
    });
});


router.post("/find-by-face", async (req, res) => {
    const { descriptor } = req.body;
    console.log("📥 Descripteur reçu :", descriptor);

    if (!descriptor || !Array.isArray(descriptor)) {
        return res.status(400).json({ error: "Encodage facial invalide ou non fourni." });
    }

    try {
        db.query("SELECT id, id_unique, nom, email, role, status, face_encoding FROM users", (err, results) => {
            if (err) return res.status(500).json({ error: "Erreur serveur." });
            for (const user of results) {
                try {
                    if (!user.face_encoding) continue;
                    const storedDescriptor = JSON.parse(user.face_encoding);
                    const distance = faceapi.euclideanDistance(storedDescriptor, descriptor);
                    if (distance < 0.6) {
                        return res.json({
                            user: {
                                id: user.id,
                                id_unique: user.id_unique,
                                nom: user.nom,
                                email: user.email,
                                role: user.role,
                                status: user.status
                            }
                        });
                    }
                } catch (error) {
                    console.error("Erreur de comparaison de visage :", error.message);
                    continue;
                }
            }
            res.status(404).json({ error: "Utilisateur non trouvé." });
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la recherche par visage." });
    }
});

 
router.post("/save-face", async (req, res) => {
    const { userId, descriptor } = req.body;

    if (!userId || !descriptor || !Array.isArray(descriptor)) {
        return res.status(400).json({ error: "ID utilisateur et encodage requis." });
    }

    const faceEncoding = JSON.stringify(descriptor);
    db.query("UPDATE users SET face_encoding = ? WHERE id_unique = ?", [faceEncoding, userId], (err) => {
        if (err) return res.status(500).json({ error: "Erreur SQL lors de l'enregistrement." });
        res.json({ message: "✅ Encodage facial enregistré avec succès." });
    });
});

/* ==============================
   🔹 Inscription d'un nouvel utilisateur
   ============================== */

   router.post("/register", async (req, res) => {
    try {
        const { nom, email, mot_de_passe, telephone, face_encoding } = req.body;
 
        if (!nom || !email || !mot_de_passe || !telephone) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }
 
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) return res.status(500).json({ error: "Erreur serveur." });
 
            if (results.length > 0) {
                return res.status(400).json({ error: "Cet email est déjà utilisé." });
            }
 
            const id_unique = Math.floor(100000 + Math.random() * 900000);
            const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
 
            db.query(
                "INSERT INTO users (id_unique, nom, email, mot_de_passe, telephone, face_encoding, status, role) VALUES (?, ?, ?, ?, ?, ?, 'actif', 'membre')",
                [id_unique, nom, email, hashedPassword, telephone, face_encoding],
                (err, result) => {
                    if (err) {
                        console.error("❌ Erreur SQL :", err);
                        return res.status(500).json({ error: "Erreur serveur." });
                    }
                    res.status(201).json({ message: "✅ Inscription réussie !", id_unique });
                }
            );
        });
    } catch (error) {
        console.error("❌ Erreur serveur :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});
router.get("/load-face/:id_unique", (req, res) => {
    const { id_unique } = req.params;
    db.query("SELECT face_encoding FROM users WHERE id_unique = ?", [id_unique], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Aucun encodage facial trouvé" });
       
        try {
            const descriptor = JSON.parse(results[0].face_encoding);
            if (!Array.isArray(descriptor) || !descriptor.every((val) => typeof val === "number")) {
                throw new Error("Encodage facial incorrect ou contient des données non numériques");
            }
 
            res.json({ descriptor });
        } catch (parseError) {
            res.status(500).json({ error: "Erreur lors du chargement de l'encodage facial" });
        }
    });
});
 
router.post("/save-face", async (req, res) => {
    const { userId, descriptor } = req.body;
 
    if (!userId || !descriptor) {
        return res.status(400).json({ error: "ID utilisateur et encodage requis." });
    }
 
    try {
        // Vérifier si le descripteur est bien un tableau de nombres
        if (!Array.isArray(descriptor) || !descriptor.every(val => typeof val === "number")) {
            return res.status(400).json({ error: "Descripteur facial invalide." });
        }
 
        // Convertir en JSON avant d'enregistrer dans la base de données
        const faceEncoding = JSON.stringify(descriptor);
 
        db.query(
            "UPDATE users SET face_encoding = ? WHERE id_unique = ?",
            [faceEncoding, userId],
            (err) => {
                if (err) {
                    console.error("❌ Erreur SQL :", err);
                    return res.status(500).json({ error: "Erreur lors de l'enregistrement de l'encodage." });
                }
                res.json({ message: "✅ Encodage facial enregistré avec succès." });
            }
        );
    } catch (error) {
        console.error("❌ Erreur d'enregistrement facial :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});
 
 
/* ==============================
   🔹 Récupérer tous les utilisateurs
   ============================== */
router.get("/", (req, res) => {
    db.query("SELECT id, nom, email, role, status, date_inscription FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


/* ==============================
   🔹 Connexion d'un utilisateur
   ============================== */
   router.post("/login", async(req, res) => {
    const { id_unique, mot_de_passe } = req.body;
 
    if (!id_unique || !mot_de_passe) {
        return res.status(400).json({ error: "ID unique et mot de passe requis." });
    }
 
    db.query("SELECT * FROM users WHERE id_unique = ?", [id_unique], async(err, results) => {
        if (err) {
            console.error("❌ Erreur SQL :", err);
            return res.status(500).json({ error: "Erreur serveur." });
        }
 
        if (results.length === 0) {
            return res.status(401).json({ error: "❌ ID unique incorrect ou inexistant." });
        }
 
        const user = results[0];
 
        // Vérifier si l'utilisateur est banni
        if (user.status === "inactif") {
            return res.status(403).json({ error: "🚫 Votre compte a été banni. Contactez un administrateur." });
        }
 
        // Vérifier le mot de passe (comparer le hash)
        const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ error: "❌ Mot de passe incorrect." });
        }
 
        // ✅ Connexion réussie
        res.json({
            message: "✅ Connexion réussie !",
            user: {
                id: user.id,
                id_unique: user.id_unique,
                nom: user.nom,
                telephone: user.telephone,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    });
});
 

/* ==============================
   🚫 Bannir un utilisateur
   ============================== */
router.put("/ban/:id", (req, res) => {
    const { id } = req.params;
    const { adminId } = req.body;

    db.query("SELECT role FROM users WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results[0].role === "admin") {
            return res.status(403).json({ error: "⛔ Impossible de bannir un administrateur !" });
        }

        db.query("UPDATE users SET status = 'inactif' WHERE id = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "🚫 Utilisateur banni." });
        });
    });
});

/* ==============================
   ✅ Réactiver un utilisateur
   ============================== */
router.put("/activate/:id", (req, res) => {
    const { id } = req.params;
    db.query("UPDATE users SET status = 'actif' WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "✅ Utilisateur réactivé." });
    });
});

/* ==============================
   📊 Statistiques des utilisateurs
   ============================== */
router.get("/stats", (req, res) => {
    db.query(
        `SELECT 
            (SELECT COUNT(*) FROM users WHERE role='admin') AS admins, 
            (SELECT COUNT(*) FROM users WHERE role='membre') AS membres,
            (SELECT COUNT(*) FROM users WHERE status='inactif') AS bannis 
        `,
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results[0]);
        }
    );
});

// 🔍 Récupérer les infos d’un utilisateur + ses emprunts en cours
router.get("/details/:id", (req, res) => {
    const userId = req.params.id;
  
    const userSql = "SELECT id, nom, email, telephone, role, status FROM users WHERE id = ?";
    const empruntsSql = `
      SELECT e.id, d.titre, e.date_emprunt, e.date_retour_prevu
      FROM emprunts e
      JOIN documents d ON e.id_document = d.id
      WHERE e.id_user = ? AND e.statut = 'en cours'
    `;
  
    db.query(userSql, [userId], (err, userResults) => {
      if (err) return res.status(500).json({ error: "Erreur SQL utilisateur" });
      if (userResults.length === 0) return res.status(404).json({ error: "Utilisateur introuvable." });
  
      const utilisateur = userResults[0];
  
      db.query(empruntsSql, [userId], (err2, empruntResults) => {
        if (err2) return res.status(500).json({ error: "Erreur SQL emprunts" });
  
        res.json({
          utilisateur,
          emprunts: empruntResults,
        });
      });
    });
  });

  router.get("/avec-emprunts", (req, res) => {
    const sql = `
      SELECT 
        u.id AS user_id,
        u.nom,
        u.email,
        u.telephone,
        u.status,
        d.titre,
        e.date_emprunt,
        e.date_retour_prevu
      FROM users u
      LEFT JOIN emprunts e ON u.id = e.id_user AND e.statut = 'en cours'
      LEFT JOIN exemplaires ex ON e.id_exemplaire = ex.id
      LEFT JOIN documents d ON ex.id_document = d.id
      ORDER BY u.id, e.date_emprunt DESC
    `;
  
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      const utilisateurs = {};
  
      results.forEach(row => {
        if (!utilisateurs[row.user_id]) {
          utilisateurs[row.user_id] = {
            id: row.user_id,
            nom: row.nom,
            email: row.email,
            telephone: row.telephone,
            status: row.status,
            emprunts: []
          };
        }
  
        if (row.titre) {
          utilisateurs[row.user_id].emprunts.push({
            titre: row.titre,
            date_emprunt: row.date_emprunt,
            date_retour_prevu: row.date_retour_prevu
          });
        }
      });
  
      res.json(Object.values(utilisateurs));
    });
  });
  

module.exports = router;