const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 📌 Récupérer les réservations et emprunts de l'utilisateur
router.get("/:id_user", async (req, res) => {
    const { id_user } = req.params;

    try {
        // Récupérer les réservations
        const [reservations] = await db.query(
            `SELECT r.id, d.titre, d.auteur, d.image_url, r.date_reservation 
             FROM reservations r 
             JOIN exemplaires e ON r.id_exemplaire = e.id 
             JOIN documents d ON e.id_document = d.id 
             WHERE r.id_user = ? AND r.statut = 'active'`,
            [id_user]
        );

        // Récupérer les emprunts
        const [emprunts] = await db.query(
            `SELECT e.id, d.titre, d.auteur, d.image_url, e.date_emprunt, e.date_retour_prevu 
             FROM emprunts e 
             JOIN exemplaires ex ON e.id_exemplaire = ex.id 
             JOIN documents d ON ex.id_document = d.id 
             WHERE e.id_user = ? AND e.statut = 'en cours'`,
            [id_user]
        );

        res.status(200).json({ reservations, emprunts });
    } catch (error) {
        console.error("❌ Erreur récupération dashboard :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// 📌 Supprimer une réservation
router.delete("/supprimer-reservation/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM reservations WHERE id = ?", [id]);
        res.status(200).json({ message: "Réservation supprimée avec succès !" });
    } catch (error) {
        console.error("❌ Erreur suppression réservation :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// 📌 Retourner un emprunt
router.post("/retourner-emprunt/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("UPDATE emprunts SET date_retour = CURDATE(), statut = 'retourné' WHERE id = ?", [id]);
        res.status(200).json({ message: "Livre retourné avec succès !" });
    } catch (error) {
        console.error("❌ Erreur retour emprunt :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
