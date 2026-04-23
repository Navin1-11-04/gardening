"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, Package, ShoppingCart, Users, RefreshCw } from "lucide-react";

interface AnalyticsData {
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  categoryBreakdown: { name: string; value: number; color: string }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  kpi: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
  };
}

const RevenueTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#dce8d4] rounded-xl p-3 shadow-lg text-sm">
      <p className="font-bold text-[#1e3d18] mb-1">{label}</p>
      <p className="text-[#3d6b35]">Revenue: <span className="font-black">₹{(payload[0]?.value ?? 0).toLocaleString("en-IN")}</span></p>
      <p className="text-[#7a9e6a]">Orders: <span className="font-bold">{payload[1]?.value}</span></p>
    </div>
  );
};

export default function AdminAnalyticsPage() {
  const [data,    setData]    = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
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
    { label: "Total Revenue",   value: data ? `₹${Math.round((data.kpi.totalRevenue ?? 0) / 1000)}K` : "—", sub: "Delivered orders",   icon: TrendingUp, color: "bg-green-50 text-green-600" },
    { label: "Total Orders",    value: data?.kpi.totalOrders    ?? "—", sub: "All time",          icon: ShoppingCart, color: "bg-blue-50 text-blue-600" },
    { label: "Active Products", value: data?.kpi.totalProducts  ?? "—", sub: "In store",          icon: Package,      color: "bg-amber-50 text-amber-600" },
    { label: "Customers",       value: data?.kpi.totalCustomers ?? "—", sub: "Registered",        icon: Users,        color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-[#1e3d18]">Analytics</h2>
          <p className="text-sm text-[#7a9e6a] mt-0.5">Live sales performance from your database</p>
        </div>
        <button onClick={fetchData} disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#dce8d4] rounded-xl text-[#3d6b35] font-semibold text-sm hover:bg-[#f0f4ed] transition-colors disabled:opacity-60"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">{error}</div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#dce8d4] p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-black text-[#1e3d18]">
              {loading ? <RefreshCw size={18} className="animate-spin text-[#3d6b35]" /> : value}
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
            {loading ? "Loading…" : data?.monthlyRevenue?.length ? "Live data from your orders" : "No order data yet"}
          </p>
        </div>
        {loading ? (
          <div className="h-[280px] flex items-center justify-center">
            <RefreshCw size={24} className="animate-spin text-[#3d6b35]" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data?.monthlyRevenue ?? []} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ed" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#7a9e6a" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left"  tick={{ fontSize: 11, fill: "#7a9e6a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${Math.round(v / 1000)}K`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9ab890" }} axisLine={false} tickLine={false} />
              <Tooltip content={<RevenueTooltip />} />
              <Bar yAxisId="left"  dataKey="revenue" fill="#3d6b35" radius={[6, 6, 0, 0]} name="Revenue" />
              <Bar yAxisId="right" dataKey="orders"  fill="#a8d878" radius={[6, 6, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category Pie + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#dce8d4] p-5">
          <h3 className="text-base font-bold text-[#1e3d18] mb-1">Sales by Product</h3>
          <p className="text-xs text-[#9ab890] mb-5">% of total units sold</p>
          {loading ? (
            <div className="h-[220px] flex items-center justify-center">
              <RefreshCw size={20} className="animate-spin text-[#3d6b35]" />
            </div>
          ) : (data?.categoryBreakdown?.length ?? 0) === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-sm text-[#9ab890]">No sales yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data?.categoryBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {(data?.categoryBreakdown ?? []).map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{value}</span>} />
                <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#dce8d4] p-5">
          <h3 className="text-base font-bold text-[#1e3d18] mb-1">Top Products by Sales</h3>
          <p className="text-xs text-[#9ab890] mb-5">Units sold from completed orders</p>
          {loading ? (
            <div className="flex items-center justify-center py-8"><RefreshCw size={20} className="animate-spin text-[#3d6b35]" /></div>
          ) : (data?.topProducts?.length ?? 0) === 0 ? (
            <div className="text-center py-8 text-sm text-[#9ab890]">No sales data yet</div>
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
                        style={{ width: `${data.topProducts[0].sales > 0 ? Math.round((p.sales / data.topProducts[0].sales) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-[#3d6b35]">₹{Math.round(p.revenue / 1000)}K</p>
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
        <p className="text-xs text-[#9ab890] mb-5">Month-over-month growth</p>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center"><RefreshCw size={20} className="animate-spin text-[#3d6b35]" /></div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data?.monthlyRevenue ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ed" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#7a9e6a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#7a9e6a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${Math.round(v / 1000)}K`} />
              <Tooltip formatter={(v: any) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="#3d6b35" strokeWidth={3}
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