"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Clock,
  Calendar,
  Phone,
  Leaf,
  ChevronUp,
  BookOpen,
  Share2,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Section {
  id: string;
  heading: string;
  content: string[];
  tip?: string;
  image?: string;
  imageAlt?: string;
  list?: string[];
}

interface GuideArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryHref: string;
  readTime: number;
  date: string;
  author: string;
  authorRole: string;
  heroImage: string;
  intro: string;
  sections: Section[];
  relatedSlugs: string[];
}

// ─── Mock article data (in real app, fetched by slug from CMS/DB) ─────────────

const sampleArticle: GuideArticle = {
  slug: "beginners-guide-to-home-gardening",
  title: "The Complete Beginner's Guide to Home Gardening",
  excerpt: "New to gardening? This simple guide covers everything you need to know — from choosing your first seeds to harvesting your first vegetables.",
  category: "For Beginners",
  categoryHref: "/guides?cat=beginners",
  readTime: 8,
  date: "12 March 2025",
  author: "Rajan M.",
  authorRole: "Horticulture Advisor, Kavin Organics",
  heroImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop",
  intro: "Growing your own vegetables, herbs, and flowers at home is one of the most rewarding things you can do. It's also much easier than most people think. Whether you have a large terrace, a small balcony, or just a sunny windowsill — you can start gardening today. This guide will walk you through everything you need to know, step by step.",
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
        "A little patience and curiosity!",
      ],
      tip: "Start small. Choose just 2 or 3 plants for your first garden. This makes it easy to manage and builds your confidence before you expand.",
    },
    {
      id: "choosing-plants",
      heading: "Choosing the Right Plants to Start With",
      content: [
        "The most important thing for a beginner is to start with easy-to-grow plants. Some plants need very specific conditions to thrive, while others grow happily with basic care.",
        "The best plants for first-time gardeners in India are ones that grow quickly, produce a lot, and are forgiving if you make small mistakes.",
      ],
      image: "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Easy-to-grow tomatoes for beginners",
      list: [
        "Tomatoes — fast-growing, rewarding, and perfect for pots",
        "Chillies — almost impossible to kill, very productive",
        "Spinach and methi (fenugreek) — ready to harvest in 3 weeks",
        "Coriander — great for beginners, keeps regrowing after cutting",
        "Basil — grows easily on a sunny windowsill",
        "Marigolds — beautiful and keep pests away naturally",
      ],
      tip: "Choose vegetables your family already eats. You'll be more motivated to care for plants when you're growing food you love.",
    },
    {
      id: "soil-and-pots",
      heading: "Choosing Your Soil and Pots",
      content: [
        "Good soil is the most important ingredient for a healthy garden. Regular garden soil from outside is usually too hard and heavy for pots — it doesn't drain water properly and can suffocate roots.",
        "The best growing medium for pots and grow bags is a mix of cocopeat, compost, and a small amount of perlite or river sand. This mix is light, drains well, and provides good nutrition.",
      ],
      list: [
        "Cocopeat: Light, holds moisture, good for roots. Use as the base of your mix.",
        "Vermicompost or compost: Provides nutrition. Mix about 20–30% into your cocopeat.",
        "Perlite or river sand: Improves drainage. Add a small handful per pot.",
      ],
      tip: "For pots, always choose containers with drainage holes at the bottom. Without drainage, roots will sit in water and rot — the most common reason plants die.",
    },
    {
      id: "watering",
      heading: "How to Water Your Plants",
      content: [
        "Overwatering is the number one mistake that beginners make. More plants die from too much water than too little. The good news is that it's easy to avoid once you know what to look for.",
        "The simple test: push your finger about 1 inch into the soil. If the soil feels damp, don't water yet. If it feels dry, it's time to water.",
      ],
      list: [
        "Water in the morning — this gives leaves time to dry before evening",
        "Water the soil, not the leaves — wet leaves can encourage fungal disease",
        "Small pots dry out faster than large ones and need more frequent watering",
        "In summer, you may need to water every day. In cooler months, every 2–3 days.",
        "Grow bags dry out faster than plastic pots — check them more often",
      ],
      tip: "Use a watering can with a rose head (the sprinkler attachment) for gentle watering. A strong jet of water can disturb seeds and damage young plants.",
    },
    {
      id: "feeding",
      heading: "Feeding Your Plants",
      content: [
        "Plants need nutrients to grow well, just like we need food. In pots, nutrients in the soil get used up over time, so you need to add them back in.",
        "For beginners, the easiest and safest option is organic fertilizer. It releases nutrients slowly, is hard to overdose, and is completely safe for vegetables and herbs.",
      ],
      list: [
        "Vermicompost: Add a handful to each pot once a month. Mix it into the top layer of soil.",
        "Neem cake powder: Sprinkle a teaspoon around each plant monthly. Also helps prevent pests.",
        "Seaweed liquid: Dilute with water and apply every 2–3 weeks for flowering and fruiting plants.",
      ],
      tip: "Don't over-fertilise. Too much fertilizer — even organic — can burn roots and harm plants. A little, applied regularly, is much better than a lot applied all at once.",
    },
    {
      id: "sunlight",
      heading: "Getting Sunlight Right",
      content: [
        "Sunlight is the engine that powers your garden. Most vegetables need a minimum of 4 to 6 hours of direct sunlight daily to grow well. Fruit-bearing plants like tomatoes and chillies need 6 to 8 hours.",
        "Leafy greens like spinach and coriander can manage with 3 to 4 hours — making them ideal for shadier balconies.",
        "If your garden doesn't get enough direct sunlight, don't worry. Stick to leafy greens and herbs, which are much more shade-tolerant than fruiting vegetables.",
      ],
      tip: "Observe your balcony or terrace at different times of day before deciding where to place your pots. The best spots get direct sun from morning to noon.",
    },
    {
      id: "common-problems",
      heading: "Common Problems and How to Fix Them",
      content: [
        "Even experienced gardeners face problems. The key is to identify issues early and act quickly. Here are the most common problems beginners face and simple solutions.",
      ],
      list: [
        "Yellow leaves: Usually overwatering or lack of nutrients. Check soil moisture and add a little fertilizer.",
        "Wilting despite watering: Root rot from overwatering. Reduce watering and check drainage.",
        "Small holes in leaves: Insects. Spray with diluted neem oil solution once a week.",
        "Leggy, stretching plants: Not enough sunlight. Move to a sunnier spot.",
        "No flowers or fruit: Not enough sunlight or nutrients. Try seaweed liquid fertilizer.",
        "Slow germination: Seeds may be too old, or soil too wet/dry. Keep soil consistently moist but not soaked.",
      ],
      tip: "Take photos of your plants every week. This makes it easy to spot changes early and track your garden's progress over time.",
    },
    {
      id: "harvesting",
      heading: "Knowing When to Harvest",
      content: [
        "Harvesting at the right time is one of the most satisfying parts of gardening. Most plants give you clear signals when they're ready.",
        "The general rule: harvest regularly and early. Picking fruits and leaves frequently encourages the plant to produce more. Leaving ripe produce on the plant for too long can slow down production.",
      ],
      list: [
        "Leafy greens (spinach, coriander, methi): Harvest outer leaves when the plant is 3–4 inches tall",
        "Tomatoes: Pick when fully coloured and slightly soft to the touch",
        "Chillies: Harvest when full-sized, whether green or red — both are usable",
        "Basil: Pinch off leaves and growing tips regularly to keep the plant bushy",
        "Marigolds: Cut flowers as they open to encourage more blooms",
      ],
    },
  ],
  relatedSlugs: [
    "how-to-grow-tomatoes-at-home",
    "balcony-gardening-guide",
    "what-is-cocopeat-and-how-to-use-it",
    "watering-your-plants-correctly",
  ],
};

// Related article data (in real app, fetched by slug)
const relatedArticles = [
  {
    slug: "how-to-grow-tomatoes-at-home",
    title: "How to Grow Tomatoes at Home — Step by Step",
    category: "Vegetables",
    readTime: 6,
    image: "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=400&auto=format&fit=crop",
  },
  {
    slug: "balcony-gardening-guide",
    title: "Balcony Gardening: Grow Food in Small Spaces",
    category: "Balcony Gardening",
    readTime: 7,
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=400&auto=format&fit=crop",
  },
  {
    slug: "what-is-cocopeat-and-how-to-use-it",
    title: "What is Cocopeat and Why Every Gardener Needs It",
    category: "Soil & Fertilizers",
    readTime: 5,
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0c?q=80&w=400&auto=format&fit=crop",
  },
  {
    slug: "watering-your-plants-correctly",
    title: "How to Water Your Plants the Right Way",
    category: "Care Tips",
    readTime: 4,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop",
  },
];

// ─── Share Button ─────────────────────────────────────────────────────────────

const ShareButton = () => {
  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: sampleArticle.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-sm font-semibold text-[#5a5a48] hover:text-[#3d6b35] bg-white border border-[#e8e0d0] hover:border-[#3d6b35] px-4 py-2 rounded-xl transition-all"
    >
      {copied ? <Check size={15} className="text-[#3d6b35]" /> : <Share2 size={15} />}
      {copied ? "Link copied!" : "Share"}
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GuideArticlePage({ slug }: { slug: string }) {
  // In a real app: fetch article by slug. For now always show sample article.
  const article = sampleArticle;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm flex-wrap">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <Link href="/guides" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Guides</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium truncate max-w-[200px]">{article.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative w-full overflow-hidden" style={{ height: "clamp(240px, 38vw, 420px)" }}>
        <Image
          src={article.heroImage}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end pb-8 sm:pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
            <Link
              href={article.categoryHref}
              className="inline-flex items-center gap-1.5 bg-[#3d6b35] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 hover:bg-[#335c2c] transition-colors"
            >
              <Leaf size={12} />
              {article.category}
            </Link>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-outfit text-white leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-white/75 text-sm">
                <Clock size={14} />
                {article.readTime} min read
              </span>
              <span className="flex items-center gap-1.5 text-white/75 text-sm">
                <Calendar size={14} />
                {article.date}
              </span>
              <span className="text-white/75 text-sm">By {article.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

          {/* ── LEFT: Table of Contents (sticky) ── */}
          <aside className="w-full lg:w-60 shrink-0 lg:sticky lg:top-28 order-2 lg:order-1">
            <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-[#3d6b35]" />
                <p className="text-sm font-bold text-[#2a2a1e] uppercase tracking-wide">In This Guide</p>
              </div>
              <div className="flex flex-col gap-1">
                {article.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-sm text-[#5a5a48] hover:text-[#3d6b35] py-2 px-3 rounded-lg hover:bg-[#eef5ea] transition-all leading-snug"
                  >
                    {s.heading}
                  </a>
                ))}
              </div>
            </div>

            {/* Phone CTA */}
            <div className="mt-4 bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl p-4">
              <p className="text-sm font-bold text-[#2a2a1e] mb-1">Questions?</p>
              <p className="text-xs text-[#5a5a48] mb-3 leading-snug">Our garden experts are happy to help you over the phone.</p>
              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-sm py-2.5 rounded-xl transition-colors"
              >
                <Phone size={15} />
                Call Us Free
              </a>
            </div>
          </aside>

          {/* ── RIGHT: Article body ── */}
          <div className="flex-1 min-w-0 order-1 lg:order-2">

            {/* Author + share row */}
            <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e8e0d0] flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#eef5ea] border-2 border-[#b8d4a0] flex items-center justify-center shrink-0">
                  <Leaf size={18} className="text-[#3d6b35]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2a2a1e]">{article.author}</p>
                  <p className="text-xs text-[#7a7a68]">{article.authorRole}</p>
                </div>
              </div>
              <ShareButton />
            </div>

            {/* Intro */}
            <p className="text-lg sm:text-xl text-[#3a3a2e] leading-relaxed mb-10 font-medium">
              {article.intro}
            </p>

            {/* Sections */}
            <div className="flex flex-col gap-10 sm:gap-14">
              {article.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="text-2xl sm:text-3xl font-bold font-outfit text-[#2a2a1e] mb-5 leading-snug">
                    {section.heading}
                  </h2>

                  {section.content.map((para, i) => (
                    <p key={i} className="text-base sm:text-lg text-[#3a3a2e] leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}

                  {section.image && (
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden my-6 border border-[#e8e0d0]">
                      <Image
                        src={section.image}
                        alt={section.imageAlt ?? section.heading}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {section.list && (
                    <ul className="flex flex-col gap-3 my-5">
                      {section.list.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#eef5ea] border border-[#b8d4a0] flex items-center justify-center shrink-0 mt-0.5">
                            <Leaf size={12} className="text-[#3d6b35]" />
                          </div>
                          <span className="text-base sm:text-lg text-[#3a3a2e] leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.tip && (
                    <div className="bg-[#fff8ee] border-l-4 border-[#d4a017] rounded-r-2xl px-5 py-4 mt-5">
                      <p className="text-sm font-bold text-[#7a5c1e] mb-1">💡 Tip</p>
                      <p className="text-base sm:text-lg text-[#7a5c1e] leading-relaxed">{section.tip}</p>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* End of article */}
            <div className="mt-12 pt-8 border-t border-[#e8e0d0]">
              <div className="bg-[#3d6b35] rounded-2xl p-6 sm:p-8 text-white">
                <p className="text-xl font-bold mb-2">Ready to start your garden?</p>
                <p className="text-white/75 text-base mb-5 leading-relaxed max-w-xl">
                  Browse our range of quality seeds, cocopeat, organic fertilizers, pots and more — everything you need to get growing today.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/shop" className="flex items-center justify-center gap-2 bg-white text-[#3d6b35] font-bold text-base px-6 py-3.5 rounded-xl hover:bg-[#f0f0f0] transition-colors">
                    <Leaf size={18} />
                    Shop Garden Supplies
                  </Link>
                  <a href="tel:+919876543210" className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-base px-6 py-3.5 rounded-xl transition-colors">
                    <Phone size={18} />
                    Call for Advice
                  </a>
                </div>
              </div>

              <button
                onClick={scrollToTop}
                className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#5a5a48] hover:text-[#3d6b35] transition-colors"
              >
                <ChevronUp size={16} />
                Back to top
              </button>
            </div>
          </div>
        </div>

        {/* Related guides */}
        <div className="mt-14 sm:mt-20 border-t border-[#e8e0d0] pt-10 sm:pt-14">
          <div className="mb-7">
            <p className="text-sm font-bold text-[#7a9e5f] uppercase tracking-wider mb-2">Keep Learning</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-outfit text-[#2a2a1e]">More Guides You Might Like</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/guides/${related.slug}`}
                className="flex flex-col bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden hover:border-[#a8c890] hover:shadow-md transition-all group"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#f0ece4]">
                  <Image
                    src={related.image}
                    alt={related.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <span className="text-xs font-bold text-[#3d6b35] bg-[#eef5ea] px-2.5 py-1 rounded-full w-fit">
                    {related.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#2a2a1e] leading-snug group-hover:text-[#3d6b35] transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#a8a090] mt-auto pt-1">
                    <Clock size={12} />
                    <span>{related.readTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 bg-white border-2 border-[#3d6b35] text-[#3d6b35] hover:bg-[#3d6b35] hover:text-white font-bold text-base px-8 py-4 rounded-xl transition-all"
            >
              <BookOpen size={18} />
              Browse All Guides →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}