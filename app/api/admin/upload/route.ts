import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { requireAdminAuth } from "@/lib/adminAuthServer";

// App Router route segment config (correct syntax)
export const maxDuration = 30; // seconds — give Cloudinary time to respond

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { source, folder } = await request.json();

    if (!source) {
      return NextResponse.json({ error: "No image source provided" }, { status: 400 });
    }

    // Guard: base64 of 8MB image ≈ ~10.7MB string length
    if (typeof source === "string" && source.length > 11_000_000) {
      return NextResponse.json(
        { error: "Image too large. Please use an image under 8MB." },
        { status: 413 }
      );
    }

    const url = await uploadImage(source, folder ?? "kavin-organics/products");
    return NextResponse.json({ url }, { status: 200 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to upload image" },
      { status: 500 }
    );
  }
}