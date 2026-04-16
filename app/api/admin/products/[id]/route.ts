import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { deleteImage, getPublicIdFromUrl } from "@/lib/cloudinary";
import { requireAdminAuth } from "@/lib/adminAuthServer";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    await connectDB();

    const product = await Product.findById(id)
      .populate("categoryId", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { ...(product as any), id: (product as any)._id.toString() },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
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
    await connectDB();
    const data = await request.json();

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name: data.name,
        nameTa: data.nameTa || undefined,
        subtitle: data.subtitle || undefined,
        description: data.description,
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
        categoryId: data.categoryId,
        sku: data.sku,
        stock: Number(data.stock),
        badge: data.badge || undefined,
        highlights: data.highlights ?? [],
        weights: data.weights ?? [],
        active: data.active,
        inStock: Number(data.stock) > 0,
        images: data.images ?? [],
      },
      { new: true, runValidators: true }
    ).populate("categoryId", "name slug");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { ...product.toObject(), id: product._id.toString() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    await connectDB();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await Promise.allSettled(
      product.images.map((url) => {
        const publicId = getPublicIdFromUrl(url);
        return publicId ? deleteImage(publicId) : Promise.resolve();
      })
    );

    await product.deleteOne();
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}