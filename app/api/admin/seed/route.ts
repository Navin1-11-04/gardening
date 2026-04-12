import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const AUTH_KEY = request.headers.get("x-seed-key");

    if (AUTH_KEY !== process.env.ADMIN_SEED_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🌱 Seeding database...");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.admin.upsert({
      where: { email: "admin@kavin-organics.com" },
      update: {},
      create: {
        email: "admin@kavin-organics.com",
        password: hashedPassword,
        name: "Admin",
        role: "admin",
        active: true,
      },
    });

    console.log("✅ Created admin:", admin.email);

    const categories = [
      { name: "Seeds", nameTa: "விதைகள்", slug: "seeds" },
      { name: "Grow Bags", nameTa: "வளர் பைகள்", slug: "grow-bags" },
      { name: "Fertilizers", nameTa: "உரங்கள்", slug: "fertilizers" },
      { name: "Coco Peats", nameTa: "தென்னை சணல்", slug: "coco-peats" },
      { name: "Pots", nameTa: "குடுவைகள்", slug: "pots" },
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: {
          name: cat.name,
          nameTa: cat.nameTa,
          slug: cat.slug,
        },
      });
    }

    console.log("✅ Created categories");

    return NextResponse.json(
      {
        message: "Database seeded successfully!",
        admin: {
          email: admin.email,
          name: admin.name,
        },
        categoriesCreated: categories.length,
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