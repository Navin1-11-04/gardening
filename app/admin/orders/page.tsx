"use client";

import { useState, useEffect } from "react";
import {
  Search, Filter, Eye, AlertCircle, RefreshCw,
  X, MapPin, CreditCard, Package, Truck, Check,
  Clock, XCircle, CheckCircle2,
} from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items?: OrderItem[];
  address?: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: "Pending",    color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700 border-blue-200",       icon: Package },
  shipped:    { label: "Shipped",    color: "bg-purple-100 text-purple-700 border-purple-200", icon: Truck },
  delivered:  { label: "Delivered",  color: "bg-green-100 text-green-700 border-green-200",    icon: CheckCircle2 },
  cancelled:  { label: "Cancelled",  color: "bg-red-100 text-red-700 border-red-200",          icon: XCircle },
  refunded:   { label: "Refunded",   color: "bg-gray-100 text-gray-600 border-gray-200",       icon: RefreshCw },
};

const STATUS_ORDER = ["pending", "processing", "shipped", "delivered"];

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderModal({
  order,
  onClose,
  onStatusUpdate,
}: {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [detail, setDetail] = useState<Order>(order);

  useEffect(() => {
    // Fetch full order details (with items + address)
    fetch(`/api/admin/orders/${order.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setDetail(data); })
      .catch(() => {});
  }, [order.id]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setDetail((prev) => ({ ...prev, status: newStatus }));
        onStatusUpdate(order.id, newStatus);
      }
    } catch {}
    setUpdating(false);
  };

  const cfg = STATUS_CONFIG[detail.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;
  const currentIdx = STATUS_ORDER.indexOf(detail.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1e3d18] px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[#7ab648] text-xs font-bold uppercase tracking-wider mb-1">Order Details</p>
            <h2 className="text-xl font-black text-white">{detail.orderNumber}</h2>
            <p className="text-white/60 text-xs mt-1">
              {new Date(detail.createdAt).toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Status badge + update */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border ${cfg.color}`}>
                <StatusIcon size={14} />
                {cfg.label}
              </span>
              {updating && <RefreshCw size={14} className="animate-spin text-[#3d6b35]" />}
            </div>

            {/* Timeline progress (for non-cancelled) */}
            {detail.status !== "cancelled" && detail.status !== "refunded" && (
              <div className="flex items-center gap-0 mb-4">
                {STATUS_ORDER.map((s, i) => {
                  const done = i <= currentIdx;
                  const StatusCfg = STATUS_CONFIG[s];
                  const SIcon = StatusCfg.icon;
                  return (
                    <div key={s} className="flex items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                        done ? "bg-[#3d6b35] border-[#3d6b35]" : "bg-white border-[#dce8d4]"
                      }`}>
                        {done
                          ? <Check size={14} className="text-white" />
                          : <SIcon size={12} className="text-[#b0c8a0]" />}
                      </div>
                      {i < STATUS_ORDER.length - 1 && (
                        <div className={`flex-1 h-1 ${i < currentIdx ? "bg-[#3d6b35]" : "bg-[#dce8d4]"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Status update buttons */}
            <div className="flex flex-wrap gap-2">
              <p className="text-xs font-bold text-[#7a9e6a] uppercase tracking-wider w-full mb-1">Update Status:</p>
              {Object.entries(STATUS_CONFIG).map(([status, { label, icon: Icon }]) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating || detail.status === status}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    detail.status === status
                      ? "bg-[#3d6b35] text-white border-[#3d6b35]"
                      : "bg-white text-[#5a8a50] border-[#dce8d4] hover:border-[#3d6b35] hover:text-[#3d6b35]"
                  }`}
                >
                  <Icon size={11} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer + Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#f0f4ed] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-[#3d6b35]" />
                <p className="text-xs font-bold text-[#5a8a50] uppercase tracking-wide">Delivery Address</p>
              </div>
              {detail.address ? (
                <>
                  <p className="text-sm font-bold text-[#1e3d18]">{detail.address.name}</p>
                  <p className="text-xs text-[#7a9e6a] mt-0.5 leading-relaxed">
                    {detail.address.line1}
                    {detail.address.line2 ? `, ${detail.address.line2}` : ""},{" "}
                    {detail.address.city}, {detail.address.state} — {detail.address.pincode}
                  </p>
                  <p className="text-xs text-[#7a9e6a] mt-0.5">📞 {detail.address.phone}</p>
                </>
              ) : (
                <p className="text-xs text-[#9ab890]">{detail.customerName}</p>
              )}
            </div>

            <div className="bg-[#f0f4ed] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={14} className="text-[#3d6b35]" />
                <p className="text-xs font-bold text-[#5a8a50] uppercase tracking-wide">Payment</p>
              </div>
              <p className="text-sm font-bold text-[#1e3d18]">{detail.paymentMethod}</p>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-xs text-[#7a9e6a]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1e3d18]">₹{(detail.subtotal ?? detail.total).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs text-[#7a9e6a]">
                  <span>Delivery</span>
                  <span className="font-semibold text-[#3d6b35]">
                    {(detail.deliveryFee ?? 0) === 0 ? "FREE" : `₹${detail.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#1e3d18] pt-1 border-t border-[#dce8d4]">
                  <span>Total</span>
                  <span className="text-[#3d6b35]">₹{detail.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          {detail.items && detail.items.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#5a8a50] uppercase tracking-wider mb-3">
                Order Items ({detail.items.length})
              </p>
              <div className="space-y-2">
                {detail.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#f0f4ed] rounded-xl p-3">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1e3d18] truncate">{item.name}</p>
                      <p className="text-xs text-[#7a9e6a]">{item.variant} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-[#3d6b35] shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-[#f0f4ed] border-t border-[#dce8d4] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#3d6b35] hover:bg-[#2d5228] text-white font-bold text-sm rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders,       setOrders]       = useState<Order[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder,setSelectedOrder]= useState<Order | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) setOrders(await res.json());
    } catch {}
    setLoading(false);
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const stats = {
    total:     orders.length,
    pending:   orders.filter((o) => o.status === "pending").length,
    shipped:   orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1e3d18]">Orders</h2>
          <p className="text-sm text-[#7a9e6a] mt-0.5">{orders.length} orders total</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 border border-[#dce8d4] bg-white rounded-xl text-[#3d6b35] hover:bg-[#f0f4ed] transition-colors text-sm font-semibold self-start"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Orders", value: stats.total,     color: "text-[#1e3d18]" },
          { label: "Pending",      value: stats.pending,   color: "text-amber-600" },
          { label: "Shipped",      value: stats.shipped,   color: "text-purple-600" },
          { label: "Delivered",    value: stats.delivered, color: "text-green-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#dce8d4] px-4 py-3">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-[#7a9e6a] font-semibold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ab890]" />
          <input
            type="text"
            placeholder="Search by order ID or customer name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-[#7a9e6a]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw size={24} className="animate-spin text-[#3d6b35] mx-auto mb-3" />
            <p className="text-[#7a9e6a] text-sm">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle size={32} className="text-[#b0c8a0] mx-auto mb-3" />
            <p className="text-[#7a9e6a] font-semibold">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f0f4ed] border-b border-[#dce8d4]">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider">Order</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-[#5a8a50] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f8f2]">
                {filtered.map((order) => {
                  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={order.id} className="hover:bg-[#fafcf8] transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-[#1e3d18]">{order.orderNumber}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#5a8a50] font-medium">{order.customerName}</td>
                      <td className="px-5 py-4 text-sm font-black text-[#3d6b35]">
                        ₹{order.total.toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                          <StatusIcon size={11} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#9ab890]">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-[#f0f4ed] text-[#3d6b35] rounded-lg transition-colors"
                          title="View & update order"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 bg-[#f0f4ed] border-t border-[#dce8d4] text-xs text-[#7a9e6a]">
            Showing {filtered.length} of {orders.length} orders
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}