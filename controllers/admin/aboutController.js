const AboutPage = require("../../models/AboutPage");
const { uploadBuffer } = require("../../config/cloudinary");

// Helper to resolve uploaded file buffer or URL text
const resolveImageInput = async (req, fileFieldName, textFieldName, fallback = "") => {
  try {
    const file = req.file?.fieldname === fileFieldName
      ? req.file
      : Array.isArray(req.files)
        ? req.files.find((f) => f.fieldname === fileFieldName)
        : null;

    if (file?.buffer) {
      const uploaded = await uploadBuffer(file.buffer, "pallavi-pal/about");
      if (uploaded?.secure_url) {
        return uploaded.secure_url;
      }
    }
  } catch (err) {
    console.error("Cloudinary upload failed, checking text fallback:", err.message);
  }

  if (req.body && req.body[textFieldName] && req.body[textFieldName].trim() !== "") {
    return req.body[textFieldName].trim();
  }

  return fallback;
};

// 1. Render About Manager View
exports.getAboutManager = async (req, res) => {
  try {
    const about = await AboutPage.getOrSeed();
    const activeTab = req.query.tab || "profile";

    res.render("admin/about/index", {
      title: "About Page Manager - Pallavi Pal",
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

// 2. Update Profile & Hero Section
exports.postUpdateProfile = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { name, englishName, designation, party, shortIntro, constituency } = req.body;

    if (name) doc.profile.name = name.trim();
    if (englishName !== undefined) doc.profile.englishName = englishName.trim();
    if (designation) doc.profile.designation = designation.trim();
    if (party) doc.profile.party = party.trim();
    if (shortIntro !== undefined) doc.profile.shortIntro = shortIntro.trim();
    if (constituency !== undefined) doc.profile.constituency = constituency.trim();

    // Photo (File or URL)
    const photoUrl = await resolveImageInput(req, "photoFile", "photo", doc.profile.photo);
    if (photoUrl) doc.profile.photo = photoUrl;

    // Banner (File or URL)
    const bannerUrl = await resolveImageInput(req, "bannerFile", "bannerImage", doc.profile.bannerImage);
    if (bannerUrl !== undefined) doc.profile.bannerImage = bannerUrl;

    await doc.save();
    res.redirect("/admin/about?tab=profile&msg=" + encodeURIComponent("Profile updated successfully."));
  } catch (error) {
    console.error("Update Profile error:", error);
    res.redirect("/admin/about?tab=profile&err=" + encodeURIComponent(error.message));
  }
};

// 3. Update Biography Section
exports.postUpdateBio = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { heading, summary, paragraphsText, coreValuesText } = req.body;

    if (heading) doc.biography.heading = heading.trim();
    if (summary) doc.biography.summary = summary.trim();

    if (paragraphsText !== undefined) {
      doc.biography.paragraphs = paragraphsText
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
    }

    if (coreValuesText !== undefined) {
      doc.biography.coreValues = coreValuesText
        .split(/[\n,]/)
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
    }

    await doc.save();
    res.redirect("/admin/about?tab=bio&msg=" + encodeURIComponent("Biography updated successfully."));
  } catch (error) {
    console.error("Update Bio error:", error);
    res.redirect("/admin/about?tab=bio&err=" + encodeURIComponent(error.message));
  }
};

// 4. Update Current Position
exports.postUpdatePosition = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { title, role, location, description } = req.body;

    if (title) doc.currentPosition.title = title.trim();
    if (role !== undefined) doc.currentPosition.role = role.trim();
    if (location !== undefined) doc.currentPosition.location = location.trim();
    if (description !== undefined) doc.currentPosition.description = description.trim();

    await doc.save();
    res.redirect("/admin/about?tab=position&msg=" + encodeURIComponent("Current position updated successfully."));
  } catch (error) {
    console.error("Update Position error:", error);
    res.redirect("/admin/about?tab=position&err=" + encodeURIComponent(error.message));
  }
};

// 5. EDUCATION CRUD
exports.postAddEducation = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { degree, institution, year, details, order } = req.body;

    if (!degree || degree.trim() === "") {
      return res.redirect("/admin/about?tab=education&err=" + encodeURIComponent("Degree/Qualification title is required."));
    }

    doc.education.push({
      degree: degree.trim(),
      institution: institution ? institution.trim() : "",
      year: year ? year.trim() : "",
      details: details ? details.trim() : "",
      order: order ? parseInt(order, 10) : doc.education.length + 1,
    });

    await doc.save();
    res.redirect("/admin/about?tab=education&msg=" + encodeURIComponent("Education entry added successfully."));
  } catch (error) {
    console.error("Add Education error:", error);
    res.redirect("/admin/about?tab=education&err=" + encodeURIComponent(error.message));
  }
};

exports.postEditEducation = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const item = doc.education.id(req.params.id);

    if (!item) {
      return res.redirect("/admin/about?tab=education&err=" + encodeURIComponent("Education item not found."));
    }

    const { degree, institution, year, details, order } = req.body;
    if (degree) item.degree = degree.trim();
    if (institution !== undefined) item.institution = institution.trim();
    if (year !== undefined) item.year = year.trim();
    if (details !== undefined) item.details = details.trim();
    if (order !== undefined) item.order = parseInt(order, 10) || 0;

    await doc.save();
    res.redirect("/admin/about?tab=education&msg=" + encodeURIComponent("Education entry updated successfully."));
  } catch (error) {
    console.error("Edit Education error:", error);
    res.redirect("/admin/about?tab=education&err=" + encodeURIComponent(error.message));
  }
};

exports.postDeleteEducation = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    doc.education.pull({ _id: req.params.id });
    await doc.save();
    res.redirect("/admin/about?tab=education&msg=" + encodeURIComponent("Education entry removed."));
  } catch (error) {
    console.error("Delete Education error:", error);
    res.redirect("/admin/about?tab=education&err=" + encodeURIComponent(error.message));
  }
};

// 6. POLITICAL CAREER CRUD
exports.postAddCareer = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { title, period, description, order } = req.body;

    if (!title || title.trim() === "") {
      return res.redirect("/admin/about?tab=career&err=" + encodeURIComponent("Career milestone title is required."));
    }

    doc.politicalCareer.push({
      title: title.trim(),
      period: period ? period.trim() : "",
      description: description ? description.trim() : "",
      order: order ? parseInt(order, 10) : doc.politicalCareer.length + 1,
    });

    await doc.save();
    res.redirect("/admin/about?tab=career&msg=" + encodeURIComponent("Career milestone added successfully."));
  } catch (error) {
    console.error("Add Career error:", error);
    res.redirect("/admin/about?tab=career&err=" + encodeURIComponent(error.message));
  }
};

exports.postEditCareer = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const item = doc.politicalCareer.id(req.params.id);

    if (!item) {
      return res.redirect("/admin/about?tab=career&err=" + encodeURIComponent("Career milestone not found."));
    }

    const { title, period, description, order } = req.body;
    if (title) item.title = title.trim();
    if (period !== undefined) item.period = period.trim();
    if (description !== undefined) item.description = description.trim();
    if (order !== undefined) item.order = parseInt(order, 10) || 0;

    await doc.save();
    res.redirect("/admin/about?tab=career&msg=" + encodeURIComponent("Career milestone updated successfully."));
  } catch (error) {
    console.error("Edit Career error:", error);
    res.redirect("/admin/about?tab=career&err=" + encodeURIComponent(error.message));
  }
};

exports.postDeleteCareer = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    doc.politicalCareer.pull({ _id: req.params.id });
    await doc.save();
    res.redirect("/admin/about?tab=career&msg=" + encodeURIComponent("Career milestone removed."));
  } catch (error) {
    console.error("Delete Career error:", error);
    res.redirect("/admin/about?tab=career&err=" + encodeURIComponent(error.message));
  }
};

// 7. SAMAJWADI PARTY POSTS CRUD
exports.postAddPartyPost = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { postTitle, wing, period, description, order } = req.body;

    if (!postTitle || postTitle.trim() === "") {
      return res.redirect("/admin/about?tab=party_posts&err=" + encodeURIComponent("Party post title is required."));
    }

    doc.partyPosts.push({
      postTitle: postTitle.trim(),
      wing: wing ? wing.trim() : "समाजवादी पार्टी",
      period: period ? period.trim() : "",
      description: description ? description.trim() : "",
      order: order ? parseInt(order, 10) : doc.partyPosts.length + 1,
    });

    await doc.save();
    res.redirect("/admin/about?tab=party_posts&msg=" + encodeURIComponent("Party post added successfully."));
  } catch (error) {
    console.error("Add Party Post error:", error);
    res.redirect("/admin/about?tab=party_posts&err=" + encodeURIComponent(error.message));
  }
};

exports.postEditPartyPost = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const item = doc.partyPosts.id(req.params.id);

    if (!item) {
      return res.redirect("/admin/about?tab=party_posts&err=" + encodeURIComponent("Party post not found."));
    }

    const { postTitle, wing, period, description, order } = req.body;
    if (postTitle) item.postTitle = postTitle.trim();
    if (wing !== undefined) item.wing = wing.trim();
    if (period !== undefined) item.period = period.trim();
    if (description !== undefined) item.description = description.trim();
    if (order !== undefined) item.order = parseInt(order, 10) || 0;

    await doc.save();
    res.redirect("/admin/about?tab=party_posts&msg=" + encodeURIComponent("Party post updated successfully."));
  } catch (error) {
    console.error("Edit Party Post error:", error);
    res.redirect("/admin/about?tab=party_posts&err=" + encodeURIComponent(error.message));
  }
};

exports.postDeletePartyPost = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    doc.partyPosts.pull({ _id: req.params.id });
    await doc.save();
    res.redirect("/admin/about?tab=party_posts&msg=" + encodeURIComponent("Party post removed."));
  } catch (error) {
    console.error("Delete Party Post error:", error);
    res.redirect("/admin/about?tab=party_posts&err=" + encodeURIComponent(error.message));
  }
};

// 8. ACHIEVEMENTS CRUD
exports.postAddAchievement = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { title, category, year, description, order } = req.body;

    if (!title || title.trim() === "") {
      return res.redirect("/admin/about?tab=achievements&err=" + encodeURIComponent("Achievement title is required."));
    }

    doc.achievements.push({
      title: title.trim(),
      category: category ? category.trim() : "उपलब्धि",
      year: year ? year.trim() : "",
      description: description ? description.trim() : "",
      order: order ? parseInt(order, 10) : doc.achievements.length + 1,
    });

    await doc.save();
    res.redirect("/admin/about?tab=achievements&msg=" + encodeURIComponent("Achievement added successfully."));
  } catch (error) {
    console.error("Add Achievement error:", error);
    res.redirect("/admin/about?tab=achievements&err=" + encodeURIComponent(error.message));
  }
};

exports.postEditAchievement = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const item = doc.achievements.id(req.params.id);

    if (!item) {
      return res.redirect("/admin/about?tab=achievements&err=" + encodeURIComponent("Achievement not found."));
    }

    const { title, category, year, description, order } = req.body;
    if (title) item.title = title.trim();
    if (category !== undefined) item.category = category.trim();
    if (year !== undefined) item.year = year.trim();
    if (description !== undefined) item.description = description.trim();
    if (order !== undefined) item.order = parseInt(order, 10) || 0;

    await doc.save();
    res.redirect("/admin/about?tab=achievements&msg=" + encodeURIComponent("Achievement updated successfully."));
  } catch (error) {
    console.error("Edit Achievement error:", error);
    res.redirect("/admin/about?tab=achievements&err=" + encodeURIComponent(error.message));
  }
};

exports.postDeleteAchievement = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    doc.achievements.pull({ _id: req.params.id });
    await doc.save();
    res.redirect("/admin/about?tab=achievements&msg=" + encodeURIComponent("Achievement removed."));
  } catch (error) {
    console.error("Delete Achievement error:", error);
    res.redirect("/admin/about?tab=achievements&err=" + encodeURIComponent(error.message));
  }
};

// 9. SOCIAL WORK CRUD
exports.postAddSocialWork = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { title, focusArea, description, order } = req.body;

    if (!title || title.trim() === "") {
      return res.redirect("/admin/about?tab=social_work&err=" + encodeURIComponent("Social work initiative title is required."));
    }

    doc.socialWork.push({
      title: title.trim(),
      focusArea: focusArea ? focusArea.trim() : "जनसेवा",
      description: description ? description.trim() : "",
      order: order ? parseInt(order, 10) : doc.socialWork.length + 1,
    });

    await doc.save();
    res.redirect("/admin/about?tab=social_work&msg=" + encodeURIComponent("Social work initiative added successfully."));
  } catch (error) {
    console.error("Add Social Work error:", error);
    res.redirect("/admin/about?tab=social_work&err=" + encodeURIComponent(error.message));
  }
};

exports.postEditSocialWork = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const item = doc.socialWork.id(req.params.id);

    if (!item) {
      return res.redirect("/admin/about?tab=social_work&err=" + encodeURIComponent("Social work initiative not found."));
    }

    const { title, focusArea, description, order } = req.body;
    if (title) item.title = title.trim();
    if (focusArea !== undefined) item.focusArea = focusArea.trim();
    if (description !== undefined) item.description = description.trim();
    if (order !== undefined) item.order = parseInt(order, 10) || 0;

    await doc.save();
    res.redirect("/admin/about?tab=social_work&msg=" + encodeURIComponent("Social work initiative updated successfully."));
  } catch (error) {
    console.error("Edit Social Work error:", error);
    res.redirect("/admin/about?tab=social_work&err=" + encodeURIComponent(error.message));
  }
};

exports.postDeleteSocialWork = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    doc.socialWork.pull({ _id: req.params.id });
    await doc.save();
    res.redirect("/admin/about?tab=social_work&msg=" + encodeURIComponent("Social work initiative removed."));
  } catch (error) {
    console.error("Delete Social Work error:", error);
    res.redirect("/admin/about?tab=social_work&err=" + encodeURIComponent(error.message));
  }
};

// 10. GALLERY CRUD
exports.postAddGalleryPhoto = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { title, caption, order } = req.body;

    const imageUrl = await resolveImageInput(req, "photoFile", "imageUrl", "");
    if (!imageUrl || imageUrl.trim() === "") {
      return res.redirect("/admin/about?tab=gallery&err=" + encodeURIComponent("Please choose a photo file or provide an Image URL."));
    }

    doc.gallery.push({
      title: title ? title.trim() : "",
      caption: caption ? caption.trim() : "",
      imageUrl: imageUrl.trim(),
      order: order ? parseInt(order, 10) : doc.gallery.length + 1,
    });

    await doc.save();
    res.redirect("/admin/about?tab=gallery&msg=" + encodeURIComponent("Photo added to gallery successfully."));
  } catch (error) {
    console.error("Add Gallery Photo error:", error);
    res.redirect("/admin/about?tab=gallery&err=" + encodeURIComponent(error.message));
  }
};

exports.postEditGalleryPhoto = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const item = doc.gallery.id(req.params.id);

    if (!item) {
      return res.redirect("/admin/about?tab=gallery&err=" + encodeURIComponent("Photo not found in gallery."));
    }

    const { title, caption, order } = req.body;
    if (title !== undefined) item.title = title.trim();
    if (caption !== undefined) item.caption = caption.trim();
    if (order !== undefined) item.order = parseInt(order, 10) || 0;

    const newImageUrl = await resolveImageInput(req, "photoFile", "imageUrl", item.imageUrl);
    if (newImageUrl) item.imageUrl = newImageUrl;

    await doc.save();
    res.redirect("/admin/about?tab=gallery&msg=" + encodeURIComponent("Gallery photo updated successfully."));
  } catch (error) {
    console.error("Edit Gallery Photo error:", error);
    res.redirect("/admin/about?tab=gallery&err=" + encodeURIComponent(error.message));
  }
};

exports.postDeleteGalleryPhoto = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    doc.gallery.pull({ _id: req.params.id });
    await doc.save();
    res.redirect("/admin/about?tab=gallery&msg=" + encodeURIComponent("Gallery photo removed."));
  } catch (error) {
    console.error("Delete Gallery Photo error:", error);
    res.redirect("/admin/about?tab=gallery&err=" + encodeURIComponent(error.message));
  }
};

// 11. SOCIAL MEDIA LINKS CRUD
exports.postAddSocialLink = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const { platform, url, handle, order } = req.body;

    if (!platform || !url || url.trim() === "") {
      return res.redirect("/admin/about?tab=social_links&err=" + encodeURIComponent("Platform name and URL are required."));
    }

    doc.socialLinks.push({
      platform: platform.trim(),
      url: url.trim(),
      handle: handle ? handle.trim() : "",
      order: order ? parseInt(order, 10) : doc.socialLinks.length + 1,
    });

    await doc.save();
    res.redirect("/admin/about?tab=social_links&msg=" + encodeURIComponent("Social media link added successfully."));
  } catch (error) {
    console.error("Add Social Link error:", error);
    res.redirect("/admin/about?tab=social_links&err=" + encodeURIComponent(error.message));
  }
};

exports.postEditSocialLink = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    const item = doc.socialLinks.id(req.params.id);

    if (!item) {
      return res.redirect("/admin/about?tab=social_links&err=" + encodeURIComponent("Social link not found."));
    }

    const { platform, url, handle, order } = req.body;
    if (platform) item.platform = platform.trim();
    if (url) item.url = url.trim();
    if (handle !== undefined) item.handle = handle.trim();
    if (order !== undefined) item.order = parseInt(order, 10) || 0;

    await doc.save();
    res.redirect("/admin/about?tab=social_links&msg=" + encodeURIComponent("Social media link updated successfully."));
  } catch (error) {
    console.error("Edit Social Link error:", error);
    res.redirect("/admin/about?tab=social_links&err=" + encodeURIComponent(error.message));
  }
};

exports.postDeleteSocialLink = async (req, res) => {
  try {
    const doc = await AboutPage.getOrSeed();
    doc.socialLinks.pull({ _id: req.params.id });
    await doc.save();
    res.redirect("/admin/about?tab=social_links&msg=" + encodeURIComponent("Social link removed."));
  } catch (error) {
    console.error("Delete Social Link error:", error);
    res.redirect("/admin/about?tab=social_links&err=" + encodeURIComponent(error.message));
  }
};
