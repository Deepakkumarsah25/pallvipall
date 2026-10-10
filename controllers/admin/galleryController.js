const SankalpPhoto = require("../../models/SankalpPhoto");
const fs = require("fs");
const path = require("path");
const { getPagination } = require("../../utils/pagination");
const { uploadBuffer, removeAsset } = require("../../config/cloudinary");
const {
  INDIA_STATES_DISTRICTS,
  getStatesList,
  getDistrictsForState,
  findStateForDistrict,
} = require("../../utils/indiaStatesDistricts");

// Format date helper for input type="date"
const formatDateForInput = (date) => {
  if (!date) return "";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
};

// 1. List all gallery photos with search, state, district & status filters
exports.getGalleryList = async (req, res) => {
  try {
    const { state, district, status, search, msg, err } = req.query;

    const query = {};

    if (typeof state === "string" && state.trim() && state !== "all") {
      query.state = state.trim();
    }

    if (typeof district === "string" && district.trim() && district !== "all") {
      query.district = district.trim();
    }

    if (status === "published") {
      query.isPublished = true;
    } else if (status === "unpublished") {
      query.isPublished = false;
    }

    const safeSearch = typeof search === "string" ? search.trim().slice(0, 100) : "";
    if (safeSearch) {
      const regex = new RegExp(safeSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ name: regex }, { district: regex }, { state: regex }, { caption: regex }];
    }

    const [filteredCount, totalCount, publishedCount, unpublishedCount, districtsList] =
      await Promise.all([
        SankalpPhoto.countDocuments(query),
        SankalpPhoto.countDocuments(),
        SankalpPhoto.countDocuments({ isPublished: true }),
        SankalpPhoto.countDocuments({ isPublished: false }),
        SankalpPhoto.distinct("district"),
      ]);
    const pagination = getPagination(req.query.page, filteredCount, 50);
    const photos = await SankalpPhoto.find(query)
      .sort({ order: 1, date: -1, createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.pageSize);

    res.render("admin/gallery/index", {
      title: "Sankalp Photo Gallery Management",
      admin: req.session.admin,
      photos,
      pagination,
      paginationPath: "/admin/gallery",
      paginationQuery: {
        search: safeSearch,
        state: typeof state === "string" ? state : "all",
        district: typeof district === "string" ? district : "all",
        status: status || "all",
      },
      stats: {
        total: totalCount,
        published: publishedCount,
        unpublished: unpublishedCount,
        districtsCount: districtsList.length,
      },
      districtsList,
      statesList: getStatesList(),
      statesWithDistricts: INDIA_STATES_DISTRICTS,
      filters: {
        state: state || "all",
        district: district || "all",
        status: status || "all",
        search: safeSearch,
      },
      currentPath: "/admin/gallery",
      message: msg || null,
      error: err || null,
    });
  } catch (error) {
    console.error("Gallery list fetch error:", error);
    res.status(500).redirect("/admin/dashboard?err=Failed to load gallery");
  }
};

// 2. Render Single Add Form
exports.getCreatePhoto = async (req, res) => {
  try {
    const districtsList = await SankalpPhoto.distinct("district");
    res.render("admin/gallery/form", {
      title: "Add New Sankalp Photo",
      admin: req.session.admin,
      photo: {
        name: "",
        state: "Uttar Pradesh",
        district: "",
        date: new Date(),
        caption: "",
        imageUrl: "",
        isPublished: true,
        order: 0,
      },
      formatDateForInput,
      districtsList,
      statesList: getStatesList(),
      statesWithDistricts: INDIA_STATES_DISTRICTS,
      currentPath: "/admin/gallery",
      isEdit: false,
      error: null,
    });
  } catch (error) {
    console.error("Get create photo form error:", error);
    res.redirect("/admin/gallery?err=Error loading form");
  }
};

// 3. Process Single Add Form
exports.postCreatePhoto = async (req, res) => {
  let uploadedPublicId = "";
  try {
    const {
      name,
      title,
      state,
      district,
      location,
      customDistrict,
      date,
      caption,
      description,
      imageUrl,
      isPublished,
      order,
    } = req.body;

    const finalTitle = (title && title.trim()) || (name && name.trim()) || "कार्यक्रम फ़ोटो";
    const finalLocation = (location && location.trim()) || (district && district.trim()) || (customDistrict && customDistrict.trim()) || "उत्तर प्रदेश";
    const finalCaption = (description && description.trim()) || (caption && caption.trim()) || "";

    let finalState = state && state.trim() ? state.trim() : "";
    if (!finalState && finalLocation) {
      finalState = findStateForDistrict(finalLocation) || "Uttar Pradesh";
    }

    let finalImageUrl = "";
    let imageFilename = "";
    let imagePublicId = "";

    if (req.file) {
      const uploaded = await uploadBuffer(req.file.buffer, "pallavi-pal/gallery");
      finalImageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
      uploadedPublicId = uploaded.public_id;
    } else if (imageUrl && imageUrl.trim()) {
      finalImageUrl = imageUrl.trim();
    } else {
      const districtsList = await SankalpPhoto.distinct("district");
      return res.render("admin/gallery/form", {
        title: "Add New Photo",
        admin: req.session.admin,
        photo: { ...req.body, name: finalTitle, district: finalLocation },
        formatDateForInput,
        districtsList,
        statesList: getStatesList(),
        statesWithDistricts: INDIA_STATES_DISTRICTS,
        currentPath: "/admin/gallery",
        isEdit: false,
        error: "कृपया फ़ोटो फ़ाइल चुनें या फ़ोटो URL दर्ज करें।",
      });
    }

    const photoDate = date ? new Date(date) : new Date();

    await SankalpPhoto.create({
      name: finalTitle,
      state: finalState || "Uttar Pradesh",
      district: finalLocation,
      date: isNaN(photoDate.getTime()) ? new Date() : photoDate,
      caption: finalCaption,
      imageUrl: finalImageUrl,
      imageFilename,
      imagePublicId,
      isPublished:
        isPublished === "on" || isPublished === "true" || isPublished === true,
      order: Number(order) || 0,
    });

    res.redirect("/admin/gallery?msg=" + encodeURIComponent("फ़ोटो सफलतापूर्वक जोड़ दी गई।"));
  } catch (error) {
    if (uploadedPublicId) await removeAsset(uploadedPublicId).catch(() => {});
    console.error("Create photo error:", error);
    const districtsList = await SankalpPhoto.distinct("district").catch(
      () => []
    );
    res.render("admin/gallery/form", {
      title: "Add New Sankalp Photo",
      admin: req.session.admin,
      photo: req.body,
      formatDateForInput,
      districtsList,
      statesList: getStatesList(),
      statesWithDistricts: INDIA_STATES_DISTRICTS,
      currentPath: "/admin/gallery",
      isEdit: false,
      error: "Error saving photo: " + error.message,
    });
  }
};

// 4. Render Bulk Upload Form
exports.getBulkUpload = async (req, res) => {
  try {
    const districtsList = await SankalpPhoto.distinct("district");
    res.render("admin/gallery/bulk", {
      title: "Bulk Image Upload",
      admin: req.session.admin,
      districtsList,
      statesList: getStatesList(),
      statesWithDistricts: INDIA_STATES_DISTRICTS,
      formatDateForInput,
      currentPath: "/admin/gallery",
      error: null,
      todayStr: formatDateForInput(new Date()),
    });
  } catch (error) {
    console.error("Get bulk form error:", error);
    res.redirect("/admin/gallery?err=Error loading bulk upload");
  }
};

// 5. Process Bulk Upload
exports.postBulkUpload = async (req, res) => {
  const uploadedFiles = [];
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      const districtsList = await SankalpPhoto.distinct("district");
      return res.render("admin/gallery/bulk", {
        title: "Bulk Image Upload",
        admin: req.session.admin,
        districtsList,
        statesList: getStatesList(),
        statesWithDistricts: INDIA_STATES_DISTRICTS,
        formatDateForInput,
        currentPath: "/admin/gallery",
        error: "Please select at least one or more images!",
        todayStr: formatDateForInput(new Date()),
      });
    }

    const {
      defaultState,
      defaultDistrict,
      location,
      customBulkDistrict,
      defaultDate,
      defaultName,
      title,
      defaultCaption,
      description,
      isPublished,
    } = req.body;

    let finalDistrict = (location && location.trim())
      || ((defaultDistrict === "__other__" || !defaultDistrict) && customBulkDistrict ? customBulkDistrict.trim() : (defaultDistrict ? defaultDistrict.trim() : "उत्तर प्रदेश"));

    let finalState = defaultState && defaultState.trim() ? defaultState.trim() : "";
    if (!finalState && finalDistrict) {
      finalState = findStateForDistrict(finalDistrict) || "Uttar Pradesh";
    }

    const photoDate = defaultDate ? new Date(defaultDate) : new Date();
    const publishedBool =
      isPublished === "on" || isPublished === "true" || isPublished === true;

    const baseTitle = (title && title.trim()) || (defaultName && defaultName.trim()) || "कार्यक्रम फ़ोटो";
    const baseDesc = (description && description.trim()) || (defaultCaption && defaultCaption.trim()) || "जनसेवा व विकास कार्यक्रम";

    const docsToInsert = [];
    for (const [idx, file] of files.entries()) {
      const uploaded = await uploadBuffer(file.buffer, "pallavi-pal/gallery");
      uploadedFiles.push(uploaded);
      let photoName = baseTitle;
      if (files.length > 1) {
        photoName = `${baseTitle} #${idx + 1}`;
      }

      docsToInsert.push({
        name: photoName,
        state: finalState || "Uttar Pradesh",
        district: finalDistrict,
        date: isNaN(photoDate.getTime()) ? new Date() : photoDate,
        caption: baseDesc,
        imageUrl: uploaded.secure_url,
        imageFilename: "",
        imagePublicId: uploaded.public_id,
        isPublished: publishedBool,
        order: idx,
      });
    }

    try {
      await SankalpPhoto.insertMany(docsToInsert);
    } catch (error) {
      await Promise.all(uploadedFiles.map((asset) => removeAsset(asset.public_id)));
      throw error;
    }

    res.redirect(
      `/admin/gallery?msg=${files.length} फ़ोटो सफलतापूर्वक अपलोड हो गईं!`
    );
  } catch (error) {
    console.error("Bulk upload error:", error);
    const districtsList = await SankalpPhoto.distinct("district").catch(
      () => []
    );
    res.render("admin/gallery/bulk", {
      title: "Bulk Image Upload",
      admin: req.session.admin,
      districtsList,
      statesList: getStatesList(),
      statesWithDistricts: INDIA_STATES_DISTRICTS,
      formatDateForInput,
      currentPath: "/admin/gallery",
      error: "Error during bulk upload: " + error.message,
      todayStr: formatDateForInput(new Date()),
    });
  }
};

// 6. Render Edit Form
exports.getEditPhoto = async (req, res) => {
  try {
    const photo = await SankalpPhoto.findById(req.params.id);
    if (!photo) {
      return res.redirect("/admin/gallery?err=Photo not found");
    }

    const districtsList = await SankalpPhoto.distinct("district");
    let photoState = photo.state;
    if (!photoState && photo.district) {
      photoState = findStateForDistrict(photo.district) || "Uttar Pradesh";
    }
    const photoData = photo.toObject ? photo.toObject() : { ...photo };
    photoData.state = photoState;

    res.render("admin/gallery/form", {
      title: "Edit Photo",
      admin: req.session.admin,
      photo: photoData,
      formatDateForInput,
      districtsList,
      statesList: getStatesList(),
      statesWithDistricts: INDIA_STATES_DISTRICTS,
      currentPath: "/admin/gallery",
      isEdit: true,
      error: null,
    });
  } catch (error) {
    console.error("Get edit photo error:", error);
    res.redirect("/admin/gallery?err=Error loading photo");
  }
};

// 7. Process Edit Form
exports.postEditPhoto = async (req, res) => {
  try {
    const {
      name,
      title,
      state,
      district,
      location,
      customDistrict,
      date,
      caption,
      description,
      imageUrl,
      isPublished,
      order,
    } = req.body;

    const existing = await SankalpPhoto.findById(req.params.id);
    if (!existing) {
      return res.redirect("/admin/gallery?err=Photo not found");
    }

    const finalTitle = (title && title.trim()) || (name && name.trim()) || existing.name;
    const finalLocation = (location && location.trim()) || (district && district.trim()) || (customDistrict && customDistrict.trim()) || existing.district;
    const finalCaption = typeof description !== "undefined" ? description.trim() : (typeof caption !== "undefined" ? caption.trim() : existing.caption);

    let finalState = state && state.trim() ? state.trim() : (existing.state || "");
    if (!finalState && finalLocation) {
      finalState = findStateForDistrict(finalLocation) || "Uttar Pradesh";
    }

    let finalImageUrl = existing.imageUrl;
    let imageFilename = existing.imageFilename;
    let imagePublicId = existing.imagePublicId || "";
    const previousImagePublicId = imagePublicId;

    if (req.file) {
      const uploaded = await uploadBuffer(req.file.buffer, "pallavi-pal/gallery");
      finalImageUrl = uploaded.secure_url;
      imageFilename = "";
      imagePublicId = uploaded.public_id;
    } else if (imageUrl && imageUrl.trim()) {
      finalImageUrl = imageUrl.trim();
      imagePublicId = "";
    }

    const photoDate = date ? new Date(date) : existing.date;

    existing.name = finalTitle;
    existing.state = finalState || "Uttar Pradesh";
    existing.district = finalLocation;
    existing.date = isNaN(photoDate.getTime()) ? existing.date : photoDate;
    existing.caption = finalCaption;
    existing.imageUrl = finalImageUrl;
    existing.imageFilename = imageFilename;
    existing.imagePublicId = imagePublicId;
    existing.isPublished =
      isPublished === "on" || isPublished === "true" || isPublished === true;
    existing.order = Number(order) || 0;

    await existing.save();
    if (previousImagePublicId && previousImagePublicId !== imagePublicId) {
      await removeAsset(previousImagePublicId).catch(() => {});
    }

    res.redirect("/admin/gallery?msg=Photo details successfully updated.");
  } catch (error) {
    console.error("Edit photo error:", error);
    const districtsList = await SankalpPhoto.distinct("district").catch(
      () => []
    );
    res.render("admin/gallery/form", {
      title: "Edit Sankalp Photo",
      admin: req.session.admin,
      photo: { ...req.body, _id: req.params.id },
      formatDateForInput,
      districtsList,
      statesList: getStatesList(),
      statesWithDistricts: INDIA_STATES_DISTRICTS,
      currentPath: "/admin/gallery",
      isEdit: true,
      error: "Error updating photo: " + error.message,
    });
  }
};

// 8. Toggle Publish / Unpublish Status
exports.togglePhotoPublish = async (req, res) => {
  try {
    const photo = await SankalpPhoto.findById(req.params.id);
    if (photo) {
      photo.isPublished = !photo.isPublished;
      await photo.save();
      const statusText = photo.isPublished ? "Published" : "Unpublished";
      return res.redirect(`/admin/gallery?msg=${encodeURIComponent(`Photo status changed to '${statusText}'.`)}`);
    }
    res.redirect("/admin/gallery?err=Photo not found");
  } catch (error) {
    console.error("Toggle photo error:", error);
    res.redirect("/admin/gallery?err=Failed to change status");
  }
};

// 9. Delete Photo
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await SankalpPhoto.findByIdAndDelete(req.params.id);
    if (photo?.imagePublicId) await removeAsset(photo.imagePublicId);
    if (photo && photo.imageFilename) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        "gallery",
        photo.imageFilename
      );
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {}
      }
    }
    res.redirect("/admin/gallery?msg=Photo successfully deleted.");
  } catch (error) {
    console.error("Delete photo error:", error);
    res.redirect("/admin/gallery?err=Failed to delete photo");
  }
};
