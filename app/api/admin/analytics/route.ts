import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { requireAdminAuth } from "@/lib/adminAuthServer";

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();

    // ── Monthly revenue + order count (last 7 months) ─────────────────────────
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);
    sevenMonthsAgo.setDate(1);
    sevenMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyAgg = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["cancelled", "refunded"] },
          createdAt: { $gte: sevenMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year:  { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          orders:  { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyRevenue = monthlyAgg.map((m: any) => ({
      month:   monthNames[m._id.month - 1],
      revenue: Math.round(m.revenue),
      orders:  m.orders,
    }));

    // ── Category sales breakdown ───────────────────────────────────────────────
    const categoryAgg = await Order.aggregate([
      { $match: { status: { $nin: ["cancelled", "refunded"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id:   "$items.name",
          sales: { $sum: "$items.quantity" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
    ]);
    const totalCategorySales = categoryAgg.reduce((s: number, c: any) => s + c.sales, 0);
    const COLORS = ["#3d6b35","#7ab648","#a8d878","#d4e8c2","#eef5ea"];
    const categoryBreakdown = categoryAgg.map((c: any, i: number) => ({
      name:  c._id,
      value: totalCategorySales > 0 ? Math.round((c.sales / totalCategorySales) * 100) : 0,
      color: COLORS[i] ?? "#ccc",
    }));

    // ── Top 5 products ─────────────────────────────────────────────────────────
    const topProductsAgg = await Order.aggregate([
      { $match: { status: { $nin: ["cancelled", "refunded"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id:     "$items.name",
          sales:   { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
    ]);
    const topProducts = topProductsAgg.map((p: any) => ({
      name:    p._id,
      sales:   p.sales,
      revenue: Math.round(p.revenue),
    }));

    // ── KPI totals ─────────────────────────────────────────────────────────────
    const [totalProducts, totalOrders, totalCustomers, revenueResult] = await Promise.all([
      Product.countDocuments({ active: true }),
      Order.countDocuments(),
      User.countDocuments({ active: true }),
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    return NextResponse.json({
      monthlyRevenue,
      categoryBreakdown,
      topProducts,
      kpi: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: revenueResult[0]?.total ?? 0,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}