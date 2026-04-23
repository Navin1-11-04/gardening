"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package, ChevronRight, ChevronDown, ChevronUp,
  Phone, ShoppingBag, Clock, MapPin, CreditCard,
  Truck, Search,
} from "lucide-react";
import { getAllOrders, StoredOrder } from "@/lib/orderStorage";

// ─── Helpers (inline — no longer imported from orderStorage) ─────────────────

function formatOrderDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending:    "Pending",
    confirmed:  "Confirmed",
    packed:     "Being Packed",
    shipped:    "Shipped",
    delivered:  "Delivered",
    cancelled:  "Cancelled",
    refunded:   "Refunded",
  };
  return map[status] ?? status;
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    packed:    "bg-purple-100 text-purple-700 border-purple-200",
    shipped:   "bg-indigo-100 text-indigo-700 border-indigo-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    refunded:  "bg-gray-100 text-gray-600 border-gray-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
}

// ─── Delivery timeline ────────────────────────────────────────────────────────

const TIMELINE = [
  { key: "confirmed", label: "Confirmed" },
  { key: "packed",    label: "Being Packed" },
  { key: "shipped",   label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

const MiniTimeline = ({ status }: { status: string }) => {
  const current = TIMELINE.findIndex((t) => t.key === status);
  return (
    <div className="flex items-center gap-1 mt-3">
      {TIMELINE.map((step, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className={`w-3 h-3 rounded-full shrink-0 border-2 transition-all ${
              done   ? "bg-[#3d6b35] border-[#3d6b35]" :
              active ? "bg-white border-[#3d6b35] shadow shadow-[#3d6b35]/30" :
                       "bg-white border-[#d4c9a8]"
            }`} />
            {i < TIMELINE.length - 1 && (
              <div className={`flex-1 h-0.5 ${i < current ? "bg-[#3d6b35]" : "bg-[#e8e0d0]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Local order card (from localStorage) ────────────────────────────────────

const OrderCard = ({ order }: { order: StoredOrder }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-black text-[#2a2a1e] tracking-wide">{order.id}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColor(order.status)}`}>
              {statusLabel(order.status)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#7a7a68] flex-wrap">
            <span className="flex items-center gap-1">
              <Clock size={12} />{formatOrderDate(order.date)}
            </span>
            <span>·</span>
            <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
            <span>·</span>
            <span className="font-bold text-[#3d6b35]">₹{order.total.toLocaleString("en-IN")}</span>
          </div>
          <MiniTimeline status={order.status} />
        </div>

        <div className="flex gap-1.5 shrink-0">
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#f5f0ea] border border-[#e8e0d0]">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="w-12 h-12 rounded-xl bg-[#f0ece4] border border-[#e8e0d0] flex items-center justify-center text-xs font-bold text-[#7a7a68]">
              +{order.items.length - 3}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3 border-t border-[#f0ece4] bg-[#faf7f2] hover:bg-[#f0ece4] transition-colors text-sm font-semibold text-[#5a5a48]"
      >
        <span>{expanded ? "Hide details" : "View details"}</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="border-t border-[#e8e0d0] flex flex-col divide-y divide-[#f0ece4]">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <Link
                href={`/shop/product/${item.id}`}
                className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#f5f0ea] border border-[#e8e0d0] shrink-0"
              >
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/shop/product/${item.id}`}>
                  <p className="text-sm font-bold text-[#2a2a1e] hover:text-[#3d6b35] transition-colors leading-snug">
                    {item.name}
                  </p>
                </Link>
                <p className="text-xs text-[#7a7a68] mt-0.5">{item.variant} × {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-[#3d6b35] shrink-0">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          ))}

          <div className="px-5 py-4 bg-[#faf7f2] flex flex-col gap-2">
            <div className="flex justify-between text-sm text-[#5a5a48]">
              <span>Subtotal</span>
              <span className="font-semibold">₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-sm text-[#3d6b35]">
                <span>Coupon discount</span>
                <span className="font-semibold">−₹{order.couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-[#3d6b35]">
              <span className="flex items-center gap-1"><Truck size={13} />Delivery</span>
              <span className="font-semibold">{order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-[#e8e0d0]">
              <span className="text-sm font-bold text-[#2a2a1e]">Total</span>
              <span className="text-lg font-black text-[#3d6b35]">₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-[#3d6b35]" />
                <span className="text-xs font-bold text-[#7a7a68] uppercase tracking-wide">Delivered to</span>
              </div>
              <p className="text-sm font-bold text-[#2a2a1e]">{order.address.name}</p>
              <p className="text-xs text-[#5a5a48] mt-0.5 leading-relaxed">
                {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""},
                {" "}{order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
              <p className="text-xs text-[#5a5a48] mt-0.5">📞 {order.address.phone}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={14} className="text-[#3d6b35]" />
                <span className="text-xs font-bold text-[#7a7a68] uppercase tracking-wide">Payment</span>
              </div>
              <p className="text-sm font-bold text-[#2a2a1e]">{order.paymentMethod}</p>
            </div>
          </div>

          <div className="px-5 py-4 bg-[#faf7f2] flex gap-3 flex-wrap">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <Phone size={15} />Track Order
            </a>
            <Link
              href="/shop"
              className="flex items-center gap-2 bg-white hover:bg-[#f5f0ea] border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3d6b35] font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              Buy Again
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── DB order card (fetched by phone from MongoDB) ────────────────────────────

interface DBOrder {
  _id: string; orderNumber: string; total: number; status: string;
  createdAt: string; items: any[]; address: any;
  subtotal: number; deliveryFee: number; paymentMethod: string;
}

const DBOrderCard = ({ order }: { order: DBOrder }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-black text-[#2a2a1e] tracking-wide">{order.orderNumber}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${statusColor(order.status)}`}>
              {statusLabel(order.status)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#7a7a68] flex-wrap">
            <span className="flex items-center gap-1">
              <Clock size={12} />{formatOrderDate(order.createdAt)}
            </span>
            <span>·</span>
            <span>{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}</span>
            <span>·</span>
            <span className="font-bold text-[#3d6b35]">₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3 border-t border-[#f0ece4] bg-[#faf7f2] hover:bg-[#f0ece4] transition-colors text-sm font-semibold text-[#5a5a48]"
      >
        <span>{expanded ? "Hide details" : "View details"}</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (order.items?.length ?? 0) > 0 && (
        <div className="border-t border-[#e8e0d0] px-5 py-4 flex flex-col gap-3">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              {item.image && (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#f5f0ea] shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#2a2a1e] truncate">{item.name}</p>
                <p className="text-xs text-[#7a7a68]">{item.variant ?? ""} × {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-[#3d6b35] shrink-0">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
          <div className="pt-3 border-t border-[#e8e0d0] flex justify-between items-baseline">
            <span className="text-sm font-bold text-[#2a2a1e]">Total</span>
            <span className="text-lg font-black text-[#3d6b35]">₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [localOrders, setLocalOrders] = useState<StoredOrder[]>([]);
  const [dbOrders,    setDbOrders]    = useState<DBOrder[]>([]);
  const [loaded,      setLoaded]      = useState(false);
  const [phone,       setPhone]       = useState("");
  const [searching,   setSearching]   = useState(false);
  const [dbError,     setDbError]     = useState("");
  const [dbSearched,  setDbSearched]  = useState(false);

  useEffect(() => {
    // getAllOrders is the correct export (returns StoredOrder[])
    setLocalOrders(getAllOrders());
    setLoaded(true);
  }, []);

  const handlePhoneSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = phone.trim();
    if (!q) return;
    setSearching(true);
    setDbError("");
    setDbSearched(false);
    try {
      const res  = await fetch(`/api/orders/track?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) { setDbError(data.error ?? "Search failed."); return; }
      setDbOrders(data.orders ?? []);
      setDbSearched(true);
    } catch {
      setDbError("Network error. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">My Orders</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#3d6b35] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Package size={20} className="text-white" />
            </div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Your account</p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-outfit leading-tight mb-2">My Orders</h1>
          <p className="text-white/75 text-base sm:text-lg">
            {loaded
              ? localOrders.length > 0
                ? `${localOrders.length} order${localOrders.length !== 1 ? "s" : ""} on this device`
                : "No orders on this device yet"
              : "Loading…"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Phone lookup */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 mb-8">
          <p className="text-base font-bold text-[#2a2a1e] mb-1">Find orders by phone number</p>
          <p className="text-sm text-[#7a7a68] mb-4">
            If you ordered from a different device, look up your orders using your mobile number.
          </p>
          <form onSubmit={handlePhoneSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a8a090]" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your 10-digit mobile number"
                type="tel"
                className="w-full pl-10 pr-4 py-3.5 bg-[#faf7f2] border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl text-sm text-[#2a2a1e] placeholder:text-[#b0a890] outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={searching || !phone.trim()}
              className="flex items-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] disabled:bg-[#a8c890] text-white font-bold text-sm px-5 py-3.5 rounded-xl transition-colors"
            >
              {searching
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <Search size={16} />}
              Search
            </button>
          </form>
          {dbError && <p className="text-sm text-red-600 font-semibold mt-2">{dbError}</p>}
        </div>

        {/* DB search results */}
        {dbSearched && (
          <div className="mb-8">
            <p className="text-sm font-bold text-[#2a2a1e] mb-3">
              {dbOrders.length > 0
                ? `Found ${dbOrders.length} order${dbOrders.length !== 1 ? "s" : ""} for that number:`
                : "No orders found for that phone number."}
            </p>
            {dbOrders.length > 0 && (
              <div className="flex flex-col gap-4">
                {dbOrders.map((order) => <DBOrderCard key={order._id} order={order} />)}
              </div>
            )}
          </div>
        )}

        {/* Local orders from this device */}
        {!loaded ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#e8e0d0] p-5 animate-pulse">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-5 bg-[#f0ece4] rounded-lg w-48" />
                    <div className="h-3 bg-[#f0ece4] rounded-lg w-64" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : localOrders.length === 0 && !dbSearched ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#eef5ea] border border-[#b8d4a0] flex items-center justify-center mb-5">
              <ShoppingBag size={36} className="text-[#3d6b35]" />
            </div>
            <h2 className="text-2xl font-bold text-[#2a2a1e] mb-2">No orders yet</h2>
            <p className="text-base text-[#7a7a68] mb-8 max-w-xs leading-relaxed">
              When you place an order it will appear here. You can also search by phone number above.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-base px-8 py-4 rounded-xl transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          localOrders.length > 0 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold text-[#2a2a1e]">Orders placed on this device:</p>
              {localOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              <div className="mt-4 bg-[#faf7f2] border border-[#d4c9a8] rounded-2xl px-5 py-4 flex items-start gap-3">
                <Phone size={18} className="text-[#3d6b35] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#2a2a1e]">Questions about an order?</p>
                  <p className="text-xs text-[#7a7a68] mt-0.5">
                    Call us with your Order ID for a full update.
                  </p>
                  <a
                    href="tel:+919876543210"
                    className="text-sm font-bold text-[#3d6b35] hover:underline mt-1 block"
                  >
                    📞 +91 98765 43210
                  </a>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}