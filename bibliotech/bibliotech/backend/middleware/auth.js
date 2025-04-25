const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");

// 📌 Route de connexion
router.post("/login", (req, res) => {
    const { id_unique, mot_de_passe } = req.body;

    if (!id_unique || !mot_de_passe) {
        return res.status(400).json({ error: "Veuillez remplir tous les champs." });
    }

    db.query("SELECT * FROM users WHERE id_unique = ?", [id_unique], (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur de serveur." });
        if (results.length === 0) return res.status(401).json({ error: "Identifiants incorrects." });

        const user = results[0];

        bcrypt.compare(mot_de_passe, user.mot_de_passe, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "Erreur lors de la vérification du mot de passe." });
            if (!isMatch) return res.status(401).json({ error: "Identifiants incorrects." });

            res.status(200).json({ message: "Connexion réussie", user });
        });
    });
});

module.exports = router;
