import twilio from "twilio";
import nodemailer from "nodemailer";
import type { IOrder } from "@/models/Order";

// ── Twilio SMS ──────────────────────────────────────────────────────────────

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendOrderConfirmationSMS(order: IOrder & { _id: any }) {
  const phone = order.address?.phone;
  if (!phone) return;

  // Normalize to E.164 for Indian numbers
  const e164 = phone.replace(/\D/g, "").replace(/^0/, "").replace(/^/, "+91");

  const message =
    `Hi ${order.address.name.split(" ")[0]}! Your Kavin Organics order ` +
    `${order.orderNumber} is confirmed. ₹${order.total} via ${order.paymentMethod}. ` +
    `Delivery in 2–4 days. Questions? Call +91 98765 43210`;

  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to:   e164,
  });
}

// ── Nodemailer Email ────────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST ?? "smtp.gmail.com",
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export async function sendOrderConfirmationEmail(order: IOrder & { _id: any }) {
  // Many Indian customers only provide phone; skip if no email
  const email = (order as any).customerEmail;
  if (!email) return;

  const itemRows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e0d0">${i.name} — ${i.variant}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e0d0;text-align:center">${i.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e8e0d0;text-align:right">₹${(i.price * i.quantity).toLocaleString("en-IN")}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e8e0d0">
    
    <!-- Header -->
    <div style="background:#3d6b35;padding:32px 32px 24px;text-align:center">
      <h1 style="color:#fff;font-size:28px;margin:0;font-weight:900">KAVIN ORGANICS</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:15px">Order Confirmed! 🌿</p>
    </div>

    <!-- Body -->
    <div style="padding:32px">
      <p style="color:#2a2a1e;font-size:17px;margin:0 0 8px">Hi ${order.address.name.split(" ")[0]},</p>
      <p style="color:#5a5a48;font-size:15px;line-height:1.6;margin:0 0 24px">
        Thank you for your order! We've received it and will start packing right away.
      </p>

      <!-- Order ID box -->
      <div style="background:#eef5ea;border:1px solid #b8d4a0;border-radius:12px;padding:16px 20px;margin-bottom:24px">
        <p style="color:#7a7a68;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.08em">Order ID</p>
        <p style="color:#3d6b35;font-size:22px;font-weight:900;margin:0">${order.orderNumber}</p>
        <p style="color:#7a7a68;font-size:13px;margin:6px 0 0">Payment: ${order.paymentMethod}</p>
      </div>

      <!-- Items table -->
      <h3 style="color:#2a2a1e;font-size:15px;margin:0 0 12px;font-weight:700">Your order</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#3a3a2e">
        <thead>
          <tr style="background:#faf7f2">
            <th style="padding:8px 12px;text-align:left;font-weight:700;color:#7a7a68;font-size:12px;text-transform:uppercase">Product</th>
            <th style="padding:8px 12px;text-align:center;font-weight:700;color:#7a7a68;font-size:12px;text-transform:uppercase">Qty</th>
            <th style="padding:8px 12px;text-align:right;font-weight:700;color:#7a7a68;font-size:12px;text-transform:uppercase">Amount</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <!-- Totals -->
      <div style="border-top:2px solid #e8e0d0;padding-top:16px;margin-top:8px">
        <div style="display:flex;justify-content:space-between;font-size:14px;color:#5a5a48;margin-bottom:6px">
          <span>Subtotal</span><span>₹${order.subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:14px;color:#3d6b35;margin-bottom:6px">
          <span>Delivery</span><span>${order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:900;color:#2a2a1e;margin-top:8px;padding-top:8px;border-top:1px solid #e8e0d0">
          <span>Total</span><span style="color:#3d6b35">₹${order.total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <!-- Delivery address -->
      <div style="background:#faf7f2;border-radius:12px;padding:16px 20px;margin-top:24px">
        <p style="color:#7a7a68;font-size:12px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.08em">Delivering to</p>
        <p style="color:#2a2a1e;font-weight:700;font-size:15px;margin:0">${order.address.name}</p>
        <p style="color:#5a5a48;font-size:14px;margin:4px 0 0;line-height:1.5">
          ${order.address.line1}${order.address.line2 ? ", " + order.address.line2 : ""},<br/>
          ${order.address.city}, ${order.address.state} — ${order.address.pincode}<br/>
          📞 ${order.address.phone}
        </p>
      </div>

      <!-- Help -->
      <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid #e8e0d0">
        <p style="color:#5a5a48;font-size:14px;margin:0 0 12px">Questions about your order?</p>
        <a href="tel:+919876543210" style="display:inline-block;background:#3d6b35;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none">
          📞 Call +91 98765 43210
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f0ece4;padding:16px 32px;text-align:center">
      <p style="color:#7a7a68;font-size:12px;margin:0">
        Kavin Organics · No. 45, Market Road, Thiruchengode — 637211, Tamil Nadu
      </p>
    </div>
  </div>
</body>
</html>
  `;

  await transporter.sendMail({
    from:    `"Kavin Organics" <${process.env.SMTP_USER}>`,
    to:      email,
    subject: `Order confirmed: ${order.orderNumber} — Kavin Organics`,
    html,
  });
}