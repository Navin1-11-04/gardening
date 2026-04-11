"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Leaf,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  lowStockProducts: number;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  subtext,
  href,
}: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  subtext?: string;
  href: string;
}) => (
  <Link href={href} className="group">
    <div className="bg-white rounded-2xl p-5 border border-[#dce8d4] hover:border-[#7ab648] hover:shadow-lg hover:shadow-[#7ab648]/10 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon size={20} />
        </div>
        <ArrowRight
          size={16}
          className="text-[#b0c8a0] group-hover:text-[#3d6b35] group-hover:translate-x-0.5 transition-all"
        />
      </div>
      <p className="text-2xl sm:text-3xl font-black text-[#1e3d18]">{value}</p>
      <p className="text-sm font-semibold text-[#5a8a50] mt-1">{label}</p>
      {subtext && (
        <p className="text-xs text-[#9ab890] mt-0.5">{subtext}</p>
      )}
    </div>
  </Link>
);

const recentOrders = [
  { id: "KO-2026-12451", customer: "Meenakshi R.", amount: 897, status: "delivered", time: "2h ago" },
  { id: "KO-2026-12450", customer: "Rajan K.", amount: 450, status: "shipped", time: "4h ago" },
  { id: "KO-2026-12449", customer: "Sumathi P.", amount: 1299, status: "processing", time: "6h ago" },
  { id: "KO-2026-12448", customer: "Annamalai S.", amount: 599, status: "confirmed", time: "8h ago" },
  { id: "KO-2026-12447", customer: "Kavitha M.", amount: 349, status: "cancelled", time: "1d ago" },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  shipped: { label: "Shipped", color: "bg-blue-100 text-blue-700", icon: Truck },
  processing: { label: "Processing", color: "bg-amber-100 text-amber-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-purple-100 text-purple-700", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
};

const topProducts = [
  { name: "Premium Vermicompost", category: "Fertilizers", sales: 241, revenue: "₹72,059" },
  { name: "Fabric Grow Bag (15L)", category: "Grow Bags", sales: 189, revenue: "₹56,511" },
  { name: "Coco Peat Block", category: "Coco Peats", sales: 312, revenue: "₹40,248" },
  { name: "Terracotta Pot 8\"", category: "Pots", sales: 176, revenue: "₹43,824" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setStats(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Products",
      value: loading ? "—" : (stats?.totalProducts ?? 22),
      icon: Package,
      color: "bg-[#eef7e6] text-[#3d6b35]",
      subtext: "Active in store",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: loading ? "—" : (stats?.totalOrders ?? 0),
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
      subtext: "All time",
      href: "/admin/orders",
    },
    {
      label: "Customers",
      value: loading ? "—" : (stats?.totalCustomers ?? "12K+"),
      icon: Users,
      color: "bg-purple-50 text-purple-600",
      subtext: "Registered users",
      href: "/admin/orders",
    },
    {
      label: "Revenue",
      value: loading ? "—" : `₹${((stats?.totalRevenue ?? 0) / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600",
      subtext: "Delivered orders",
      href: "/admin/analytics",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#1e3d18] to-[#2d5a25] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Leaf size={16} className="text-[#7ab648]" />
            <p className="text-[#7ab648] text-xs font-bold uppercase tracking-wider">
              Good morning
            </p>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Welcome back, Admin 👋
          </h2>
          <p className="text-[#9ac880] text-sm mt-1">
            Here's what's happening at Kavin Organics today.
          </p>
        </div>
        <div className="flex gap-3">
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

      {/* Low stock warning */}
      {(stats?.lowStockProducts ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-bold">{stats?.lowStockProducts} products</span> are running
            low on stock.{" "}
            <Link href="/admin/products" className="underline font-semibold">
              Review now →
            </Link>
          </p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f4ed]">
            <h3 className="text-base font-bold text-[#1e3d18]">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#3d6b35] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[#f5f8f2]">
            {recentOrders.map((order) => {
              const s = statusConfig[order.status];
              const SIcon = s.icon;
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#fafcf8] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1e3d18] truncate">
                      {order.id}
                    </p>
                    <p className="text-xs text-[#7a9e6a] truncate">
                      {order.customer} · {order.time}
                    </p>
                  </div>
                  <p className="text-sm font-black text-[#3d6b35] shrink-0">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </p>
                  <span
                    className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${s.color}`}
                  >
                    <SIcon size={10} />
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f4ed]">
            <h3 className="text-base font-bold text-[#1e3d18]">Top Products</h3>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#3d6b35] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#f0f4ed] flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-[#3d6b35]">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1e3d18] truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-[#7a9e6a]">
                    {p.sales} sold · {p.category}
                  </p>
                </div>
                <p className="text-sm font-black text-[#3d6b35] shrink-0">
                  {p.revenue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: "Add New Product",
            desc: "Seeds, pots, fertilizers & more",
            icon: Package,
            href: "/admin/products",
            color: "bg-[#eef7e6] border-[#c8e8b0]",
            iconColor: "bg-[#3d6b35] text-white",
          },
          {
            title: "Manage Orders",
            desc: "Process & track deliveries",
            icon: ShoppingCart,
            href: "/admin/orders",
            color: "bg-blue-50 border-blue-200",
            iconColor: "bg-blue-600 text-white",
          },
          {
            title: "View Analytics",
            desc: "Revenue & product trends",
            icon: BarChart3,
            href: "/admin/analytics",
            color: "bg-purple-50 border-purple-200",
            iconColor: "bg-purple-600 text-white",
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 hover:shadow-md transition-all group ${action.color}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${action.iconColor}`}
              >
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1e3d18]">
                  {action.title}
                </p>
                <p className="text-xs text-[#7a9e6a]">{action.desc}</p>
              </div>
              <ArrowRight
                size={15}
                className="ml-auto text-[#b0c8a0] group-hover:text-[#3d6b35] group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Need this import for BarChart3
import { BarChart3 } from "lucide-react";