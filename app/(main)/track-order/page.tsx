"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search, Package, Truck, CheckCircle2, Clock,
  XCircle, ChevronRight, Phone, MapPin, RefreshCw,
} from "lucide-react";

interface OrderItem {
  name: string; quantity: number; price: number; image?: string; variant?: string;
}

interface OrderAddress {
  name: string; phone: string; line1: string; line2?: string;
  city: string; state: string; pincode: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  total: number;
  deliveryFee: number;
  subtotal: number;
  paymentMethod: string;
  items: OrderItem[];
  address: OrderAddress;
}

const STATUS_STEPS = [
  { key: "pending",    label: "Order Placed",  icon: Clock,          color: "#f59e0b" },
  { key: "processing", label: "Processing",    icon: Package,        color: "#3b82f6" },
  { key: "shipped",    label: "Shipped",       icon: Truck,          color: "#8b5cf6" },
  { key: "delivered",  label: "Delivered",     icon: CheckCircle2,   color: "#22c55e" },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "Order Placed",  color: "#7a5c1e", bg: "#fff8ee" },
  processing: { label: "Processing",   color: "#1e40af", bg: "#eff6ff" },
  confirmed:  { label: "Confirmed",    color: "#1e40af", bg: "#eff6ff" },
  shipped:    { label: "Shipped 🚚",   color: "#6d28d9", bg: "#f5f3ff" },
  delivered:  { label: "Delivered ✅", color: "#15803d", bg: "#f0fdf4" },
  cancelled:  { label: "Cancelled",    color: "#b91c1c", bg: "#fef2f2" },
  refunded:   { label: "Refunded",     color: "#374151", bg: "#f3f4f6" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, color: "#374151", bg: "#f3f4f6" };
  return (
    <span className="px-3 py-1.5 rounded-full text-sm font-bold"
      style={{ color: s.color, backgroundColor: s.bg }}>
      {s.label}
    </span>
  );
}

function ProgressBar({ status }: { status: string }) {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  if (idx < 0) return null;

  return (
    <div className="flex items-center gap-0 w-full overflow-x-auto py-2">
      {STATUS_STEPS.map((step, i) => {
        const done   = i <= idx;
        const active = i === idx;
        const Icon   = step.icon;
        return (
          <div key={step.key} className="flex items-center flex-1 min-w-0">
            <div className={`flex flex-col items-center gap-1.5 ${i > 0 ? "flex-1" : ""}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                done
                  ? "bg-[#3d6b35] border-[#3d6b35]"
                  : "bg-white border-[#d4c9a8]"
              }`}>
                <Icon size={18} className={done ? "text-white" : "text-[#b0a890]"} />
              </div>
              <span className={`text-xs font-bold text-center leading-tight whitespace-nowrap ${done ? "text-[#3d6b35]" : "text-[#b0a890]"}`}>
                {step.label}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 -mt-5 ${i < idx ? "bg-[#3d6b35]" : "bg-[#e8e0d0]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TrackOrderPage() {
  const [query,   setQuery]   = useState("");
  const [loading, setLoading] = useState(false);
  const [orders,  setOrders]  = useState<Order[] | null>(null);
  const [error,   setError]   = useState("");

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setError("");
    setOrders(null);

    try {
      const res = await fetch(
        `/api/orders/track?q=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      if (!data.orders?.length) { setError("No orders found for that search."); return; }
      setOrders(data.orders);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35]">Home</Link>
          <ChevronRight size={13} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">Track Order</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📦</div>
          <h1 className="text-3xl font-black text-[#2a2a1e] font-outfit mb-2">Track Your Order</h1>
          <p className="text-[#7a7a68] text-base">Enter your order number or the mobile number used at checkout.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a8a090]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order # or mobile number"
              className="w-full pl-11 pr-4 py-4 bg-white border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-2xl text-sm text-[#2a2a1e] placeholder:text-[#a8a090] outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] disabled:bg-[#a8c890] text-white font-bold px-6 rounded-2xl transition-all shadow-md"
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-700 text-sm">
            <XCircle size={18} className="shrink-0" /> {error}
          </div>
        )}

        {/* Results */}
        {orders && orders.map((order) => (
          <div key={order._id} className="bg-white border border-[#e8e0d0] rounded-2xl overflow-hidden mb-5">
            {/* Order header */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#f8faf6] border-b border-[#e8e0d0] flex-wrap gap-3">
              <div>
                <p className="text-xs text-[#7a9e6a] font-bold uppercase tracking-wide">Order</p>
                <p className="text-lg font-black text-[#2a2a1e] font-mono">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={order.status} />
                <p className="text-xs text-[#a8a090] mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            {["pending","processing","confirmed","shipped","delivered"].includes(order.status) && (
              <div className="px-5 py-5 border-b border-[#f0ece4]">
                <ProgressBar status={order.status === "confirmed" ? "processing" : order.status} />
              </div>
            )}

            {/* Items */}
            <div className="divide-y divide-[#f0ece4]">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  {item.image && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#f5f0ea] shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  )}
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
            </div>

            {/* Order totals */}
            <div className="px-5 py-4 bg-[#faf7f2] border-t border-[#e8e0d0] flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-[#5a5a48]"><span>Subtotal</span><span className="font-semibold">₹{order.subtotal?.toLocaleString("en-IN") ?? "—"}</span></div>
              <div className="flex justify-between text-xs text-[#3d6b35]">
                <span className="flex items-center gap-1"><Truck size={11} />Delivery</span>
                <span className="font-semibold">{(order.deliveryFee ?? 0) === 0 ? "FREE" : `₹${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#e8e0d0]">
                <span className="text-sm font-bold text-[#2a2a1e]">Total Paid</span>
                <span className="text-lg font-black text-[#3d6b35]">₹{order.total?.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Delivery address */}
            {order.address?.line1 && (
              <div className="px-5 py-4 border-t border-[#f0ece4]">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={14} className="text-[#3d6b35]" />
                  <span className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide">Delivering to</span>
                </div>
                <p className="text-sm font-semibold text-[#2a2a1e]">{order.address.name} · 📞 {order.address.phone}</p>
                <p className="text-xs text-[#5a5a48] mt-0.5">
                  {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""},{" "}
                  {order.address.city}, {order.address.state} — {order.address.pincode}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Help */}
        <div className="mt-8 bg-white border border-[#e8e0d0] rounded-2xl px-5 py-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-[#eef5ea] rounded-xl flex items-center justify-center shrink-0">
            <Phone size={18} className="text-[#3d6b35]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#2a2a1e]">Can't find your order?</p>
            <p className="text-xs text-[#7a7a68] mt-0.5 mb-2">
              If you placed your order over WhatsApp or phone, it may not appear here. Contact us directly.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="tel:+919876543210" className="text-sm font-bold text-[#3d6b35] hover:underline">📞 +91 98765 43210</a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#3d6b35] hover:underline">💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}