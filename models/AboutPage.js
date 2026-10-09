const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, default: "" },
  year: { type: String, default: "" },
  details: { type: String, default: "" },
  order: { type: Number, default: 0 }
});

const politicalCareerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  period: { type: String, default: "" },
  description: { type: String, default: "" },
  order: { type: Number, default: 0 }
});

const partyPostSchema = new mongoose.Schema({
  postTitle: { type: String, required: true },
  wing: { type: String, default: "" },
  period: { type: String, default: "" },
  description: { type: String, default: "" },
  order: { type: Number, default: 0 }
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: "" },
  year: { type: String, default: "" },
  description: { type: String, default: "" },
  order: { type: Number, default: 0 }
});

const socialWorkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  focusArea: { type: String, default: "" },
  description: { type: String, default: "" },
  order: { type: Number, default: 0 }
});

const galleryPhotoSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  caption: { type: String, default: "" },
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // Facebook, Twitter, Instagram, YouTube, etc.
  url: { type: String, required: true },
  handle: { type: String, default: "" },
  order: { type: Number, default: 0 }
});

const defaultAboutData = {
  profile: {
    name: "पल्लवी पाल (Pallavi Pal)",
    englishName: "Pallavi Pal",
    designation: "नेता, समाजवादी पार्टी",
    party: "Samajwadi Party",
    shortIntro: "समाजवादी विचारधारा, सामाजिक न्याय और जनसेवा के प्रति पूर्णतः समर्पित राजनीतिक नेतृत्व।",
    photo: "/images/about/pallavi-pal.svg",
    bannerImage: "",
    constituency: "उत्तर प्रदेश (Uttar Pradesh)"
  },

  biography: {
    heading: "जीवन परिचय एवं विचारधारा",
    summary: "पल्लवी पाल समाजवादी पार्टी की सक्रिय एवं समर्पित नेत्री हैं। वे समाज के शोषित, वंचित, किसान, मजदूर, नौजवान एवं महिलाओं के अधिकारों के लिए निरंतर संघर्षरत हैं। समाजवादी पार्टी के सिद्धांतों और डॉ. राममनोहर लोहिया के विचारों को आत्मसात करते हुए वे जनसेवा के मार्ग पर अग्रसर हैं।",
    paragraphs: [
      "राजनीतिक जीवन में पल्लवी पाल ने जमीनी स्तर पर जनसंवाद और जनसमस्याओं के समाधान को अपनी सर्वोच्च प्राथमिकता बनाया है।",
      "महिलाओं के सशक्तिकरण, बालिकाओं की शिक्षा और युवाओं के रोजगार के अवसरों के लिए वे सदैव मुखर रही हैं।",
      "समाजवादी पार्टी के संगठन को मजबूत करने तथा जनकल्याणकारी नीतियों को जन-जन तक पहुँचाने में उनका योगदान निरंतर जारी है।"
    ],
    coreValues: [
      "सामाजिक न्याय",
      "लोकतंत्र एवं संविधान रक्षा",
      "महिला सशक्तिकरण",
      "किसान एवं नौजवान कल्याण",
      "समानता एवं बंधुत्व"
    ]
  },

  currentPosition: {
    title: "वरिष्ठ नेत्री, समाजवादी पार्टी",
    role: "समाजवादी पार्टी",
    location: "उत्तर प्रदेश",
    description: "जनता के सरोकारों, स्थानीय जनसमस्याओं और संगठन की मजबूती के लिए जमीनी स्तर पर निरंतर जनसंपर्क व जनसंवाद।"
  },

  education: [
    {
      degree: "स्नातकोत्तर (Post Graduate)",
      institution: "विश्वविद्यालय, उत्तर प्रदेश",
      year: "उच्च शिक्षा",
      details: "सामाजिक विज्ञान एवं जननीति में विशेष रुचि",
      order: 1
    },
    {
      degree: "स्नातक (Graduate)",
      institution: "विश्वविद्यालय, उत्तर प्रदेश",
      year: "उच्च शिक्षा",
      details: "सक्रिय छात्र जीवन एवं सामाजिक सरोकार",
      order: 2
    }
  ],

  politicalCareer: [
    {
      title: "समाजवादी पार्टी में सक्रिय नेतृत्व",
      period: "वर्तमान",
      description: "पार्टी की नीतियों, आंदोलनों और जनहित के मुद्दों को प्रमुखता से उठाना।",
      order: 1
    },
    {
      title: "जनआंदोलन एवं सामाजिक सत्याग्रह",
      period: "सक्रिय वर्ष",
      description: "किसानों, युवाओं और महिलाओं के अधिकारों के लिए विभिन्न आंदोलनों में नेतृत्वकारी भूमिका।",
      order: 2
    },
    {
      title: "संगठनात्मक जनसंपर्क अभियान",
      period: "सक्रिय वर्ष",
      description: "गांव-गांव में चौपाल और पार्टी सदस्यता अभियान का व्यापक विस्तार।",
      order: 3
    }
  ],

  partyPosts: [
    {
      postTitle: "वरिष्ठ नेत्री",
      wing: "समाजवादी पार्टी, उत्तर प्रदेश",
      period: "वर्तमान",
      description: "पार्टी संगठन को जमीनी स्तर पर मजबूती प्रदान करना और जनमुद्दों पर संघर्ष।",
      order: 1
    },
    {
      postTitle: "महिला सशक्तिकरण एवं जनसंवाद समन्वयक",
      wing: "समाजवादी पार्टी",
      period: "सक्रिय कार्यकाल",
      description: "महिलाओं की राजनीतिक भागीदारी और अधिकारों के लिए अभियान चलाना।",
      order: 2
    }
  ],

  achievements: [
    {
      title: "जनसमस्याओं का प्रभावी समाधान",
      category: "जनसेवा",
      year: "निरंतर",
      description: "हजारों नागरिकों की समस्याओं का प्रशासनिक स्तर पर त्वरित निस्तारण कराया।",
      order: 1
    },
    {
      title: "महिला सशक्तिकरण व स्वावलंबन अभियान",
      category: "सामाजिक कल्याण",
      year: "विस्तृत अभियान",
      description: "ग्रामीण व अर्धशहरी क्षेत्रों में महिलाओं को स्वावलंबी बनाने हेतु निरंतर प्रयास।",
      order: 2
    },
    {
      title: "मेधावी छात्र-छात्रा मार्गदर्शन",
      category: "शिक्षा प्रोत्साहन",
      year: "वार्षिक",
      description: "शिक्षा और प्रतियोगी परीक्षाओं में भाग लेने वाले युवाओं को मार्गदर्शन व प्रोत्साहन।",
      order: 3
    }
  ],

  socialWork: [
    {
      title: "निःशुल्क स्वास्थ्य एवं सहायता शिविर",
      focusArea: "स्वास्थ्य सेवा",
      description: "ग्रामीण क्षेत्रों में समय-समय पर स्वास्थ्य परीक्षण, दवा वितरण एवं रक्तदान शिविरों का आयोजन।",
      order: 1
    },
    {
      title: "बालिका शिक्षा एवं जागरूकता चौपाल",
      focusArea: "महिला अधिकार",
      description: "बालिकाओं को शिक्षा से जोड़ने तथा कानूनी व सामाजिक अधिकारों के प्रति जागरूक करने का निरंतर प्रयास।",
      order: 2
    },
    {
      title: "आपदा एवं संकट में जनसहयोग",
      focusArea: "राहत कार्य",
      description: "बाढ़, महामारी व प्राकृतिक आपदाओं के समय पीड़ितों तक खाद्य सामग्री व आवश्यक सहायता पहुँचाना।",
      order: 3
    }
  ],

  gallery: [
    {
      title: "जनसंवाद एवं चौपाल",
      caption: "जनता से सीधा संवाद और समस्याओं का समाधान",
      imageUrl: "/images/about/pallavi-pal.svg",
      order: 1
    }
  ],

  socialLinks: [
    {
      platform: "Facebook",
      url: "https://facebook.com",
      handle: "@PallaviPalOfficial",
      order: 1
    },
    {
      platform: "Twitter",
      url: "https://twitter.com",
      handle: "@PallaviPalSP",
      order: 2
    },
    {
      platform: "Instagram",
      url: "https://instagram.com",
      handle: "@pallavipal_sp",
      order: 3
    },
    {
      platform: "YouTube",
      url: "https://youtube.com",
      handle: "Pallavi Pal Official",
      order: 4
    }
  ]
};

const aboutPageSchema = new mongoose.Schema(
  {
    profile: {
      name: { type: String, default: defaultAboutData.profile.name },
      englishName: { type: String, default: defaultAboutData.profile.englishName },
      designation: { type: String, default: defaultAboutData.profile.designation },
      party: { type: String, default: defaultAboutData.profile.party },
      shortIntro: { type: String, default: defaultAboutData.profile.shortIntro },
      photo: { type: String, default: defaultAboutData.profile.photo },
      bannerImage: { type: String, default: defaultAboutData.profile.bannerImage },
      constituency: { type: String, default: defaultAboutData.profile.constituency }
    },

    biography: {
      heading: { type: String, default: defaultAboutData.biography.heading },
      summary: { type: String, default: defaultAboutData.biography.summary },
      paragraphs: [{ type: String }],
      coreValues: [{ type: String }]
    },

    currentPosition: {
      title: { type: String, default: defaultAboutData.currentPosition.title },
      role: { type: String, default: defaultAboutData.currentPosition.role },
      location: { type: String, default: defaultAboutData.currentPosition.location },
      description: { type: String, default: defaultAboutData.currentPosition.description }
    },

    education: [educationSchema],
    politicalCareer: [politicalCareerSchema],
    partyPosts: [partyPostSchema],
    achievements: [achievementSchema],
    socialWork: [socialWorkSchema],
    gallery: [galleryPhotoSchema],
    socialLinks: [socialLinkSchema]
  },
  {
    timestamps: true
  }
);

aboutPageSchema.statics.defaultData = defaultAboutData;

aboutPageSchema.statics.getOrSeed = async function () {
  let doc = await this.findOne();
  // Check if doc exists and has the new profile schema (not the old Nishad structure)
  if (!doc || !doc.profile || !doc.profile.name || doc.profile.name.includes("निषाद") || doc.get("objective")) {
    if (doc) {
      await this.deleteMany({});
    }
    doc = await this.create(defaultAboutData);
    console.log("✅ Seeded Pallavi Pal About Page data successfully");
  }
  return doc;
};

module.exports = mongoose.model("AboutPage", aboutPageSchema);
