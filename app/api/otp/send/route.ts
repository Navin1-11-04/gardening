// app/api/otp/send/route.ts
// Generates a 6-digit OTP, stores it in a signed httpOnly cookie,
// AND emails it to the customer using Gmail SMTP.
// No Twilio, no Meta — just free Gmail.

import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import nodemailer from "nodemailer";

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

// ── Nodemailer transporter ────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL!,
    pass: process.env.SMTP_PASS!,
  },
});

async function sendOtpEmail(email: string, otp: string, name?: string): Promise<void> {
  const firstName = name?.split(" ")[0] ?? "there";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;padding:32px 16px;">
  <tr><td>
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr>
        <td style="background:#3d6b35;padding:24px 32px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:1px;">🌿 KAVIN ORGANICS</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Order Verification Code</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:17px;color:#2a2a1e;font-weight:700;">Hi ${firstName}! 👋</p>
          <p style="margin:0 0 24px;color:#5a5a48;font-size:15px;line-height:1.6;">
            Use the code below to verify your phone number and complete your order.
            This code expires in <strong>10 minutes</strong>.
          </p>

          <!-- OTP Box -->
          <div style="background:#eef5ea;border:2px dashed #b8d4a0;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
            <p style="margin:0 0 6px;font-size:12px;color:#7a9e6a;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Your verification code</p>
            <p style="margin:0;font-size:48px;font-weight:900;color:#3d6b35;letter-spacing:10px;font-family:monospace;">${otp}</p>
          </div>

          <p style="margin:0 0 8px;color:#7a7a68;font-size:14px;line-height:1.6;">
            Enter this code on the checkout page to continue with your order.
          </p>
          <p style="margin:0;color:#c0392b;font-size:13px;font-weight:600;">
            ⚠️ Do not share this code with anyone.
          </p>
        </td>
      </tr>

      <!-- Help -->
      <tr>
        <td style="padding:0 32px 24px;">
          <div style="background:#faf7f2;border:1px solid #e8e0d0;border-radius:12px;padding:14px 18px;">
            <p style="margin:0;font-size:13px;color:#5a5a48;">
              Didn't request this? Ignore this email. No action needed.<br/>
              Need help? Call us: <a href="tel:+919876543210" style="color:#3d6b35;font-weight:700;text-decoration:none;">+91 98765 43210</a>
            </p>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:16px 32px;background:#f5f0ea;text-align:center;">
          <p style="margin:0;color:#7a7a68;font-size:12px;">Kavin Organics · Thiruchengode, Tamil Nadu 🌱</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Kavin Organics" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `${otp} is your Kavin Organics verification code`,
    html,
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { phone, email, name } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required to receive your verification code." },
        { status: 400 }
      );
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

    // Sign JWT containing phone + otp + email, expires in 10 minutes
    const token = await new SignJWT({ phone: e164, otp, email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("10m")
      .setIssuedAt()
      .sign(OTP_SECRET);

    // Send OTP via email
    try {
      await sendOtpEmail(email, otp, name);
    } catch (emailErr) {
      console.error("OTP email send error:", emailErr);
      // Don't fail the whole request — still set cookie
      // but warn the user
      const response = NextResponse.json({
        success: false,
        error: "Could not send verification email. Please check your email address and try again.",
      }, { status: 500 });
      return response;
    }

    // Store OTP in httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}`,
      // In dev mode, expose OTP so you can test without checking email
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