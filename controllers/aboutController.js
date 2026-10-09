const AboutPage = require("../models/AboutPage");

// Render Public About Page
exports.getAboutPage = async (req, res) => {
  try {
    const about = await AboutPage.getOrSeed();

    res.render("about", {
      title: about.meta.pageTitle || "जीवन परिचय एवं जनसेवा यात्रा | पल्लवी पाल",
      metaDescription: about.meta.pageSubtitle || "जनप्रतिनिधि, जनसेवा और सामाजिक न्याय का निरंतर संघर्ष",
      about,
      currentUrl: "/about",
    });
  } catch (error) {
    console.error("Public About Page render error:", error);
    res.render("about", {
      title: "जीवन परिचय एवं जनसेवा यात्रा | पल्लवी पाल",
      metaDescription: "जनप्रतिनिधि, जनसेवा और सामाजिक न्याय का निरंतर संघर्ष",
      about: AboutPage.defaultData,
      currentUrl: "/about",
    });
  }
};
