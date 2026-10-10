const SocialPost = require("../../models/SocialPost");
const SocialConfig = require("../../models/SocialConfig");
const socialSyncService = require("../../services/socialSyncService");

/**
 * Admin Social Media Management Hub
 */
exports.index = async (req, res) => {
  try {
    const selectedPlatform = typeof req.query.platform === "string" ? req.query.platform.toLowerCase() : "all";
    const filter = {};
    if (selectedPlatform && selectedPlatform !== "all") {
      filter.platform = selectedPlatform;
    }

    const [posts, config, stats] = await Promise.all([
      SocialPost.find(filter).sort({ publishedAt: -1, createdAt: -1 }).lean(),
      SocialConfig.getOrInit(),
      socialSyncService.getPlatformStats(),
    ]);

    res.render("admin/social/index", {
      title: "Social Media Wall Management",
      currentPath: "/admin/social",
      admin: req.session?.admin || {},
      posts,
      config,
      stats,
      selectedPlatform,
      success: req.query.success || "",
      error: req.query.error || "",
    });
  } catch (error) {
    console.error("Admin social index error:", error);
    res.status(500).render("error", {
      title: "Social Media Error",
      message: "Unable to load Social Media management dashboard.",
    });
  }
};

/**
 * Create Post (Supports creating for ALL sections at once or a specific platform)
 */
exports.createPost = async (req, res) => {
  try {
    const {
      targetPlatform,
      title,
      caption,
      mediaUrl,
      mediaType,
      url,
      formattedDate,
      likesCount,
      commentsCount,
      sharesCount,
      isPinned,
    } = req.body;

    if (!caption || !caption.trim()) {
      return res.redirect("/admin/social?error=" + encodeURIComponent("Caption / Text is required."));
    }

    const baseData = {
      title: (title || "").trim(),
      caption: caption.trim(),
      mediaUrl: (mediaUrl || "").trim(),
      mediaType: mediaType || "image",
      formattedDate: (formattedDate || "").trim(),
      likesCount: parseInt(likesCount, 10) || 0,
      commentsCount: parseInt(commentsCount, 10) || 0,
      sharesCount: parseInt(sharesCount, 10) || 0,
      isPinned: isPinned === "true" || isPinned === true,
      publishedAt: new Date(),
      isActive: true,
    };

    // If "all" is selected, create 1 post in each of the 3 platforms: Instagram, Facebook, and Twitter
    if (targetPlatform === "all") {
      const platforms = ["instagram", "facebook", "twitter"];
      for (const plt of platforms) {
        const uniqueId = `manual-${plt}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        let postUrl = (url || "").trim();
        if (!postUrl) {
          if (plt === "instagram") postUrl = "https://www.instagram.com";
          else if (plt === "facebook") postUrl = "https://www.facebook.com";
          else postUrl = "https://twitter.com";
        }

        await SocialPost.create({
          ...baseData,
          platform: plt,
          postId: uniqueId,
          url: postUrl,
          author: {
            name: "निषाद आरक्षण संकल्प",
            username: plt === "twitter" ? "nishad_sankalp" : "nishadsankalp",
            avatarUrl: "/images/logo.png",
          },
        });
      }

      return res.redirect("/admin/social?success=" + encodeURIComponent("Post successfully published to ALL 3 sections (Instagram, Facebook & Twitter)!"));
    }

    // Single platform creation
    const plt = targetPlatform || "instagram";
    const uniqueId = `manual-${plt}-${Date.now()}`;
    let postUrl = (url || "").trim();
    if (!postUrl) {
      if (plt === "instagram") postUrl = "https://www.instagram.com";
      else if (plt === "facebook") postUrl = "https://www.facebook.com";
      else postUrl = "https://twitter.com";
    }

    await SocialPost.create({
      ...baseData,
      platform: plt,
      postId: uniqueId,
      url: postUrl,
      author: {
        name: "निषाद आरक्षण संकल्प",
        username: plt === "twitter" ? "nishad_sankalp" : "nishadsankalp",
        avatarUrl: "/images/logo.png",
      },
    });

    res.redirect("/admin/social?success=" + encodeURIComponent(`Post added successfully to ${plt.toUpperCase()}!`));
  } catch (error) {
    console.error("Create social post error:", error);
    res.redirect("/admin/social?error=" + encodeURIComponent("Failed to create post: " + error.message));
  }
};

/**
 * Edit Post Page
 */
exports.editPostPage = async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id).lean();
    if (!post) {
      return res.redirect("/admin/social?error=" + encodeURIComponent("Post not found."));
    }

    res.render("admin/social/form", {
      title: "Edit Social Post",
      currentPath: "/admin/social",
      admin: req.session?.admin || {},
      post,
      error: req.query.error || "",
    });
  } catch (error) {
    console.error("Edit social post page error:", error);
    res.redirect("/admin/social?error=" + encodeURIComponent("Error loading post."));
  }
};

/**
 * Update Post
 */
exports.updatePost = async (req, res) => {
  try {
    const {
      title,
      caption,
      mediaUrl,
      mediaType,
      url,
      formattedDate,
      likesCount,
      commentsCount,
      sharesCount,
      isPinned,
      isActive,
    } = req.body;

    await SocialPost.findByIdAndUpdate(req.params.id, {
      $set: {
        title: (title || "").trim(),
        caption: (caption || "").trim(),
        mediaUrl: (mediaUrl || "").trim(),
        mediaType: mediaType || "image",
        url: (url || "").trim() || "https://www.instagram.com",
        formattedDate: (formattedDate || "").trim(),
        likesCount: parseInt(likesCount, 10) || 0,
        commentsCount: parseInt(commentsCount, 10) || 0,
        sharesCount: parseInt(sharesCount, 10) || 0,
        isPinned: isPinned === "true" || isPinned === true,
        isActive: isActive === "true" || isActive === true,
      },
    });

    res.redirect("/admin/social?success=" + encodeURIComponent("Post updated successfully!"));
  } catch (error) {
    console.error("Update social post error:", error);
    res.redirect("/admin/social?error=" + encodeURIComponent("Failed to update post: " + error.message));
  }
};

/**
 * Delete Post
 */
exports.deletePost = async (req, res) => {
  try {
    await SocialPost.findByIdAndDelete(req.params.id);
    res.redirect("/admin/social?success=" + encodeURIComponent("Post deleted successfully."));
  } catch (error) {
    console.error("Delete social post error:", error);
    res.redirect("/admin/social?error=" + encodeURIComponent("Failed to delete post."));
  }
};

/**
 * Toggle Active Status
 */
exports.togglePost = async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id);
    if (post) {
      post.isActive = !post.isActive;
      await post.save();
    }
    res.redirect("/admin/social?success=" + encodeURIComponent("Post status toggled."));
  } catch (error) {
    console.error("Toggle social post error:", error);
    res.redirect("/admin/social?error=" + encodeURIComponent("Error toggling post."));
  }
};

/**
 * Save Accounts Credentials (Instagram & Facebook IDs)
 */
exports.saveConfig = async (req, res) => {
  try {
    const {
      igUserId,
      igAccessToken,
      igHandle,
      fbPageId,
      fbPageAccessToken,
      fbPageName,
      twBearerToken,
      twUsername,
    } = req.body;

    await SocialConfig.findOneAndUpdate(
      { key: "main_config" },
      {
        $set: {
          "instagram.userId": (igUserId || "").trim(),
          "instagram.accessToken": (igAccessToken || "").trim(),
          "instagram.handle": (igHandle || "nishadsankalp").trim(),
          "facebook.pageId": (fbPageId || "").trim(),
          "facebook.pageAccessToken": (fbPageAccessToken || "").trim(),
          "facebook.pageName": (fbPageName || "निषाद आरक्षण संकल्प").trim(),
          "twitter.bearerToken": (twBearerToken || "").trim(),
          "twitter.username": (twUsername || "nishad_sankalp").trim().replace(/^@/, ""),
        },
      },
      { upsert: true, new: true }
    );

    res.redirect("/admin/social?success=" + encodeURIComponent("Social accounts & credentials saved successfully!"));
  } catch (error) {
    console.error("Save social config error:", error);
    res.redirect("/admin/social?error=" + encodeURIComponent("Failed to save credentials: " + error.message));
  }
};

/**
 * Trigger Auto-Fetch Now
 */
exports.triggerAutoFetch = async (req, res) => {
  try {
    const result = await socialSyncService.syncAllPlatforms();
    let msg = `Auto-fetch completed: ${result.syncedCount} posts imported/updated!`;
    if (result.errors && result.errors.length) {
      msg += ` [Alerts: ${result.errors.map((e) => `${e.platform} - ${e.message}`).join(" | ")}]`;
    }
    res.redirect("/admin/social?success=" + encodeURIComponent(msg));
  } catch (error) {
    console.error("Auto fetch error:", error);
    res.redirect("/admin/social?error=" + encodeURIComponent("Auto-fetch error: " + error.message));
  }
};

