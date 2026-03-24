"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../_context/CartContext";
import { Product } from "@/data/Product";


const TOP_SELLER_IDS = [7, 15, 11, 10];
const NEW_ARRIVAL_IDS = [1, 20, 18, 22];

const AddToCartBtn = ({ product }: { product: Product }) => {
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = isInCart(product.id);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      variant: product.weights[0] ?? "Standard",
      price: product.price,
      image: product.images[0],
      badge: product.badge,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <button onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-2 font-bold text-sm sm:text-base py-2.5 sm:py-3 rounded-xl transition-all duration-200 active:scale-95 ${
        justAdded ? "bg-[#3d6b35] text-white border-2 border-[#3d6b35]"
        : inCart   ? "bg-[#eef5ea] text-[#3d6b35] border-2 border-[#3d6b35]"
        : "bg-[#eef5ea] hover:bg-[#3d6b35] text-[#3d6b35] hover:text-white border-2 border-[#b8d4a0] hover:border-[#3d6b35]"
      }`}
    >
      <ShoppingCart size={18} />
      {justAdded ? "Added!" : inCart ? "In Cart ✓" : "Add to Cart"}
    </button>
  );
};

const SkeletonCard = () => (
  <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#e8e0d0] animate-pulse">
    <div className="aspect-square bg-[#f0ece4]" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-4 bg-[#f0ece4] rounded-lg w-3/4" />
      <div className="h-3 bg-[#f0ece4] rounded-lg w-1/2" />
      <div className="h-7 bg-[#f0ece4] rounded-lg w-1/3 mt-2" />
      <div className="h-9 bg-[#f0ece4] rounded-xl" />
    </div>
  </div>
);

export const TopSellersSection = () => {
  const [tab, setTab] = useState<"top" | "new">("top");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => { setAllProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const ids = tab === "top" ? TOP_SELLER_IDS : NEW_ARRIVAL_IDS;
  const products = ids.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean) as Product[];

  return (
    <section className="w-full bg-[#faf7f2] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="mb-8 sm:mb-12">
          <div className="flex gap-2 mb-5 sm:mb-6">
            {(["top", "new"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 rounded-xl text-base font-bold transition-all ${
                  tab === t ? "bg-[#3d6b35] text-white shadow-md" : "bg-white border-2 border-[#d4c9a8] text-[#5a5a48] hover:border-[#3d6b35] hover:text-[#3d6b35]"
                }`}
              >
                {t === "top" ? "Top Sellers" : "New Arrivals"}
              </button>
            ))}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2a2a1e] font-outfit">
            {tab === "top" ? "Our Customers' Favourites" : "Fresh to the Garden Store"}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <Link key={product.id} href={`/shop/product/${product.id}`}
                  className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#e8e0d0] hover:border-[#b8d4a0] hover:shadow-md transition-all duration-300 group"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#f5f0ea]">
                    {product.badge && (
                      <span className="absolute top-3 left-3 z-10 bg-[#3d6b35] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {product.badge}
                      </span>
                    )}
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#2a2a1e] leading-snug">{product.name}</h3>
                      <p className="text-sm text-[#7a7a68] mt-0.5">{product.subtitle}</p>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-[#3d6b35] mt-auto pt-1">₹{product.price}</p>
                    <div onClick={(e) => e.preventDefault()}>
                      <AddToCartBtn product={product} />
                    </div>
                  </div>
                </Link>
              ))
          }
        </div>

        <div className="text-center mt-10 sm:mt-14">
          <Link href="/shop"
            className="inline-flex items-center gap-2 bg-white border-2 border-[#3d6b35] text-[#3d6b35] hover:bg-[#3d6b35] hover:text-white font-bold text-base sm:text-lg px-8 py-4 rounded-xl transition-all duration-200"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};