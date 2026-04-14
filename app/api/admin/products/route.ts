import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find()
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    const normalised = products.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      nameTa: p.nameTa,
      subtitle: p.subtitle,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      badge: p.badge,
      sku: p.sku,
      stock: p.stock,
      inStock: p.inStock,
      active: p.active,
      images: p.images,
      highlights: p.highlights,
      weights: p.weights,
      category: p.categoryId,   // populated object { name, slug }
      categoryId: p.categoryId?._id?.toString() ?? p.categoryId?.toString(),
      createdAt: p.createdAt,
    }));

    return NextResponse.json(normalised, { status: 200 });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    // images array should already contain Cloudinary URLs
    // (uploaded client-side via /api/admin/upload endpoint)
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Ensure slug is unique
    const existing = await Product.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const product = await Product.create({
      name: data.name,
      nameTa: data.nameTa || undefined,
      subtitle: data.subtitle || undefined,
      slug: finalSlug,
      description: data.description,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      categoryId: data.categoryId,
      sku: data.sku,
      stock: Number(data.stock),
      badge: data.badge || undefined,
      highlights: data.highlights ?? [],
      weights: data.weights ?? [],
      active: data.active ?? true,
      inStock: Number(data.stock) > 0,
      images: data.images ?? [],
      howToUse: data.howToUse ?? [],
    });

    const populated = await product.populate("categoryId", "name slug");

    return NextResponse.json(
      { ...populated.toObject(), id: populated._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}