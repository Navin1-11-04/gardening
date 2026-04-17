import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ error: "Search query required" }, { status: 400 });
  }

  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Order }     = await import("@/models/Order");
    await connectDB();

    // Match by order number OR customer phone (strip non-digits for phone)
    const phoneDigits = q.replace(/\D/g, "");
    const orders = await Order.find({
      $or: [
        { orderNumber:   { $regex: q, $options: "i" } },
        { customerPhone: { $regex: phoneDigits, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("-__v")
      .lean();

    // Mask sensitive data before returning — show last 4 digits of phone only
    const safeOrders = orders.map((o: any) => ({
      ...o,
      customerPhone: o.customerPhone
        ? `XXXX ${String(o.customerPhone).slice(-4)}`
        : undefined,
      customerEmail: undefined, // never expose email publicly
    }));

    return NextResponse.json({ orders: safeOrders });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json({ error: "Failed to search orders" }, { status: 500 });
  }
}