const mongoose = require("mongoose");

const defaultContactData = {
  pageBadge: "जनसेवा एवं संपर्क केंद्र • पल्लवी पाल",
  pageHeading: "हमसे संपर्क करें",
  pageSubheading: "पल्लवी पाल जनसेवा केंद्र से जुड़ने, सुझाव देने या किसी भी सहयोग एवं जनसमस्या के समाधान हेतु हमसे निसंकोच संपर्क करें।",
  officeTitle: "जनप्रतिनिधि कार्यालय",
  officeAddress: "विधायक जनसेवा कार्यालय, लखनऊ / सिराथू (कौशाम्बी), उत्तर प्रदेश",
  officeTiming: "सोमवार से शनिवार: प्रातः 10:00 बजे से सायं 06:00 बजे तक (रविवार अवकाश)",
  mapDirectionsUrl: "https://maps.google.com/?q=Lucknow,Uttar+Pradesh",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.37255955146!2d80.85966601248043!3d26.848596489370845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000",
  primaryPhone: "+91 99553 09029",
  secondaryPhone: "+91 99553 09029",
  primaryEmail: "pallvipal.official@gmail.com",
  secondaryEmail: "pallvipal.official@gmail.com",
  whatsappNumber: "+919955309029",
  whatsappMessage: "नमस्ते, मैं पल्लवी पाल जनसेवा कार्यालय से संपर्क करना चाहता हूँ।",
  facebookUrl: "https://facebook.com/pallvipall",
  twitterUrl: "https://twitter.com/pallvipall",
  instagramUrl: "https://instagram.com/pallvipall",
  youtubeUrl: "https://youtube.com/@pallvipall",
  telegramUrl: "https://t.me/pallvipall",
  bannerImage: "/images/contact-banner.jpg",
  heroChip1: "त्वरित प्रतिक्रिया",
  heroChip2: "सीधी हेल्पलाइन",
  heroChip3: "मुख्यालय उपस्थिति",
};

const contactInfoSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
      default: defaultContactData.bannerImage,
      trim: true,
    },
    bannerImagePublicId: {
      type: String,
      default: "",
      trim: true,
    },
    pageBadge: {
      type: String,
      default: defaultContactData.pageBadge,
      trim: true,
    },
    pageHeading: {
      type: String,
      default: defaultContactData.pageHeading,
      trim: true,
    },
    pageSubheading: {
      type: String,
      default: defaultContactData.pageSubheading,
      trim: true,
    },
    heroChip1: {
      type: String,
      default: defaultContactData.heroChip1,
      trim: true,
    },
    heroChip2: {
      type: String,
      default: defaultContactData.heroChip2,
      trim: true,
    },
    heroChip3: {
      type: String,
      default: defaultContactData.heroChip3,
      trim: true,
    },
    officeTitle: {
      type: String,
      default: defaultContactData.officeTitle,
      trim: true,
    },
    officeAddress: {
      type: String,
      default: defaultContactData.officeAddress,
      trim: true,
    },
    officeTiming: {
      type: String,
      default: defaultContactData.officeTiming,
      trim: true,
    },
    mapDirectionsUrl: {
      type: String,
      default: defaultContactData.mapDirectionsUrl,
      trim: true,
    },
    mapEmbedUrl: {
      type: String,
      default: defaultContactData.mapEmbedUrl,
      trim: true,
    },
    primaryPhone: {
      type: String,
      default: defaultContactData.primaryPhone,
      trim: true,
    },
    secondaryPhone: {
      type: String,
      default: defaultContactData.secondaryPhone,
      trim: true,
    },
    primaryEmail: {
      type: String,
      default: defaultContactData.primaryEmail,
      trim: true,
    },
    secondaryEmail: {
      type: String,
      default: defaultContactData.secondaryEmail,
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: defaultContactData.whatsappNumber,
      trim: true,
    },
    whatsappMessage: {
      type: String,
      default: defaultContactData.whatsappMessage,
      trim: true,
    },
    facebookUrl: {
      type: String,
      default: defaultContactData.facebookUrl,
      trim: true,
    },
    twitterUrl: {
      type: String,
      default: defaultContactData.twitterUrl,
      trim: true,
    },
    instagramUrl: {
      type: String,
      default: defaultContactData.instagramUrl,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      default: defaultContactData.youtubeUrl,
      trim: true,
    },
    telegramUrl: {
      type: String,
      default: defaultContactData.telegramUrl,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

contactInfoSchema.statics.defaultData = defaultContactData;

contactInfoSchema.statics.getOrSeed = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create(defaultContactData);
    console.log("✅ Seeded default Contact Info successfully");
  }
  return doc;
};

module.exports = mongoose.model("ContactInfo", contactInfoSchema);
