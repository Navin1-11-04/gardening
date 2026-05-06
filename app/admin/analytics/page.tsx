"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  TrendingUp, Package, ShoppingCart, Users,
  RefreshCw, IndianRupee, Clock,
} from "lucide-react";

interface AnalyticsData {
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  categoryBreakdown: { name: string; value: number; color: string }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  kpi: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;       // all active orders
    deliveredRevenue: number;   // delivered only
  };
}

const RevenueTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#dce8d4] rounded-xl p-3 shadow-lg text-sm">
      <p className="font-bold text-[#1e3d18] mb-1">{label}</p>
      <p className="text-[#3d6b35]">Revenue: <span className="font-black">₹{(payload[0]?.value ?? 0).toLocaleString("en-IN")}</span></p>
      <p className="text-[#7a9e6a]">Orders: <span className="font-bold">{payload[1]?.value ?? 0}</span></p>
    </div>
  );
};

function formatINR(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000)   return `₹${Math.round(val / 1000)}K`;
  return `₹${Math.round(val)}`;
}

export default function AdminAnalyticsPage() {
  const [data,    setData]    = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const fetchData = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) throw new Error("Failed to fetch");
      setData(await res.json());
    } catch {
      setError("Could not load analytics data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const kpis = [
    {
      label:   "Total Pipeline",
      value:   data ? formatINR(data.kpi.totalRevenue ?? 0) : "—",
      sub:     "All active orders (excl. cancelled)",
      icon:    IndianRupee,
      color:   "bg-[#eef7e6] text-[#3d6b35]",
      tooltip: "Revenue from pending + confirmed + processing + shipped + delivered orders",
    },
    {
      label:   "Collected Revenue",
      value:   data ? formatINR(data.kpi.deliveredRevenue ?? 0) : "—",
      sub:     "Delivered orders only",
      icon:    TrendingUp,
      color:   "bg-amber-50 text-amber-600",
      tooltip: "Revenue from orders that have been delivered",
    },
    {
      label:   "Total Orders",
      value:   data?.kpi.totalOrders    ?? "—",
      sub:     "All time",
      icon:    ShoppingCart,
      color:   "bg-blue-50 text-blue-600",
    },
    {
      label:   "Products",
      value:   data?.kpi.totalProducts  ?? "—",
      sub:     "Active in store",
      icon:    Package,
      color:   "bg-purple-50 text-purple-600",
    },
  ];

  // Show placeholder bars if no data yet
  const chartData = data?.monthlyRevenue?.length
    ? data.monthlyRevenue
    : [
        { month: "Jan", revenue: 0, orders: 0 },
        { month: "Feb", revenue: 0, orders: 0 },
        { month: "Mar", revenue: 0, orders: 0 },
      ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-[#1e3d18]">Analytics</h2>
          <p className="text-sm text-[#7a9e6a] mt-0.5">
            Live sales performance · Revenue includes all non-cancelled orders
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#dce8d4] rounded-xl text-[#3d6b35] font-semibold text-sm hover:bg-[#f0f4ed] transition-colors disabled:opacity-60"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Revenue note */}
      <div className="bg-[#eef7e6] border border-[#b8d4a0] rounded-2xl px-5 py-3 flex items-start gap-3">
        <Clock size={16} className="text-[#3d6b35] shrink-0 mt-0.5" />
        <p className="text-sm text-[#1e3d18] leading-relaxed">
          <span className="font-bold">Pipeline revenue</span> counts all active orders (confirmed/processing/shipped/delivered).{" "}
          <span className="font-bold">Collected revenue</span> counts only delivered orders. Both figures update in real time from your database.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#dce8d4] p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-black text-[#1e3d18]">
              {loading
                ? <RefreshCw size={18} className="animate-spin text-[#3d6b35]" />
                : value}
            </p>
            <p className="text-sm font-semibold text-[#5a8a50] mt-0.5">{label}</p>
            <p className="text-xs text-[#9ab890] mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue & Orders Chart */}
      <div className="bg-white rounded-2xl border border-[#dce8d4] p-5">
        <div className="mb-5">
          <h3 className="text-base font-bold text-[#1e3d18]">Revenue & Orders — Last 7 Months</h3>
          <p className="text-xs text-[#9ab890] mt-0.5">
            {loading
              ? "Loading…"
              : data?.monthlyRevenue?.length
                ? "Live data — includes all active order statuses"
                : "No order data yet — chart will populate as orders come in"}
          </p>
        </div>
        {loading ? (
          <div className="h-[280px] flex items-center justify-center">
            <RefreshCw size={24} className="animate-spin text-[#3d6b35]" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ed" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#7a9e6a" }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: "#7a9e6a" }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => formatINR(v)}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: "#9ab890" }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Bar yAxisId="left"  dataKey="revenue" fill="#3d6b35" radius={[6,6,0,0]} name="Revenue" />
              <Bar yAxisId="right" dataKey="orders"  fill="#a8d878" radius={[6,6,0,0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category Pie + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Pie chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#dce8d4] p-5">
          <h3 className="text-base font-bold text-[#1e3d18] mb-1">Sales by Product</h3>
          <p className="text-xs text-[#9ab890] mb-5">% of total units sold (top 5)</p>
          {loading ? (
            <div className="h-[220px] flex items-center justify-center">
              <RefreshCw size={20} className="animate-spin text-[#3d6b35]" />
            </div>
          ) : (data?.categoryBreakdown?.length ?? 0) === 0 ? (
            <div className="h-[220px] flex flex-col items-center justify-center text-center gap-2">
              <Package size={28} className="text-[#b0c8a0]" />
              <p className="text-sm text-[#9ab890]">No sales data yet</p>
              <p className="text-xs text-[#b0c8a0]">Chart will appear once orders are placed</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data?.categoryBreakdown}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={3} dataKey="value"
                >
                  {(data?.categoryBreakdown ?? []).map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={(value) => <span style={{ fontSize: 12, color: "#5a8a50" }}>{value}</span>}
                />
                <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top products */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#dce8d4] p-5">
          <h3 className="text-base font-bold text-[#1e3d18] mb-1">Top Products by Sales</h3>
          <p className="text-xs text-[#9ab890] mb-5">Units sold from all active orders</p>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw size={20} className="animate-spin text-[#3d6b35]" />
            </div>
          ) : (data?.topProducts?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
              <ShoppingCart size={28} className="text-[#b0c8a0]" />
              <p className="text-sm text-[#9ab890]">No sales data yet</p>
              <p className="text-xs text-[#b0c8a0]">Top products will appear once orders come in</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data?.topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#f0f4ed] flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-[#3d6b35]">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1e3d18] truncate">{p.name}</p>
                    <div className="h-1.5 bg-[#f0f4ed] rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-[#3d6b35] rounded-full"
                        style={{
                          width: `${data.topProducts[0].sales > 0
                            ? Math.round((p.sales / data.topProducts[0].sales) * 100)
                            : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-[#3d6b35]">{formatINR(p.revenue)}</p>
                    <p className="text-xs text-[#9ab890]">{p.sales} sold</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revenue trend line */}
      <div className="bg-white rounded-2xl border border-[#dce8d4] p-5">
        <h3 className="text-base font-bold text-[#1e3d18] mb-1">Revenue Trend</h3>
        <p className="text-xs text-[#9ab890] mb-5">Month-over-month pipeline revenue</p>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <RefreshCw size={20} className="animate-spin text-[#3d6b35]" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ed" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#7a9e6a" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#7a9e6a" }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => formatINR(v)}
              />
              <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]} />
              <Line
                type="monotone" dataKey="revenue" stroke="#3d6b35" strokeWidth={3}
                dot={{ fill: "#3d6b35", r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7, fill: "#7ab648" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}