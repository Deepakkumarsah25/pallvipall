const HeroSlide = require("../models/HeroSlide");
const Initiative = require("../models/Initiative");
const WhyChoose = require("../models/WhyChoose");
const SiteNotice = require("../models/SiteNotice");
const HomeQuickInfo = require("../models/HomeQuickInfo");

const defaultHeroSlides = [
  {
    tag: "National & Social Service",
    badgeText: "जनसेवा ही संकल्प • पल्लवी पाल",
    headingPrefix: "एकता, स्वाभिमान और",
    highlightText: "सामाजिक न्याय",
    headingSuffix: "के लिए समर्पित निरंतर कदम",
    description:
      "पल्लवी पाल का जीवन और नेतृत्व समाज के कमजोर, वंचित और मेहनतकश वर्गों के सम्मान, संवैधानिक अधिकारों और सर्वांगीण विकास के लिए पूर्णतः समर्पित है।",
    imageUrl:
      "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1920&q=85",
    primaryBtnText: "जनसेवा से जुड़ें",
    primaryBtnLink: "#quickActionSidebar",
    primaryBtnInitiative: "",
    secondaryBtnText: "प्रमुख जनकल्याण पहल",
    secondaryBtnLink: "#what-we-do",
    secondaryBtnInitiative: "",
    order: 1,
    isActive: true,
  },
  {
    tag: "Grassroots Representation",
    badgeText: "सदन से सड़क तक जनता की मुखर आवाज",
    headingPrefix: "किसान, कामगार और",
    highlightText: "जनता के अधिकार",
    headingSuffix: "हमारी सर्वोच्च प्राथमिकता",
    description:
      "क्षेत्र के हर गांव और मोहल्ले में बुनियादी सुविधाओं, पक्की सड़कों, सुलभ स्वास्थ्य और किसानों के वाजिब हकों की रक्षा के लिए सतत संघर्ष।",
    imageUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=85",
    primaryBtnText: "जनसंवाद से जुड़ें",
    primaryBtnLink: "#initiativeAction",
    primaryBtnInitiative: "social-rights",
    secondaryBtnText: "हमारा सेवा संकल्प",
    secondaryBtnLink: "#why-choose",
    secondaryBtnInitiative: "",
    order: 2,
    isActive: true,
  },
  {
    tag: "Youth Empowerment",
    badgeText: "शिक्षा, कौशल विकास एवं प्रतियोगी परीक्षा मार्गदर्शन",
    headingPrefix: "हर होनहार युवा को मिले",
    highlightText: "सही अवसर और मार्गदर्शन",
    headingSuffix: "",
    description:
      "निशुल्क अध्ययन सामग्री, प्रतियोगी परीक्षा मार्गदर्शन सत्र और युवाओं के लिए रोजगार व स्वरोजगार के अवसरों का सृजन।",
    imageUrl:
      "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1920&q=85",
    primaryBtnText: "युवा प्रकोष्ठ संपर्क",
    primaryBtnLink: "#initiativeAction",
    primaryBtnInitiative: "youth-wing",
    secondaryBtnText: "कल्याणकारी योजनाएं",
    secondaryBtnLink: "#initiativeAction",
    secondaryBtnInitiative: "schemes-info",
    order: 3,
    isActive: true,
  },
];

const defaultInitiatives = [
  {
    key: "social-rights",
    cardTag: "संवैधानिक चेतना",
    title: "संवैधानिक अधिकार एवं सामाजिक न्याय",
    description:
      "संविधान प्रदत्त अधिकारों, समानता और जनकल्याणकारी योजनाओं की जानकारी सीधे आम नागरिकों तक पहुंचाना।",
    points: [
      "गांव-गांव में विधिक व प्रशासनिक मार्गदर्शन शिविर",
      "सामाजिक सुरक्षा और पेंशन योजनाओं का सुलभ लाभ",
    ],
    btnText: "सहयोग एवं सहभागिता",
    modalTag: "सामाजिक न्याय प्रकोष्ठ",
    modalTitle: "संवैधानिक अधिकार एवं सामाजिक न्याय प्रकोष्ठ",
    modalDescription:
      "पल्लवी पाल जनसेवा केंद्र के अंतर्गत संचालित प्रकोष्ठ, जो नागरिकों को विधिक सहायता, राशन, पेंशन व संवैधानिक सुरक्षा प्रदान करता है।",
    modalHighlights: [
      "सरकारी योजनाओं में प्रशासनिक रुकावटों का मौके पर समाधान।",
      "वंचित व कमजोर वर्गों के लिए नियमित कानूनी व सामाजिक मार्गदर्शन।",
      "सामाजिक सद्भाव और समानता के पक्ष में निरंतर जनजागरण अभियान।",
    ],
    helplineText: "अधिकार सहायता: +91 99553 09029",
    helplineTel: "+919955309029",
    formTitle: "सहयोग एवं समस्या समाधान फॉर्म",
    formSubmitText: "समस्या दर्ज करें",
    iconKey: "scale",
    order: 1,
    isActive: true,
  },
  {
    key: "youth-wing",
    cardTag: "शिक्षा एवं युवा",
    title: "युवा मेंटरशिप एवं छात्र प्रोत्साहन",
    description:
      "प्रतियोगी परीक्षाओं की तैयारी, छात्रवृत्ति मार्गदर्शन और कैरियर काउंसलिंग के माध्यम से युवाओं का भविष्य संवारना।",
    points: [
      "डिजिटल अध्ययन सामग्री व मार्गदर्शन सत्र",
      "प्रतियोगी परीक्षाओं (UPSC, UPPSC, SSC, पुलिस भर्ती) हेतु मार्गदर्शन",
    ],
    btnText: "युवा प्रकोष्ठ से जुड़ें",
    modalTag: "युवा एवं शिक्षा मंच",
    modalTitle: "युवा मार्गदर्शन एवं छात्र कल्याण केंद्र",
    modalDescription:
      "प्रतियोगी परीक्षाओं की तैयारी कर रहे विद्यार्थियों के लिए अनुभवी प्राध्यापकों व चयनित अधिकारियों के मार्गदर्शन की व्यवस्था।",
    modalHighlights: [
      "सफल प्रशासनिक अधिकारियों द्वारा निशुल्क कैरियर मार्गदर्शन सत्र।",
      "डिजिटल अध्ययन सामग्री और समसामयिकी पत्रिकाओं की सुलभता।",
      "आर्थिक रूप से कमजोर मेधावी विद्यार्थियों के लिए छात्रवृत्ति समन्वय।",
    ],
    helplineText: "युवा हेल्पलाइन: +91 99553 09029",
    helplineTel: "+919955309029",
    formTitle: "विद्यार्थी मार्गदर्शन आवेदन पत्र",
    formSubmitText: "मार्गदर्शन हेतु आवेदन करें",
    iconKey: "school",
    order: 2,
    isActive: true,
  },
  {
    key: "schemes-info",
    cardTag: "आर्थिक स्वावलंबन",
    title: "स्वरोजगार एवं किसान-कारीगर कल्याण",
    description:
      "सरकारी सब्सिडी, सूक्ष्म उद्यम ऋण, कृषि सहायता और स्थानीय कारीगरों के लिए व्यापक आर्थिक सहयोग।",
    points: [
      "किसान क्रेडिट कार्ड व कृषि अनुदान में सहयोग",
      "महिला स्वयं सहायता समूहों का गठन व वित्तीय सशक्तिकरण",
    ],
    btnText: "कल्याण योजनाएं देखें",
    modalTag: "स्वरोजगार व विकास केंद्र",
    modalTitle: "स्वरोजगार, कृषि एवं आजीविका योजनाएं",
    modalDescription:
      "केंद्र व राज्य सरकार की विभिन्न जनकल्याणकारी योजनाओं का सीधा लाभ किसानों, छोटे व्यापारियों और कारीगरों तक पहुंचाना।",
    modalHighlights: [
      "कृषि उपकरण, सोलर पंप व बीज अनुदान योजनाओं की सटीक जानकारी।",
      "मुद्रा लोन, पीएम स्वनिधि व एमएसएमई योजनाओं में आवेदन सहयोग।",
      "महिला स्वयं सहायता समूहों को वित्तीय व तकनीकी प्रशिक्षण।",
    ],
    helplineText: "योजना परामर्श: +91 99553 09029",
    helplineTel: "+919955309029",
    formTitle: "योजना सहायता अनुरोध फॉर्म",
    formSubmitText: "जानकारी व सहयोग मांगें",
    iconKey: "trending",
    order: 3,
    isActive: true,
  },
  {
    key: "river-rights",
    cardTag: "पर्यावरण व जल-संरक्षण",
    title: "पर्यावरण संरक्षण एवं जल-संसाधन सुरक्षा",
    description:
      "नदियों, जलाशयों की स्वच्छता, हरित क्षेत्र विस्तार और ग्रामीण जल-निकासी व्यवस्था का सुदृढ़ीकरण।",
    points: [
      "नदी तट एवं तालाब स्वच्छता अभियान",
      "पौधारोपण एवं जल-संरक्षण जनजागरण रैलियां",
    ],
    btnText: "अभियान में भाग लें",
    modalTag: "पर्यावरण सुरक्षा विंग",
    modalTitle: "पर्यावरण, नदी संरक्षण एवं हरित क्षेत्र अभियान",
    modalDescription:
      "स्वच्छ और हरित पर्यावरण के निर्माण हेतु जनसहभागिता के साथ नदी तटों, पोखरों की सुरक्षा और व्यापक पौधारोपण।",
    modalHighlights: [
      "क्षेत्र के प्रमुख जलस्रोतों और घाटों पर नियमित स्वच्छता अभियान।",
      "ग्रामीण क्षेत्रों में तालाबों के पुनरुद्धार हेतु प्रशासनिक पैरवी।",
      "स्कूली बच्चों व युवाओं के साथ पर्यावरण चेतना कार्यशालाएं।",
    ],
    helplineText: "पर्यावरण स्वयंसेवक सेल: +91 99553 09029",
    helplineTel: "+919955309029",
    formTitle: "पर्यावरण स्वयंसेवक पंजीकरण",
    formSubmitText: "सहभागिता दर्ज करें",
    iconKey: "water",
    order: 4,
    isActive: true,
  },
  {
    key: "disaster-relief",
    cardTag: "जनसेवा व स्वास्थ्य",
    title: "आपातकालीन राहत एवं निशुल्क स्वास्थ्य शिविर",
    description:
      "बाढ़, प्राकृतिक आपदाओं या चिकित्सा संकट के समय तुरंत राशन, दवाइयां और स्वास्थ्य परामर्श उपलब्ध कराना।",
    points: [
      "24x7 सक्रिय स्वयंसेवक राहत दल",
      "गांव-गांव में निशुल्क स्वास्थ्य जांच व दवा वितरण शिविर",
    ],
    btnText: "राहत दल से जुड़ें",
    modalTag: "आपदा सेवा एवं चिकित्सा प्रकोष्ठ",
    modalTitle: "आपातकालीन राहत एवं स्वास्थ्य सेवा प्रकोष्ठ",
    modalDescription:
      "जरूरतमंद परिवारों को संकट के समय खाद्य सामग्री, शुद्ध पेयजल, चिकित्सा सहायता और राहत पहुंचाने वाली समर्पित टीम।",
    modalHighlights: [
      "प्रभावित परिवारों तक तत्काल सूखा राशन, दवाएं व आवश्यक राहत सामग्री।",
      "अनुभवी चिकित्सकों के सहयोग से ग्रामीण क्षेत्रों में स्वास्थ्य शिविर।",
      "गंभीर बीमारियों के इलाज हेतु मुख्यमंत्री राहत कोष से सहयोग की पहल।",
    ],
    helplineText: "आपातकालीन हेल्पलाइन: +91 99553 09029",
    helplineTel: "+919955309029",
    formTitle: "स्वास्थ्य / राहत सहायता आवेदन फॉर्म",
    formSubmitText: "सहायता हेतु अनुरोध भेजें",
    iconKey: "hospital",
    order: 5,
    isActive: true,
  },
  {
    key: "cultural-events",
    cardTag: "संस्कृति एवं विरासत",
    title: "ऐतिहासिक गौरव एवं सामाजिक समरसता",
    description:
      "महापुरुषों की गौरवशाली विरासत, स्वतंत्रता संग्राम के वीरों का सम्मान और सामाजिक भाईचारे का संवर्धन।",
    points: [
      "वार्षिक सामाजिक समरसता सम्मेलन एवं उत्सव",
      "क्षेत्र के वरिष्ठ नागरिकों और स्वतंत्रता संग्राम सेनानियों का सम्मान",
    ],
    btnText: "सांस्कृतिक कार्यक्रम विवरण",
    modalTag: "सांस्कृतिक एवं विरासत प्रकोष्ठ",
    modalTitle: "सामाजिक सद्भाव एवं सांस्कृतिक विरासत प्रकोष्ठ",
    modalDescription:
      "संविधान निर्माताओं, अमर शहीदों और ऐतिहासिक विभूतियों के आदर्शों को जन-जन तक पहुंचाना और सांस्कृतिक एकता मजबूत करना।",
    modalHighlights: [
      "महापुरुषों की जयंतियों पर विचार गोष्ठियां व प्रेरणादायक व्याख्यान।",
      "शिक्षा, खेलकूद व समाज सेवा में उत्कृष्ट योगदान देने वालों का अभिनंदन।",
      "पारस्परिक सद्भाव और सांस्कृतिक एकता के प्रसार हेतु मंच।",
    ],
    helplineText: "सांस्कृतिक समिति: +91 99553 09029",
    helplineTel: "+919955309029",
    formTitle: "कार्यक्रम सहभागिता / निमंत्रण अनुरोध",
    formSubmitText: "कार्यक्रम विवरण प्राप्त करें",
    iconKey: "flag",
    order: 6,
    isActive: true,
  },
];

const defaultWhyChoose = {
  sectionTag: "पारदर्शिता एवं समर्पण",
  sectionTitle: "क्यों चुनें",
  highlightText: "पल्लवी पाल?",
  sectionSubtitle:
    "हमारा ध्येय केवल राजनीति नहीं, बल्कि समाज के अंतिम पंक्ति के व्यक्ति तक शिक्षा, स्वाभिमान, न्याय और विकास की रोशनी पहुंचाना है।",
  introHeading: "जमीनी हकीकत और अटूट निष्ठा पर टिकी जनसेवा की नींव",
  introDesc:
    "निरंतर संघर्ष और संवेदनशील जनसेवा के बल पर हमने जनता का अटूट विश्वास अर्जित किया है। हर सुख-दुख में आपके साथ खड़े रहना ही हमारी प्रेरणा है।",
  pillars: [
    {
      title: "100% सक्रिय जमीनी उपस्थिति",
      description:
        "कागजी वादों के बजाय गांवों, कस्बों और चौपालों में प्रत्यक्ष बैठकर समस्याओं का वास्तविक समाधान।",
      iconKey: "shield",
      order: 1,
    },
    {
      title: "पारदर्शी एवं उत्तरदायी नेतृत्व",
      description:
        "सदन से सड़क तक जनता के मुद्दों को पूरी निष्पक्षता, निर्भीकता और ईमानदारी से उठाना।",
      iconKey: "users",
      order: 2,
    },
    {
      title: "त्वरित जन-सुनवाई एवं राहत",
      description:
        "प्रशासनिक सहयोग से जनसमस्याओं, छात्रवृत्ति, पेंशन और चिकित्सा सहायता का समयबद्ध निवारण।",
      iconKey: "check",
      order: 3,
    },
    {
      title: "सांस्कृतिक गौरव व आधुनिक दृष्टिकोण",
      description:
        "अपनी महान विरासत पर गर्व करते हुए नई पीढ़ी को आधुनिक शिक्षा, विज्ञान व तकनीक में अग्रणी बनाना।",
      iconKey: "award",
      order: 4,
    },
  ],
  quoteText:
    "जब समाज के हर वर्ग के हाथ एक संकल्प के साथ जुड़ते हैं, तो बदलाव की नई इबारत लिखी जाती है। जनसेवा ही मेरी वास्तविक पहचान है।",
  pledgePoints: [
    "निःशुल्क जन-सुनवाई और जनसहभागिता केंद्र",
    "गांव, ब्लॉक और वार्ड स्तर पर सीधे संवाद चौपाल",
    "छात्रों व युवाओं के लिए निरंतर मार्गदर्शन सत्र",
    "संकट और आपदा के समय त्वरित स्वयंसेवक सहायता",
  ],
  pledgeBtnText: "जनसेवा से जुड़ें",
  pledgeBtnLink: "#quickActionSidebar",
};

const defaultNotices = [
  {
    title: "युवा मार्गदर्शन शिविर: प्रतियोगी परीक्षाओं की निशुल्क तैयारी व कैरियर काउंसलिंग।",
    dateText: "September 28, 2026",
    link: "",
    order: 1,
    isActive: true,
  },
  {
    title: "क्षेत्रीय जनसंवाद एवं विकास चौपाल: आम नागरिकों की समस्याओं का त्वरित निस्तारण।",
    dateText: "October 02, 2026",
    link: "",
    order: 2,
    isActive: true,
  },
];

const defaultQuickInfo = {
  sidebarTitle: "पल्लवी पाल",
  sidebarSubtitle: "जनसेवा एवं संपर्क केंद्र",
  pledgeBoxTitle: "जनसेवा व सामाजिक सरोकार से जुड़ें",
  pledgeBoxDesc:
    "शिक्षा, सामाजिक न्याय एवं जनहित के कार्यों में अपनी सहभागिता दर्ज करें।",
  helplineText: "Helpline: +91 99553 09029",
  helplineTel: "+919955309029",
  email: "pallvipal.official@gmail.com",
  sidebarFooterText: "जनसेवा ही हमारा संकल्प है",
};

const seedHomeData = async () => {
  // Explicitly disabled: do not automatically re-seed home data.
  // Database data remains exactly as managed by the user.
  return;
};

module.exports = {
  seedHomeData,
  defaultHeroSlides,
  defaultInitiatives,
  defaultWhyChoose,
  defaultNotices,
  defaultQuickInfo,
};
