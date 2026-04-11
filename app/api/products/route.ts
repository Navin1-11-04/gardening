// app/api/products/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Smart products API: tries Prisma DB first, falls back to static data.
// This bridges the admin panel (which manages products via Prisma) with the
// frontend shop pages.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getProductsByCategory, products as staticProducts } from "@/data/Product";

// Dynamically import Prisma so it fails gracefully if DB isn't set up yet
async function getFromDatabase(category?: string) {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const where = category && category !== "all"
      ? { active: true, category: { slug: category } }
      : { active: true };

    const dbProducts = await prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    });

    await prisma.$disconnect();

    if (dbProducts.length === 0) return null; // Fall back to static

    // Map DB schema → frontend Product type
    return dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      subtitle: p.subtitle ?? "",
      description: p.description,
      highlights: safeParseJson(p.highlights, []),
      howToUse: safeParseJson(p.howToUse, []),
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      badge: p.badge ?? undefined,
      category: p.category?.slug ?? "uncategorized",
      images: safeParseJson(p.images, ["https://via.placeholder.com/400"]),
      rating: p.rating,
      reviews: p.reviews,
      weights: safeParseJson(p.weights, []),
      sku: p.sku,
      inStock: p.inStock,
      deliveryDays: "2–4",
    }));
  } catch {
    return null; // DB not available, use static
  }
}

function safeParseJson(value: string | null | undefined, fallback: any) {
  if (!value) return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get("cat") ?? undefined;

  // Try DB first
  const dbResult = await getFromDatabase(cat);
  if (dbResult) {
    return NextResponse.json(dbResult);
  }

  // Fall back to static data
  const result = cat ? getProductsByCategory(cat) : staticProducts;
  return NextResponse.json(result);
}