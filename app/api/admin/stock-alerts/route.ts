// app/api/admin/stock-alerts/route.ts
// POST: manually trigger stock alert check from admin dashboard.
// Also used internally after order creation to check stock levels.

import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/adminAuthServer";
import { auditAndAlertLowStock } from "@/lib/stockAlerts";

export async function POST(request: NextRequest) {
  // Allow both admin calls (with cookie) and internal server-side calls (with secret header)
  const internalKey = request.headers.get("x-internal-key");
  const isInternal  = internalKey === process.env.ADMIN_SEED_KEY;

  if (!isInternal) {
    const auth = await requireAdminAuth();
    if (!auth.ok) return auth.response;
  }

  try {
    const alerts = await auditAndAlertLowStock();
    return NextResponse.json({
      message: `Checked stock. ${alerts.length} low-stock alert${alerts.length !== 1 ? "s" : ""} sent.`,
      alerts,
    });
  } catch (error) {
    console.error("Stock alert error:", error);
    return NextResponse.json({ error: "Failed to check stock" }, { status: 500 });
  }
}