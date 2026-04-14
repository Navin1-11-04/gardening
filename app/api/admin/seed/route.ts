// app/api/admin/seed/route.ts
// Seeds the MongoDB database with an admin user and default categories.
// Protect with ADMIN_SEED_KEY env var.

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { Category } from "@/models/Category";

export async function POST(request: NextRequest) {
  try {
    const authKey = request.headers.get("x-seed-key");

    if (authKey !== process.env.ADMIN_SEED_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // ── Admin user ────────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await Admin.findOneAndUpdate(
      { email: "admin@kavin-organics.com" },
      {
        $setOnInsert: {
          email: "admin@kavin-organics.com",
          password: hashedPassword,
          name: "Admin",
          role: "admin",
          active: true,
        },
      },
      { upsert: true, new: true }
    );

    // ── Categories ────────────────────────────────────────────────────────────
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

    return NextResponse.json(
      {
        message: "Database seeded successfully!",
        admin: { email: admin.email, name: admin.name },
        categoriesCreated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}