"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface SliderItem {
  imgUrl: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

// Strips domain from full URLs so CMS-saved values like
// "https://kavinorganics.in/shop?cat=seeds" become "/shop?cat=seeds"
function safeHref(href: string): string {
  if (!href) return "/shop";
  try {
    const url = new URL(href);
    return url.pathname + url.search + url.hash;
  } catch {
    return href.startsWith("/") ? href : `/${href}`;
  }
}

const FALLBACK: SliderItem[] = [
  {
    imgUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1440&auto=format&fit=crop",
    tag: "Premium Seeds",
    title: "Grow healthy plants from the finest seeds.",
    subtitle: "Handpicked varieties for home & balcony gardens.",
    ctaText: "Shop Seeds",
    ctaHref: "/shop?cat=seeds",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1440&auto=format&fit=crop",
    tag: "Stylish Pots",
    title: "Beautiful pots for every corner of your home.",
    subtitle: "Terracotta, ceramic & plastic in all sizes.",
    ctaText: "Shop Pots",
    ctaHref: "/shop?cat=pots",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1440&auto=format&fit=crop",
    tag: "Organic Fertilizers",
    title: "Nourish your garden, naturally.",
    subtitle: "Safe, organic blends for healthier plants.",
    ctaText: "Shop Fertilizers",
    ctaHref: "/shop?cat=fertilizers",
  },
];

export const Slider = () => {
  const [sliderData, setSliderData] = useState<SliderItem[]>(FALLBACK);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);

  useEffect(() => {
    fetch("/api/content/homepage")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.sliderItems?.length) {
          setSliderData(data.sliderItems);
        }
      })
      .catch(() => {});
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const current = sliderData[selectedIndex] ?? sliderData[0];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "clamp(400px, 70dvh, 680px)" }}>
      {/* Slides */}
      <div ref={emblaRef} className="w-full h-full">
        <div className="flex h-full">
          {sliderData.map((item, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 relative h-full">
              <img
                src={item.imgUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.15) 100%)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-10 sm:pb-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="inline-flex items-center gap-2 w-fit bg-[#3d6b35]/80 text-white text-sm font-semibold tracking-wide px-4 py-1.5 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#a8d878]" />
              {current?.tag}
            </span>
            <h1
              className="text-white font-bold font-outfit leading-tight"
              style={{ fontSize: "clamp(1.6rem, 4.5vw, 3.2rem)", lineHeight: 1.1 }}
            >
              {current?.title}
            </h1>
            <p className="text-white/80 text-base sm:text-lg font-medium max-w-lg leading-snug">
              {current?.subtitle}
            </p>
            <div className="pt-1">
              <Link
                href={safeHref(current?.ctaHref)}
                className="inline-flex items-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] text-white font-bold text-base sm:text-lg px-7 py-3.5 rounded-xl transition-all duration-200 active:scale-95 shadow-lg"
              >
                {current?.ctaText}
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 right-4 sm:right-6 flex items-center gap-2">
        {sliderData.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === selectedIndex ? "w-8 h-3 bg-white" : "w-3 h-3 bg-white/40 hover:bg-white/65"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};