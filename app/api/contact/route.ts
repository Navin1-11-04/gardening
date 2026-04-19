// app/api/contact/route.ts — updated with validation and rate limiting

import { NextRequest, NextResponse } from "next/server";
import mongoose, { Schema, Model, Document } from "mongoose";
import { validateContactForm, sanitize } from "@/lib/validation";

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
    name:    { type: String, required: true, maxlength: 200 },
    phone:   { type: String, required: true, maxlength: 20 },
    email:   { type: String, maxlength: 200 },
    subject: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 2000 },
    status:  { type: String, enum: ["new", "read", "replied"], default: "new" },
    ip:      { type: String },
  },
  { timestamps: true }
);

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry ?? mongoose.model<IInquiry>("Inquiry", InquirySchema);

// Simple rate limiter
const contactHits = new Map<string, { count: number; resetAt: number }>();

function contactRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = contactHits.get(ip);
  if (!entry || entry.resetAt < now) {
    contactHits.set(ip, { count: 1, resetAt: now + 3_600_000 }); // 1 hour window
    return true;
  }
  if (entry.count >= 5) return false; // max 5 contact forms per hour per IP
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!contactRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later or call us directly." },
      { status: 429 }
    );
  }

  try {
    const raw = await request.json();

    const v = validateContactForm({
      name:    raw.name,
      phone:   raw.phone,
      email:   raw.email,
      message: raw.message,
    });

    if (!v.ok) {
      return NextResponse.json(v.toResponse(), { status: 400 });
    }

    const { connectDB } = await import("@/lib/mongodb");
    await connectDB();

    await Inquiry.create({
      name:    sanitize(raw.name),
      phone:   String(raw.phone ?? "").replace(/[\s\-+]/g, ""),
      email:   raw.email ? sanitize(raw.email).toLowerCase() : undefined,
      subject: sanitize(raw.subject ?? "General enquiry").slice(0, 200) || "General enquiry",
      message: sanitize(raw.message),
      ip,
    });

    return NextResponse.json({ message: "Enquiry submitted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit. Please try again or call us." },
      { status: 500 }
    );
  }
}