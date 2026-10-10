const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
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
const { ADMIN_LOGIN_URL } = require("./config/adminAuth");

// ========================================
// Routes
// ========================================

const adminAuthRoutes = require("./routes/admin/authRoutes");
const adminDashboardRoutes = require("./routes/admin/dashboardRoutes");
const adminGalleryRoutes = require("./routes/admin/galleryRoutes");
const adminHomeRoutes = require("./routes/admin/homeRoutes");
const adminAboutRoutes = require("./routes/admin/aboutRoutes");
const adminContactRoutes = require("./routes/admin/contactRoutes");
const adminSocialRoutes = require("./routes/admin/socialRoutes");
const aboutController = require("./controllers/aboutController");
const ContactInfo = require("./models/ContactInfo");
const { getPagination } = require("./utils/pagination");
const homeRoutes = require("./routes/homeRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const socialRoutes = require("./routes/socialRoutes");
const socialSyncService = require("./services/socialSyncService");

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
  res.locals.currentUrl = req.path;
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

// ========================================
// Admin Routes
// ========================================

app.use("/admin", adminAuthRoutes);
app.use("/admin", adminDashboardRoutes);
app.use("/admin/gallery", adminGalleryRoutes);
app.use("/admin/home", adminHomeRoutes);
app.use("/admin/about", adminAboutRoutes);
app.use("/admin/contact", adminContactRoutes);
app.use("/admin/social", adminSocialRoutes);

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
// Public Social Media Routes
// ========================================

app.use(socialRoutes);

// ========================================
// Public Gallery & Home Routes
// ========================================

app.use("/contact", contactRoutes);
app.use("/gallery", galleryRoutes);
app.use("/images-gallery", (req, res) => res.redirect("/gallery"));
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

    // Automatically seed default contact page data if empty
    await ContactInfo.getOrSeed();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Admin Login: http://localhost:${PORT}${ADMIN_LOGIN_URL}`);
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
