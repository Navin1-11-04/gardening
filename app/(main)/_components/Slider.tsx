"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'

interface SliderItem {
  imgUrl: string;
  title: string;
  subtitle: string;
}

const sliderData: SliderItem[] = [
  {
    imgUrl: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?q=80&w=1170&auto=format&fit=crop",
    title: "Premium Seeds",
    subtitle: "Grow healthy plants from high quality seeds",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1457530378978-8bac673b8062?q=80&w=1170&auto=format&fit=crop",
    title: "Beautiful Pots",
    subtitle: "Decorate your garden with stylish pots",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1507484467459-0c01be16726e?q=80&w=1170&auto=format&fit=crop",
    title: "Organic Fertilizers",
    subtitle: "Boost plant growth naturally",
  },
];

export const Slider = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  // Keyboard control — only fires on md+ screens (768px)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth < 768) return;
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext]);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      <div ref={emblaRef} className="w-full h-full">
        <div className="flex h-full">
          {sliderData.map((item, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
              <img
                src={item.imgUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/20" />
              <div className="absolute bottom-24 text-center w-full">
                <h1 className="text-3xl md:text-7xl text-white leading-tight mb-2 font-outfit uppercase font-bold text-shadow-2xs">
                  {item.title}
                </h1>
                <p className="text-white/90 text-sm md:text-base mb-2 text-shadow-2xs">
                  {item.subtitle}
                </p>
                <button className="mt-4 px-8 py-3 bg-white text-green-800 font-outfit font-bold text-sm uppercase tracking-widest rounded-full hover:bg-green-500 hover:text-white active:scale-95 transition-all duration-300 cursor-pointer">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hidden on mobile, visible md+ */}
      <button
        onClick={scrollPrev}
        className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 w-11 h-14 rounded-full text-white items-center justify-center hover:bg-white/20 transition-colors z-10"
        aria-label="Previous"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-5 md:size-8" color="currentColor" strokeWidth={2} />
      </button>
      <button
        onClick={scrollNext}
        className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 w-11 h-14 rounded-full text-white items-center justify-center hover:bg-white/20 transition-colors z-10"
        aria-label="Next"
      >
        <HugeiconsIcon icon={ArrowRight01Icon} className="size-5 md:size-8" color="currentColor" strokeWidth={2} />
      </button>

      {/* Dot pagination */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {sliderData.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};