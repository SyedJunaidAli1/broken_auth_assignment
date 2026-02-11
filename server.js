const express = require("express");
const requestLogger = require("./middleware/logger");
const { generateToken } = require("./utils/tokenGenerator");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(requestLogger);

// THE BUG: Missing built-in body parsing middleware.
// app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    challenge: "The Silent Server",
    instruction:
      "POST /token with JSON body { \"email\": \"candidate@gmail.com\" }",
  });
});

app.post("/token", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const hash = await generateToken(email);

    return res.status(200).json({
      status: "success",
      token: `BE-DEV-7721-${hash || ""}`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Token generation failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Silent Server running at http://localhost:${PORT}`);
});
