import { getProductById, getRelatedProducts } from "@/data/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const product = getProductById(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const related = getRelatedProducts(id, 4);

  return NextResponse.json({ product, related });
}