// app/api/products/route.ts
// Tries MongoDB first, falls back to static data/Product.ts

import { NextRequest, NextResponse } from "next/server";
import { products as staticProducts, getProductsByCategory } from "@/data/Product";

async function getFromMongo(category?: string) {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Product } = await import("@/models/Product");
    const { Category } = await import("@/models/Category");

    await connectDB();

    let query: any = { active: true };

    if (category && category !== "all") {
      const cat = await Category.findOne({ slug: category }).lean();
      if (cat) query.categoryId = (cat as any)._id;
    }

    const dbProducts = await Product.find(query)
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    if (dbProducts.length === 0) return null;

    return dbProducts.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      nameTa: p.nameTa,
      subtitle: p.subtitle ?? "",
      subtitleTa: p.subtitleTa,
      description: p.description,
      highlights: p.highlights ?? [],
      howToUse: p.howToUse ?? [],
      price: p.price,
      originalPrice: p.originalPrice,
      badge: p.badge,
      category: p.categoryId?.slug ?? "uncategorized",
      images: p.images ?? [],
      rating: p.rating,
      reviews: p.reviews,
      weights: p.weights ?? [],
      sku: p.sku,
      inStock: p.inStock,
      deliveryDays: p.deliveryDays ?? "2–4",
    }));
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get("cat") ?? undefined;

  const mongoResult = await getFromMongo(cat);
  if (mongoResult) return NextResponse.json(mongoResult);

  // Static fallback
  const result = cat ? getProductsByCategory(cat) : staticProducts;
  return NextResponse.json(result);
}