"use client";

import { Truck, RotateCcw, ShieldCheck, Headphones, Phone, Mail } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Truck,        title: "Free Delivery",  text: "On orders above ₹999" },
  { icon: RotateCcw,    title: "Easy Returns",   text: "Within 7 days" },
  { icon: ShieldCheck,  title: "Safe Payments",  text: "Trusted & secure" },
  { icon: Headphones,   title: "Garden Support", text: "Call us anytime" },
];

// FIX: shop links use /shop?cat=X to match ShopPage's activeCategory query param logic
const shopLinks: [string, string][] = [
  ["Seeds",       "/shop?cat=seeds"],
  ["Grow Bags",   "/shop?cat=grow-bags"],
  ["Fertilizers", "/shop?cat=fertilizers"],
  ["Pots",        "/shop?cat=pots"],
  ["Coco Peat",   "/shop?cat=coco-peats"],
];

const guideLinks: [string, string][] = [
  ["Grow Tomatoes",  "/guides/how-to-grow-tomatoes-at-home"],
  ["Balcony Garden", "/guides/balcony-gardening-guide"],
  ["Using Cocopeat", "/guides/what-is-cocopeat-and-how-to-use-it"],
  ["Beginner Tips",  "/guides/beginners-guide-to-home-gardening"],
];

const helpLinks: [string, string][] = [
  ["Contact Us", "/contact"],
  ["FAQs",       "/faq"],
  ["Shipping",   "/shipping"],
  ["Returns",    "/returns"],
  ["Privacy",    "/privacy"],
];

export const Footer = () => {
  return (
    <footer className="bg-[#1e2a1a] text-gray-200 w-full">

      {/* Feature Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4 px-5 sm:px-8 py-6 sm:py-8 border-r border-b border-white/10 last:border-r-0 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r">
              <div className="w-11 h-11 rounded-xl bg-[#3d6b35]/40 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-[#a8d878]" />
              </div>
              <div>
                <p className="text-base font-bold text-white">{title}</p>
                <p className="text-sm text-gray-400 mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8 sm:pb-12 grid md:grid-cols-2 gap-10 sm:gap-14">

        {/* Brand + Contact */}
        <div>
          <div className="mb-5">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-outfit leading-none">KAVIN</div>
            <div className="text-lg font-bold tracking-[0.3em] text-[#a8d878] mt-0.5">ORGANICS</div>
          </div>

          <p className="text-base text-gray-400 max-w-xs leading-relaxed mb-6">
            Helping you grow a greener home garden with quality seeds, fertilizers, pots and more.
          </p>

          <div className="flex flex-col gap-3">
            <a href="tel:+919876543210" className="flex items-center gap-3 bg-[#3d6b35]/30 hover:bg-[#3d6b35]/50 border border-[#3d6b35]/50 rounded-xl px-4 py-3 transition-colors w-fit">
              <Phone size={20} className="text-[#a8d878] shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Call us</p>
                <p className="text-base font-bold text-white">+91 98765 43210</p>
              </div>
            </a>
            <a href="mailto:hello@kavinorganics.in" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-colors w-fit">
              <Mail size={20} className="text-[#a8d878] shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Email us</p>
                <p className="text-base font-bold text-white">hello@kavinorganics.in</p>
              </div>
            </a>
          </div>

          <p className="text-sm text-gray-600 mt-6">© 2025 Kavin Organics. All Rights Reserved</p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Shop</p>
            <ul className="space-y-3">
              {shopLinks.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-base text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Guides</p>
            <ul className="space-y-3">
              {guideLinks.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-base text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Help</p>
            <ul className="space-y-3">
              {helpLinks.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-base text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14 border-t border-white/10 pt-8">
        <h3 className="text-lg font-bold text-white mb-1">Get Gardening Tips by Email</h3>
        <p className="text-base text-gray-400 mb-4">
          We'll send you seasonal planting tips, guides, and special offers.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 bg-white/8 border-2 border-white/15 rounded-xl px-4 py-3.5 text-base text-white placeholder:text-gray-500 outline-none focus:border-[#7a9e5f] transition-colors"
          />
          <button className="bg-[#3d6b35] hover:bg-[#335c2c] text-white px-6 py-3.5 rounded-xl text-base font-bold transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-3">We respect your privacy. Unsubscribe anytime.</p>

        <div className="flex gap-2 mt-6">
          {["VISA", "Mastercard", "UPI", "G Pay"].map((p) => (
            <span key={p} className="border border-white/15 px-3 py-1.5 rounded-lg text-xs text-gray-500 font-medium">
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};