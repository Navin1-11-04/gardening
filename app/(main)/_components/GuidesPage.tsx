"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Clock,
  Search,
  Leaf,
  BookOpen,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  date: string;
  image: string;
  featured?: boolean;
  tag?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const categories = [
  { id: "all", label: "All Guides" },
  { id: "beginners", label: "For Beginners" },
  { id: "vegetables", label: "Vegetables" },
  { id: "flowers", label: "Flowers & Herbs" },
  { id: "soil", label: "Soil & Fertilizers" },
  { id: "balcony", label: "Balcony Gardening" },
  { id: "tips", label: "Care Tips" },
];

const articles: Article[] = [
  {
    id: "1",
    slug: "beginners-guide-to-home-gardening",
    title: "The Complete Beginner's Guide to Home Gardening",
    excerpt:
      "New to gardening? This simple guide covers everything you need to know — from choosing your first seeds to harvesting your first vegetables. Perfect for those starting out on a balcony or terrace.",
    category: "beginners",
    readTime: 8,
    date: "12 Mar 2025",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
    featured: true,
    tag: "Most Popular",
  },
  {
    id: "2",
    slug: "how-to-grow-tomatoes-at-home",
    title: "How to Grow Tomatoes at Home — Step by Step",
    excerpt:
      "Tomatoes are one of the most rewarding vegetables to grow at home. Learn how to plant, water, and care for your tomato plants to get a bumper harvest, even on a small balcony.",
    category: "vegetables",
    readTime: 6,
    date: "5 Mar 2025",
    image: "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=800&auto=format&fit=crop",
    tag: "Easy to Grow",
  },
  {
    id: "3",
    slug: "balcony-gardening-guide",
    title: "Balcony Gardening: Grow Food in Small Spaces",
    excerpt:
      "You don't need a big garden to grow your own food. This guide shows how to set up a productive balcony garden using pots and grow bags — with tips on the best plants for small spaces.",
    category: "balcony",
    readTime: 7,
    date: "28 Feb 2025",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop",
    tag: "Small Spaces",
  },
  {
    id: "4",
    slug: "what-is-cocopeat-and-how-to-use-it",
    title: "What is Cocopeat and Why Every Gardener Needs It",
    excerpt:
      "Cocopeat is one of the best growing mediums for home gardens. Discover what it is, why it is so good for plants, and how to use it properly in pots, grow bags, and seed trays.",
    category: "soil",
    readTime: 5,
    date: "20 Feb 2025",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0c?q=80&w=800&auto=format&fit=crop",
    tag: "Must Read",
  },
  {
    id: "5",
    slug: "growing-chillies-at-home",
    title: "Growing Chillies at Home: A Simple Guide",
    excerpt:
      "Chillies are fast-growing, easy to maintain, and incredibly rewarding. This guide covers everything from seed germination to harvesting, with tips for keeping your chilli plants healthy.",
    category: "vegetables",
    readTime: 5,
    date: "14 Feb 2025",
    image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "6",
    slug: "organic-fertilizers-for-home-gardens",
    title: "Best Organic Fertilizers for Your Home Garden",
    excerpt:
      "Chemical fertilizers can harm your plants and soil over time. Learn about the best organic options — vermicompost, neem cake powder, and seaweed liquid — and how to use each one.",
    category: "soil",
    readTime: 6,
    date: "7 Feb 2025",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop",
    tag: "Organic",
  },
  {
    id: "7",
    slug: "growing-marigolds-and-herbs",
    title: "Marigolds & Herbs: Beautiful and Useful Plants",
    excerpt:
      "Marigolds brighten up your garden and repel pests naturally. Herbs like basil, coriander, and mint are easy to grow and incredibly useful in the kitchen. Learn how to grow both.",
    category: "flowers",
    readTime: 5,
    date: "1 Feb 2025",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "8",
    slug: "watering-your-plants-correctly",
    title: "How to Water Your Plants the Right Way",
    excerpt:
      "Overwatering is the most common mistake gardeners make. This guide explains when to water, how much to water, and how to tell if your plants are getting too much or too little.",
    category: "tips",
    readTime: 4,
    date: "24 Jan 2025",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "9",
    slug: "choosing-the-right-pot-for-your-plant",
    title: "How to Choose the Right Pot for Your Plant",
    excerpt:
      "The size and type of pot you use can make a big difference to how well your plants grow. This guide explains the difference between terracotta, ceramic, plastic pots, and fabric grow bags.",
    category: "beginners",
    readTime: 5,
    date: "17 Jan 2025",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "10",
    slug: "spinach-and-leafy-greens-guide",
    title: "Grow Spinach and Leafy Greens at Home",
    excerpt:
      "Spinach, methi, and other leafy greens are among the easiest vegetables to grow and can be harvested in as little as 3 weeks. Perfect for beginner gardeners with limited space.",
    category: "vegetables",
    readTime: 4,
    date: "10 Jan 2025",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=800&auto=format&fit=crop",
    tag: "Quick Harvest",
  },
  {
    id: "11",
    slug: "terrace-gardening-tips",
    title: "Terrace Gardening: Make the Most of Your Rooftop",
    excerpt:
      "A terrace is one of the best spaces for gardening in India. Learn how to plan your terrace garden, choose the right plants, and protect them from the harsh summer sun.",
    category: "balcony",
    readTime: 7,
    date: "3 Jan 2025",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "12",
    slug: "composting-at-home",
    title: "Easy Home Composting for Beginners",
    excerpt:
      "Turn your kitchen and garden waste into rich compost for free. This simple guide shows you how to start composting at home — no expensive equipment needed, just a bucket and some patience.",
    category: "soil",
    readTime: 6,
    date: "27 Dec 2024",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
    tag: "Free Method",
  },
];

// ─── Article Card ─────────────────────────────────────────────────────────────

const ArticleCard = ({ article }: { article: Article }) => (
  <Link
    href={`/guides/${article.slug}`}
    className="flex flex-col bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden hover:border-[#a8c890] hover:shadow-md transition-all duration-300 group"
  >
    {/* Image */}
    <div className="relative aspect-[16/9] overflow-hidden bg-[#f0ece4]">
      <Image
        src={article.image}
        alt={article.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {article.tag && (
        <span className="absolute top-3 left-3 bg-[#3d6b35] text-white text-xs font-bold px-3 py-1 rounded-full">
          {article.tag}
        </span>
      )}
      {/* Category pill */}
      <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
        {categories.find((c) => c.id === article.category)?.label ?? article.category}
      </span>
    </div>

    {/* Content */}
    <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
      <h3 className="text-base sm:text-lg font-bold text-[#2a2a1e] leading-snug group-hover:text-[#3d6b35] transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-sm sm:text-base text-[#5a5a48] leading-relaxed line-clamp-3">
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-1.5 text-xs text-[#a8a090]">
          <Clock size={13} />
          <span>{article.readTime} min read</span>
          <span className="mx-1">·</span>
          <span>{article.date}</span>
        </div>
        <span className="text-xs font-bold text-[#3d6b35] group-hover:underline underline-offset-2">
          Read →
        </span>
      </div>
    </div>
  </Link>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GuidesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const featured = articles.find((a) => a.featured);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles
      .filter((a) => !a.featured) // featured shown separately
      .filter((a) => activeCategory === "all" || a.category === activeCategory)
      .filter(
        (a) =>
          !q ||
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q)
      );
  }, [activeCategory, searchQuery]);

  const showFeatured =
    !searchQuery &&
    (activeCategory === "all" || featured?.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">Gardening Guides</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#3d6b35] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Free Gardening Guides</p>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit leading-tight mb-4">
            Grow with Confidence
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed mb-8">
            Simple, step-by-step gardening guides written for home gardeners. Whether you're a complete beginner or growing your tenth crop — we have something for you.
          </p>

          {/* Search */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 max-w-xl shadow-md">
            <Search size={22} className="text-[#7a9e5f] shrink-0" />
            <input
              type="text"
              placeholder="Search guides (e.g. tomatoes, watering, balcony)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveCategory("all");
              }}
              className="flex-1 bg-transparent outline-none text-base text-[#2a2a1e] placeholder:text-[#b0a890]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#a8a090] hover:text-[#3d6b35] shrink-0"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); }}
              className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id && !searchQuery
                  ? "bg-[#3d6b35] text-white shadow-sm"
                  : "bg-white border border-[#e8e0d0] text-[#5a5a48] hover:border-[#3d6b35] hover:text-[#3d6b35]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured article — large hero card */}
        {showFeatured && featured && (
          <div className="mb-10 sm:mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={16} className="text-[#3d6b35]" />
              <p className="text-sm font-bold text-[#3d6b35] uppercase tracking-wider">Featured Guide</p>
            </div>
            <Link
              href={`/guides/${featured.slug}`}
              className="flex flex-col sm:flex-row bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden hover:border-[#a8c890] hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative sm:w-[45%] aspect-[16/9] sm:aspect-auto overflow-hidden bg-[#f0ece4]">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                {featured.tag && (
                  <span className="absolute top-4 left-4 bg-[#3d6b35] text-white text-sm font-bold px-4 py-1.5 rounded-full">
                    {featured.tag}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3d6b35] bg-[#eef5ea] px-3 py-1 rounded-full w-fit">
                  {categories.find((c) => c.id === featured.category)?.label}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2a2a1e] leading-snug group-hover:text-[#3d6b35] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-base sm:text-lg text-[#5a5a48] leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 text-sm text-[#a8a090]">
                    <Clock size={15} />
                    <span>{featured.readTime} min read · {featured.date}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-[#3d6b35] text-white font-bold text-sm px-5 py-2.5 rounded-xl group-hover:bg-[#2e5228] transition-colors">
                    Read Guide →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Search result count */}
        {searchQuery && (
          <p className="text-base text-[#5a5a48] mb-6">
            <span className="font-bold text-[#2a2a1e]">{filtered.length}</span> guide{filtered.length !== 1 ? "s" : ""} found for "{searchQuery}"
          </p>
        )}

        {/* Article grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e8e0d0] p-10 text-center">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-[#2a2a1e] mb-2">No guides found</h3>
            <p className="text-base text-[#7a7a68] mb-6 max-w-sm mx-auto">
              We couldn't find a guide for "{searchQuery}". Try a different search or browse all guides.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="bg-[#3d6b35] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#335c2c] transition-colors"
            >
              Browse All Guides
            </button>
          </div>
        ) : (
          <>
            {!searchQuery && activeCategory !== "all" && (
              <p className="text-base text-[#5a5a48] mb-6">
                <span className="font-bold text-[#2a2a1e]">{filtered.length}</span> guide{filtered.length !== 1 ? "s" : ""} in this category
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        )}

        {/* Bottom CTA — nudge to shop or contact */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-[#3d6b35] rounded-2xl p-6 sm:p-8 text-white">
            <p className="text-xl font-bold mb-2">Ready to start growing?</p>
            <p className="text-white/75 text-base mb-5 leading-relaxed">
              Browse our range of quality seeds, pots, fertilizers and more — everything you need for your garden.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-[#3d6b35] font-bold text-base px-6 py-3 rounded-xl hover:bg-[#f0f0f0] transition-colors"
            >
              Shop Products →
            </Link>
          </div>

          <div className="bg-[#faf7f2] border-2 border-[#d4c9a8] rounded-2xl p-6 sm:p-8">
            <p className="text-xl font-bold text-[#2a2a1e] mb-2">Have a gardening question?</p>
            <p className="text-[#5a5a48] text-base mb-5 leading-relaxed">
              Our garden experts are happy to help you choose the right plants and products for your space.
            </p>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2 bg-[#3d6b35] text-white font-bold text-base px-6 py-3 rounded-xl hover:bg-[#335c2c] transition-colors"
            >
              📞 Call Us Free
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}