import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { requireAdminAuth } from "@/lib/adminAuthServer";

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      coupons.map((c: any) => ({
        id:          c._id.toString(),
        code:        c.code,
        discount:    c.discount,
        active:      c.active,
        minOrder:    c.minOrder ?? 0,
        maxUses:     c.maxUses ?? 0,
        usedCount:   c.usedCount ?? 0,
        expiresAt:   c.expiresAt ?? null,
        description: c.description ?? "",
        createdAt:   c.createdAt,
      }))
    );
  } catch (error) {
    console.error("Fetch coupons error:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const data = await request.json();

    if (!data.code?.trim()) {
      return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
    }
    if (!data.discount || Number(data.discount) < 1 || Number(data.discount) > 100) {
      return NextResponse.json({ error: "Discount must be between 1% and 100%." }, { status: 400 });
    }

    const existing = await Coupon.findOne({ code: data.code.trim().toUpperCase() });
    if (existing) {
      return NextResponse.json({ error: `Coupon code "${data.code.toUpperCase()}" already exists.` }, { status: 409 });
    }

    const coupon = await Coupon.create({
      code:        data.code.trim().toUpperCase(),
      discount:    Number(data.discount),
      active:      data.active ?? true,
      minOrder:    Number(data.minOrder ?? 0),
      maxUses:     Number(data.maxUses ?? 0),
      expiresAt:   data.expiresAt ? new Date(data.expiresAt) : undefined,
      description: data.description?.trim() || undefined,
    });

    return NextResponse.json({ id: coupon._id.toString(), code: coupon.code }, { status: 201 });
  } catch (error) {
    console.error("Create coupon error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}