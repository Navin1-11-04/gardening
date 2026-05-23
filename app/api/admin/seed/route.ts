// app/api/admin/seed/route.ts
// Seeds the database with admin user, categories, coupons,
// AND all 22 static products from data/Product.ts
// Run once: POST /api/admin/seed with header x-seed-key: YOUR_ADMIN_SEED_KEY
// BLOCKED in production by default — set ALLOW_SEED=true env var to enable once.

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Block in production unless explicitly allowed
  const allowSeed = process.env.ALLOW_SEED === "true";
  if (process.env.NODE_ENV === "production" && !allowSeed) {
    return NextResponse.json(
      { error: "Seed route is disabled in production. Set ALLOW_SEED=true env var to enable once." },
      { status: 403 }
    );
  }

  try {
    const authKey = request.headers.get("x-seed-key");
    if (!process.env.ADMIN_SEED_KEY || authKey !== process.env.ADMIN_SEED_KEY) {
      return NextResponse.json({ error: "Unauthorized — wrong seed key." }, { status: 401 });
    }

    const bcrypt        = await import("bcryptjs");
    const { connectDB } = await import("@/lib/mongodb");
    const { Admin }     = await import("@/models/Admin");
    const { Category }  = await import("@/models/Category");
    const { Coupon }    = await import("@/models/Coupon");
    const { Product }   = await import("@/models/Product");
    const { products: staticProducts } = await import("@/data/Product");

    await connectDB();

    const results: Record<string, any> = {};

    // ── 1. Admin user ─────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_DEFAULT_PASSWORD ?? "admin123",
      12
    );
    const admin = await Admin.findOneAndUpdate(
      { email: (process.env.ADMIN_EMAIL ?? "admin@kavin-organics.com").toLowerCase() },
      {
        $setOnInsert: {
          email:    (process.env.ADMIN_EMAIL ?? "admin@kavin-organics.com").toLowerCase(),
          password: hashedPassword,
          name:     "Admin",
          role:     "admin",
          active:   true,
        },
      },
      { upsert: true, new: true }
    );
    results.admin = { email: admin.email, created: true };

    // ── 2. Categories ─────────────────────────────────────────────────────────
    const categoryDefs = [
      { name: "Seeds",        nameTa: "விதைகள்",        slug: "seeds" },
      { name: "Grow Bags",    nameTa: "வளர் பைகள்",     slug: "grow-bags" },
      { name: "Fertilizers",  nameTa: "உரங்கள்",        slug: "fertilizers" },
      { name: "Coco Peats",   nameTa: "தேங்காய் நார்",  slug: "coco-peats" },
      { name: "Pots",         nameTa: "குடுவைகள்",       slug: "pots" },
      { name: "Garden Tools", nameTa: "தோட்ட கருவிகள்", slug: "tools" },
    ];

    const categoryMap: Record<string, string> = {}; // slug → _id
    let categoriesCreated = 0;

    for (const cat of categoryDefs) {
      const doc = await Category.findOneAndUpdate(
        { slug: cat.slug },
        { $setOnInsert: cat },
        { upsert: true, new: true }
      );
      categoryMap[cat.slug] = doc._id.toString();
      categoriesCreated++;
    }
    results.categories = { created: categoriesCreated, map: categoryMap };

    // ── 3. Coupons ────────────────────────────────────────────────────────────
    const defaultCoupons = [
      { code: "GARDEN10", discount: 10, active: true, minOrder: 0,   maxUses: 0, description: "10% off — Welcome discount" },
      { code: "KAVIN20",  discount: 20, active: true, minOrder: 500, maxUses: 0, description: "20% off orders above ₹500" },
      { code: "GREEN15",  discount: 15, active: true, minOrder: 0,   maxUses: 0, description: "15% off — Gardening special" },
      { code: "FIRST25",  discount: 25, active: true, minOrder: 999, maxUses: 1, description: "25% off first order above ₹999" },
    ];

    let couponsCreated = 0;
    for (const coupon of defaultCoupons) {
      const existing = await Coupon.findOne({ code: coupon.code });
      if (!existing) { await Coupon.create(coupon); couponsCreated++; }
    }
    results.coupons = { created: couponsCreated };

    // ── 4. Products (seed all 22 from data/Product.ts) ───────────────────────
    let productsCreated = 0;
    let productsSkipped = 0;
    const productErrors: string[] = [];

    for (const sp of staticProducts) {
      try {
        // Map static category slug → MongoDB category ObjectId
        const categoryId = categoryMap[sp.category];
        if (!categoryId) {
          productErrors.push(`${sp.name}: unknown category "${sp.category}"`);
          continue;
        }

        const slugBase = sp.name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

        const existing = await Product.findOne({ sku: sp.sku });
        if (existing) { productsSkipped++; continue; }

        await Product.create({
          name:         sp.name,
          nameTa:       sp.nameTa,
          subtitle:     sp.subtitle,
          subtitleTa:   sp.subtitleTa,
          slug:         `${slugBase}-${Date.now()}`,
          description:  sp.description,
          highlights:   sp.highlights,
          howToUse:     sp.howToUse,
          price:        sp.price,
          originalPrice: sp.originalPrice,
          badge:        sp.badge,
          categoryId,
          images:       sp.images,
          rating:       sp.rating,
          reviews:      sp.reviews,
          weights:      sp.weights,
          sku:          sp.sku,
          stock:        50,          // default starting stock
          inStock:      true,
          active:       true,
          deliveryDays: sp.deliveryDays,
        });
        productsCreated++;
      } catch (err: any) {
        productErrors.push(`${sp.name}: ${err.message}`);
      }
    }

    results.products = {
      created: productsCreated,
      skipped: productsSkipped,
      errors:  productErrors,
    };

    // ── 5. Done ───────────────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      results,
      nextSteps: {
        step1: `Login at /admin/login`,
        step2: `Email: ${process.env.ADMIN_EMAIL ?? "admin@kavin-organics.com"}`,
        step3: `Password: ${process.env.ADMIN_DEFAULT_PASSWORD ?? "admin123"}`,
        step4: "Change your password immediately after first login!",
        step5: "Replace product images (Pinterest URLs) with Cloudinary uploads via Admin → Products",
        step6: "Disable ALLOW_SEED env var after seeding is complete",
      },
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}