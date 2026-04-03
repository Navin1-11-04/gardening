"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Loader2,
  Search,
} from "lucide-react";
import { useCart } from "../_context/CartContext";
import { Product } from "@/data/Product";

// ─── Constants ────────────────────────────────────────────────────────────────

const categories = [
  { id: "all", label: "All Products" },
  { id: "seeds", label: "Seeds" },
  { id: "pots", label: "Pots" },
  { id: "fertilizers", label: "Fertilizers" },
  { id: "grow-bags", label: "Grow Bags" },
  { id: "coco-peats", label: "Coco Peats" },
  { id: "tools", label: "Garden Tools" },
];

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

const badgeColors: Record<string, string> = {
  "Best Seller": "bg-[#3d6b35] text-white",
  New: "bg-[#1a6b8a] text-white",
  Sale: "bg-[#c0392b] text-white",
  Popular: "bg-[#7a5c1e] text-white",
  Organic: "bg-[#5a8a2e] text-white",
};

const heroBg: Record<string, string> = {
  all: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1440&auto=format&fit=crop",
  seeds:
    "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1440&auto=format&fit=crop",
  pots: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=1440&auto=format&fit=crop",
  fertilizers:
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1440&auto=format&fit=crop",
  "grow-bags":
    "https://images.unsplash.com/photo-1599685315640-89c0f88c3b4e?q=80&w=1440&auto=format&fit=crop",
  "coco-peats":
    "https://images.unsplash.com/photo-1614594975525-e45190c55d0c?q=80&w=1440&auto=format&fit=crop",
  tools:
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1440&auto=format&fit=crop",
};

// ─── Highlight matching text ──────────────────────────────────────────────────

const Highlight = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-[#fff3b0] text-[#2a2a1e] rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

// ─── Star Rating ─────────────────────────────────────────────────────────────

const StarRating = ({
  rating,
  reviews,
}: {
  rating: number;
  reviews: number;
}) => (
  <div className="flex items-center gap-1.5">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={
            s <= rating ? "text-[#d4a017] fill-[#d4a017]" : "text-[#d0c8b8]"
          }
        />
      ))}
    </div>
    <span className="text-xs text-[#7a7a68]">({reviews})</span>
  </div>
);

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCard = ({
  product,
  searchQuery,
}: {
  product: Product;
  searchQuery: string;
}) => {
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = isInCart(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      variant: product.weights[0] ?? "Standard",
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      badge: product.badge,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <Link
      href={`/shop/product/${product.id}`}
      className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#e8e0d0] hover:border-[#a8c890] hover:shadow-lg transition-all duration-300 group"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f5f0ea]">
        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 text-xs font-bold px-3 py-1 rounded-full ${badgeColors[product.badge] ?? "bg-[#3d6b35] text-white"}`}
          >
            {product.badge}
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 z-10 bg-[#c0392b] text-white text-xs font-bold px-2 py-1 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#2a2a1e] leading-snug">
            <Highlight text={product.name} query={searchQuery} />
          </h3>
          <p className="text-xs sm:text-sm text-[#7a7a68] mt-0.5">
            <Highlight text={product.subtitle} query={searchQuery} />
          </p>
        </div>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg sm:text-xl font-black text-[#3d6b35]">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[#a8a090] line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
        <button
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-2 font-bold text-sm py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
            justAdded
              ? "bg-[#3d6b35] text-white"
              : inCart
                ? "bg-[#eef5ea] text-[#3d6b35] border-2 border-[#3d6b35]"
                : "bg-[#eef5ea] hover:bg-[#3d6b35] text-[#3d6b35] hover:text-white border-2 border-[#b8d4a0] hover:border-[#3d6b35]"
          }`}
        >
          <ShoppingCart size={16} />
          {justAdded ? "Added!" : inCart ? "In Cart ✓" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#e8e0d0] animate-pulse">
    <div className="aspect-square bg-[#f0ece4]" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-4 bg-[#f0ece4] rounded-lg w-3/4" />
      <div className="h-3 bg-[#f0ece4] rounded-lg w-1/2" />
      <div className="h-6 bg-[#f0ece4] rounded-lg w-1/3 mt-auto" />
      <div className="h-9 bg-[#f0ece4] rounded-xl" />
    </div>
  </div>
);

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

const FilterSidebar = ({
  priceRange,
  setPriceRange,
  onlyOnSale,
  setOnlyOnSale,
  onlyOrganic,
  setOnlyOrganic,
  onClear,
}: {
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  onlyOnSale: boolean;
  setOnlyOnSale: (v: boolean) => void;
  onlyOrganic: boolean;
  setOnlyOrganic: (v: boolean) => void;
  onClear: () => void;
}) => {
  const [priceOpen, setPriceOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(true);

  return (
    <aside className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#2a2a1e]">Filters</h2>
        <button
          onClick={onClear}
          className="text-sm text-[#3d6b35] font-semibold hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="bg-white border border-[#e8e0d0] rounded-2xl overflow-hidden">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="w-full flex items-center justify-between px-4 py-4 text-base font-bold text-[#2a2a1e]"
        >
          Price Range{" "}
          {priceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {priceOpen && (
          <div className="px-4 pb-5 flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm text-[#5a5a48]">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={800}
              step={10}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-full accent-[#3d6b35] h-2 cursor-pointer"
            />
            <p className="text-xs text-[#7a7a68]">Drag to set maximum price</p>
          </div>
        )}
      </div>

      <div className="bg-white border border-[#e8e0d0] rounded-2xl overflow-hidden">
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="w-full flex items-center justify-between px-4 py-4 text-base font-bold text-[#2a2a1e]"
        >
          Quick Filters{" "}
          {filterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {filterOpen && (
          <div className="px-4 pb-5 flex flex-col gap-3">
            {[
              { label: "On Sale", value: onlyOnSale, onChange: setOnlyOnSale },
              {
                label: "Organic Only",
                value: onlyOrganic,
                onChange: setOnlyOrganic,
              },
            ].map(({ label, value, onChange }) => (
              <label
                key={label}
                className="flex items-center gap-3 cursor-pointer group/check"
              >
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${
                    value
                      ? "bg-[#3d6b35] border-[#3d6b35]"
                      : "border-[#d4c9a8] group-hover/check:border-[#3d6b35]"
                  }`}
                  onClick={() => onChange(!value)}
                >
                  {value && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1 5l3.5 3.5L11 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className="text-base text-[#3a3a2e] cursor-pointer select-none"
                  onClick={() => onChange(!value)}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl p-4">
        <p className="text-sm font-bold text-[#3d6b35] mb-1">Need advice?</p>
        <p className="text-xs text-[#5a5a48] mb-3">
          Our garden experts can help you choose.
        </p>
        <a
          href="tel:+919876543210"
          className="flex items-center justify-center gap-2 bg-[#3d6b35] text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#335c2c] transition-colors"
        >
          📞 Call Us
        </a>
      </div>
    </aside>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 800]);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read ?cat= and ?q= from URL
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() ?? "";
  const catParam = searchParams.get("cat");

  useEffect(() => {
    if (catParam) setActiveCategory(catParam);
  }, [catParam]);

  // When a search query is present, reset category to "all"
  useEffect(() => {
    if (searchQuery) setActiveCategory("all");
  }, [searchQuery]);

  // Fetch all products once on mount
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    fetch("/api/products", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(true);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const clearFilters = () => {
    setPriceRange([0, 800]);
    setOnlyOnSale(false);
    setOnlyOrganic(false);
  };

  const clearSearch = () => {
    router.push("/shop");
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      // Search query — checks name, subtitle, description
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category filter (ignored when searching)
      if (!searchQuery && activeCategory !== "all" && p.category !== activeCategory)
        return false;

      // Price filter
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;

      // On sale
      if (onlyOnSale && !p.originalPrice) return false;

      // Organic
      if (onlyOrganic && p.badge !== "Organic" && p.category !== "fertilizers")
        return false;

      return true;
    });

    if (sort === "price-asc")
      result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "newest")
      result = [...result]
        .filter((p) => p.badge === "New")
        .concat(result.filter((p) => p.badge !== "New"));

    return result;
  }, [products, activeCategory, sort, priceRange, onlyOnSale, onlyOrganic, searchQuery]);

  const heroLabel = searchQuery
    ? `Search: "${searchQuery}"`
    : (categories.find((c) => c.id === activeCategory)?.label ?? "All Products");

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans">

      {/* Hero Banner */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(180px, 28vw, 320px)" }}
      >
        <img
          src={heroBg[activeCategory] ?? heroBg.all}
          alt={heroLabel}
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.05) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end pb-8 sm:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <p className="text-white/70 text-sm font-medium mb-1">
              {searchQuery ? (
                <>Shop / <span className="text-white">Search results</span></>
              ) : (
                <>Shop / <span className="text-white">{heroLabel}</span></>
              )}
            </p>
            <h1
              className="text-white font-black font-outfit leading-none"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
            >
              {searchQuery ? (
                <span className="flex items-center gap-3 flex-wrap">
                  <Search size={32} className="opacity-80" />
                  {heroLabel}
                </span>
              ) : heroLabel}
            </h1>
            <p className="text-white/75 text-base sm:text-lg mt-2 font-medium">
              {loading
                ? "Loading products…"
                : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} ${searchQuery ? "found" : "available"}`}
            </p>
          </div>
        </div>
      </div>

      {/* Search results banner (shown instead of category tabs when searching) */}
      {searchQuery ? (
        <div className="bg-white border-b-2 border-[#e8e0d0] sticky top-0 z-30 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-[#5a5a48]">
              <Search size={16} className="text-[#3d6b35]" />
              <span>
                Showing results for{" "}
                <span className="font-bold text-[#2a2a1e]">"{searchQuery}"</span>
              </span>
            </div>
            <button
              onClick={clearSearch}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#c0392b] hover:text-[#a0311e] bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors ml-auto"
            >
              <X size={14} />
              Clear search
            </button>
          </div>
        </div>
      ) : (
        /* Category Tabs */
        <div className="bg-white border-b-2 border-[#e8e0d0] sticky top-0 z-30 w-full">
          <div className="px-4 sm:px-6">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 px-4 sm:px-5 py-3 text-sm sm:text-base font-semibold rounded-xl transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? "bg-[#3d6b35] text-white shadow-sm"
                      : "text-[#5a5a48] hover:bg-[#eef5ea] hover:text-[#3d6b35]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-8">
            <p className="text-base font-bold text-red-700 mb-2">
              Couldn't load products
            </p>
            <p className="text-sm text-red-600 mb-4">
              Please check your connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#3d6b35] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#335c2c] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <p className="text-base text-[#5a5a48]">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-[#3d6b35]" />{" "}
                Loading…
              </span>
            ) : (
              <>
                Showing{" "}
                <span className="font-bold text-[#2a2a1e]">
                  {filtered.length}
                </span>{" "}
                product{filtered.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden flex items-center gap-2 bg-white border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3a3a2e] font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={18} /> Filters
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3a3a2e] font-semibold text-sm px-4 pr-10 py-2.5 rounded-xl outline-none cursor-pointer transition-colors"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a7a68] pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onlyOnSale={onlyOnSale}
              setOnlyOnSale={setOnlyOnSale}
              onlyOrganic={onlyOrganic}
              setOnlyOrganic={setOnlyOrganic}
              onClear={clearFilters}
            />
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-5xl mb-4">{searchQuery ? "🔍" : "🌱"}</span>
                <h3 className="text-xl font-bold text-[#2a2a1e] mb-2">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "No products found"}
                </h3>
                <p className="text-[#7a7a68] mb-5 max-w-xs">
                  {searchQuery
                    ? "Try a different word, or browse all products."
                    : "Try adjusting your filters or browse a different category."}
                </p>
                <div className="flex gap-3 flex-wrap justify-center">
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="bg-[#3d6b35] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#335c2c] transition-colors"
                    >
                      Browse All Products
                    </button>
                  )}
                  <button
                    onClick={clearFilters}
                    className="bg-white border-2 border-[#d4c9a8] text-[#5a5a48] font-bold px-6 py-3 rounded-xl hover:border-[#3d6b35] hover:text-[#3d6b35] transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#faf7f2] rounded-t-3xl p-5 max-h-[80dvh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#2a2a1e]">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-10 h-10 rounded-xl bg-white border border-[#e8e0d0] flex items-center justify-center"
              >
                <X size={20} className="text-[#5a5a48]" />
              </button>
            </div>
            <FilterSidebar
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onlyOnSale={onlyOnSale}
              setOnlyOnSale={setOnlyOnSale}
              onlyOrganic={onlyOrganic}
              setOnlyOrganic={setOnlyOrganic}
              onClear={clearFilters}
            />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-4 bg-[#3d6b35] text-white font-bold text-base py-4 rounded-xl hover:bg-[#335c2c] transition-colors"
            >
              Show {filtered.length} Products
            </button>
          </div>
        </>
      )}
    </div>
  );
}