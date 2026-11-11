const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  url:      { type: String, required: true },
  risk:     { type: String, enum: ["LOW", "MEDIUM", "HIGH"], required: true },
  score:    { type: Number, required: true },
  findings: [String],
  virusTotal: { type: Object },
  scanDuration: Number,
  scannedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Scan", scanSchema);
