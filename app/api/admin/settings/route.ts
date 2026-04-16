import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdminAuth } from "@/lib/adminAuthServer";
import { Settings } from "@/models/Settings";

const DEFAULTS = {
  storeName:             "Kavin Organics",
  storePhone:            "+91 98765 43210",
  storeEmail:            "hello@kavinorganics.in",
  storeAddress:          "No. 45, Market Road, Thiruchengode — 637211, Namakkal District, Tamil Nadu",
  businessHoursMon:      "9:00 AM",
  businessHoursMonEnd:   "6:00 PM",
  businessHoursSat:      "9:00 AM",
  businessHoursSatEnd:   "4:00 PM",
  freeDeliveryThreshold: 999,
  deliveryFee:           79,
  maxDeliveryDays:       4,
  whatsappNumber:        "919876543210",
  maintenanceMode:       false,
  allowCOD:              true,
  allowUPI:              true,
  allowCard:             true,
};

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const doc = await Settings.findOne({ key: "store" }).lean();
    const value = (doc as any)?.value ?? DEFAULTS;
    return NextResponse.json({ ...DEFAULTS, ...value });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    const data = await request.json();

    await Settings.findOneAndUpdate(
      { key: "store" },
      { $set: { value: { ...DEFAULTS, ...data } } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Settings saved successfully" });
  } catch (error) {
    console.error("Save settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}