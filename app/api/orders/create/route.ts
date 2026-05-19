import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { generateOrderId } from "@/lib/orderStorage";
import { validateCheckoutAddress, validateOrderItems, sanitize } from "@/lib/validation";

const OTP_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "otp-secret-change-me"
);

// ── Rate limiter ──────────────────────────────────────────────────────────────
const ipHits = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

// ── Razorpay ──────────────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ── Stock decrement (best-effort, non-blocking) ───────────────────────────────
async function decrementStock(items: any[]) {
  try {
    const { Product } = await import("@/models/Product");
    for (const item of items) {
      if (!item.id) continue;
      await Product.findOneAndUpdate(
        { $or: [{ _id: String(item.id) }, { id: Number(item.id) }] },
        { $inc: { stock: -Number(item.quantity) } }
      ).catch(() => {});
    }
  } catch {}
}

// ── Verify OTP cookie ─────────────────────────────────────────────────────────
async function verifyOtpCookie(
  request: NextRequest,
  phone: string
): Promise<{ verified: boolean; email?: string }> {
  try {
    const token = request.cookies.get("verified_phone")?.value;
    if (!token) return { verified: false };
    const { payload } = await jwtVerify(token, OTP_SECRET);
    if (!payload.verified) return { verified: false };
    const norm = (p: string) => String(p).replace(/\D/g, "").slice(-10);
    if (norm(payload.phone as string) !== norm(phone)) return { verified: false };
    return { verified: true, email: payload.email as string | undefined };
  } catch {
    return { verified: false };
  }
}

// ── Send order confirmation email (non-blocking) ──────────────────────────────
function fireConfirmationEmail(payload: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  items: any[];
  address: any;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  fetch(`${baseUrl}/api/notify/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((err) => console.error("Confirmation email fire error:", err));
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const {
      items,
      address,
      paymentMethod,
      subtotal,
      deliveryFee,
      couponDiscount,
      customerEmail: bodyEmail, // email passed explicitly from checkout form
    } = body;

    // ── Validate items ────────────────────────────────────────────────────────
    const itemsV = validateOrderItems(items);
    if (!itemsV.ok) return NextResponse.json(itemsV.toResponse(), { status: 400 });

    // ── Validate address ──────────────────────────────────────────────────────
    const addrV = validateCheckoutAddress({
      name:    address?.fullName ?? address?.name,
      phone:   address?.phone,
      line1:   address?.addressLine1 ?? address?.line1,
      city:    address?.city,
      state:   address?.state,
      pincode: address?.pincode,
    });
    if (!addrV.ok) return NextResponse.json(addrV.toResponse(), { status: 400 });

    // ── Validate email ────────────────────────────────────────────────────────
    const customerEmail =
      bodyEmail?.trim() ||
      address?.email?.trim() ||
      "";

    if (!customerEmail || !customerEmail.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // ── OTP gate ──────────────────────────────────────────────────────────────
    const otpResult = await verifyOtpCookie(request, address?.phone ?? "");
    if (!otpResult.verified) {
      return NextResponse.json(
        {
          error: "Phone number not verified. Please complete OTP verification.",
          requiresOtp: true,
        },
        { status: 403 }
      );
    }

    // ── Amount validation ─────────────────────────────────────────────────────
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

    // ── Save order to DB ──────────────────────────────────────────────────────
    await connectDB();

    const customerName  = sanitize(address?.fullName ?? address?.name);
    const customerPhone = String(address?.phone ?? "").replace(/[\s\-+]/g, "");

    const dbOrder = await Order.create({
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,       // ← now stored on every order
      total,
      subtotal:       numSubtotal,
      deliveryFee:    numDelivery,
      couponDiscount: numCoupon,
      status:         "pending",
      paymentMethod,
      items: items.map((i: any) => ({
        productId: String(i.id ?? ""),
        name:      sanitize(i.name),
        variant:   sanitize(i.variant ?? ""),
        price:     Number(i.price),
        quantity:  Number(i.quantity),
        image:     typeof i.image === "string" ? i.image.slice(0, 500) : "",
      })),
      address: {
        name:    customerName,
        phone:   customerPhone,
        line1:   sanitize(address?.addressLine1 ?? address?.line1),
        line2:   sanitize(address?.addressLine2 ?? address?.line2 ?? ""),
        city:    sanitize(address?.city),
        state:   sanitize(address?.state),
        pincode: String(address?.pincode ?? "").trim(),
      },
    });

    // ── COD flow ──────────────────────────────────────────────────────────────
    if (paymentMethod === "cod") {
      await Order.findByIdAndUpdate(dbOrder._id, { status: "confirmed" });

      // Email confirmation (non-blocking)
      fireConfirmationEmail({
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        total,
        subtotal: numSubtotal,
        deliveryFee: numDelivery,
        items: items.map((i: any) => ({
          name:     sanitize(i.name),
          quantity: Number(i.quantity),
          price:    Number(i.price),
          image:    i.image ?? "",
        })),
        address: {
          name:    customerName,
          phone:   customerPhone,
          line1:   sanitize(address?.addressLine1 ?? address?.line1),
          line2:   sanitize(address?.addressLine2 ?? address?.line2 ?? ""),
          city:    sanitize(address?.city),
          state:   sanitize(address?.state),
          pincode: String(address?.pincode ?? "").trim(),
        },
      });

      // Decrement stock (non-blocking)
      decrementStock(items);

      // Stock alerts (non-blocking)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
      fetch(`${baseUrl}/api/admin/stock-alerts`, {
        method:  "POST",
        headers: { "x-internal-key": process.env.ADMIN_SEED_KEY ?? "" },
      }).catch(() => {});

      // Clear OTP cookie
      const res = NextResponse.json({
        orderId:         orderNumber,
        dbOrderId:       dbOrder._id.toString(),
        paymentRequired: false,
      });
      res.cookies.set("verified_phone", "", { maxAge: 0, path: "/" });
      return res;
    }

    // ── Online payment (Razorpay) ─────────────────────────────────────────────
    const rzpOrder = await razorpay.orders.create({
      amount:   Math.round(total * 100),
      currency: "INR",
      receipt:  orderNumber,
      notes: {
        db_order_id: dbOrder._id.toString(),
        customer:    customerName,
        phone:       customerPhone,
        email:       customerEmail,
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
        name:    customerName,
        contact: customerPhone,
        email:   customerEmail,
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