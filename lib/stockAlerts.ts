import nodemailer from "nodemailer";

const LOW_STOCK_THRESHOLD = 5; // alert when stock ≤ this number

interface LowStockProduct {
  id:       string;
  name:     string;
  sku:      string;
  stock:    number;
  category: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

export function isLowStock(stock: number): boolean {
  return stock <= LOW_STOCK_THRESHOLD;
}

export async function sendLowStockAlert(product: LowStockProduct): Promise<void> {
  const adminEmail = process.env.SMTP_EMAIL;
  if (!adminEmail) return;

  const isOut = product.stock === 0;
  const subject = isOut
    ? `🚨 OUT OF STOCK: ${product.name} — Kavin Organics`
    : `⚠️ Low Stock Alert: ${product.name} (${product.stock} left)`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:sans-serif">
<div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e8e0d0">
  <div style="background:${isOut ? "#c0392b" : "#d4a017"};padding:20px 28px">
    <h1 style="color:#fff;font-size:20px;margin:0">
      ${isOut ? "🚨 Product Out of Stock" : "⚠️ Low Stock Alert"}
    </h1>
  </div>
  <div style="padding:28px">
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      <tr style="border-bottom:1px solid #f0ece4">
        <td style="padding:10px 0;color:#7a7a68;width:140px">Product</td>
        <td style="padding:10px 0;font-weight:700;color:#2a2a1e">${product.name}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0ece4">
        <td style="padding:10px 0;color:#7a7a68">SKU</td>
        <td style="padding:10px 0;font-weight:600;color:#2a2a1e">${product.sku}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0ece4">
        <td style="padding:10px 0;color:#7a7a68">Category</td>
        <td style="padding:10px 0;color:#2a2a1e">${product.category}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#7a7a68">Stock remaining</td>
        <td style="padding:10px 0;font-size:20px;font-weight:900;color:${isOut ? "#c0392b" : "#d4a017"}">
          ${isOut ? "0 — OUT OF STOCK" : `${product.stock} units`}
        </td>
      </tr>
    </table>
    <div style="margin-top:20px;padding:14px 18px;background:#faf7f2;border-radius:12px;border:1px solid #e8e0d0">
      <p style="margin:0;font-size:14px;color:#5a5a48">
        ${isOut
          ? "This product is currently showing as unavailable to customers. Please restock as soon as possible."
          : `Only <strong>${product.stock} unit${product.stock !== 1 ? "s" : ""}</strong> remaining. Consider restocking soon to avoid losing sales.`}
      </p>
    </div>
    <div style="margin-top:20px;text-align:center">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/admin/products"
        style="display:inline-block;background:#3d6b35;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none">
        Update Stock in Admin →
      </a>
    </div>
  </div>
  <div style="padding:14px 28px;background:#f0ece4;text-align:center">
    <p style="margin:0;font-size:12px;color:#7a7a68">
      Kavin Organics Admin Alert · This is an automated message
    </p>
  </div>
</div>
</body>
</html>`;

  await transporter.sendMail({
    from:    `"Kavin Organics Alerts" <${adminEmail}>`,
    to:      adminEmail,
    subject,
    html,
  });
}

/**
 * Check all products and send alerts for any that are low.
 * Call this from a cron job or admin dashboard.
 */
export async function auditAndAlertLowStock(): Promise<LowStockProduct[]> {
  const { connectDB } = await import("@/lib/mongodb");
  const { Product }   = await import("@/models/Product");

  await connectDB();

  const lowStockProducts = await Product.find({
    active: true,
    stock:  { $lte: LOW_STOCK_THRESHOLD },
  }).select("name sku stock categoryId").populate("categoryId", "name").lean();

  const alerts: LowStockProduct[] = [];

  for (const p of lowStockProducts as any[]) {
    const alert: LowStockProduct = {
      id:       p._id.toString(),
      name:     p.name,
      sku:      p.sku,
      stock:    p.stock,
      category: p.categoryId?.name ?? "Unknown",
    };
    alerts.push(alert);
    // Non-blocking — fire and forget
    sendLowStockAlert(alert).catch(console.error);
  }

  return alerts;
}