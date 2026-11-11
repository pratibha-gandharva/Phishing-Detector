import { useState, useEffect } from "react";
import API from "../utils/api";

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/history")
      .then(r => setScans(r.data))
      .catch(() => setScans([]))
      .finally(() => setLoading(false));
  }, []);

  const riskColor = { HIGH: "#ff3860", MEDIUM: "#ffdd57", LOW: "#00ff88" };
  const riskBg    = { HIGH: "rgba(255,56,96,0.1)", MEDIUM: "rgba(255,221,87,0.1)", LOW: "rgba(0,255,136,0.1)" };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: "var(--accent-cyan)" }}>
          Scan History
        </h2>
        <p style={{ color: "#5a6a88", marginTop: "0.3rem" }}>Your last 50 URL scans</p>
      </div>

      <div className="card">
        <div className="card-title">// Recent Scans ({scans.length})</div>
        {loading && <div className="empty-state">Loading history...</div>}
        {!loading && scans.length === 0 && (
          <div className="empty-state">No scans yet. Go scan some URLs!</div>
        )}
        {scans.map((scan, i) => (
          <div key={i} className="history-item">
            <div className="history-url" title={scan.url}>{scan.url}</div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <span className="history-meta">{scan.score}/100</span>
              <span
                className="risk-pill"
                style={{ color: riskColor[scan.risk], background: riskBg[scan.risk], border: `1px solid ${riskColor[scan.risk]}` }}
              >
                {scan.risk}
              </span>
              <span className="history-meta">{new Date(scan.scannedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
