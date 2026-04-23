import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Content } from "@/models/Content";
import { requireAdminAuth } from "@/lib/adminAuthServer";

const LABELS: Record<string, string> = {
  homepage: "Homepage (Slider & Announcement)",
  about:    "About Us Page",
  faq:      "FAQs Page",
  shipping: "Shipping & Delivery Page",
  returns:  "Returns & Refunds Page",
  contact:  "Contact Page",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  const { key } = await params;

  try {
    await connectDB();
    const doc = await Content.findOne({ key }).lean();

    if (doc) {
      return NextResponse.json({ key, value: (doc as any).value, updatedAt: (doc as any).updatedAt });
    }

    // No DB doc yet — return the public default so admin can edit from a sensible base
    const publicRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/content/${key}`
    );
    if (publicRes.ok) {
      const value = await publicRes.json();
      return NextResponse.json({ key, value, updatedAt: null });
    }

    return NextResponse.json({ key, value: {}, updatedAt: null });
  } catch (error) {
    console.error("Content GET error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  const { key } = await params;

  if (!LABELS[key]) {
    return NextResponse.json({ error: "Unknown content key" }, { status: 400 });
  }

  try {
    const { value } = await request.json();
    if (!value || typeof value !== "object") {
      return NextResponse.json({ error: "Value must be a JSON object" }, { status: 400 });
    }

    await connectDB();
    await Content.findOneAndUpdate(
      { key },
      { $set: { key, label: LABELS[key], value } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Saved successfully", key });
  } catch (error) {
    console.error("Content PUT error:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}