import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { requireAdminAuth } from "@/lib/adminAuthServer";

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();

    const ACTIVE_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered"];

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      deliveredRevenueAgg,
      pipelineAgg,
      lowStockProducts,
      statusAgg,
    ] = await Promise.all([
      Product.countDocuments({ active: true }),
      Order.countDocuments(),
      User.countDocuments({ active: true }),
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { status: { $in: ["pending", "confirmed", "processing", "shipped"] } } },
        { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
      ]),
      Product.countDocuments({ stock: { $lte: 5 }, active: true }),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const statusBreakdown: Record<string, number> = {};
    for (const s of statusAgg) {
      statusBreakdown[s._id] = s.count;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: todayStart },
    });

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthRevenueAgg = await Order.aggregate([
      {
        $match: {
          status:    { $in: ACTIVE_STATUSES },
          createdAt: { $gte: monthStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue:    deliveredRevenueAgg[0]?.total ?? 0,
      pipelineRevenue: pipelineAgg[0]?.total ?? 0,
      pipelineOrders:  pipelineAgg[0]?.count ?? 0,
      monthRevenue:    monthRevenueAgg[0]?.total ?? 0,
      lowStockProducts,
      statusBreakdown,
      todayOrders,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}