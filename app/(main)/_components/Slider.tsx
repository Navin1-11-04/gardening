"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface SliderItem {
  imgUrl: string;
  label: string;
  title: string;
  ctaText: string;
  ctaHref: string;
}

const sliderData: SliderItem[] = [
  {
    imgUrl:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1440&auto=format&fit=crop",
    label: "(Premium Seeds)",
    title: "Grow healthy plants from the finest quality seeds.",
    ctaText: "Shop Now",
    ctaHref: "/shop",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1440&auto=format&fit=crop",
    label: "(Stylish Pots)",
    title: "Beautiful pots to bring life and colour to any space.",
    ctaText: "Shop Now",
    ctaHref: "/shop",
  },
  {
    imgUrl:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1440&auto=format&fit=crop",
    label: "(Organic Fertilizers)",
    title: "Boost your garden's growth, naturally and sustainably.",
    ctaText: "Shop Now",
    ctaHref: "/shop",
  },
];

export const Slider = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const current = sliderData[selectedIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-b-3xl"
      style={{ height: "85dvh" }}
    >
      {/* SLIDES */}
      <div ref={emblaRef} className="w-full h-full">
        <div className="flex h-full">
          {sliderData.map((item, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
              <img
                src={item.imgUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0.10) 100%)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CENTERED CONTENT */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-end text-center"
        style={{
          paddingLeft: "clamp(1.5rem, 4vw, 3.5rem)",
          paddingRight: "clamp(1.5rem, 4vw, 3.5rem)",
          paddingBottom: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        <div className="flex flex-col gap-3 max-w-3xl items-center">
          <span className="text-white/80 font-light tracking-wide font-outfit uppercase">
            {current.label}
          </span>

          <h1
            className="text-white font-semibold leading-none font-outfit uppercase"
            style={{
              fontSize: "clamp(1.5rem, 3.8vw, 3.2rem)",
              lineHeight: 1.08,
            }}
          >
            {current.title}
          </h1>

          {/* CTA */}
          <a
            href={current.ctaHref}
            className="flex items-center gap-2 bg-white text-black font-medium transition-all duration-200 hover:bg-white/90 active:scale-95 font-outfit uppercase"
            style={{
              fontSize: "clamp(0.75rem, 1.1vw, 0.875rem)",
              padding: "clamp(0.55rem, 1vw, 0.75rem) clamp(1rem, 2vw, 1.5rem)",
              whiteSpace: "nowrap",
            }}
          >
            {current.ctaText}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};