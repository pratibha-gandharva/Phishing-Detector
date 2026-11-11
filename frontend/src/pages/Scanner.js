import { useState } from "react";
import toast from "react-hot-toast";
import API from "../utils/api";
import ScanResult from "../components/ScanResult";

export default function Scanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    if (!url.trim()) {
      toast.error("Enter a URL to scan");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data } = await API.post("/scan", {
        url: url.trim(),
      });

      setResult(data);

      const msg =
        data.risk === "HIGH"
          ? "High-risk URL detected!"
          : data.risk === "MEDIUM"
          ? "Medium-risk URL"
          : "URL appears safe";

      toast(msg, {
        duration: 3000,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Scan failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="scanner-header">
        <h1>PhishGuard</h1>
        <p>Detect phishing & malicious URLs instantly</p>
      </div>

      {/* URL Scanner */}
      <div className="card">
        <div className="card-title">// URL Scanner</div>

        <div className="scan-input-wrapper">
          <input
            className="scan-input"
            type="text"
            placeholder="https://suspicious-site.com/login"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleScan();
              }
            }}
          />

          <button
            className="btn-scan"
            onClick={handleScan}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner" />
            ) : (
              "Scan"
            )}
          </button>
        </div>
      </div>

      {/* Scanning Animation */}
      {loading && (
        <div className="card scanning-anim">
          <div
            style={{
              fontSize: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            Analyzing URL
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>

          <div>
            Running heuristics · Checking patterns · Querying threat intel
          </div>
        </div>
      )}

      {/* Scan Result */}
      {result && <ScanResult result={result} />}

      {/* How It Works */}
      {!result && !loading && (
        <div className="card">
          <div className="card-title">// How It Works</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                icon: "🔍",
                title: "Heuristic Analysis",
                desc: "Checks IP URLs, suspicious keywords, TLDs, encoding & more",
              },
              {
                icon: "🛡️",
                title: "URL Structure Analysis",
                desc: "Analyzes URL structure for obfuscation and spoofing patterns",
              },
              {
                icon: "☁️",
                title: "VirusTotal (optional)",
                desc: "Cross-references threat intelligence when API key is configured",
              },
              {
                icon: "📊",
                title: "Risk Scoring",
                desc: "Combines all signals into a 0–100 risk score with findings",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "1rem",
                  background: "var(--bg-secondary)",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.icon}
                </div>

                <div
                  style={{
                    fontWeight: "700",
                    marginBottom: "0.3rem",
                    fontSize: "1rem",
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    color: "#5a6a88",
                    fontSize: "0.85rem",
                    lineHeight: "1.5",
                  }}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}