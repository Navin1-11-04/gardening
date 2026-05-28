"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus, Plus, ChevronRight, Tag, Truck,
  ShieldCheck, Phone, ShoppingBag, ArrowRight, X, RefreshCw,
} from "lucide-react";
import { CartItem, useCart } from "../_context/CartContext";
import { useStoreConfig } from "@/lib/useStoreConfig";

// ─── Cart Item Row ─────────────────────────────────────────────────────────────

const CartItemRow = ({
  item,
  onQtyChange,
  onRemove,
}: {
  item: CartItem;
  onQtyChange: (id: number, qty: number, variant: string) => void;
  onRemove: (id: number, variant: string) => void;
}) => (
  <tr className="border-b border-[#e8e0d0] hover:bg-[#faf7f2] transition-colors">
    {/* Remove button */}
    <td className="py-4 px-2 text-center">
      <button
        onClick={() => onRemove(item.id, item.variant)}
        className="inline-flex items-center justify-center w-7 h-7 text-[#c0392b] hover:bg-red-50 rounded-full transition-colors text-lg font-bold leading-none"
        title="Remove item"
      >
        ×
      </button>
    </td>

    {/* Product info */}
    <td className="py-4 px-3">
      <div className="flex gap-3 items-start">
        <Link
          href={`/shop/product/${item.id}`}
          className="relative shrink-0 w-16 h-16 rounded overflow-hidden bg-[#f5f0ea] border border-[#e8e0d0]"
        >
          <Image src={item.image} alt={item.name} fill className="object-cover" />
          {item.badge && (
            <span className="absolute top-0.5 left-0.5 bg-[#3d6b35] text-white text-[7px] font-bold px-1 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
        </Link>
        <div className="min-w-0">
          <Link href={`/shop/product/${item.id}`}>
            <h3 className="text-sm font-semibold text-[#2a2a1e] hover:text-[#3d6b35] transition-colors line-clamp-2">
              {item.name}
            </h3>
          </Link>
          <p className="text-xs text-[#7a7a68]">{item.subtitle}</p>
          {item.variant && (
            <p className="text-xs text-[#7a9e5f] font-medium mt-0.5">{item.variant}</p>
          )}
        </div>
      </div>
    </td>

    {/* Unit price */}
    <td className="py-4 px-3 text-center">
      <p className="font-semibold text-[#2a2a1e]">
        Rs.{item.price.toLocaleString("en-IN")}
      </p>
      {item.originalPrice && (
        <p className="text-xs text-[#a8a090] line-through">
          Rs.{item.originalPrice.toLocaleString("en-IN")}
        </p>
      )}
    </td>

    {/* Quantity stepper */}
    <td className="py-4 px-3 text-center">
      <div className="flex items-center justify-center border border-[#d4c9a8] rounded overflow-hidden bg-[#faf7f2] w-fit mx-auto">
        <button
          onClick={() => onQtyChange(item.id, item.quantity - 1, item.variant)}
          className="w-8 h-8 flex items-center justify-center hover:bg-[#eef5ea] transition-colors active:scale-95"
          title={item.quantity === 1 ? "Remove item" : "Decrease quantity"}
        >
          <Minus size={13} className="text-[#3d6b35]" />
        </button>
        <span className="w-8 text-center text-sm font-bold text-[#2a2a1e] select-none">
          {item.quantity}
        </span>
        <button
          onClick={() => onQtyChange(item.id, item.quantity + 1, item.variant)}
          className="w-8 h-8 flex items-center justify-center hover:bg-[#eef5ea] transition-colors active:scale-95"
          title="Increase quantity"
        >
          <Plus size={13} className="text-[#3d6b35]" />
        </button>
      </div>
      {item.quantity === 1 && (
        <p className="text-[10px] text-[#a8a090] mt-1">Tap − to remove</p>
      )}
    </td>

    {/* Line total */}
    <td className="py-4 px-3 text-right">
      <p className="font-bold text-[#3d6b35] text-lg">
        Rs.{(item.price * item.quantity).toLocaleString("en-IN")}
      </p>
      {item.originalPrice && (
        <p className="text-xs text-[#a8a090] line-through">
          Rs.{(item.originalPrice * item.quantity).toLocaleString("en-IN")}
        </p>
      )}
    </td>
  </tr>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { items, updateQuantity, removeItem, addItem } = useCart();
  const { config } = useStoreConfig();
  const FREE_DELIVERY_THRESHOLD = config.freeDeliveryThreshold;
  const DELIVERY_FEE            = config.deliveryFee;

  const [couponCode,    setCouponCode]    = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string; discount: number; description?: string;
  } | null>(null);
  const [couponError,   setCouponError]   = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [removedItem,   setRemovedItem]   = useState<CartItem | null>(null);
  const [undoBuffer,    setUndoBuffer]    = useState<CartItem | null>(null);
  const [undoTimer,     setUndoTimer]     = useState<ReturnType<typeof setTimeout> | null>(null);

  const subtotal       = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings        = items.reduce((s, i) => s + ((i.originalPrice ?? i.price) - i.price) * i.quantity, 0);
  const couponDiscount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discount) / 100) : 0;
  const deliveryFee    = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total          = subtotal - couponDiscount + deliveryFee;
  const amountToFree   = FREE_DELIVERY_THRESHOLD - subtotal;

  // ── Quantity change handler ────────────────────────────────────────────────
  // When qty drops to 0, CartContext removes the item automatically.
  // We trigger the undo toast so user can bring it back.
  const handleQtyChange = (id: number, qty: number, variant: string) => {
    if (qty < 1) {
      // Treat as removal with undo
      handleRemove(id, variant);
      return;
    }
    updateQuantity(id, qty, variant);
  };

  // ── Remove with undo toast ─────────────────────────────────────────────────
  const handleRemove = (id: number, variant: string) => {
    const item = items.find((i) => i.id === id && i.variant === variant);
    if (!item) return;
    if (undoTimer) clearTimeout(undoTimer);
    removeItem(id, variant);
    setUndoBuffer(item);
    setRemovedItem(item);
    const timer = setTimeout(() => {
      setRemovedItem(null);
      setUndoBuffer(null);
      setUndoTimer(null);
    }, 4000);
    setUndoTimer(timer);
  };

  const handleUndo = () => {
    if (!undoBuffer) return;
    if (undoTimer) { clearTimeout(undoTimer); setUndoTimer(null); }
    addItem({ ...undoBuffer, quantity: undoBuffer.quantity });
    setRemovedItem(null);
    setUndoBuffer(null);
  };

  const handleDismissToast = () => {
    if (undoTimer) { clearTimeout(undoTimer); setUndoTimer(null); }
    setRemovedItem(null);
    setUndoBuffer(null);
  };

  // ── Coupon validation ──────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) { setCouponError("Please enter a coupon code."); return; }
    setCouponLoading(true);
    setCouponError("");
    try {
      const res  = await fetch("/api/coupons/validate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code, orderTotal: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error ?? "Invalid coupon code.");
        setAppliedCoupon(null);
        return;
      }
      setAppliedCoupon({ code: data.code, discount: data.discount, description: data.description });
      setCouponError("");
    } catch {
      setCouponError("Could not validate coupon. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (items.length === 0 && !removedItem) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4 text-center py-20">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2a2a1e] font-outfit mb-3">
          Your cart is empty
        </h2>
        <p className="text-lg text-[#7a7a68] mb-8 max-w-sm">
          Looks like you have not added anything yet. Browse our products and start growing!
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors"
        >
          <ShoppingBag size={20} />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">My Cart</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-5 sm:mb-7">
          <h1 className="text-2xl sm:text-4xl font-black text-[#2a2a1e] font-outfit">My Cart</h1>
          <p className="text-sm sm:text-base text-[#7a7a68] mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        {/* Free delivery progress */}
        {amountToFree > 0 ? (
          <div className="mb-5 bg-[#fff8ee] border border-[#f0d080] rounded-2xl px-4 py-3.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-[#7a5c1e]">
                Add Rs.{amountToFree} more for{" "}
                <span className="text-[#3d6b35]">FREE delivery!</span>
              </p>
              <span className="text-xs font-semibold text-[#a07820]">
                Rs.{subtotal} / Rs.{FREE_DELIVERY_THRESHOLD}
              </span>
            </div>
            <div className="h-2.5 bg-[#f0e0a0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3d6b35] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-5 bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl px-4 py-3.5">
            <p className="text-sm font-bold text-[#3d6b35]">
              You have unlocked <span className="underline">FREE delivery!</span>
            </p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT: Cart Items Table */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-lg border border-[#e8e0d0] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#3d6b35] text-white sticky top-0">
                      <tr>
                        <th className="w-8 py-3 px-2" />
                        <th className="py-3 px-3 text-left text-xs font-bold uppercase tracking-wider">
                          Product
                        </th>
                        <th className="w-24 py-3 px-3 text-center text-xs font-bold uppercase tracking-wider">
                          Price
                        </th>
                        <th className="w-28 py-3 px-3 text-center text-xs font-bold uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="w-28 py-3 px-3 text-right text-xs font-bold uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <CartItemRow
                          key={`${item.id}-${item.variant}`}
                          item={item}
                          onQtyChange={handleQtyChange}
                          onRemove={handleRemove}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-2 text-sm font-semibold text-[#3d6b35] hover:text-[#335c2c] transition-colors w-fit"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* RIGHT: Order Summary */}
            <div>
              <div className="bg-[#2a2a1e] rounded-lg overflow-hidden lg:sticky lg:top-24 h-fit">
                <div className="px-5 py-6">
                  <h2 className="text-xl font-bold text-white mb-5">Order Summary</h2>

                  <div className="space-y-3 pb-4 border-b border-[#3a3a28]">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#c8c8b0]">
                        Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})
                      </span>
                      <span className="font-semibold text-white">
                        Rs.{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#c8c8b0]">Savings</span>
                        <span className="font-semibold text-[#7ec856]">
                          -Rs.{savings.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#c8c8b0]">Coupon ({appliedCoupon.code})</span>
                        <span className="font-semibold text-[#7ec856]">
                          -Rs.{couponDiscount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-[#c8c8b0]">Delivery</span>
                      {deliveryFee === 0
                        ? <span className="font-semibold text-[#7ec856]">FREE</span>
                        : <span className="font-semibold text-white">Rs.{deliveryFee}</span>
                      }
                    </div>
                  </div>

                  <div className="py-4 border-b border-[#3a3a28]">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-[#c8c8b0]">Total</span>
                      <span className="text-3xl font-black text-white">
                        Rs.{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {savings + couponDiscount > 0 && (
                      <p className="text-xs text-[#7ec856] font-semibold mt-2">
                        You save Rs.{(savings + couponDiscount).toLocaleString("en-IN")} total!
                      </p>
                    )}
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-5 w-full block text-center bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-sm py-3.5 rounded-lg transition-colors active:scale-95"
                  >
                    Proceed to Checkout →
                  </Link>

                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#c8c8b0] flex-wrap">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={14} className="text-[#7ec856]" />
                      Secure checkout
                    </span>
                    <span className="text-[#5a5a48]">|</span>
                    <span className="flex items-center gap-1">
                      <Truck size={14} className="text-[#7ec856]" />
                      {deliveryFee === 0 ? "Free delivery" : `Rs.${deliveryFee} delivery`}
                    </span>
                  </div>

                  <div className="flex gap-2 justify-center mt-4 flex-wrap">
                    {["VISA", "Mastercard", "UPI", "G Pay"].map((p) => (
                      <span
                        key={p}
                        className="border border-[#4a4a38] bg-[#3a3a2e] px-3 py-2 rounded text-[11px] text-[#c8c8b0] font-bold"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coupon + Help row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Coupon */}
            <div className="bg-white rounded-lg border border-[#e8e0d0] p-4">
              <div className="flex items-center gap-2 mb-4 bg-[#f0f7eb] rounded-lg p-3">
                <Tag size={18} className="text-[#3d6b35]" />
                <h3 className="text-sm font-bold text-[#1a4d1a]">Have a Coupon?</h3>
              </div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#eef5ea] border border-[#b8d4a0] rounded-lg px-3 py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-[#3d6b35]">
                      "{appliedCoupon.code}" applied!
                    </p>
                    <p className="text-xs text-[#5a5a48] mt-0.5">
                      {appliedCoupon.discount}% off — saving Rs.{couponDiscount.toLocaleString("en-IN")}
                    </p>
                    {appliedCoupon.description && (
                      <p className="text-xs text-[#7a9e6a] mt-0.5">{appliedCoupon.description}</p>
                    )}
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 rounded-lg hover:bg-white transition-colors"
                  >
                    <X size={14} className="text-[#7a7a68]" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    className="flex-1 bg-gray-50 border-2 border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-[#3d6b35] transition-colors font-medium uppercase"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="bg-[#3d6b35] hover:bg-[#335c2c] disabled:bg-[#a8c890] text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
                  >
                    {couponLoading ? <RefreshCw size={14} className="animate-spin" /> : null}
                    Apply
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-xs text-red-600 font-bold mt-2">{couponError}</p>
              )}
            </div>

            {/* Help */}
            <div className="bg-white border border-[#e8e0d0] rounded-lg px-4 py-4 flex items-start gap-3">
              <div className="bg-[#f0f7eb] rounded-lg p-2.5 shrink-0">
                <Phone size={18} className="text-[#3d6b35]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1a4d1a]">Need help with your order?</p>
                <a
                  href="tel:+919876543210"
                  className="inline-block mt-3 text-base font-bold text-[#3d6b35] hover:bg-[#f0f7eb] px-3 py-2 rounded-lg transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Undo Toast */}
      {removedItem && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2a2a1e] text-white rounded-2xl px-5 py-3.5 flex items-center gap-4 shadow-2xl max-w-sm w-[calc(100%-2rem)]">
          <p className="flex-1 text-sm font-medium leading-snug">
            "{removedItem.name}" removed
          </p>
          <button
            onClick={handleUndo}
            className="shrink-0 bg-[#3d6b35] hover:bg-[#4a8040] text-white text-sm font-bold px-3 py-1.5 rounded-xl transition-colors"
          >
            Undo
          </button>
          <button
            onClick={handleDismissToast}
            className="shrink-0 text-white/60 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Sticky Mobile Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t-2 border-[#e8e0d0] px-4 py-3 flex items-center gap-3 shadow-2xl">
        <div className="flex-1">
          <p className="text-xs text-[#7a7a68]">
            {items.length} item{items.length !== 1 ? "s" : ""} ·{" "}
            {deliveryFee === 0 ? "Free delivery" : `+Rs.${deliveryFee} delivery`}
          </p>
          <p className="text-xl font-black text-[#3d6b35] leading-tight">
            Rs.{total.toLocaleString("en-IN")}
          </p>
        </div>
        <Link
          href="/checkout"
          className="flex items-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors shadow-md"
        >
          Checkout <ArrowRight size={16} />
        </Link>
      </div>
      <div className="lg:hidden h-20" />
    </div>
  );
}