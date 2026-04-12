import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalOrdersSum,
      lowStockProducts,
    ] = await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { active: true } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "delivered" },
      }),
      prisma.product.count({
        where: { stock: { lte: 5 }, active: true },
      }),
    ]);

    return NextResponse.json(
      {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: totalOrdersSum._sum.total ?? 0,
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