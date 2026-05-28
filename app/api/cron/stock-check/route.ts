// app/api/cron/stock-check/route.ts
// Runs daily at 9 AM IST via Vercel Cron.
// Sends admin an email listing all products with 5 or fewer units.
//
// Setup — add to vercel.json in your project root:
// {
//   "crons": [{ "path": "/api/cron/stock-check", "schedule": "0 3 * * *" }]
// }
// 0 3 UTC = 8:30 AM IST every day.
// Vercel cron jobs require Pro plan. On free plan call manually from admin.

import { NextRequest, NextResponse } from "next/server";

function isAuthorized(request: NextRequest): boolean {
  const cronSecret  = request.headers.get("x-vercel-cron-secret");
  const internalKey = request.headers.get("x-internal-key");
  if (cronSecret  && cronSecret  === process.env.CRON_SECRET)   return true;
  if (internalKey && internalKey === process.env.ADMIN_SEED_KEY) return true;
  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Product }   = await import("@/models/Product");
    await connectDB();

    const lowStock = await Product.find({ active: true, stock: { $lte: 5 } })
      .select("name sku stock")
      .sort({ stock: 1 })
      .lean() as any[];

    if (!lowStock.length) {
      return NextResponse.json({ message: "All products well stocked.", lowStockCount: 0 });
    }

    if (process.env.SMTP_EMAIL && process.env.SMTP_PASS) {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host:   process.env.SMTP_HOST ?? "smtp.gmail.com",
        port:   Number(process.env.SMTP_PORT ?? 587),
        secure: false,
        auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASS },
      });

      const rows = lowStock.map((p) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #f0ece4;font-weight:600;color:#2a2a1e">${p.name}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #f0ece4;font-family:monospace;color:#7a7a68">${p.sku}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #f0ece4;text-align:center;font-weight:900;color:${p.stock === 0 ? "#c0392b" : "#d4a017"}">
            ${p.stock === 0 ? "OUT OF STOCK" : `${p.stock} left`}
          </td>
        </tr>`).join("");

      const hasOutOfStock = lowStock.some((p) => p.stock === 0);

      await transporter.sendMail({
        from:    `"Kavin Organics Alerts" <${process.env.SMTP_EMAIL}>`,
        to:      process.env.SMTP_EMAIL,
        subject: `${hasOutOfStock ? "OUT OF STOCK" : "Low Stock"}: ${lowStock.length} product${lowStock.length !== 1 ? "s" : ""} need attention`,
        html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#faf7f2;padding:32px">
          <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e8e0d0">
            <div style="background:${hasOutOfStock ? "#c0392b" : "#d4a017"};padding:20px 28px">
              <h1 style="color:#fff;font-size:18px;font-weight:900;margin:0">
                ${hasOutOfStock ? "OUT OF STOCK ALERT" : "LOW STOCK ALERT"}
              </h1>
              <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:4px 0 0">
                ${lowStock.length} product${lowStock.length !== 1 ? "s" : ""} need restocking — ${new Date().toLocaleDateString("en-IN")}
              </p>
            </div>
            <div style="padding:20px 28px">
              <table style="width:100%;border-collapse:collapse">
                <thead><tr style="background:#faf7f2">
                  <th style="padding:8px 16px;text-align:left;font-size:11px;color:#7a7a68;text-transform:uppercase">Product</th>
                  <th style="padding:8px 16px;text-align:left;font-size:11px;color:#7a7a68;text-transform:uppercase">SKU</th>
                  <th style="padding:8px 16px;text-align:center;font-size:11px;color:#7a7a68;text-transform:uppercase">Stock</th>
                </tr></thead>
                <tbody>${rows}</tbody>
              </table>
              <div style="margin-top:20px;text-align:center">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/admin/products"
                   style="display:inline-block;background:#3d6b35;color:#fff;font-weight:700;font-size:14px;padding:12px 24px;border-radius:10px;text-decoration:none">
                  Update Stock in Admin
                </a>
              </div>
            </div>
          </div>
        </body></html>`,
      });
    }

    return NextResponse.json({
      message:       `${lowStock.length} low-stock alert${lowStock.length !== 1 ? "s" : ""} sent.`,
      lowStockCount: lowStock.length,
      products:      lowStock.map((p) => ({ name: p.name, sku: p.sku, stock: p.stock })),
    });
  } catch (error: any) {
    console.error("Stock check cron error:", error);
    return NextResponse.json({ error: "Stock check failed" }, { status: 500 });
  }
}