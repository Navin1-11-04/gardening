"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  MapPin,
  CreditCard,
  CheckCircle2,
  Plus,
  Truck,
  ShieldCheck,
  Phone,
  Pencil,
  Check,
  Wallet,
  Smartphone,
  Building2,
} from "lucide-react";
import { useCart } from "../_context/CartContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "address" | "payment" | "review";

interface Address {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  type: "Home" | "Work" | "Other";
}

interface PaymentMethod {
  id: string;
  label: string;
  icon: React.ReactNode;
  desc: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_FEE = 79;

const savedAddresses: Address[] = [
  {
    fullName: "Meenakshi Rajan",
    phone: "98765 43210",
    pincode: "637501",
    addressLine1: "No. 12, Gandhi Nagar",
    addressLine2: "Near Tamil Nadu Bank",
    city: "Namakkal",
    state: "Tamil Nadu",
    type: "Home",
  },
];

const paymentMethods: PaymentMethod[] = [
  { id: "upi",        label: "UPI / GPay / PhonePe",  icon: <Smartphone size={22} />, desc: "Pay instantly with any UPI app" },
  { id: "card",       label: "Credit / Debit Card",    icon: <CreditCard size={22} />,  desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking",             icon: <Building2 size={22} />,   desc: "All major Indian banks" },
  { id: "cod",        label: "Cash on Delivery",        icon: <Wallet size={22} />,      desc: "Pay when your order arrives" },
];

const STEPS: { id: Step; label: string }[] = [
  { id: "address", label: "Delivery Address" },
  { id: "payment", label: "Payment Method" },
  { id: "review",  label: "Review & Place Order" },
];

// ─── Step Progress Bar ────────────────────────────────────────────────────────

const StepBar = ({ current }: { current: Step }) => {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-8 sm:mb-10 overflow-x-auto">
      {STEPS.map((step, i) => {
        const done   = i < idx;
        const active = i === idx;
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all ${
              active ? "bg-[#3d6b35] text-white shadow-md" :
              done   ? "bg-[#eef5ea] text-[#3d6b35] border border-[#b8d4a0]" :
                       "bg-white text-[#a8a090] border border-[#e8e0d0]"
            }`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                active ? "bg-white/20 text-white" :
                done   ? "bg-[#3d6b35] text-white" :
                          "bg-[#f0ece4] text-[#a8a090]"
              }`}>
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span className="hidden sm:inline whitespace-nowrap">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-6 sm:w-10 h-0.5 mx-1 ${i < idx ? "bg-[#3d6b35]" : "bg-[#e8e0d0]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Field Component ──────────────────────────────────────────────────────────

const Field = ({
  label, value, onChange, placeholder, type = "text", required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-base font-bold text-[#2a2a1e]">
      {label}{required && <span className="text-[#c0392b] ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl px-4 py-3.5 text-base text-[#2a2a1e] placeholder:text-[#b0a890] outline-none transition-colors"
    />
  </div>
);

// ─── Address Step ─────────────────────────────────────────────────────────────

const AddressStep = ({
  onNext, selected, setSelected,
}: {
  onNext: () => void;
  selected: number | "new";
  setSelected: (v: number | "new") => void;
}) => {
  const [form, setForm] = useState<Address>({
    fullName: "", phone: "", pincode: "", addressLine1: "",
    addressLine2: "", city: "", state: "", type: "Home",
  });
  const set = (k: keyof Address) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const isFormValid =
    selected !== "new" ||
    (form.fullName && form.phone && form.pincode && form.addressLine1 && form.city && form.state);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold text-[#7a9e5f] uppercase tracking-wide mb-1">Step 1</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2a2a1e] font-outfit">Delivery Address</h2>
        <p className="text-base text-[#7a7a68] mt-1">Where should we deliver your order?</p>
      </div>

      {savedAddresses.map((addr, i) => (
        <button key={i} onClick={() => setSelected(i)}
          className={`w-full text-left flex items-start gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            selected === i ? "border-[#3d6b35] bg-[#eef5ea]" : "border-[#e8e0d0] bg-white hover:border-[#a8c890]"
          }`}
        >
          <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
            selected === i ? "border-[#3d6b35] bg-[#3d6b35]" : "border-[#d4c9a8]"
          }`}>
            {selected === i && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-base font-bold text-[#2a2a1e]">{addr.fullName}</span>
              <span className="text-xs font-bold bg-[#3d6b35] text-white px-2.5 py-0.5 rounded-full">{addr.type}</span>
            </div>
            <p className="text-sm text-[#5a5a48] leading-snug">
              {addr.addressLine1}{addr.addressLine2 ? ", " + addr.addressLine2 : ""}, {addr.city} — {addr.pincode}
            </p>
            <p className="text-sm text-[#5a5a48] mt-0.5">{addr.state} · 📞 {addr.phone}</p>
          </div>
          {selected === i && (
            <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-[#3d6b35] mt-0.5">
              <Pencil size={12} /> Edit
            </span>
          )}
        </button>
      ))}

      <button onClick={() => setSelected("new")}
        className={`w-full flex items-center gap-3 p-4 sm:p-5 rounded-2xl border-2 transition-all ${
          selected === "new"
            ? "border-[#3d6b35] bg-[#eef5ea]"
            : "border-dashed border-[#d4c9a8] bg-white hover:border-[#3d6b35] hover:bg-[#faf7f2]"
        }`}
      >
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
          selected === "new" ? "border-[#3d6b35] bg-[#3d6b35]" : "border-[#d4c9a8]"
        }`}>
          {selected === "new" ? <div className="w-2.5 h-2.5 rounded-full bg-white" /> : <Plus size={14} className="text-[#7a7a68]" />}
        </div>
        <span className="text-base font-bold text-[#3d6b35]">Add a new address</span>
      </button>

      {selected === "new" && (
        <div className="bg-white border border-[#e8e0d0] rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name"     value={form.fullName}     onChange={set("fullName")}     placeholder="e.g. Meenakshi Rajan"  required />
            <Field label="Phone Number"  value={form.phone}        onChange={set("phone")}         placeholder="e.g. 98765 43210"      type="tel" required />
          </div>
          <Field label="Address Line 1" value={form.addressLine1} onChange={set("addressLine1")} placeholder="House no., Street, Area" required />
          <Field label="Address Line 2" value={form.addressLine2} onChange={set("addressLine2")} placeholder="Landmark (optional)" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Field label="Pincode"   value={form.pincode} onChange={set("pincode")} placeholder="6-digit pincode" required />
            <Field label="City / Town" value={form.city}  onChange={set("city")}   placeholder="e.g. Namakkal"   required />
            <Field label="State"     value={form.state}   onChange={set("state")}  placeholder="e.g. Tamil Nadu" required />
          </div>
          <div>
            <label className="text-base font-bold text-[#2a2a1e] block mb-2">Address Type</label>
            <div className="flex gap-3 flex-wrap">
              {(["Home", "Work", "Other"] as const).map((t) => (
                <button key={t} onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`px-5 py-2.5 rounded-xl text-base font-bold border-2 transition-all ${
                    form.type === t ? "bg-[#3d6b35] text-white border-[#3d6b35]" : "bg-white text-[#5a5a48] border-[#d4c9a8] hover:border-[#3d6b35]"
                  }`}
                >
                  {t === "Home" ? "🏠" : t === "Work" ? "💼" : "📍"} {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button onClick={onNext} disabled={!isFormValid}
        className="w-full flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] disabled:bg-[#a8c890] disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl transition-all active:scale-[.98] shadow-md"
      >
        Continue to Payment <ChevronRight size={22} />
      </button>
    </div>
  );
};

// ─── Payment Step ─────────────────────────────────────────────────────────────

const PaymentStep = ({
  onNext, onBack, selected, setSelected, total,
}: {
  onNext: () => void; onBack: () => void;
  selected: string; setSelected: (v: string) => void;
  total: number;
}) => {
  const [upiId,    setUpiId]    = useState("");
  const [cardNum,  setCardNum]  = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry,   setExpiry]   = useState("");
  const [cvv,      setCvv]      = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold text-[#7a9e5f] uppercase tracking-wide mb-1">Step 2</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2a2a1e] font-outfit">Payment Method</h2>
        <p className="text-base text-[#7a7a68] mt-1">Choose how you'd like to pay for your order.</p>
      </div>

      <div className="flex flex-col gap-3">
        {paymentMethods.map((method) => (
          <div key={method.id}>
            <button onClick={() => setSelected(method.id)}
              className={`w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all text-left ${
                selected === method.id ? "border-[#3d6b35] bg-[#eef5ea]" : "border-[#e8e0d0] bg-white hover:border-[#a8c890]"
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selected === method.id ? "border-[#3d6b35] bg-[#3d6b35]" : "border-[#d4c9a8]"
              }`}>
                {selected === method.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                selected === method.id ? "bg-[#3d6b35] text-white" : "bg-[#f0ece4] text-[#5a5a48]"
              }`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <p className="text-base sm:text-lg font-bold text-[#2a2a1e]">{method.label}</p>
                <p className="text-sm text-[#7a7a68]">{method.desc}</p>
              </div>
              {method.id === "cod" && (
                <span className="text-xs font-bold bg-[#fff8ee] text-[#7a5c1e] border border-[#f0d080] px-2.5 py-1 rounded-full shrink-0">
                  No extra charge
                </span>
              )}
            </button>

            {selected === "upi" && method.id === "upi" && (
              <div className="mt-2 bg-white border border-[#e8e0d0] rounded-2xl p-5">
                <p className="text-base font-bold text-[#2a2a1e] mb-3">Enter your UPI ID</p>
                <div className="flex gap-3">
                  <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi"
                    className="flex-1 bg-[#faf7f2] border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl px-4 py-3.5 text-base outline-none transition-colors"
                  />
                  <button className="bg-[#eef5ea] hover:bg-[#3d6b35] hover:text-white text-[#3d6b35] border-2 border-[#b8d4a0] hover:border-[#3d6b35] font-bold px-5 rounded-xl transition-all text-sm">
                    Verify
                  </button>
                </div>
                <p className="text-xs text-[#7a7a68] mt-2">e.g. 9876543210@paytm or name@oksbi</p>
              </div>
            )}

            {selected === "card" && method.id === "card" && (
              <div className="mt-2 bg-white border border-[#e8e0d0] rounded-2xl p-5 flex flex-col gap-4">
                <p className="text-base font-bold text-[#2a2a1e]">Card Details</p>
                <Field label="Card Number"  value={cardNum}  onChange={setCardNum}  placeholder="1234 5678 9012 3456" />
                <Field label="Name on Card" value={cardName} onChange={setCardName} placeholder="As printed on card" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry Date" value={expiry} onChange={setExpiry} placeholder="MM / YY" />
                  <Field label="CVV"         value={cvv}    onChange={setCvv}    placeholder="3-digit code" type="password" />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#7a7a68] bg-[#faf7f2] p-3 rounded-xl border border-[#e8e0d0]">
                  <ShieldCheck size={16} className="text-[#3d6b35] shrink-0" />
                  Your card details are encrypted and never stored.
                </div>
              </div>
            )}

            {selected === "cod" && method.id === "cod" && (
              <div className="mt-2 bg-[#fff8ee] border border-[#f0d080] rounded-2xl p-4">
                <p className="text-base text-[#7a5c1e] leading-relaxed">
                  💰 Please keep <strong>₹{total.toLocaleString("en-IN")}</strong> ready in cash when your order arrives. Our delivery partner will collect it at your doorstep.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onBack}
          className="sm:w-40 flex items-center justify-center gap-2 bg-white border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#5a5a48] hover:text-[#3d6b35] font-bold text-base py-3.5 rounded-xl transition-all"
        >
          ← Back
        </button>
        <button onClick={onNext} disabled={!selected}
          className="flex-1 flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] disabled:bg-[#a8c890] disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl transition-all active:scale-[.98] shadow-md"
        >
          Review Order <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

// ─── Review Step ──────────────────────────────────────────────────────────────

const ReviewStep = ({
  onPlace, onBack, paymentMethod, subtotal, deliveryFee, total,
}: {
  onPlace: () => void; onBack: () => void; paymentMethod: string;
  subtotal: number; deliveryFee: number; total: number;
}) => {
  const { items } = useCart();
  const pm   = paymentMethods.find((p) => p.id === paymentMethod);
  const addr = savedAddresses[0];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold text-[#7a9e5f] uppercase tracking-wide mb-1">Step 3</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2a2a1e] font-outfit">Review Your Order</h2>
        <p className="text-base text-[#7a7a68] mt-1">Please check everything before placing your order.</p>
      </div>

      {/* Delivery address card */}
      <div className="bg-white border border-[#e8e0d0] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-[#3d6b35]" />
            <span className="text-base font-bold text-[#2a2a1e]">Delivering to</span>
          </div>
          <button onClick={onBack} className="text-sm font-semibold text-[#3d6b35] hover:underline flex items-center gap-1">
            <Pencil size={13} /> Change
          </button>
        </div>
        <p className="text-base font-bold text-[#2a2a1e]">{addr.fullName} · 📞 {addr.phone}</p>
        <p className="text-sm text-[#5a5a48] mt-1 leading-snug">
          {addr.addressLine1}, {addr.addressLine2 && addr.addressLine2 + ", "}{addr.city}, {addr.state} — {addr.pincode}
        </p>
        <div className="flex items-center gap-2 mt-3 text-sm text-[#3d6b35] bg-[#eef5ea] px-3 py-2 rounded-xl w-fit font-semibold">
          <Truck size={15} />
          Estimated delivery: 2–4 business days
        </div>
      </div>

      {/* Payment card */}
      <div className="bg-white border border-[#e8e0d0] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-[#3d6b35]" />
            <span className="text-base font-bold text-[#2a2a1e]">Payment</span>
          </div>
          <button onClick={onBack} className="text-sm font-semibold text-[#3d6b35] hover:underline flex items-center gap-1">
            <Pencil size={13} /> Change
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eef5ea] flex items-center justify-center text-[#3d6b35]">
            {pm?.icon}
          </div>
          <div>
            <p className="text-base font-bold text-[#2a2a1e]">{pm?.label}</p>
            <p className="text-sm text-[#7a7a68]">{pm?.desc}</p>
          </div>
        </div>
      </div>

      {/* Real cart items from context */}
      <div className="bg-white border border-[#e8e0d0] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e8e0d0]">
          <span className="text-base font-bold text-[#2a2a1e]">Order Items ({items.length})</span>
        </div>
        <div className="flex flex-col divide-y divide-[#f0ece4]">
          {items.map((item) => (
            <div key={`${item.id}-${item.variant}`} className="flex items-center gap-4 px-5 py-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#f5f0ea] shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-[#2a2a1e] leading-snug">{item.name}</p>
                <p className="text-sm text-[#7a7a68]">{item.variant} × {item.quantity}</p>
              </div>
              <p className="text-lg font-black text-[#3d6b35] shrink-0">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 bg-[#faf7f2] border-t border-[#e8e0d0] flex flex-col gap-2">
          <div className="flex justify-between text-sm text-[#5a5a48]">
            <span>Subtotal</span>
            <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm text-[#3d6b35]">
            <span className="flex items-center gap-1"><Truck size={13} />Delivery</span>
            <span className="font-semibold">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#2a2a1e] pt-2 border-t border-[#e8e0d0]">
            <span>Total to Pay</span>
            <span className="text-xl font-black text-[#3d6b35]">₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-[#7a7a68] leading-relaxed">
        By placing this order, you agree to our{" "}
        <Link href="/privacy" className="text-[#3d6b35] font-semibold underline underline-offset-2">Terms & Conditions</Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-[#3d6b35] font-semibold underline underline-offset-2">Privacy Policy</Link>.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onBack}
          className="sm:w-40 flex items-center justify-center gap-2 bg-white border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#5a5a48] hover:text-[#3d6b35] font-bold text-base py-3.5 rounded-xl transition-all"
        >
          ← Back
        </button>
        <button onClick={onPlace}
          className="flex-1 flex items-center justify-center gap-3 bg-[#3d6b35] hover:bg-[#2e5228] text-white font-bold text-lg py-4 rounded-xl transition-all active:scale-[.98] shadow-md"
        >
          <CheckCircle2 size={24} />
          Place Order — ₹{total.toLocaleString("en-IN")}
        </button>
      </div>
    </div>
  );
};

// ─── Order Summary Sidebar ────────────────────────────────────────────────────

const OrderSummary = ({
  items, subtotal, deliveryFee, total,
}: {
  items: ReturnType<typeof useCart>["items"];
  subtotal: number; deliveryFee: number; total: number;
}) => (
  <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-24 flex flex-col gap-4">
    <div className="bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden">
      <div className="bg-[#3d6b35] px-5 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Order Summary</h3>
        <Link href="/cart" className="text-white/80 hover:text-white text-sm font-semibold underline underline-offset-2 transition-colors">
          Edit cart
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-[#f0ece4]">
        {items.map((item) => (
          <div key={`${item.id}-${item.variant}`} className="flex items-center gap-3 px-5 py-3.5">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#f5f0ea] shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#2a2a1e] leading-snug truncate">{item.name}</p>
              <p className="text-xs text-[#7a7a68]">{item.variant} × {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-[#3d6b35] shrink-0">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 bg-[#faf7f2] border-t border-[#e8e0d0] flex flex-col gap-2.5">
        <div className="flex justify-between text-sm text-[#5a5a48]">
          <span>Subtotal</span>
          <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm text-[#3d6b35]">
          <span className="flex items-center gap-1"><Truck size={13} />Delivery</span>
          <span className="font-bold">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
        </div>
        <div className="flex justify-between items-baseline pt-2 border-t border-[#e8e0d0]">
          <span className="text-base font-bold text-[#2a2a1e]">Total</span>
          <span className="text-2xl font-black text-[#3d6b35]">₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    <div className="bg-[#faf7f2] border border-[#d4c9a8] rounded-2xl px-5 py-4 flex items-start gap-3">
      <Phone size={20} className="text-[#3d6b35] shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-[#2a2a1e]">Need help placing your order?</p>
        <a href="tel:+919876543210" className="text-base font-bold text-[#3d6b35] hover:underline mt-1 block">
          📞 +91 98765 43210
        </a>
        <p className="text-xs text-[#7a7a68] mt-0.5">Mon–Sat, 9am–6pm</p>
      </div>
    </div>

    <div className="flex items-center justify-center gap-2 text-sm text-[#7a7a68]">
      <ShieldCheck size={16} className="text-[#3d6b35]" />
      100% secure & encrypted checkout
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [step,            setStep]            = useState<Step>("address");
  const [selectedAddress, setSelectedAddress] = useState<number | "new">(0);
  const [selectedPayment, setSelectedPayment] = useState("cod");

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total       = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    clearCart();
    router.push("/order-confirmation");
  };

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4 text-center py-20">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold text-[#2a2a1e] font-outfit mb-3">Your cart is empty</h2>
        <p className="text-lg text-[#7a7a68] mb-8 max-w-sm">Add some products before checking out.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm flex-wrap">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <Link href="/cart" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Cart</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">Checkout</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <StepBar current={step} />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0">
            {step === "address" && (
              <AddressStep
                onNext={() => setStep("payment")}
                selected={selectedAddress}
                setSelected={setSelectedAddress}
              />
            )}
            {step === "payment" && (
              <PaymentStep
                onNext={() => setStep("review")}
                onBack={() => setStep("address")}
                selected={selectedPayment}
                setSelected={setSelectedPayment}
                total={total}
              />
            )}
            {step === "review" && (
              <ReviewStep
                onPlace={handlePlaceOrder}
                onBack={() => setStep("payment")}
                paymentMethod={selectedPayment}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
              />
            )}
          </div>

          <OrderSummary
            items={items}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}