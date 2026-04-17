import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,   // your Gmail address
    pass: process.env.SMTP_PASS,    // Gmail App Password (not your login password)
  },
});

// ─── HTML Email Template ──────────────────────────────────────────────────────

function buildEmailHtml(data: {
  orderNumber: string;
  customerName: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  items: { name: string; quantity: number; price: number; image?: string }[];
  address: {
    name: string; phone: string; line1: string;
    line2?: string; city: string; state: string; pincode: string;
  };
}) {
  const itemRows = data.items.map((item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0ece4;">
        <span style="font-weight:600;color:#2a2a1e;">${item.name}</span>
        <span style="color:#7a7a68;"> × ${item.quantity}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f0ece4;text-align:right;font-weight:700;color:#3d6b35;">
        ₹${(item.price * item.quantity).toLocaleString("en-IN")}
      </td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0ea;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ea;padding:32px 16px;">
  <tr><td>
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr>
        <td style="background:#1e3d18;padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:900;letter-spacing:1px;">🌿 KAVIN ORGANICS</h1>
          <p style="margin:6px 0 0;color:#7ab648;font-size:13px;letter-spacing:2px;font-weight:700;">ORDER CONFIRMED</p>
        </td>
      </tr>

      <!-- Greeting -->
      <tr>
        <td style="padding:28px 32px 0;">
          <p style="margin:0;font-size:18px;font-weight:700;color:#2a2a1e;">Hi ${data.customerName}! 👋</p>
          <p style="margin:8px 0 0;color:#5a5a48;font-size:15px;line-height:1.6;">
            Your order has been confirmed and we're getting it ready for you!
            We'll send another email when it ships. 🚚
          </p>
        </td>
      </tr>

      <!-- Order ID Banner -->
      <tr>
        <td style="padding:20px 32px;">
          <div style="background:#eef5ea;border:2px dashed #b8d4a0;border-radius:14px;padding:16px 20px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#5a7a50;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Order Number</p>
            <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#3d6b35;letter-spacing:2px;">${data.orderNumber}</p>
          </div>
        </td>
      </tr>

      <!-- Items -->
      <tr>
        <td style="padding:0 32px;">
          <p style="margin:0 0 12px;font-weight:700;color:#1e3d18;font-size:15px;text-transform:uppercase;letter-spacing:1px;">Items Ordered</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemRows}
            <tr>
              <td style="padding:10px 0;color:#5a5a48;font-size:14px;">Subtotal</td>
              <td style="padding:10px 0;text-align:right;color:#2a2a1e;font-weight:600;">₹${data.subtotal.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#5a5a48;font-size:14px;">Delivery</td>
              <td style="padding:4px 0;text-align:right;color:${data.deliveryFee === 0 ? "#3d6b35" : "#2a2a1e"};font-weight:600;">
                ${data.deliveryFee === 0 ? "FREE" : `₹${data.deliveryFee}`}
              </td>
            </tr>
            <tr>
              <td style="padding:14px 0 0;border-top:2px solid #e8e0d0;font-size:17px;font-weight:800;color:#2a2a1e;">Total Paid</td>
              <td style="padding:14px 0 0;border-top:2px solid #e8e0d0;text-align:right;font-size:22px;font-weight:900;color:#3d6b35;">₹${data.total.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Delivery Address -->
      <tr>
        <td style="padding:24px 32px 0;">
          <p style="margin:0 0 12px;font-weight:700;color:#1e3d18;font-size:15px;text-transform:uppercase;letter-spacing:1px;">Delivery Address</p>
          <div style="background:#faf7f2;border:1px solid #e8e0d0;border-radius:12px;padding:16px 20px;">
            <p style="margin:0;font-weight:700;color:#2a2a1e;font-size:15px;">${data.address.name}</p>
            <p style="margin:4px 0 0;color:#5a5a48;font-size:14px;line-height:1.6;">
              ${data.address.line1}${data.address.line2 ? `, ${data.address.line2}` : ""}<br/>
              ${data.address.city}, ${data.address.state} — ${data.address.pincode}<br/>
              📞 ${data.address.phone}
            </p>
          </div>
        </td>
      </tr>

      <!-- Delivery estimate -->
      <tr>
        <td style="padding:20px 32px 0;">
          <div style="background:#fff8ee;border:1px solid #f0d080;border-radius:12px;padding:14px 18px;">
            <p style="margin:0;color:#7a5c1e;font-size:14px;">
              🕐 <strong>Estimated Delivery:</strong> 2–4 business days from order date.
            </p>
          </div>
        </td>
      </tr>

      <!-- Help -->
      <tr>
        <td style="padding:20px 32px 0;">
          <p style="margin:0;color:#5a5a48;font-size:14px;line-height:1.6;">
            Questions? We're here to help:<br/>
            📞 <a href="tel:+919876543210" style="color:#3d6b35;font-weight:700;text-decoration:none;">+91 98765 43210</a>
            &nbsp;|&nbsp;
            ✉️ <a href="mailto:hello@kavinorganics.in" style="color:#3d6b35;font-weight:700;text-decoration:none;">hello@kavinorganics.in</a>
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:24px 32px;margin-top:16px;text-align:center;background:#f5f0ea;border-radius:0 0 20px 20px;">
          <p style="margin:0;color:#7a7a68;font-size:13px;">Thank you for choosing Kavin Organics 🌱</p>
          <p style="margin:4px 0 0;color:#a8a090;font-size:12px;">Happy Gardening! 🪴</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { customerEmail, customerName, orderNumber } = data;

    if (!customerEmail) {
      // No email provided — skip silently
      return NextResponse.json({ success: true, skipped: true });
    }

    const html = buildEmailHtml(data);

    await transporter.sendMail({
      from:    `"Kavin Organics" <${process.env.SMTP_EMAIL}>`,
      to:      customerEmail,
      subject: `✅ Order Confirmed — #${orderNumber} | Kavin Organics`,
      html,
    });

    // Also BCC the admin so they have a copy
    if (process.env.SMTP_EMAIL) {
      await transporter.sendMail({
        from:    `"Kavin Organics" <${process.env.SMTP_EMAIL}>`,
        to:      process.env.SMTP_EMAIL,
        subject: `[Admin] New Order #${orderNumber} from ${customerName}`,
        html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email notify error:", error);
    return NextResponse.json({ success: false, error: error?.message });
  }
}