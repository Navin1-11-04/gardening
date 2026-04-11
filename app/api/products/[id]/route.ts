// app/api/products/[id]/route.ts
// Tries DB first, falls back to static product data

import { NextRequest, NextResponse } from "next/server";
import { getProductById, getRelatedProducts } from "@/data/Product";

async function getFromDatabase(id: number) {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const p = await prisma.product.findUnique({
      where: { id },
      include: { category: { select: { name: true, slug: true } } },
    });

    await prisma.$disconnect();
    if (!p) return null;

    const product = {
      id: p.id,
      name: p.name,
      subtitle: p.subtitle ?? "",
      description: p.description,
      highlights: safeJson(p.highlights, []),
      howToUse: safeJson(p.howToUse, []),
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      badge: p.badge ?? undefined,
      category: p.category?.slug ?? "uncategorized",
      images: safeJson(p.images, ["https://via.placeholder.com/400"]),
      rating: p.rating,
      reviews: p.reviews,
      weights: safeJson(p.weights, []),
      sku: p.sku,
      inStock: p.inStock,
      deliveryDays: "2–4",
    };

    // Related: same category, different product
    const { PrismaClient: PC2 } = await import("@prisma/client");
    const p2 = new PC2();
    const relatedRaw = await p2.product.findMany({
      where: { categoryId: p.categoryId, id: { not: id }, active: true },
      take: 4,
      include: { category: { select: { slug: true } } },
    });
    await p2.$disconnect();

    const related = relatedRaw.map((r) => ({
      id: r.id,
      name: r.name,
      subtitle: r.subtitle ?? "",
      description: r.description,
      highlights: safeJson(r.highlights, []),
      howToUse: safeJson(r.howToUse, []),
      price: r.price,
      originalPrice: r.originalPrice ?? undefined,
      badge: r.badge ?? undefined,
      category: r.category?.slug ?? "uncategorized",
      images: safeJson(r.images, ["https://via.placeholder.com/400"]),
      rating: r.rating,
      reviews: r.reviews,
      weights: safeJson(r.weights, []),
      sku: r.sku,
      inStock: r.inStock,
      deliveryDays: "2–4",
    }));

    return { product, related };
  } catch {
    return null;
  }
}

function safeJson(v: string | null | undefined, fallback: any) {
  if (!v) return fallback;
  try { return JSON.parse(v); } catch { return fallback; }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  // Try DB first
  const dbResult = await getFromDatabase(id);
  if (dbResult) return NextResponse.json(dbResult);

  // Fall back to static
  const product = getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ product, related: getRelatedProducts(id, 4) });
}