const mongoose = require("mongoose");

const homeQuickInfoSchema = new mongoose.Schema(
  {
    sidebarTitle: {
      type: String,
      default: "पल्लवी पाल",
      trim: true,
    },
    sidebarSubtitle: {
      type: String,
      default: "जनसेवा एवं संपर्क केंद्र",
      trim: true,
    },
    pledgeBoxTitle: {
      type: String,
      default: "जनसेवा व सामाजिक सरोकार से जुड़ें",
      trim: true,
    },
    pledgeBoxDesc: {
      type: String,
      default: "शिक्षा, सामाजिक न्याय एवं जनहित के कार्यों में अपनी सहभागिता दर्ज करें।",
      trim: true,
    },
    helplineText: {
      type: String,
      default: "Helpline: +91 99553 09029",
      trim: true,
    },
    helplineTel: {
      type: String,
      default: "+919955309029",
      trim: true,
    },
    email: {
      type: String,
      default: "pallvipal.official@gmail.com",
      trim: true,
    },
    sidebarFooterText: {
      type: String,
      default: "जनसेवा ही हमारा संकल्प है",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HomeQuickInfo", homeQuickInfoSchema);
