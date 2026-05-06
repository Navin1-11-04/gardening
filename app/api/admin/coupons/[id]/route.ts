import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { requireAdminAuth } from "@/lib/adminAuthServer";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const data = await request.json();
    await connectDB();

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      {
        discount:    Number(data.discount),
        active:      data.active,
        minOrder:    Number(data.minOrder ?? 0),
        maxUses:     Number(data.maxUses ?? 0),
        expiresAt:   data.expiresAt ? new Date(data.expiresAt) : undefined,
        description: data.description?.trim() || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    return NextResponse.json({ message: "Updated", code: coupon.code });
  } catch (error) {
    console.error("Update coupon error:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    await connectDB();
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete coupon error:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}