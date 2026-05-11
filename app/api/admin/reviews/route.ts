import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { requireAdminAuth } from "@/lib/adminAuthServer";

// GET: list all reviews (pending + approved)
export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const status = request.nextUrl.searchParams.get("status"); // "pending" | "approved" | null = all

    const query: any = {};
    if (status === "pending")  query.approved = false;
    if (status === "approved") query.approved = true;

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return NextResponse.json(
      reviews.map((r: any) => ({
        id:          r._id.toString(),
        productId:   r.productId,
        productName: r.productName,
        name:        r.name,
        phone:       r.phone ?? "",
        rating:      r.rating,
        comment:     r.comment,
        verified:    r.verified,
        approved:    r.approved,
        createdAt:   r.createdAt,
      }))
    );
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}