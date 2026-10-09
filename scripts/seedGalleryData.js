const SankalpPhoto = require("../models/SankalpPhoto");

const defaultGalleryPhotos = [
  {
    name: "रामवृक्ष शर्मा",
    district: "गोरखपुर",
    date: new Date("2026-09-20"),
    dateString: "September 20, 2026",
    caption: "पल्लवी पाल जनसंवाद कार्यक्रम में जनसमस्याओं और शिक्षा पर चर्चा।",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 1,
  },
  {
    name: "सुरेश पटेल",
    district: "वाराणसी",
    date: new Date("2026-09-22"),
    dateString: "September 22, 2026",
    caption: "दशाश्वमेध घाट पर सामाजिक समरसता, स्वच्छता और युवा मार्गदर्शन सत्र।",
    imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 2,
  },
  {
    name: "अमित कुमार",
    district: "प्रयागराज",
    date: new Date("2026-09-23"),
    dateString: "September 23, 2026",
    caption: "संगम तट पर युवा संवाद और प्रतियोगी परीक्षाओं हेतु मार्गदर्शन शिविर।",
    imageUrl: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 3,
  },
  {
    name: "दिनेश मौर्य",
    district: "अयोध्या",
    date: new Date("2026-09-24"),
    dateString: "September 24, 2026",
    caption: "सरयू तट पर जनहित और जनसेवा के संकल्प के साथ नागरिकों का संगम।",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 4,
  },
  {
    name: "राजेश यादव",
    district: "गाजीपुर",
    date: new Date("2026-09-25"),
    dateString: "September 25, 2026",
    caption: "गांव चौपाल में किसानों और युवाओं के साथ सीधा जनसंवाद कार्यक्रम।",
    imageUrl: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 5,
  },
  {
    name: "सुनील वर्मा",
    district: "मिर्जापुर",
    date: new Date("2026-09-26"),
    dateString: "September 26, 2026",
    caption: "विंध्याचल क्षेत्र में जन-कल्याण एवं स्वास्थ्य सहायता शिविर का आयोजन।",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 6,
  },
  {
    name: "विकास कुमार",
    district: "लखनऊ",
    date: new Date("2026-09-27"),
    dateString: "September 27, 2026",
    caption: "राजधानी लखनऊ में युवा सम्मेलन एवं मेधावी प्रतिभा सम्मान समारोह।",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 7,
  },
  {
    name: "पंकज कुमार",
    district: "बलिया",
    date: new Date("2026-09-28"),
    dateString: "September 28, 2026",
    caption: "क्रांतिकारी बलिया में युवा स्वावलंबन एवं जनचेतना सम्मेलन।",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 8,
  },
  {
    name: "महेंद्र पाल",
    district: "कानपुर",
    date: new Date("2026-09-28"),
    dateString: "September 28, 2026",
    caption: "गंगा बैराज पर किसान व कामगार कल्याण चौपाल का सफल आयोजन।",
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80",
    isPublished: true,
    order: 9,
  }
];

const seedGalleryData = async () => {
  try {
    const count = await SankalpPhoto.countDocuments();
    if (count === 0) {
      await SankalpPhoto.insertMany(defaultGalleryPhotos);
    }
  } catch (error) {
    console.error("Gallery data seed error:", error.message);
  }
};

module.exports = {
  seedGalleryData,
  defaultGalleryPhotos,
};
