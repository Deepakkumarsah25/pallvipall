const assert = require("node:assert/strict");
const test = require("node:test");
const SocialPost = require("../models/SocialPost");
const SocialConfig = require("../models/SocialConfig");
const instagramService = require("../services/social/instagramService");
const facebookService = require("../services/social/facebookService");
const twitterService = require("../services/social/twitterService");
const socialSyncService = require("../services/socialSyncService");
const socialController = require("../controllers/socialController");
const adminSocialController = require("../controllers/admin/socialController");

test("SocialPost and SocialConfig models load with correct configurations", () => {
  assert.ok(SocialPost, "SocialPost model should be defined");
  assert.ok(SocialConfig, "SocialConfig model should be defined");
  assert.ok(Array.isArray(SocialPost.defaultPosts), "SocialPost should have default sample posts");
  assert.ok(SocialPost.defaultPosts.length >= 3, "Default posts should contain multiple platforms");
});

test("Social platform fallback services return structured post objects", async () => {
  const igPosts = await instagramService.fetchPosts();
  assert.ok(Array.isArray(igPosts));
  assert.equal(igPosts[0].platform, "instagram");
  assert.ok(igPosts[0].url);

  const fbPosts = await facebookService.fetchPosts();
  assert.ok(Array.isArray(fbPosts));
  assert.equal(fbPosts[0].platform, "facebook");

  const twPosts = await twitterService.fetchPosts();
  assert.ok(Array.isArray(twPosts));
  assert.equal(twPosts[0].platform, "twitter");
});

test("socialController.getSocialPage renders social view with 3 separate rails", async (t) => {
  let renderedView = "";
  let renderedData = {};

  const req = {
    query: {
      platform: "instagram",
      search: "कलश",
      page: "1",
    },
  };

  const res = {
    render(view, data) {
      renderedView = view;
      renderedData = data;
    },
  };

  const origGetAllRails = socialSyncService.getAllPlatformRails;
  const origGetPlatformStats = socialSyncService.getPlatformStats;

  t.after(() => {
    socialSyncService.getAllPlatformRails = origGetAllRails;
    socialSyncService.getPlatformStats = origGetPlatformStats;
  });

  socialSyncService.getAllPlatformRails = async () => ({
    instagram: SocialPost.defaultPosts.filter((p) => p.platform === "instagram"),
    facebook: SocialPost.defaultPosts.filter((p) => p.platform === "facebook"),
    twitter: SocialPost.defaultPosts.filter((p) => p.platform === "twitter"),
  });

  socialSyncService.getPlatformStats = async () => ({
    total: 15,
    instagram: 5,
    facebook: 5,
    twitter: 5,
  });

  await socialController.getSocialPage(req, res);

  assert.equal(renderedView, "social");
  assert.equal(renderedData.currentUrl, "/social");
  assert.ok(Array.isArray(renderedData.instagramPosts));
  assert.ok(Array.isArray(renderedData.facebookPosts));
  assert.ok(Array.isArray(renderedData.twitterPosts));
  assert.ok(renderedData.instagramPosts.length > 0);
  assert.ok(renderedData.facebookPosts.length > 0);
  assert.ok(renderedData.twitterPosts.length > 0);
});

test("adminSocialController.createPost handles 'all' platform simultaneous publishing", async (t) => {
  const createdPosts = [];
  const origCreate = SocialPost.create;

  t.after(() => {
    SocialPost.create = origCreate;
  });

  SocialPost.create = async (doc) => {
    createdPosts.push(doc);
    return { ...doc, _id: "mock_id_" + createdPosts.length };
  };

  let redirectedUrl = "";
  const req = {
    session: { admin: { username: "admin", role: "superadmin" } },
    body: {
      targetPlatform: "all",
      title: "Universal Announcement",
      caption: "Publishing across Instagram, Facebook, and Twitter simultaneously",
      url: "https://example.com/post",
      mediaType: "image",
      mediaUrl: "/images/banner.jpg",
      publishedAt: "2026-10-09T12:00",
    },
  };

  const res = {
    redirect(url) {
      redirectedUrl = url;
    },
  };

  await adminSocialController.createPost(req, res);

  assert.equal(createdPosts.length, 3, "Should create 3 posts (one for each platform)");
  const platforms = createdPosts.map((p) => p.platform);
  assert.ok(platforms.includes("instagram"));
  assert.ok(platforms.includes("facebook"));
  assert.ok(platforms.includes("twitter"));
  assert.ok(redirectedUrl.includes("success="));
});

