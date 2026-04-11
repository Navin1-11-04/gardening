"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Bell,
  Menu,
  X,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats",
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    description: "Manage inventory",
    badge: null,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    description: "Customer orders",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Sales & revenue",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Store configuration",
  },
];

function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const pageTitle =
    navItems.find((n) => pathname.startsWith(n.href))?.label ?? "Admin";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-[#2d5a25] ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="w-9 h-9 bg-[#7ab648] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#7ab648]/30">
          <Leaf size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-black text-sm tracking-wider leading-none">
              KAVIN
            </p>
            <p className="text-[#7ab648] text-[10px] font-bold tracking-[0.25em] leading-none mt-0.5">
              ORGANICS
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                active
                  ? "bg-[#7ab648] text-white shadow-md shadow-[#7ab648]/30"
                  : "text-[#a0c890] hover:bg-[#2d5a25] hover:text-white"
              }`}
            >
              <Icon
                size={18}
                className={`shrink-0 ${active ? "text-white" : "text-[#7ab648] group-hover:text-white"}`}
              />
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-none">{item.label}</p>
                  {!active && (
                    <p className="text-[10px] text-[#5a8a50] group-hover:text-white/60 mt-0.5 leading-none">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#2d5a25] space-y-1">
        {/* Collapse toggle - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-[#a0c890] hover:bg-[#2d5a25] hover:text-white transition-all text-sm"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <ChevronRight size={18} className="shrink-0" />
          ) : (
            <>
              <ChevronLeft size={18} className="shrink-0" />
              <span className="font-medium">Collapse</span>
            </>
          )}
        </button>

        {/* View Store */}
        {!collapsed && (
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#a0c890] hover:bg-[#2d5a25] hover:text-white transition-all text-sm"
          >
            <TrendingUp size={18} className="shrink-0 text-[#7ab648]" />
            <span className="font-medium">View Store</span>
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#a0c890] hover:bg-red-900/40 hover:text-red-300 transition-all text-sm"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f0f4ed] overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col ${
          collapsed ? "w-[68px]" : "w-60"
        } bg-[#1e3d18] shrink-0 transition-all duration-300 ease-in-out`}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar overlay ── */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-[#1e3d18] z-50 flex flex-col">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-[#dce8d4] px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#f0f4ed] text-[#3d6b35] transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb */}
            <div>
              <p className="text-xs text-[#7a9e6a] font-semibold uppercase tracking-wider">
                Admin Panel
              </p>
              <h1 className="text-lg font-black text-[#1e3d18] leading-none mt-0.5">
                {pageTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live clock */}
            <span className="hidden sm:block text-sm font-mono text-[#5a8a50] bg-[#f0f4ed] px-3 py-1.5 rounded-lg">
              {time}
            </span>

            {/* Notifications bell */}
            <button className="relative p-2 rounded-lg hover:bg-[#f0f4ed] text-[#5a8a50] transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e86c2c] rounded-full" />
            </button>

            {/* Admin avatar */}
            <div className="flex items-center gap-2.5 bg-[#f0f4ed] rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-lg bg-[#3d6b35] flex items-center justify-center">
                <span className="text-white text-xs font-black">A</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-[#1e3d18] leading-none">Admin</p>
                <p className="text-[10px] text-[#7a9e6a] leading-none mt-0.5">
                  Kavin Organics
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}