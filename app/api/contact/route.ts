import { NextRequest, NextResponse } from "next/server";
import mongoose, { Schema, Model, Document } from "mongoose";

// ─── Inline model (small enough to not need a separate file) ──────────────────

interface IInquiry extends Document {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
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
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry ?? mongoose.model<IInquiry>("Inquiry", InquirySchema);

// ─── Route handlers ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, subject, message } = await request.json();

    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, phone and message are required." },
        { status: 400 }
      );
    }

    const { connectDB } = await import("@/lib/mongodb");
    await connectDB();

    await Inquiry.create({
      name:    name.trim(),
      phone:   phone.trim(),
      email:   email?.trim() || undefined,
      subject: subject?.trim() || "General enquiry",
      message: message.trim(),
    });

    return NextResponse.json({ message: "Enquiry submitted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}