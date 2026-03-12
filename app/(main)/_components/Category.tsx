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
    <section className="w-full max-w-7xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-2">
          Categories
        </p>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight font-outfit">
          Everything Your Garden<br />Needs
        </h2>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Featured Tile */}
        <Link
          href={featured.href}
          className="lg:row-span-2 rounded-2xl overflow-hidden p-2 group"
          style={{ backgroundColor: featured.bgColor }}
        >
          <div className="relative h-full min-h-[260px] sm:min-h-[300px] lg:min-h-[400px] rounded-xl overflow-hidden">

            <Image
              src={featured.image}
              alt={featured.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-black/25" />

            <div className="absolute bottom-0 p-5 sm:p-6 text-white">
              <h3 className="text-xl sm:text-2xl font-bold">
                {featured.name}
              </h3>

              <p className="text-xs sm:text-sm opacity-90">
                {featured.description}
              </p>

              <span className="inline-block mt-2 text-xs sm:text-sm font-semibold">
                Shop Now →
              </span>
            </div>
          </div>
        </Link>

        {/* Other Tiles */}
        {rest.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="rounded-2xl overflow-hidden p-1 group"
            style={{ backgroundColor: cat.bgColor }}
          >
            <div className="relative h-full min-h-[180px] sm:min-h-[200px] rounded-xl overflow-hidden">

              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-black/25" />

              <div className="absolute bottom-0 p-4 text-white">
                <h3 className="text-base sm:text-lg font-bold">
                  {cat.name}
                </h3>

                <p className="text-xs sm:text-sm opacity-90">
                  {cat.description}
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};