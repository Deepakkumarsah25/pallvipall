const HeroSlide = require("../../models/HeroSlide");
const Initiative = require("../../models/Initiative");
const WhyChoose = require("../../models/WhyChoose");
const SiteNotice = require("../../models/SiteNotice");
const HomeQuickInfo = require("../../models/HomeQuickInfo");
const InitiativeInquiry = require("../../models/InitiativeInquiry");
const SankalpPhoto = require("../../models/SankalpPhoto");
const SocialPost = require("../../models/SocialPost");

exports.getHomeDashboard = async (req, res) => {
  try {
    const [
      heroSlidesCount,
      initiativesCount,
      whyChooseDoc,
      noticesCount,
      inquiriesCount,
      newInquiriesCount,
      photosCount,
      socialCount,
    ] = await Promise.all([
      HeroSlide.countDocuments(),
      Initiative.countDocuments(),
      WhyChoose.findOne(),
      SiteNotice.countDocuments(),
      InitiativeInquiry.countDocuments(),
      InitiativeInquiry.countDocuments({ status: "new" }),
      SankalpPhoto.countDocuments(),
      SocialPost.countDocuments({ active: true }).catch(() => 0),
    ]);

    const pillarsCount = whyChooseDoc?.pillars?.length || 0;

    res.render("admin/home/index", {
      title: "Home Page Management",
      admin: req.session.admin,
      stats: {
        heroSlidesCount,
        initiativesCount,
        pillarsCount,
        noticesCount,
        inquiriesCount,
        newInquiriesCount,
        photosCount,
        socialCount,
      },
      currentPath: "/admin/home",
    });
  } catch (error) {
    console.error("Home manager error:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load Home Page Manager.",
    });
  }
};
