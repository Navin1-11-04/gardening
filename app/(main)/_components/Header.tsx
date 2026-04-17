"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Search, ShoppingCart, X, Phone, Package } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../_context/CartContext";

const navLinks = [
  { label: "Home",      href: "/" },
  { label: "Shop",      href: "/shop" },
  { label: "Guides",    href: "/guides" },
  { label: "My Orders", href: "/orders" },
  {label:"Track Orders",href:"/track-order"},
  { label: "Contact",   href: "/contact" },
];

export const Header = () => {
  const router   = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [query,    setQuery]    = useState("");
  const { totalItems } = useCart();
  const [bump, setBump]     = useState(false);
  const prevTotal           = useRef(totalItems);
  const inputRef            = useRef<HTMLInputElement>(null);
  const mobileInputRef      = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (totalItems > prevTotal.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 400);
      prevTotal.current = totalItems;
      return () => clearTimeout(t);
    }
    prevTotal.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    if (!pathname.startsWith("/shop")) setQuery("");
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) { router.push("/shop"); return; }
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setMenuOpen(false);
    inputRef.current?.blur();
    mobileInputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery("");
    router.push("/shop");
    inputRef.current?.focus();
  };

  return (
    <header className="w-full bg-[#faf7f2] sticky top-0 z-50 border-b-2 border-[#d4c9a8] shadow-sm">
      {/* Help bar */}
      <div className="bg-[#3d6b35] text-white text-center py-2 px-4">
        <p className="text-sm font-medium flex items-center justify-center gap-2 flex-wrap">
          <Phone size={14} />
          உதவி வேண்டுமா? அழைக்கவும் / Need help? Call us:&nbsp;
          <a href="tel:+919876543210" className="font-bold underline underline-offset-2">
            +91 98765 43210
          </a>
          <span className="hidden sm:inline text-white/50 mx-1">|</span>
          <span className="hidden sm:inline">திங்கள்–சனி, 9am–6pm</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none shrink-0">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[#3d6b35] font-outfit">KAVIN</span>
          <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#7a9e5f] -mt-0.5">ORGANICS</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-semibold hover:text-[#3d6b35] hover:bg-[#eef5ea] px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                pathname === link.href ? "text-[#3d6b35] bg-[#eef5ea]" : "text-[#3a3a2e]"
              }`}
            >
              {link.href === "/orders" && <Package size={15} />}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 bg-white border-2 border-[#d4c9a8] rounded-xl px-4 py-2.5 w-56 focus-within:border-[#3d6b35] transition-colors"
          >
            <button type="submit" className="shrink-0 flex items-center">
              <Search size={18} className="text-[#7a9e5f]" />
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none text-base w-full text-[#3a3a2e] placeholder:text-[#b0a890]"
            />
            {query && (
              <button type="button" onClick={handleClear} className="shrink-0 text-[#a8a090] hover:text-[#3d6b35] transition-colors">
                <X size={16} />
              </button>
            )}
          </form>

          <Link
            href="/cart"
            className="relative flex items-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white px-4 py-2.5 rounded-xl transition-colors"
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline text-sm font-bold">Cart</span>
            {totalItems > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 bg-[#e86c2c] text-white text-xs min-w-5 w-5 h-5 flex items-center justify-center rounded-full font-bold leading-none px-1 transition-transform ${
                  bump ? "scale-125" : "scale-100"
                }`}
                style={{ transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-[#eef5ea] hover:bg-[#ddebd5] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} className="text-[#3d6b35]" /> : <Menu size={24} className="text-[#3d6b35]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#faf7f2] border-t-2 border-[#d4c9a8] px-4 py-4 flex flex-col gap-2">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white border-2 border-[#d4c9a8] rounded-xl px-4 py-3 mb-2 focus-within:border-[#3d6b35] transition-colors"
          >
            <button type="submit" className="shrink-0">
              <Search size={20} className="text-[#7a9e5f]" />
            </button>
            <input
              ref={mobileInputRef}
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none text-base w-full text-[#3a3a2e] placeholder:text-[#b0a890]"
            />
            {query && (
              <button type="button" onClick={handleClear} className="shrink-0 text-[#a8a090] hover:text-[#3d6b35] transition-colors">
                <X size={18} />
              </button>
            )}
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-4 text-lg font-semibold hover:bg-[#eef5ea] hover:text-[#3d6b35] rounded-xl transition-colors ${
                pathname === link.href ? "text-[#3d6b35] bg-[#eef5ea]" : "text-[#3a3a2e]"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.href === "/orders" && <Package size={18} />}
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};