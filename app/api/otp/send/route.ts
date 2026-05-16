// app/api/otp/send/route.ts
// Auto-verifies phone — no SMS sent. India small-store pattern.
// OTP is generated, stored in a signed cookie, and considered "sent".
// The frontend shows the OTP input as normal; the user just clicks verify.
// For actual production with real OTP, swap in Meta WhatsApp or email OTP here.

import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const OTP_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "otp-secret-change-me"
);

// Rate limiter: max 5 attempts per phone per 10 minutes
const phoneAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(phone: string): boolean {
  const now = Date.now();
  const entry = phoneAttempts.get(phone);
  if (!entry || entry.resetAt < now) {
    phoneAttempts.set(phone, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  return `+${digits}`;
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    const e164 = normalisePhone(String(phone));

    // Basic Indian mobile validation
    if (!/^\+91[6-9]\d{9}$/.test(e164)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    if (!checkRateLimit(e164)) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Sign JWT containing phone + otp, expires in 10 minutes
    const token = await new SignJWT({ phone: e164, otp })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("10m")
      .setIssuedAt()
      .sign(OTP_SECRET);

    // Store OTP in httpOnly cookie — no SMS sent
    const response = NextResponse.json({
      success: true,
      message: "Verification code ready.",
      // In dev mode, expose OTP so you can test without SMS
      ...(process.env.NODE_ENV !== "production" && { devOtp: otp }),
    });

    response.cookies.set("otp_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { error: "Failed to generate code. Please try again." },
      { status: 500 }
    );
  }
}