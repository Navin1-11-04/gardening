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

function buildEmailHtml(data: {
  orderNumber:   string;
  customerName:  string;
  total:         number;
  subtotal:      number;
  deliveryFee:   number;
  items: { name: string; quantity: number; price: number }[];
  address: {
    name: string; phone: string; line1: string;
    line2?: string; city: string; state: string; pincode: string;
  };
}) {
  const itemRows = data.items.map((item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0ece4;">
        <span style="font-weight:600;color:#2a2a1e;">${item.name}</span>
        <span style="color:#7a7a68;"> x ${item.quantity}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f0ece4;text-align:right;font-weight:700;color:#3d6b35;">
        Rs.${(item.price * item.quantity).toLocaleString("en-IN")}
      </td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0ea;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ea;padding:32px 16px;">
  <tr><td>
    <table width="100%" cellpadding="0" cellspacing="0"
      style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <tr>
        <td style="background:#1e3d18;padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:900;">Kavin Organics</h1>
          <p style="margin:6px 0 0;color:#7ab648;font-size:13px;font-weight:700;letter-spacing:2px;">ORDER CONFIRMED</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px 0;">
          <p style="margin:0;font-size:18px;font-weight:700;color:#2a2a1e;">Hi ${data.customerName.split(" ")[0]}!</p>
          <p style="margin:8px 0 0;color:#5a5a48;font-size:15px;line-height:1.6;">
            Your order has been confirmed. We will email you again when it ships.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px;">
          <div style="background:#eef5ea;border:2px dashed #b8d4a0;border-radius:14px;padding:16px 20px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#5a7a50;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Order Number</p>
            <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#3d6b35;letter-spacing:2px;">${data.orderNumber}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px;">
          <p style="margin:0 0 12px;font-weight:700;color:#1e3d18;font-size:15px;text-transform:uppercase;letter-spacing:1px;">Items Ordered</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemRows}
            <tr>
              <td style="padding:10px 0;color:#5a5a48;font-size:14px;">Subtotal</td>
              <td style="padding:10px 0;text-align:right;color:#2a2a1e;font-weight:600;">Rs.${data.subtotal.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#5a5a48;font-size:14px;">Delivery</td>
              <td style="padding:4px 0;text-align:right;color:${data.deliveryFee === 0 ? "#3d6b35" : "#2a2a1e"};font-weight:600;">
                ${data.deliveryFee === 0 ? "FREE" : `Rs.${data.deliveryFee}`}
              </td>
            </tr>
            <tr>
              <td style="padding:14px 0 0;border-top:2px solid #e8e0d0;font-size:17px;font-weight:800;color:#2a2a1e;">Total Paid</td>
              <td style="padding:14px 0 0;border-top:2px solid #e8e0d0;text-align:right;font-size:22px;font-weight:900;color:#3d6b35;">Rs.${data.total.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px 0;">
          <p style="margin:0 0 12px;font-weight:700;color:#1e3d18;font-size:15px;text-transform:uppercase;letter-spacing:1px;">Delivery Address</p>
          <div style="background:#faf7f2;border:1px solid #e8e0d0;border-radius:12px;padding:16px 20px;">
            <p style="margin:0;font-weight:700;color:#2a2a1e;font-size:15px;">${data.address.name}</p>
            <p style="margin:4px 0 0;color:#5a5a48;font-size:14px;line-height:1.6;">
              ${data.address.line1}${data.address.line2 ? `, ${data.address.line2}` : ""}<br/>
              ${data.address.city}, ${data.address.state} - ${data.address.pincode}<br/>
              Phone: ${data.address.phone}
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px 0;">
          <div style="background:#fff8ee;border:1px solid #f0d080;border-radius:12px;padding:14px 18px;">
            <p style="margin:0;color:#7a5c1e;font-size:14px;">
              Estimated Delivery: 2-4 business days from order date.
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px 0;">
          <p style="margin:0;color:#5a5a48;font-size:14px;line-height:1.6;">
            Questions? Call us: +91 98765 43210 or email hello@kavinorganics.in
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
    const { customerEmail, customerName, orderNumber } = data;

    if (!customerEmail) {
      return NextResponse.json({ success: true, skipped: true });
    }

    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASS) {
      console.warn("SMTP not configured - skipping order confirmation email");
      return NextResponse.json({ success: true, skipped: true });
    }

    const html = buildEmailHtml({
      orderNumber,
      customerName,
      total:       Number(data.total),
      subtotal:    Number(data.subtotal ?? data.total),
      deliveryFee: Number(data.deliveryFee ?? 0),
      items:       data.items ?? [],
      address:     data.address ?? {},
    });

    await transporter.sendMail({
      from:    `"Kavin Organics" <${process.env.SMTP_EMAIL}>`,
      to:      customerEmail,
      subject: `Order Confirmed - #${orderNumber} | Kavin Organics`,
      html,
    });

    // BCC admin
    transporter.sendMail({
      from:    `"Kavin Organics" <${process.env.SMTP_EMAIL}>`,
      to:      process.env.SMTP_EMAIL,
      subject: `[New Order] #${orderNumber} from ${customerName}`,
      html,
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Order confirmation email error:", error);
    return NextResponse.json({ success: false, error: error?.message });
  }
}