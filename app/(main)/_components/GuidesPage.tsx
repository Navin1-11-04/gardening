"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Clock, Search, Leaf, BookOpen, X } from "lucide-react";

interface Article {
  id: string; slug: string; title: string; excerpt: string;
  category: string; readTime: number; date: string; image: string;
  featured?: boolean; tag?: string;
}

const categories = [
  { id: "all",        label: "All Guides" },
  { id: "beginners",  label: "For Beginners" },
  { id: "vegetables", label: "Vegetables" },
  { id: "flowers",    label: "Flowers & Herbs" },
  { id: "soil",       label: "Soil & Fertilizers" },
  { id: "balcony",    label: "Balcony Gardening" },
  { id: "tips",       label: "Care Tips" },
];

const ArticleCard = ({ article }: { article: Article }) => (
  <Link
    href={`/guides/${article.slug}`}
    className="flex flex-col bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden hover:border-[#a8c890] hover:shadow-md transition-all duration-300 group"
  >
    <div className="relative aspect-[16/9] overflow-hidden bg-[#f0ece4]">
      <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
      {article.tag && (
        <span className="absolute top-3 left-3 bg-[#3d6b35] text-white text-xs font-bold px-3 py-1 rounded-full">{article.tag}</span>
      )}
      <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
        {categories.find((c) => c.id === article.category)?.label ?? article.category}
      </span>
    </div>
    <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
      <h3 className="text-base sm:text-lg font-bold text-[#2a2a1e] leading-snug group-hover:text-[#3d6b35] transition-colors line-clamp-2">{article.title}</h3>
      <p className="text-sm sm:text-base text-[#5a5a48] leading-relaxed line-clamp-3">{article.excerpt}</p>
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-1.5 text-xs text-[#a8a090]">
          <Clock size={13} /><span>{article.readTime} min read</span>
          <span className="mx-1">·</span><span>{article.date}</span>
        </div>
        <span className="text-xs font-bold text-[#3d6b35] group-hover:underline underline-offset-2">Read →</span>
      </div>
    </div>
  </Link>
);

const SkeletonCard = () => (
  <div className="flex flex-col bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden animate-pulse">
    <div className="aspect-[16/9] bg-[#f0ece4]" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-5 bg-[#f0ece4] rounded-lg w-3/4" />
      <div className="h-4 bg-[#f0ece4] rounded-lg w-full" />
      <div className="h-4 bg-[#f0ece4] rounded-lg w-2/3" />
    </div>
  </div>
);

export default function GuidesPage() {
  const [articles,        setArticles]        = useState<Article[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [activeCategory,  setActiveCategory]  = useState("all");
  const [searchQuery,     setSearchQuery]     = useState("");

  useEffect(() => {
    fetch("/api/guides")
      .then((r) => r.json())
      .then((data: Article[]) => { setArticles(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const featured = articles.find((a) => a.featured);
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles
      .filter((a) => !a.featured)
      .filter((a) => activeCategory === "all" || a.category === activeCategory)
      .filter((a) => !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
  }, [articles, activeCategory, searchQuery]);

  const showFeatured = !searchQuery && (activeCategory === "all" || featured?.category === activeCategory);

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
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><BookOpen size={20} className="text-white" /></div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Free Gardening Guides</p>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit leading-tight mb-4">Grow with Confidence</h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed mb-8">Simple, step-by-step gardening guides written for home gardeners in Tamil Nadu.</p>
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 max-w-xl shadow-md">
            <Search size={22} className="text-[#7a9e5f] shrink-0" />
            <input type="text" placeholder="Search guides (e.g. tomatoes, watering, balcony)..." value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setActiveCategory("all"); }}
              className="flex-1 bg-transparent outline-none text-base text-[#2a2a1e] placeholder:text-[#b0a890]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-[#a8a090] hover:text-[#3d6b35] shrink-0" aria-label="Clear search">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); }}
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

        {/* Featured article */}
        {showFeatured && featured && !loading && (
          <div className="mb-10 sm:mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={16} className="text-[#3d6b35]" />
              <p className="text-sm font-bold text-[#3d6b35] uppercase tracking-wider">Featured Guide</p>
            </div>
            <Link href={`/guides/${featured.slug}`}
              className="flex flex-col sm:flex-row bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden hover:border-[#a8c890] hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative sm:w-[45%] aspect-[16/9] sm:aspect-auto overflow-hidden bg-[#f0ece4]">
                <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" priority />
                {featured.tag && (
                  <span className="absolute top-4 left-4 bg-[#3d6b35] text-white text-sm font-bold px-4 py-1.5 rounded-full">{featured.tag}</span>
                )}
              </div>
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3d6b35] bg-[#eef5ea] px-3 py-1 rounded-full w-fit">
                  {categories.find((c) => c.id === featured.category)?.label}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2a2a1e] leading-snug group-hover:text-[#3d6b35] transition-colors">{featured.title}</h2>
                <p className="text-base sm:text-lg text-[#5a5a48] leading-relaxed line-clamp-3">{featured.excerpt}</p>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 text-sm text-[#a8a090]">
                    <Clock size={15} /><span>{featured.readTime} min read · {featured.date}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-[#3d6b35] text-white font-bold text-sm px-5 py-2.5 rounded-xl group-hover:bg-[#2e5228] transition-colors">Read Guide →</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Search count */}
        {searchQuery && !loading && (
          <p className="text-base text-[#5a5a48] mb-6">
            <span className="font-bold text-[#2a2a1e]">{filtered.length}</span> guide{filtered.length !== 1 ? "s" : ""} found for "{searchQuery}"
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e8e0d0] p-10 text-center">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-[#2a2a1e] mb-2">No guides found</h3>
            <p className="text-base text-[#7a7a68] mb-6 max-w-sm mx-auto">We couldn't find a guide for "{searchQuery}". Try a different search or browse all guides.</p>
            <button onClick={() => setSearchQuery("")} className="bg-[#3d6b35] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#335c2c] transition-colors">Browse All Guides</button>
          </div>
        ) : (
          <>
            {!searchQuery && activeCategory !== "all" && (
              <p className="text-base text-[#5a5a48] mb-6"><span className="font-bold text-[#2a2a1e]">{filtered.length}</span> guide{filtered.length !== 1 ? "s" : ""} in this category</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filtered.map((article) => <ArticleCard key={article.id} article={article} />)}
            </div>
          </>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-[#3d6b35] rounded-2xl p-6 sm:p-8 text-white">
            <p className="text-xl font-bold mb-2">Ready to start growing?</p>
            <p className="text-white/75 text-base mb-5 leading-relaxed">Browse our range of quality seeds, pots, fertilizers and more.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-[#3d6b35] font-bold text-base px-6 py-3 rounded-xl hover:bg-[#f0f0f0] transition-colors">Shop Products →</Link>
          </div>
          <div className="bg-[#faf7f2] border-2 border-[#d4c9a8] rounded-2xl p-6 sm:p-8">
            <p className="text-xl font-bold text-[#2a2a1e] mb-2">Have a gardening question?</p>
            <p className="text-[#5a5a48] text-base mb-5 leading-relaxed">Our garden experts are happy to help you choose the right plants for your space.</p>
            <a href="tel:+919876543210" className="inline-flex items-center gap-2 bg-[#3d6b35] text-white font-bold text-base px-6 py-3 rounded-xl hover:bg-[#335c2c] transition-colors">📞 Call Us Free</a>
          </div>
        </div>
      </div>
    </div>
  );
}