"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  lowStockProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Products",
      value: stats?.totalProducts || 0,
      icon: <Package className="w-8 h-8" />,
      color: "bg-blue-100 text-blue-600",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart className="w-8 h-8" />,
      color: "bg-green-100 text-green-600",
      href: "/admin/orders",
    },
    {
      label: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: <Users className="w-8 h-8" />,
      color: "bg-purple-100 text-purple-600",
      href: "/admin/customers",
    },
    {
      label: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <TrendingUp className="w-8 h-8" />,
      color: "bg-amber-100 text-amber-600",
      href: "/admin/analytics",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Welcome to your admin panel. Here's an overview of your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <Link key={idx} href={card.href}>
            <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  {card.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-900">
              Low Stock Alert
            </h3>
          </div>
          <p className="text-amber-700 text-sm mb-4">
            {stats?.lowStockProducts || 0} products are running low on stock
          </p>
          <Link
            href="/admin/products"
            className="inline-block px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition"
          >
            View Products
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Quick Links
          </h3>
          <div className="space-y-2">
            <Link
              href="/admin/products"
              className="block px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg text-sm font-medium transition"
            >
              ➕ Add New Product
            </Link>
            <Link
              href="/admin/orders"
              className="block px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg text-sm font-medium transition"
            >
              📦 Manage Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Database Setup Instructions */}
      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-3">
          🚀 Getting Started
        </h3>
        <p className="text-green-700 text-sm mb-3">
          Your admin panel is ready! Next steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-green-700 text-sm">
          <li>
            <strong>Add Products:</strong> Go to Products section to add your
            gardening products
          </li>
          <li>
            <strong>Manage Inventory:</strong> Keep track of stock levels
          </li>
          <li>
            <strong>Process Orders:</strong> Accept and manage customer orders
          </li>
          <li>
            <strong>View Analytics:</strong> Track sales and revenue trends
          </li>
        </ol>
      </div>
    </div>
  );
}
