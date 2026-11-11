#  PhishGuard — Phishing Detector

A full-stack web application that analyzes URLs for potential phishing threats using **heuristic security checks** and generates a risk score with detailed findings.

##  Features

- 🔍 URL phishing detection
-  Risk score and `LOW / MEDIUM / HIGH` classification
-  Heuristic URL analysis
-  Brand impersonation detection
-  User authentication
-  Scan history
-  Rate limiting and input validation
-  React-based web interface

##  Tech Stack

**Frontend:** React.js, React Router, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB + Mongoose  
**Security:** JWT, bcrypt, Helmet, CORS, Rate Limiting

##  Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend: `http://localhost:3001`  
Backend: `http://localhost:5000`

##  Example

```text
Input:
http://secure-login-paypal.xyz/verify-account

Result:
Risk Level: HIGH
Risk Score: 85
```

##  Future Improvements

- Machine-learning-based detection
- Browser extension
- Email phishing detection
- WHOIS/domain analysis
- Bulk URL scanning

## ⚠️ Disclaimer

This project is intended for **educational and authorized security-testing purposes only**. Detection results are heuristic assessments and should not be considered absolute proof that a URL is safe or malicious.

##  Author

**Pratibha Gandharva**  
B.Tech — Data Science & Artificial Intelligence, IIIT Naya Raipur

[GitHub](https://github.com/pratibha-gandharva) • [LinkedIn](https://linkedin.com/in/pratibha-gandharva)