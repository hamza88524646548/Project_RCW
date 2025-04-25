const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 📊 Route de statistiques
router.get("/", (req, res) => {
    console.log("📊 Route /stats appelée");
  
    let stats = {
      livres_disponibles: 0,
      emprunts_actifs: 0,
      emprunts_en_retard: 0,
      membres_bannis: 0,
    };
  
    db.query("SELECT COUNT(*) AS total FROM documents", (err, result) => {
      if (err) {
        console.error("❌ Erreur SQL sur documents:", err); // 👈 ici
        return res.status(500).json({ error: "Erreur SQL documents" });
      }
  
      stats.livres_disponibles = result[0].total;
      console.log("✅ livres_disponibles:", stats.livres_disponibles);
  
      db.query("SELECT COUNT(*) AS total FROM emprunts WHERE statut = 'en cours'", (err2, result2) => {
        if (err2) {
          console.error("❌ Erreur SQL emprunts actifs:", err2); // 👈 ici
          return res.status(500).json({ error: "Erreur SQL emprunts actifs" });
        }
  
        stats.emprunts_actifs = result2[0].total;
        console.log("✅ emprunts_actifs:", stats.emprunts_actifs);
  
        db.query("SELECT COUNT(*) AS total FROM emprunts WHERE statut = 'en retard'", (err3, result3) => {
          if (err3) {
            console.error("❌ Erreur SQL emprunts en retard:", err3); // 👈 ici
            return res.status(500).json({ error: "Erreur SQL emprunts en retard" });
          }
  
          stats.emprunts_en_retard = result3[0].total;
          console.log("✅ emprunts_en_retard:", stats.emprunts_en_retard);
  
          db.query("SELECT COUNT(*) AS total FROM users WHERE status = 'banni'", (err4, result4) => {
            if (err4) {
              console.error("❌ Erreur SQL utilisateurs bannis:", err4); // 👈 ici
              return res.status(500).json({ error: "Erreur SQL utilisateurs bannis" });
            }
  
            stats.membres_bannis = result4[0].total;
            console.log("✅ membres_bannis:", stats.membres_bannis);
  
            res.json({
                livresDisponibles: stats.livres_disponibles,
                empruntsActifs: stats.emprunts_actifs,
                empruntsRetard: stats.emprunts_en_retard,
                membresBannis: stats.membres_bannis
              });
              
          });
        });
      });
    });
  });
  

module.exports = router;
