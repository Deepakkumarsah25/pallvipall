const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/admin/authMiddleware");
const adminSocialController = require("../../controllers/admin/socialController");

// All admin social routes require admin authentication
router.use(authMiddleware);

// Main dashboard / list page
router.get("/", adminSocialController.index);

// Post creation & management
router.post("/create", adminSocialController.createPost);
router.get("/edit/:id", adminSocialController.editPostPage);
router.post("/edit/:id", adminSocialController.updatePost);
router.post("/delete/:id", adminSocialController.deletePost);
router.post("/toggle/:id", adminSocialController.togglePost);

// Link accounts & autofetch
router.post("/config", adminSocialController.saveConfig);
router.post("/autofetch", adminSocialController.triggerAutoFetch);

module.exports = router;

