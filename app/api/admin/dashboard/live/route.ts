import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { requireAdminAuth } from "@/lib/adminAuthServer";

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();

    // Recent 10 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("orderNumber customerName total status createdAt paymentMethod")
      .lean();

    const orders = recentOrders.map((o: any) => ({
      id:            o._id.toString(),
      orderNumber:   o.orderNumber,
      customer:      o.customerName,
      amount:        o.total,
      status:        o.status,
      time:          o.createdAt,
      paymentMethod: o.paymentMethod,
    }));

    // Top 5 products by sales from order items
    const topProductsAgg = await Order.aggregate([
      { $match: { status: { $nin: ["cancelled", "refunded"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id:     "$items.name",
          sales:   { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          image:   { $first: "$items.image" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
    ]);

    const topProducts = topProductsAgg.map((p: any) => ({
      name:    p._id,
      sales:   p.sales,
      revenue: p.revenue,
      image:   p.image ?? "",
    }));

    // Status breakdown
    const statusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusBreakdown: Record<string, number> = {};
    for (const s of statusAgg) statusBreakdown[s._id] = s.count;

    // Low stock products (5 or fewer)
    const lowStockItems = await Product.find({ active: true, stock: { $lte: 5 } })
      .select("name sku stock")
      .limit(5)
      .lean();

    const lowStock = lowStockItems.map((p: any) => ({
      id:    p._id.toString(),
      name:  p.name,
      sku:   p.sku,
      stock: p.stock,
    }));

    return NextResponse.json({ orders, topProducts, statusBreakdown, lowStock });
  } catch (error) {
    console.error("Dashboard live error:", error);
    return NextResponse.json({ error: "Failed to fetch live data" }, { status: 500 });
  }
}