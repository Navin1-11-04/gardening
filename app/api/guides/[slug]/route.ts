// app/api/guides/[slug]/route.ts
// GET: fetch a single guide article by slug (DB first, static fallback)

import { NextRequest, NextResponse } from "next/server";

// Static article data for the sample article (used as fallback)
const sampleArticle = {
  slug: "beginners-guide-to-home-gardening",
  title: "The Complete Beginner's Guide to Home Gardening",
  excerpt: "New to gardening? This simple guide covers everything you need to know.",
  category: "For Beginners",
  categoryHref: "/guides?cat=beginners",
  readTime: 8,
  date: "12 March 2025",
  author: "Rajan M.",
  authorRole: "Horticulture Advisor, Kavin Organics",
  heroImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop",
  intro: "Growing your own vegetables, herbs, and flowers at home is one of the most rewarding things you can do. It's also much easier than most people think. Whether you have a large terrace, a small balcony, or just a sunny windowsill — you can start gardening today.",
  sections: [
    {
      id: "what-you-need",
      heading: "What You Need to Get Started",
      content: [
        "The good news is that you don't need much to start your home garden. Many people think gardening requires expensive tools or a large space, but that is simply not true.",
        "Here is everything a beginner needs to get started:",
      ],
      list: [
        "Seeds or seedlings of the plants you want to grow",
        "Pots or grow bags (any size from 6 inches upward)",
        "Potting mix or cocopeat with some compost",
        "A small watering can or spray bottle",
        "A sunny spot — at least 4 to 6 hours of sunlight daily",
      ],
      tip: "Start small. Choose just 2 or 3 plants for your first garden. This makes it easy to manage and builds your confidence before you expand.",
    },
    {
      id: "choosing-plants",
      heading: "Choosing the Right Plants to Start With",
      content: [
        "The most important thing for a beginner is to start with easy-to-grow plants. Some plants need very specific conditions to thrive, while others grow happily with basic care.",
      ],
      list: [
        "Tomatoes — fast-growing, rewarding, and perfect for pots",
        "Chillies — almost impossible to kill, very productive",
        "Spinach and methi — ready to harvest in 3 weeks",
        "Coriander — great for beginners, keeps regrowing after cutting",
        "Basil — grows easily on a sunny windowsill",
        "Marigolds — beautiful and keep pests away naturally",
      ],
      tip: "Choose vegetables your family already eats. You'll be more motivated to care for plants when you're growing food you love.",
    },
    {
      id: "watering",
      heading: "How to Water Your Plants",
      content: [
        "Overwatering is the number one mistake that beginners make. More plants die from too much water than too little.",
        "The simple test: push your finger about 1 inch into the soil. If the soil feels damp, don't water yet. If it feels dry, it's time to water.",
      ],
      tip: "Water in the morning — this gives leaves time to dry before evening and reduces the risk of fungal disease.",
    },
  ],
  relatedSlugs: ["how-to-grow-tomatoes-at-home", "balcony-gardening-guide", "what-is-cocopeat-and-how-to-use-it"],
};

// Category display name map
const categoryNames: Record<string, string> = {
  beginners: "For Beginners",
  vegetables: "Vegetables",
  flowers: "Flowers & Herbs",
  soil: "Soil & Fertilizers",
  balcony: "Balcony Gardening",
  tips: "Care Tips",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Guide }     = await import("@/models/Guide");
    await connectDB();

    const guide = await Guide.findOne({ slug, active: true }).lean();

    if (guide) {
      const g = guide as any;
      return NextResponse.json({
        slug:        g.slug,
        title:       g.title,
        excerpt:     g.excerpt,
        category:    categoryNames[g.category] ?? g.category,
        categoryHref:`/guides?cat=${g.category}`,
        readTime:    g.readTime,
        date:        g.date,
        author:      g.author,
        authorRole:  g.authorRole,
        heroImage:   g.heroImage,
        intro:       g.intro,
        sections:    g.sections ?? [],
        relatedSlugs:g.relatedSlugs ?? [],
      });
    }

    // Static fallback — return the sample article for any slug
    // (so existing links don't 404 before DB is populated)
    if (slug === sampleArticle.slug) {
      return NextResponse.json(sampleArticle);
    }

    // For other slugs, return a minimal article with a note
    return NextResponse.json({
      ...sampleArticle,
      slug,
      title: "Article coming soon",
      intro: "This gardening guide will be available soon. In the meantime, browse our other guides or call us for advice.",
      sections: [],
    });
  } catch {
    return NextResponse.json(sampleArticle);
  }
}