// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoredOrderItem {
  id: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export interface StoredOrder {
  id: string;
  date: string; // ISO string
  status: "confirmed" | "packed" | "shipped" | "delivered";
  paymentMethod: string;
  address: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: StoredOrderItem[];
  subtotal: number;
  deliveryFee: number;
  couponDiscount: number;
  total: number;
}

// ─── Storage key ──────────────────────────────────────────────────────────────

const ORDERS_KEY = "kavin_orders";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getOrders(): StoredOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: StoredOrder): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getOrders();
    // Newest first
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...existing]));
  } catch {
    // ignore storage errors
  }
}

export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 89999);
  return `KO-${year}-${rand}`;
}

export function formatOrderDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function statusLabel(status: StoredOrder["status"]): string {
  const map: Record<StoredOrder["status"], string> = {
    confirmed: "Order Confirmed",
    packed: "Being Packed",
    shipped: "Out for Delivery",
    delivered: "Delivered",
  };
  return map[status];
}

export function statusColor(status: StoredOrder["status"]): string {
  const map: Record<StoredOrder["status"], string> = {
    confirmed: "bg-[#fff8ee] text-[#7a5c1e] border-[#f0d080]",
    packed: "bg-[#eef5ea] text-[#3d6b35] border-[#b8d4a0]",
    shipped: "bg-[#e8f0fb] text-[#1a4d8a] border-[#a8c0e8]",
    delivered: "bg-[#eef5ea] text-[#2e5228] border-[#7ec856]",
  };
  return map[status];
}