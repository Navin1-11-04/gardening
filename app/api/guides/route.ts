// app/api/guides/route.ts
// GET: list all active guides (for GuidesPage)
// Falls back to static data if DB unavailable

import { NextResponse } from "next/server";

// Static fallback data matching the existing GuidesPage articles
const staticGuides = [
  {
    id: "1", slug: "beginners-guide-to-home-gardening", title: "The Complete Beginner's Guide to Home Gardening",
    excerpt: "New to gardening? This simple guide covers everything you need to know — from choosing your first seeds to harvesting your first vegetables.",
    category: "beginners", readTime: 8, date: "12 Mar 2025",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
    featured: true, tag: "Most Popular",
  },
  {
    id: "2", slug: "how-to-grow-tomatoes-at-home", title: "How to Grow Tomatoes at Home — Step by Step",
    excerpt: "Tomatoes are one of the most rewarding vegetables to grow at home. Learn how to plant, water, and care for your tomato plants.",
    category: "vegetables", readTime: 6, date: "5 Mar 2025",
    image: "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=800&auto=format&fit=crop",
    featured: false, tag: "Easy to Grow",
  },
  {
    id: "3", slug: "balcony-gardening-guide", title: "Balcony Gardening: Grow Food in Small Spaces",
    excerpt: "You don't need a big garden to grow your own food. This guide shows how to set up a productive balcony garden.",
    category: "balcony", readTime: 7, date: "28 Feb 2025",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop",
    featured: false, tag: "Small Spaces",
  },
  {
    id: "4", slug: "what-is-cocopeat-and-how-to-use-it", title: "What is Cocopeat and Why Every Gardener Needs It",
    excerpt: "Cocopeat is one of the best growing mediums for home gardens. Discover what it is and how to use it properly.",
    category: "soil", readTime: 5, date: "20 Feb 2025",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0c?q=80&w=800&auto=format&fit=crop",
    featured: false, tag: "Must Read",
  },
  {
    id: "5", slug: "growing-chillies-at-home", title: "Growing Chillies at Home: A Simple Guide",
    excerpt: "Chillies are fast-growing, easy to maintain, and incredibly rewarding. Everything from seed to harvest.",
    category: "vegetables", readTime: 5, date: "14 Feb 2025",
    image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=800&auto=format&fit=crop",
    featured: false, tag: undefined,
  },
  {
    id: "6", slug: "organic-fertilizers-for-home-gardens", title: "Best Organic Fertilizers for Your Home Garden",
    excerpt: "Learn about the best organic options — vermicompost, neem cake powder, and seaweed liquid — and how to use each one.",
    category: "soil", readTime: 6, date: "7 Feb 2025",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop",
    featured: false, tag: "Organic",
  },
  {
    id: "7", slug: "growing-marigolds-and-herbs", title: "Marigolds & Herbs: Beautiful and Useful Plants",
    excerpt: "Marigolds brighten up your garden and repel pests naturally. Herbs like basil, coriander, and mint are easy to grow.",
    category: "flowers", readTime: 5, date: "1 Feb 2025",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop",
    featured: false, tag: undefined,
  },
  {
    id: "8", slug: "watering-your-plants-correctly", title: "How to Water Your Plants the Right Way",
    excerpt: "Overwatering is the most common mistake. This guide explains when to water and how much.",
    category: "tips", readTime: 4, date: "24 Jan 2025",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
    featured: false, tag: undefined,
  },
  {
    id: "9", slug: "choosing-the-right-pot-for-your-plant", title: "How to Choose the Right Pot for Your Plant",
    excerpt: "The size and type of pot you use can make a big difference. Terracotta, ceramic, plastic pots, and fabric grow bags explained.",
    category: "beginners", readTime: 5, date: "17 Jan 2025",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=800&auto=format&fit=crop",
    featured: false, tag: undefined,
  },
  {
    id: "10", slug: "spinach-and-leafy-greens-guide", title: "Grow Spinach and Leafy Greens at Home",
    excerpt: "Spinach and other leafy greens are among the easiest vegetables to grow — ready in as little as 3 weeks.",
    category: "vegetables", readTime: 4, date: "10 Jan 2025",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=800&auto=format&fit=crop",
    featured: false, tag: "Quick Harvest",
  },
  {
    id: "11", slug: "terrace-gardening-tips", title: "Terrace Gardening: Make the Most of Your Rooftop",
    excerpt: "A terrace is one of the best spaces for gardening in India. Learn how to plan your terrace garden.",
    category: "balcony", readTime: 7, date: "3 Jan 2025",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
    featured: false, tag: undefined,
  },
  {
    id: "12", slug: "composting-at-home", title: "Easy Home Composting for Beginners",
    excerpt: "Turn your kitchen and garden waste into rich compost for free. No expensive equipment needed.",
    category: "soil", readTime: 6, date: "27 Dec 2024",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
    featured: false, tag: "Free Method",
  },
];

export async function GET() {
  try {
    const { connectDB } = await import("@/lib/mongodb");
    const { Guide }     = await import("@/models/Guide");
    await connectDB();

    const guides = await Guide.find({ active: true })
      .sort({ featured: -1, createdAt: -1 })
      .select("slug title excerpt category tag readTime date heroImage featured")
      .lean();

    if (guides.length > 0) {
      return NextResponse.json(
        guides.map((g: any) => ({
          id:       g._id.toString(),
          slug:     g.slug,
          title:    g.title,
          excerpt:  g.excerpt,
          category: g.category,
          tag:      g.tag,
          readTime: g.readTime,
          date:     g.date,
          image:    g.heroImage,
          featured: g.featured,
        }))
      );
    }
    // Fall back to static if DB is empty
    return NextResponse.json(staticGuides);
  } catch {
    return NextResponse.json(staticGuides);
  }
}