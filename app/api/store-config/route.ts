import { NextResponse } from "next/server";

const DEFAULTS = {
  freeDeliveryThreshold: 999,
  deliveryFee: 79,
  whatsappNumber: "919876543210",
  maxDeliveryDays: 4,
  allowCOD: true,
  allowUPI: true,
  allowCard: true,
  maintenanceMode: false,
};

export async function GET() {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Settings }  = await import("@/models/Settings");

    await connectDB();
    const doc = await Settings.findOne({ key: "store" }).lean();
    const stored = (doc as any)?.value ?? {};

    // Only expose the fields the frontend needs — never expose internal admin settings
    return NextResponse.json(
      {
        freeDeliveryThreshold: stored.freeDeliveryThreshold ?? DEFAULTS.freeDeliveryThreshold,
        deliveryFee:           stored.deliveryFee           ?? DEFAULTS.deliveryFee,
        whatsappNumber:        stored.whatsappNumber        ?? DEFAULTS.whatsappNumber,
        maxDeliveryDays:       stored.maxDeliveryDays       ?? DEFAULTS.maxDeliveryDays,
        allowCOD:              stored.allowCOD              ?? DEFAULTS.allowCOD,
        allowUPI:              stored.allowUPI              ?? DEFAULTS.allowUPI,
        allowCard:             stored.allowCard             ?? DEFAULTS.allowCard,
        maintenanceMode:       stored.maintenanceMode       ?? DEFAULTS.maintenanceMode,
      },
      {
        status: 200,
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
      }
    );
  } catch {
    // If DB is unavailable, return safe defaults so the store still works
    return NextResponse.json(DEFAULTS, { status: 200 });
  }
}