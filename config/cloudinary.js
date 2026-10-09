const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const cloudinary = require("cloudinary").v2;

const configured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function uploadBuffer(buffer, folder = "pallavi-pal/uploads", options = {}) {
  if (!configured) {
    throw new Error("Cloudinary is not configured. Add the CLOUDINARY_* values to .env.");
  }

  const uploadOptions = typeof options === "string"
    ? { resource_type: options }
    : options;
  const resourceType = uploadOptions.resource_type || "auto";

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, ...uploadOptions },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    upload.end(Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer));
  });
}

async function uploadFilePath(filePath, folder = "pallavi-pal/uploads", options = {}) {
  if (!configured) throw new Error("Cloudinary is not configured. Add CLOUDINARY_* values to .env.");
  const { removeLocal = true, ...uploadOptions } = options;
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: uploadOptions.resource_type || "auto",
    ...uploadOptions,
  });
  if (removeLocal) {
    const fs = require("fs");
    await fs.promises.unlink(filePath).catch(() => {});
  }
  return result;
}

async function uploadToCloudinary(file, folder = "pallavi-pal/uploads", options = {}) {
  if (!file) return "";
  if (Buffer.isBuffer(file)) return (await uploadBuffer(file, folder, options)).secure_url;
  if (typeof file === "string") {
    if (/^https?:\/\//i.test(file)) return file;
    const fs = require("fs");
    if (fs.existsSync(file)) return (await uploadFilePath(file, folder, options)).secure_url;
    return file;
  }
  if (file.buffer) return (await uploadBuffer(file.buffer, folder, options)).secure_url;
  if (file.path) return (await uploadFilePath(file.path, folder, options)).secure_url;
  return "";
}

async function removeImage(publicId, resourceType = "image") {
  return removeAsset(publicId, resourceType);
}

async function removeAsset(publicId, resourceType = "image") {
  if (!publicId || !configured) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

module.exports = { cloudinary, configured, uploadBuffer, uploadFilePath, uploadToCloudinary, removeImage, removeAsset };
