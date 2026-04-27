const express = require("express");
const router = express.Router();

const subscribers = [];

// POST /api/newsletter/subscribe — body: { email }
router.post("/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@") || !email.includes("."))
    return res.status(400).json({ success: false, message: "Please provide a valid email address." });

  const normalizedEmail = email.toLowerCase().trim();

  if (subscribers.includes(normalizedEmail))
    return res.status(409).json({ success: false, message: "You're already subscribed! 🎉" });

  subscribers.push(normalizedEmail);
  console.log(`📧 New subscriber: ${normalizedEmail} | Total: ${subscribers.length}`);

  res.json({ success: true, message: "Thank you for subscribing to Kezi Bakes! 🍰" });
});

// GET /api/newsletter/subscribers — admin view
router.get("/subscribers", (req, res) => {
  res.json({ success: true, count: subscribers.length, subscribers });
});

module.exports = router;