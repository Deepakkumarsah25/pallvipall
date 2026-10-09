const mongoose = require("mongoose");

const trustPillarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  iconKey: {
    type: String,
    default: "shield",
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const whyChooseSchema = new mongoose.Schema(
  {
    sectionTag: {
      type: String,
      default: "Transparency & Commitment",
      trim: true,
    },
    sectionTitle: {
      type: String,
      default: "Why Choose the",
      trim: true,
    },
    highlightText: {
      type: String,
      default: "पल्लवी पाल?",
      trim: true,
    },
    sectionSubtitle: {
      type: String,
      default:
        "हमारा उद्देश्य केवल राजनीति नहीं, बल्कि समाज के अंतिम व्यक्ति तक शिक्षा, न्याय, स्वाभिमान और सर्वांगीण विकास पहुंचाना है।",
      trim: true,
    },
    introHeading: {
      type: String,
      default: "जनसेवा, समर्पण और जमीनी बदलाव की एक अटूट पहचान",
      trim: true,
    },
    introDesc: {
      type: String,
      default:
        "वर्षों के अनवरत संघर्ष और जनसरोकार के माध्यम से हमने जनता का विश्वास अर्जित किया है। हर कदम पर आपके साथ खड़े रहना ही हमारी सर्वोच्च प्राथमिकता है।",
      trim: true,
    },
    pillars: {
      type: [trustPillarSchema],
      default: [],
    },
    quoteText: {
      type: String,
      default:
        "जब समाज का हर वर्ग एकजुट होकर प्रगति के पथ पर बढ़ता है, तब वास्तविक बदलाव आता है। जनसेवा ही हमारा जीवन और संकल्प है। - पल्लवी पाल",
      trim: true,
    },
    pledgePoints: {
      type: [String],
      default: [
        "Free membership and transparent community participation",
        "Direct outreach meetings at the village and block levels",
        "Personalized guidance and mentorship for students and youth",
        "Immediate volunteer response teams during crises and emergencies",
      ],
    },
    pledgeBtnText: {
      type: String,
      default: "Take the Pledge Today",
      trim: true,
    },
    pledgeBtnLink: {
      type: String,
      default: "#quickActionSidebar",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WhyChoose", whyChooseSchema);
