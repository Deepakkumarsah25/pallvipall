const mongoose = require("mongoose");

const socialConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main_config",
      unique: true,
    },
    instagram: {
      userId: { type: String, trim: true, default: "" },
      accessToken: { type: String, trim: true, default: "" },
      handle: { type: String, trim: true, default: "nishadsankalp" },
      autoFetchEnabled: { type: Boolean, default: true },
    },
    facebook: {
      pageId: { type: String, trim: true, default: "" },
      pageAccessToken: { type: String, trim: true, default: "" },
      pageName: { type: String, trim: true, default: "निषाद आरक्षण संकल्प" },
      autoFetchEnabled: { type: Boolean, default: true },
    },
    twitter: {
      bearerToken: { type: String, trim: true, default: "" },
      username: { type: String, trim: true, default: "nishad_sankalp" },
      autoFetchEnabled: { type: Boolean, default: true },
    },
    lastSyncedAt: {
      type: Date,
      default: null,
    },
    lastSyncStatus: {
      type: String,
      default: "Never Synced",
    },
    lastSyncMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

socialConfigSchema.statics.getOrInit = async function () {
  let config = await this.findOne({ key: "main_config" });
  if (!config) {
    config = await this.create({ key: "main_config" });
  }
  return config;
};

module.exports = mongoose.models.SocialConfig || mongoose.model("SocialConfig", socialConfigSchema);

