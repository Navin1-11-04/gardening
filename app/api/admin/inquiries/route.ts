// app/api/admin/inquiries/route.ts
// Lists all contact form submissions. Admin can mark as read/replied.

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose, { Schema, Model, Document } from "mongoose";
import { requireAdminAuth } from "@/lib/adminAuthServer";

interface IInquiry extends Document {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  ip?: string;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name:    { type: String, required: true },
    phone:   { type: String, required: true },
    email:   { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status:  { type: String, enum: ["new", "read", "replied"], default: "new" },
    ip:      { type: String },
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry ?? mongoose.model<IInquiry>("Inquiry", InquirySchema);

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const inquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json(
      inquiries.map((i: any) => ({
        id:        i._id.toString(),
        name:      i.name,
        phone:     i.phone,
        email:     i.email ?? "",
        subject:   i.subject,
        message:   i.message,
        status:    i.status,
        createdAt: i.createdAt,
      }))
    );
  } catch (error) {
    console.error("Inquiries fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}