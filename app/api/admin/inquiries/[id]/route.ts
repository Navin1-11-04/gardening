// app/api/admin/inquiries/[id]/route.ts
// PATCH: update inquiry status (new → read → replied)
// DELETE: remove an inquiry

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose, { Schema, Model, Document } from "mongoose";
import { requireAdminAuth } from "@/lib/adminAuthServer";

interface IInquiry extends Document {
  name: string; phone: string; email?: string;
  subject: string; message: string;
  status: "new" | "read" | "replied"; ip?: string;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: String, phone: String, email: String,
    subject: String, message: String,
    status: { type: String, enum: ["new", "read", "replied"], default: "new" },
    ip: String,
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry ?? mongoose.model<IInquiry>("Inquiry", InquirySchema);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const { status } = await request.json();

    const valid = ["new", "read", "replied"];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();
    const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Updated", status });
  } catch (error) {
    console.error("Inquiry patch error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
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
    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("Inquiry delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}