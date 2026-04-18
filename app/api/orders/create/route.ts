import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { generateOrderId } from "@/lib/orderStorage";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, address, paymentMethod, subtotal, deliveryFee, couponDiscount } = body;

    if (!items?.length || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const total = subtotal - (couponDiscount ?? 0) + deliveryFee;
    const orderNumber = generateOrderId();

    // Save order to MongoDB first (status: pending)
    await connectDB();
    const dbOrder = await Order.create({
      orderNumber,
      customerName:  address.name,
      customerPhone: address.phone,
      total,
      subtotal,
      deliveryFee,
      couponDiscount: couponDiscount ?? 0,
      status:        "pending",
      paymentMethod,
      items: items.map((i: any) => ({
        productId: String(i.id),
        name:      i.name,
        variant:   i.variant,
        price:     i.price,
        quantity:  i.quantity,
        image:     i.image,
      })),
      address: {
        name:    address.name,
        phone:   address.phone,
        line1:   address.addressLine1,
        line2:   address.addressLine2 || undefined,
        city:    address.city,
        state:   address.state,
        pincode: address.pincode,
      },
    });

    // For COD — no Razorpay needed, confirm immediately
    if (paymentMethod === "cod") {
      await Order.findByIdAndUpdate(dbOrder._id, { status: "confirmed" });
      return NextResponse.json({
        orderId:    orderNumber,
        dbOrderId:  dbOrder._id.toString(),
        paymentRequired: false,
      });
    }

    // For online payment — create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount:   Math.round(total * 100), // paise
      currency: "INR",
      receipt:  orderNumber,
      notes: {
        db_order_id: dbOrder._id.toString(),
        customer:    address.name,
        phone:       address.phone,
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
        name:    address.name,
        contact: address.phone,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}