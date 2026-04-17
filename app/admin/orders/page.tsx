"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search, RefreshCw, Eye, ChevronDown, X,
  Package, Truck, CheckCircle2, Clock,
  MapPin, Phone, CreditCard, AlertCircle,
} from "lucide-react";

interface OrderItem { name: string; quantity: number; price: number; image?: string; variant?: string; }
interface Address { name: string; phone: string; line1: string; line2?: string; city: string; state: string; pincode: string; }
interface Order {
  _id: string; orderNumber: string; customerName: string; customerPhone: string;
  total: number; subtotal: number; deliveryFee: number; status: string;
  paymentMethod: string; createdAt: string; items: OrderItem[]; address: Address;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" }, { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" }, { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" }, { value: "cancelled", label: "Cancelled" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800", confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800", shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-700",
};

const NEXT_STATUS: Record<string, string[]> = {
  pending: ["processing","cancelled"], confirmed: ["processing","cancelled"],
  processing: ["shipped","cancelled"], shipped: ["delivered"],
  delivered: ["refunded"], cancelled: [], refunded: [],
};

function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

function Modal({ order, onClose, onUpdate }: { order: Order; onClose: () => void; onUpdate: (id: string, s: string) => Promise<void>; }) {
  const [updating, setUpdating] = useState<string | null>(null);
  const next = NEXT_STATUS[order.status] ?? [];
  const handle = async (s: string) => { setUpdating(s); await onUpdate(order._id, s); setUpdating(null); };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0ece4] sticky top-0 bg-white z-10">
          <div>
            <p className="text-xs text-[#7a9e6a] font-bold uppercase tracking-wide">Order Details</p>
            <p className="text-lg font-black text-[#1e3d18] font-mono">{order.orderNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <button onClick={onClose} className="p-2 hover:bg-[#f0f4ed] rounded-lg"><X size={18} className="text-[#5a8a50]" /></button>
          </div>
        </div>
        <div className="p-5 flex flex-col gap-5">
          {next.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide mb-2">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {next.map((s) => (
                  <button key={s} onClick={() => handle(s)} disabled={!!updating}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#3d6b35] hover:bg-[#2e5228] disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all">
                    {updating === s ? <RefreshCw size={13} className="animate-spin" /> : <Package size={13} />} Mark as {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#f8faf6] rounded-xl p-4">
              <p className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide mb-2 flex items-center gap-1.5"><Phone size={12}/>Customer</p>
              <p className="text-sm font-bold text-[#2a2a1e]">{order.customerName}</p>
              <a href={`tel:${order.customerPhone}`} className="text-sm text-[#3d6b35] font-semibold hover:underline">{order.customerPhone}</a>
            </div>
            <div className="bg-[#f8faf6] rounded-xl p-4">
              <p className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide mb-2 flex items-center gap-1.5"><CreditCard size={12}/>Payment</p>
              <p className="text-sm font-bold text-[#2a2a1e]">{order.paymentMethod}</p>
              <p className="text-xs text-[#7a9e6a]">{new Date(order.createdAt).toLocaleString("en-IN", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}</p>
            </div>
          </div>
          {order.address?.line1 && (
            <div className="bg-[#f8faf6] rounded-xl p-4">
              <p className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide mb-2 flex items-center gap-1.5"><MapPin size={12}/>Delivery Address</p>
              <p className="text-sm font-bold text-[#2a2a1e]">{order.address.name}</p>
              <p className="text-xs text-[#5a5a48] mt-0.5 leading-relaxed">
                {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br/>
                {order.address.city}, {order.address.state} — {order.address.pincode}<br/>📞 {order.address.phone}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide mb-3">Items ({order.items?.length ?? 0})</p>
            <div className="bg-white border border-[#dce8d4] rounded-xl overflow-hidden">
              {(order.items ?? []).map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[#f0f4ed] last:border-0">
                  {item.image && <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#f5f0ea] shrink-0"><Image src={item.image} alt={item.name} fill className="object-cover"/></div>}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#2a2a1e] truncate">{item.name}</p>
                    <p className="text-xs text-[#7a9e6a]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#3d6b35] shrink-0">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
              <div className="px-4 py-3 bg-[#f8faf6] flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-[#5a5a48]"><span>Subtotal</span><span className="font-semibold">₹{order.subtotal?.toLocaleString("en-IN") ?? "—"}</span></div>
                <div className="flex justify-between text-xs text-[#3d6b35]"><span>Delivery</span><span className="font-semibold">{(order.deliveryFee ?? 0) === 0 ? "FREE" : `₹${order.deliveryFee}`}</span></div>
                <div className="flex justify-between items-baseline pt-1.5 border-t border-[#dce8d4]">
                  <span className="text-sm font-bold text-[#1e3d18]">Total</span>
                  <span className="text-base font-black text-[#3d6b35]">₹{order.total?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error();
      setOrders(await res.json());
    } catch { setError("Could not load orders."); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) { alert("Failed to update status."); return; }
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
    setSelected((prev) => prev && prev._id === id ? { ...prev, status } : prev);
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.orderNumber?.toLowerCase().includes(q) || o.customerName?.toLowerCase().includes(q) || o.customerPhone?.includes(q);
    return matchStatus && matchSearch;
  });

  const revenue = orders.filter((o) => !["cancelled","refunded"].includes(o.status)).reduce((s, o) => s + (o.total ?? 0), 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: orders.length, icon: Package },
          { label: "Pending", value: orders.filter((o) => ["pending","confirmed"].includes(o.status)).length, icon: Clock },
          { label: "In Transit", value: orders.filter((o) => ["processing","shipped"].includes(o.status)).length, icon: Truck },
          { label: "Delivered", value: orders.filter((o) => o.status === "delivered").length, icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-[#dce8d4] px-4 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-[#eef7e6] rounded-xl flex items-center justify-center">
              <Icon size={18} className="text-[#3d6b35]" />
            </div>
            <div>
              <p className="text-xs text-[#9ab890] font-semibold">{label}</p>
              <p className="text-xl font-black text-[#1e3d18]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1e3d18] rounded-xl px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-[#7ab648] font-bold uppercase tracking-wide">Total Revenue</p>
          <p className="text-2xl font-black text-white">₹{revenue.toLocaleString("en-IN")}</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-3 py-2 rounded-xl transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ab890]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order #, name or phone…"
            className="w-full pl-10 pr-4 py-2.5 border border-[#dce8d4] bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-[#dce8d4] rounded-xl pl-4 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] cursor-pointer">
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ab890] pointer-events-none" />
        </div>
      </div>

      {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700"><AlertCircle size={14}/>{error}</div>}

      <div className="bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8faf6] border-b border-[#dce8d4]">
                {["Order #","Customer","Items","Total","Status","Date",""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center">
                  <RefreshCw size={20} className="animate-spin text-[#3d6b35] mx-auto mb-2" />
                  <p className="text-sm text-[#9ab890]">Loading orders…</p>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-[#9ab890]">No orders found.</td></tr>
              ) : filtered.map((order) => (
                <tr key={order._id} className="border-b border-[#f0f4ed] hover:bg-[#fafcf8] transition-colors">
                  <td className="px-4 py-3 text-xs font-mono font-bold text-[#1e3d18] whitespace-nowrap">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-[#2a2a1e] truncate max-w-[140px]">{order.customerName}</p>
                    <p className="text-xs text-[#9ab890]">{order.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#5a8a50]">{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}</td>
                  <td className="px-4 py-3 text-sm font-bold text-[#3d6b35] whitespace-nowrap">₹{order.total?.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-xs text-[#9ab890] whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(order)} className="p-2 hover:bg-[#eef7e6] text-[#3d6b35] rounded-lg transition-colors" title="View">
                      <Eye size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <Modal order={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}
    </div>
  );
}