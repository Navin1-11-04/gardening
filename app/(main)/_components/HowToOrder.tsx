"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Play } from "lucide-react";

const steps = [
  { number: "1", title: "Browse Products", description: "Look through our seeds, pots, fertilizers and more.", icon: "🌿" },
  { number: "2", title: "Add to Cart", description: "Tap 'Add to Cart' on any product you like.", icon: "🛒" },
  { number: "3", title: "Place Your Order", description: "Enter your address, choose payment and confirm.", icon: "📦" },
  { number: "4", title: "We Deliver to You", description: "Fresh garden supplies at your doorstep in 2–4 days.", icon: "🚚" },
];

// FIX: graceful video fallback — shows a placeholder CTA if the video file
// doesn't exist yet, instead of a broken video element.
const VIDEO_SRC = "/videos/how-to-order.mp4";
const THUMBNAIL_SRC = "/images/how-to-order-thumbnail.jpg";

// Set this to true once you've added the actual video file to /public/videos/
const VIDEO_AVAILABLE = false;

export const HowToOrder = () => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (!VIDEO_AVAILABLE) return;
    setPlaying(true);
    setTimeout(() => videoRef.current?.play(), 50);
  };

  return (
    <section className="w-full bg-white">

      {/* Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-10 sm:pb-12">
        <div className="mb-7 sm:mb-10">
          <p className="text-sm tracking-[0.2em] uppercase text-[#7a9e5f] font-semibold mb-2">How it works</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2a2a1e] font-outfit">How to Order</h2>
          <p className="text-base sm:text-lg text-[#5a5a48] mt-3 max-w-xl">
            It's simple! Follow these 4 easy steps to get your garden supplies delivered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative flex flex-col gap-4 bg-[#faf7f2] rounded-2xl p-5 sm:p-6 border border-[#e8e0d0]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3d6b35] text-white font-black text-lg flex items-center justify-center shrink-0">
                  {step.number}
                </div>
                <span className="text-3xl">{step.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2a2a1e]">{step.title}</h3>
                <p className="text-base text-[#5a5a48] mt-1.5 leading-snug">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#b8d4a0] text-2xl font-bold">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16">
        {VIDEO_AVAILABLE ? (
          <>
            <p className="text-base sm:text-lg text-[#5a5a48] mb-4 font-medium">
              🎬 Watch our quick video guide:
            </p>
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#e8e0d0]">
              {!playing && (
                <>
                  <img
                    src={THUMBNAIL_SRC}
                    alt="How to order video"
                    className="w-full h-[200px] sm:h-[360px] md:h-[420px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={handlePlay}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-2xl flex items-center justify-center hover:scale-110 transition">
                        <Play size={32} className="text-[#3d6b35] ml-1" />
                      </div>
                      <span className="text-white font-bold text-lg sm:text-xl bg-black/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
                        Tap to Watch
                      </span>
                    </div>
                  </div>
                </>
              )}
              <video
                ref={videoRef}
                className={`w-full h-[200px] sm:h-[360px] md:h-[420px] object-cover ${playing ? "block" : "hidden"}`}
                src={VIDEO_SRC}
                controls
                playsInline
                onEnded={() => setPlaying(false)}
              />
            </div>
          </>
        ) : (
          /* Fallback: No video yet — show a shop CTA instead */
          <div className="bg-[#faf7f2] border-2 border-dashed border-[#d4c9a8] rounded-2xl p-8 sm:p-10 text-center">
            <p className="text-4xl mb-4">🎬</p>
            <p className="text-xl font-bold text-[#2a2a1e] mb-2">Video Guide Coming Soon</p>
            <p className="text-base text-[#5a5a48] mb-6 max-w-md mx-auto leading-relaxed">
              We're putting together a step-by-step video to make ordering even easier. In the meantime, our team is always happy to help over the phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-base px-6 py-3.5 rounded-xl transition-colors"
              >
                🌿 Browse Products
              </Link>
              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-2 bg-white hover:bg-[#faf7f2] border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3d6b35] font-bold text-base px-6 py-3.5 rounded-xl transition-colors"
              >
                📞 Call Us for Help
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};