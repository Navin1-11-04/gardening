"use client";

import { useState } from "react";
import { Menu, Search, ShoppingCart } from "lucide-react";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-background/70 backdrop-blur-sm sticky top-0 z-50 font-outfit">
      <div className="max-w-7xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center px-6 py-3">

        {/* LEFT NAV */}
        <div className="flex items-center">
          <nav className="hidden md:flex items-center gap-8 text-lg">
            <a href="#" className="hover:text-green-700">Home</a>
            <a href="#" className="hover:text-green-700">Shop</a>
            <a href="#" className="hover:text-green-700">Contact Us</a>
          </nav>

          {/* HAMBURGER (mobile) */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={28} />
          </button>
        </div>

        {/* LOGO (Perfect Center) */}
        <div className="text-center font-bold text-green-800 tracking-wide">
          <div className="text-base">KAVIN</div>
          <div className="text-base">ORGANICS</div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-end gap-4">

          {/* SEARCH BAR */}
          <div className="hidden md:flex items-center border rounded-md px-3 py-2 w-64 bg-gray-50">
            <Search size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none text-base w-full"
            />
          </div>

          {/* CART */}
          <div className="relative cursor-pointer">
            <ShoppingCart size={26} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              2
            </span>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t px-6 py-4 flex flex-col gap-4">
          <a href="#" className="font-medium">Home</a>
          <a href="#" className="font-medium">Shop</a>
          <a href="#" className="font-medium">Contact Us</a>

          <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>
      )}
    </header>
  );
};