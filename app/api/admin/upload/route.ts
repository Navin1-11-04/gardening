import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { requireAdminAuth } from "@/lib/adminAuthServer";

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { source, folder } = await request.json();

    if (!source) {
      return NextResponse.json({ error: "No image source provided" }, { status: 400 });
    }

    // Basic size guard — base64 of 8MB ≈ ~10.7MB string
    if (typeof source === "string" && source.length > 11_000_000) {
      return NextResponse.json({ error: "Image too large. Maximum size is 8MB." }, { status: 413 });
    }

    const url = await uploadImage(source, folder ?? "kavin-organics/products");
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};