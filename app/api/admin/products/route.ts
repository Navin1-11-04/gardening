import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// CREATE product
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Generate slug from name
    const slug = data.name.toLowerCase().replace(/\s+/g, "-");

    const product = await prisma.product.create({
      data: {
        name: data.name,
        nameTa: data.nameTa,
        subtitle: data.subtitle,
        slug,
        description: data.description,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice
          ? parseFloat(data.originalPrice)
          : null,
        categoryId: parseInt(data.categoryId),
        sku: data.sku,
        stock: parseInt(data.stock),
        badge: data.badge,
        highlights: JSON.stringify(data.highlights || []),
        weights: JSON.stringify(data.weights || []),
        active: data.active,
        inStock: parseInt(data.stock) > 0,
        images: JSON.stringify([
          "https://via.placeholder.com/400x400?text=" + data.name,
        ]),
        howToUse: JSON.stringify([]),
      },
      include: { category: { select: { name: true } } },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
