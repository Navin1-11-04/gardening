// app/api/admin/export/route.ts
// GET /api/admin/export?type=orders|products|customers
// Returns a CSV file for download. Works in admin panel only.

import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/adminAuthServer";
import { connectDB } from "@/lib/mongodb";

function toCSV(rows: Record<string, any>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape  = (val: any) => {
    const str = String(val ?? "").replace(/"/g, '""');
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str}"`
      : str;
  };
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ];
  return lines.join("\n");
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  const type = request.nextUrl.searchParams.get("type") ?? "orders";

  try {
    await connectDB();
    let csv    = "";
    let filename = "";

    if (type === "orders") {
      const { Order } = await import("@/models/Order");
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5000)
        .lean();

      const rows = orders.map((o: any) => ({
        "Order Number":   o.orderNumber,
        "Date":           new Date(o.createdAt).toLocaleDateString("en-IN"),
        "Customer Name":  o.customerName,
        "Phone":          o.customerPhone ?? "",
        "Email":          o.customerEmail ?? "",
        "Status":         o.status,
        "Payment":        o.paymentMethod,
        "Items":          (o.items ?? []).length,
        "Subtotal":       o.subtotal ?? o.total,
        "Delivery Fee":   o.deliveryFee ?? 0,
        "Discount":       o.couponDiscount ?? 0,
        "Total":          o.total,
        "City":           o.address?.city ?? "",
        "State":          o.address?.state ?? "",
        "Pincode":        o.address?.pincode ?? "",
      }));

      csv      = toCSV(rows);
      filename = `kavin-orders-${new Date().toISOString().slice(0,10)}.csv`;
    }

    else if (type === "products") {
      const { Product } = await import("@/models/Product");
      const products = await Product.find()
        .populate("categoryId", "name")
        .lean();

      const rows = products.map((p: any) => ({
        "SKU":          p.sku,
        "Name":         p.name,
        "Name (Tamil)": p.nameTa ?? "",
        "Category":     p.categoryId?.name ?? "",
        "Price":        p.price,
        "Original Price": p.originalPrice ?? "",
        "Stock":        p.stock,
        "In Stock":     p.inStock ? "Yes" : "No",
        "Active":       p.active ? "Yes" : "No",
        "Badge":        p.badge ?? "",
        "Rating":       p.rating,
        "Reviews":      p.reviews,
        "Created":      new Date(p.createdAt).toLocaleDateString("en-IN"),
      }));

      csv      = toCSV(rows);
      filename = `kavin-products-${new Date().toISOString().slice(0,10)}.csv`;
    }

    else if (type === "customers") {
      const { Order } = await import("@/models/Order");
      // Aggregate unique customers from orders
      const customers = await Order.aggregate([
        {
          $group: {
            _id:          "$customerPhone",
            name:         { $last: "$customerName" },
            email:        { $last: "$customerEmail" },
            totalOrders:  { $sum: 1 },
            totalSpent:   { $sum: "$total" },
            lastOrderAt:  { $max: "$createdAt" },
            firstOrderAt: { $min: "$createdAt" },
            city:         { $last: "$address.city" },
            state:        { $last: "$address.state" },
          },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 5000 },
      ]);

      const rows = customers.map((c: any) => ({
        "Phone":         c._id ?? "",
        "Name":          c.name ?? "",
        "Email":         c.email ?? "",
        "Total Orders":  c.totalOrders,
        "Total Spent":   Math.round(c.totalSpent),
        "City":          c.city ?? "",
        "State":         c.state ?? "",
        "First Order":   new Date(c.firstOrderAt).toLocaleDateString("en-IN"),
        "Last Order":    new Date(c.lastOrderAt).toLocaleDateString("en-IN"),
      }));

      csv      = toCSV(rows);
      filename = `kavin-customers-${new Date().toISOString().slice(0,10)}.csv`;
    }

    else {
      return NextResponse.json({ error: "Invalid export type. Use: orders, products, customers" }, { status: 400 });
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type":        "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control":       "no-store",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}