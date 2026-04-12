import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(params.id) },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const product = await prisma.product.update({
      where: { id: Number(params.id) },
      data: {
        name: data.name,
        nameTa: data.nameTa,
        subtitle: data.subtitle,
        description: data.description,
        price: Number(data.price),
        originalPrice: data.originalPrice
          ? Number(data.originalPrice)
          : null,
        categoryId: Number(data.categoryId),
        sku: data.sku,
        stock: Number(data.stock),
        badge: data.badge,
        highlights: JSON.stringify(data.highlights || []),
        weights: JSON.stringify(data.weights || []),
        active: data.active,
        inStock: Number(data.stock) > 0,
      },
      include: { category: { select: { name: true } } },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}