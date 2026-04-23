// app/api/notify/whatsapp/status/route.ts
// Sends a WhatsApp message to the customer when order status changes to shipped or delivered.

import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const FROM_WHATSAPP = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;

function shippedMessage(data: {
  orderNumber: string;
  customerName: string;
  total: number;
}): string {
  return `📦 *Kavin Organics* — Your order is on its way!

Hi ${data.customerName}! 🌿

Great news! Your order *#${data.orderNumber}* has been packed and handed to our delivery partner.

*Total:* ₹${data.total.toLocaleString("en-IN")}

You will receive a call from our delivery partner before they arrive. Most orders arrive within 1–2 business days.

Questions? Call us: *+91 98765 43210*

Thank you for choosing Kavin Organics! 🌱`;
}

function deliveredMessage(data: {
  orderNumber: string;
  customerName: string;
}): string {
  return `✅ *Kavin Organics* — Order Delivered!

Hi ${data.customerName}! 🎉

Your order *#${data.orderNumber}* has been delivered successfully!

We hope you love your garden supplies. Happy gardening! 🌿

If you have any questions or need help with your plants, call us anytime:
📞 *+91 98765 43210*

We'd love to see your garden grow — thank you for shopping with us! 🌱`;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { customerPhone, status, orderNumber, customerName, total } = data;

    if (!customerPhone) {
      return NextResponse.json({ success: false, reason: "No phone number" });
    }

    const toPhone = String(customerPhone).replace(/\D/g, "");
    const e164    = toPhone.startsWith("91") ? `+${toPhone}` : `+91${toPhone}`;

    let body = "";
    if (status === "shipped") {
      body = shippedMessage({ orderNumber, customerName, total });
    } else if (status === "delivered") {
      body = deliveredMessage({ orderNumber, customerName });
    } else {
      return NextResponse.json({ success: false, reason: "Status not notifiable" });
    }

    await client.messages.create({
      from: FROM_WHATSAPP,
      to:   `whatsapp:${e164}`,
      body,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("WhatsApp status notify error:", error);
    return NextResponse.json({ success: false, error: error?.message });
  }
}