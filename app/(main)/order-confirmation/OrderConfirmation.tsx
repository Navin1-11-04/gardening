"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2, Truck, Package, Phone, ChevronRight, Leaf,
} from "lucide-react";
import { getOrder } from "@/lib/orderStorage";

interface StoredOrder {
  id: string;
  date: string;
  status: string;
  paymentMethod: string;
  address: {
    name: string; phone: string; line1: string;
    line2?: string; city: string; state: string; pincode: string;
  };
  items: {
    id: number; name: string; variant?: string;
    price: number; quantity: number; image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  couponDiscount: number;
  total: number;
}

export default function OrderConfirmationPage() {
  const params  = useSearchParams();
  const orderId = params.get("id");
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    if (orderId) {
      const found = getOrder(orderId);
      if (found) setOrder(found as StoredOrder);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4 text-center py-20">
        <div className="text-6xl mb-5">📦</div>
        <h2 className="text-2xl font-bold text-[#2a2a1e] mb-3">Order not found</h2>
        <p className="text-[#7a7a68] mb-6">We couldn't find this order. It may have expired from your browser.</p>
        <Link href="/track-order" className="text-[#3d6b35] font-bold underline underline-offset-2">Track your order →</Link>
      </div>
    );
  }

  const estimatedDelivery = (() => {
    const d = new Date(order.date);
    d.setDate(d.getDate() + 4);
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  })();

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Success Banner */}
      <div className="bg-[#1e3d18] pt-12 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3d6b35] opacity-20 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#7ab648] opacity-10 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#7ab648] rounded-full mb-5 shadow-2xl shadow-[#7ab648]/30">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Order Confirmed! 🎉</h1>
          <p className="text-[#a0d878] text-base mb-4">
            Thank you, <strong>{order.address.name}</strong>! We're getting your plants ready.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-5 py-2.5">
            <Package size={16} className="text-[#7ab648]" />
            <span className="text-white font-mono font-bold text-base tracking-wider">{order.id}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-6 pb-16">
        {/* Delivery estimate card */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 mb-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-[#eef5ea] rounded-xl flex items-center justify-center shrink-0">
            <Truck size={24} className="text-[#3d6b35]" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-[#7a9e6a] uppercase tracking-wide">Estimated Delivery</p>
            <p className="text-lg font-bold text-[#2a2a1e]">{estimatedDelivery}</p>
          </div>
          <Link href="/track-order"
            className="text-sm font-bold text-[#3d6b35] hover:underline flex items-center gap-1 shrink-0"
          >
            Track <ChevronRight size={14} />
          </Link>
        </div>

        {/* WhatsApp notice */}
        <div className="bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl px-5 py-4 mb-5 flex items-start gap-3">
          <span className="text-xl shrink-0">💬</span>
          <div>
            <p className="text-sm font-bold text-[#1e3d18]">Check your WhatsApp</p>
            <p className="text-xs text-[#5a7a50] mt-0.5">
              We've sent your order details to your mobile number. You'll get another message when your order ships!
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden mb-5">
          <div className="px-5 py-4 border-b border-[#f0ece4] bg-[#f8faf6]">
            <h2 className="text-base font-bold text-[#2a2a1e]">Items Ordered</h2>
          </div>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#f0ece4] last:border-0">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#f5f0ea] shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#2a2a1e] truncate">{item.name}</p>
                {item.variant && <p className="text-xs text-[#7a7a68]">{item.variant}</p>}
                <p className="text-xs text-[#7a7a68]">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-[#3d6b35] shrink-0">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
          {/* Totals */}
          <div className="px-5 py-4 bg-[#faf7f2] flex flex-col gap-2">
            <div className="flex justify-between text-xs text-[#5a5a48]">
              <span>Subtotal</span><span className="font-semibold">₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-xs text-[#3d6b35]">
                <span>Coupon discount</span><span className="font-semibold">−₹{order.couponDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-[#3d6b35]">
              <span className="flex items-center gap-1"><Truck size={11} />Delivery</span>
              <span className="font-semibold">{order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-[#e8e0d0]">
              <span className="text-sm font-bold text-[#2a2a1e]">Total Paid</span>
              <span className="text-xl font-black text-[#3d6b35]">₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 mb-5">
          <h2 className="text-sm font-bold text-[#2a2a1e] mb-3 uppercase tracking-wide">Delivering to</h2>
          <p className="text-sm font-bold text-[#2a2a1e]">{order.address.name}</p>
          <p className="text-xs text-[#5a5a48] mt-1 leading-relaxed">
            {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br />
            {order.address.city}, {order.address.state} — {order.address.pincode}<br />
            📞 {order.address.phone}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#5a5a48]">
            <span className="w-2 h-2 rounded-full bg-[#3d6b35]" />
            Payment: {order.paymentMethod}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop"
            className="flex-1 flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] text-white font-bold py-4 rounded-xl transition-all shadow-md"
          >
            <Leaf size={18} />Continue Shopping
          </Link>
          <Link href="/track-order"
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3d6b35] font-bold py-4 rounded-xl transition-all"
          >
            <Package size={18} />Track Order
          </Link>
        </div>

        {/* Help */}
        <div className="mt-5 text-center">
          <p className="text-xs text-[#a8a090] mb-1">Questions about your order?</p>
          <a href="tel:+919876543210" className="text-sm font-bold text-[#3d6b35] flex items-center gap-1 justify-center">
            <Phone size={14} />+91 98765 43210
          </a>
        </div>
      </div>
    </div>
  );
}