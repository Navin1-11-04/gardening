"use client";

import { useState, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Browse Products",
    description: "Explore seeds, pots and garden supplies.",
    icon: "🌿",
  },
  {
    number: "02",
    title: "Add to Cart",
    description: "Choose quantity and add items.",
    icon: "🛒",
  },
  {
    number: "03",
    title: "Place Order",
    description: "Enter address and confirm order.",
    icon: "📦",
  },
  {
    number: "04",
    title: "Fast Delivery",
    description: "Fresh garden supplies delivered to your home.",
    icon: "🚚",
  },
];

export const HowToOrder = () => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => videoRef.current?.play(), 50);
  };

  return (
    <section className="w-full bg-white">

      {/* Title */}
      <div className="text-center pt-16 pb-12 px-6 ">
        <p className="text-xs tracking-[0.35em] uppercase text-gray-400 mb-3">
          How it works
        </p>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-outfit">
          How to Order
        </h2>
      </div>

      {/* Video Section */}
      <div className="max-w-7xl mx-auto px-6">

        <div className="relative rounded-2xl overflow-hidden shadow-lg group">

          {!playing && (
            <>
              {/* Thumbnail */}
              <img
                src="/images/how-to-order-thumbnail.jpg"
                alt="How to order"
                className="w-full h-[350px] md:h-[450px] object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

              {/* Play Button */}
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={handlePlay}
              >
                <div className="relative flex items-center justify-center">

                  <div className="absolute w-24 h-24 rounded-full bg-white/20 animate-ping" />

                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-110 transition">

                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: "12px solid transparent",
                        borderBottom: "12px solid transparent",
                        borderLeft: "18px solid #1a1a1a",
                        marginLeft: "4px",
                      }}
                    />

                  </div>

                </div>
              </div>
            </>
          )}

          {/* Video */}
          <video
            ref={videoRef}
            className={`w-full h-[350px] md:h-[450px] object-cover ${
              playing ? "block" : "hidden"
            }`}
            src="/videos/how-to-order.mp4"
            controls
            playsInline
            onEnded={() => setPlaying(false)}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-start gap-4 p-5 rounded-xl border border-gray-100  transition"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl">
                {step.icon}
              </div>

              {/* Content */}
              <div>
                <span className="text-xs font-semibold tracking-widest text-green-600 uppercase">
                  Step {step.number}
                </span>

                <h3 className="text-base font-semibold text-gray-900 mt-1">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};