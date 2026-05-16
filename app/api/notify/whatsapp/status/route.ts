// app/api/notify/whatsapp/status/route.ts
// Sends shipped/delivered status updates via Meta WhatsApp Cloud API.

import { NextRequest, NextResponse } from "next/server";

const WA_API_URL = `https://graph.facebook.com/v19.0/${process.env.META_WA_PHONE_NUMBER_ID}/messages`;
const WA_TOKEN   = process.env.META_WA_ACCESS_TOKEN;

async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  if (!WA_TOKEN || !process.env.META_WA_PHONE_NUMBER_ID) {
    console.warn("WhatsApp: env vars not set — skipping status notification.");
    return false;
  }

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
      console.error("WhatsApp status send error:", err);
      return false;
    }
    return true;
  } catch (err) {
    console.error("WhatsApp status fetch error:", err);
    return false;
  }
}

function shippedMessage(data: {
  orderNumber: string;
  customerName: string;
  total: number;
}): string {
  const firstName = data.customerName.split(" ")[0];
  return `📦 *Kavin Organics* — Your order is on its way!

Hi ${firstName}! 🌿

Your order *#${data.orderNumber}* has been packed and handed to our delivery partner.

*Total:* ₹${data.total.toLocaleString("en-IN")}

Our delivery partner will call you before arriving. Most orders arrive within 1–2 days.

Questions? Call: *+91 98765 43210*

Thank you for shopping with Kavin Organics! 🌱`;
}

function deliveredMessage(data: {
  orderNumber: string;
  customerName: string;
}): string {
  const firstName = data.customerName.split(" ")[0];
  return `✅ *Kavin Organics* — Order Delivered!

Hi ${firstName}! 🎉

Your order *#${data.orderNumber}* has been delivered successfully!

We hope you love your garden supplies. Happy gardening! 🌿

Any questions or help with your plants, call us anytime:
📞 *+91 98765 43210*

Thank you for choosing Kavin Organics! 🌱`;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { customerPhone, status, orderNumber, customerName, total } = data;

    if (!customerPhone) {
      return NextResponse.json({ success: false, reason: "No phone number" });
    }

    let body = "";
    if (status === "shipped") {
      body = shippedMessage({ orderNumber, customerName, total });
    } else if (status === "delivered") {
      body = deliveredMessage({ orderNumber, customerName });
    } else {
      return NextResponse.json({ success: false, reason: "Status not notifiable" });
    }

    const ok = await sendWhatsAppMessage(customerPhone, body);
    return NextResponse.json({ success: ok });
  } catch (error: any) {
    console.error("WhatsApp status notify error:", error);
    return NextResponse.json({ success: false, error: error?.message });
  }
}