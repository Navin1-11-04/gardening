import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const OTP_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "otp-secret-change-me"
);

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required." },
        { status: 400 }
      );
    }

    // Retrieve the OTP token cookie set during /api/otp/send
    const token = request.cookies.get("otp_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "OTP has expired or was not sent. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify and decode the JWT
    let payload: any;
    try {
      const result = await jwtVerify(token, OTP_SECRET);
      payload = result.payload;
    } catch {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new code." },
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
        { error: "Incorrect OTP. Please check and try again." },
        { status: 400 }
      );
    }

    // OTP is correct — issue a verified_phone cookie valid for 30 minutes
    // Checkout reads this before allowing order placement
    const { SignJWT } = await import("jose");
    const verifiedToken = await new SignJWT({ phone: payload.phone, verified: true })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30m")
      .setIssuedAt()
      .sign(OTP_SECRET);

    const response = NextResponse.json({
      success: true,
      message: "Phone number verified successfully.",
    });

    // Clear OTP token (one-time use)
    response.cookies.set("otp_token", "", { maxAge: 0, path: "/" });

    // Set verified phone token
    response.cookies.set("verified_phone", verifiedToken, {
      httpOnly:  true,
      secure:    process.env.NODE_ENV === "production",
      sameSite:  "lax",
      maxAge:    30 * 60, // 30 minutes — enough time to complete checkout
      path:      "/",
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