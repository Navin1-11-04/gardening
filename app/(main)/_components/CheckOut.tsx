"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight, MapPin, CreditCard, CheckCircle2,
  Truck, ShieldCheck, Phone, Pencil, Check,
  Wallet, Smartphone, Building2, RefreshCw, Mail, AlertCircle,
} from "lucide-react";
import { useCart } from "../_context/CartContext";
import { saveOrder, generateOrderId } from "@/lib/orderStorage";
import { useStoreConfig } from "@/lib/useStoreConfig";
import { isTamilNaduPincode, getTNDistrictHint } from "@/lib/tamilnaduPincodes";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "address" | "otp" | "payment" | "review";

interface Address {
  fullName: string;
  phone: string;
  email: string;
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

const paymentMethods: PaymentMethod[] = [
  { id: "upi",        label: "UPI / GPay / PhonePe", icon: <Smartphone size={22} />, desc: "Pay instantly with any UPI app" },
  { id: "card",       label: "Credit / Debit Card",  icon: <CreditCard size={22} />, desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking",           icon: <Building2 size={22} />,  desc: "All major Indian banks" },
  { id: "cod",        label: "Cash on Delivery",      icon: <Wallet size={22} />,     desc: "Pay when your order arrives" },
];

const STEPS: { id: Step; label: string }[] = [
  { id: "address", label: "Address" },
  { id: "otp",     label: "Confirm" },
  { id: "payment", label: "Payment" },
  { id: "review",  label: "Review" },
];

// ─── Step Bar ─────────────────────────────────────────────────────────────────

const StepBar = ({ current }: { current: Step }) => {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-8 sm:mb-10 overflow-x-auto">
      {STEPS.map((step, i) => {
        const done = i < idx; const active = i === idx;
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all ${
              active ? "bg-[#3d6b35] text-white shadow-md" :
              done   ? "bg-[#eef5ea] text-[#3d6b35] border border-[#b8d4a0]" :
                       "bg-white text-[#a8a090] border border-[#e8e0d0]"
            }`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                active ? "bg-white/20 text-white" : done ? "bg-[#3d6b35] text-white" : "bg-[#f0ece4] text-[#a8a090]"
              }`}>
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span className="hidden sm:inline whitespace-nowrap">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-4 sm:w-8 h-0.5 mx-1 ${i < idx ? "bg-[#3d6b35]" : "bg-[#e8e0d0]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Field ────────────────────────────────────────────────────────────────────

const Field = ({
  label, value, onChange, placeholder, type = "text", required = false, hint, error,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean; hint?: string; error?: string;
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
      className={`w-full bg-white border-2 rounded-xl px-4 py-3.5 text-base text-[#2a2a1e] placeholder:text-[#b0a890] outline-none transition-colors ${
        error ? "border-red-400 focus:border-red-500" : "border-[#d4c9a8] focus:border-[#3d6b35]"
      }`}
    />
    {error && (
      <p className="text-sm text-red-600 font-semibold flex items-center gap-1">
        <AlertCircle size={13} />{error}
      </p>
    )}
    {hint && !error && <p className="text-xs text-[#7a7a68] mt-0.5">{hint}</p>}
  </div>
);

// ─── Address Step ─────────────────────────────────────────────────────────────

const AddressStep = ({
  onNext, form, setForm,
}: {
  onNext: () => void;
  form: Address;
  setForm: (v: Address) => void;
}) => {
  const [pincodeError, setPincodeError] = useState("");
  const [districtHint, setDistrictHint] = useState("");

  const set = (k: keyof Address) => (v: string) => {
    setForm({ ...form, [k]: v });
    // Live pincode validation
    if (k === "pincode") {
      if (v.length === 6) {
        if (!isTamilNaduPincode(v)) {
          setPincodeError("Sorry, we currently deliver only within Tamil Nadu.");
          setDistrictHint("");
        } else {
          setPincodeError("");
          setDistrictHint(getTNDistrictHint(v));
        }
      } else {
        setPincodeError("");
        setDistrictHint("");
      }
    }
  };

  const isValid = !!(
    form.fullName &&
    form.phone &&
    form.email &&
    form.email.includes("@") &&
    form.pincode.length === 6 &&
    isTamilNaduPincode(form.pincode) &&
    form.addressLine1 &&
    form.city &&
    form.state
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold text-[#7a9e5f] uppercase tracking-wide mb-1">Step 1 of 4</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2a2a1e] font-outfit">Delivery Address</h2>
        <p className="text-base text-[#7a7a68] mt-1">We deliver across Tamil Nadu. Enter where you'd like your order delivered.</p>
      </div>

      {/* TN-only notice */}
      <div className="flex items-start gap-3 bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl px-4 py-3.5">
        <Truck size={18} className="text-[#3d6b35] shrink-0 mt-0.5" />
        <p className="text-sm text-[#2a5a20] font-medium">
          📍 We currently deliver to all districts across <strong>Tamil Nadu</strong> only.
          Free delivery on orders above ₹999.
        </p>
      </div>

      <div className="bg-white border border-[#e8e0d0] rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label="Full Name" value={form.fullName}
            onChange={set("fullName")} placeholder="e.g. Meenakshi Rajan" required
          />
          <Field
            label="Phone Number" value={form.phone}
            onChange={set("phone")} placeholder="e.g. 98765 43210"
            type="tel" required
          />
        </div>

        <Field
          label="Email Address" value={form.email}
          onChange={set("email")} placeholder="e.g. meenakshi@gmail.com"
          type="email" required
          hint="We'll send your order confirmation and a one-time code here"
        />

        <Field
          label="Address Line 1" value={form.addressLine1}
          onChange={set("addressLine1")} placeholder="House no., Street, Area" required
        />
        <Field
          label="Address Line 2 (optional)" value={form.addressLine2}
          onChange={set("addressLine2")} placeholder="Landmark, nearby area"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Pincode with TN validation */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-bold text-[#2a2a1e]">
              Pincode <span className="text-[#c0392b]">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => set("pincode")(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit pincode"
              className={`w-full bg-white border-2 rounded-xl px-4 py-3.5 text-base text-[#2a2a1e] placeholder:text-[#b0a890] outline-none transition-colors ${
                pincodeError
                  ? "border-red-400"
                  : districtHint
                  ? "border-[#3d6b35]"
                  : "border-[#d4c9a8] focus:border-[#3d6b35]"
              }`}
            />
            {pincodeError && (
              <p className="text-sm text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle size={13} />{pincodeError}
              </p>
            )}
            {districtHint && !pincodeError && (
              <p className="text-xs text-[#3d6b35] font-semibold flex items-center gap-1">
                ✓ Delivering to: {districtHint}
              </p>
            )}
          </div>

          <Field label="City / Town" value={form.city} onChange={set("city")} placeholder="e.g. Namakkal" required />
          <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} placeholder="Tamil Nadu" required />
        </div>

        <div>
          <label className="text-base font-bold text-[#2a2a1e] block mb-2">Address Type</label>
          <div className="flex gap-3 flex-wrap">
            {(["Home", "Work", "Other"] as const).map((t) => (
              <button key={t} type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`px-5 py-2.5 rounded-xl text-base font-bold border-2 transition-all ${
                  form.type === t
                    ? "bg-[#3d6b35] text-white border-[#3d6b35]"
                    : "bg-white text-[#5a5a48] border-[#d4c9a8] hover:border-[#3d6b35]"
                }`}
              >
                {t === "Home" ? "🏠" : t === "Work" ? "💼" : "📍"} {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] disabled:bg-[#a8c890] disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl transition-all active:scale-[.98] shadow-md"
      >
        Continue to Confirm Phone <ChevronRight size={22} />
      </button>

      {!isValid && form.pincode.length === 6 && !isTamilNaduPincode(form.pincode) && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">We don't deliver to this pincode yet</p>
            <p className="text-xs text-red-600 mt-0.5">We currently deliver only within Tamil Nadu. If you believe this is an error, please call us at <strong>+91 98765 43210</strong>.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── OTP Step — reworded so it doesn't feel like "signing in" ─────────────────

const OtpStep = ({
  phone, email, name, onVerified, onBack,
}: {
  phone: string; email: string; name: string;
  onVerified: () => void; onBack: () => void;
}) => {
  const [otp,         setOtp]         = useState("");
  const [sending,     setSending]     = useState(false);
  const [verifying,   setVerifying]   = useState(false);
  const [sent,        setSent]        = useState(false);
  const [countdown,   setCountdown]   = useState(0);
  const [sendError,   setSendError]   = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [devOtp,      setDevOtp]      = useState("");

  const startCountdown = () => {
    setCountdown(30);
    const id = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(id); return 0; } return c - 1; });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setSending(true); setSendError(""); setVerifyError(""); setOtp("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, email, name }),
      });
      const data = await res.json();
      if (!res.ok) { setSendError(data.error ?? "Failed to send code. Please try again."); return; }
      setSent(true);
      startCountdown();
      if (data.devOtp) setDevOtp(data.devOtp);
    } catch {
      setSendError("Network error. Please check your connection.");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) { setVerifyError("Please enter the 6-digit code."); return; }
    setVerifying(true); setVerifyError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setVerifyError(data.error ?? "Incorrect code. Please check your email.");
        if (data.error?.includes("expired")) { setSent(false); }
        return;
      }
      onVerified();
    } catch {
      setVerifyError("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const displayPhone = phone.replace(/\D/g, "").slice(-10).replace(/(\d{5})(\d{5})/, "$1 $2");
  const maskedEmail  = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(Math.min(b.length, 4)) + c);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold text-[#7a9e5f] uppercase tracking-wide mb-1">Step 2 of 4</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2a2a1e] font-outfit">Confirm Your Phone</h2>
        <p className="text-base text-[#7a7a68] mt-1">
          We send a quick one-time code to confirm your phone number before placing your order.
          No account needed — this is just a safety check.
        </p>
      </div>

      <div className="bg-white border border-[#e8e0d0] rounded-2xl p-6 sm:p-8 flex flex-col gap-6">

        {/* Phone display */}
        <div className="flex items-center gap-3 bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl px-4 py-3">
          <Phone size={18} className="text-[#3d6b35] shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-[#5a7a50] font-semibold">Confirming phone number</p>
            <p className="text-base font-black text-[#2a2a1e]">+91 {displayPhone}</p>
          </div>
          <button onClick={onBack} className="text-sm font-semibold text-[#3d6b35] hover:underline flex items-center gap-1">
            <Pencil size={13} />Change
          </button>
        </div>

        {!sent ? (
          <>
            {sendError && (
              <div className="text-sm text-red-700 font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {sendError}
              </div>
            )}
            <div className="bg-[#faf7f2] border border-[#e8e0d0] rounded-xl px-4 py-3">
              <p className="text-sm text-[#5a5a48] leading-relaxed">
                📧 We'll send a <strong>6-digit code</strong> to <strong>{maskedEmail}</strong>.
                Enter it on the next screen to confirm your order.
              </p>
            </div>
            <button
              onClick={handleSendOtp}
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] disabled:bg-[#a8c890] text-white font-bold text-lg py-4 rounded-xl transition-all"
            >
              {sending
                ? <><RefreshCw size={20} className="animate-spin" />Sending…</>
                : <><Mail size={20} />Send Confirmation Code</>
              }
            </button>
          </>
        ) : (
          <>
            <div className="bg-[#eef5ea] border border-[#b8d4a0] rounded-xl px-4 py-3">
              <p className="text-sm font-bold text-[#2a2a1e]">
                ✅ Code sent to <strong>{maskedEmail}</strong>
              </p>
              <p className="text-xs text-[#7a7a68] mt-0.5">
                Check your inbox (and spam folder). The code is valid for 10 minutes.
              </p>
              {devOtp && (
                <p className="text-xs text-[#3d6b35] font-bold mt-1 bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
                  🛠 Dev mode — code: <span className="font-mono tracking-widest text-base">{devOtp}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-bold text-[#2a2a1e]">
                Enter the 6-digit code from your email
              </label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => { setVerifyError(""); setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); }}
                placeholder="_ _ _ _ _ _"
                className="w-full text-center text-4xl font-black tracking-[1.2rem] bg-[#faf7f2] border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl px-4 py-5 outline-none transition-colors"
                autoFocus
              />
              {verifyError && (
                <div className="text-sm text-red-700 font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {verifyError}
                </div>
              )}
            </div>

            <button
              onClick={handleVerify}
              disabled={verifying || otp.length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] disabled:bg-[#a8c890] disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl transition-all"
            >
              {verifying
                ? <><RefreshCw size={20} className="animate-spin" />Checking…</>
                : <><CheckCircle2 size={20} />Confirm & Continue</>
              }
            </button>

            <div className="text-center">
              {countdown > 0
                ? <p className="text-sm text-[#a8a090]">Resend code in {countdown}s</p>
                : (
                  <button onClick={handleSendOtp} disabled={sending}
                    className="text-base font-semibold text-[#3d6b35] hover:underline disabled:opacity-50"
                  >
                    {sending ? "Sending…" : "🔄 Send a new code"}
                  </button>
                )}
            </div>
          </>
        )}
      </div>

      <div className="bg-[#faf7f2] border border-[#d4c9a8] rounded-2xl px-5 py-4 flex items-center gap-3">
        <Phone size={18} className="text-[#3d6b35] shrink-0" />
        <div>
          <p className="text-sm font-bold text-[#2a2a1e]">Didn't get the email? Check your spam folder or call us</p>
          <a href="tel:+919876543210" className="text-base font-bold text-[#3d6b35] hover:underline">+91 98765 43210</a>
        </div>
      </div>

      <button onClick={onBack}
        className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#5a5a48] hover:text-[#3d6b35] font-bold text-base py-3.5 rounded-xl transition-all"
      >
        ← Back to Address
      </button>
    </div>
  );
};

// ─── Payment Step ─────────────────────────────────────────────────────────────

const PaymentStep = ({
  onNext, onBack, selected, setSelected, total, allowCOD, allowUPI, allowCard,
}: {
  onNext: () => void; onBack: () => void; selected: string; setSelected: (v: string) => void;
  total: number; allowCOD: boolean; allowUPI: boolean; allowCard: boolean;
}) => {
  const available = paymentMethods.filter((m) => {
    if (m.id === "cod"  && !allowCOD)  return false;
    if (m.id === "upi"  && !allowUPI)  return false;
    if (m.id === "card" && !allowCard) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold text-[#7a9e5f] uppercase tracking-wide mb-1">Step 3 of 4</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2a2a1e] font-outfit">Choose Payment</h2>
        <p className="text-base text-[#7a7a68] mt-1">How would you like to pay for your order?</p>
      </div>

      <div className="flex flex-col gap-3">
        {available.map((method) => (
          <button key={method.id} type="button" onClick={() => setSelected(method.id)}
            className={`w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all text-left ${
              selected === method.id
                ? "border-[#3d6b35] bg-[#eef5ea]"
                : "border-[#e8e0d0] bg-white hover:border-[#a8c890]"
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
        ))}
      </div>

      {selected === "cod" && (
        <div className="bg-[#fff8ee] border border-[#f0d080] rounded-2xl p-4">
          <p className="text-base text-[#7a5c1e] leading-relaxed">
            💰 Please keep <strong>₹{total.toLocaleString("en-IN")}</strong> ready in cash when your order arrives.
          </p>
        </div>
      )}

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
  onPlace, onBack, paymentMethod, subtotal, deliveryFee, total, address, placing,
}: {
  onPlace: () => void; onBack: () => void; paymentMethod: string;
  subtotal: number; deliveryFee: number; total: number; address: Address; placing: boolean;
}) => {
  const { items } = useCart();
  const pm = paymentMethods.find((p) => p.id === paymentMethod);
  const district = getTNDistrictHint(address.pincode);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold text-[#7a9e5f] uppercase tracking-wide mb-1">Step 4 of 4</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2a2a1e] font-outfit">Review & Place Order</h2>
        <p className="text-base text-[#7a7a68] mt-1">Please check everything before confirming.</p>
      </div>

      {/* Phone verified badge */}
      <div className="flex items-center gap-2 bg-[#eef5ea] border border-[#b8d4a0] rounded-xl px-4 py-3">
        <CheckCircle2 size={18} className="text-[#3d6b35] shrink-0" />
        <p className="text-sm font-semibold text-[#3d6b35]">
          Phone <span className="font-black">+91 {address.phone.replace(/\D/g, "").slice(-10).replace(/(\d{5})(\d{5})/, "$1 $2")}</span> confirmed ✓
        </p>
      </div>

      {/* Delivery address */}
      <div className="bg-white border border-[#e8e0d0] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-[#3d6b35]" />
            <span className="text-base font-bold text-[#2a2a1e]">Delivering to</span>
          </div>
          <button onClick={onBack} className="text-sm font-semibold text-[#3d6b35] hover:underline flex items-center gap-1">
            <Pencil size={13} />Change
          </button>
        </div>
        <p className="text-base font-bold text-[#2a2a1e]">{address.fullName} · 📞 {address.phone}</p>
        <p className="text-sm text-[#7a7a68] mt-0.5">📧 {address.email}</p>
        <p className="text-sm text-[#5a5a48] mt-1 leading-snug">
          {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""},{" "}
          {address.city}, Tamil Nadu — {address.pincode}
          {district ? ` (${district})` : ""}
        </p>
        <div className="flex items-center gap-2 mt-3 text-sm text-[#3d6b35] bg-[#eef5ea] px-3 py-2 rounded-xl w-fit font-semibold">
          <Truck size={15} />Estimated delivery: 2–4 business days
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white border border-[#e8e0d0] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard size={18} className="text-[#3d6b35]" />
          <span className="text-base font-bold text-[#2a2a1e]">Payment Method</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eef5ea] flex items-center justify-center text-[#3d6b35]">{pm?.icon}</div>
          <div>
            <p className="text-base font-bold text-[#2a2a1e]">{pm?.label}</p>
            <p className="text-sm text-[#7a7a68]">{pm?.desc}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-[#e8e0d0] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e8e0d0]">
          <span className="text-base font-bold text-[#2a2a1e]">Your Items ({items.length})</span>
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
            <span>Subtotal</span><span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm text-[#3d6b35]">
            <span className="flex items-center gap-1"><Truck size={13} />Delivery</span>
            <span className="font-semibold">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-[#e8e0d0]">
            <span className="text-base font-bold text-[#2a2a1e]">Total to Pay</span>
            <span className="text-xl font-black text-[#3d6b35]">₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-[#7a7a68] leading-relaxed">
        By placing this order you agree to our{" "}
        <Link href="/privacy" className="text-[#3d6b35] font-semibold underline underline-offset-2">Terms & Conditions</Link>.
        Your order confirmation will be sent to <strong>{address.email}</strong>.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onBack} disabled={placing}
          className="sm:w-40 flex items-center justify-center gap-2 bg-white border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#5a5a48] hover:text-[#3d6b35] font-bold text-base py-3.5 rounded-xl transition-all disabled:opacity-50"
        >
          ← Back
        </button>
        <button onClick={onPlace} disabled={placing}
          className="flex-1 flex items-center justify-center gap-3 bg-[#3d6b35] hover:bg-[#2e5228] disabled:bg-[#a8c890] text-white font-bold text-lg py-4 rounded-xl transition-all active:scale-[.98] shadow-md"
        >
          {placing
            ? <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Placing Order…</>
            : <><CheckCircle2 size={24} />Place Order — ₹{total.toLocaleString("en-IN")}</>
          }
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
        <Link href="/cart" className="text-white/80 hover:text-white text-sm font-semibold underline underline-offset-2">Edit cart</Link>
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
            <p className="text-sm font-bold text-[#3d6b35] shrink-0">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 bg-[#faf7f2] border-t border-[#e8e0d0] flex flex-col gap-2.5">
        <div className="flex justify-between text-sm text-[#5a5a48]">
          <span>Subtotal</span><span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
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
      <ShieldCheck size={16} className="text-[#3d6b35]" />100% secure & encrypted checkout
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const EMPTY_ADDRESS: Address = {
  fullName: "", phone: "", email: "", pincode: "",
  addressLine1: "", addressLine2: "", city: "", state: "Tamil Nadu", type: "Home",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { config } = useStoreConfig();

  const FREE_DELIVERY_THRESHOLD = config.freeDeliveryThreshold;
  const DELIVERY_FEE            = config.deliveryFee;

  const [step,            setStep]           = useState<Step>("address");
  const [addressForm,     setAddressForm]     = useState<Address>(EMPTY_ADDRESS);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [placing,         setPlacing]         = useState(false);
  const [placeError,      setPlaceError]      = useState("");

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total       = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setPlaceError("");

    // Final TN pincode check before submitting
    if (!isTamilNaduPincode(addressForm.pincode)) {
      setPlaceError("We only deliver within Tamil Nadu. Please check your pincode.");
      setPlacing(false);
      return;
    }

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address:       addressForm,
          paymentMethod: selectedPayment,
          subtotal,
          deliveryFee,
          couponDiscount: 0,
          customerEmail: addressForm.email,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.requiresOtp) {
          setStep("otp");
          setPlaceError("Your confirmation expired. Please verify your phone again.");
          setPlacing(false);
          return;
        }
        setPlaceError(data.error ?? "Order failed. Please try again.");
        setPlacing(false);
        return;
      }

      const storedOrder = {
        id: data.orderId,
        date: new Date().toISOString(),
        status: "confirmed",
        paymentMethod: selectedPayment === "cod" ? "Cash on Delivery" : "Online Payment",
        address: {
          name:    addressForm.fullName,
          phone:   addressForm.phone,
          line1:   addressForm.addressLine1,
          line2:   addressForm.addressLine2,
          city:    addressForm.city,
          state:   "Tamil Nadu",
          pincode: addressForm.pincode,
        },
        items: items.map((i) => ({
          id: i.id, name: i.name, variant: i.variant ?? "",
          price: i.price, quantity: i.quantity, image: i.image,
        })),
        subtotal,
        deliveryFee,
        couponDiscount: 0,
        total,
      };

      if (!data.paymentRequired) {
        saveOrder(storedOrder);
        clearCart();
        router.push(`/order-confirmation?id=${data.orderId}`);
        return;
      }

      // Razorpay
      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        "Kavin Organics",
        description: "Garden supplies order",
        order_id:    data.razorpayOrderId,
        prefill:     data.prefill,
        theme:       { color: "#3d6b35" },
        handler: () => {
          saveOrder({ ...storedOrder, paymentMethod: "Online Payment", status: "confirmed" });
          clearCart();
          router.push(`/order-confirmation?id=${data.orderId}`);
        },
        modal: { ondismiss: () => setPlacing(false) },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setPlacing(false);
        setPlaceError("Payment failed. Please try again or choose Cash on Delivery.");
      });
      rzp.open();
    } catch (err: any) {
      setPlaceError(err.message ?? "Something went wrong. Please try again or call us.");
      setPlacing(false);
    }
  };

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

        {placeError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />{placeError}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0">
            {step === "address" && (
              <AddressStep
                onNext={() => { setPlaceError(""); setStep("otp"); }}
                form={addressForm}
                setForm={setAddressForm}
              />
            )}
            {step === "otp" && (
              <OtpStep
                phone={addressForm.phone}
                email={addressForm.email}
                name={addressForm.fullName}
                onVerified={() => { setPlaceError(""); setStep("payment"); }}
                onBack={() => setStep("address")}
              />
            )}
            {step === "payment" && (
              <PaymentStep
                onNext={() => setStep("review")}
                onBack={() => setStep("otp")}
                selected={selectedPayment}
                setSelected={setSelectedPayment}
                total={total}
                allowCOD={config.allowCOD}
                allowUPI={config.allowUPI}
                allowCard={config.allowCard}
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
                address={addressForm}
                placing={placing}
              />
            )}
          </div>
          <OrderSummary items={items} subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
        </div>
      </div>
    </div>
  );
}