import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST ?? "smtp.gmail.com",
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL!,
    pass: process.env.SMTP_PASS!,
  },
});

function buildStatusHtml(data: {
  orderNumber:  string;
  customerName: string;
  status:       "shipped" | "delivered";
  total:        number;
  items:        { name: string; quantity: number }[];
}) {
  const isShipped = data.status === "shipped";
  const firstName = data.customerName.split(" ")[0];
  const headerColor = isShipped ? "#1a6b8a" : "#3d6b35";
  const headerText  = isShipped ? "Your order is on its way!" : "Your order has been delivered!";
  const bodyText    = isShipped
    ? `Your order <strong>#${data.orderNumber}</strong> has been packed and is now with our delivery partner. You will receive a call before delivery.`
    : `Your order <strong>#${data.orderNumber}</strong> has been delivered successfully. We hope you love your plants!`;

  const itemLines = data.items
    .map((i) => `<li style="padding:4px 0;color:#3a3a2e;font-size:14px;">${i.name} x ${i.quantity}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;padding:32px 16px;">
  <tr><td>
    <table width="100%" cellpadding="0" cellspacing="0"
      style="max-width:540px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <tr>
        <td style="background:${headerColor};padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:900;">Kavin Organics</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:16px;">${headerText}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px 0;">
          <p style="margin:0;font-size:17px;font-weight:700;color:#2a2a1e;">Hi ${firstName}!</p>
          <p style="margin:12px 0 0;color:#5a5a48;font-size:15px;line-height:1.6;">${bodyText}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px 0;">
          <div style="background:#eef5ea;border:2px dashed #b8d4a0;border-radius:14px;padding:16px 20px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#5a7a50;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Order Number</p>
            <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#3d6b35;letter-spacing:2px;">#${data.orderNumber}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px 0;">
          <p style="margin:0 0 10px;font-weight:700;color:#1e3d18;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Items</p>
          <ul style="margin:0;padding:0 0 0 16px;">${itemLines}</ul>
          <p style="margin:12px 0 0;font-size:15px;color:#3d6b35;font-weight:700;">
            Total: Rs.${Number(data.total).toLocaleString("en-IN")}
          </p>
        </td>
      </tr>
      ${isShipped ? `
      <tr>
        <td style="padding:20px 32px 0;">
          <div style="background:#fff8ee;border:1px solid #f0d080;border-radius:12px;padding:14px 18px;">
            <p style="margin:0;color:#7a5c1e;font-size:14px;">
              Our delivery partner will call you before arriving. Please keep your phone handy!
            </p>
          </div>
        </td>
      </tr>` : `
      <tr>
        <td style="padding:20px 32px 0;">
          <div style="background:#eef5ea;border:1px solid #b8d4a0;border-radius:12px;padding:14px 18px;">
            <p style="margin:0;color:#1e3d18;font-size:14px;">
              Happy gardening! If you need any help with your plants, call us anytime.
            </p>
          </div>
        </td>
      </tr>`}
      <tr>
        <td style="padding:20px 32px 0;">
          <p style="margin:0;color:#5a5a48;font-size:14px;">
            Questions? Call: +91 98765 43210
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px;text-align:center;background:#f5f0ea;border-radius:0 0 20px 20px;">
          <p style="margin:0;color:#7a7a68;font-size:13px;">Thank you for choosing Kavin Organics</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { customerEmail, customerName, orderNumber, status, total, items } = data;

    if (!customerEmail) {
      return NextResponse.json({ success: true, skipped: true });
    }

    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASS) {
      console.warn("SMTP not configured - skipping status email");
      return NextResponse.json({ success: true, skipped: true });
    }

    if (status !== "shipped" && status !== "delivered") {
      return NextResponse.json({ success: true, skipped: true });
    }

    const html = buildStatusHtml({
      orderNumber,
      customerName,
      status,
      total,
      items: items ?? [],
    });

    const subject = status === "shipped"
      ? `Your order #${orderNumber} is on the way - Kavin Organics`
      : `Order #${orderNumber} delivered - Kavin Organics`;

    await transporter.sendMail({
      from:    `"Kavin Organics" <${process.env.SMTP_EMAIL}>`,
      to:      customerEmail,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Status email error:", error);
    return NextResponse.json({ success: false, error: error?.message });
  }
}