import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { requireAdminAuth } from "@/lib/adminAuthServer";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const { action } = await request.json(); // "approve" | "unapprove" | "verify" | "unverify"

    await connectDB();

    const update: any = {};
    if (action === "approve")   update.approved = true;
    if (action === "unapprove") update.approved = false;
    if (action === "verify")    update.verified = true;
    if (action === "unverify")  update.verified = false;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(id, update, { new: true });
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    return NextResponse.json({ message: "Updated", approved: review.approved, verified: review.verified });
  } catch (error) {
    console.error("Review patch error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
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
    const review = await Review.findByIdAndDelete(id);
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("Review delete error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}