const SocialPost = require("../models/SocialPost");
const instagramService = require("./social/instagramService");
const facebookService = require("./social/facebookService");
const twitterService = require("./social/twitterService");

const SocialConfig = require("../models/SocialConfig");

class SocialSyncService {
  /**
   * Automatically seed initial posts if collection is empty
   */
  async seedDefaultIfEmpty() {
    // Explicitly disabled: do not re-seed social posts automatically.
    return;
  }

  /**
   * Sync all platforms into the database
   */
  async syncAllPlatforms() {
    let syncedCount = 0;
    const errors = [];
    const config = await SocialConfig.getOrInit();

    // Sync Instagram
    try {
      const igOptions = {
        limit: 12,
        accessToken: config.instagram?.accessToken,
        userId: config.instagram?.userId,
      };
      const igPosts = await instagramService.fetchPosts(igOptions);
      syncedCount += await this.upsertBatch(igPosts);
    } catch (err) {
      errors.push({ platform: "instagram", message: err.message });
    }

    // Sync Facebook
    try {
      const fbOptions = {
        limit: 12,
        accessToken: config.facebook?.pageAccessToken,
        pageId: config.facebook?.pageId,
      };
      const fbPosts = await facebookService.fetchPosts(fbOptions);
      syncedCount += await this.upsertBatch(fbPosts);
    } catch (err) {
      errors.push({ platform: "facebook", message: err.message });
    }

    // Sync Twitter
    try {
      const twOptions = {
        limit: 12,
        bearerToken: config.twitter?.bearerToken,
        userId: config.twitter?.username,
      };
      const twPosts = await twitterService.fetchPosts(twOptions);
      syncedCount += await this.upsertBatch(twPosts);
    } catch (err) {
      errors.push({ platform: "twitter", message: err.message });
    }

    const status = errors.length === 0 ? "Success" : "Partial";
    const message = `Auto-fetched ${syncedCount} posts.${errors.length ? " (" + errors.length + " warnings)" : ""}`;

    await SocialConfig.updateOne(
      { key: "main_config" },
      {
        $set: {
          lastSyncedAt: new Date(),
          lastSyncStatus: status,
          lastSyncMessage: message,
        },
      }
    );

    return {
      success: true,
      syncedCount,
      errors,
      syncedAt: new Date(),
    };
  }

  /**
   * Upsert an array of posts
   * @param {Array} posts
   * @returns {Promise<number>}
   */
  async upsertBatch(posts) {
    if (!Array.isArray(posts) || !posts.length) return 0;
    let count = 0;

    for (const post of posts) {
      if (!post.postId || !post.platform) continue;
      await SocialPost.findOneAndUpdate(
        { platform: post.platform, postId: post.postId },
        { $set: post },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      count++;
    }

    return count;
  }

  /**
   * Retrieve posts with filtering, search and pagination
   */
  async getSocialPosts({ platform = "all", search = "", page = 1, limit = 9 } = {}) {
    await this.seedDefaultIfEmpty();

    const query = { isActive: true };

    if (platform && platform !== "all") {
      query.platform = platform.toLowerCase();
    }

    const cleanSearch = String(search || "").trim();
    if (cleanSearch) {
      const safeSearch = cleanSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 80);
      const searchRegex = new RegExp(safeSearch, "i");
      query.$or = [
        { caption: searchRegex },
        { title: searchRegex },
        { tags: searchRegex },
        { "author.name": searchRegex },
        { "author.username": searchRegex },
      ];
    }

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
    const skip = (currentPage - 1) * pageSize;

    const [total, posts] = await Promise.all([
      SocialPost.countDocuments(query),
      SocialPost.find(query)
        .sort({ isPinned: -1, publishedAt: -1, _id: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      posts,
      total,
      pagination: {
        page: currentPage,
        pageSize,
        totalPages,
        hasPrev: currentPage > 1,
        hasNext: currentPage < totalPages,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
      },
    };
  }

  /**
   * Fetch separate rails for Instagram, Facebook, and Twitter
   */
  async getAllPlatformRails() {
    await this.seedDefaultIfEmpty();

    const [instagram, facebook, twitter] = await Promise.all([
      SocialPost.find({ platform: "instagram", isActive: true })
        .sort({ isPinned: -1, publishedAt: -1, _id: -1 })
        .limit(20)
        .lean(),
      SocialPost.find({ platform: "facebook", isActive: true })
        .sort({ isPinned: -1, publishedAt: -1, _id: -1 })
        .limit(20)
        .lean(),
      SocialPost.find({ platform: "twitter", isActive: true })
        .sort({ isPinned: -1, publishedAt: -1, _id: -1 })
        .limit(20)
        .lean(),
    ]);

    // Fallback to default sample posts if DB has 0 for any platform
    const defaultIg = SocialPost.defaultPosts.filter((p) => p.platform === "instagram");
    const defaultFb = SocialPost.defaultPosts.filter((p) => p.platform === "facebook");
    const defaultTw = SocialPost.defaultPosts.filter((p) => p.platform === "twitter");

    return {
      instagram: instagram.length ? instagram : defaultIg,
      facebook: facebook.length ? facebook : defaultFb,
      twitter: twitter.length ? twitter : defaultTw,
    };
  }

  /**
   * Fetch aggregate counts for platforms
   */
  async getPlatformStats() {
    await this.seedDefaultIfEmpty();

    const [total, instagram, facebook, twitter] = await Promise.all([
      SocialPost.countDocuments({ isActive: true }),
      SocialPost.countDocuments({ platform: "instagram", isActive: true }),
      SocialPost.countDocuments({ platform: "facebook", isActive: true }),
      SocialPost.countDocuments({ platform: "twitter", isActive: true }),
    ]);

    return {
      total,
      instagram,
      facebook,
      twitter,
    };
  }
}

module.exports = new SocialSyncService();

