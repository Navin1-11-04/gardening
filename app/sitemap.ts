// app/sitemap.ts
// Auto-generates sitemap.xml for Google indexing.

import { MetadataRoute } from "next";
import { products as staticProducts } from "@/data/Product";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://kavinorganics.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/shop`,      changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/guides`,    changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/about`,     changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`,   changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`,       changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/shipping`,  changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/returns`,   changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`,   changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Product pages — try DB first, fall back to static
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Product } = await import("@/models/Product");
    await connectDB();
    const dbProducts = await Product.find({ active: true }).select("_id updatedAt").lean();

    if (dbProducts.length > 0) {
      productPages = dbProducts.map((p: any) => ({
        url:             `${BASE_URL}/shop/product/${p._id.toString()}`,
        lastModified:    p.updatedAt,
        changeFrequency: "weekly" as const,
        priority:        0.8,
      }));
    } else {
      throw new Error("No DB products");
    }
  } catch {
    productPages = staticProducts.map((p) => ({
      url:             `${BASE_URL}/shop/product/${p.id}`,
      changeFrequency: "weekly" as const,
      priority:        0.8,
    }));
  }

  // Guide pages
  const guideSlugs = [
    "beginners-guide-to-home-gardening",
    "how-to-grow-tomatoes-at-home",
    "balcony-gardening-guide",
    "what-is-cocopeat-and-how-to-use-it",
    "growing-chillies-at-home",
    "organic-fertilizers-for-home-gardens",
    "growing-marigolds-and-herbs",
    "watering-your-plants-correctly",
    "choosing-the-right-pot-for-your-plant",
    "spinach-and-leafy-greens-guide",
    "terrace-gardening-tips",
    "composting-at-home",
  ];

  const guidePages: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url:             `${BASE_URL}/guides/${slug}`,
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }));

  return [...staticPages, ...productPages, ...guidePages];
}