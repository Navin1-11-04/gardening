"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Products",  href: "/admin/products",  icon: <Package       className="w-5 h-5" /> },
  { label: "Orders",    href: "/admin/orders",    icon: <ShoppingCart  className="w-5 h-5" /> },
  { label: "Analytics", href: "/admin/analytics", icon: <BarChart3     className="w-5 h-5" /> },
  { label: "Settings",  href: "/admin/settings",  icon: <Settings      className="w-5 h-5" /> },
];

// ─── Sidebar shell ────────────────────────────────────────────────────────────

function AdminShell({ children }: { children: ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ── Sidebar ── */}
      <aside
        className={`${open ? "w-64" : "w-20"} bg-[#2a4620] flex flex-col flex-shrink-0 transition-all duration-300`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[#3d6b35]">
          <div className={`flex items-center gap-3 ${!open && "justify-center"}`}>
            <div className="w-10 h-10 bg-[#7a9e5f] rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            {open && (
              <div>
                <p className="text-white font-bold text-sm">KAVIN</p>
                <p className="text-[#7a9e5f] text-xs">Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!open ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#3d6b35] text-white"
                    : "text-gray-300 hover:bg-[#3d6b35]/60 hover:text-white"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {open && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#3d6b35] space-y-1">
          <button
            onClick={() => setOpen(!open)}
            title={open ? "Collapse" : "Expand"}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#3d6b35]/60 hover:text-white transition-colors text-sm"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            {open && <span>Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-900/50 hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-5 h-5" />
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold text-gray-800">Kavin Organics Admin</h1>
          <p className="text-sm text-gray-500">Welcome, Admin</p>
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── Main export — skip sidebar on login page ─────────────────────────────────

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  // Login page gets NO sidebar wrapper
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}