const AboutPage = require("../models/AboutPage");

// Render Public About Page (Pallavi Pal, Samajwadi Party Leader)
exports.getAboutPage = async (req, res) => {
  try {
    const about = await AboutPage.getOrSeed();

    const title = about.profile?.name 
      ? `${about.profile.name} | ${about.profile.designation || 'समाजवादी पार्टी नेत्री'}`
      : "पल्लवी पाल | समाजवादी पार्टी नेत्री";

    const metaDescription = about.profile?.shortIntro || 
      "पल्लवी पाल - समाजवादी पार्टी नेत्री, सामाजिक न्याय एवं जनसेवा के प्रति समर्पित राजनीतिक नेतृत्व।";

    res.render("about", {
      title,
      metaDescription,
      about,
      currentUrl: "/about",
    });
  } catch (error) {
    console.error("Public About Page render error:", error);
    res.render("about", {
      title: "पल्लवी पाल | समाजवादी पार्टी नेत्री",
      metaDescription: "पल्लवी पाल - समाजवादी पार्टी नेत्री, सामाजिक न्याय एवं जनसेवा के प्रति समर्पित राजनीतिक नेतृत्व।",
      about: AboutPage.defaultData,
      currentUrl: "/about",
    });
  }
};
