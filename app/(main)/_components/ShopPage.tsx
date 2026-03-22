"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, SlidersHorizontal, X, ChevronDown, ChevronUp, Star } from "lucide-react";
import { useCart } from "../_context/CartContext";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = [
  { id: "all", label: "All Products" },
  { id: "seeds", label: "Seeds" },
  { id: "pots", label: "Pots" },
  { id: "fertilizers", label: "Fertilizers" },
  { id: "grow-bags", label: "Grow Bags" },
  { id: "coco-peats", label: "Coco Peats" },
  { id: "tools", label: "Garden Tools" },
];

const products: Product[] = [
  // Seeds
  { id: 1, name: "Tomato Seeds", subtitle: "Pack of 50 seeds", price: 149, badge: "Best Seller", category: "seeds", image: "https://images.unsplash.com/photo-1592919505780-303950717480?w=600&auto=format&fit=crop&q=80", rating: 5, reviews: 128 },
  { id: 2, name: "Spinach Seeds", subtitle: "Easy to grow at home", price: 89, badge: "New", category: "seeds", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80", rating: 4, reviews: 64 },
  { id: 3, name: "Chilli Seeds", subtitle: "Pack of 30 seeds", price: 99, originalPrice: 129, badge: "Sale", category: "seeds", image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=600&auto=format&fit=crop&q=80", rating: 4, reviews: 87 },
  { id: 4, name: "Coriander Seeds", subtitle: "Pack of 100 seeds", price: 59, category: "seeds", image: "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=600&auto=format&fit=crop&q=80", rating: 5, reviews: 203 },
  { id: 5, name: "Marigold Seeds", subtitle: "Vibrant flowering variety", price: 79, badge: "Popular", category: "seeds", image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80", rating: 4, reviews: 56 },
  { id: 6, name: "Basil Seeds", subtitle: "Aromatic herb seeds", price: 69, badge: "New", category: "seeds", image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&auto=format&fit=crop&q=80", rating: 5, reviews: 91 },
  // Pots
  { id: 7, name: "Terracotta Pot", subtitle: "8 inch — handcrafted", price: 249, badge: "Best Seller", category: "pots", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&auto=format&fit=crop&q=80", rating: 5, reviews: 176 },
  { id: 8, name: "Ceramic Pot Set", subtitle: "Set of 3 — white finish", price: 599, originalPrice: 799, badge: "Sale", category: "pots", image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=80", rating: 4, reviews: 43 },
  { id: 9, name: "Hanging Planter", subtitle: "Macramé with plastic pot", price: 349, badge: "New", category: "pots", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80", rating: 4, reviews: 38 },
  { id: 10, name: "Clay Plant Pot", subtitle: "6 inch — indoor garden", price: 179, badge: "Popular", category: "pots", image: "https://images.unsplash.com/photo-1616627455680-0e60e2c3f5f5?w=600&auto=format&fit=crop&q=80", rating: 5, reviews: 112 },
  // Fertilizers
  { id: 11, name: "Vermicompost", subtitle: "5 kg — organic", price: 299, badge: "Best Seller", category: "fertilizers", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80", rating: 5, reviews: 241 },
  { id: 12, name: "Neem Cake Powder", subtitle: "1 kg — natural pest repellent", price: 199, badge: "Organic", category: "fertilizers", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80", rating: 5, reviews: 158 },
  { id: 13, name: "Seaweed Liquid", subtitle: "500ml concentrate", price: 249, badge: "New", category: "fertilizers", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80", rating: 4, reviews: 29 },
  { id: 14, name: "Bone Meal Powder", subtitle: "2 kg — slow release", price: 179, originalPrice: 219, badge: "Sale", category: "fertilizers", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80", rating: 4, reviews: 67 },
  // Grow Bags
  { id: 15, name: "Fabric Grow Bag", subtitle: "15 litre — set of 3", price: 299, badge: "Best Seller", category: "grow-bags", image: "https://images.unsplash.com/photo-1599685315640-89c0f88c3b4e?w=600&auto=format&fit=crop&q=80", rating: 5, reviews: 189 },
  { id: 16, name: "Large Grow Bag", subtitle: "40 litre — heavy duty", price: 199, badge: "Popular", category: "grow-bags", image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&auto=format&fit=crop&q=80", rating: 4, reviews: 74 },
  { id: 17, name: "UV Grow Bag Kit", subtitle: "Set of 5 — UV resistant", price: 449, badge: "New", category: "grow-bags", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80", rating: 4, reviews: 22 },
  // Coco Peats
  { id: 18, name: "Coco Peat Block", subtitle: "650g — expands to 8L", price: 129, badge: "Best Seller", category: "coco-peats", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0c?w=600&auto=format&fit=crop&q=80", rating: 5, reviews: 312 },
  { id: 19, name: "Coco Peat Powder", subtitle: "5 kg loose bag", price: 249, badge: "Popular", category: "coco-peats", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80", rating: 4, reviews: 98 },
  // Tools
  { id: 20, name: "Garden Water Spray", subtitle: "1L — adjustable nozzle", price: 199, badge: "Popular", category: "tools", image: "https://images.unsplash.com/photo-1615486366482-4b7a30d1f9b3?w=600&auto=format&fit=crop&q=80", rating: 4, reviews: 85 },
  { id: 21, name: "Trowel & Fork Set", subtitle: "Stainless steel — ergonomic", price: 349, badge: "New", category: "tools", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80", rating: 5, reviews: 47 },
  { id: 22, name: "Plant Starter Kit", subtitle: "Everything to begin", price: 599, badge: "Best Seller", category: "tools", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80", rating: 5, reviews: 134 },
];

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];


// ─── Star Rating ─────────────────────────────────────────────────────────────

const badgeColors: Record<string, string> = {
  "Best Seller": "bg-[#3d6b35] text-white",
  "New": "bg-[#1a6b8a] text-white",
  "Sale": "bg-[#c0392b] text-white",
  "Popular": "bg-[#7a5c1e] text-white",
  "Organic": "bg-[#5a8a2e] text-white",
};
 
const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={13} className={s <= rating ? "text-[#d4a017] fill-[#d4a017]" : "text-[#d0c8b8]"} />
      ))}
    </div>
    <span className="text-xs text-[#7a7a68]">({reviews})</span>
  </div>
);
// ─── Product Card ─────────────────────────────────────────────────────────────
// FIX: wrapped entire card in Link so clicking anywhere navigates to product page

export const ProductCard = ({ product }: { product: Product }) => {
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
 
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      variant: "Standard",
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      badge: product.badge,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };
 
  const inCart = isInCart(product.id);
 
  return (
    <Link
      href={`/shop/product/${product.id}`}
      className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#e8e0d0] hover:border-[#a8c890] hover:shadow-lg transition-all duration-300 group"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f5f0ea]">
        {product.badge && (
          <span className={`absolute top-3 left-3 z-10 text-xs font-bold px-3 py-1 rounded-full ${badgeColors[product.badge] ?? "bg-[#3d6b35] text-white"}`}>
            {product.badge}
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 z-10 bg-[#c0392b] text-white text-xs font-bold px-2 py-1 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
 
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#2a2a1e] leading-snug">{product.name}</h3>
          <p className="text-xs sm:text-sm text-[#7a7a68] mt-0.5">{product.subtitle}</p>
        </div>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg sm:text-xl font-black text-[#3d6b35]">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-[#a8a090] line-through">₹{product.originalPrice}</span>
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
        <button onClick={onClear} className="text-sm text-[#3d6b35] font-semibold hover:underline">
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div className="bg-white border border-[#e8e0d0] rounded-2xl overflow-hidden">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="w-full flex items-center justify-between px-4 py-4 text-base font-bold text-[#2a2a1e]"
        >
          Price Range
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
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-[#3d6b35] h-2 cursor-pointer"
            />
            <p className="text-xs text-[#7a7a68]">Drag to set maximum price</p>
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div className="bg-white border border-[#e8e0d0] rounded-2xl overflow-hidden">
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="w-full flex items-center justify-between px-4 py-4 text-base font-bold text-[#2a2a1e]"
        >
          Quick Filters
          {filterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {filterOpen && (
          <div className="px-4 pb-5 flex flex-col gap-3">
            {[
              { label: "On Sale", value: onlyOnSale, onChange: setOnlyOnSale },
              { label: "Organic Only", value: onlyOrganic, onChange: setOnlyOrganic },
            ].map(({ label, value, onChange }) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer group/check">
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${
                    value ? "bg-[#3d6b35] border-[#3d6b35]" : "border-[#d4c9a8] group-hover/check:border-[#3d6b35]"
                  }`}
                  onClick={() => onChange(!value)}
                >
                  {value && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-base text-[#3a3a2e] cursor-pointer select-none" onClick={() => onChange(!value)}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Need Help CTA */}
      <div className="bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl p-4">
        <p className="text-sm font-bold text-[#3d6b35] mb-1">Need advice?</p>
        <p className="text-xs text-[#5a5a48] mb-3">Our garden experts are here to help you choose the right products.</p>
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
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 800]);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const clearFilters = () => {
    setPriceRange([0, 800]);
    setOnlyOnSale(false);
    setOnlyOrganic(false);
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (onlyOnSale && !p.originalPrice) return false;
      if (onlyOrganic && p.badge !== "Organic" && p.category !== "fertilizers") return false;
      return true;
    });

    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "newest") result = [...result].filter((p) => p.badge === "New").concat(result.filter((p) => p.badge !== "New"));

    return result;
  }, [activeCategory, sort, priceRange, onlyOnSale, onlyOrganic]);

  const heroBg: Record<string, string> = {
    all: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1440&auto=format&fit=crop",
    seeds: "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1440&auto=format&fit=crop",
    pots: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=1440&auto=format&fit=crop",
    fertilizers: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1440&auto=format&fit=crop",
    "grow-bags": "https://images.unsplash.com/photo-1599685315640-89c0f88c3b4e?q=80&w=1440&auto=format&fit=crop",
    "coco-peats": "https://images.unsplash.com/photo-1614594975525-e45190c55d0c?q=80&w=1440&auto=format&fit=crop",
    tools: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1440&auto=format&fit=crop",
  };

  const heroLabel = categories.find((c) => c.id === activeCategory)?.label ?? "All Products";

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans">

      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden" style={{ height: "clamp(180px, 28vw, 320px)" }}>
        <img
          src={heroBg[activeCategory] ?? heroBg.all}
          alt={heroLabel}
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.05) 100%)" }}
        />
        <div className="absolute inset-0 flex flex-col justify-end pb-8 sm:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <p className="text-white/70 text-sm font-medium mb-1">
              Shop / <span className="text-white">{heroLabel}</span>
            </p>
            <h1
              className="text-white font-black font-outfit leading-none"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)" }}
            >
              {heroLabel}
            </h1>
            <p className="text-white/75 text-base sm:text-lg mt-2 font-medium">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs
          FIX: sticky offset changed from --header-height var to fixed 88px
          (header = ~56px nav + ~32px green help bar) */}
      <div className="bg-white border-b-2 border-[#e8e0d0] sticky top-[88px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <p className="text-base text-[#5a5a48]">
            Showing <span className="font-bold text-[#2a2a1e]">{filtered.length}</span> products
          </p>
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden flex items-center gap-2 bg-white border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3a3a2e] font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3a3a2e] font-semibold text-sm px-4 pr-10 py-2.5 rounded-xl outline-none cursor-pointer transition-colors"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a7a68] pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar — desktop only */}
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

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-5xl mb-4">🌱</span>
                <h3 className="text-xl font-bold text-[#2a2a1e] mb-2">No products found</h3>
                <p className="text-[#7a7a68] mb-5">Try adjusting your filters or browse a different category.</p>
                <button
                  onClick={clearFilters}
                  className="bg-[#3d6b35] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#335c2c] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
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