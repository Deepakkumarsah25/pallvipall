const socialSyncService = require("../services/socialSyncService");

/**
 * Render Public Social Wall Page with Multi-Platform Rails
 * (Instagram rail, Facebook rail, Twitter/X rail)
 */
exports.getSocialPage = async (req, res) => {
  try {
    const [rails, stats] = await Promise.all([
      socialSyncService.getAllPlatformRails(),
      socialSyncService.getPlatformStats(),
    ]);

    res.render("social", {
      title: "Social Wall | निषाद आरक्षण संकल्प अभियान",
      currentUrl: "/social",
      instagramPosts: rails.instagram || [],
      facebookPosts: rails.facebook || [],
      twitterPosts: rails.twitter || [],
      stats,
    });
  } catch (error) {
    console.error("Fetch social page error:", error);
    res.render("social", {
      title: "Social Wall | निषाद आरक्षण संकल्प अभियान",
      currentUrl: "/social",
      instagramPosts: [],
      facebookPosts: [],
      twitterPosts: [],
      stats: { total: 0, instagram: 0, facebook: 0, twitter: 0 },
    });
  }
};

/**
 * JSON API for asynchronous platform rails
 */
exports.apiGetPosts = async (req, res) => {
  try {
    const { platform, page, limit, search } = req.query;

    if (platform && platform !== "all") {
      const result = await socialSyncService.getSocialPosts({
        platform,
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 8,
        search,
      });

      return res.json({
        success: true,
        data: result.posts,
        pagination: result.pagination,
      });
    }

    const rails = await socialSyncService.getAllPlatformRails();
    res.json({
      success: true,
      data: rails,
    });
  } catch (error) {
    console.error("API get social posts error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve social posts",
    });
  }
};

/**
 * Trigger sync of all social platforms
 */
exports.syncPosts = async (req, res) => {
  try {
    const result = await socialSyncService.syncAllPlatforms();
    res.json({
      success: true,
      message: `Sync finished: ${result.syncedCount} posts updated`,
      details: result,
    });
  } catch (error) {
    console.error("Sync social posts error:", error);
    res.status(500).json({
      success: false,
      message: "Sync failed",
      error: error.message,
    });
  }
};
