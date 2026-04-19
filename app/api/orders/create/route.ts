// app/api/orders/create/route.ts
// Updated with input validation, sanitisation, and rate limiting.

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

// ── Simple in-memory rate limiter (replace with Redis in production) ──────────
const ipHits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;        // max 10 orders per window
const WINDOW_MS  = 60_000;    // 1 minute window

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

export async function POST(request: NextRequest) {
  // ── Rate limiting ─────────────────────────────────────────────────────────
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

    // ── Validate items ────────────────────────────────────────────────────────
    const itemsV = validateOrderItems(items);
    if (!itemsV.ok) {
      return NextResponse.json(itemsV.toResponse(), { status: 400 });
    }

    // ── Validate address ──────────────────────────────────────────────────────
    const addrV = validateCheckoutAddress({
      name:    address?.fullName ?? address?.name,
      phone:   address?.phone,
      line1:   address?.addressLine1 ?? address?.line1,
      city:    address?.city,
      state:   address?.state,
      pincode: address?.pincode,
    });
    if (!addrV.ok) {
      return NextResponse.json(addrV.toResponse(), { status: 400 });
    }

    // ── Validate financials ───────────────────────────────────────────────────
    const numSubtotal = Number(subtotal);
    const numDelivery = Number(deliveryFee ?? 0);
    const numCoupon   = Number(couponDiscount ?? 0);

    if (!isFinite(numSubtotal) || numSubtotal < 0 || numSubtotal > 10_00_000) {
      return NextResponse.json({ error: "Invalid order amount." }, { status: 400 });
    }

    // ── Validate payment method ───────────────────────────────────────────────
    const VALID_PAYMENT_METHODS = ["cod", "upi", "card", "netbanking"];
    if (!VALID_PAYMENT_METHODS.includes(String(paymentMethod))) {
      return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
    }

    const total = numSubtotal - numCoupon + numDelivery;
    const orderNumber = generateOrderId();

    // ── Save to DB ────────────────────────────────────────────────────────────
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

    // COD — confirm immediately
    if (paymentMethod === "cod") {
      await Order.findByIdAndUpdate(dbOrder._id, { status: "confirmed" });

      // Fire-and-forget WhatsApp notification
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
      fetch(`${baseUrl}/api/notify/whatsapp`, {
        method: "POST",
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