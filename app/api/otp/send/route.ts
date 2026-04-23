import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { SignJWT } from "jose";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const OTP_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "otp-secret-change-me"
);

// In-memory rate limiter: phone → { count, resetAt }
const phoneAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(phone: string): boolean {
  const now = Date.now();
  const entry = phoneAttempts.get(phone);
  if (!entry || entry.resetAt < now) {
    phoneAttempts.set(phone, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 3) return false;
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
        { error: "Too many OTP requests. Please wait 10 minutes before trying again." },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Sign a JWT containing phone + otp, expires in 10 minutes
    const token = await new SignJWT({ phone: e164, otp })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("10m")
      .setIssuedAt()
      .sign(OTP_SECRET);

    // Send SMS via Twilio
    await client.messages.create({
      body: `Your Kavin Organics verification code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to:   e164,
    });

    // Store token in a httpOnly cookie (server-side only, not readable by JS)
    const response = NextResponse.json({ success: true, message: "OTP sent successfully." });
    response.cookies.set("otp_token", token, {
      httpOnly:  true,
      secure:    process.env.NODE_ENV === "production",
      sameSite:  "lax",
      maxAge:    10 * 60, // 10 minutes
      path:      "/",
    });

    return response;
  } catch (error: any) {
    console.error("OTP send error:", error);

    // Provide helpful error message for common Twilio issues
    if (error?.code === 21608) {
      return NextResponse.json(
        { error: "This number is not verified in our SMS system. Please call us directly." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send OTP. Please try again or call us at +91 98765 43210." },
      { status: 500 }
    );
  }
}