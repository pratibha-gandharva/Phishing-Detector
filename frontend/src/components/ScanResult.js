export default function ScanResult({ result }) {
  const { url, risk, score, heuristics, virusTotal, allFindings, scanDuration, scannedAt } = result;

  return (
    <div className="card" style={{ animation: "fadeIn 0.4s ease" }}>
      <div className="card-title">// Scan Result</div>

      {/* Risk Badge + Score Bar */}
      <div className="result-risk">
        <div className={`risk-badge risk-${risk}`}>{risk}</div>
        <div className="score-bar-wrapper">
          <div className="score-label">Risk Score: {score}/100</div>
          <div className="score-bar-bg">
            <div
              className={`score-bar-fill fill-${risk}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* URL */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.75rem", color: "#5a6a88", fontFamily: "var(--font-mono)", letterSpacing: "2px", marginBottom: "0.4rem" }}>TARGET URL</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#00e5ff", wordBreak: "break-all" }}>{url}</div>
      </div>

      {/* Findings */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.75rem", color: "#5a6a88", fontFamily: "var(--font-mono)", letterSpacing: "2px", marginBottom: "0.8rem" }}>
          ANALYSIS FINDINGS ({allFindings.length})
        </div>
        <ul className="findings-list">
          {allFindings.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      </div>

      {/* VirusTotal section */}
      {virusTotal?.available && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.75rem", color: "#5a6a88", fontFamily: "var(--font-mono)", letterSpacing: "2px", marginBottom: "0.8rem" }}>
            VIRUSTOTAL ENGINES
          </div>
          <div style={{ display: "flex", gap: "1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
            <span style={{ color: "#ff3860" }}>🔴 Malicious: {virusTotal.malicious}</span>
            <span style={{ color: "#ffdd57" }}>🟡 Suspicious: {virusTotal.suspicious}</span>
            <span style={{ color: "#00ff88" }}>🟢 Harmless: {virusTotal.harmless}</span>
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="scan-meta">
        <span>⏱ {scanDuration}ms</span>
        <span>📅 {new Date(scannedAt).toLocaleString()}</span>
        <span>🔍 Heuristic score: {heuristics.score}</span>
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}
