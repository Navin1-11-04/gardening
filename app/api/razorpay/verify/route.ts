import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,           // full order details from the frontend
    } = await request.json();

    // ── 1. Verify Razorpay signature ─────────────────────────────────────────
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected  = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // ── 2. Save confirmed order to MongoDB ───────────────────────────────────
    const { connectDB } = await import("@/lib/mongodb");
    const { Order }     = await import("@/models/Order");
    await connectDB();

    // Idempotency check
    let order = await Order.findOne({ orderNumber: orderData.orderNumber });
    if (!order) {
      order = await Order.create({
        ...orderData,
        status:           "confirmed",
        paymentMethod:    "Razorpay",
        razorpayOrderId:  razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });
    } else {
      order.status            = "confirmed";
      order.razorpayOrderId   = razorpay_order_id;
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();
    }

    // ── 3. Fire notifications (non-blocking) ─────────────────────────────────
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const notifyPayload = {
      orderNumber:   orderData.orderNumber,
      customerName:  orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      total:         orderData.total,
      items:         orderData.items,
      address:       orderData.address,
    };

    // Fire-and-forget — don't await so checkout isn't delayed
    fetch(`${baseUrl}/api/notify/whatsapp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notifyPayload),
    }).catch(console.error);

    fetch(`${baseUrl}/api/notify/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notifyPayload),
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      orderNumber: orderData.orderNumber,
    });
  } catch (error: any) {
    console.error("Razorpay verify error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Verification failed" },
      { status: 500 }
    );
  }
}