"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Star, ChevronRight, Plus, Minus,
  Truck, RotateCcw, ShieldCheck, Phone,
  ChevronDown, ChevronUp, Check, Loader2,
} from "lucide-react";
import { useCart } from "@/app/(main)/_context/CartContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Product } from "@/data/Product";

// ─── Mock reviews ─────────────────────────────────────────────────────────────

const mockReviews = [
  { id: 1, name: "Meenakshi R.", rating: 5, date: "12 Mar 2025", comment: "Excellent quality! My plants have never looked healthier. Very happy with this purchase.", verified: true },
  { id: 2, name: "Rajan K.",     rating: 5, date: "28 Feb 2025", comment: "Good product. Delivered on time and the packaging was neat. Will order again.", verified: true },
  { id: 3, name: "Sumathi P.",   rating: 4, date: "10 Feb 2025", comment: "Works well for my terrace garden. The plants are growing nicely since I started using this.", verified: true },
];

// ─── Stars ────────────────────────────────────────────────────────────────────

const Stars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size} className={s <= Math.round(rating) ? "text-[#d4a017] fill-[#d4a017]" : "text-[#d0c8b8]"} />
    ))}
  </div>
);

// ─── Accordion ────────────────────────────────────────────────────────────────

const AccordionBlock = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-[#e8e0d0] rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-4 bg-white hover:bg-[#faf7f2] transition-colors"
      >
        <span className="text-base sm:text-lg font-bold text-[#2a2a1e]">{title}</span>
        {open ? <ChevronUp size={18} className="text-[#7a7a68] shrink-0" /> : <ChevronDown size={18} className="text-[#7a7a68] shrink-0" />}
      </button>
      {open && <div className="bg-white px-4 sm:px-5 pb-5">{children}</div>}
    </div>
  );
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const ProductSkeleton = () => (
  <div className="min-h-screen bg-[#faf7f2]">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
        <div className="flex flex-col gap-3">
          <div className="aspect-square rounded-2xl bg-[#f0ece4]" />
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map((i) => <div key={i} className="aspect-square rounded-xl bg-[#f0ece4]" />)}
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-2">
          <div className="h-4 bg-[#f0ece4] rounded-lg w-1/4" />
          <div className="h-8 bg-[#f0ece4] rounded-xl w-3/4" />
          <div className="h-5 bg-[#f0ece4] rounded-lg w-1/2" />
          <div className="h-16 bg-[#f0ece4] rounded-2xl" />
          <div className="h-12 bg-[#f0ece4] rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProductDetails({ productId }: { productId: string }) {
  const [product,        setProduct]        = useState<Product | null>(null);
  const [related,        setRelated]        = useState<Product[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [notFound,       setNotFound]       = useState(false);
  const [selectedImage,  setSelectedImage]  = useState(0);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [quantity,       setQuantity]       = useState(1);
  const [addedToCart,    setAddedToCart]    = useState(false);

  const { addItem } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setSelectedImage(0);
    setQuantity(1);

    fetch(`/api/products/${productId}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setProduct(data.product);
        setRelated(data.related ?? []);
        setSelectedWeight(data.product.weights[1] ?? data.product.weights[0] ?? "Standard");
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      variant: selectedWeight,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      badge: product.badge,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) return <ProductSkeleton />;

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4 text-center py-20">
        <div className="text-7xl mb-6">🌱</div>
        <h2 className="text-3xl font-bold text-[#2a2a1e] font-outfit mb-3">Product not found</h2>
        <p className="text-lg text-[#7a7a68] mb-8">This product may no longer be available.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors">
          Browse All Products
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-1.5 text-xs sm:text-sm flex-wrap">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">{t("common.home", "Home")}</Link>
          <ChevronRight size={13} className="text-[#b0a890]" />
          <Link href="/shop" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">{t("common.shop", "Shop")}</Link>
          <ChevronRight size={13} className="text-[#b0a890]" />
          <Link href={`/shop?cat=${product.category}`} className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors capitalize">
            {product.category.replace("-", " ")}
          </Link>
          <ChevronRight size={13} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium truncate max-w-[160px]">{product.name}</span>
        </div>
      </div>

      {/* ── Main product section ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">

          {/* ── Left: Image gallery ── */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#e8e0d0] shadow-sm">
              <Image
                src={product.images[selectedImage] ?? product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-300"
                priority
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-[#3d6b35] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-3 right-3 bg-[#c0392b] text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? "border-[#3d6b35] shadow-sm" : "border-[#e8e0d0] hover:border-[#a8c890]"
                    }`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product info ── */}
          <div className="flex flex-col gap-4 sm:gap-5">

            {/* Category + name + rating */}
            <div>
              <p className="text-xs font-bold text-[#3d6b35] uppercase tracking-widest mb-1.5 capitalize">
                {product.category.replace("-", " ")}
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-[#2a2a1e] font-outfit leading-tight mb-1">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base text-[#7a7a68] mb-3">{product.subtitle}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Stars rating={product.rating} size={16} />
                <span className="text-sm font-bold text-[#2a2a1e]">{product.rating}</span>
                <span className="text-sm text-[#7a7a68]">({product.reviews} {t("product.reviews", "reviews")})</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl px-4 py-3.5">
              <span className="text-3xl sm:text-4xl font-black text-[#3d6b35]">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-[#a8a090] line-through">₹{product.originalPrice}</span>
                  <span className="text-sm font-bold text-[#c0392b] bg-red-50 px-2.5 py-1 rounded-full">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Pack size selector */}
            {product.weights.length > 0 && (
              <div>
                <p className="text-sm font-bold text-[#2a2a1e] mb-2">
                  Pack Size: <span className="text-[#3d6b35]">{selectedWeight}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.weights.map((w) => (
                    <button key={w} onClick={() => setSelectedWeight(w)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                        selectedWeight === w
                          ? "bg-[#3d6b35] text-white border-[#3d6b35] shadow-sm"
                          : "bg-white text-[#3a3a2e] border-[#d4c9a8] hover:border-[#3d6b35] hover:text-[#3d6b35]"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-stretch gap-3">
              <div className="flex items-center border-2 border-[#d4c9a8] rounded-xl overflow-hidden bg-white shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-12 flex items-center justify-center hover:bg-[#eef5ea] transition-colors active:scale-95"
                >
                  <Minus size={18} className="text-[#3d6b35]" />
                </button>
                <span className="w-10 text-center text-lg font-bold text-[#2a2a1e] select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-12 flex items-center justify-center hover:bg-[#eef5ea] transition-colors active:scale-95"
                >
                  <Plus size={18} className="text-[#3d6b35]" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 font-bold text-base px-6 py-3 rounded-xl transition-all duration-300 active:scale-[.98] shadow-md ${
                  addedToCart ? "bg-[#2e5228] text-white" : "bg-[#3d6b35] hover:bg-[#2e5228] text-white"
                }`}
              >
                {addedToCart
                  ? <><Check size={20} /><span>{t("product.addedToCart", "Added to Cart!")}</span></>
                  : <><ShoppingCart size={20} /><span>{t("shop.addToCart", "Add to Cart")}</span></>
                }
              </button>
            </div>

            {/* Stock + SKU */}
            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
              {product.inStock ? (
                <span className="flex items-center gap-1.5 text-[#3d6b35] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#3d6b35] animate-pulse" />
                  {t("product.inStock", "In Stock")} — Ships in {product.deliveryDays} days
                </span>
              ) : (
                <span className="text-[#c0392b] font-semibold">{t("product.outOfStock", "Currently out of stock")}</span>
              )}
              <span className="text-[#a8a090]">{t("product.sku", "SKU")}: {product.sku}</span>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Truck,       label: t("cart.freeDelivery", "Free delivery"), sub: "above ₹999" },
                { icon: RotateCcw,   label: "Easy returns",  sub: "within 7 days" },
                { icon: ShieldCheck, label: "Secure pay",    sub: "trusted checkout" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1 bg-white border border-[#e8e0d0] rounded-xl p-2.5">
                  <Icon size={18} className="text-[#3d6b35]" />
                  <span className="text-[10px] sm:text-xs font-bold text-[#2a2a1e] leading-tight">{label}</span>
                  <span className="text-[9px] sm:text-[10px] text-[#7a7a68] leading-tight">{sub}</span>
                </div>
              ))}
            </div>

            {/* Phone CTA */}
            <div className="flex items-center gap-3 bg-[#faf7f2] border border-[#d4c9a8] rounded-2xl px-4 py-3">
              <Phone size={18} className="text-[#3d6b35] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#2a2a1e]">Not sure if this is right for you?</p>
                <p className="text-xs text-[#7a7a68]">Call our garden experts for free advice</p>
              </div>
              <a href="tel:+919876543210"
                className="shrink-0 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-xs px-3 py-2 rounded-xl transition-colors"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Accordions ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 flex flex-col gap-3">

        <AccordionBlock title={t("product.highlights", "About This Product")}>
          <p className="text-sm sm:text-base text-[#5a5a48] leading-relaxed mb-4">{product.description}</p>
          <ul className="flex flex-col gap-2.5">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#eef5ea] border border-[#b8d4a0] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} className="text-[#3d6b35]" />
                </div>
                <span className="text-sm sm:text-base text-[#3a3a2e] leading-snug">{h}</span>
              </li>
            ))}
          </ul>
        </AccordionBlock>

        <AccordionBlock title={t("product.howToUse", "How to Use")}>
          <div className="flex flex-col sm:flex-row gap-3">
            {product.howToUse.map((item) => (
              <div key={item.step} className="flex-1 flex gap-3 bg-[#faf7f2] border border-[#e8e0d0] rounded-xl p-3.5">
                <div className="w-8 h-8 rounded-full bg-[#3d6b35] text-white font-black text-sm flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2a2a1e]">{item.title}</p>
                  <p className="text-xs sm:text-sm text-[#5a5a48] mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AccordionBlock>

        <AccordionBlock title={`${t("product.reviews", "Customer Reviews")} (${product.reviews})`}>
          <div className="flex items-center gap-5 mb-5 p-3.5 bg-[#faf7f2] rounded-xl border border-[#e8e0d0] flex-wrap">
            <div className="text-center">
              <div className="text-4xl font-black text-[#3d6b35]">{product.rating}</div>
              <Stars rating={product.rating} size={16} />
              <p className="text-xs text-[#7a7a68] mt-1">{product.reviews} reviews</p>
            </div>
            <div className="flex-1 min-w-[140px] flex flex-col gap-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : 2;
                return (
                  <div key={star} className="flex items-center gap-1.5">
                    <span className="text-xs text-[#5a5a48] w-2.5">{star}</span>
                    <Star size={10} className="text-[#d4a017] fill-[#d4a017] shrink-0" />
                    <div className="flex-1 h-2 bg-[#e8e0d0] rounded-full overflow-hidden">
                      <div className="h-full bg-[#d4a017] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-[#7a7a68] w-7 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {mockReviews.map((r) => (
              <div key={r.id} className="bg-[#faf7f2] border border-[#e8e0d0] rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#2a2a1e]">{r.name}</span>
                      {r.verified && (
                        <span className="flex items-center gap-1 text-[10px] text-[#3d6b35] bg-[#eef5ea] px-2 py-0.5 rounded-full font-semibold">
                          <Check size={9} />Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#a8a090] mt-0.5">{r.date}</p>
                  </div>
                  <Stars rating={r.rating} size={14} />
                </div>
                <p className="text-sm text-[#3a3a2e] leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </AccordionBlock>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div className="bg-white border-t border-[#e8e0d0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="mb-5">
              <p className="text-xs font-semibold text-[#7a9e5f] uppercase tracking-wide mb-1">You may also like</p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2a2a1e] font-outfit">{t("product.relatedProducts", "Related Products")}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {related.map((p) => (
                <Link key={p.id} href={`/shop/product/${p.id}`}
                  className="flex flex-col bg-[#faf7f2] rounded-2xl overflow-hidden border border-[#e8e0d0] hover:border-[#a8c890] hover:shadow-md transition-all group"
                >
                  <div className="relative aspect-square overflow-hidden bg-white">
                    {p.badge && (
                      <span className="absolute top-2 left-2 z-10 bg-[#3d6b35] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    )}
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs sm:text-sm font-bold text-[#2a2a1e] leading-snug line-clamp-2">{p.name}</h3>
                    <p className="text-[10px] sm:text-xs text-[#7a7a68] mt-0.5">{p.subtitle}</p>
                    <p className="text-base sm:text-lg font-black text-[#3d6b35] mt-1.5">₹{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky mobile Add to Cart bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t-2 border-[#e8e0d0] px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[#7a7a68] truncate">{selectedWeight}</p>
          <p className="text-xl font-black text-[#3d6b35] leading-tight">₹{product.price}</p>
        </div>
        <button onClick={handleAddToCart}
          className={`flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-xl transition-all duration-300 active:scale-95 shadow-md ${
            addedToCart ? "bg-[#2e5228] text-white" : "bg-[#3d6b35] hover:bg-[#2e5228] text-white"
          }`}
        >
          {addedToCart
            ? <><Check size={18} />{t("product.addedToCart", "Added!")}</>
            : <><ShoppingCart size={18} />{t("shop.addToCart", "Add to Cart")}</>
          }
        </button>
      </div>
      <div className="lg:hidden h-20" />
    </div>
  );
}