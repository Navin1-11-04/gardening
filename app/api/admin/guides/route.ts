// app/api/admin/guides/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Guide } from "@/models/Guide";
import { requireAdminAuth } from "@/lib/adminAuthServer";

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const guides = await Guide.find()
      .sort({ featured: -1, createdAt: -1 })
      .select("slug title category tag readTime date heroImage featured active createdAt")
      .lean();

    return NextResponse.json(
      guides.map((g: any) => ({
        id:       g._id.toString(),
        slug:     g.slug,
        title:    g.title,
        category: g.category,
        tag:      g.tag ?? "",
        readTime: g.readTime,
        date:     g.date,
        image:    g.heroImage,
        featured: g.featured,
        active:   g.active,
      }))
    );
  } catch (error) {
    console.error("Guides list error:", error);
    return NextResponse.json({ error: "Failed to fetch guides" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const data = await request.json();

    if (!data.slug || !data.title) {
      return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
    }

    const existing = await Guide.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json({ error: "A guide with this slug already exists" }, { status: 409 });
    }

    const guide = await Guide.create({
      slug:        data.slug,
      title:       data.title,
      excerpt:     data.excerpt ?? "",
      category:    data.category ?? "tips",
      tag:         data.tag || undefined,
      readTime:    Number(data.readTime) || 5,
      date:        data.date ?? new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      author:      data.author ?? "Rajan M.",
      authorRole:  data.authorRole ?? "Horticulture Advisor, Kavin Organics",
      heroImage:   data.heroImage ?? "",
      intro:       data.intro ?? "",
      sections:    data.sections ?? [],
      relatedSlugs:data.relatedSlugs ?? [],
      featured:    data.featured ?? false,
      active:      data.active ?? true,
    });

    return NextResponse.json({ id: guide._id.toString(), slug: guide.slug }, { status: 201 });
  } catch (error) {
    console.error("Guide create error:", error);
    return NextResponse.json({ error: "Failed to create guide" }, { status: 500 });
  }
}