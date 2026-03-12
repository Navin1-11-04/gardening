"use client";

import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-[#111] text-gray-300 w-full">

      {/* FEATURE BAR */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-8">

          <div className="bg-white/5 p-6 flex items-center gap-4">
            <Truck size={20} />
            <p className="text-sm">Free delivery on orders above ₹999</p>
          </div>

          <div className="bg-white/5 p-6 flex items-center gap-4">
            <RotateCcw size={20} />
            <p className="text-sm">Easy returns within 7 days</p>
          </div>

          <div className="bg-white/5 p-6 flex items-center gap-4">
            <ShieldCheck size={20} />
            <p className="text-sm">Secure payments & trusted checkout</p>
          </div>

          <div className="bg-white/5 p-6 flex items-center gap-4">
            <Headphones size={20} />
            <p className="text-sm">Garden support & plant guidance</p>
          </div>

        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">

        {/* BRAND */}
        <div>
          <h2 className="text-6xl font-bold text-white tracking-tight">
            KAVIN
          </h2>

          <p className="text-lg text-green-400 -mt-2">ORGANICS</p>

          <p className="text-sm mt-4 text-gray-400">
            Helping you grow a greener home garden with quality seeds,
            fertilizers, pots, and gardening essentials.
          </p>

          <p className="text-xs mt-6 text-gray-500">
            © 2025 Kavin Organics. All Rights Reserved
          </p>

          {/* payments */}
          <div className="flex gap-4 mt-10 text-xs text-gray-400">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>UPI</span>
            <span>G Pay</span>
          </div>
        </div>

        {/* LINKS */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* SHOP */}
          <div>
            <p className="text-xs text-gray-500 mb-4">(Shop)</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop/seeds">Seeds</Link></li>
              <li><Link href="/shop/grow-bags">Grow Bags</Link></li>
              <li><Link href="/shop/fertilizers">Fertilizers</Link></li>
              <li><Link href="/shop/pots">Pots</Link></li>
              <li><Link href="/shop/cocopeat">Coco Peat</Link></li>
            </ul>
          </div>

          {/* GARDEN GUIDES */}
          <div>
            <p className="text-xs text-gray-500 mb-4">(Guides)</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="#">How to Grow Tomatoes</Link></li>
              <li><Link href="#">Balcony Gardening</Link></li>
              <li><Link href="#">Using Cocopeat</Link></li>
              <li><Link href="#">Beginner Garden Tips</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <p className="text-xs text-gray-500 mb-4">(Help)</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/shipping">Shipping Policy</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

      </div>

      {/* NEWSLETTER */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <p className="text-sm mb-4">
          Get gardening tips, plant guides, and special offers delivered to your inbox.
        </p>

        <div className="flex max-w-md">
          <input
            type="email"
            placeholder="Your Email"
            className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none"
          />

          <button className="bg-white text-black px-6 text-sm font-medium">
            Subscribe
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          By subscribing, you agree to receive emails from Kavin Organics.
        </p>
      </div>

    </footer>
  );
};