require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const scanRoutes = require("./routes/scan");
const historyRoutes = require("./routes/history");

const app = express();

// ── Security Middleware ──────────────────────────────
app.use(helmet());
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Global rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." }
}));

// Stricter limiter for scan endpoint
const scanLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Scan rate limit exceeded. Max 20 scans/minute." }
});

// ── Routes ───────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/scan", scanLimiter, scanRoutes);
app.use("/api/history", historyRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start (no MongoDB needed) ─────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
