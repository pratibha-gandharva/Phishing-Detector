const express = require("express");
const { scanUrl } = require("../utils/scanner");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string")
      return res.status(400).json({ error: "URL is required" });

    if (url.length > 2000)
      return res.status(400).json({ error: "URL too long" });

    const result = await scanUrl(url);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
