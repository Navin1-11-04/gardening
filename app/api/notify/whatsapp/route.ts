// app/api/notify/whatsapp/route.ts
// Sends order confirmation via Meta WhatsApp Cloud API.
// Free tier: 1,000 business-initiated conversations/month.
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/messages

const WA_API_URL = `https://graph.facebook.com/v19.0/${process.env.META_WA_PHONE_NUMBER_ID}/messages`;
const WA_TOKEN   = process.env.META_WA_ACCESS_TOKEN;

async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  if (!WA_TOKEN || !process.env.META_WA_PHONE_NUMBER_ID) {
    console.warn("WhatsApp: META_WA_ACCESS_TOKEN or META_WA_PHONE_NUMBER_ID not set — skipping.");
    return false;
  }

  // Normalise to E.164 without +
  const phone = to.replace(/\D/g, "");
  const e164  = phone.startsWith("91") ? phone : `91${phone.slice(-10)}`;

  try {
    const res = await fetch(WA_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WA_TOKEN}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: e164,
        type: "text",
        text: { body },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("WhatsApp send error:", err);
      return false;
    }
    return true;
  } catch (err) {
    console.error("WhatsApp fetch error:", err);
    return false;
  }
}

// ─── Message templates ────────────────────────────────────────────────────────

function customerMessage(data: {
  orderNumber: string;
  customerName: string;
  total: number;
  items: { name: string; quantity: number }[];
}): string {
  const firstName = data.customerName.split(" ")[0];
  const itemLines = data.items.map((i) => `  • ${i.name} × ${i.quantity}`).join("\n");

  return `🌱 *Kavin Organics* — Order Confirmed!

Hi ${firstName}! 👋

Your order *#${data.orderNumber}* has been placed successfully.

*Items ordered:*
${itemLines}

*Total:* ₹${data.total.toLocaleString("en-IN")}

We'll pack and dispatch within 1–2 business days. You'll get another message when it ships! 🚚

Questions? Call us: *+91 98765 43210*

Thank you — Happy Gardening! 🌿`;
}

function adminMessage(data: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  items: { name: string; quantity: number }[];
  address: { city: string; state: string; pincode: string };
}): string {
  const itemLines = data.items.map((i) => `  • ${i.name} × ${i.quantity}`).join("\n");

  return `🔔 *New Order!*

*Order:* #${data.orderNumber}
*Customer:* ${data.customerName}
*Phone:* ${data.customerPhone}
*Total:* ₹${data.total.toLocaleString("en-IN")}

*Items:*
${itemLines}

*Ship to:* ${data.address.city}, ${data.address.state} — ${data.address.pincode}

Please process this order 📦`;
}

// ─── Route ────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { customerPhone, ...rest } = data;

    const promises: Promise<boolean>[] = [];

    // Send to customer
    if (customerPhone) {
      promises.push(sendWhatsAppMessage(customerPhone, customerMessage({ ...rest, customerPhone })));
    }

    // Send to admin
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
    if (adminPhone) {
      promises.push(sendWhatsAppMessage(adminPhone, adminMessage({ ...rest, customerPhone })));
    }

    await Promise.allSettled(promises);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("WhatsApp notify error:", error);
    return NextResponse.json({ success: false, error: error?.message });
  }
}