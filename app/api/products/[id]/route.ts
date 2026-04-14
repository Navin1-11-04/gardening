// app/api/products/[id]/route.ts
// Tries MongoDB first (by ObjectId or numeric id), falls back to static data.

import { NextRequest, NextResponse } from "next/server";
import { getProductById, getRelatedProducts } from "@/data/Product";

async function getFromMongo(id: string) {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Product } = await import("@/models/Product");
    const { Category } = await import("@/models/Category");

    await connectDB();

    // Try MongoDB ObjectId first, then fallback to numeric lookup isn't needed
    // since MongoDB uses ObjectIds
    const p = await Product.findById(id)
      .populate("categoryId", "name slug")
      .lean();

    if (!p) return null;

    const product = {
      id: (p as any)._id.toString(),
      name: (p as any).name,
      nameTa: (p as any).nameTa,
      subtitle: (p as any).subtitle ?? "",
      subtitleTa: (p as any).subtitleTa,
      description: (p as any).description,
      highlights: (p as any).highlights ?? [],
      howToUse: (p as any).howToUse ?? [],
      price: (p as any).price,
      originalPrice: (p as any).originalPrice,
      badge: (p as any).badge,
      category: (p as any).categoryId?.slug ?? "uncategorized",
      images: (p as any).images ?? [],
      rating: (p as any).rating,
      reviews: (p as any).reviews,
      weights: (p as any).weights ?? [],
      sku: (p as any).sku,
      inStock: (p as any).inStock,
      deliveryDays: (p as any).deliveryDays ?? "2–4",
    };

    // Related products — same category
    const related = await Product.find({
      categoryId: (p as any).categoryId?._id ?? (p as any).categoryId,
      _id: { $ne: (p as any)._id },
      active: true,
    })
      .populate("categoryId", "name slug")
      .limit(4)
      .lean();

    const relatedMapped = related.map((r: any) => ({
      id: r._id.toString(),
      name: r.name,
      nameTa: r.nameTa,
      subtitle: r.subtitle ?? "",
      description: r.description,
      highlights: r.highlights ?? [],
      howToUse: r.howToUse ?? [],
      price: r.price,
      originalPrice: r.originalPrice,
      badge: r.badge,
      category: r.categoryId?.slug ?? "uncategorized",
      images: r.images ?? [],
      rating: r.rating,
      reviews: r.reviews,
      weights: r.weights ?? [],
      sku: r.sku,
      inStock: r.inStock,
      deliveryDays: r.deliveryDays ?? "2–4",
    }));

    return { product, related: relatedMapped };
  } catch {
    return null;
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try MongoDB first (ObjectId)
  const mongoResult = await getFromMongo(id);
  if (mongoResult) return NextResponse.json(mongoResult);

  // Fall back to static (numeric id)
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const product = getProductById(numericId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    product,
    related: getRelatedProducts(numericId, 4),
  });
}