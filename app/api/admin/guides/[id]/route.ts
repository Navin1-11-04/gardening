// app/api/admin/guides/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Guide } from "@/models/Guide";
import { requireAdminAuth } from "@/lib/adminAuthServer";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    await connectDB();
    const guide = await Guide.findById(id).lean();
    if (!guide) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...(guide as any), id: (guide as any)._id.toString() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch guide" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const data = await request.json();
    await connectDB();

    const guide = await Guide.findByIdAndUpdate(
      id,
      {
        slug:        data.slug,
        title:       data.title,
        excerpt:     data.excerpt,
        category:    data.category,
        tag:         data.tag || undefined,
        readTime:    Number(data.readTime) || 5,
        date:        data.date,
        author:      data.author,
        authorRole:  data.authorRole,
        heroImage:   data.heroImage,
        intro:       data.intro,
        sections:    data.sections ?? [],
        relatedSlugs:data.relatedSlugs ?? [],
        featured:    data.featured ?? false,
        active:      data.active ?? true,
      },
      { new: true, runValidators: true }
    );

    if (!guide) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Updated", id: guide._id.toString() });
  } catch (error) {
    console.error("Guide update error:", error);
    return NextResponse.json({ error: "Failed to update guide" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    await connectDB();
    const guide = await Guide.findByIdAndDelete(id);
    if (!guide) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete guide" }, { status: 500 });
  }
}