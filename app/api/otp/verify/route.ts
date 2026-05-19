// app/api/otp/verify/route.ts
// Verifies the OTP stored in the httpOnly cookie.
// Updated to match new send route that also stores email in the JWT.

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const OTP_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "otp-secret-change-me"
);

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone number and verification code are required." },
        { status: 400 }
      );
    }

    const token = request.cookies.get("otp_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    let payload: any;
    try {
      const result = await jwtVerify(token, OTP_SECRET);
      payload = result.payload;
    } catch {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Normalise both phones for comparison
    const normalise = (p: string) => p.replace(/\D/g, "").slice(-10);
    if (normalise(payload.phone) !== normalise(String(phone))) {
      return NextResponse.json(
        { error: "Phone number does not match. Please start over." },
        { status: 400 }
      );
    }

    if (payload.otp !== String(otp).trim()) {
      return NextResponse.json(
        { error: "Incorrect code. Please check your email and try again." },
        { status: 400 }
      );
    }

    // OTP correct — issue verified_phone cookie (30 min)
    const verifiedToken = await new SignJWT({
      phone: payload.phone,
      email: payload.email, // carry email forward for order creation
      verified: true,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30m")
      .setIssuedAt()
      .sign(OTP_SECRET);

    const response = NextResponse.json({
      success: true,
      message: "Phone number verified successfully.",
    });

    // Clear one-time OTP cookie
    response.cookies.set("otp_token", "", { maxAge: 0, path: "/" });

    // Set verified phone cookie (used by order creation endpoint)
    response.cookies.set("verified_phone", verifiedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}