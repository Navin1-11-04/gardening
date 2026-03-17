"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  ChevronRight,
  Plus,
  Minus,
  Truck,
  RotateCcw,
  ShieldCheck,
  Phone,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface RelatedProduct {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  badge?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const product = {
  id: 1,
  name: "Premium Vermicompost",
  subtitle: "100% Organic — Slow Release",
  price: 299,
  originalPrice: 399,
  rating: 4.8,
  totalReviews: 241,
  badge: "Best Seller",
  category: "Fertilizers",
  categoryHref: "/shop/fertilizers",
  sku: "KO-FERT-001",
  images: [
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
  ],
  weights: ["1 kg", "3 kg", "5 kg"],
  description:
    "Our Premium Vermicompost is made from the finest earthworm castings, carefully composted over 90 days. It enriches soil structure, improves water retention, and delivers slow-release nutrients directly to plant roots. Safe for all plants — vegetables, flowers, herbs, and fruit trees.",
  highlights: [
    "Rich in nitrogen, phosphorus & potassium",
    "Improves soil texture and drainage",
    "Safe for vegetables, herbs & fruit trees",
    "No chemical additives — 100% natural",
    "Odourless and easy to use",
  ],
  howToUse: [
    { step: "1", title: "Mix into soil", desc: "Add 1–2 handfuls per pot or 1 kg per sq. metre of garden bed." },
    { step: "2", title: "Water lightly", desc: "Water after application to help nutrients seep into the soil." },
    { step: "3", title: "Repeat monthly", desc: "Re-apply once a month during the growing season for best results." },
  ],
  inStock: true,
  deliveryDays: "2–4",
};

const reviews: Review[] = [
  { id: 1, name: "Meenakshi R.", rating: 5, date: "12 Mar 2025", comment: "Excellent quality! My tomato plants have never looked healthier. Very happy with this purchase.", verified: true },
  { id: 2, name: "Rajan K.", rating: 5, date: "28 Feb 2025", comment: "Good product. Delivered on time and the packaging was neat. Will order again.", verified: true },
  { id: 3, name: "Sumathi P.", rating: 4, date: "10 Feb 2025", comment: "Works well for my terrace garden. The plants are growing nicely since I started using this.", verified: true },
  { id: 4, name: "Annamalai S.", rating: 5, date: "1 Feb 2025", comment: "Best vermicompost I have used so far. No bad smell at all and the bag is easy to handle.", verified: false },
];

const related: RelatedProduct[] = [
  { id: 11, name: "Neem Cake Powder", subtitle: "1 kg — pest repellent", price: 199, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&auto=format&fit=crop&q=80", badge: "Organic" },
  { id: 13, name: "Seaweed Liquid", subtitle: "500ml concentrate", price: 249, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=80", badge: "New" },
  { id: 14, name: "Bone Meal Powder", subtitle: "2 kg — slow release", price: 179, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&auto=format&fit=crop&q=80" },
  { id: 18, name: "Coco Peat Block", subtitle: "650g — expands 8L", price: 129, image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0c?w=400&auto=format&fit=crop&q=80", badge: "Best Seller" },
];

// ─── Star Row ─────────────────────────────────────────────────────────────────

const Stars = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size} className={s <= Math.round(rating) ? "text-[#d4a017] fill-[#d4a017]" : "text-[#d0c8b8]"} />
    ))}
  </div>
);

// ─── Accordion Block ──────────────────────────────────────────────────────────

const AccordionBlock = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-[#e8e0d0] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-[#faf7f2] transition-colors"
      >
        <span className="text-lg font-bold text-[#2a2a1e]">{title}</span>
        {open ? <ChevronUp size={20} className="text-[#7a7a68]" /> : <ChevronDown size={20} className="text-[#7a7a68]" />}
      </button>
      {open && <div className="bg-white px-5 pb-5">{children}</div>}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(product.weights[1]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* ── Breadcrumb ────────────────────────────────── */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm flex-wrap">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <Link href="/shop" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Shop</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <Link href={product.categoryHref} className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">{product.category}</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">{product.name}</span>
        </div>
      </div>

      {/* ── Main Product Section ──────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* LEFT — Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-[#e8e0d0]">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-300"
                priority
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#3d6b35] text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                  {product.badge}
                </span>
              )}
              <span className="absolute top-4 right-4 bg-[#c0392b] text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
                -{discount}% OFF
              </span>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? "border-[#3d6b35] shadow-md" : "border-[#e8e0d0] hover:border-[#a8c890]"
                  }`}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="flex flex-col gap-6">

            {/* Name & Rating */}
            <div>
              <p className="text-sm font-semibold text-[#3d6b35] uppercase tracking-wide mb-2">{product.category}</p>
              <h1 className="text-3xl sm:text-4xl font-black text-[#2a2a1e] font-outfit leading-tight mb-1">
                {product.name}
              </h1>
              <p className="text-lg text-[#7a7a68] mb-4">{product.subtitle}</p>

              <div className="flex items-center gap-3 flex-wrap">
                <Stars rating={product.rating} size={20} />
                <span className="text-lg font-bold text-[#2a2a1e]">{product.rating}</span>
                <span className="text-base text-[#7a7a68]">({product.totalReviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl px-5 py-4">
              <span className="text-4xl font-black text-[#3d6b35]">₹{product.price}</span>
              <span className="text-xl text-[#a8a090] line-through">₹{product.originalPrice}</span>
              <span className="text-base font-bold text-[#c0392b] bg-red-50 px-3 py-1 rounded-full">
                Save ₹{product.originalPrice - product.price}
              </span>
            </div>

            {/* Weight Selector */}
            <div>
              <p className="text-base font-bold text-[#2a2a1e] mb-3">
                Pack Size: <span className="text-[#3d6b35]">{selectedWeight}</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {product.weights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`px-5 py-3 rounded-xl text-base font-bold border-2 transition-all ${
                      selectedWeight === w
                        ? "bg-[#3d6b35] text-white border-[#3d6b35] shadow-md"
                        : "bg-white text-[#3a3a2e] border-[#d4c9a8] hover:border-[#3d6b35] hover:text-[#3d6b35]"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Qty */}
              <div className="flex items-center gap-0 border-2 border-[#d4c9a8] rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-14 flex items-center justify-center hover:bg-[#eef5ea] transition-colors active:scale-95"
                  aria-label="Decrease quantity"
                >
                  <Minus size={20} className="text-[#3d6b35]" />
                </button>
                <span className="w-14 text-center text-xl font-bold text-[#2a2a1e] select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-14 h-14 flex items-center justify-center hover:bg-[#eef5ea] transition-colors active:scale-95"
                  aria-label="Increase quantity"
                >
                  <Plus size={20} className="text-[#3d6b35]" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-3 font-bold text-lg py-4 rounded-xl transition-all duration-300 active:scale-[.98] shadow-md ${
                  addedToCart
                    ? "bg-[#2e5228] text-white"
                    : "bg-[#3d6b35] hover:bg-[#2e5228] text-white"
                }`}
              >
                {addedToCart ? (
                  <><Check size={22} />Added to Cart!</>
                ) : (
                  <><ShoppingCart size={22} />Add to Cart</>
                )}
              </button>
            </div>

            {/* In stock / SKU */}
            <div className="flex items-center justify-between text-sm flex-wrap gap-2">
              <span className="flex items-center gap-2 text-[#3d6b35] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3d6b35] animate-pulse"></span>
                In Stock — Ships in {product.deliveryDays} days
              </span>
              <span className="text-[#a8a090]">SKU: {product.sku}</span>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, label: "Free delivery", sub: "above ₹999" },
                { icon: RotateCcw, label: "Easy returns", sub: "within 7 days" },
                { icon: ShieldCheck, label: "Secure pay", sub: "trusted checkout" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1.5 bg-white border border-[#e8e0d0] rounded-xl p-3">
                  <Icon size={20} className="text-[#3d6b35]" />
                  <span className="text-xs font-bold text-[#2a2a1e] leading-tight">{label}</span>
                  <span className="text-[10px] text-[#7a7a68] leading-tight">{sub}</span>
                </div>
              ))}
            </div>

            {/* Help CTA */}
            <div className="flex items-center gap-4 bg-[#faf7f2] border border-[#d4c9a8] rounded-2xl px-5 py-4">
              <Phone size={22} className="text-[#3d6b35] shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-[#2a2a1e]">Not sure if this is right for you?</p>
                <p className="text-xs text-[#7a7a68]">Call our garden experts for free advice</p>
              </div>
              <a
                href="tel:+919876543210"
                className="shrink-0 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Details Accordions ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14 flex flex-col gap-4">

        {/* Description */}
        <AccordionBlock title="About This Product">
          <p className="text-base sm:text-lg text-[#5a5a48] leading-relaxed mb-5">{product.description}</p>
          <ul className="flex flex-col gap-3">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#eef5ea] border border-[#b8d4a0] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="text-[#3d6b35]" />
                </div>
                <span className="text-base sm:text-lg text-[#3a3a2e]">{h}</span>
              </li>
            ))}
          </ul>
        </AccordionBlock>

        {/* How to Use */}
        <AccordionBlock title="How to Use">
          <div className="flex flex-col sm:flex-row gap-5">
            {product.howToUse.map((item) => (
              <div key={item.step} className="flex-1 flex gap-4 bg-[#faf7f2] border border-[#e8e0d0] rounded-2xl p-4">
                <div className="w-10 h-10 rounded-full bg-[#3d6b35] text-white font-black text-lg flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-base font-bold text-[#2a2a1e]">{item.title}</p>
                  <p className="text-sm sm:text-base text-[#5a5a48] mt-1 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AccordionBlock>

        {/* Reviews */}
        <AccordionBlock title={`Customer Reviews (${product.totalReviews})`}>
          {/* Summary */}
          <div className="flex items-center gap-6 mb-6 p-4 bg-[#faf7f2] rounded-2xl border border-[#e8e0d0] flex-wrap">
            <div className="text-center">
              <div className="text-5xl font-black text-[#3d6b35]">{product.rating}</div>
              <Stars rating={product.rating} size={18} />
              <p className="text-sm text-[#7a7a68] mt-1">{product.totalReviews} reviews</p>
            </div>
            <div className="flex-1 min-w-[160px] flex flex-col gap-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 2 : 2;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm text-[#5a5a48] w-3">{star}</span>
                    <Star size={12} className="text-[#d4a017] fill-[#d4a017] shrink-0" />
                    <div className="flex-1 h-2.5 bg-[#e8e0d0] rounded-full overflow-hidden">
                      <div className="h-full bg-[#d4a017] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-[#7a7a68] w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Cards */}
          <div className="flex flex-col gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-[#faf7f2] border border-[#e8e0d0] rounded-2xl p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-[#2a2a1e]">{r.name}</span>
                      {r.verified && (
                        <span className="flex items-center gap-1 text-xs text-[#3d6b35] bg-[#eef5ea] px-2 py-0.5 rounded-full font-semibold">
                          <Check size={10} />Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#a8a090] mt-0.5">{r.date}</p>
                  </div>
                  <Stars rating={r.rating} size={16} />
                </div>
                <p className="text-base text-[#3a3a2e] leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </AccordionBlock>
      </div>

      {/* ── Related Products ──────────────────────────── */}
      <div className="bg-white border-t border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="mb-7">
            <p className="text-sm font-semibold text-[#7a9e5f] uppercase tracking-wide mb-1">You may also like</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2a2a1e] font-outfit">Related Products</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/shop/product/${p.id}`}
                className="flex flex-col bg-[#faf7f2] rounded-2xl overflow-hidden border border-[#e8e0d0] hover:border-[#a8c890] hover:shadow-md transition-all duration-300 group"
              >
                <div className="relative aspect-square overflow-hidden bg-white">
                  {p.badge && (
                    <span className="absolute top-3 left-3 z-10 bg-[#3d6b35] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {p.badge}
                    </span>
                  )}
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-bold text-[#2a2a1e] leading-snug">{p.name}</h3>
                  <p className="text-xs sm:text-sm text-[#7a7a68] mt-0.5">{p.subtitle}</p>
                  <p className="text-lg sm:text-xl font-black text-[#3d6b35] mt-2">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky Bottom Bar (mobile) ────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t-2 border-[#e8e0d0] px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="flex-1">
          <p className="text-xs text-[#7a7a68]">{selectedWeight}</p>
          <p className="text-xl font-black text-[#3d6b35] leading-tight">₹{product.price}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className={`flex items-center gap-2 font-bold text-base px-6 py-3.5 rounded-xl transition-all duration-300 active:scale-95 shadow-md ${
            addedToCart
              ? "bg-[#2e5228] text-white"
              : "bg-[#3d6b35] hover:bg-[#2e5228] text-white"
          }`}
        >
          {addedToCart ? <><Check size={20} />Added!</> : <><ShoppingCart size={20} />Add to Cart</>}
        </button>
      </div>

      {/* Bottom spacer for sticky bar on mobile */}
      <div className="lg:hidden h-20" />
    </div>
  );
}