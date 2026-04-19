export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationResult {
  errors: ValidationError[] = [];

  add(field: string, message: string) {
    this.errors.push({ field, message });
  }

  get ok() {
    return this.errors.length === 0;
  }

  toResponse() {
    return { error: this.errors[0]?.message ?? "Validation failed", errors: this.errors };
  }
}

// ── Primitives ────────────────────────────────────────────────────────────────

export function isNonEmptyString(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0;
}

export function isIndianPhone(val: string): boolean {
  return /^[6-9]\d{9}$/.test(val.replace(/[\s\-+]/g, ""));
}

export function isValidEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

export function isValidPincode(val: string): boolean {
  return /^\d{6}$/.test(val.trim());
}

export function isPositiveNumber(val: unknown): val is number {
  return typeof val === "number" && val > 0 && isFinite(val);
}

export function sanitize(val: unknown): string {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, 2000); // never store unbounded user text
}

// ── Domain validators ────────────────────────────────────────────────────────

export function validateCheckoutAddress(address: Record<string, unknown>) {
  const v = new ValidationResult();

  if (!isNonEmptyString(address.name) || String(address.name).trim().length < 2)
    v.add("name", "Full name must be at least 2 characters.");

  const rawPhone = String(address.phone ?? "").replace(/[\s\-+]/g, "");
  if (!isIndianPhone(rawPhone))
    v.add("phone", "Please enter a valid 10-digit Indian mobile number.");

  if (!isNonEmptyString(address.line1) || String(address.line1).trim().length < 5)
    v.add("addressLine1", "Please enter a complete address.");

  if (!isNonEmptyString(address.city))
    v.add("city", "City is required.");

  if (!isNonEmptyString(address.state))
    v.add("state", "State is required.");

  if (!isValidPincode(String(address.pincode ?? "")))
    v.add("pincode", "Pincode must be a 6-digit number.");

  return v;
}

export function validateOrderItems(items: unknown) {
  const v = new ValidationResult();

  if (!Array.isArray(items) || items.length === 0) {
    v.add("items", "Your cart is empty.");
    return v;
  }

  if (items.length > 50) {
    v.add("items", "Too many items in cart.");
    return v;
  }

  for (const [i, item] of items.entries()) {
    if (typeof item !== "object" || item === null) {
      v.add(`items[${i}]`, "Invalid item.");
      continue;
    }
    const it = item as Record<string, unknown>;
    if (!isNonEmptyString(it.name)) v.add(`items[${i}].name`, "Item name is required.");
    if (!isPositiveNumber(Number(it.price))) v.add(`items[${i}].price`, "Invalid item price.");
    const qty = Number(it.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 99)
      v.add(`items[${i}].quantity`, "Item quantity must be between 1 and 99.");
  }

  return v;
}

export function validateContactForm(data: Record<string, unknown>) {
  const v = new ValidationResult();

  const name = sanitize(data.name);
  if (name.length < 2) v.add("name", "Name must be at least 2 characters.");

  const phone = String(data.phone ?? "").replace(/[\s\-+]/g, "");
  if (!isIndianPhone(phone)) v.add("phone", "Please enter a valid 10-digit mobile number.");

  if (data.email && !isValidEmail(sanitize(data.email)))
    v.add("email", "Please enter a valid email address.");

  const message = sanitize(data.message);
  if (message.length < 10) v.add("message", "Message must be at least 10 characters.");
  if (message.length > 1000) v.add("message", "Message must be under 1000 characters.");

  return v;
}

export function validateProductForm(data: Record<string, unknown>) {
  const v = new ValidationResult();

  if (!isNonEmptyString(data.name)) v.add("name", "Product name is required.");
  if (!isNonEmptyString(data.description)) v.add("description", "Description is required.");
  if (!isNonEmptyString(data.categoryId)) v.add("categoryId", "Category is required.");
  if (!isNonEmptyString(data.sku)) v.add("sku", "SKU is required.");

  const price = Number(data.price);
  if (!isPositiveNumber(price) || price > 1_00_000)
    v.add("price", "Price must be between ₹1 and ₹1,00,000.");

  const stock = Number(data.stock);
  if (!Number.isInteger(stock) || stock < 0 || stock > 100_000)
    v.add("stock", "Stock must be a non-negative integer.");

  const images = data.images as unknown[];
  if (!Array.isArray(images) || images.length === 0)
    v.add("images", "At least one product image is required.");

  return v;
}