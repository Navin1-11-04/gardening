"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

const topProducts = [
  {
    id: 1,
    name: "Terracotta Pot",
    subtitle: "8 inch — handcrafted",
    price: 249,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Fabric Grow Bag",
    subtitle: "15 litre — set of 3",
    price: 299,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1599685315640-89c0f88c3b4e?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Organic Fertilizer",
    subtitle: "1 kg — slow release",
    price: 199,
    badge: "Popular",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Clay Plant Pot",
    subtitle: "Indoor garden pot",
    price: 179,
    badge: "Popular",
    image:
      "https://images.unsplash.com/photo-1616627455680-0e60e2c3f5f5?w=800&auto=format&fit=crop&q=80",
  },
];

const newProducts = [
  {
    id: 5,
    name: "Premium Tomato Seeds",
    subtitle: "Pack of 50 seeds",
    price: 149,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1592919505780-303950717480?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Garden Water Spray",
    subtitle: "Adjustable nozzle",
    price: 199,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1615486366482-4b7a30d1f9b3?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    name: "Coco Peat Block",
    subtitle: "Organic soil enhancer",
    price: 129,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0c?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    name: "Plant Starter Kit",
    subtitle: "Beginner gardening kit",
    price: 399,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1615486366363-7b9c5c0d9c2f?w=800&auto=format&fit=crop&q=80",
  },
];

export const TopSellersSection = () => {
  const [tab, setTab] = useState<"new" | "top">("top");

  const products = tab === "top" ? topProducts : newProducts;

  return (
    <section className="w-full bg-white py-16 px-6 md:px-10">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full p-1 mb-6">
          <button
            onClick={() => setTab("top")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              tab === "top"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Top Sellers
          </button>

          <button
            onClick={() => setTab("new")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              tab === "new"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            New Arrivals
          </button>
        </div>

        <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">
          {tab === "top" ? "Best Sellers" : "New Arrivals"}
        </p>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          {tab === "top"
            ? "Our Customers' Favourites"
            : "Fresh to the Garden Store"}
        </h2>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">

              {/* Badge */}
              <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur text-xs font-semibold px-3 py-1 rounded-full">
                {product.badge}
              </span>

              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />

              {/* Hover Add to Cart */}
              <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition">
                <button className="flex items-center gap-2 bg-white text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:bg-gray-100">
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-3">
              <h3 className="text-base font-semibold text-gray-900">
                {product.name}
              </h3>

              <p className="text-sm text-gray-500">{product.subtitle}</p>

              <p className="text-base font-bold text-gray-900 mt-1">
                ₹{product.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="text-center mt-14">
        <a
          href="/shop"
          className="inline-block border border-gray-900 text-gray-900 text-sm font-semibold px-8 py-3 rounded-full hover:bg-gray-900 hover:text-white transition"
        >
          View All Products
        </a>
      </div>
    </section>
  );
};