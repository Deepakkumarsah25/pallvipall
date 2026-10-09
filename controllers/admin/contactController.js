const ContactInfo = require("../../models/ContactInfo");
const ContactMessage = require("../../models/ContactMessage");
const { getPagination } = require("../../utils/pagination");
const { uploadBuffer, removeAsset } = require("../../config/cloudinary");

/**
 * Display Admin Contact Management Hub
 */
exports.getContactManager = async (req, res) => {
  try {
    const tab = req.query.tab || "messages";
    const status = ["new", "contacted", "resolved"].includes(req.query.status) ? req.query.status : "all";
    const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";

    // 1. Fetch Contact Info Configuration
    const contact = await ContactInfo.getOrSeed();

    // 2. Compute Message Statistics
    const [totalMessages, newMessages, contactedMessages, resolvedMessages] =
      await Promise.all([
        ContactMessage.countDocuments().catch(() => 0),
        ContactMessage.countDocuments({ status: "new" }).catch(() => 0),
        ContactMessage.countDocuments({ status: "contacted" }).catch(() => 0),
        ContactMessage.countDocuments({ status: "resolved" }).catch(() => 0),
      ]);

    // 3. Build Filter for Messages
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { district: searchRegex },
        { message: searchRegex },
      ];
    }

    // 4. Fetch Filtered Messages
    const totalFiltered = await ContactMessage.countDocuments(filter);
    const pagination = getPagination(req.query.page, totalFiltered, 50);
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.pageSize);

    res.render("admin/contact/index", {
      title: "Contact Management",
      admin: req.session.admin,
      currentPath: "/admin/contact",
      activeTab: tab,
      contact,
      messages,
      pagination,
      paginationPath: "/admin/contact",
      paginationQuery: { tab: "messages", status, search },
      stats: {
        total: totalMessages,
        new: newMessages,
        contacted: contactedMessages,
        resolved: resolvedMessages,
      },
      filters: {
        status,
        search,
      },
      message: req.query.msg || null,
      error: req.query.err || null,
    });
  } catch (error) {
    console.error("Admin Contact Manager Error:", error);
    res.status(500).render("admin/contact/index", {
      title: "Contact Management",
      admin: req.session.admin,
      currentPath: "/admin/contact",
      activeTab: "messages",
      contact: ContactInfo.defaultData,
      messages: [],
      pagination: { page: 1, pageSize: 50, total: 0, totalPages: 1, skip: 0 },
      paginationPath: "/admin/contact",
      paginationQuery: { tab: "messages", status: "all", search: "" },
      stats: { total: 0, new: 0, contacted: 0, resolved: 0 },
      filters: { status: "all", search: "" },
      message: null,
      error: "संपर्क डेटा लोड करने में त्रुटि हुई: " + error.message,
    });
  }
};

/**
 * Update Contact Page Settings
 */
exports.updateContactSettings = async (req, res) => {
  try {
    const {
      bannerImage,
      pageBadge,
      pageHeading,
      pageSubheading,
      heroChip1,
      heroChip2,
      heroChip3,
      officeTitle,
      officeAddress,
      officeTiming,
      mapDirectionsUrl,
      mapEmbedUrl,
      primaryPhone,
      secondaryPhone,
      primaryEmail,
      secondaryEmail,
      whatsappNumber,
      whatsappMessage,
      facebookUrl,
      twitterUrl,
      instagramUrl,
      youtubeUrl,
      telegramUrl,
    } = req.body;

    let contact = await ContactInfo.findOne();
    if (!contact) {
      contact = new ContactInfo();
    }

    // Assign banner image (file upload priority, then URL input)
    const previousBannerPublicId = contact.bannerImagePublicId || "";
    if (req.file) {
      const uploaded = await uploadBuffer(req.file.buffer, "pallavi-pal/contact");
      contact.bannerImage = uploaded.secure_url;
      contact.bannerImagePublicId = uploaded.public_id;
    } else if (bannerImage !== undefined && bannerImage.trim() !== "") {
      contact.bannerImage = bannerImage.trim();
      contact.bannerImagePublicId = "";
    }
    if (pageBadge !== undefined) contact.pageBadge = pageBadge.trim();
    if (pageHeading !== undefined) contact.pageHeading = pageHeading.trim();
    if (pageSubheading !== undefined) contact.pageSubheading = pageSubheading.trim();
    if (heroChip1 !== undefined) contact.heroChip1 = heroChip1.trim();
    if (heroChip2 !== undefined) contact.heroChip2 = heroChip2.trim();
    if (heroChip3 !== undefined) contact.heroChip3 = heroChip3.trim();
    if (officeTitle !== undefined) contact.officeTitle = officeTitle.trim();
    if (officeAddress !== undefined) contact.officeAddress = officeAddress.trim();
    if (officeTiming !== undefined) contact.officeTiming = officeTiming.trim();
    if (mapDirectionsUrl !== undefined) contact.mapDirectionsUrl = mapDirectionsUrl.trim();
    if (mapEmbedUrl !== undefined) contact.mapEmbedUrl = mapEmbedUrl.trim();
    if (primaryPhone !== undefined) contact.primaryPhone = primaryPhone.trim();
    if (secondaryPhone !== undefined) contact.secondaryPhone = secondaryPhone.trim();
    if (primaryEmail !== undefined) contact.primaryEmail = primaryEmail.trim();
    if (secondaryEmail !== undefined) contact.secondaryEmail = secondaryEmail.trim();
    if (whatsappNumber !== undefined) contact.whatsappNumber = whatsappNumber.trim();
    if (whatsappMessage !== undefined) contact.whatsappMessage = whatsappMessage.trim();
    if (facebookUrl !== undefined) contact.facebookUrl = facebookUrl.trim();
    if (twitterUrl !== undefined) contact.twitterUrl = twitterUrl.trim();
    if (instagramUrl !== undefined) contact.instagramUrl = instagramUrl.trim();
    if (youtubeUrl !== undefined) contact.youtubeUrl = youtubeUrl.trim();
    if (telegramUrl !== undefined) contact.telegramUrl = telegramUrl.trim();

    await contact.save();
    if (previousBannerPublicId && previousBannerPublicId !== contact.bannerImagePublicId) {
      await removeAsset(previousBannerPublicId).catch(() => {});
    }

    res.redirect(
      `/admin/contact?tab=settings&msg=${encodeURIComponent("संपर्क जानकारी एवं सेटिंग्स सफलतापूर्वक अपडेट हो गई हैं।")}`
    );
  } catch (error) {
    console.error("Update Contact Settings Error:", error);
    res.redirect(
      `/admin/contact?tab=settings&err=${encodeURIComponent("सेटिंग्स सहेजने में विफलता: " + error.message)}`
    );
  }
};

/**
 * Update Message Status & Admin Notes
 */
exports.updateMessageStatus = async (req, res) => {
  const isAjax =
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes("json")) ||
    (req.headers["content-type"] && req.headers["content-type"].includes("json"));

  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ["new", "contacted", "resolved"];
    if (status && !validStatuses.includes(status)) {
      if (isAjax) return res.status(400).json({ success: false, message: "Invalid status value" });
      return res.redirect(`/admin/contact?tab=messages&err=Invalid status`);
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes.trim();

    const updated = await ContactMessage.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updated) {
      if (isAjax) return res.status(404).json({ success: false, message: "Message not found" });
      return res.redirect(`/admin/contact?tab=messages&err=Message not found`);
    }

    if (isAjax) {
      return res.json({
        success: true,
        message: "Status updated successfully",
        data: updated,
      });
    }

    res.redirect(`/admin/contact?tab=messages&msg=${encodeURIComponent("संदेश की स्थिति सफलतापूर्वक अपडेट की गई।")}`);
  } catch (error) {
    console.error("Update Message Status Error:", error);
    if (isAjax) return res.status(500).json({ success: false, message: error.message });
    res.redirect(`/admin/contact?tab=messages&err=${encodeURIComponent("स्थिति अपडेट करने में समस्या आई")}`);
  }
};

/**
 * Delete a Contact Message
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await ContactMessage.findByIdAndDelete(id);

    res.redirect(`/admin/contact?tab=messages&msg=${encodeURIComponent("संदेश रिकॉर्ड सफलतापूर्वक हटा दिया गया।")}`);
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.redirect(`/admin/contact?tab=messages&err=${encodeURIComponent("रिकॉर्ड हटाने में समस्या आई")}`);
  }
};
