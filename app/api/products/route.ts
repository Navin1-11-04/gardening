import { getProductsByCategory, products } from "@/data/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get("cat");

  const result = cat ? getProductsByCategory(cat) : products;

  return NextResponse.json(result);
}