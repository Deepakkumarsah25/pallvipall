const mongoose = require("mongoose");

const sankalpPhotoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      default: "जनसमर्थक",
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      trim: true,
      default: "Uttar Pradesh",
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    dateString: {
      type: String,
      trim: true,
      default: "",
    },
    caption: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL or file is required"],
      trim: true,
    },
    imageFilename: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Formatted date virtual
sankalpPhotoSchema.virtual("formattedDate").get(function () {
  if (this.dateString && this.dateString.trim()) {
    return this.dateString;
  }
  if (!this.date) return "";
  try {
    const d = new Date(this.date);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (e) {
    return "";
  }
});

sankalpPhotoSchema.index({ isPublished: 1, order: 1, date: -1, createdAt: -1 });
sankalpPhotoSchema.index({ isPublished: 1, district: 1, order: 1, date: -1, createdAt: -1 });
sankalpPhotoSchema.index({ order: 1, date: -1, createdAt: -1 });

module.exports = mongoose.model("SankalpPhoto", sankalpPhotoSchema);
