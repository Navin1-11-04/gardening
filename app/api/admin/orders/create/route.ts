// app/api/orders/create/route.ts  (updated)
// After COD confirmation: decrements product stock and fires low-stock check.

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { generateOrderId } from "@/lib/orderStorage";
import {
  validateCheckoutAddress,
  validateOrderItems,
  sanitize,
} from "@/lib/validation";

const ipHits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS  = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Decrement stock for all items in an order (best-effort, non-blocking)
async function decrementStock(items: { id?: string | number; name: string; quantity: number }[]) {
  try {
    const { Product } = await import("@/models/Product");
    for (const item of items) {
      if (!item.id) continue;
      // Try both numeric and string id
      await Product.findOneAndUpdate(
        { $or: [{ _id: String(item.id) }, { id: Number(item.id) }] },
        { $inc: { stock: -item.quantity } }
      ).catch(() => {}); // ignore individual failures
    }
  } catch {}
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const body = await request.json();
    const { items, address, paymentMethod, subtotal, deliveryFee, couponDiscount } = body;

    const itemsV = validateOrderItems(items);
    if (!itemsV.ok) return NextResponse.json(itemsV.toResponse(), { status: 400 });

    const addrV = validateCheckoutAddress({
      name:    address?.fullName ?? address?.name,
      phone:   address?.phone,
      line1:   address?.addressLine1 ?? address?.line1,
      city:    address?.city,
      state:   address?.state,
      pincode: address?.pincode,
    });
    if (!addrV.ok) return NextResponse.json(addrV.toResponse(), { status: 400 });

    const numSubtotal = Number(subtotal);
    const numDelivery = Number(deliveryFee ?? 0);
    const numCoupon   = Number(couponDiscount ?? 0);

    if (!isFinite(numSubtotal) || numSubtotal < 0 || numSubtotal > 10_00_000) {
      return NextResponse.json({ error: "Invalid order amount." }, { status: 400 });
    }

    const VALID_PAYMENT_METHODS = ["cod", "upi", "card", "netbanking"];
    if (!VALID_PAYMENT_METHODS.includes(String(paymentMethod))) {
      return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
    }

    const total       = numSubtotal - numCoupon + numDelivery;
    const orderNumber = generateOrderId();

    await connectDB();
    const dbOrder = await Order.create({
      orderNumber,
      customerName:  sanitize(address?.fullName ?? address?.name),
      customerPhone: String(address?.phone ?? "").replace(/[\s\-+]/g, ""),
      total,
      subtotal:       numSubtotal,
      deliveryFee:    numDelivery,
      couponDiscount: numCoupon,
      status:        "pending",
      paymentMethod,
      items: items.map((i: Record<string, unknown>) => ({
        productId: String(i.id ?? ""),
        name:      sanitize(i.name),
        variant:   sanitize(i.variant),
        price:     Number(i.price),
        quantity:  Number(i.quantity),
        image:     typeof i.image === "string" ? i.image.slice(0, 500) : "",
      })),
      address: {
        name:    sanitize(address?.fullName ?? address?.name),
        phone:   String(address?.phone ?? ""),
        line1:   sanitize(address?.addressLine1 ?? address?.line1),
        line2:   sanitize(address?.addressLine2 ?? address?.line2 ?? ""),
        city:    sanitize(address?.city),
        state:   sanitize(address?.state),
        pincode: String(address?.pincode ?? "").trim(),
      },
    });

    if (paymentMethod === "cod") {
      await Order.findByIdAndUpdate(dbOrder._id, { status: "confirmed" });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

      // Fire-and-forget: WhatsApp notification
      fetch(`${baseUrl}/api/notify/whatsapp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          customerName:  sanitize(address?.fullName ?? address?.name),
          customerPhone: String(address?.phone ?? ""),
          total,
          items: items.map((i: Record<string, unknown>) => ({
            name: sanitize(i.name), quantity: Number(i.quantity),
          })),
          address: {
            city:    sanitize(address?.city),
            state:   sanitize(address?.state),
            pincode: String(address?.pincode ?? ""),
          },
        }),
      }).catch(console.error);

      // Fire-and-forget: decrement stock
      decrementStock(items.map((i: any) => ({ id: i.id, name: i.name, quantity: Number(i.quantity) })));

      // Fire-and-forget: low stock check (non-blocking, internal)
      fetch(`${baseUrl}/api/admin/stock-alerts`, {
        method:  "POST",
        headers: { "x-internal-key": process.env.ADMIN_SEED_KEY ?? "" },
      }).catch(console.error);

      return NextResponse.json({
        orderId:         orderNumber,
        dbOrderId:       dbOrder._id.toString(),
        paymentRequired: false,
      });
    }

    // Online payment — create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount:   Math.round(total * 100),
      currency: "INR",
      receipt:  orderNumber,
      notes: {
        db_order_id: dbOrder._id.toString(),
        customer:    sanitize(address?.fullName ?? address?.name),
        phone:       String(address?.phone ?? ""),
      },
    });

    return NextResponse.json({
      orderId:         orderNumber,
      dbOrderId:       dbOrder._id.toString(),
      razorpayOrderId: rzpOrder.id,
      amount:          rzpOrder.amount,
      currency:        rzpOrder.currency,
      keyId:           process.env.RAZORPAY_KEY_ID,
      paymentRequired: true,
      prefill: {
        name:    sanitize(address?.fullName ?? address?.name),
        contact: String(address?.phone ?? ""),
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}