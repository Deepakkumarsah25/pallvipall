const SankalpPhoto = require("../models/SankalpPhoto");

const defaultGalleryPhotos = [
  // Page 1 (Items 1-9)
  {
    name: "सिराथू विधानसभा क्षेत्र में विशाल जनसंवाद चौपाल",
    district: "सिराथू, कौशाम्बी",
    date: new Date("2026-09-20"),
    dateString: "September 20, 2026",
    caption: "ग्रामवासियों, किसानों और मातृशक्ति के साथ सीधा संवाद कर स्थानीय विकास प्राथमिकताओं पर विस्तृत चर्चा।",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 1,
  },
  {
    name: "दशाश्वमेध घाट पर सामाजिक समरसता सम्मेलन",
    district: "वाराणसी",
    date: new Date("2026-09-22"),
    dateString: "September 22, 2026",
    caption: "सामाजिक एकता, पर्यावरण संरक्षण और युवा स्वावलंबन के पावन संकल्प के साथ ऐतिहासिक सहभागिता।",
    imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 2,
  },
  {
    name: "संगम नगरी प्रयागराज में युवा मेधावी सम्मान समारोह",
    district: "प्रयागराज",
    date: new Date("2026-09-23"),
    dateString: "September 23, 2026",
    caption: "प्रतियोगी परीक्षाओं में उत्कृष्ट प्रदर्शन करने वाले छात्र-छात्राओं और युवाओं का गरिमामय अभिनंदन।",
    imageUrl: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 3,
  },
  {
    name: "अयोध्या धाम में नागरिक अभिनंदन एवं जनसुनवाई",
    district: "अयोध्या",
    date: new Date("2026-09-24"),
    dateString: "September 24, 2026",
    caption: "नागरिकों और प्रबुद्धजनों के साथ विचार विमर्श एवं जनहितैषी योजनाओं पर संवाद।",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 4,
  },
  {
    name: "गाजीपुर ग्रामीण अंचल में किसान समृद्धि चौपाल",
    district: "गाजीपुर",
    date: new Date("2026-09-25"),
    dateString: "September 25, 2026",
    caption: "सिंचाई, उन्नत बीज, फसल बीमा और खाद वितरण की समस्याओं पर किसानों के साथ जमीनी संवाद।",
    imageUrl: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 5,
  },
  {
    name: "विंध्याचल अंचल में स्वास्थ्य सहायता एवं जनसेवा शिविर",
    district: "मिर्जापुर",
    date: new Date("2026-09-26"),
    dateString: "September 26, 2026",
    caption: "निःशुल्क स्वास्थ्य परीक्षण, दवा वितरण और जरूरतमंद परिवारों को सहायता उपलब्ध कराने का पुनीत कार्य।",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 6,
  },
  {
    name: "राजधानी लखनऊ में महिला सशक्तिकरण संगोष्ठी",
    district: "लखनऊ",
    date: new Date("2026-09-27"),
    dateString: "September 27, 2026",
    caption: "स्वयं सहायता समूहों की बहनों के आत्मनिर्भरता प्रयासों और आर्थिक संबल पर प्रेरक संवाद।",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 7,
  },
  {
    name: "क्रांतिकारी बलिया में युवा स्वावलंबन सम्मेलन",
    district: "बलिया",
    date: new Date("2026-09-28"),
    dateString: "September 28, 2026",
    caption: "रोजगार, कौशल विकास और शिक्षा के अवसरों के विस्तार हेतु युवाओं के साथ विचार साझा किए गए।",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 8,
  },
  {
    name: "गंगा बैराज कानपुर में कामगार कल्याण बैठक",
    district: "कानपुर",
    date: new Date("2026-09-28"),
    dateString: "September 28, 2026",
    caption: "असंगठित क्षेत्र के श्रमिकों और कामगारों के सामाजिक सुरक्षा अधिकारों पर विस्तृत चर्चा।",
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 9,
  },

  // Page 2 (Items 10-18)
  {
    name: "कौशाम्बी मुख्यालय में जनशिकायत निवारण शिविर",
    district: "कौशाम्बी",
    date: new Date("2026-09-29"),
    dateString: "September 29, 2026",
    caption: "क्षेत्रवासियों की पेयजल, सड़क और बिजली से संबंधित समस्याओं को अधिकारियों के समक्ष रख निस्तारण कराया गया।",
    imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 10,
  },
  {
    name: "फतेहपुर में ग्रामीण संपर्क मार्ग लोकार्पण एवं संवाद",
    district: "फतेहपुर",
    date: new Date("2026-09-30"),
    dateString: "September 30, 2026",
    caption: "ग्रामीण क्षेत्रों को मुख्य मार्ग से जोड़ने वाली विकास परियोजनाओं की प्रगति का जायजा।",
    imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 11,
  },
  {
    name: "प्रतापगढ़ में किसान गोष्ठी एवं बीज वितरण कार्यक्रम",
    district: "प्रतापगढ़",
    date: new Date("2026-10-01"),
    dateString: "October 01, 2026",
    caption: "आंवला उत्पादक किसानों और कृषि आधारित लघु उद्योगों के प्रोत्साहन हेतु संवाद।",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 12,
  },
  {
    name: "रायबरेली में सामाजिक सरोकार एवं जनसुनवाई कार्यक्रम",
    district: "रायबरेली",
    date: new Date("2026-10-02"),
    dateString: "October 02, 2026",
    caption: "गांधी जयंती पर स्वच्छता अभियान एवं वंचित वर्गों के उत्थान हेतु सामूहिक शपथ ग्रहण।",
    imageUrl: "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 13,
  },
  {
    name: "अमेठी में बालिका शिक्षा प्रोत्साहन सम्मेलन",
    district: "अमेठी",
    date: new Date("2026-10-03"),
    dateString: "October 03, 2026",
    caption: "बेटियों की उच्च शिक्षा, कंप्यूटर साक्षरता और खेल प्रतिभाओं को मंच देने का संकल्प।",
    imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 14,
  },
  {
    name: "सुल्तानपुर में स्थानीय व्यापार मंडल के साथ परिचर्चा",
    district: "सुल्तानपुर",
    date: new Date("2026-10-04"),
    dateString: "October 04, 2026",
    caption: "लघु व्यापारियों, पटरी दुकानदारों और स्वरोजगारियों के हितों के संवर्धन पर विचार-विमर्श।",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 15,
  },
  {
    name: "जौनपुर में ऐतिहासिक धरोहर संरक्षण एवं विचार गोष्ठी",
    district: "जौनपुर",
    date: new Date("2026-10-05"),
    dateString: "October 05, 2026",
    caption: "सांस्कृतिक विरासत, गोमती नदी स्वच्छता एवं लोककलाओं को बढ़ावा देने हेतु विशेष सत्र।",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 16,
  },
  {
    name: "भदोही में कालीन बुनकर समुदाय के साथ जनसंवाद",
    district: "भदोही",
    date: new Date("2026-10-06"),
    dateString: "October 06, 2026",
    caption: "हस्तशिल्प, बुनकर कल्याणकारी योजनाओं और निर्यात प्रोत्साहन पर बुनकर परिवारों से मुलाकात।",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 17,
  },
  {
    name: "चंदौली में सीमांत किसानों के साथ चौपाल",
    district: "चंदौली",
    date: new Date("2026-10-07"),
    dateString: "October 07, 2026",
    caption: "धान के कटोरे कहे जाने वाले चंदौली में उन्नत तकनीक और जल प्रबंधन पर चर्चा।",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 18,
  },

  // Page 3 (Items 19-27)
  {
    name: "सिराथू कड़ा धाम में दर्शन एवं श्रद्धालु जनसेवा",
    district: "सिराथू, कौशाम्बी",
    date: new Date("2026-10-08"),
    dateString: "October 08, 2026",
    caption: "मां शीतला धाम कड़ा में दर्शन उपरांत तीर्थ क्षेत्र विकास व स्थानीय जनसमस्याओं पर मंथन।",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 19,
  },
  {
    name: "मंझनपुर में विकास कार्यों की समीक्षा एवं जनसंवाद",
    district: "कौशाम्बी",
    date: new Date("2026-10-08"),
    dateString: "October 08, 2026",
    caption: "जिला मुख्यालय मंझनपुर में नागरिकों, सामाजिक कार्यकर्ताओं के साथ निरंतर सक्रियता।",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 20,
  },
  {
    name: "लखनऊ विधानसभा परिसर में जनसरोकार पर संवाद",
    district: "लखनऊ",
    date: new Date("2026-10-09"),
    dateString: "October 09, 2026",
    caption: "विधानसभा में जनहित के प्रमुख मुद्दों को मुखरता से उठाने एवं विकास नीतियों पर चर्चा।",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 21,
  }
];

const seedGalleryData = async () => {
  try {
    const count = await SankalpPhoto.countDocuments();
    if (count < 9) {
      await SankalpPhoto.deleteMany({});
      await SankalpPhoto.insertMany(defaultGalleryPhotos);
      console.log(`Seeded ${defaultGalleryPhotos.length} gallery photos.`);
    }
  } catch (error) {
    console.error("Gallery data seed error:", error.message);
  }
};

module.exports = {
  seedGalleryData,
  defaultGalleryPhotos,
};
