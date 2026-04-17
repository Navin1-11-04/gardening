import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const FROM_WHATSAPP = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`; // e.g. whatsapp:+14155238886
const ADMIN_PHONE   = process.env.ADMIN_WHATSAPP_NUMBER;               // e.g. +919876543210

// ─── Message templates ────────────────────────────────────────────────────────

function customerMessage(data: {
  orderNumber: string; customerName: string; total: number;
  items: { name: string; quantity: number }[];
}): string {
  const itemLines = data.items
    .map((i) => `  • ${i.name} × ${i.quantity}`)
    .join("\n");

  return `🌱 *Kavin Organics* — Order Confirmed!

Hi ${data.customerName}! 👋

Your order *#${data.orderNumber}* has been placed successfully.

*Items ordered:*
${itemLines}

*Total paid:* ₹${data.total.toLocaleString("en-IN")}

We'll pack your order carefully and dispatch it within 1–2 business days. You'll receive another message when it ships! 🚚

Thank you for choosing Kavin Organics. Happy gardening! 🌿

For any queries, call us: *+91 98765 43210*`;
}

function adminMessage(data: {
  orderNumber: string; customerName: string; customerPhone: string;
  total: number; items: { name: string; quantity: number }[];
  address: { city: string; state: string; pincode: string };
}): string {
  const itemLines = data.items
    .map((i) => `  • ${i.name} × ${i.quantity}`)
    .join("\n");

  return `🔔 *New Order Received!*

*Order:* #${data.orderNumber}
*Customer:* ${data.customerName}
*Phone:* ${data.customerPhone}
*Total:* ₹${data.total.toLocaleString("en-IN")}

*Items:*
${itemLines}

*Ship to:* ${data.address.city}, ${data.address.state} — ${data.address.pincode}

Please process this order. 📦`;
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { customerPhone, ...rest } = data;

    const promises: Promise<any>[] = [];

    // Send to customer (if they provided a phone)
    if (customerPhone) {
      const toPhone = customerPhone.replace(/\D/g, ""); // strip non-digits
      const e164    = toPhone.startsWith("91") ? `+${toPhone}` : `+91${toPhone}`;
      promises.push(
        client.messages.create({
          from: FROM_WHATSAPP,
          to:   `whatsapp:${e164}`,
          body: customerMessage({ ...rest, customerPhone }),
        })
      );
    }

    // Always send to admin
    if (ADMIN_PHONE) {
      promises.push(
        client.messages.create({
          from: FROM_WHATSAPP,
          to:   `whatsapp:${ADMIN_PHONE}`,
          body: adminMessage({ ...rest, customerPhone }),
        })
      );
    }

    await Promise.allSettled(promises); // don't fail if one send errors
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("WhatsApp notify error:", error);
    // Non-fatal — return 200 so caller isn't disrupted
    return NextResponse.json({ success: false, error: error?.message });
  }
}