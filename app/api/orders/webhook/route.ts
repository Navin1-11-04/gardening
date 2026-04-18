import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { sendOrderConfirmationSMS, sendOrderConfirmationEmail } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body      = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const secret    = process.env.RAZORPAY_WEBHOOK_SECRET!;

  // ── Verify Razorpay signature ─────────────────────────────────────────────
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    console.error("Webhook signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  // ── Handle payment.captured ───────────────────────────────────────────────
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const receipt = payment.order_receipt; // this is our orderNumber

    await connectDB();
    const order = await Order.findOneAndUpdate(
      { orderNumber: receipt },
      {
        status:          "confirmed",
        razorpayPaymentId: payment.id,
        razorpayOrderId:   payment.order_id,
      },
      { new: true }
    );

    if (order) {
      // Fire notifications (non-blocking — don't await to keep webhook fast)
      sendOrderConfirmationSMS(order).catch(console.error);
      sendOrderConfirmationEmail(order).catch(console.error);
    }
  }

  // ── Handle payment.failed ─────────────────────────────────────────────────
  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity;
    const receipt = payment.order_receipt;

    await connectDB();
    await Order.findOneAndUpdate(
      { orderNumber: receipt },
      { status: "cancelled" }
    );
  }

  return NextResponse.json({ received: true });
}