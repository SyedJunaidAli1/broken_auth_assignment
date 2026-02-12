# Broken Authentication Flow – Debug & Fix Assignment

This project is a fixed and improved version of the intentionally broken authentication server provided in the assignment.  
The objective was to debug the authentication flow, identify security flaws, and implement production-aware improvements.

---

## 🚀 Setup Instructions

```bash
npm install
npm start
```

Server runs on:

```
http://localhost:3000
```

---

## 🔐 Authentication Flow

The authentication system follows a session + JWT based approach:

### 1️⃣ Login

```
POST /auth/login
```

- Accepts email and password
- Generates a temporary login session
- Creates a 6-digit OTP (logged in console for testing)

---

### 2️⃣ Verify OTP

```
POST /auth/verify-otp
```

- Validates OTP and session expiry
- Sets a secure HTTP-only cookie (`session_token`)

---

### 3️⃣ Generate Access Token

```
POST /auth/token
```

- Reads session from cookie
- Issues a JWT access token valid for 15 minutes

---

### 4️⃣ Access Protected Route

```
GET /protected
```

**Headers:**

```
Authorization: Bearer <access_token>
```

Successful authentication returns the protected flag.

---

## 🛠 Issues Identified & Fixed

### ✅ Middleware Blocking Requests

- Logger middleware was missing `next()`, causing requests to hang.
- Auth middleware also lacked `next()` after successful verification.

**Fix:** Ensured proper middleware chaining.

---

### ✅ Broken Session Lookup

- Token route referenced an undefined variable, breaking authentication.

**Fix:** Corrected session retrieval using the cookie-based session token.

---

### ✅ Cookie Parser Not Used

- `cookie-parser` was imported but never initialized.

**Fix:** Added middleware to correctly parse cookies.

---

### ✅ Insecure JWT Secret Fallback

- The server allowed a default secret if `JWT_SECRET` was missing.

**Fix:** Enforced environment variable validation at startup.

---

### ✅ Predictable Session IDs

- Sessions were generated using `Math.random()`, which is not secure.

**Fix:** Replaced with cryptographically secure IDs using Node.js `crypto`.

---

### ✅ Expired Sessions Not Cleaned

- Old sessions remained in memory.

**Fix:** Added cleanup when sessions expire.

---

### ✅ Improved Cookie Security

Added protective flags:

- `httpOnly`
- `secure` (production)
- `sameSite: strict`
- expiration via `maxAge`

---

## 🔒 Security Improvements

- Enforced JWT secret validation
- Secure session generation
- Hardened cookie configuration
- Proper authentication middleware flow
- Prevented unauthorized route access

---

## 📄 Environment Variables

Create a `.env` file:

```
PORT=3000
APPLICATION_SECRET=
JWT_SECRET=your_super_secret_key
```

⚠️ `.env` is ignored via `.gitignore`.

---

## ⏱ Time Taken

~2 hours

---
