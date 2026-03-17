"use client";

import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Seeds",
    href: "/shop/seeds",
    description: "Vegetables, herbs & flowers",
    bgColor: "#e8f0e4",
    image: "/categories/seeds.jpg",
  },
  {
    name: "Grow Bags",
    href: "/shop/grow-bags",
    description: "Fabric & plastic grow bags",
    bgColor: "#d4e8c2",
    image: "/categories/grow_bags.jpg",
  },
  {
    name: "Fertilizers",
    href: "/shop/fertilizers",
    description: "Organic & chemical blends",
    bgColor: "#f0ead4",
    image: "/categories/fertilizers.jpg",
  },
  {
    name: "Coco Peats",
    href: "/shop/coco-peats",
    description: "Premium coco coir media",
    bgColor: "#e4d8c8",
    image: "/categories/cocopeat.jpg",
  },
  {
    name: "Pots",
    href: "/shop/pots",
    description: "Terracotta, ceramic & plastic",
    bgColor: "#e8ddd0",
    image: "/categories/pots.jpg",
  },
];

export const Categories = () => {
  const [featured, ...rest] = categories;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

      {/* Header */}
      <div className="mb-7 sm:mb-10">
        <p className="text-sm tracking-[0.2em] uppercase text-[#7a9e5f] font-semibold mb-2">
          Browse by Category
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2a2a1e] leading-tight font-outfit">
          Everything Your<br className="sm:hidden" /> Garden Needs
        </h2>
      </div>

      {/* Mobile: vertical list — large tap targets */}
      <div className="sm:hidden flex flex-col gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="flex items-center gap-4 rounded-2xl overflow-hidden p-3 group border border-transparent hover:border-[#b8d4a0] transition-colors"
            style={{ backgroundColor: cat.bgColor }}
          >
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-[#2a2a1e]">{cat.name}</h3>
              <p className="text-sm text-[#5a5a48] mt-0.5">{cat.description}</p>
            </div>
            <div className="shrink-0 w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-[#3d6b35] font-bold text-lg">
              →
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: Bento grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Featured */}
        <Link
          href={featured.href}
          className="lg:row-span-2 rounded-2xl overflow-hidden p-2 group"
          style={{ backgroundColor: featured.bgColor }}
        >
          <div className="relative h-full min-h-[320px] lg:min-h-[440px] rounded-xl overflow-hidden">
            <Image
              src={featured.image}
              alt={featured.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-0 p-6 text-white">
              <h3 className="text-2xl font-bold">{featured.name}</h3>
              <p className="text-base opacity-90 mt-1">{featured.description}</p>
              <span className="inline-flex items-center gap-1.5 mt-3 bg-white/20 backdrop-blur text-sm font-bold px-4 py-2 rounded-full">
                Shop Now →
              </span>
            </div>
          </div>
        </Link>

        {rest.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="rounded-2xl overflow-hidden p-2 group"
            style={{ backgroundColor: cat.bgColor }}
          >
            <div className="relative h-full min-h-[200px] rounded-xl overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/28" />
              <div className="absolute bottom-0 p-5 text-white">
                <h3 className="text-xl font-bold">{cat.name}</h3>
                <p className="text-sm opacity-90 mt-0.5">{cat.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};