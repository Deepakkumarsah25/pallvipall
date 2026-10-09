const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      default: "National & Social Service",
      trim: true,
    },
    badgeText: {
      type: String,
      default: "जनसेवा ही संकल्प • पल्लवी पाल",
      trim: true,
    },
    headingPrefix: {
      type: String,
      default: "Unity, Self-Respect and",
      trim: true,
    },
    highlightText: {
      type: String,
      default: "a Brighter Future",
      trim: true,
    },
    headingSuffix: {
      type: String,
      default: "A Resolute Step Ahead",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    imagePublicId: {
      type: String,
      default: "",
      trim: true,
    },
    primaryBtnText: {
      type: String,
      default: "Join Campaign",
      trim: true,
    },
    primaryBtnLink: {
      type: String,
      default: "#quickActionSidebar",
      trim: true,
    },
    primaryBtnInitiative: {
      type: String,
      default: "",
      trim: true,
    },
    secondaryBtnText: {
      type: String,
      default: "Our Key Initiatives",
      trim: true,
    },
    secondaryBtnLink: {
      type: String,
      default: "#what-we-do",
      trim: true,
    },
    secondaryBtnInitiative: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

heroSlideSchema.index({ order: 1, createdAt: 1 });

module.exports = mongoose.model("HeroSlide", heroSlideSchema);
