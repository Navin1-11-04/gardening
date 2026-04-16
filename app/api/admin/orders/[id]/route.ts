import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { requireAdminAuth } from "@/lib/adminAuthServer";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    await connectDB();

    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const o = order as any;
    return NextResponse.json({
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
      items:         o.items ?? [],
      address:       o.address ?? null,
    });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const { status } = await request.json();

    const valid = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Status updated", status });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}