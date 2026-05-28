"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  name: string;
  subtitle: string;
  variant: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  badge?: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: number, variant?: string) => void;
  updateQuantity: (id: number, qty: number, variant?: string) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
  getQuantity: (id: number) => number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "kavin_cart";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items,    setItems]    = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
  }, [items, hydrated]);

  // ── addItem ─────────────────────────────────────────────────────────────────
  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.id === newItem.id && i.variant === newItem.variant
        );
        if (existing) {
          return prev.map((i) =>
            i.id === newItem.id && i.variant === newItem.variant
              ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) }
              : i
          );
        }
        return [...prev, { ...newItem, quantity: newItem.quantity ?? 1 }];
      });
    },
    []
  );

  // ── removeItem ──────────────────────────────────────────────────────────────
  // FIX: now matches by both id AND variant so mixed variants work correctly
  const removeItem = useCallback((id: number, variant?: string) => {
    setItems((prev) =>
      prev.filter((i) => {
        if (variant !== undefined) {
          return !(i.id === id && i.variant === variant);
        }
        return i.id !== id;
      })
    );
  }, []);

  // ── updateQuantity ──────────────────────────────────────────────────────────
  // FIX: qty < 1 now REMOVES the item instead of doing nothing.
  // This fixes the cart bug where pressing minus at qty=1 did nothing.
  const updateQuantity = useCallback(
    (id: number, qty: number, variant?: string) => {
      if (qty < 1) {
        // Remove the item when quantity goes below 1
        setItems((prev) =>
          prev.filter((i) => {
            if (variant !== undefined) {
              return !(i.id === id && i.variant === variant);
            }
            return i.id !== id;
          })
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) => {
          if (variant !== undefined) {
            return i.id === id && i.variant === variant
              ? { ...i, quantity: qty }
              : i;
          }
          return i.id === id ? { ...i, quantity: qty } : i;
        })
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (id: number) => items.some((i) => i.id === id),
    [items]
  );

  const getQuantity = useCallback(
    (id: number) => items.find((i) => i.id === id)?.quantity ?? 0,
    [items]
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal   = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}