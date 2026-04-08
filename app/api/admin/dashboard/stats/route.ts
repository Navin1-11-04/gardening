import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      prisma.product.count({ where: { stock: { lte: 5 }, active: true } }),
    ]);

    const totalRevenue = totalOrdersSum._sum.total || 0;

    return NextResponse.json(
      {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        lowStockProducts,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
