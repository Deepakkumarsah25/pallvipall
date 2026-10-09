const mongoose = require("mongoose");
const HeroSlide = require("../../models/HeroSlide");
const Initiative = require("../../models/Initiative");
const WhyChoose = require("../../models/WhyChoose");
const SiteNotice = require("../../models/SiteNotice");
const HomeQuickInfo = require("../../models/HomeQuickInfo");
const InitiativeInquiry = require("../../models/InitiativeInquiry");
const SankalpPhoto = require("../../models/SankalpPhoto");
const Admin = require("../../models/admin/Admin");
const SocialPost = require("../../models/SocialPost");

// Helper to format uptime in hours and minutes
const formatUptime = (seconds) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

exports.dashboard = async (req, res, next) => {
  try {
    const [
      inquiriesTotal,
      inquiriesNew,
      pledgesCount,
      photosTotal,
      photosPublished,
      districtsList,
      heroSlidesTotal,
      heroSlidesActive,
      initiativesTotal,
      initiativesActive,
      noticesTotal,
      noticesActive,
      whyChooseDoc,
      quickInfoDoc,
      adminsCount,
      recentInquiries,
      recentPhotos,
      recentSlides,
      topDistricts,
      socialPostsTotal,
      socialPostsActive,
    ] = await Promise.all([
      InitiativeInquiry.countDocuments().catch(() => 0),
      InitiativeInquiry.countDocuments({ status: "new" }).catch(() => 0),
      InitiativeInquiry.countDocuments({ type: "pledge" }).catch(() => 0),
      SankalpPhoto.countDocuments().catch(() => 0),
      SankalpPhoto.countDocuments({ isPublished: true }).catch(() => 0),
      SankalpPhoto.distinct("district").catch(() => []),
      HeroSlide.countDocuments().catch(() => 0),
      HeroSlide.countDocuments({ isActive: true }).catch(() => 0),
      Initiative.countDocuments().catch(() => 0),
      Initiative.countDocuments({ isActive: true }).catch(() => 0),
      SiteNotice.countDocuments().catch(() => 0),
      SiteNotice.countDocuments({ isActive: true }).catch(() => 0),
      WhyChoose.findOne().catch(() => null),
      HomeQuickInfo.findOne().catch(() => null),
      Admin.countDocuments().catch(() => 1),
      InitiativeInquiry.find().sort({ createdAt: -1 }).limit(6).catch(() => []),
      SankalpPhoto.find().sort({ createdAt: -1 }).limit(6).catch(() => []),
      HeroSlide.find().sort({ order: 1 }).limit(4).catch(() => []),
      SankalpPhoto.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: "$district", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]).catch(() => []),
      SocialPost.countDocuments().catch(() => 0),
      SocialPost.countDocuments({ isActive: true }).catch(() => 0),
    ]);

    const pillarsCount = whyChooseDoc?.pillars?.length || 0;
    const sankalpMembersTotal = pledgesCount || 0;

    res.render("admin/dashboard/index", {
      title: "Admin Dashboard - Overview",
      admin: req.session.admin,
      currentPath: "/admin/dashboard",
      stats: {
        inquiriesTotal,
        inquiriesNew,
        pledgesCount,
        photosTotal,
        photosPublished,
        districtsCount: districtsList.length,
        heroSlidesTotal,
        heroSlidesActive,
        initiativesTotal,
        initiativesActive,
        noticesTotal,
        noticesActive,
        pillarsCount,
        adminsCount,
        socialPostsTotal,
        socialPostsActive,
        sankalpMembersTotal,
      },
      socialPostsTotal,
      socialPostsActive,
      recentInquiries: recentInquiries || [],
      recentPhotos: recentPhotos || [],
      recentSlides: recentSlides || [],
      topDistricts: topDistricts || [],
      quickInfo: quickInfoDoc || {},
      systemInfo: {
        nodeVersion: process.version,
        dbStatus:
          mongoose.connection.readyState === 1
            ? "Connected"
            : "Disconnected",
        uptime: formatUptime(process.uptime()),
        serverPort: process.env.PORT || 9191,
      },
    });
  } catch (error) {
    console.error("Dashboard controller error:", error);
    res.render("admin/dashboard/index", {
      title: "Admin Dashboard",
      admin: req.session.admin,
      currentPath: "/admin/dashboard",
      stats: {
        inquiriesTotal: 0,
        inquiriesNew: 0,
        pledgesCount: 0,
        photosTotal: 0,
        photosPublished: 0,
        districtsCount: 0,
        heroSlidesTotal: 0,
        heroSlidesActive: 0,
        initiativesTotal: 0,
        initiativesActive: 0,
        noticesTotal: 0,
        noticesActive: 0,
        pillarsCount: 0,
        adminsCount: 1,
        socialPostsTotal: 0,
        socialPostsActive: 0,
        sankalpMembersTotal: 0,
      },
      socialPostsTotal: 0,
      socialPostsActive: 0,
      recentInquiries: [],
      recentPhotos: [],
      recentSlides: [],
      topDistricts: [],
      quickInfo: {},
      systemInfo: {
        nodeVersion: process.version,
        dbStatus: "Unknown",
        uptime: "—",
        serverPort: process.env.PORT || 9191,
      },
    });
  }
};
