// app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { requireAdminAuth } from "@/lib/adminAuthServer";
import { verifyCsrf } from "@/lib/csrf";

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
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const o = order as any;
    return NextResponse.json({
      id:             o._id.toString(),
      orderNumber:    o.orderNumber,
      customerName:   o.customerName,
      customerPhone:  o.customerPhone,
      customerEmail:  o.customerEmail ?? "",
      total:          o.total,
      subtotal:       o.subtotal ?? o.total,
      deliveryFee:    o.deliveryFee ?? 0,
      status:         o.status,
      paymentMethod:  o.paymentMethod,
      createdAt:      o.createdAt,
      items:          o.items ?? [],
      address:        o.address ?? null,
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

  const csrf = await verifyCsrf(request);
  if (!csrf.ok) return csrf.response;

  try {
    const { id } = await params;
    const { status } = await request.json();

    const valid = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const o = order as any;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

    if ((status === "shipped" || status === "delivered") && o.customerEmail) {
      fetch(`${baseUrl}/api/notify/email/status`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber:   o.orderNumber,
          customerName:  o.customerName,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          status,
          total:  o.total,
          items: (o.items ?? []).map((i: any) => ({ name: i.name, quantity: i.quantity })),
          address: o.address ?? {},
        }),
      }).catch(console.error);
    }

    return NextResponse.json({ message: "Status updated", status });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}