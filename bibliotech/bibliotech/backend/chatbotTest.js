// 📦 Nécessite axios (npm install axios)
const axios = require("axios");

// 🧪 Test du chatbot OpenAI via l'API Express locale
(async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/chatbot", {
      message: "Bonjour, que peux-tu faire ?"
    });

    console.log("✅ Réponse IA :", res.data.reply);
  } catch (err) {
    console.error("❌ Erreur reçue :");

    // Affichage détaillé selon le type d'erreur
    if (err.response) {
      console.log("➡️ Status HTTP :", err.response.status);
      console.log("📨 Message retourné :", err.response.data);
    } else {
      console.log("🛑 Message d'erreur :", err.message);
    }
  }
})();
