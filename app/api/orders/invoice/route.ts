// app/api/orders/invoice/route.ts
// GET /api/orders/invoice?id=KO-20250522-XXXX
// Returns a printable HTML invoice the customer can print/save as PDF
// from their browser. No PDF library needed.

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("id");

  if (!orderId) {
    return NextResponse.json({ error: "Order ID required" }, { status: 400 });
  }

  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Order }     = await import("@/models/Order");
    await connectDB();

    const order = await Order.findOne({ orderNumber: orderId }).lean() as any;

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const itemRows = (order.items ?? []).map((item: any) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;font-size:14px;color:#2a2a1e">
          ${item.name}${item.variant ? ` <span style="color:#7a7a68;font-size:12px">(${item.variant})</span>` : ""}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;text-align:center;font-size:14px;color:#2a2a1e">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;text-align:right;font-size:14px;color:#2a2a1e">
          Rs.${Number(item.price).toLocaleString("en-IN")}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0ece4;text-align:right;font-size:14px;font-weight:600;color:#3d6b35">
          Rs.${(Number(item.price) * Number(item.quantity)).toLocaleString("en-IN")}
        </td>
      </tr>`).join("");

    const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Invoice #${order.orderNumber} - Kavin Organics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      background: #fff;
      color: #2a2a1e;
      padding: 40px;
      max-width: 700px;
      margin: 0 auto;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
      button { display: none !important; }
    }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e8e0d0; }
    .brand h1 { font-size: 24px; font-weight: 900; color: #3d6b35; letter-spacing: 1px; }
    .brand p { font-size: 11px; font-weight: 700; color: #7a9e5f; letter-spacing: 3px; margin-top: 2px; }
    .brand address { font-style: normal; font-size: 12px; color: #7a7a68; margin-top: 8px; line-height: 1.5; }
    .invoice-meta { text-align: right; }
    .invoice-meta h2 { font-size: 28px; font-weight: 900; color: #2a2a1e; letter-spacing: 2px; }
    .invoice-meta p { font-size: 13px; color: #7a7a68; margin-top: 4px; }
    .invoice-meta .order-id { font-size: 14px; font-weight: 700; color: #3d6b35; margin-top: 8px; }
    .status-badge { display: inline-block; background: #eef5ea; color: #3d6b35; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; }
    .addresses { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
    .address-box h3 { font-size: 11px; font-weight: 700; color: #7a7a68; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .address-box p { font-size: 13px; color: #2a2a1e; line-height: 1.6; }
    .address-box strong { font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
    thead tr { background: #3d6b35; }
    thead th { padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.5px; }
    thead th:last-child, thead th:nth-child(3) { text-align: right; }
    thead th:nth-child(2) { text-align: center; }
    .totals { border-top: 2px solid #e8e0d0; margin-top: 0; }
    .totals table { margin: 0; }
    .totals td { padding: 8px 12px; font-size: 13px; color: #5a5a48; }
    .totals tr:last-child td { font-size: 16px; font-weight: 900; color: #2a2a1e; border-top: 2px solid #e8e0d0; padding-top: 12px; }
    .totals tr:last-child td:last-child { color: #3d6b35; }
    .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e8e0d0; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer p { font-size: 12px; color: #7a7a68; line-height: 1.6; }
    .footer .thank-you { font-size: 14px; font-weight: 700; color: #3d6b35; }
    .print-btn { position: fixed; bottom: 24px; right: 24px; background: #3d6b35; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(61,107,53,0.3); }
    .print-btn:hover { background: #2e5228; }
  </style>
</head>
<body>

  <div class="header">
    <div class="brand">
      <h1>KAVIN ORGANICS</h1>
      <p>HOME GARDEN STORE</p>
      <address>
        No. 45, Market Road<br>
        Thiruchengode - 637211<br>
        Namakkal District, Tamil Nadu<br>
        Phone: +91 98765 43210<br>
        Email: hello@kavinorganics.in
      </address>
    </div>
    <div class="invoice-meta">
      <h2>INVOICE</h2>
      <p>Date: ${orderDate}</p>
      <p class="order-id">#${order.orderNumber}</p>
      <span class="status-badge">${order.status}</span>
    </div>
  </div>

  <div class="addresses">
    <div class="address-box">
      <h3>Bill To / Ship To</h3>
      <p>
        <strong>${order.address?.name ?? order.customerName}</strong><br>
        ${order.address?.line1 ?? ""}${order.address?.line2 ? "<br>" + order.address.line2 : ""}<br>
        ${order.address?.city ?? ""}, ${order.address?.state ?? ""}<br>
        PIN: ${order.address?.pincode ?? ""}<br>
        Phone: ${order.address?.phone ?? order.customerPhone ?? ""}
        ${order.customerEmail ? `<br>Email: ${order.customerEmail}` : ""}
      </p>
    </div>
    <div class="address-box">
      <h3>Payment Details</h3>
      <p>
        <strong>Method:</strong> ${order.paymentMethod}<br>
        <strong>Status:</strong> ${order.status === "cancelled" ? "Cancelled" : "Paid"}<br>
        ${order.razorpayPaymentId ? `<strong>Payment ID:</strong> ${order.razorpayPaymentId}` : ""}
      </p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:50%">Product</th>
        <th style="width:10%">Qty</th>
        <th style="width:20%">Unit Price</th>
        <th style="width:20%">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <td style="width:75%"></td>
        <td style="text-align:right;color:#5a5a48">Subtotal</td>
        <td style="text-align:right;min-width:120px">Rs.${Number(order.subtotal ?? order.total).toLocaleString("en-IN")}</td>
      </tr>
      <tr>
        <td></td>
        <td style="text-align:right;color:${Number(order.deliveryFee) === 0 ? "#3d6b35" : "#5a5a48"}">Delivery</td>
        <td style="text-align:right;color:${Number(order.deliveryFee) === 0 ? "#3d6b35" : "#2a2a1e"}">
          ${Number(order.deliveryFee) === 0 ? "FREE" : `Rs.${Number(order.deliveryFee).toLocaleString("en-IN")}`}
        </td>
      </tr>
      ${Number(order.couponDiscount) > 0 ? `
      <tr>
        <td></td>
        <td style="text-align:right;color:#3d6b35">Discount</td>
        <td style="text-align:right;color:#3d6b35">-Rs.${Number(order.couponDiscount).toLocaleString("en-IN")}</td>
      </tr>` : ""}
      <tr>
        <td></td>
        <td style="text-align:right">Total</td>
        <td style="text-align:right">Rs.${Number(order.total).toLocaleString("en-IN")}</td>
      </tr>
    </table>
  </div>

  <div class="footer">
    <div>
      <p>Thank you for shopping with us!</p>
      <p>Returns accepted within 7 days. Call +91 98765 43210 for help.</p>
    </div>
    <p class="thank-you">Happy Gardening! 🌿</p>
  </div>

  <button class="print-btn no-print" onclick="window.print()">
    🖨️ Print / Save PDF
  </button>

</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Invoice error:", error);
    return new NextResponse("Failed to generate invoice", { status: 500 });
  }
}