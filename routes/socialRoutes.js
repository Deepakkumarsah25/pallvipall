const express = require("express");
const router = express.Router();
const socialController = require("../controllers/socialController");
const rateLimit = require("../middleware/rateLimit");

const publicSocialRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: "Too many social requests. Please try again shortly.",
});

// Public Social Feed
router.get("/social", publicSocialRateLimit, socialController.getSocialPage);

// Public API endpoints
router.get("/api/social/posts", publicSocialRateLimit, socialController.apiGetPosts);
router.post("/api/social/sync", socialController.syncPosts);

module.exports = router;

