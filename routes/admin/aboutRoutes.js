const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/admin/authMiddleware");
const aboutController = require("../../controllers/admin/aboutController");
const aboutUpload = require("../../middleware/about/aboutUpload");

// All admin routes require authentication
router.use(authMiddleware);

// Main dashboard / tabbed interface
router.get("/", aboutController.getAboutManager);

// Profile, Bio, Position
router.post("/profile", aboutUpload.any(), aboutController.postUpdateProfile);
router.post("/bio", aboutController.postUpdateBio);
router.post("/position", aboutController.postUpdatePosition);

// Education CRUD
router.post("/education/add", aboutController.postAddEducation);
router.post("/education/edit/:id", aboutController.postEditEducation);
router.post("/education/delete/:id", aboutController.postDeleteEducation);

// Political Career CRUD
router.post("/career/add", aboutController.postAddCareer);
router.post("/career/edit/:id", aboutController.postEditCareer);
router.post("/career/delete/:id", aboutController.postDeleteCareer);

// Samajwadi Party Posts CRUD
router.post("/party-posts/add", aboutController.postAddPartyPost);
router.post("/party-posts/edit/:id", aboutController.postEditPartyPost);
router.post("/party-posts/delete/:id", aboutController.postDeletePartyPost);

// Achievements CRUD
router.post("/achievements/add", aboutController.postAddAchievement);
router.post("/achievements/edit/:id", aboutController.postEditAchievement);
router.post("/achievements/delete/:id", aboutController.postDeleteAchievement);

// Social Work CRUD
router.post("/social-work/add", aboutController.postAddSocialWork);
router.post("/social-work/edit/:id", aboutController.postEditSocialWork);
router.post("/social-work/delete/:id", aboutController.postDeleteSocialWork);

// Gallery CRUD
router.post("/gallery/add", aboutUpload.single("photoFile"), aboutController.postAddGalleryPhoto);
router.post("/gallery/edit/:id", aboutUpload.single("photoFile"), aboutController.postEditGalleryPhoto);
router.post("/gallery/delete/:id", aboutController.postDeleteGalleryPhoto);

// Social Media Links CRUD
router.post("/social-links/add", aboutController.postAddSocialLink);
router.post("/social-links/edit/:id", aboutController.postEditSocialLink);
router.post("/social-links/delete/:id", aboutController.postDeleteSocialLink);

module.exports = router;
