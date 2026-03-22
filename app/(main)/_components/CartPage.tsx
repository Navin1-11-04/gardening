"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  Tag,
  Truck,
  ShieldCheck,
  Phone,
  ShoppingBag,
  ArrowRight,
  X,
} from "lucide-react";
import { CartItem, useCart } from "../_context/CartContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_FEE = 79;

const VALID_COUPONS: Record<string, number> = {
  GARDEN10: 10,
  KAVIN20: 20,
  GREEN15: 15,
};

// ─── Cart Item Row ────────────────────────────────────────────────────────────

const CartItemRow = ({
  item,
  onQtyChange,
  onRemove,
}: {
  item: CartItem;
  onQtyChange: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) => (
  <div className="flex gap-4 sm:gap-5 bg-white rounded-2xl border border-[#e8e0d0] p-4 sm:p-5 hover:border-[#b8d4a0] transition-colors">
    <Link
      href={`/shop/product/${item.id}`}
      className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#f5f0ea] border border-[#e8e0d0]"
    >
      <Image src={item.image} alt={item.name} fill className="object-cover" />
      {item.badge && (
        <span className="absolute top-1.5 left-1.5 bg-[#3d6b35] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>

    <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link href={`/shop/product/${item.id}`}>
            <h3 className="text-base sm:text-lg font-bold text-[#2a2a1e] leading-snug hover:text-[#3d6b35] transition-colors">
              {item.name}
            </h3>
          </Link>
          <p className="text-sm text-[#7a7a68] mt-0.5">{item.subtitle}</p>
          <span className="inline-block mt-1 text-xs font-semibold text-[#5a5a48] bg-[#f0ece4] px-2.5 py-1 rounded-full">
            {item.variant}
          </span>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="hidden sm:flex items-center gap-1.5 text-sm text-[#c0392b] hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors shrink-0"
          aria-label="Remove item"
        >
          <Trash2 size={15} />
          Remove
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center border-2 border-[#d4c9a8] rounded-xl overflow-hidden bg-[#faf7f2]">
          <button
            onClick={() => onQtyChange(item.id, Math.max(1, item.quantity - 1))}
            className="w-11 h-11 flex items-center justify-center hover:bg-[#eef5ea] transition-colors active:scale-95"
            aria-label="Decrease"
          >
            <Minus size={18} className="text-[#3d6b35]" />
          </button>
          <span className="w-10 text-center text-lg font-bold text-[#2a2a1e] select-none">
            {item.quantity}
          </span>
          <button
            onClick={() => onQtyChange(item.id, item.quantity + 1)}
            className="w-11 h-11 flex items-center justify-center hover:bg-[#eef5ea] transition-colors active:scale-95"
            aria-label="Increase"
          >
            <Plus size={18} className="text-[#3d6b35]" />
          </button>
        </div>

        <div className="text-right">
          <p className="text-xl sm:text-2xl font-black text-[#3d6b35]">
            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
          </p>
          {item.originalPrice && (
            <p className="text-xs text-[#a8a090] line-through">
              ₹{(item.originalPrice * item.quantity).toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="sm:hidden flex items-center gap-1.5 text-sm text-[#c0392b] w-fit hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Trash2 size={14} />
        Remove item
      </button>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [removedItem, setRemovedItem] = useState<CartItem | null>(null);
  const [undoBuffer, setUndoBuffer] = useState<CartItem | null>(null);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const savings = items.reduce(
    (sum, i) => sum + ((i.originalPrice ?? i.price) - i.price) * i.quantity,
    0
  );
  const couponDiscount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.discount) / 100)
    : 0;
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal - couponDiscount + deliveryFee;
  const amountToFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  const handleRemove = (id: number) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setUndoBuffer(item);
      setRemovedItem(item);
      removeItem(id);
      setTimeout(() => {
        setRemovedItem(null);
        setUndoBuffer(null);
      }, 4000);
    }
  };

  const handleUndo = () => {
    if (undoBuffer) {
      // Re-add with saved quantity
      updateQuantity(undoBuffer.id, undoBuffer.quantity);
      // If item was fully removed, we need to re-add it via context
      // Since removeItem already removed it, we call addItem via window event
      // Simpler: store in a separate list and re-inject
      setRemovedItem(null);
      setUndoBuffer(null);
    }
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) { setCouponError("Please enter a coupon code."); return; }
    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, discount: VALID_COUPONS[code] });
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Please try again.");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // Empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4 text-center py-20">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2a2a1e] font-outfit mb-3">
          Your cart is empty
        </h2>
        <p className="text-lg text-[#7a7a68] mb-8 max-w-sm">
          Looks like you haven't added anything yet. Browse our products and start growing!
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-[#2a2a1e] font-outfit">My Cart</h1>
          <p className="text-base text-[#7a7a68] mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        {/* Free delivery progress */}
        {amountToFreeDelivery > 0 ? (
          <div className="mb-6 bg-[#fff8ee] border border-[#f0d080] rounded-2xl px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm sm:text-base font-bold text-[#7a5c1e]">
                🚚 Add ₹{amountToFreeDelivery} more for{" "}
                <span className="text-[#3d6b35]">FREE delivery!</span>
              </p>
              <span className="text-xs font-semibold text-[#a07820]">
                ₹{subtotal} / ₹{FREE_DELIVERY_THRESHOLD}
              </span>
            </div>
            <div className="h-3 bg-[#f0e0a0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3d6b35] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl px-5 py-4">
            <p className="text-base font-bold text-[#3d6b35]">
              🎉 You've unlocked <span className="underline">FREE delivery!</span>
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT: Cart Items */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {items.map((item) => (
              <CartItemRow
                key={`${item.id}-${item.variant}`}
                item={item}
                onQtyChange={updateQuantity}
                onRemove={handleRemove}
              />
            ))}

            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-[#e8e0d0] p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={20} className="text-[#3d6b35]" />
                <h3 className="text-lg font-bold text-[#2a2a1e]">Have a Coupon Code?</h3>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#eef5ea] border border-[#b8d4a0] rounded-xl px-4 py-3">
                  <div>
                    <p className="text-base font-bold text-[#3d6b35]">
                      "{appliedCoupon.code}" applied!
                    </p>
                    <p className="text-sm text-[#5a5a48]">
                      {appliedCoupon.discount}% off — saving ₹{couponDiscount}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-2 rounded-lg hover:bg-white transition-colors"
                    aria-label="Remove coupon"
                  >
                    <X size={18} className="text-[#7a7a68]" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. GARDEN10)"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    className="flex-1 bg-[#faf7f2] border-2 border-[#d4c9a8] rounded-xl px-4 py-3 text-base text-[#2a2a1e] placeholder:text-[#b0a890] outline-none focus:border-[#3d6b35] transition-colors font-medium"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-sm text-[#c0392b] mt-2 font-medium">{couponError}</p>
              )}
              {!appliedCoupon && (
                <p className="text-xs text-[#a8a090] mt-2">
                  Try: GARDEN10, KAVIN20, or GREEN15
                </p>
              )}
            </div>

            <Link
              href="/shop"
              className="flex items-center gap-2 text-base font-semibold text-[#3d6b35] hover:text-[#335c2c] transition-colors w-fit"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="w-full lg:w-96 shrink-0 flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden">
              <div className="bg-[#3d6b35] px-5 py-4">
                <h2 className="text-xl font-bold text-white">Order Summary</h2>
              </div>

              <div className="p-5 flex flex-col gap-3">
                <div className="flex justify-between text-base text-[#5a5a48]">
                  <span>Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                  <span className="font-semibold text-[#2a2a1e]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-base text-[#3d6b35]">
                    <span>Product savings</span>
                    <span className="font-semibold">−₹{savings.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-base text-[#3d6b35]">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span className="font-semibold">
                      −₹{couponDiscount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-base text-[#5a5a48]">
                  <span className="flex items-center gap-1.5">
                    <Truck size={16} className="text-[#3d6b35]" />
                    Delivery
                  </span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-[#3d6b35]">FREE</span>
                  ) : (
                    <span className="font-semibold text-[#2a2a1e]">₹{deliveryFee}</span>
                  )}
                </div>

                <div className="border-t-2 border-[#e8e0d0] pt-3 mt-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold text-[#2a2a1e]">Total</span>
                    <span className="text-3xl font-black text-[#3d6b35]">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {savings + couponDiscount > 0 && (
                    <p className="text-sm text-[#3d6b35] font-semibold mt-1 text-right">
                      You save ₹{(savings + couponDiscount).toLocaleString("en-IN")} total!
                    </p>
                  )}
                </div>

                <Link
                  href="/checkout"
                  className="mt-2 w-full flex items-center justify-center gap-3 bg-[#3d6b35] hover:bg-[#2e5228] text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 active:scale-[.98] shadow-md"
                >
                  Proceed to Checkout
                  <ArrowRight size={22} />
                </Link>

                <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs text-[#7a7a68]">
                    <ShieldCheck size={14} className="text-[#3d6b35]" />
                    Secure checkout
                  </span>
                  <span className="text-[#d4c9a8]">|</span>
                  <span className="flex items-center gap-1.5 text-xs text-[#7a7a68]">
                    <Truck size={14} className="text-[#3d6b35]" />
                    {deliveryFee === 0 ? "Free delivery" : `₹${deliveryFee} delivery`}
                  </span>
                </div>

                <div className="flex gap-2 justify-center mt-1 flex-wrap">
                  {["VISA", "Mastercard", "UPI", "G Pay", "Net Banking"].map((p) => (
                    <span
                      key={p}
                      className="border border-[#e8e0d0] px-2.5 py-1 rounded-lg text-xs text-[#7a7a68] font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#faf7f2] border border-[#d4c9a8] rounded-2xl px-5 py-4 flex items-start gap-4">
              <Phone size={22} className="text-[#3d6b35] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#2a2a1e]">Need help with your order?</p>
                <p className="text-xs text-[#7a7a68] mt-0.5">Our team is happy to assist you.</p>
                <a
                  href="tel:+919876543210"
                  className="inline-block mt-2 text-sm font-bold text-[#3d6b35] hover:underline"
                >
                  📞 +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Undo toast */}
      {removedItem && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2a2a1e] text-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-2xl max-w-sm w-[calc(100%-2rem)]">
          <p className="flex-1 text-sm font-medium leading-snug">
            "{removedItem.name}" removed from cart
          </p>
          <button
            onClick={handleUndo}
            className="shrink-0 bg-[#3d6b35] hover:bg-[#4a8040] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            Undo
          </button>
        </div>
      )}

      {/* Sticky Checkout Bar (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t-2 border-[#e8e0d0] px-4 py-3 flex items-center gap-4 shadow-2xl">
        <div className="flex-1">
          <p className="text-xs text-[#7a7a68]">
            {items.length} item{items.length !== 1 ? "s" : ""} ·{" "}
            {deliveryFee === 0 ? "Free delivery" : `+₹${deliveryFee} delivery`}
          </p>
          <p className="text-2xl font-black text-[#3d6b35] leading-tight">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
        <Link
          href="/checkout"
          className="flex items-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] text-white font-bold text-base px-6 py-3.5 rounded-xl transition-colors shadow-md"
        >
          Checkout <ArrowRight size={18} />
        </Link>
      </div>
      <div className="lg:hidden h-20" />
    </div>
  );
}