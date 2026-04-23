import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { requireAdminAuth } from "@/lib/adminAuthServer";

// App Router route config
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const { source, folder } = body;

    if (!source) {
      return NextResponse.json(
        { error: "No image source provided" },
        { status: 400 }
      );
    }

    // Guard: base64 string size check (~8MB image ≈ 10.7MB base64)
    if (typeof source === "string" && source.length > 11_000_000) {
      return NextResponse.json(
        { error: "Image too large. Please use an image under 8MB." },
        { status: 413 }
      );
    }

    const uploadFolder = folder || "kavin-organics/products";

    const url = await uploadImage(source, uploadFolder);

    return NextResponse.json(
      { success: true, url },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to upload image",
      },
      { status: 500 }
    );
  }
}