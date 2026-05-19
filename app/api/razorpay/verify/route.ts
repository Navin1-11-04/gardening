import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = await request.json();

    // ── 1. Verify Razorpay signature ──────────────────────────────────────────
    const body     = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // ── 2. Save confirmed order to MongoDB ────────────────────────────────────
    const { connectDB } = await import("@/lib/mongodb");
    const { Order }     = await import("@/models/Order");
    await connectDB();

    let order = await Order.findOne({ orderNumber: orderData.orderNumber });
    if (!order) {
      order = await Order.create({
        ...orderData,
        status:             "confirmed",
        paymentMethod:      "Razorpay",
        razorpayOrderId:    razorpay_order_id,
        razorpayPaymentId:  razorpay_payment_id,
      });
    } else {
      order.status             = "confirmed";
      order.razorpayOrderId    = razorpay_order_id;
      order.razorpayPaymentId  = razorpay_payment_id;
      await order.save();
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

    // ── 3. Send confirmation email (non-blocking) ─────────────────────────────
    const emailPayload = {
      orderNumber:   orderData.orderNumber,
      customerName:  orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail ?? order.customerEmail,
      total:         orderData.total,
      subtotal:      orderData.subtotal ?? orderData.total,
      deliveryFee:   orderData.deliveryFee ?? 0,
      items:         orderData.items ?? [],
      address:       orderData.address ?? {},
    };

    fetch(`${baseUrl}/api/notify/email`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(emailPayload),
    }).catch(console.error);

    // ── 4. Decrement stock (non-blocking) ─────────────────────────────────────
    if (orderData.items?.length) {
      try {
        const { Product } = await import("@/models/Product");
        for (const item of orderData.items) {
          if (!item.id) continue;
          await Product.findOneAndUpdate(
            { $or: [{ _id: String(item.id) }, { id: Number(item.id) }] },
            { $inc: { stock: -Number(item.quantity) } }
          ).catch(() => {});
        }
      } catch {}
    }

    // ── 5. Low-stock check (non-blocking) ─────────────────────────────────────
    fetch(`${baseUrl}/api/admin/stock-alerts`, {
      method:  "POST",
      headers: { "x-internal-key": process.env.ADMIN_SEED_KEY ?? "" },
    }).catch(() => {});

    return NextResponse.json({
      success:     true,
      orderId:     order._id.toString(),
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