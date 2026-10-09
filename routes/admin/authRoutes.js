const express = require("express");

const router = express.Router();

const {
  showLogin,
  login,
  logout,
} = require("../../controllers/admin/authController");

const guestMiddleware = require("../../middleware/admin/guestMiddleware");
const authMiddleware = require("../../middleware/admin/authMiddleware");
const rateLimit = require("../../middleware/rateLimit");
const { ADMIN_LOGIN_PATH } = require("../../config/adminAuth");

// Rate limit: 15 minutes window, max 5 attempts per IP to prevent brute force
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again later.",
});

// ========================================
// Security: Block predictable /admin/login endpoint (Return 404)
// ========================================

router.all("/login", (req, res) => {
  return res.status(404).render("error", {
    title: "404",
    message: "Page not found",
  });
});

// ========================================
// Secret Admin Login Page: /admin/pallavipal/main/login
// ========================================

router.get(
  ADMIN_LOGIN_PATH,
  guestMiddleware,
  showLogin
);

// Compatibility alias for legacy admin route
router.get("/nishadaarakshansankalp/main/login", (req, res) => {
  res.redirect(`/admin${ADMIN_LOGIN_PATH}`);
});

// ========================================
// Secret Admin Login Submit (POST)
// ========================================

router.post(
  ADMIN_LOGIN_PATH,
  guestMiddleware,
  loginRateLimit,
  login
);

// ========================================
// Admin Logout
// ========================================

router.post(
  "/logout",
  authMiddleware,
  logout
);

module.exports = router;
