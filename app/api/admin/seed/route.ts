import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Hard block in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seed route is disabled in production." },
      { status: 403 }
    );
  }

  try {
    const authKey = request.headers.get("x-seed-key");
    if (!process.env.ADMIN_SEED_KEY || authKey !== process.env.ADMIN_SEED_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bcrypt          = await import("bcryptjs");
    const { connectDB }   = await import("@/lib/mongodb");
    const { Admin }       = await import("@/models/Admin");
    const { Category }    = await import("@/models/Category");
    const { Coupon }      = await import("@/models/Coupon");

    await connectDB();

    // ── 1. Admin user ─────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_DEFAULT_PASSWORD ?? "admin123",
      12
    );

    const admin = await Admin.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL ?? "admin@kavin-organics.com" },
      {
        $setOnInsert: {
          email:    process.env.ADMIN_EMAIL ?? "admin@kavin-organics.com",
          password: hashedPassword,
          name:     "Admin",
          role:     "admin",
          active:   true,
        },
      },
      { upsert: true, new: true }
    );

    // ── 2. Categories ─────────────────────────────────────────────────────────
    const categories = [
      { name: "Seeds",        nameTa: "விதைகள்",          slug: "seeds" },
      { name: "Grow Bags",    nameTa: "வளர் பைகள்",        slug: "grow-bags" },
      { name: "Fertilizers",  nameTa: "உரங்கள்",           slug: "fertilizers" },
      { name: "Coco Peats",   nameTa: "தேங்காய் நார்",     slug: "coco-peats" },
      { name: "Pots",         nameTa: "குடுவைகள்",          slug: "pots" },
      { name: "Garden Tools", nameTa: "தோட்ட கருவிகள்",   slug: "tools" },
    ];

    let categoriesCreated = 0;
    for (const cat of categories) {
      const result = await Category.findOneAndUpdate(
        { slug: cat.slug },
        { $setOnInsert: cat },
        { upsert: true, new: true }
      );
      if (result) categoriesCreated++;
    }

    // ── 3. Default coupon codes ───────────────────────────────────────────────
    const defaultCoupons = [
      {
        code:        "GARDEN10",
        discount:    10,
        active:      true,
        minOrder:    0,
        maxUses:     0,
        description: "10% off — Welcome discount",
      },
      {
        code:        "KAVIN20",
        discount:    20,
        active:      true,
        minOrder:    500,
        maxUses:     0,
        description: "20% off orders above ₹500",
      },
      {
        code:        "GREEN15",
        discount:    15,
        active:      true,
        minOrder:    0,
        maxUses:     0,
        description: "15% off — Gardening special",
      },
      {
        code:        "FIRST25",
        discount:    25,
        active:      true,
        minOrder:    999,
        maxUses:     1,
        description: "25% off first order above ₹999",
      },
    ];

    let couponsCreated = 0;
    for (const coupon of defaultCoupons) {
      const existing = await Coupon.findOne({ code: coupon.code });
      if (!existing) {
        await Coupon.create(coupon);
        couponsCreated++;
      }
    }

    return NextResponse.json({
      message:          "Database seeded successfully!",
      admin:            { email: admin.email, name: admin.name },
      categoriesSeeded: categoriesCreated,
      couponsCreated,
      instructions: {
        step1: "Go to /admin/login",
        step2: `Email: ${process.env.ADMIN_EMAIL ?? "admin@kavin-organics.com"}`,
        step3: `Password: ${process.env.ADMIN_DEFAULT_PASSWORD ?? "admin123"}`,
        step4: "Change your password immediately after first login!",
      },
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}