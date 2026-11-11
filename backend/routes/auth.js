const express = require("express");
const router = express.Router();

// Auth disabled (no MongoDB) - Scanner still works fine!
router.post("/register", (req, res) => {
  res.status(503).json({ error: "Auth unavailable (no database). Scanner still works!" });
});

router.post("/login", (req, res) => {
  res.status(503).json({ error: "Auth unavailable (no database). Scanner still works!" });
});

module.exports = router;
