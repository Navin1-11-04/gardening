import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { requireAdminAuth } from "@/lib/adminAuthServer";

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .select("orderNumber customerName customerPhone total subtotal deliveryFee status paymentMethod createdAt")
      .lean();

    const normalised = orders.map((o: any) => ({
      id:            o._id.toString(),
      orderNumber:   o.orderNumber,
      customerName:  o.customerName,
      customerPhone: o.customerPhone,
      total:         o.total,
      subtotal:      o.subtotal ?? o.total,
      deliveryFee:   o.deliveryFee ?? 0,
      status:        o.status,
      paymentMethod: o.paymentMethod,
      createdAt:     o.createdAt,
    }));

    return NextResponse.json(normalised, { status: 200 });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}