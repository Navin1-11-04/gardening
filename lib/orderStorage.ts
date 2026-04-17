// lib/orderStorage.ts
// Thin localStorage wrappers so the checkout and confirmation page
// can share order data without a DB round-trip.

export interface StoredOrderAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface StoredOrderItem {
  id: number;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface StoredOrder {
  id: string;
  date: string;
  status: string;
  paymentMethod: string;
  address: StoredOrderAddress;
  items: StoredOrderItem[];
  subtotal: number;
  deliveryFee: number;
  couponDiscount: number;
  total: number;
}

const STORAGE_KEY = "kavin_orders";
const MAX_STORED   = 20; // keep last 20 orders only

function loadAll(): StoredOrder[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveAll(orders: StoredOrder[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.slice(0, MAX_STORED)));
  } catch {
    // localStorage might be full — ignore
  }
}

/** Persist a new order. Safe to call server-side (no-op). */
export function saveOrder(order: StoredOrder) {
  const all = loadAll().filter((o) => o.id !== order.id);
  saveAll([order, ...all]);
}

/** Retrieve a single order by ID. Returns null if not found. */
export function getOrder(id: string): StoredOrder | null {
  return loadAll().find((o) => o.id === id) ?? null;
}

/** Retrieve all stored orders (most recent first). */
export function getAllOrders(): StoredOrder[] {
  return loadAll();
}

/** Generate a unique order ID like KO-20250417-A3F2 */
export function generateOrderId(): string {
  const date = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `KO-${date}-${rand}`;
}