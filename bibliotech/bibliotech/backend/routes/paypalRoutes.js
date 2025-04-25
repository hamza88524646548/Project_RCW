const express = require('express');
const router = express.Router();
const { client } = require('../config/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

router.post("/create-payment", async (req, res) => {
  const { montant } = req.body;

  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'CAD',
        value: montant.toFixed(2)
      }
    }]
  });

  try {
    const order = await client().execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error("Erreur PayPal :", err);
    res.status(500).json({ error: "Erreur création paiement PayPal" });
  }
});

module.exports = router;
