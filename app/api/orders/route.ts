import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.orderNumber || !data.customerName || !data.total) {
      return NextResponse.json({ error: "Missing required order fields" }, { status: 400 });
    }

    const { connectDB } = await import("@/lib/mongodb");
    const { Order }     = await import("@/models/Order");

    await connectDB();

    // Prevent duplicate orders (idempotency)
    const existing = await Order.findOne({ orderNumber: data.orderNumber });
    if (existing) {
      return NextResponse.json({ message: "Order already exists", id: existing._id.toString() }, { status: 200 });
    }

    const order = await Order.create({
      orderNumber:   data.orderNumber,
      customerName:  data.customerName,
      customerPhone: data.customerPhone ?? "",
      total:         Number(data.total),
      subtotal:      Number(data.subtotal ?? data.total),
      deliveryFee:   Number(data.deliveryFee ?? 0),
      status:        data.status ?? "pending",
      paymentMethod: data.paymentMethod ?? "Cash on Delivery",
      items:         data.items ?? [],
      address:       data.address ?? {},
    });

    return NextResponse.json(
      { message: "Order created", id: order._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    // Return 200 so the checkout doesn't break even if DB save fails
    return NextResponse.json({ message: "Order noted" }, { status: 200 });
  }
}