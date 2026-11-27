import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { getEnv } from "@/lib/env";
import { canDestroyAsset, canDisplayPublicId, writableMediaNamespace } from "@/lib/media/policy";

let configured = false;

function ensureCloudinary() {
  if (configured) return;
  const env = getEnv();
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export function createSignedUploadParams(input: {
  category: string;
  uploadedBy: string;
}) {
  ensureCloudinary();
  const timestamp = Math.round(Date.now() / 1000);
  const folder = `${writableMediaNamespace()}/${input.category}`;
  const paramsToSign = {
    timestamp,
    folder,
    allowed_formats: "jpg,png,webp,avif",
  };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    getEnv().CLOUDINARY_API_SECRET,
  );
  return {
    timestamp,
    folder,
    signature,
    apiKey: getEnv().CLOUDINARY_API_KEY,
    cloudName: getEnv().CLOUDINARY_CLOUD_NAME,
    allowedFormats: paramsToSign.allowed_formats,
    uploadedBy: input.uploadedBy,
  };
}

export async function destroyAsset(publicId: string, resourceType: "image" | "video") {
  if (!canDestroyAsset(publicId)) {
    throw new Error("Refusing to delete shared Cloudinary media.");
  }
  ensureCloudinary();
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export async function verifyUploadedAsset(publicId: string, resourceType: "image" | "video") {
  ensureCloudinary();
  const result = await cloudinary.api.resource(publicId, {
    resource_type: resourceType,
  });
  return result;
}

export function cloudinaryImageUrl(publicId: string, width = 1200) {
  if (!canDisplayPublicId(publicId)) {
    throw new Error("Refusing to display a media asset outside the active namespace.");
  }
  ensureCloudinary();
  return cloudinary.url(publicId, {
    secure: true,
    width,
    crop: "limit",
    quality: "auto",
    fetch_format: "auto",
  });
}
