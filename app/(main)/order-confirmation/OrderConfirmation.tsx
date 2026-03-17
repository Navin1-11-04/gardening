"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Truck,
  Phone,
  MapPin,
  Package,
  ArrowRight,
  Copy,
  Check,
  MessageSquare,
} from "lucide-react";

// ─── Mock order data ──────────────────────────────────────────────────────────

const order = {
  id: "KO-2025-48291",
  date: "Tuesday, 17 March 2025",
  paymentMethod: "Cash on Delivery",
  estimatedDelivery: "Friday, 21 March 2025",
  total: 897,
  deliveryFee: 0,
  couponDiscount: 99,
  subtotal: 996,
  address: {
    name: "Meenakshi Rajan",
    phone: "98765 43210",
    line1: "No. 12, Gandhi Nagar",
    line2: "Near Tamil Nadu Bank",
    city: "Namakkal",
    state: "Tamil Nadu",
    pincode: "637501",
  },
  items: [
    {
      id: 1,
      name: "Premium Vermicompost",
      variant: "5 kg × 2",
      price: 598,
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Terracotta Pot",
      variant: "8 inch × 1",
      price: 249,
      image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Premium Tomato Seeds",
      variant: "Standard pack × 1",
      price: 149,
      image: "https://images.unsplash.com/photo-1592919505780-303950717480?w=200&auto=format&fit=crop&q=80",
    },
  ],
};

const deliverySteps = [
  { label: "Order Placed", sublabel: "17 Mar", done: true, active: false },
  { label: "Being Packed", sublabel: "18 Mar", done: false, active: true },
  { label: "Out for Delivery", sublabel: "20–21 Mar", done: false, active: false },
  { label: "Delivered", sublabel: "Est. 21 Mar", done: false, active: false },
];

// ─── Animated checkmark component ────────────────────────────────────────────

const AnimatedCheck = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#3d6b35] flex items-center justify-center shadow-xl transition-all duration-700 ${
        visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
      }`}
    >
      <CheckCircle2
        size={52}
        className={`text-white transition-all duration-500 delay-300 ${
          visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        strokeWidth={1.8}
      />
    </div>
  );
};

// ─── Copy Order ID ────────────────────────────────────────────────────────────

const CopyOrderId = ({ id }: { id: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 bg-white border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3a3a2e] font-semibold text-sm px-4 py-2 rounded-xl transition-all active:scale-95"
    >
      {copied ? <Check size={15} className="text-[#3d6b35]" /> : <Copy size={15} />}
      {copied ? "Copied!" : "Copy Order ID"}
    </button>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* ── Hero confirmation banner ──────────────────── */}
      <div className="bg-[#3d6b35] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center text-center gap-5">
          <AnimatedCheck />

          <div>
            <h1 className="text-3xl sm:text-4xl font-black font-outfit mt-2 leading-tight">
              Your order is confirmed! 🎉
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mt-3 max-w-md leading-relaxed">
              Thank you, {order.address.name.split(" ")[0]}! We've received your order and will start packing it right away.
            </p>
          </div>

          {/* Order ID */}
          <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-3">
            <div className="text-center sm:text-left">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">Order ID</p>
              <p className="text-2xl font-black tracking-wide">{order.id}</p>
            </div>
            <div className="sm:ml-4">
              <CopyOrderId id={order.id} />
            </div>
          </div>

          <p className="text-white/70 text-sm">
            Placed on {order.date} · We'll send updates to your phone
          </p>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-6">

        {/* Delivery Timeline */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#eef5ea] flex items-center justify-center shrink-0">
              <Truck size={20} className="text-[#3d6b35]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2a2a1e]">Delivery Tracking</h2>
              <p className="text-sm text-[#7a7a68]">Estimated by {order.estimatedDelivery}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-start gap-0">
            {deliverySteps.map((step, i) => (
              <div key={step.label} className="flex-1 flex flex-col items-center">
                {/* Node + connector row */}
                <div className="flex items-center w-full">
                  {/* Left connector */}
                  <div className={`flex-1 h-1 rounded-full ${i === 0 ? "bg-transparent" : step.done || (deliverySteps[i - 1]?.done) ? "bg-[#3d6b35]" : "bg-[#e8e0d0]"}`} />
                  {/* Circle */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    step.done
                      ? "bg-[#3d6b35] border-[#3d6b35]"
                      : step.active
                        ? "bg-white border-[#3d6b35] shadow-md shadow-[#3d6b35]/20"
                        : "bg-white border-[#e8e0d0]"
                  }`}>
                    {step.done ? (
                      <Check size={16} className="text-white" />
                    ) : step.active ? (
                      <div className="w-3 h-3 rounded-full bg-[#3d6b35] animate-pulse" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#d4c9a8]" />
                    )}
                  </div>
                  {/* Right connector */}
                  <div className={`flex-1 h-1 rounded-full ${i === deliverySteps.length - 1 ? "bg-transparent" : step.done ? "bg-[#3d6b35]" : "bg-[#e8e0d0]"}`} />
                </div>

                {/* Labels */}
                <div className="mt-2.5 text-center px-1">
                  <p className={`text-xs sm:text-sm font-bold leading-tight ${
                    step.done ? "text-[#3d6b35]" : step.active ? "text-[#2a2a1e]" : "text-[#a8a090]"
                  }`}>
                    {step.label}
                  </p>
                  <p className={`text-[10px] sm:text-xs mt-0.5 ${step.active ? "text-[#3d6b35] font-semibold" : "text-[#b0a890]"}`}>
                    {step.sublabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#eef5ea] flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-[#3d6b35]" />
            </div>
            <h2 className="text-lg font-bold text-[#2a2a1e]">Delivering to</h2>
          </div>
          <p className="text-base font-bold text-[#2a2a1e]">{order.address.name}</p>
          <p className="text-sm text-[#5a5a48] mt-1 leading-relaxed">
            {order.address.line1}, {order.address.line2},<br />
            {order.address.city}, {order.address.state} — {order.address.pincode}
          </p>
          <p className="text-sm text-[#5a5a48] mt-1">📞 {order.address.phone}</p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-[#f0ece4] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef5ea] flex items-center justify-center shrink-0">
              <Package size={20} className="text-[#3d6b35]" />
            </div>
            <h2 className="text-lg font-bold text-[#2a2a1e]">
              Order Items ({order.items.length})
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-[#f0ece4]">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 sm:px-6 py-4">
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-[#f5f0ea] shrink-0 border border-[#e8e0d0]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-[#2a2a1e] leading-snug">{item.name}</p>
                  <p className="text-sm text-[#7a7a68] mt-0.5">{item.variant}</p>
                </div>
                <p className="text-lg font-black text-[#3d6b35] shrink-0">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          {/* Price summary */}
          <div className="px-5 sm:px-6 py-5 bg-[#faf7f2] border-t border-[#e8e0d0] flex flex-col gap-2.5">
            <div className="flex justify-between text-sm text-[#5a5a48]">
              <span>Subtotal</span>
              <span className="font-semibold">₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm text-[#3d6b35]">
              <span>Coupon discount</span>
              <span className="font-semibold">−₹{order.couponDiscount}</span>
            </div>
            <div className="flex justify-between text-sm text-[#3d6b35]">
              <span className="flex items-center gap-1.5">
                <Truck size={14} />Delivery
              </span>
              <span className="font-bold">FREE</span>
            </div>
            <div className="flex justify-between items-baseline pt-2.5 border-t border-[#e8e0d0]">
              <span className="text-lg font-bold text-[#2a2a1e]">
                {order.paymentMethod === "Cash on Delivery" ? "Amount to Pay on Delivery" : "Total Paid"}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#3d6b35]">
                ₹{order.total.toLocaleString("en-IN")}
              </span>
            </div>
            {order.paymentMethod === "Cash on Delivery" && (
              <div className="flex items-start gap-3 mt-1 bg-[#fff8ee] border border-[#f0d080] rounded-xl p-3">
                <span className="text-lg shrink-0">💰</span>
                <p className="text-sm text-[#7a5c1e] leading-snug">
                  Please keep <strong>₹{order.total.toLocaleString("en-IN")}</strong> in cash ready when our delivery partner arrives.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[#2a2a1e] mb-5">What happens next?</h2>
          <div className="flex flex-col gap-4">
            {[
              { icon: "📦", title: "We pack your order", desc: "Our team will carefully pack your items by tomorrow morning." },
              { icon: "🚚", title: "We ship it out", desc: "Your order will be handed to our delivery partner within 1–2 days." },
              { icon: "📞", title: "You'll get a call", desc: "Our delivery partner will call before arriving at your address." },
              { icon: "🌿", title: "Happy gardening!", desc: "Start growing with your fresh garden supplies. We're here if you need help." },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#faf7f2] border border-[#e8e0d0] flex items-center justify-center text-lg shrink-0">
                  {step.icon}
                </div>
                <div>
                  <p className="text-base font-bold text-[#2a2a1e]">{step.title}</p>
                  <p className="text-sm text-[#5a5a48] mt-0.5 leading-snug">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help card */}
        <div className="bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[#2a2a1e] mb-1">Need help with your order?</h2>
          <p className="text-base text-[#5a5a48] mb-5 leading-relaxed">
            Our team is always happy to help — whether it's about your delivery, products, or gardening advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+919876543210"
              className="flex-1 flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-base py-3.5 rounded-xl transition-colors"
            >
              <Phone size={18} />
              Call Us: +91 98765 43210
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-[#f5f0ea] border-2 border-[#b8d4a0] text-[#3d6b35] font-bold text-base py-3.5 rounded-xl transition-colors"
            >
              <MessageSquare size={18} />
              WhatsApp Us
            </a>
          </div>
          <p className="text-xs text-[#7a7a68] mt-3 text-center">Mon–Sat, 9am–6pm · Have your Order ID ready: {order.id}</p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-base py-4 rounded-xl transition-colors shadow-md"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-[#faf7f2] border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3a3a2e] font-bold text-base py-4 rounded-xl transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}