const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const videoNewsRoutes = require("./routes/news/videoNewsRoutes");
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// ========================================
// Environment Variables
// ========================================

const PORT = process.env.PORT || 9191;
const MONGODB_URI = process.env.MONGODB_URI;

// ========================================
// Validate Environment
// ========================================

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing in .env");
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.error("SESSION_SECRET is missing in .env");
  process.exit(1);
}

// ========================================
// Config
// ========================================

const sessionConfig = require("./config/session");
const csrfProtection = require("./middleware/csrfProtection");
const createDefaultAdmin = require("./config/createAdmin");
const { seedHomeData } = require("./scripts/seedHomeData");
const { seedGalleryData } = require("./scripts/seedGalleryData");

// ========================================
// Routes
// ========================================

const adminAuthRoutes = require("./routes/admin/authRoutes");
const adminDashboardRoutes = require("./routes/admin/dashboardRoutes");
const adminGalleryRoutes = require("./routes/admin/galleryRoutes");
const adminHomeRoutes = require("./routes/admin/homeRoutes");
const adminKalashYatraRoutes = require("./routes/admin/kalashYatraRoutes");
const adminAboutRoutes = require("./routes/admin/aboutRoutes");
const adminContactRoutes = require("./routes/admin/contactRoutes");
const aboutController = require("./controllers/aboutController");
const KalashYatra = require("./models/KalashYatra");
const ContactInfo = require("./models/ContactInfo");
const { getPagination } = require("./utils/pagination");
const publicVideoRateLimit = require("./middleware/rateLimit")({
  windowMs: 60 * 1000,
  max: 120,
  message: "Too many video page requests. Please try again shortly.",
});
const homeRoutes = require("./routes/homeRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const contactRoutes = require("./routes/contactRoutes");

// ========================================
// View Engine
// ========================================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ========================================
// Basic Security Headers
// ========================================

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.set("X-Frame-Options", "SAMEORIGIN");
  next();
});

// ========================================
// Body Parser
// ========================================

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

// ========================================
// Static Files
// ========================================

app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ================================
app.use(sessionConfig);
app.use("/admin", csrfProtection);
app.use(videoNewsRoutes);

// ========================================
// Admin Routes
// ========================================

app.use("/admin", adminAuthRoutes);
app.use("/admin", adminDashboardRoutes);
app.use("/admin/gallery", adminGalleryRoutes);
app.use("/admin/home", adminHomeRoutes);
app.use("/admin/kalash-yatra", adminKalashYatraRoutes);
app.use("/admin/about", adminAboutRoutes);
app.use("/admin/contact", adminContactRoutes);

// ========================================
// Test API
// ========================================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
  });
});

// ========================================
// Public About Page
// ========================================

app.get("/about", aboutController.getAboutPage);

// ========================================
// Public Video Page (Kalash Yatra)
// IMPORTANT: This must be BEFORE 404 Handler
// ========================================

app.get("/video", publicVideoRateLimit, async (req, res) => {
  try {
    let kalash = await KalashYatra.findOne().select("-videos").lean();
    if (!kalash) {
      await KalashYatra.create(KalashYatra.defaultData);
      kalash = await KalashYatra.findOne().select("-videos").lean();
    }

    const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
    const state = typeof req.query.state === "string" && /^[a-z0-9-]{1,40}$/i.test(req.query.state) ? req.query.state : "";
    const district = typeof req.query.district === "string" ? req.query.district.trim().slice(0, 100) : "";
    const match = {};
    if (state && state !== "all") match["videos.state"] = state;
    if (district && district !== "all") match["videos.district"] = district;
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(safeSearch, "i");
      match.$or = ["title", "personOrPlace", "district", "state", "description", "tag"].map((field) => ({ [`videos.${field}`]: searchRegex }));
    }

    const countResult = await KalashYatra.aggregate([
      { $unwind: "$videos" },
      { $match: match },
      { $count: "total" },
    ]);
    const pagination = getPagination(req.query.page, countResult[0]?.total || 0, 9);
    const [videos, locations] = await Promise.all([
      KalashYatra.aggregate([
        { $unwind: "$videos" },
        { $match: match },
        { $sort: { "videos.order": 1, "videos._id": 1 } },
        { $skip: pagination.skip },
        { $limit: pagination.pageSize },
        { $replaceRoot: { newRoot: "$videos" } },
      ]),
      KalashYatra.aggregate([
        { $unwind: "$videos" },
        { $group: { _id: { state: "$videos.state", district: "$videos.district" } } },
        { $sort: { "_id.state": 1, "_id.district": 1 } },
        { $limit: 300 },
      ]),
    ]);
    kalash = { ...(kalash || KalashYatra.defaultData), videos };
    res.render("videos/kalash-yatra", {
      kalash,
      currentUrl: "/video",
      videoSearch: search,
      selectedVideoState: state || "all",
      selectedVideoDistrict: district || "all",
      videoLocations: locations,
      videoPagination: pagination,
    });
  } catch (error) {
    console.error("Fetch kalash yatra error:", error);
    res.render("videos/kalash-yatra", {
      kalash: KalashYatra.defaultData,
      currentUrl: "/video",
      videoSearch: "",
      selectedVideoState: "all",
      selectedVideoDistrict: "all",
      videoLocations: [],
      videoPagination: getPagination("1", KalashYatra.defaultData.videos.length, 9),
    });
  }
});

// ========================================
// Public Gallery & Home Routes
// ========================================

app.use("/contact", contactRoutes);
app.use("/gallery", galleryRoutes);
app.use("/sankalp-photos", (req, res) => res.redirect("/gallery"));
app.use("/", homeRoutes);

// ========================================
// 404 Handler
// ========================================

app.use((req, res) => {
  res.status(404).render("error", {
    title: "404",
    message: "Page not found",
  });
});

// ========================================
// Error Handler
// ========================================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ========================================
// MongoDB + Server Start
// ========================================

const startServer = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected Successfully: Database [${mongoose.connection.name}] on [${mongoose.connection.host}]`);

    // Automatically create admin if not exists
    await createDefaultAdmin();

    // Automatically seed default home page data if empty
    await seedHomeData();

    // Automatically seed default gallery photos if empty
    await seedGalleryData();

    // Automatically seed default contact page data if empty
    await ContactInfo.getOrSeed();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Admin Login: http://localhost:${PORT}/admin/nishadaarakshansankalp/main/login`);
    });
  } catch (error) {
    console.error("Server Startup Error:", error.message);
    process.exit(1);
  }
};

// ========================================
// Start Application
// ========================================

startServer();
