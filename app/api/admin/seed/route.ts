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

    const bcrypt = await import("bcryptjs");
    const { connectDB } = await import("@/lib/mongodb");
    const { Admin } = await import("@/models/Admin");
    const { Category } = await import("@/models/Category");

    await connectDB();

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

    const categories = [
      { name: "Seeds",        nameTa: "விதைகள்",         slug: "seeds" },
      { name: "Grow Bags",    nameTa: "வளர் பைகள்",       slug: "grow-bags" },
      { name: "Fertilizers",  nameTa: "உரங்கள்",          slug: "fertilizers" },
      { name: "Coco Peats",   nameTa: "தென்னை சணல்",      slug: "coco-peats" },
      { name: "Pots",         nameTa: "குடுவைகள்",         slug: "pots" },
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

    return NextResponse.json({
      message: "Database seeded successfully!",
      admin:   { email: admin.email, name: admin.name },
      categoriesCreated,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}