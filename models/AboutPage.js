const mongoose = require("mongoose");

const defaultAboutData = {
  meta: {
    pageTitle: "पल्लवी पाल - जनसेवा एवं समर्पण",
    pageSubtitle: "जनप्रतिनिधि, जनसेवा और सामाजिक न्याय का निरंतर संघर्ष",
    heroBadge: "पल्लवी पाल • जनसेवा संकल्प",
    heroImage: "/images/about/pallavi-pal-hero.jpg",
    stats: [
      { number: "100+", label: "विकास कार्य", sub: "सक्रिय क्रियान्वयन" },
      { number: "75+", label: "विधानसभा क्षेत्र", sub: "जन-संवाद" },
      { number: "50,000+", label: "संतुष्ट परिवार", sub: "कल्याण सहायता" },
      { number: "100%", label: "संवैधानिक न्याय", sub: "हमारा संकल्प" },
    ],
  },

  // 1. अभियान का उद्देश्य
  objective: {
    navTitle: "जनसेवा का उद्देश्य",
    title: "जनसेवा एवं सामाजिक न्याय",
    tagline: "संवैधानिक अधिकार, किसान-मजदूर कल्याण और समग्र विकास",
    description:
      "समाज के हर वर्ग के स्वाभिमान, हक और सर्वांगीण प्रगति के लिए समर्पित। शिक्षा, स्वास्थ्य और रोजगार के अवसरों को अंतिम पंक्ति के व्यक्ति तक पहुंचाना।",
    points: [
      {
        title: "संवैधानिक न्याय एवं समानता",
        desc: "संविधान प्रदत्त मौलिक अधिकारों, सामाजिक समरसता और कमजोर वर्गों की सुरक्षा की मजबूत पैरवी।",
      },
      {
        title: "शिक्षा एवं युवा सशक्तिकरण",
        desc: "युवाओं के लिए उच्च शिक्षा, प्रतियोगी परीक्षा कोचिंग और आधुनिक तकनीकी रोजगार के अवसर।",
      },
      {
        title: "किसान एवं कामगार हित",
        desc: "किसानों की समस्याओं का समाधान, सिंचाई व लागत मूल्य सुरक्षा और असंगठित मजदूरों का उत्थान।",
      },
      {
        title: "लोकतांत्रिक प्रतिनिधित्व",
        desc: "सदन से सड़क तक जनता की वास्तविक समस्याओं को निर्भीकता और निष्पक्षता से उठाना।",
      },
    ],
    keyQuote: "",
    image: "/images/about/pallavi-pal-rally.jpg",
  },

  // 2. मिशन
  mission: {
    navTitle: "मिशन",
    title: "हमारा मिशन",
    tagline: "हर परिवार तक विकास और हर युवा को स्वावलंबन",
    description:
      "गांव-गांव में चौपाल, जन-सुनवाई और युवा संवाद के माध्यम से आम नागरिकों की समस्याओं का समयबद्ध समाधान और सशक्तिकरण।",
    pillars: [
      {
        title: "जनसंवाद शक्ति",
        desc: "पंचायत व वार्ड स्तर पर नागरिकों के साथ नियमित चौपाल और पारदर्शी संवाद।",
      },
      {
        title: "संवैधानिक संघर्ष",
        desc: "सदन और शासन स्तर पर जनसमस्याओं के समाधान हेतु सशक्त एवं विधिक पैरवी।",
      },
      {
        title: "नारी सशक्तिकरण",
        desc: "माताओं और बहनों को शिक्षा, स्वरोजगार और सामाजिक नेतृत्व में आगे बढ़ाना।",
      },
      {
        title: "युवा स्वावलंबन",
        desc: "आधुनिक तकनीक, स्वरोजगार और प्रतियोगी परीक्षाओं हेतु युवाओं को निरंतर मार्गदर्शन।",
      },
    ],
    targetYears: "संकल्प से सिद्धि तक",
    image: "/images/about/pallavi-pal-chaupal.jpg",
  },

  // 3. Vision
  vision: {
    navTitle: "Vision",
    title: "हमारा विजन",
    tagline: "एक शिक्षित, स्वाभिमानी और समृद्ध समाज",
    description:
      "एक ऐसा प्रगतिशील समाज जहां हर बच्चे को गुणवत्तापूर्ण शिक्षा मिले और प्रत्येक नागरिक को गरिमापूर्ण जीवन व न्याय प्राप्त हो।",
    visionPoints: [
      {
        title: "100% साक्षरता व कौशल विकास",
        desc: "समाज के प्रत्येक युवा को आधुनिक शिक्षा और रोजगारोन्मुखी तकनीकी प्रशिक्षण।",
      },
      {
        title: "नीति-निर्माण में जनभागीदारी",
        desc: "पंचायतों से लेकर विधानसभा तक आम जनता के मुद्दों को प्रमुखता से लागू कराना।",
      },
      {
        title: "आर्थिक स्वावलंबन",
        desc: "स्थानीय कारीगरों, किसानों और छोटे उद्यमियों हेतु सरकारी योजनाओं का सुगम लाभ।",
      },
      {
        title: "सामाजिक समरसता",
        desc: "पारस्परिक सद्भाव, भाईचारा और सामाजिक कुरीतियों का पूर्ण उन्मूलन।",
      },
    ],
    quote: "",
    image: "/images/about/pallavi-pal-heritage.jpg",
  },

  // 4. अभियान की पृष्ठभूमि
  background: {
    navTitle: "जनसेवा यात्रा",
    title: "जनसेवा की यात्रा",
    tagline: "जनता के भरोसे और संघर्ष से उपजा सेवा संकल्प",
    description:
      "जमीनी संघर्ष, सामाजिक चेतना और जनता के अधिकारों की रक्षा हेतु निरंतर कार्य करने की प्रेरणादायी यात्रा।",
    historicalLegacy: "",
    timeline: [
      {
        phase: "सामाजिक चेतना",
        title: "जमीनी जुड़ाव की शुरुआत",
        desc: "ग्रामीण क्षेत्रों में जनसमस्याओं, शिक्षा और स्वास्थ्य के मुद्दों पर निरंतर सक्रियता।",
      },
      {
        phase: "जन-संघर्ष",
        title: "अधिकारों की मुखर आवाज",
        desc: "किसान, मजदूर और युवाओं के हकों के लिए सड़क से लेकर विभिन्न मंचों पर नेतृत्व।",
      },
      {
        phase: "लोकतांत्रिक विजय",
        title: "विधानसभा में जन-प्रतिनिधित्व",
        desc: "जनता के अपार समर्थन से निर्वाचित होकर सदन में जनहितकारी नीतियों पर प्रभावी चर्चा।",
      },
      {
        phase: "सतत विकास",
        title: "पल्लवी पाल - सेवा संकल्प",
        desc: "क्षेत्रीय विकास, बुनियादी सुविधाओं के विस्तार और पारदर्शी नेतृत्व का अटूट क्रम।",
      },
    ],
    image: "/images/about/pallavi-pal-hero.jpg",
  },

  // 5. आरक्षण संकल्प अभियान से संबंधित जानकारी
  reservation: {
    navTitle: "नीतिगत पहल",
    title: "सामाजिक न्याय एवं नीतिगत पहल",
    tagline: "संवैधानिक समानता और जनकल्याणकारी नीतियों का धरातल पर क्रियान्वयन",
    description:
      "संविधान के सिद्धांतों के अनुरूप समाज के अंतिम पायदान पर खड़े व्यक्ति तक समान अवसर, विकास और सामाजिक सुरक्षा पहुंचाना हमारी प्राथमिकता है।",
    legalBasis: "",
    keyDemands: [
      {
        title: "समान अवसर व सामाजिक न्याय",
        desc: "वंचित और पिछड़े वर्गों को शिक्षा, रोजगार और प्रशासन में गरिमापूर्ण भागीदारी सुनिश्चित कराना।",
        tag: "संवैधानिक अधिकार",
      },
      {
        title: "किसान व कामगार कल्याण पैकेज",
        desc: "फसल का लाभकारी मूल्य, सुलभ सिंचाई साधन और असंगठित मजदूरों हेतु सामाजिक सुरक्षा।",
        tag: "आर्थिक सुरक्षा",
      },
      {
        title: "महिला व युवा विकास योजनाएं",
        desc: "उच्च शिक्षा छात्रवृत्ति, कौशल विकास केंद्र और स्वयं सहायता समूहों को आर्थिक प्रोत्साहन।",
        tag: "कल्याण योजना",
      },
    ],
    actionPlan: "",
    image: "/images/about/pallavi-pal-rally.jpg",
  },

  // 6. प्रमुख गतिविधियां
  activities: {
    navTitle: "प्रमुख गतिविधियां",
    title: "प्रमुख गतिविधियां",
    tagline: "जन-संवाद, चौपाल और विकास कार्यों का निरंतर प्रवाह",
    description:
      "क्षेत्र भर में चौपालों, जन-सुनवाइयों और सम्मेलनों के जरिए जनता से सीधा संवाद और समस्याओं का समाधान।",
    detailTitle: "जमीनी गतिविधियां एवं जनसंपर्क विस्तार",
    detailDescription:
      "प्रत्येक गांव, पंचायत और ब्लॉक स्तर पर चौपालों और जनसंवाद कार्यक्रमों का निरंतर आयोजन किया जा रहा है, जिससे हर नागरिक की बात सुनी जा सके।",
    detailPoints: [
      {
        title: "गांव-गांव चौपाल व जनसंवाद",
        desc: "बुजुर्गों, युवाओं और महिलाओं के साथ बैठकर स्थानीय समस्याओं व विकास कार्यों पर सीधा विचार-विमर्श।",
      },
      {
        title: "जन-सुनवाई एवं त्वरित समाधान",
        desc: "प्रशासनिक अधिकारियों के साथ समन्वय स्थापित कर आमजन की शिकायतों का समयबद्ध निवारण।",
      },
      {
        title: "विधिक व सामाजिक मार्गदर्शन",
        desc: "सरकारी योजनाओं, छात्रवृत्ति व अधिकारों के लाभ हेतु जरूरतमंदों को निशुल्क विधिक सहायता।",
      },
    ],
    activityList: [
      {
        name: "जनसंवाद व जनसंपर्क अभियान",
        tag: "जन-जागरण",
        desc: "गांव-गांव पहुंचकर जनता की कुशलक्षेम और क्षेत्रीय विकास का सीधा जायजा।",
        image: "/images/about/pallavi-pal-hero.jpg",
      },
      {
        name: "ग्राम चौपाल व पंचायत संवाद",
        tag: "जमीनी संवाद",
        desc: "हर गांव में बैठक कर बिजली, पानी, सड़क व शिक्षा की समस्याओं पर समाधान।",
        image: "/images/about/pallavi-pal-chaupal.jpg",
      },
      {
        name: "सामाजिक न्याय महासम्मेलन",
        tag: "जनशक्ति प्रदर्शन",
        desc: "संवैधानिक अधिकारों और जनहित के मुद्दों पर विशाल राज्यस्तरीय सम्मेलन।",
        image: "/images/about/pallavi-pal-rally.jpg",
      },
      {
        name: "मेधावी छात्र-छात्रा सम्मान",
        tag: "शिक्षा प्रोत्साहन",
        desc: "शिक्षा और प्रतियोगी परीक्षाओं में उत्कृष्ट प्रदर्शन करने वाले होनहार छात्र-छात्राओं का अभिनंदन।",
        image: "/images/about/pallavi-pal-heritage.jpg",
      },
    ],
    image: "/images/about/pallavi-pal-chaupal.jpg",
  },

  // 7. महत्वपूर्ण संदेश
  messages: {
    navTitle: "महत्वपूर्ण संदेश",
    title: "महत्वपूर्ण संदेश",
    tagline: "जनता के नाम पल्लवी पाल का प्रेरक संदेश",
    description:
      "शिक्षा, स्वाभिमान, सद्भाव और अखंड एकता ही सशक्त समाज के उज्ज्वल भविष्य की आधारशिला है।",
    messagesList: [
      {
        senderName: "पल्लवी पाल",
        role: "जनप्रतिनिधि",
        designation: "विधायक / जननेता",
        message:
          "हमारा संकल्प हर नागरिक की आवाज बनना और विकास की रोशनी को अंतिम पंक्ति तक पहुंचाना है। संविधान और जनसेवा ही हमारी सर्वोच्च ताकत है।",
        photo: "/images/about/pallavi-pal-hero.jpg",
      },
      {
        senderName: "मातृशक्ति मंच",
        role: "महिला प्रकोष्ठ",
        designation: "नारी चेतना मंच",
        message:
          "एक शिक्षित और जागरूक महिला ही समाज का भविष्य संवारती है। बहनें हर मोर्चे पर सशक्त और आत्मनिर्भर बनें।",
        photo: "/images/about/pallavi-pal-chaupal.jpg",
      },
      {
        senderName: "युवा चेतना मंच",
        role: "युवा प्रकोष्ठ",
        designation: "युवा शक्ति परिषद",
        message:
          "शिक्षा, सकारात्मक सोच और संगठन ही युवाओं की सबसे बड़ी ताकत है। राष्ट्र निर्माण में अपनी भागीदारी निभाएं।",
        photo: "/images/about/pallavi-pal-rally.jpg",
      },
    ],
    image: "/images/about/pallavi-pal-rally.jpg",
  },

  // फोटो गैलरी (Photo Gallery)
  gallery: {
    title: "ऐतिहासिक क्षण एवं जनसेवा की तस्वीरें",
    tagline: "जनसंवाद, चौपाल, रैलियों और सम्मेलनों की जीवंत झलकियां",
    photos: [
      {
        title: "विशाल जनसंवाद एवं कार्यकर्ता सम्मेलन",
        caption: "क्षेत्रीय जनता का अपार स्नेह, जनसेवा और सामाजिक न्याय का मजबूत संकल्प।",
        category: "महासम्मेलन",
        imageUrl: "/images/about/pallavi-pal-hero.jpg",
      },
      {
        title: "युवा एवं किसान महासम्मेलन",
        caption: "सामाजिक न्याय, शिक्षा और संवैधानिक अधिकारों के लिए उमड़ा अपार जनसैलाब।",
        category: "जनसंवाद",
        imageUrl: "/images/about/pallavi-pal-rally.jpg",
      },
      {
        title: "विरासत, संस्कृति एवं जन-सम्मान",
        caption: "ऐतिहासिक विरासत, सांस्कृतिक मूल्यों और स्वाभिमान का भव्य जन-अभिनंदन।",
        category: "सांस्कृतिक गौरव",
        imageUrl: "/images/about/pallavi-pal-heritage.jpg",
      },
      {
        title: "ग्राम चौपाल — जनता के साथ सीधा संवाद",
        caption: "गांव-गांव में बुजुर्गों, महिलाओं और युवाओं के साथ बैठकर समस्याओं का समाधान।",
        category: "ग्राम चौपाल",
        imageUrl: "/images/about/pallavi-pal-chaupal.jpg",
      },
    ],
  },
};

const pointItemSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  desc: { type: String, default: "" },
  icon: { type: String, default: "" },
});

const timelineItemSchema = new mongoose.Schema({
  phase: { type: String, default: "" },
  title: { type: String, default: "" },
  desc: { type: String, default: "" },
});

const demandItemSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  desc: { type: String, default: "" },
  tag: { type: String, default: "" },
});

const activityItemSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  tag: { type: String, default: "" },
  desc: { type: String, default: "" },
  image: { type: String, default: "" },
});

const messageItemSchema = new mongoose.Schema({
  senderName: { type: String, default: "" },
  role: { type: String, default: "" },
  designation: { type: String, default: "" },
  message: { type: String, default: "" },
  photo: { type: String, default: "" },
});

const galleryPhotoSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  caption: { type: String, default: "" },
  category: { type: String, default: "सामान्य" },
  imageUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const statItemSchema = new mongoose.Schema({
  number: { type: String, default: "" },
  label: { type: String, default: "" },
  sub: { type: String, default: "" },
});

const aboutPageSchema = new mongoose.Schema(
  {
    isPublished: { type: Boolean, default: true },

    meta: {
      pageTitle: { type: String, default: defaultAboutData.meta.pageTitle },
      pageSubtitle: { type: String, default: defaultAboutData.meta.pageSubtitle },
      heroBadge: { type: String, default: defaultAboutData.meta.heroBadge },
      heroImage: { type: String, default: defaultAboutData.meta.heroImage },
      stats: [statItemSchema],
    },

    objective: {
      navTitle: { type: String, default: defaultAboutData.objective.navTitle },
      title: { type: String, default: defaultAboutData.objective.title },
      tagline: { type: String, default: defaultAboutData.objective.tagline },
      description: { type: String, default: defaultAboutData.objective.description },
      points: [pointItemSchema],
      keyQuote: { type: String, default: defaultAboutData.objective.keyQuote },
      image: { type: String, default: defaultAboutData.objective.image },
    },

    mission: {
      navTitle: { type: String, default: defaultAboutData.mission.navTitle },
      title: { type: String, default: defaultAboutData.mission.title },
      tagline: { type: String, default: defaultAboutData.mission.tagline },
      description: { type: String, default: defaultAboutData.mission.description },
      pillars: [pointItemSchema],
      targetYears: { type: String, default: defaultAboutData.mission.targetYears },
      image: { type: String, default: defaultAboutData.mission.image },
    },

    vision: {
      navTitle: { type: String, default: defaultAboutData.vision.navTitle },
      title: { type: String, default: defaultAboutData.vision.title },
      tagline: { type: String, default: defaultAboutData.vision.tagline },
      description: { type: String, default: defaultAboutData.vision.description },
      visionPoints: [pointItemSchema],
      quote: { type: String, default: defaultAboutData.vision.quote },
      image: { type: String, default: defaultAboutData.vision.image },
    },

    background: {
      navTitle: { type: String, default: defaultAboutData.background.navTitle },
      title: { type: String, default: defaultAboutData.background.title },
      tagline: { type: String, default: defaultAboutData.background.tagline },
      description: { type: String, default: defaultAboutData.background.description },
      historicalLegacy: { type: String, default: defaultAboutData.background.historicalLegacy },
      timeline: [timelineItemSchema],
      image: { type: String, default: defaultAboutData.background.image },
    },

    reservation: {
      navTitle: { type: String, default: defaultAboutData.reservation.navTitle },
      title: { type: String, default: defaultAboutData.reservation.title },
      tagline: { type: String, default: defaultAboutData.reservation.tagline },
      description: { type: String, default: defaultAboutData.reservation.description },
      legalBasis: { type: String, default: defaultAboutData.reservation.legalBasis },
      keyDemands: [demandItemSchema],
      actionPlan: { type: String, default: defaultAboutData.reservation.actionPlan },
      image: { type: String, default: defaultAboutData.reservation.image },
    },

    activities: {
      navTitle: { type: String, default: defaultAboutData.activities.navTitle },
      title: { type: String, default: defaultAboutData.activities.title },
      tagline: { type: String, default: defaultAboutData.activities.tagline },
      description: { type: String, default: defaultAboutData.activities.description },
      detailTitle: { type: String, default: defaultAboutData.activities.detailTitle },
      detailDescription: { type: String, default: defaultAboutData.activities.detailDescription },
      detailPoints: [pointItemSchema],
      activityList: [activityItemSchema],
      image: { type: String, default: defaultAboutData.activities.image },
    },

    messages: {
      navTitle: { type: String, default: defaultAboutData.messages.navTitle },
      title: { type: String, default: defaultAboutData.messages.title },
      tagline: { type: String, default: defaultAboutData.messages.tagline },
      description: { type: String, default: defaultAboutData.messages.description },
      messagesList: [messageItemSchema],
      image: { type: String, default: defaultAboutData.messages.image },
    },

    gallery: {
      title: { type: String, default: defaultAboutData.gallery.title },
      tagline: { type: String, default: defaultAboutData.gallery.tagline },
      photos: [galleryPhotoSchema],
    },
  },
  {
    timestamps: true,
  }
);

aboutPageSchema.statics.defaultData = defaultAboutData;

aboutPageSchema.statics.getOrSeed = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create(defaultAboutData);
    console.log("✅ Seeded default About Page data successfully");
  }
  return doc;
};

module.exports = mongoose.model("AboutPage", aboutPageSchema);
