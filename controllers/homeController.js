const HeroSlide = require("../models/HeroSlide");
const Initiative = require("../models/Initiative");
const WhyChoose = require("../models/WhyChoose");
const SiteNotice = require("../models/SiteNotice");
const HomeQuickInfo = require("../models/HomeQuickInfo");
const HomeAbout = require("../models/HomeAbout");
const InitiativeInquiry = require("../models/InitiativeInquiry");
const SankalpPhoto = require("../models/SankalpPhoto");
const {
  defaultHeroSlides,
  defaultInitiatives,
  defaultWhyChoose,
  defaultNotices,
  defaultQuickInfo,
} = require("../scripts/seedHomeData");
const { defaultGalleryPhotos } = require("../scripts/seedGalleryData");

// Public Home Page
exports.getHomePage = async (req, res) => {
  try {
    const [heroSlides, initiatives, whyChooseDoc, notices, quickInfoDoc, galleryPhotos, homeAboutDoc] =
      await Promise.all([
        HeroSlide.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).limit(10),
        Initiative.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).limit(24),
        WhyChoose.findOne(),
        SiteNotice.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).limit(20),
        HomeQuickInfo.findOne(),
        SankalpPhoto.find({ isPublished: true }).sort({ order: 1, date: -1 }).limit(10),
        HomeAbout.findOne(),
      ]);

    // Fallbacks if database is completely empty or just initialized
    const finalHeroSlides =
      heroSlides && heroSlides.length > 0 ? heroSlides : defaultHeroSlides;
    const finalInitiatives =
      initiatives && initiatives.length > 0 ? initiatives : defaultInitiatives;
    const finalWhyChoose = whyChooseDoc || defaultWhyChoose;
    const finalNotices =
      notices && notices.length > 0 ? notices : defaultNotices;
    const finalQuickInfo = quickInfoDoc || defaultQuickInfo;
    const finalHomeAbout = homeAboutDoc || (HomeAbout.defaultData || {});
    const finalGalleryPhotos =
      galleryPhotos && galleryPhotos.length > 0 ? galleryPhotos : defaultGalleryPhotos.slice(0, 10);

    // Convert initiatives to client-side modal dictionary
    const initiativesModalMap = {};
    finalInitiatives.forEach((item) => {
      initiativesModalMap[item.key] = {
        tag: item.modalTag || item.cardTag,
        title: item.modalTitle || item.title,
        description: item.modalDescription || item.description,
        highlights:
          item.modalHighlights && item.modalHighlights.length > 0
            ? item.modalHighlights
            : item.points || [],
        helplineText: item.helplineText || finalQuickInfo.helplineText,
        helplineTel: item.helplineTel || finalQuickInfo.helplineTel,
        formTitle: item.formTitle || "Registration & Support Form",
        formSubmitText: item.formSubmitText || "Send Support Request",
      };
    });

    res.render("index", {
      title: "पल्लवी पाल | आधिकारिक वेबसाइट",
      metaDescription: "पल्लवी पाल - जनसेवा, सामाजिक न्याय, किसान व युवा सशक्तिकरण और जनकल्याणकारी पहलों का आधिकारिक पोर्टल।",
      heroSlides: finalHeroSlides,
      initiatives: finalInitiatives,
      initiativesModalMap,
      whyChoose: finalWhyChoose,
      notices: finalNotices,
      quickInfo: finalQuickInfo,
      galleryPhotos: finalGalleryPhotos,
      homeAbout: finalHomeAbout,
      latestVideos: [],
      highlightVideo: null,
      highlightNews: null,
      homeNewsList: [],
    });
  } catch (error) {
    console.error("Home page render error:", error);
    res.render("index", {
      title: "पल्लवी पाल | आधिकारिक वेबसाइट",
      metaDescription: "पल्लवी पाल - जनसेवा, सामाजिक न्याय, किसान व युवा सशक्तिकरण और जनकल्याणकारी पहलों का आधिकारिक पोर्टल।",
      heroSlides: defaultHeroSlides,
      initiatives: defaultInitiatives,
      initiativesModalMap: {},
      whyChoose: defaultWhyChoose,
      notices: defaultNotices,
      quickInfo: defaultQuickInfo,
      galleryPhotos: defaultGalleryPhotos.slice(0, 10),
      homeAbout: HomeAbout.defaultData || {},
      latestVideos: [],
      highlightVideo: null,
      highlightNews: null,
      homeNewsList: [],
    });
  }
};

// Handle Sidebar Pledge Submission
exports.submitPledge = async (req, res) => {
  try {
    const { name, phone, district } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and Phone required" });
    }

    const inquiry = await InitiativeInquiry.create({
      type: "pledge",
      category: "Online Pledge",
      name: name.trim(),
      phone: phone.trim(),
      district: district ? district.trim() : "",
      message: "Online pledge submitted via website sidebar.",
      status: "new",
    });

    res.json({
      success: true,
      message: "Your pledge has been successfully registered.",
      id: inquiry._id,
    });
  } catch (error) {
    console.error("Pledge submission error:", error);
    res.status(500).json({ success: false, message: "An error occurred, please try again." });
  }
};

// Handle Initiative Modal Form Submission
exports.submitInitiativeInquiry = async (req, res) => {
  try {
    const { name, phone, district, category, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and Phone required" });
    }

    const inquiry = await InitiativeInquiry.create({
      type: "initiative",
      category: category ? category.trim() : "Initiative Support",
      name: name.trim(),
      phone: phone.trim(),
      district: district ? district.trim() : "",
      message: message ? message.trim() : "",
      status: "new",
    });

    res.json({
      success: true,
      message: "Your request has been successfully registered.",
      id: inquiry._id,
    });
  } catch (error) {
    console.error("Initiative submission error:", error);
    res.status(500).json({ success: false, message: "An error occurred, please try again." });
  }
};
