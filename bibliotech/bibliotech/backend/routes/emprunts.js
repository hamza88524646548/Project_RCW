const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 📌 Obtenir les livres empruntés (en cours ou en retard) par un utilisateur
router.get("/mes-emprunts/:id_user", (req, res) => {
  const { id_user } = req.params;

  db.query(
    `SELECT em.id AS id_emprunt, d.titre, d.auteur, d.image_url, em.date_emprunt, em.date_retour_prevu, em.statut
     FROM emprunts em 
     JOIN exemplaires e ON em.id_exemplaire = e.id 
     JOIN documents d ON e.id_document = d.id 
     WHERE em.id_user = ? AND (em.statut = 'en cours' OR em.statut = 'en retard')`,
    [id_user],
    (err, emprunts) => {
      if (err) {
        console.error("❌ Erreur SQL (récupération emprunts) :", err);
        return res.status(500).json({ message: "Erreur serveur (récupération emprunts)" });
      }
      res.status(200).json(emprunts);
    }
  );
});

// 📌 Confirmer un emprunt
router.post("/confirmer-emprunt", (req, res) => {
  const { id_user, id_exemplaire, date_retour } = req.body;

  if (!id_user || !id_exemplaire || !date_retour) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }

  const checkQuery = `
    SELECT * FROM emprunts
    WHERE id_user = ? AND id_exemplaire = ? AND statut = 'en cours'
  `;

  db.query(checkQuery, [id_user, id_exemplaire], (err, existing) => {
    if (err) {
      console.error("❌ Erreur vérification :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (existing.length > 0) {
      return res.status(400).json({ message: "Vous avez déjà emprunté ce livre." });
    }

    const insertQuery = `
      INSERT INTO emprunts (id_user, id_exemplaire, date_emprunt, date_retour_prevu, statut)
      VALUES (?, ?, NOW(), ?, 'en cours')
    `;

    db.query(insertQuery, [id_user, id_exemplaire, date_retour], (err2) => {
      if (err2) {
        console.error("❌ Erreur ajout emprunt :", err2);
        return res.status(500).json({ message: "Erreur enregistrement emprunt." });
      }

      db.query(
        "DELETE FROM reservations WHERE id_user = ? AND id_exemplaire = ?",
        [id_user, id_exemplaire],
        (err3) => {
          if (err3) console.warn("⚠️ Réservation non supprimée (non bloquant)");

          db.query(
            "UPDATE exemplaires SET disponible = 0 WHERE id = ?",
            [id_exemplaire],
            (err4) => {
              if (err4) console.warn("⚠️ Erreur disponibilité");
              res.status(200).json({ message: "📚 Emprunt enregistré avec succès !" });
            }
          );
        }
      );
    });
  });
});

// 📌 Retourner un livre emprunté
router.post("/retourner/:id_emprunt", (req, res) => {
  const { id_emprunt } = req.params;

  const updateEmprunt = `
    UPDATE emprunts 
    SET statut = 'retourné', date_retour = NOW()
    WHERE id = ?
  `;

  db.query(updateEmprunt, [id_emprunt], (err) => {
    if (err) {
      console.error("❌ Erreur retour livre :", err);
      return res.status(500).json({ message: "Erreur lors du retour du livre." });
    }

    const updateExemplaire = `
      UPDATE exemplaires
      SET disponible = 1
      WHERE id = (
        SELECT id_exemplaire FROM emprunts WHERE id = ?
      )
    `;

    db.query(updateExemplaire, [id_emprunt], (err2) => {
      if (err2) {
        console.warn("⚠️ Erreur disponibilité exemplaire :", err2);
        return res.status(500).json({ message: "Livre retourné, mais exemplaire non mis à jour." });
      }

      res.status(200).json({ message: "🔁 Livre retourné avec succès." });
    });
  });
});

// 🔍 Vérifier si un livre est actuellement emprunté
router.get("/verifier-emprunt/:id_document", (req, res) => {
  const { id_document } = req.params;

  const sql = `
    SELECT em.id FROM emprunts em
    JOIN exemplaires e ON em.id_exemplaire = e.id
    WHERE e.id_document = ? AND em.statut = 'en cours'
  `;

  db.query(sql, [id_document], (err, rows) => {
    if (err) {
      console.error("❌ Erreur vérif emprunt :", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    return res.status(200).json({ emprunted: rows.length > 0 });
  });
});

// 🔁 Mettre à jour les statuts en retard (manuel ou planifié)
router.put("/check-retards", (req, res) => {
  const sql = `
    SELECT e.id, e.id_user, u.nom, u.email, e.date_retour_prevu
    FROM emprunts e
    JOIN users u ON u.id = e.id_user
    WHERE e.statut = 'en cours' AND e.date_retour_prevu < CURDATE()
  `;

  db.query(sql, (err, empruntsEnRetard) => {
    if (err) return res.status(500).json({ error: "Erreur récupération retards" });

    if (empruntsEnRetard.length === 0)
      return res.json({ message: "Aucun retard détecté" });

    const updateSQL = `
      UPDATE emprunts SET statut = 'en retard'
      WHERE id IN (${empruntsEnRetard.map((e) => e.id).join(",")})
    `;

    db.query(updateSQL, (err2) => {
      if (err2) return res.status(500).json({ error: "Erreur mise à jour statut" });

      const insertNotifications = [];
      empruntsEnRetard.forEach((e) => {
        const msgUser = `📚 Vous avez un livre en retard (retour prévu le ${new Date(e.date_retour_prevu).toLocaleDateString()}) !`;
        const msgAdmin = `⚠️ L'utilisateur ${e.nom} (${e.email}) est en retard de retour.`;

        insertNotifications.push([e.id_user, "retard", msgUser]);
        insertNotifications.push([1, "alerte_admin", msgAdmin]);
      });

      const notifSQL = `INSERT INTO notifications (id_user, type, message) VALUES ?`;

      db.query(notifSQL, [insertNotifications], (err3) => {
        if (err3)
          return res.status(500).json({ error: "Erreur enregistrement notifications" });

        res.json({ message: "✅ Retards détectés et notifications envoyées." });
      });
    });
  });
});

module.exports = router;
