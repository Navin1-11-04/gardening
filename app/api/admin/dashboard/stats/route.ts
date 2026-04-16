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

    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      revenueResult,
      lowStockProducts,
      recentOrderStatuses,
    ] = await Promise.all([
      Product.countDocuments({ active: true }),
      Order.countDocuments(),
      User.countDocuments({ active: true }),
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Product.countDocuments({ stock: { $lte: 5 }, active: true }),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    // Build status breakdown map
    const statusBreakdown: Record<string, number> = {};
    for (const s of recentOrderStatuses) {
      statusBreakdown[s._id] = s.count;
    }

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue: revenueResult[0]?.total ?? 0,
      lowStockProducts,
      statusBreakdown,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}