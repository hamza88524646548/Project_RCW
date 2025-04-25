const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ==============================
   📷 Configuration de Multer (Gestion des images)
   ============================== */
const storage = multer.diskStorage({
    destination: "./public/images",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

/* ==============================
   📚 Récupérer tous les documents (livres, revues, etc.)
   ============================== */
router.get("/", (req, res) => {
    db.query(
        `SELECT d.id, d.titre, d.auteur, d.description, d.image_url, c.nom AS categorie
         FROM documents d
         JOIN categories c ON d.id_categorie = c.id`,
        (err, results) => {
            if (err) return res.status(500).json({ error: "Erreur lors de la récupération des documents." });
            res.json(results);
        }
    );
});

/* ==============================
   ➕ Ajouter un document (CREATE)
   ============================== */
router.post("/", upload.single("image"), (req, res) => {
    const { titre, auteur, description } = req.body;
    const image_url = req.file ? req.file.filename : null;

    // Catégorie par défaut : 1 (ou autre valeur par défaut définie en BDD)
    const id_categorie = 1;

    if (!titre || !auteur) {
        return res.status(400).json({ error: "Les champs titre et auteur sont obligatoires." });
    }

    db.query(
        `INSERT INTO documents (titre, auteur, id_categorie, description, image_url) VALUES (?, ?, ?, ?, ?)`,
        [titre, auteur, id_categorie, description || "", image_url],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "📚 Livre ajouté avec succès", id: result.insertId });
        }
    );
});

/* ==============================
   ✏️ Modifier un document (UPDATE)
   ============================== */
router.put("/:id", upload.single("image"), (req, res) => {
    const { id } = req.params;
    const { titre, auteur, description } = req.body;
    const newImage = req.file ? req.file.filename : null;

    if (!titre || !auteur) {
        return res.status(400).json({ error: "Les champs titre et auteur sont obligatoires." });
    }

    db.query("SELECT image_url FROM documents WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Livre non trouvé" });

        const oldImage = results[0].image_url;

        if (newImage && oldImage) {
            const oldImagePath = `./public/images/${oldImage}`;
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }

        db.query(
            `UPDATE documents SET titre = ?, auteur = ?, description = ?, image_url = ? WHERE id = ?`,
            [titre, auteur, description || "", newImage || oldImage, id],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "✏️ Livre mis à jour avec succès" });
            }
        );
    });
});

/* ==============================
   🗑 Supprimer un document (DELETE)
   ============================== */
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.query("SELECT image_url FROM documents WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Livre non trouvé" });

        const imageToDelete = results[0].image_url;

        if (imageToDelete) {
            const imagePath = `./public/images/${imageToDelete}`;
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        db.query("DELETE FROM documents WHERE id = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "🗑 Livre supprimé avec succès" });
        });
    });
});

/* ==============================
   📖 Récupérer un document spécifique (READ)
   ============================== */
router.get("/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        `SELECT d.id, d.titre, d.auteur, d.description, d.image_url, c.nom AS categorie
         FROM documents d
         JOIN categories c ON d.id_categorie = c.id
         WHERE d.id = ?`,
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ error: "Livre non trouvé" });
            res.json(results[0]);
        }
    );
});

module.exports = router;
