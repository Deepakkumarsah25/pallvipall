const SankalpPhoto = require("../models/SankalpPhoto");
const HomeQuickInfo = require("../models/HomeQuickInfo");
const { defaultGalleryPhotos, seedGalleryData } = require("../scripts/seedGalleryData");
const { getPagination } = require("../utils/pagination");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addGallerySearch(query, search) {
  if (typeof search !== "string" || !search.trim()) return;

  const fields = ["name", "district", "caption", "dateString"];
  const terms = search.trim().slice(0, 100).split(/\s+/).filter(Boolean);
  query.$and = terms.map((term) => {
    const regex = new RegExp(escapeRegex(term), "i");
    return { $or: fields.map((field) => ({ [field]: regex })) };
  });
}

// Public Gallery Page
exports.getGalleryPage = async (req, res) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";

    const query = { isPublished: true };
    addGallerySearch(query, search);

    let [total, quickInfo] = await Promise.all([
      SankalpPhoto.countDocuments(query),
      HomeQuickInfo.findOne(),
    ]);

    const hasActiveFilters = Boolean(search);

    const totalPhotos = await SankalpPhoto.countDocuments({ isPublished: true });
    const pagination = getPagination(req.query.page, total, 9);
    const photos = await SankalpPhoto.find(query)
      .sort({ order: 1, date: -1, createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.pageSize);

    res.render("gallery", {
      title: "फ़ोटो एवं कार्यक्रम गैलरी | पल्लवी पाल",
      photos,
      search,
      pagination,
      totalPhotos,
      quickInfo: quickInfo || {},
    });
  } catch (error) {
    console.error("Gallery render error:", error);
    const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
    const hasActiveFilters = Boolean(search);
    res.render("gallery", {
      title: "फ़ोटो एवं कार्यक्रम गैलरी | पल्लवी पाल",
      photos: hasActiveFilters ? [] : defaultGalleryPhotos,
      quickInfo: {},
      search,
      pagination: { page: 1, pageSize: 9, total: hasActiveFilters ? 0 : defaultGalleryPhotos.length, totalPages: hasActiveFilters ? 0 : Math.ceil(defaultGalleryPhotos.length / 9) },
    });
  }
};

// API: Filtered photos JSON
exports.getGalleryApi = async (req, res) => {
  try {
    const { district, search } = req.query;
    const query = { isPublished: true };

    if (typeof district === "string" && district.trim() && district !== "all") {
      query.district = district.trim();
    }

    addGallerySearch(query, search);

    const [total] = await Promise.all([SankalpPhoto.countDocuments(query)]);
    const pagination = getPagination(req.query.page, total, 50);
    const photos = await SankalpPhoto.find(query).sort({
      order: 1,
      date: -1,
      createdAt: -1,
    }).skip(pagination.skip).limit(pagination.pageSize).lean();

    res.json({
      success: true,
      count: pagination.total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      photos,
    });
  } catch (error) {
    console.error("Gallery API error:", error);
    res.status(500).json({ success: false, message: "Error fetching photos" });
  }
};
