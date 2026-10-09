const AboutPage = require("../../models/AboutPage");
const { uploadBuffer } = require("../../config/cloudinary");

const uploadAboutFiles = async (files = []) => {
  const urls = new Map();
  for (const file of files) {
    const uploaded = await uploadBuffer(file.buffer, "pallavi-pal/about");
    urls.set(file.fieldname, uploaded.secure_url);
  }
  return urls;
};

const resolveImagePath = async (req, fieldName, fallback) => {
  const file = req.file?.fieldname === fieldName
    ? req.file
    : Array.isArray(req.files)
      ? req.files.find((entry) => entry.fieldname === fieldName)
      : null;
  if (file?.buffer) {
    const uploaded = await uploadBuffer(file.buffer, "pallavi-pal/about");
    return uploaded.secure_url;
  }
  if (req.body && req.body[fieldName] && req.body[fieldName].trim() !== "") {
    return req.body[fieldName].trim();
  }
  return fallback || "";
};

// 1. Render About Manager View
exports.getAboutManager = async (req, res) => {
  try {
    const about = await AboutPage.getOrSeed();
    const activeTab = req.query.tab || "meta";

    res.render("admin/about/index", {
      title: "About Page Manager",
      admin: req.session.admin,
      about,
      activeTab,
      currentPath: "/admin/about",
      message: req.query.msg || null,
      error: req.query.err || null,
    });
  } catch (error) {
    console.error("Fetch About Manager error:", error);
    res.status(500).redirect("/admin/dashboard?err=" + encodeURIComponent("Error loading about page data."));
  }
};

// 2. Update Meta (Page Title & Subtitle only)
exports.postUpdateMeta = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { pageTitle, pageSubtitle } = req.body;

    if (pageTitle) doc.meta.pageTitle = pageTitle.trim();
    if (pageSubtitle) doc.meta.pageSubtitle = pageSubtitle.trim();

    await doc.save();
    res.redirect("/admin/about?tab=meta&msg=" + encodeURIComponent("Header settings updated successfully."));
  } catch (error) {
    console.error("Update Meta error:", error);
    res.redirect("/admin/about?tab=meta&err=" + encodeURIComponent(error.message));
  }
};

// 3. Update Point 1: Objective (अभियान का उद्देश्य)
exports.postUpdateObjective = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { navTitle, title, description } = req.body;

    if (navTitle) doc.objective.navTitle = navTitle.trim();
    if (title) doc.objective.title = title.trim();
    if (description) doc.objective.description = description.trim();

    const points = [];
    if (req.body.point_title && Array.isArray(req.body.point_title)) {
      for (let i = 0; i < req.body.point_title.length; i++) {
        if (req.body.point_title[i] && req.body.point_title[i].trim()) {
          points.push({
            title: req.body.point_title[i].trim(),
            desc: (req.body.point_desc && req.body.point_desc[i]) ? req.body.point_desc[i].trim() : "",
          });
        }
      }
    } else if (req.body.point_title && typeof req.body.point_title === "string") {
      points.push({
        title: req.body.point_title.trim(),
        desc: req.body.point_desc ? req.body.point_desc.trim() : "",
      });
    }
    if (points.length > 0) doc.objective.points = points;

    await doc.save();
    res.redirect("/admin/about?tab=objective&msg=" + encodeURIComponent("Objective section updated successfully."));
  } catch (error) {
    console.error("Update Objective error:", error);
    res.redirect("/admin/about?tab=objective&err=" + encodeURIComponent(error.message));
  }
};

// 4. Update Point 2: Mission (मिशन)
exports.postUpdateMission = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { navTitle, title, description } = req.body;

    if (navTitle) doc.mission.navTitle = navTitle.trim();
    if (title) doc.mission.title = title.trim();
    if (description) doc.mission.description = description.trim();

    const pillars = [];
    if (req.body.pillar_title && Array.isArray(req.body.pillar_title)) {
      for (let i = 0; i < req.body.pillar_title.length; i++) {
        if (req.body.pillar_title[i] && req.body.pillar_title[i].trim()) {
          pillars.push({
            title: req.body.pillar_title[i].trim(),
            desc: (req.body.pillar_desc && req.body.pillar_desc[i]) ? req.body.pillar_desc[i].trim() : "",
          });
        }
      }
    } else if (req.body.pillar_title && typeof req.body.pillar_title === "string") {
      pillars.push({
        title: req.body.pillar_title.trim(),
        desc: req.body.pillar_desc ? req.body.pillar_desc.trim() : "",
      });
    }
    if (pillars.length > 0) doc.mission.pillars = pillars;

    await doc.save();
    res.redirect("/admin/about?tab=mission&msg=" + encodeURIComponent("Mission section updated successfully."));
  } catch (error) {
    console.error("Update Mission error:", error);
    res.redirect("/admin/about?tab=mission&err=" + encodeURIComponent(error.message));
  }
};

// 5. Update Point 3: Vision (दृष्टिकोण - UI Displays Photo)
exports.postUpdateVision = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { navTitle, title, description, image } = req.body;

    if (navTitle) doc.vision.navTitle = navTitle.trim();
    if (title) doc.vision.title = title.trim();
    if (description) doc.vision.description = description.trim();

    // Photo: Uploaded file takes precedence, then entered URL, then fallback
    if (req.file && req.file.buffer) {
      const uploaded = await uploadBuffer(req.file.buffer, "nishad-yatra/about");
      doc.vision.image = uploaded.secure_url;
    } else if (image && image.trim()) {
      doc.vision.image = image.trim();
    }

    const visionPoints = [];
    if (req.body.vp_title && Array.isArray(req.body.vp_title)) {
      for (let i = 0; i < req.body.vp_title.length; i++) {
        if (req.body.vp_title[i] && req.body.vp_title[i].trim()) {
          visionPoints.push({
            title: req.body.vp_title[i].trim(),
            desc: (req.body.vp_desc && req.body.vp_desc[i]) ? req.body.vp_desc[i].trim() : "",
          });
        }
      }
    } else if (req.body.vp_title && typeof req.body.vp_title === "string") {
      visionPoints.push({
        title: req.body.vp_title.trim(),
        desc: req.body.vp_desc ? req.body.vp_desc.trim() : "",
      });
    }
    if (visionPoints.length > 0) doc.vision.visionPoints = visionPoints;

    await doc.save();
    res.redirect("/admin/about?tab=vision&msg=" + encodeURIComponent("Vision section updated successfully."));
  } catch (error) {
    console.error("Update Vision error:", error);
    res.redirect("/admin/about?tab=vision&err=" + encodeURIComponent(error.message));
  }
};

// 6. Update Point 4: Background (अभियान की पृष्ठभूमि)
exports.postUpdateBackground = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { navTitle, title, description } = req.body;

    if (navTitle) doc.background.navTitle = navTitle.trim();
    if (title) doc.background.title = title.trim();
    if (description) doc.background.description = description.trim();

    const timeline = [];
    if (req.body.time_phase && Array.isArray(req.body.time_phase)) {
      for (let i = 0; i < req.body.time_phase.length; i++) {
        if (req.body.time_title && req.body.time_title[i]) {
          timeline.push({
            phase: req.body.time_phase[i].trim(),
            title: req.body.time_title[i].trim(),
            desc: (req.body.time_desc && req.body.time_desc[i]) ? req.body.time_desc[i].trim() : "",
          });
        }
      }
    } else if (req.body.time_phase && typeof req.body.time_phase === "string") {
      timeline.push({
        phase: req.body.time_phase.trim(),
        title: req.body.time_title ? req.body.time_title.trim() : "",
        desc: req.body.time_desc ? req.body.time_desc.trim() : "",
      });
    }
    if (timeline.length > 0) doc.background.timeline = timeline;

    await doc.save();
    res.redirect("/admin/about?tab=background&msg=" + encodeURIComponent("Background section updated successfully."));
  } catch (error) {
    console.error("Update Background error:", error);
    res.redirect("/admin/about?tab=background&err=" + encodeURIComponent(error.message));
  }
};

// 7. Update Point 5: Reservation (आरक्षण संकल्प अभियान)
exports.postUpdateReservation = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { navTitle, title, description } = req.body;

    if (navTitle) doc.reservation.navTitle = navTitle.trim();
    if (title) doc.reservation.title = title.trim();
    if (description) doc.reservation.description = description.trim();

    const keyDemands = [];
    if (req.body.demand_title && Array.isArray(req.body.demand_title)) {
      for (let i = 0; i < req.body.demand_title.length; i++) {
        if (req.body.demand_title[i] && req.body.demand_title[i].trim()) {
          keyDemands.push({
            title: req.body.demand_title[i].trim(),
            desc: (req.body.demand_desc && req.body.demand_desc[i]) ? req.body.demand_desc[i].trim() : "",
            tag: (req.body.demand_tag && req.body.demand_tag[i]) ? req.body.demand_tag[i].trim() : "मांग",
          });
        }
      }
    } else if (req.body.demand_title && typeof req.body.demand_title === "string") {
      keyDemands.push({
        title: req.body.demand_title.trim(),
        desc: req.body.demand_desc ? req.body.demand_desc.trim() : "",
        tag: req.body.demand_tag ? req.body.demand_tag.trim() : "मांग",
      });
    }
    if (keyDemands.length > 0) doc.reservation.keyDemands = keyDemands;

    await doc.save();
    res.redirect("/admin/about?tab=reservation&msg=" + encodeURIComponent("Reservation info updated successfully."));
  } catch (error) {
    console.error("Update Reservation error:", error);
    res.redirect("/admin/about?tab=reservation&err=" + encodeURIComponent(error.message));
  }
};

// 8. Update Point 6: Activities (प्रमुख गतिविधियां - UI Displays Activity Photos)
exports.postUpdateActivities = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const uploadedUrls = await uploadAboutFiles(req.files);
    const { navTitle, title, description } = req.body;

    if (navTitle) doc.activities.navTitle = navTitle.trim();
    if (title) doc.activities.title = title.trim();
    if (description) doc.activities.description = description.trim();

    // Showcase photo (URL or uploaded file)
    if (req.body.image) {
      doc.activities.image = req.body.image.trim();
    }
    if (req.files && Array.isArray(req.files)) {
      doc.activities.image = uploadedUrls.get("imageFile") || uploadedUrls.get("image") || doc.activities.image;
    }

    // Detail section beside/below photo
    if (req.body.detailTitle !== undefined) {
      doc.activities.detailTitle = req.body.detailTitle.trim();
    }
    if (req.body.detailDescription !== undefined) {
      doc.activities.detailDescription = req.body.detailDescription.trim();
    }

    // Detail points (3 highlights)
    const detailPoints = [];
    if (req.body.detail_point_title && Array.isArray(req.body.detail_point_title)) {
      for (let i = 0; i < req.body.detail_point_title.length; i++) {
        if (req.body.detail_point_title[i] && req.body.detail_point_title[i].trim()) {
          detailPoints.push({
            title: req.body.detail_point_title[i].trim(),
            desc: (req.body.detail_point_desc && req.body.detail_point_desc[i]) ? req.body.detail_point_desc[i].trim() : "",
          });
        }
      }
    } else if (req.body.detail_point_title && typeof req.body.detail_point_title === "string" && req.body.detail_point_title.trim()) {
      detailPoints.push({
        title: req.body.detail_point_title.trim(),
        desc: req.body.detail_point_desc ? req.body.detail_point_desc.trim() : "",
      });
    }
    if (detailPoints.length > 0) {
      doc.activities.detailPoints = detailPoints;
    }

    const activityList = [];
    if (req.body.act_name && Array.isArray(req.body.act_name)) {
      for (let i = 0; i < req.body.act_name.length; i++) {
        if (req.body.act_name[i] && req.body.act_name[i].trim()) {
          let itemImage = (req.body.act_image && req.body.act_image[i]) ? req.body.act_image[i].trim() : "/images/about/pallavi-pal-hero.jpg";

          // Check if a file was uploaded for this card
          if (req.files && Array.isArray(req.files)) {
            itemImage = uploadedUrls.get(`act_file_${i}`) || itemImage;
          }

          activityList.push({
            name: req.body.act_name[i].trim(),
            tag: (req.body.act_tag && req.body.act_tag[i]) ? req.body.act_tag[i].trim() : "",
            desc: (req.body.act_desc && req.body.act_desc[i]) ? req.body.act_desc[i].trim() : "",
            image: itemImage,
          });
        }
      }
    } else if (req.body.act_name && typeof req.body.act_name === "string") {
      let itemImage = req.body.act_image ? req.body.act_image.trim() : "/images/about/pallavi-pal-hero.jpg";
      if (req.files && Array.isArray(req.files)) {
        itemImage = uploadedUrls.get("act_file_0") || itemImage;
      }
      activityList.push({
        name: req.body.act_name.trim(),
        tag: req.body.act_tag ? req.body.act_tag.trim() : "",
        desc: req.body.act_desc ? req.body.act_desc.trim() : "",
        image: itemImage,
      });
    }
    if (activityList.length > 0) doc.activities.activityList = activityList;

    await doc.save();
    res.redirect("/admin/about?tab=activities&msg=" + encodeURIComponent("Key activities updated successfully."));
  } catch (error) {
    console.error("Update Activities error:", error);
    res.redirect("/admin/about?tab=activities&err=" + encodeURIComponent(error.message));
  }
};

// 9. Update Point 7: Messages (महत्वपूर्ण संदेश - UI Displays Author Photos)
exports.postUpdateMessages = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const uploadedUrls = await uploadAboutFiles(req.files);
    const { navTitle, title, description } = req.body;

    if (navTitle) doc.messages.navTitle = navTitle.trim();
    if (title) doc.messages.title = title.trim();
    if (description) doc.messages.description = description.trim();

    const messagesList = [];
    if (req.body.msg_sender && Array.isArray(req.body.msg_sender)) {
      for (let i = 0; i < req.body.msg_sender.length; i++) {
        if (req.body.msg_sender[i] && req.body.msg_sender[i].trim()) {
          let itemPhoto = (req.body.msg_photo && req.body.msg_photo[i]) ? req.body.msg_photo[i].trim() : "/images/about/pallavi-pal-hero.jpg";

          // Check if a file was uploaded for this message card
          if (req.files && Array.isArray(req.files)) {
            itemPhoto = uploadedUrls.get(`msg_file_${i}`) || itemPhoto;
          }

          messagesList.push({
            senderName: req.body.msg_sender[i].trim(),
            role: (req.body.msg_role && req.body.msg_role[i]) ? req.body.msg_role[i].trim() : "",
            designation: (req.body.msg_desig && req.body.msg_desig[i]) ? req.body.msg_desig[i].trim() : "",
            message: (req.body.msg_text && req.body.msg_text[i]) ? req.body.msg_text[i].trim() : "",
            photo: itemPhoto,
          });
        }
      }
    } else if (req.body.msg_sender && typeof req.body.msg_sender === "string") {
      let itemPhoto = req.body.msg_photo ? req.body.msg_photo.trim() : "/images/about/pallavi-pal-hero.jpg";
      if (req.files && Array.isArray(req.files)) {
        itemPhoto = uploadedUrls.get("msg_file_0") || itemPhoto;
      }
      messagesList.push({
        senderName: req.body.msg_sender.trim(),
        role: req.body.msg_role ? req.body.msg_role.trim() : "",
        designation: req.body.msg_desig ? req.body.msg_desig.trim() : "",
        message: req.body.msg_text ? req.body.msg_text.trim() : "",
        photo: itemPhoto,
      });
    }
    if (messagesList.length > 0) doc.messages.messagesList = messagesList;

    await doc.save();
    res.redirect("/admin/about?tab=messages&msg=" + encodeURIComponent("Important messages updated successfully."));
  } catch (error) {
    console.error("Update Messages error:", error);
    res.redirect("/admin/about?tab=messages&err=" + encodeURIComponent(error.message));
  }
};

// 10. Update Gallery Info / Settings
exports.postUpdateGalleryInfo = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { galleryTitle, galleryTagline } = req.body;

    doc.gallery.title = galleryTitle || doc.gallery.title;
    doc.gallery.tagline = galleryTagline || doc.gallery.tagline;

    await doc.save();
    res.redirect("/admin/about?tab=gallery&msg=" + encodeURIComponent("गैलरी शीर्षक व विवरण अपडेट हो गया।"));
  } catch (error) {
    console.error("Update Gallery Info error:", error);
    res.redirect("/admin/about?tab=gallery&err=" + encodeURIComponent(error.message));
  }
};

// 11. Add Photo to Gallery
exports.postAddGalleryPhoto = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { title, caption, category, imageUrl } = req.body;

    const finalImage = await resolveImagePath(req, "photoFile", imageUrl);

    if (!finalImage) {
      return res.redirect("/admin/about?tab=gallery&err=" + encodeURIComponent("कृपया फोटो अपलोड करें या फोटो URL दर्ज करें।"));
    }

    doc.gallery.photos.unshift({
      title: title || "ऐतिहासिक क्षण",
      caption: caption || "",
      category: category || "सामान्य",
      imageUrl: finalImage,
      createdAt: new Date(),
    });

    await doc.save();
    res.redirect("/admin/about?tab=gallery&msg=" + encodeURIComponent("नई फोटो सफलतापूर्वक गैलरी में जुड़ गई।"));
  } catch (error) {
    console.error("Add Gallery Photo error:", error);
    res.redirect("/admin/about?tab=gallery&err=" + encodeURIComponent(error.message));
  }
};

// 12. Delete Photo from Gallery
exports.postDeleteGalleryPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const doc = await AboutPage.getOrSeed();

    doc.gallery.photos = doc.gallery.photos.filter((p) => p._id.toString() !== photoId);
    await doc.save();

    res.redirect("/admin/about?tab=gallery&msg=" + encodeURIComponent("फोटो गैलरी से हटा दी गई।"));
  } catch (error) {
    console.error("Delete Gallery Photo error:", error);
    res.redirect("/admin/about?tab=gallery&err=" + encodeURIComponent(error.message));
  }
};
