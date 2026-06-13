"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Phone, Package, Leaf } from "lucide-react";
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
        <p className="text-[#7a7a68] mb-6 max-w-xs">
          We could not find this order. It may have expired from your browser.
        </p>
        <a href="tel:+919876543210"
          className="text-[#3d6b35] font-bold underline underline-offset-2">
          Call us: +91 98765 43210
        </a>
      </div>
    );
  }

  const estimatedDelivery = (() => {
    const d = new Date(order.date);
    d.setDate(d.getDate() + 4);
    return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  })();

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">

        {/* Success icon + heading */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#3d6b35] rounded-full mb-5 shadow-lg">
            <CheckCircle2 size={42} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#2a2a1e] font-outfit mb-2">Order Placed! 🎉</h1>
          <p className="text-[#5a5a48] text-base">
            Thank you, <strong>{order.address.name}</strong>. Your order is confirmed.
          </p>
        </div>

        {/* Order ID + delivery estimate */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#7a7a68] font-semibold">Order ID</span>
            <span className="font-mono font-black text-[#3d6b35] text-base">{order.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#7a7a68] font-semibold">Payment</span>
            <span className="text-sm font-bold text-[#2a2a1e]">{order.paymentMethod}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#7a7a68] font-semibold">Total Paid</span>
            <span className="text-lg font-black text-[#3d6b35]">₹{order.total.toLocaleString("en-IN")}</span>
          </div>
          <div className="pt-3 border-t border-[#f0ece4] flex items-center gap-2 text-sm text-[#3d6b35]">
            <Package size={15} className="shrink-0" />
            <span>Estimated delivery by <strong>{estimatedDelivery}</strong></span>
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5">
          <p className="text-xs font-bold text-[#7a7a68] uppercase tracking-wide mb-2">Delivering to</p>
          <p className="text-sm font-bold text-[#2a2a1e]">{order.address.name}</p>
          <p className="text-xs text-[#5a5a48] mt-0.5 leading-relaxed">
            {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""},
            {" "}{order.address.city}, {order.address.state} — {order.address.pincode}
          </p>
          <p className="text-xs text-[#5a5a48] mt-0.5">📞 {order.address.phone}</p>
        </div>

        {/* Items summary */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5">
          <p className="text-xs font-bold text-[#7a7a68] uppercase tracking-wide mb-3">
            Items ({order.items.length})
          </p>
          <div className="flex flex-col gap-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <p className="text-sm text-[#2a2a1e] font-medium leading-snug flex-1 truncate">
                  {item.name}
                  {item.variant ? <span className="text-[#7a7a68]"> · {item.variant}</span> : null}
                </p>
                <span className="text-xs text-[#7a7a68] shrink-0">×{item.quantity}</span>
                <span className="text-sm font-bold text-[#3d6b35] shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl px-5 py-4 flex items-center gap-3">
          <Phone size={18} className="text-[#3d6b35] shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#2a2a1e]">Questions about your order?</p>
            <a href="tel:+919876543210" className="text-base font-bold text-[#3d6b35] hover:underline">
              +91 98765 43210
            </a>
          </div>
        </div>

        {/* Single CTA */}
        <Link href="/shop"
          className="w-full flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] text-white font-bold text-base py-4 rounded-xl transition-colors shadow-md"
        >
          <Leaf size={18} />Continue Shopping
        </Link>

      </div>
    </div>
  );
}