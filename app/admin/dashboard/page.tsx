"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package, ShoppingCart, Users, TrendingUp,
  AlertTriangle, ArrowRight, Leaf, Clock,
  CheckCircle2, XCircle, Truck, RefreshCw,
  MessageSquare, IndianRupee, Calendar,
} from "lucide-react";

interface LiveData {
  orders: {
    id: string; orderNumber: string; customer: string;
    amount: number; status: string; time: string; paymentMethod: string;
  }[];
  topProducts: { name: string; sales: number; revenue: number; image: string }[];
  statusBreakdown: Record<string, number>;
  lowStock: { id: string; name: string; sku: string; stock: number }[];
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pipelineRevenue: number;
  pipelineOrders: number;
  monthRevenue: number;
  totalCustomers: number;
  lowStockProducts: number;
  statusBreakdown: Record<string, number>;
  todayOrders: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  delivered:  { label: "Delivered",  color: "bg-green-100 text-green-700",   icon: CheckCircle2 },
  shipped:    { label: "Shipped",    color: "bg-blue-100 text-blue-700",     icon: Truck },
  processing: { label: "Processing", color: "bg-amber-100 text-amber-700",   icon: Clock },
  confirmed:  { label: "Confirmed",  color: "bg-purple-100 text-purple-700", icon: CheckCircle2 },
  pending:    { label: "Pending",    color: "bg-yellow-100 text-yellow-700", icon: Clock },
  cancelled:  { label: "Cancelled",  color: "bg-red-100 text-red-700",       icon: XCircle },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatINR(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${Math.round(val / 1000)}K`;
  return `₹${Math.round(val)}`;
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [live,    setLive]    = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, liveRes] = await Promise.all([
        fetch("/api/admin/dashboard/stats"),
        fetch("/api/admin/dashboard/live"),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (liveRes.ok)  setLive(await liveRes.json());
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 120_000);
    return () => clearInterval(id);
  }, []);

  const statCards = [
    {
      label: "Pipeline Revenue",
      href: "/admin/orders",
      value: loading ? "—" : formatINR(stats?.pipelineRevenue ?? 0),
      icon: IndianRupee,
      color: "bg-[#eef7e6] text-[#3d6b35]",
      subtext: `${stats?.pipelineOrders ?? 0} active orders`,
      tooltip: "All confirmed/processing/shipped orders",
    },
    {
      label: "Delivered Revenue",
      href: "/admin/analytics",
      value: loading ? "—" : formatINR(stats?.totalRevenue ?? 0),
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600",
      subtext: "Collected so far",
      tooltip: "Revenue from delivered orders only",
    },
    {
      label: "Total Orders",
      href: "/admin/orders",
      value: loading ? "—" : (stats?.totalOrders ?? 0),
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
      subtext: `${stats?.todayOrders ?? 0} today`,
    },
    {
      label: "Low Stock",
      href: "/admin/products",
      value: loading ? "—" : (stats?.lowStockProducts ?? 0),
      icon: Package,
      color: (stats?.lowStockProducts ?? 0) > 0 ? "bg-red-50 text-red-600" : "bg-[#eef7e6] text-[#3d6b35]",
      subtext: "Products need restock",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#1e3d18] to-[#2d5a25] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Leaf size={16} className="text-[#7ab648]" />
            <p className="text-[#7ab648] text-xs font-bold uppercase tracking-wider">Live Dashboard</p>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Welcome back, Admin 👋
          </h2>
          {lastUpdated && (
            <p className="text-[#9ac880] text-xs mt-1">
              Updated: {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 bg-[#7ab648] hover:bg-[#8cc855] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            <Package size={15} />
            Add Product
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            View Store
          </Link>
        </div>
      </div>

      {/* This month highlight */}
      {!loading && (stats?.monthRevenue ?? 0) > 0 && (
        <div className="bg-[#eef7e6] border border-[#b8d4a0] rounded-2xl px-5 py-4 flex items-center gap-3">
          <Calendar size={18} className="text-[#3d6b35] shrink-0" />
          <p className="text-sm text-[#1e3d18]">
            <span className="font-bold">This month so far:</span> {formatINR(stats?.monthRevenue ?? 0)} across {(stats?.statusBreakdown?.confirmed ?? 0) + (stats?.statusBreakdown?.processing ?? 0) + (stats?.statusBreakdown?.shipped ?? 0) + (stats?.statusBreakdown?.delivered ?? 0)} orders
          </p>
        </div>
      )}

      {/* Low stock warning */}
      {(stats?.lowStockProducts ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-bold">{stats?.lowStockProducts} product{(stats?.lowStockProducts ?? 0) !== 1 ? "s" : ""}</span>{" "}
            running low on stock.{" "}
            <Link href="/admin/products" className="underline font-semibold">Review now →</Link>
          </p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="group">
              <div className="bg-white rounded-2xl p-5 border border-[#dce8d4] hover:border-[#7ab648] hover:shadow-lg hover:shadow-[#7ab648]/10 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                    <Icon size={20} />
                  </div>
                  <ArrowRight size={16} className="text-[#b0c8a0] group-hover:text-[#3d6b35] group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-[#1e3d18]">
                  {loading
                    ? <RefreshCw size={18} className="animate-spin text-[#3d6b35]" />
                    : card.value}
                </p>
                <p className="text-sm font-semibold text-[#5a8a50] mt-1">{card.label}</p>
                <p className="text-xs text-[#9ab890] mt-0.5">{card.subtext}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Order status pills */}
      {live?.statusBreakdown && Object.keys(live.statusBreakdown).length > 0 && (
        <div className="flex flex-wrap gap-3">
          {Object.entries(live.statusBreakdown).map(([status, count]) => {
            const cfg = statusConfig[status];
            if (!cfg) return null;
            const SIcon = cfg.icon;
            return (
              <div key={status} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.color}`}>
                <SIcon size={12} />
                {cfg.label}: {count}
              </div>
            );
          })}
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f4ed]">
            <h3 className="text-base font-bold text-[#1e3d18]">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-semibold text-[#3d6b35] hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw size={18} className="animate-spin text-[#3d6b35] mx-auto mb-2" />
              <p className="text-xs text-[#9ab890]">Loading orders…</p>
            </div>
          ) : !live?.orders?.length ? (
            <div className="p-8 text-center text-sm text-[#9ab890]">No orders yet.</div>
          ) : (
            <div className="divide-y divide-[#f5f8f2]">
              {live.orders.map((order) => {
                const s = statusConfig[order.status] ?? { label: order.status, color: "bg-gray-100 text-gray-700", icon: Clock };
                const SIcon = s.icon;
                return (
                  <div key={order.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#fafcf8] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1e3d18] truncate">{order.orderNumber}</p>
                      <p className="text-xs text-[#7a9e6a] truncate">{order.customer} · {timeAgo(order.time)}</p>
                    </div>
                    <p className="text-sm font-black text-[#3d6b35] shrink-0">₹{order.amount.toLocaleString("en-IN")}</p>
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${s.color}`}>
                      <SIcon size={10} />{s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f4ed]">
            <h3 className="text-base font-bold text-[#1e3d18]">Top Products</h3>
            <Link href="/admin/products" className="text-xs font-semibold text-[#3d6b35] hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw size={18} className="animate-spin text-[#3d6b35] mx-auto mb-2" />
            </div>
          ) : !live?.topProducts?.length ? (
            <div className="p-6 text-center text-sm text-[#9ab890]">No sales data yet.</div>
          ) : (
            <div className="p-4 space-y-3">
              {live.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#f0f4ed] flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-[#3d6b35]">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1e3d18] truncate">{p.name}</p>
                    <p className="text-xs text-[#7a9e6a]">{p.sales} sold</p>
                  </div>
                  <p className="text-sm font-black text-[#3d6b35] shrink-0">{formatINR(p.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low stock items table */}
      {live?.lowStock && live.lowStock.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f4ed]">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              <h3 className="text-base font-bold text-[#1e3d18]">Low Stock Items</h3>
            </div>
            <Link href="/admin/products" className="text-xs font-semibold text-[#3d6b35] hover:underline">Update stock →</Link>
          </div>
          <div className="divide-y divide-[#f5f8f2]">
            {live.lowStock.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1e3d18] truncate">{item.name}</p>
                  <p className="text-xs text-[#9ab890] font-mono">{item.sku}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {item.stock === 0 ? "Out of stock" : `${item.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Add New Product",    desc: "Seeds, pots, fertilizers & more", icon: Package,      href: "/admin/products",   color: "bg-[#eef7e6] border-[#c8e8b0]", iconColor: "bg-[#3d6b35] text-white" },
          { title: "Manage Orders",      desc: "Process & track deliveries",       icon: ShoppingCart, href: "/admin/orders",     color: "bg-blue-50 border-blue-200",    iconColor: "bg-blue-600 text-white" },
          { title: "Customer Messages",  desc: "View contact form inquiries",      icon: MessageSquare,href: "/admin/inquiries",  color: "bg-purple-50 border-purple-200",iconColor: "bg-purple-600 text-white" },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 hover:shadow-md transition-all group ${action.color}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${action.iconColor}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1e3d18]">{action.title}</p>
                <p className="text-xs text-[#7a9e6a]">{action.desc}</p>
              </div>
              <ArrowRight size={15} className="ml-auto text-[#b0c8a0] group-hover:text-[#3d6b35] group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}