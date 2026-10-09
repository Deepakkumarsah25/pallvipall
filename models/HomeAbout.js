const mongoose = require("mongoose");

const homeAboutSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true,
    },
    badgeText: {
      type: String,
      default: "★ जनसेवा संकल्प • पल्लवी पाल",
    },
    headingPrefix: {
      type: String,
      default: "जनता के सम्मान, स्वाभिमान और",
    },
    highlightHeading: {
      type: String,
      default: "सामाजिक न्याय के लिए समर्पित नेतृत्व",
    },
    headingSuffix: {
      type: String,
      default: "",
    },
    tagline: {
      type: String,
      default: "संवैधानिक अधिकारों की रक्षा, किसान-युवा उत्थान और सर्वांगीण विकास का संकल्प",
    },
    description1: {
      type: String,
      default:
        "पल्लवी पाल जनहित, सामाजिक न्याय और संवैधानिक समानता के लिए सड़क से लेकर सदन तक निरंतर संघर्षरत एक मुखर और संवेदनशील जनप्रतिनिधि हैं। उनका ध्येय अंतिम पंक्ति के व्यक्ति तक विकास और अवसर पहुंचाना है।",
    },
    description2: {
      type: String,
      default:
        "क्षेत्र के प्रत्येक गांव, कस्बे और मोहल्ले में चौपाल, जनसंवाद और विकास कार्यों के माध्यम से आम नागरिकों की समस्याओं का त्वरित समाधान और सशक्तिकरण सुनिश्चित करना ही उनका संकल्प है।",
    },
    imageUrl: {
      type: String,
      default: "/images/about/pallavi-pal-rally.jpg",
    },
    images: {
      type: [String],
      default: [
        "/images/about/pallavi-pal-rally.jpg",
        "/images/about/pallavi-pal-hero.jpg",
        "/images/about/pallavi-pal-chaupal.jpg",
        "/images/about/pallavi-pal-heritage.jpg",
      ],
    },
    imageBadgeNumber: {
      type: String,
      default: "24x7",
    },
    imageBadgeLabel: {
      type: String,
      default: "जनसेवा में समर्पित",
    },
    floatingBadgeText: {
      type: String,
      default: "जनप्रतिनिधि • पल्लवी पाल",
    },
    points: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        iconKey: { type: String, default: "shield" },
      },
    ],
    stats: [
      {
        number: { type: String, default: "" },
        label: { type: String, default: "" },
      },
    ],
    quoteText: {
      type: String,
      default: "जनसेवा ही मेरा संकल्प है और हर नागरिक का सम्मान मेरी प्राथमिकता।",
    },
    quoteAuthor: {
      type: String,
      default: "— पल्लवी पाल",
    },
    readMoreText: {
      type: String,
      default: "Read More...",
    },
    readMoreLink: {
      type: String,
      default: "/about",
    },
    primaryBtnText: {
      type: String,
      default: "Read More...",
    },
    primaryBtnLink: {
      type: String,
      default: "/about",
    },
    secondaryBtnText: {
      type: String,
      default: "",
    },
    secondaryBtnLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const defaultHomeAboutData = {
  isActive: true,
  badgeText: "★ जनसेवा संकल्प • पल्लवी पाल",
  headingPrefix: "जनता के सम्मान, स्वाभिमान और",
  highlightHeading: "सामाजिक न्याय के लिए समर्पित नेतृत्व",
  headingSuffix: "",
  tagline: "संवैधानिक अधिकारों की रक्षा, किसान-युवा उत्थान और सर्वांगीण विकास का संकल्प",
  description1:
    "पल्लवी पाल जनहित, सामाजिक न्याय और संवैधानिक समानता के लिए सड़क से लेकर सदन तक निरंतर संघर्षरत एक मुखर और संवेदनशील जनप्रतिनिधि हैं। उनका ध्येय अंतिम पंक्ति के व्यक्ति तक विकास और अवसर पहुंचाना है।",
  description2:
    "क्षेत्र के प्रत्येक गांव, कस्बे और मोहल्ले में चौपाल, जनसंवाद और विकास कार्यों के माध्यम से आम नागरिकों की समस्याओं का त्वरित समाधान और सशक्तिकरण सुनिश्चित करना ही उनका संकल्प है।",
  imageUrl: "/images/about/pallavi-pal-rally.jpg",
  images: [
    "/images/about/pallavi-pal-rally.jpg",
    "/images/about/pallavi-pal-hero.jpg",
    "/images/about/pallavi-pal-chaupal.jpg",
    "/images/about/pallavi-pal-heritage.jpg",
  ],
  imageBadgeNumber: "24x7",
  imageBadgeLabel: "जनसेवा में समर्पित",
  floatingBadgeText: "जनप्रतिनिधि • पल्लवी पाल",
  points: [
    {
      title: "संवैधानिक न्याय एवं समानता",
      description: "संविधान के मूल्यों की रक्षा, कमजोर और वंचित वर्गों के अधिकारों के लिए दृढ़ संकल्प।",
      iconKey: "scale",
    },
    {
      title: "शिक्षा एवं युवा स्वावलंबन",
      description: "शिक्षा के बेहतर अवसर, प्रतियोगी परीक्षा सहायता और तकनीकी कौशल से युवाओं का सशक्तिकरण।",
      iconKey: "book",
    },
    {
      title: "किसान एवं मजदूर कल्याण",
      description: "अन्नदाता किसानों के अधिकारों की सुरक्षा, उचित मूल्य और कामगारों की सामाजिक सुरक्षा।",
      iconKey: "shield",
    },
    {
      title: "पारदर्शी एवं सक्रिय नेतृत्व",
      description: "सदन में जनता की आवाज को मजबूती से उठाना और जमीनी स्तर पर हर समस्या का समयबद्ध समाधान।",
      iconKey: "users",
    },
  ],
  stats: [
    { number: "100+", label: "विकास कार्य" },
    { number: "75+", label: "विधानसभा क्षेत्र" },
    { number: "50,000+", label: "संतुष्ट परिवार" },
    { number: "100%", label: "संवैधानिक न्याय" },
  ],
  quoteText: "जनसेवा ही मेरा संकल्प है और हर नागरिक का सम्मान मेरी प्राथमिकता।",
  readMoreText: "Read More...",
  readMoreLink: "/about",
  primaryBtnText: "Read More...",
  primaryBtnLink: "/about",
  secondaryBtnText: "",
  secondaryBtnLink: "",
};

homeAboutSchema.statics.defaultData = defaultHomeAboutData;

homeAboutSchema.statics.getOrSeed = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create(defaultHomeAboutData);
  }
  return doc;
};

module.exports = mongoose.model("HomeAbout", homeAboutSchema);
