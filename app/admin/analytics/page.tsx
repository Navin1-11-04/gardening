"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, Package, ShoppingCart, Users, RefreshCw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  lowStockProducts: number;
}

// ─── Mock chart data (replace with real API calls as you build out) ────────────

const monthlyRevenue = [
  { month: "Oct", revenue: 18400, orders: 42 },
  { month: "Nov", revenue: 24600, orders: 61 },
  { month: "Dec", revenue: 31200, orders: 79 },
  { month: "Jan", revenue: 22800, orders: 55 },
  { month: "Feb", revenue: 27500, orders: 68 },
  { month: "Mar", revenue: 35100, orders: 88 },
  { month: "Apr", revenue: 41800, orders: 104 },
];

const categoryBreakdown = [
  { name: "Seeds",       value: 31, color: "#3d6b35" },
  { name: "Fertilizers", value: 26, color: "#7ab648" },
  { name: "Grow Bags",   value: 19, color: "#a8d878" },
  { name: "Pots",        value: 14, color: "#d4e8c2" },
  { name: "Coco Peat",   value: 10, color: "#eef5ea" },
];

const topProducts = [
  { name: "Premium Vermicompost", sales: 241, revenue: 72059 },
  { name: "Fabric Grow Bag 15L",  sales: 189, revenue: 56511 },
  { name: "Coco Peat Block",      sales: 312, revenue: 40248 },
  { name: "Terracotta Pot 8\"",   sales: 176, revenue: 43824 },
  { name: "Tomato Seeds",         sales: 203, revenue: 30247 },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const RevenueTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#dce8d4] rounded-xl p-3 shadow-lg text-sm">
      <p className="font-bold text-[#1e3d18] mb-1">{label}</p>
      <p className="text-[#3d6b35]">Revenue: <span className="font-black">₹{payload[0]?.value?.toLocaleString("en-IN")}</span></p>
      <p className="text-[#7a9e6a]">Orders: <span className="font-bold">{payload[1]?.value}</span></p>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setStats(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    {
      label: "Total Revenue",
      value: stats ? `₹${((stats.totalRevenue ?? 0) / 1000).toFixed(1)}K` : "—",
      sub: "From delivered orders",
      icon: TrendingUp,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? "—",
      sub: "All time",
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Products",
      value: stats?.totalProducts ?? "—",
      sub: "In store",
      icon: Package,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Customers",
      value: stats?.totalCustomers ?? "—",
      sub: "Registered",
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#1e3d18]">Analytics</h2>
        <p className="text-sm text-[#7a9e6a] mt-0.5">Sales performance and revenue overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#dce8d4] p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-black text-[#1e3d18]">{loading ? <RefreshCw size={18} className="animate-spin text-[#3d6b35]" /> : value}</p>
            <p className="text-sm font-semibold text-[#5a8a50] mt-0.5">{label}</p>
            <p className="text-xs text-[#9ab890] mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue & Orders Chart */}
      <div className="bg-white rounded-2xl border border-[#dce8d4] p-5">
        <div className="mb-5">
          <h3 className="text-base font-bold text-[#1e3d18]">Revenue & Orders — Last 7 Months</h3>
          <p className="text-xs text-[#9ab890] mt-0.5">Monthly breakdown of revenue and order volume</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyRevenue} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ed" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#7a9e6a" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#7a9e6a" }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9ab890" }} axisLine={false} tickLine={false} />
            <Tooltip content={<RevenueTooltip />} />
            <Bar yAxisId="left" dataKey="revenue" fill="#3d6b35" radius={[6, 6, 0, 0]} name="Revenue" />
            <Bar yAxisId="right" dataKey="orders" fill="#a8d878" radius={[6, 6, 0, 0]} name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row: Category Pie + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Category breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#dce8d4] p-5">
          <h3 className="text-base font-bold text-[#1e3d18] mb-1">Sales by Category</h3>
          <p className="text-xs text-[#9ab890] mb-5">% of total units sold</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-[#5a8a50]">{value}</span>}
              />
              <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#dce8d4] p-5">
          <h3 className="text-base font-bold text-[#1e3d18] mb-1">Top 5 Products</h3>
          <p className="text-xs text-[#9ab890] mb-5">By units sold</p>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#f0f4ed] flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-[#3d6b35]">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1e3d18] truncate">{p.name}</p>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-[#f0f4ed] rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-[#3d6b35] rounded-full transition-all"
                      style={{ width: `${(p.sales / topProducts[0].sales) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-[#3d6b35]">₹{(p.revenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-[#9ab890]">{p.sales} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue trend line */}
      <div className="bg-white rounded-2xl border border-[#dce8d4] p-5">
        <h3 className="text-base font-bold text-[#1e3d18] mb-1">Revenue Trend</h3>
        <p className="text-xs text-[#9ab890] mb-5">Month-over-month growth</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ed" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#7a9e6a" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#7a9e6a" }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(v: any) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3d6b35"
              strokeWidth={3}
              dot={{ fill: "#3d6b35", r: 5, strokeWidth: 0 }}
              activeDot={{ r: 7, fill: "#7ab648" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Note about mock data */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
        <strong>Note:</strong> Chart data above uses sample figures for illustration. Connect your orders API to populate with real historical data.
      </div>
    </div>
  );
}