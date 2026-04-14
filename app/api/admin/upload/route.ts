// app/api/admin/upload/route.ts
// Accepts a base64 image OR a public URL and uploads it to Cloudinary.
// Returns { url } — the secure Cloudinary URL to store in the product doc.

import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const { source, folder } = await request.json();

    if (!source) {
      return NextResponse.json({ error: "No image source provided" }, { status: 400 });
    }

    const url = await uploadImage(source, folder ?? "kavin-organics/products");

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

// Allow larger payloads for base64 images
export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};