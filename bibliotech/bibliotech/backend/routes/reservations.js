const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 📌 Réserver un livre (vérifie doublons, réservations, emprunts)
router.post("/reserve", (req, res) => {
    const { id_user, id_document } = req.body;

    // ✅ Correction ici :
    if (id_user == null || id_document == null) {
        return res.status(400).json({ message: "Données manquantes." });
    }

    // 🔒 Vérifier si l'utilisateur a déjà réservé ce livre
    const checkQuery = `
        SELECT r.id FROM reservations r
        JOIN exemplaires e ON r.id_exemplaire = e.id
        WHERE r.id_user = ? AND e.id_document = ? AND r.statut = 'active'
    `;

    db.query(checkQuery, [id_user, id_document], (err, existing) => {
        if (err) return res.status(500).json({ message: "Erreur serveur (vérif réservation)" });

        if (existing.length > 0) {
            return res.status(400).json({ message: "Vous avez déjà réservé ce livre." });
        }

        // 🔒 Vérifier si un autre utilisateur a réservé un exemplaire de ce livre
        const checkOtherQuery = `
            SELECT r.id FROM reservations r
            JOIN exemplaires e ON r.id_exemplaire = e.id
            WHERE e.id_document = ? AND r.statut = 'active'
        `;

        db.query(checkOtherQuery, [id_document], (err2, reservedByOthers) => {
            if (err2) return res.status(500).json({ message: "Erreur serveur (vérif autres réservations)" });

            if (reservedByOthers.length > 0) {
                return res.status(400).json({ message: "Ce livre est déjà réservé par un autre utilisateur." });
            }

            // 🔒 Vérifier si un exemplaire est actuellement emprunté
            const checkEmprunt = `
                SELECT em.id FROM emprunts em
                JOIN exemplaires e ON em.id_exemplaire = e.id
                WHERE e.id_document = ? AND em.statut = 'en cours'
            `;

            db.query(checkEmprunt, [id_document], (errE, empruntActif) => {
                if (errE) return res.status(500).json({ message: "Erreur serveur (emprunt actif)" });

                if (empruntActif.length > 0) {
                    return res.status(400).json({ message: "Ce livre est actuellement emprunté." });
                }

                // ✅ Réserver ou créer un exemplaire s'il est disponible
                db.query(
                    "SELECT id FROM exemplaires WHERE id_document = ? AND disponible = 1 LIMIT 1",
                    [id_document],
                    (err3, exemplaire) => {
                        if (err3) return res.status(500).json({ message: "Erreur serveur (exemplaire)" });

                        if (exemplaire.length === 0) {
                            const numero_exemplaire = `EX-${id_document}-${Date.now()}`;
                            db.query(
                                "INSERT INTO exemplaires (id_document, numero_exemplaire, disponible) VALUES (?, ?, 1)",
                                [id_document, numero_exemplaire],
                                (err4, result) => {
                                    if (err4) return res.status(500).json({ message: "Erreur ajout exemplaire." });

                                    const newExemplaireId = result.insertId;
                                    reserverExemplaire(id_user, newExemplaireId, res);
                                }
                            );
                        } else {
                            const id_exemplaire = exemplaire[0].id;
                            reserverExemplaire(id_user, id_exemplaire, res);
                        }
                    }
                );
            });
        });
    });
});

// 📌 Effectuer la réservation
function reserverExemplaire(id_user, id_exemplaire, res) {
    db.query(
        "INSERT INTO reservations (id_user, id_exemplaire, date_reservation, statut) VALUES (?, ?, NOW(), 'active')",
        [id_user, id_exemplaire],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Erreur lors de la réservation." });

            db.query("UPDATE exemplaires SET disponible = 0 WHERE id = ?", [id_exemplaire]);
            res.status(200).json({ message: "📚 Réservation effectuée avec succès !" });
        }
    );
}

// 📌 Récupérer les réservations de l’utilisateur
router.get("/mes-reservations/:id_user", (req, res) => {
    const { id_user } = req.params;

    db.query(
        `SELECT r.id, r.id_exemplaire, d.titre, d.auteur, d.image_url, r.date_reservation
         FROM reservations r
         JOIN exemplaires e ON r.id_exemplaire = e.id
         JOIN documents d ON e.id_document = d.id
         WHERE r.id_user = ? AND r.statut = 'active'`,
        [id_user],
        (err, reservations) => {
            if (err) return res.status(500).json({ message: "Erreur serveur (récupération réservations)" });
            res.status(200).json(reservations);
        }
    );
});

// 📌 Supprimer une réservation
router.delete("/supprimer/:id_reservation", (req, res) => {
    const { id_reservation } = req.params;

    db.query("DELETE FROM reservations WHERE id = ?", [id_reservation], (err) => {
        if (err) return res.status(500).json({ message: "Erreur serveur, impossible de supprimer la réservation." });
        res.status(200).json({ message: "✅ Réservation supprimée avec succès !" });
    });
});

// 📌 Vérifier si un document est réservé
router.get("/verifier-reservation/:id_document", (req, res) => {
    const { id_document } = req.params;

    const query = `
        SELECT r.id, r.id_user, r.id_exemplaire
        FROM reservations r
        JOIN exemplaires e ON r.id_exemplaire = e.id
        WHERE e.id_document = ? AND r.statut = 'active'
    `;

    db.query(query, [id_document], (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur serveur." });

        if (result.length > 0) {
            return res.status(200).json({ reserved: true, id_user: result[0].id_user });
        }

        return res.status(200).json({ reserved: false });
    });
});

// 📌 État global d’un document (si réservé ou non)
router.get("/etat/:id_document", (req, res) => {
    const { id_document } = req.params;

    const query = `
        SELECT COUNT(*) AS total
        FROM reservations
        JOIN exemplaires e ON reservations.id_exemplaire = e.id
        WHERE e.id_document = ? AND reservations.statut = 'active'
    `;

    db.query(query, [id_document], (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });

        const estReserve = results[0].total > 0;
        res.json({ estReserve });
    });
});



module.exports = router;
