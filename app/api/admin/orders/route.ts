import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select("orderNumber customerName total status createdAt")
      .lean();

    // Normalise _id → id for frontend compatibility
    const normalised = orders.map((o: any) => ({
      id: o._id.toString(),
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
    }));

    return NextResponse.json(normalised, { status: 200 });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}