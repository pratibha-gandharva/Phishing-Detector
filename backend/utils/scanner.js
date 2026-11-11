const axios = require("axios");
const { URL } = require("url");

// ── Suspicious patterns ──────────────────────────────

const SUSPICIOUS_KEYWORDS = [
  "login",
  "signin",
  "verify",
  "secure",
  "account",
  "update",
  "banking",
  "confirm",
  "password",
  "credential",
  "wallet",
  "crypto",
  "free",
  "prize",
  "winner",
  "urgent",
  "alert",
  "suspended"
];

// Brand names that can be abused for impersonation
const BRAND_NAMES = [
  "paypal",
  "amazon",
  "apple",
  "microsoft",
  "google",
  "netflix"
];

// Legitimate domains for the brands above
const TRUSTED_BRAND_DOMAINS = {
  paypal: ["paypal.com"],
  amazon: ["amazon.com"],
  apple: ["apple.com"],
  microsoft: ["microsoft.com"],
  google: ["google.com"],
  netflix: ["netflix.com"]
};

const SUSPICIOUS_TLDS = [
  ".tk",
  ".ml",
  ".ga",
  ".cf",
  ".gq",
  ".xyz",
  ".top",
  ".club",
  ".work",
  ".date",
  ".loan",
  ".download",
  ".stream",
  ".gdn"
];

const IP_URL_REGEX = /^https?:\/\/(\d{1,3}\.){3}\d{1,3}/;
const LONG_SUBDOMAIN_REGEX = /([a-z0-9-]+\.){4,}/i;
const HEX_ENCODED_REGEX = /%[0-9a-f]{2}/gi;
const AT_SYMBOL_REGEX = /@/;
const DOUBLE_SLASH_REDIRECT = /\/\//g;


// ── Heuristic Analyzer ───────────────────────────────

function analyzeHeuristics(urlString) {
  const findings = [];
  const scores = [];

  let parsed;

  try {
    parsed = new URL(urlString);
  } catch {
    return {
      score: 100,
      findings: ["Invalid or malformed URL"],
      risk: "HIGH"
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const fullUrl = urlString.toLowerCase();

  // ───────────────────────────────────────────────────
  // 1. IP address instead of domain
  // ───────────────────────────────────────────────────

  if (IP_URL_REGEX.test(urlString)) {
    findings.push(
      "⚠️ URL uses IP address instead of a domain name"
    );

    scores.push(40);
  }


  // ───────────────────────────────────────────────────
  // 2. Excessive subdomains
  // ───────────────────────────────────────────────────

  if (LONG_SUBDOMAIN_REGEX.test(hostname)) {
    findings.push(
      "⚠️ Excessive subdomain depth (common in spoofed URLs)"
    );

    scores.push(25);
  }


  // ───────────────────────────────────────────────────
  // 3. Suspicious TLD
  // ───────────────────────────────────────────────────

  const matchedTld = SUSPICIOUS_TLDS.find((tld) =>
    hostname.endsWith(tld)
  );

  if (matchedTld) {
    findings.push(
      `⚠️ Suspicious TLD detected: ${matchedTld}`
    );

    scores.push(20);
  }


  // ───────────────────────────────────────────────────
  // 4. HTTP instead of HTTPS
  // ───────────────────────────────────────────────────

  if (parsed.protocol === "http:") {
    findings.push(
      "⚠️ Insecure protocol (HTTP, not HTTPS)"
    );

    scores.push(15);
  }


  // ───────────────────────────────────────────────────
  // 5. Suspicious keywords
  // ───────────────────────────────────────────────────

  const foundKeywords = SUSPICIOUS_KEYWORDS.filter((keyword) =>
    fullUrl.includes(keyword)
  );

  if (foundKeywords.length >= 3) {
    findings.push(
      `⚠️ Multiple suspicious keywords: ${foundKeywords
        .slice(0, 5)
        .join(", ")}`
    );

    scores.push(30);

  } else if (foundKeywords.length > 0) {
    findings.push(
      `ℹ️ Suspicious keywords found: ${foundKeywords.join(", ")}`
    );

    scores.push(10 * foundKeywords.length);
  }


  // ───────────────────────────────────────────────────
  // 5b. Brand impersonation detection
  // ───────────────────────────────────────────────────

  const foundBrands = BRAND_NAMES.filter((brand) =>
    fullUrl.includes(brand)
  );

  const suspiciousBrands = foundBrands.filter((brand) => {
    const trustedDomains = TRUSTED_BRAND_DOMAINS[brand];

    const isTrustedDomain = trustedDomains.some(
      (domain) =>
        hostname === domain ||
        hostname.endsWith("." + domain)
    );

    return !isTrustedDomain;
  });

  if (suspiciousBrands.length > 0) {
    findings.push(
      `⚠️ Possible brand impersonation: ${suspiciousBrands.join(", ")}`
    );

    scores.push(20);
  }


  // ───────────────────────────────────────────────────
  // 6. URL length
  // ───────────────────────────────────────────────────

  if (urlString.length > 100) {
    findings.push(
      `⚠️ Unusually long URL (${urlString.length} chars)`
    );

    scores.push(15);
  }


  // ───────────────────────────────────────────────────
  // 7. @ symbol
  // ───────────────────────────────────────────────────

  if (AT_SYMBOL_REGEX.test(urlString)) {
    findings.push(
      "⚠️ '@' symbol in URL — may redirect browser to a different host"
    );

    scores.push(35);
  }


  // ───────────────────────────────────────────────────
  // 8. Heavy URL encoding
  // ───────────────────────────────────────────────────

  const hexMatches =
    fullUrl.match(HEX_ENCODED_REGEX) || [];

  if (hexMatches.length > 5) {
    findings.push(
      "⚠️ Heavy URL encoding (possible obfuscation)"
    );

    scores.push(20);
  }


  // ───────────────────────────────────────────────────
  // 9. Multiple double-slashes
  // ───────────────────────────────────────────────────

  const slashes =
    (fullUrl.match(DOUBLE_SLASH_REDIRECT) || []).length;

  // One // is normal for https:// or http://
  // More than two can be suspicious.
  if (slashes > 2) {
    findings.push(
      "⚠️ Multiple double-slashes (possible redirect chaining)"
    );

    scores.push(15);
  }


  // ───────────────────────────────────────────────────
  // 10. Excessive hyphens
  // ───────────────────────────────────────────────────

  const hyphenCount =
    (hostname.match(/-/g) || []).length;

  if (hyphenCount > 3) {
    findings.push(
      "⚠️ Excessive hyphens in domain (spoofing indicator)"
    );

    scores.push(20);
  }


  // ───────────────────────────────────────────────────
  // 11. Long domain
  // ───────────────────────────────────────────────────

  if (hostname.length > 30) {
    findings.push(
      `⚠️ Long domain name (${hostname.length} chars)`
    );

    scores.push(10);
  }


  // ───────────────────────────────────────────────────
  // Calculate final heuristic score
  // ───────────────────────────────────────────────────

  const totalScore = Math.min(
    scores.reduce((a, b) => a + b, 0),
    100
  );

  const risk =
    totalScore >= 60
      ? "HIGH"
      : totalScore >= 30
      ? "MEDIUM"
      : "LOW";


  // If nothing suspicious was detected
  if (findings.length === 0) {
    findings.push(
      "✅ No obvious heuristic red flags detected"
    );
  }

  return {
    score: totalScore,
    findings,
    risk
  };
}


// ── VirusTotal Check ─────────────────────────────────

async function checkVirusTotal(urlString) {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;

  // VirusTotal is optional
  if (
    !apiKey ||
    apiKey === "your_virustotal_api_key_here"
  ) {
    return {
      available: false,
      message: "VirusTotal API key not configured"
    };
  }

  try {

    // Submit URL for analysis
    const submitRes = await axios.post(
      "https://www.virustotal.com/api/v3/urls",
      new URLSearchParams({
        url: urlString
      }),
      {
        headers: {
          "x-apikey": apiKey,
          "Content-Type":
            "application/x-www-form-urlencoded"
        },

        timeout: 10000
      }
    );

    const analysisId =
      submitRes.data.data.id;


    // Wait briefly before checking results
    await new Promise((resolve) =>
      setTimeout(resolve, 2000)
    );


    // Fetch analysis results
    const resultRes = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: {
          "x-apikey": apiKey
        },

        timeout: 10000
      }
    );


    const stats =
      resultRes.data.data.attributes.stats;


    return {
      available: true,

      malicious: stats.malicious || 0,

      suspicious: stats.suspicious || 0,

      harmless: stats.harmless || 0,

      undetected: stats.undetected || 0,

      total: Object.values(stats).reduce(
        (a, b) => a + b,
        0
      )
    };

  } catch (err) {

    return {
      available: false,
      message:
        "VirusTotal check failed: " +
        err.message
    };
  }
}


// ── Main Scan Function ───────────────────────────────

async function scanUrl(urlString) {

  const startTime = Date.now();


  // ───────────────────────────────────────────────────
  // Normalize URL
  // ───────────────────────────────────────────────────

  let normalizedUrl =
    urlString.trim();

  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl =
      "http://" + normalizedUrl;
  }


  // ───────────────────────────────────────────────────
  // Run heuristic analysis
  // ───────────────────────────────────────────────────

  const heuristics =
    analyzeHeuristics(normalizedUrl);


  // ───────────────────────────────────────────────────
  // Run VirusTotal analysis
  // ───────────────────────────────────────────────────

  const vtResult =
    await checkVirusTotal(normalizedUrl);


  // ───────────────────────────────────────────────────
  // Combine scores
  // ───────────────────────────────────────────────────

  let finalScore =
    heuristics.score;

  const vtFindings = [];


  if (vtResult.available) {

    // VirusTotal malicious detections
    if (vtResult.malicious > 0) {

      finalScore = Math.min(
        100,
        finalScore +
          vtResult.malicious * 10
      );

      vtFindings.push(
        `🔴 ${vtResult.malicious}/${vtResult.total} AV engines flagged as MALICIOUS`
      );
    }


    // VirusTotal suspicious detections
    if (vtResult.suspicious > 0) {

      finalScore = Math.min(
        100,
        finalScore +
          vtResult.suspicious * 5
      );

      vtFindings.push(
        `🟡 ${vtResult.suspicious}/${vtResult.total} AV engines flagged as SUSPICIOUS`
      );
    }


    // No malicious/suspicious detections
    if (
      vtResult.malicious === 0 &&
      vtResult.suspicious === 0
    ) {

      vtFindings.push(
        `✅ Clean on VirusTotal (${vtResult.harmless} engines say harmless)`
      );

      finalScore =
        Math.max(
          0,
          finalScore - 10
        );
    }
  }


  // ───────────────────────────────────────────────────
  // Final risk classification
  // ───────────────────────────────────────────────────

  const finalRisk =
    finalScore >= 60
      ? "HIGH"
      : finalScore >= 30
      ? "MEDIUM"
      : "LOW";


  // ───────────────────────────────────────────────────
  // Return complete scan result
  // ───────────────────────────────────────────────────

  return {

    url: normalizedUrl,

    risk: finalRisk,

    score: finalScore,

    heuristics: {
      score: heuristics.score,
      findings: heuristics.findings
    },

    virusTotal: {
      ...vtResult,
      findings: vtFindings
    },

    allFindings: [
      ...heuristics.findings,
      ...vtFindings
    ],

    scanDuration:
      Date.now() - startTime,

    scannedAt:
      new Date().toISOString()
  };
}


// ── Export ───────────────────────────────────────────

module.exports = {
  scanUrl
};