const mysql = require("mysql");

require("dotenv").config();

const db = mysql.createConnection({

    host: process.env.DB_HOST || "localhost",

    user: process.env.DB_USER || "root",

    password: process.env.DB_PASSWORD || "",

    database: process.env.DB_NAME || "biblio_db",

    port: process.env.DB_PORT || 3307 // ✅ ajoute ou vérifie cette ligne

});

db.connect((err) => {

    if (err) {

        console.error("❌ Erreur de connexion :", err);

    } else {

        console.log("✅ Connecté à la base de données MySQL !");

    }

});

module.exports = db;