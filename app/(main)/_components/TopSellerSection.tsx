"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../_context/CartContext";

const topProducts = [
  {
    id: 7,
    name: "Terracotta Pot",
    subtitle: "8 inch — handcrafted",
    price: 249,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 15,
    name: "Fabric Grow Bag",
    subtitle: "15 litre — set of 3",
    price: 299,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1599685315640-89c0f88c3b4e?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 11,
    name: "Organic Fertilizer",
    subtitle: "5 kg vermicompost",
    price: 299,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 10,
    name: "Clay Plant Pot",
    subtitle: "Indoor garden pot",
    price: 179,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1616627455680-0e60e2c3f5f5?w=800&auto=format&fit=crop&q=80",
  },
];

const newProducts = [
  {
    id: 1,
    name: "Premium Tomato Seeds",
    subtitle: "Pack of 50 seeds",
    price: 149,
    badge: "New",
    image: "https://images.unsplash.com/photo-1592919505780-303950717480?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 20,
    name: "Garden Water Spray",
    subtitle: "Adjustable nozzle",
    price: 199,
    badge: "New",
    image: "https://images.unsplash.com/photo-1615486366482-4b7a30d1f9b3?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 18,
    name: "Coco Peat Block",
    subtitle: "Organic soil enhancer",
    price: 129,
    badge: "New",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0c?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 22,
    name: "Plant Starter Kit",
    subtitle: "Beginner gardening kit",
    price: 599,
    badge: "New",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80",
  },
];

// ─── Mini card Add-to-Cart button ─────────────────────────────────────────────

const AddToCartBtn = ({ product }: { product: typeof topProducts[0] }) => {
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = isInCart(product.id);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      variant: "Standard",
      price: product.price,
      image: product.image,
      badge: product.badge,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-2 font-bold text-sm sm:text-base py-2.5 sm:py-3 rounded-xl transition-all duration-200 active:scale-95 ${
        justAdded
          ? "bg-[#3d6b35] text-white border-2 border-[#3d6b35]"
          : inCart
          ? "bg-[#eef5ea] text-[#3d6b35] border-2 border-[#3d6b35]"
          : "bg-[#eef5ea] hover:bg-[#3d6b35] text-[#3d6b35] hover:text-white border-2 border-[#b8d4a0] hover:border-[#3d6b35]"
      }`}
    >
      <ShoppingCart size={18} />
      {justAdded ? "Added!" : inCart ? "In Cart ✓" : "Add to Cart"}
    </button>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────

export const TopSellersSection = () => {
  const [tab, setTab] = useState<"new" | "top">("top");
  const products = tab === "top" ? topProducts : newProducts;

  return (
    <section className="w-full bg-[#faf7f2] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="mb-8 sm:mb-12">
          <div className="flex gap-2 mb-5 sm:mb-6">
            <button
              onClick={() => setTab("top")}
              className={`px-5 py-3 rounded-xl text-base font-bold transition-all ${
                tab === "top"
                  ? "bg-[#3d6b35] text-white shadow-md"
                  : "bg-white border-2 border-[#d4c9a8] text-[#5a5a48] hover:border-[#3d6b35] hover:text-[#3d6b35]"
              }`}
            >
              Top Sellers
            </button>
            <button
              onClick={() => setTab("new")}
              className={`px-5 py-3 rounded-xl text-base font-bold transition-all ${
                tab === "new"
                  ? "bg-[#3d6b35] text-white shadow-md"
                  : "bg-white border-2 border-[#d4c9a8] text-[#5a5a48] hover:border-[#3d6b35] hover:text-[#3d6b35]"
              }`}
            >
              New Arrivals
            </button>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2a2a1e] font-outfit">
            {tab === "top" ? "Our Customers' Favourites" : "Fresh to the Garden Store"}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/product/${product.id}`}
              className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#e8e0d0] hover:border-[#b8d4a0] hover:shadow-md transition-all duration-300 group"
            >
              <div className="relative aspect-square overflow-hidden bg-[#f5f0ea]">
                <span className="absolute top-3 left-3 z-10 bg-[#3d6b35] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.badge}
                </span>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#2a2a1e] leading-snug">{product.name}</h3>
                  <p className="text-sm text-[#7a7a68] mt-0.5">{product.subtitle}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-1">
                  <p className="text-xl sm:text-2xl font-black text-[#3d6b35]">₹{product.price}</p>
                </div>
                {/* Stop link propagation on button */}
                <div onClick={(e) => e.preventDefault()}>
                  <AddToCartBtn product={product} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-14">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white border-2 border-[#3d6b35] text-[#3d6b35] hover:bg-[#3d6b35] hover:text-white font-bold text-base sm:text-lg px-8 py-4 rounded-xl transition-all duration-200"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};