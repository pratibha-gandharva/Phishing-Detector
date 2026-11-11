const express = require("express");
const router = express.Router();

// History disabled (no MongoDB) - returns empty responses
router.get("/",       (req, res) => res.json([]));
router.get("/recent", (req, res) => res.json([]));
router.get("/stats",  (req, res) => res.json({ total: 0, high: 0, medium: 0, low: 0 }));

module.exports = router;
