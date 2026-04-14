import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

/**
 * Upload a base64 or URL image to Cloudinary.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadImage(
  source: string,
  folder = "kavin-organics/products"
): Promise<string> {
  const result = await cloudinary.uploader.upload(source, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return result.secure_url;
}

/**
 * Delete an image from Cloudinary by its public_id.
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Extract Cloudinary public_id from a secure URL.
 * e.g. https://res.cloudinary.com/demo/image/upload/v123/folder/file.jpg
 *   → folder/file
 */
export function getPublicIdFromUrl(url: string): string {
  const parts = url.split("/upload/");
  if (parts.length < 2) return "";
  // Remove version segment (v12345/) if present
  const withoutVersion = parts[1].replace(/^v\d+\//, "");
  // Remove file extension
  return withoutVersion.replace(/\.[^/.]+$/, "");
}