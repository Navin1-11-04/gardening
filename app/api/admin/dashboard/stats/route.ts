import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const [totalProducts, totalOrders, totalCustomers, revenueResult, lowStockProducts] =
      await Promise.all([
        Product.countDocuments({ active: true }),
        Order.countDocuments(),
        User.countDocuments({ active: true }),
        Order.aggregate([
          { $match: { status: "delivered" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Product.countDocuments({ stock: { $lte: 5 }, active: true }),
      ]);

    return NextResponse.json(
      {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: revenueResult[0]?.total ?? 0,
        lowStockProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}