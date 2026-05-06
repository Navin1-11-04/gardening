import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter — max 10 coupon checks per IP per minute
const ipHits = new Map<string, { count: number; resetAt: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

// Hardcoded fallback coupons — used if DB is unavailable
const FALLBACK_COUPONS: Record<string, number> = {
  GARDEN10: 10,
  KAVIN20:  20,
  GREEN15:  15,
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
  }

  try {
    const { code, orderTotal } = await request.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Please enter a coupon code." }, { status: 400 });
    }

    const normalized = code.trim().toUpperCase();

    // Try DB first
    try {
      const { connectDB } = await import("@/lib/mongodb");
      const { Coupon }    = await import("@/models/Coupon");
      await connectDB();

      const coupon = await Coupon.findOne({ code: normalized, active: true });

      if (!coupon) {
        return NextResponse.json({ error: "Invalid coupon code. Please check and try again." }, { status: 400 });
      }

      // Check expiry
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
      }

      // Check max uses
      if (coupon.maxUses && coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 400 });
      }

      // Check minimum order
      if (coupon.minOrder && coupon.minOrder > 0 && (orderTotal ?? 0) < coupon.minOrder) {
        return NextResponse.json({
          error: `This coupon requires a minimum order of ₹${coupon.minOrder}.`,
        }, { status: 400 });
      }

      return NextResponse.json({
        valid:       true,
        code:        coupon.code,
        discount:    coupon.discount,
        description: coupon.description ?? `${coupon.discount}% off your order`,
      });
    } catch {
      // DB unavailable — fall back to hardcoded coupons
      const discount = FALLBACK_COUPONS[normalized];
      if (!discount) {
        return NextResponse.json({ error: "Invalid coupon code. Please check and try again." }, { status: 400 });
      }
      return NextResponse.json({
        valid: true, code: normalized, discount,
        description: `${discount}% off your order`,
      });
    }
  } catch {
    return NextResponse.json({ error: "Failed to validate coupon." }, { status: 500 });
  }
}