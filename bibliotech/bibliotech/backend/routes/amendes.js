const express = require("express");
const router = express.Router();
const db = require("../config/db");



// 📌 Récupérer les amendes d’un utilisateur avec titre + image du livre
router.get("/:id_user", (req, res) => {
  const { id_user } = req.params;

  const sql = `
    SELECT a.id, a.montant, a.date_creation,
           d.titre, d.image_url,
           (a.statut = 'payée') AS payee
    FROM amendes a
    JOIN emprunts e ON a.id_emprunt = e.id
    JOIN exemplaires ex ON e.id_exemplaire = ex.id
    JOIN documents d ON ex.id_document = d.id
    WHERE e.id_user = ? AND a.statut = 'impayée'
  `;

  db.query(sql, [id_user], (err, rows) => {
    if (err) {
      console.error("❌ Erreur récupération amendes :", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.status(200).json(rows);
  });
});


// 📌 Payer une amende
router.post("/payer", (req, res) => {
    const { id_amende } = req.body;

    db.query(
        "UPDATE amendes SET statut = 'payé' WHERE id = ?",
        [id_amende],
        (err) => {
            if (err) return res.status(500).json({ message: "Erreur serveur." });
            res.status(200).json({ message: "Amende payée avec succès !" });
        }
    );
});

module.exports = router;
