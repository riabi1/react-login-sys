const express = require("express");
const {
  register,
  login,
  validateAuth,
  logout,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Rate Limiter for Login
const rateLimit = require("express-rate-limit");
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again after 1 minute.",
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/validate", authMiddleware, validateAuth); // New route for validation
router.post("/logout", authMiddleware, logout); // Add logout route

module.exports = router;
