import { NextRequest, NextResponse } from "next/server";

// Rate limit: max 3 reviews per IP per hour
const ipHits = new Map<string, { count: number; resetAt: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + 3_600_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

// GET: fetch approved reviews for a product
export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Review }    = await import("@/models/Review");
    await connectDB();

    const reviews = await Review.find({ productId, approved: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("name rating comment verified createdAt")
      .lean();

    // Aggregate stats
    const all = await Review.find({ productId, approved: true }).select("rating").lean();
    const avgRating = all.length
      ? Math.round((all.reduce((s, r) => s + r.rating, 0) / all.length) * 10) / 10
      : 0;

    // Rating breakdown
    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    all.forEach((r) => { breakdown[r.rating] = (breakdown[r.rating] ?? 0) + 1; });

    return NextResponse.json({
      reviews: reviews.map((r: any) => ({
        id:        r._id.toString(),
        name:      r.name,
        rating:    r.rating,
        comment:   r.comment,
        verified:  r.verified,
        date:      new Date(r.createdAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        }),
      })),
      stats: {
        count:     all.length,
        avgRating,
        breakdown,
      },
    });
  } catch {
    // DB unavailable — return empty
    return NextResponse.json({
      reviews: [],
      stats: { count: 0, avgRating: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
    });
  }
}

// POST: submit a new review (pending approval)
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many reviews submitted. Please wait before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { productId, productName, name, phone, rating, comment } = body;

    // Validation
    if (!productId || !productName) {
      return NextResponse.json({ error: "Product information is missing." }, { status: 400 });
    }
    if (!name?.trim() || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your name (at least 2 characters)." }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Please select a rating between 1 and 5 stars." }, { status: 400 });
    }
    if (!comment?.trim() || comment.trim().length < 10) {
      return NextResponse.json({ error: "Please write a review of at least 10 characters." }, { status: 400 });
    }
    if (comment.trim().length > 1000) {
      return NextResponse.json({ error: "Review must be under 1000 characters." }, { status: 400 });
    }

    const { connectDB } = await import("@/lib/mongodb");
    const { Review }    = await import("@/models/Review");
    await connectDB();

    await Review.create({
      productId:   String(productId),
      productName: productName.trim(),
      name:        name.trim().slice(0, 100),
      phone:       phone?.trim() || undefined,
      rating:      Number(rating),
      comment:     comment.trim(),
      approved:    false, // admin must approve
      ip,
    });

    return NextResponse.json(
      { message: "Thank you for your review! It will appear after a quick check by our team." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review submit error:", error);
    return NextResponse.json({ error: "Failed to submit review. Please try again." }, { status: 500 });
  }
}