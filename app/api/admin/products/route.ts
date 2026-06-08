// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { requireAdminAuth } from "@/lib/adminAuthServer";
import { verifyCsrf } from "@/lib/csrf";

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function generateSku(name: string): string {
  const prefix = name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6).padEnd(3, "X");
  const suffix = Date.now().toString(36).toUpperCase().slice(-5);
  return `KO-${prefix}-${suffix}`;
}

function isDuplicateKeyError(error: any): boolean {
  return error?.code === 11000 || error?.errorResponse?.code === 11000;
}

function getDuplicateField(error: any): string {
  const keyPattern = error?.keyPattern ?? error?.errorResponse?.keyPattern ?? {};
  return Object.keys(keyPattern)[0] ?? "field";
}

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const products = await Product.find()
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    const normalised = products.map((p: any) => ({
      id:          p._id.toString(),
      name:        p.name,
      nameTa:      p.nameTa,
      subtitle:    p.subtitle,
      description: p.description,
      price:       p.price,
      originalPrice: p.originalPrice,
      badge:       p.badge,
      sku:         p.sku,
      stock:       p.stock,
      inStock:     p.inStock,
      active:      p.active,
      images:      p.images,
      highlights:  p.highlights,
      weights:     p.weights,
      category:    p.categoryId,
      categoryId:  p.categoryId?._id?.toString() ?? p.categoryId?.toString(),
      createdAt:   p.createdAt,
    }));

    return NextResponse.json(normalised, { status: 200 });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  const csrf = await verifyCsrf(request);
  if (!csrf.ok) return csrf.response;

  try {
    await connectDB();
    const data = await request.json();

    if (!data.name?.trim()) return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    if (!data.categoryId)    return NextResponse.json({ error: "Category is required." }, { status: 400 });
    if (!data.price || Number(data.price) <= 0) return NextResponse.json({ error: "A valid price is required." }, { status: 400 });

    const baseSlug = slugify(data.name);
    const existingSlug = await Product.findOne({ slug: baseSlug }).lean();
    const finalSlug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug;

    let sku = data.sku?.trim() || generateSku(data.name);

    if (data.sku?.trim()) {
      const existingSku = await Product.findOne({ sku: data.sku.trim() }).lean();
      if (existingSku) {
        return NextResponse.json(
          { error: `SKU "${data.sku.trim()}" is already used by another product.` },
          { status: 409 }
        );
      }
    }

    const product = await Product.create({
      name:         data.name.trim(),
      nameTa:       data.nameTa?.trim() || undefined,
      subtitle:     data.subtitle?.trim() || undefined,
      slug:         finalSlug,
      description:  data.description?.trim() || "",
      price:        Number(data.price),
      originalPrice:data.originalPrice ? Number(data.originalPrice) : undefined,
      categoryId:   data.categoryId,
      sku,
      stock:        Number(data.stock) || 0,
      badge:        data.badge?.trim() || undefined,
      highlights:   data.highlights ?? [],
      weights:      data.weights ?? [],
      active:       data.active ?? true,
      inStock:      (Number(data.stock) || 0) > 0,
      images:       data.images ?? [],
      howToUse:     data.howToUse ?? [],
    });

    const populated = await product.populate("categoryId", "name slug");
    return NextResponse.json(
      { ...populated.toObject(), id: populated._id.toString() },
      { status: 201 }
    );
  } catch (error: any) {
    if (isDuplicateKeyError(error)) {
      const field = getDuplicateField(error);
      const value = error?.keyValue?.[field] ?? "";
      if (field === "sku") return NextResponse.json({ error: `SKU "${value}" is already in use.` }, { status: 409 });
      if (field === "slug") return NextResponse.json({ error: "A product with a very similar name already exists." }, { status: 409 });
      return NextResponse.json({ error: `Duplicate value for "${field}".` }, { status: 409 });
    }
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}