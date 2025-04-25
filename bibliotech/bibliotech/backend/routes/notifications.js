const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Récupérer toutes les notifications d'un utilisateur
router.get("/:user_id", (req, res) => {
  const { user_id } = req.params;
  db.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY date_creation DESC",
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur SQL" });
      res.json(result);
    }
  );
});

// ✅ Marquer une notification comme lue
router.put("/vue/:id", (req, res) => {
  const { id } = req.params;
  db.query("UPDATE notifications SET lu = TRUE WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Erreur mise à jour" });
    res.json({ message: "Notification lue." });
  });
});

// ✅ Ajouter une notification manuellement (optionnel pour tests)
router.post("/ajouter", (req, res) => {
  const { user_id, message } = req.body;
  db.query(
    "INSERT INTO notifications (user_id, message, type) VALUES (?, ?, 'info')",
    [user_id, message],
    (err) => {
      if (err) {
        console.error("❌ Erreur SQL (ajout notification) :", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.status(200).json({ message: "Notification ajoutée avec succès !" });
    }
  );
});

// 🗑️ Supprimer toutes les notifications lues pour un utilisateur
router.delete("/supprimer-lues/:id_user", (req, res) => {
    const { id_user } = req.params;
  
    const sql = `DELETE FROM notifications WHERE user_id = ? AND lu = true`;
  
    db.query(sql, [id_user], (err, result) => {
      if (err) {
        console.error("❌ Erreur suppression notifications lues :", err);
        return res.status(500).json({ error: "Erreur lors de la suppression" });
      }
      res.json({ message: `✅ ${result.affectedRows} notifications lues supprimées.` });
    });
  });
  

module.exports = router;
