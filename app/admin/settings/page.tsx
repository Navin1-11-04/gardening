"use client";

import { useState, useEffect } from "react";
import {
  Store, Phone, Mail, MapPin, Truck, CreditCard,
  Clock, Shield, Save, RefreshCw, Check, AlertCircle,
} from "lucide-react";

interface StoreSettings {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  businessHoursMon: string;
  businessHoursMonEnd: string;
  businessHoursSat: string;
  businessHoursSatEnd: string;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  maxDeliveryDays: number;
  whatsappNumber: string;
  maintenanceMode: boolean;
  allowCOD: boolean;
  allowUPI: boolean;
  allowCard: boolean;
}

// ─── Field components ─────────────────────────────────────────────────────────

const InputField = ({
  label, value, onChange, type = "text", placeholder, hint,
}: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; placeholder?: string; hint?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-[#1e3d18]">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white text-[#1e3d18] placeholder:text-[#9ab890]"
    />
    {hint && <p className="text-xs text-[#9ab890]">{hint}</p>}
  </div>
);

const ToggleField = ({
  label, description, value, onChange,
}: {
  label: string; description: string; value: boolean; onChange: (v: boolean) => void;
}) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-[#f0f4ed] last:border-0">
    <div>
      <p className="text-sm font-bold text-[#1e3d18]">{label}</p>
      <p className="text-xs text-[#9ab890] mt-0.5">{description}</p>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
        value ? "bg-[#3d6b35]" : "bg-[#dce8d4]"
      }`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        value ? "translate-x-5" : "translate-x-0.5"
      }`} />
    </button>
  </div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section = ({
  icon: Icon, title, children,
}: {
  icon: any; title: string; children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f0f4ed] bg-[#f8faf6]">
      <div className="w-8 h-8 rounded-lg bg-[#eef7e6] flex items-center justify-center">
        <Icon size={15} className="text-[#3d6b35]" />
      </div>
      <h3 className="text-sm font-bold text-[#1e3d18]">{title}</h3>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [settings, setSettings]   = useState<StoreSettings | null>(null);
  const [loading,  setLoading]    = useState(true);
  const [saving,   setSaving]     = useState(false);
  const [saved,    setSaved]      = useState(false);
  const [error,    setError]      = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setSettings(data); })
      .catch(() => setError("Failed to load settings."))
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={24} className="animate-spin text-[#3d6b35]" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-[#7a9e6a]">Could not load settings. Check your database connection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-[#1e3d18]">Settings</h2>
          <p className="text-sm text-[#7a9e6a] mt-0.5">Configure your store information and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 ${
            saved
              ? "bg-green-600 text-white"
              : "bg-[#3d6b35] hover:bg-[#2d5228] text-white"
          }`}
        >
          {saving
            ? <><RefreshCw size={15} className="animate-spin" /> Saving…</>
            : saved
              ? <><Check size={15} /> Saved!</>
              : <><Save size={15} /> Save Changes</>
          }
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Store Information */}
      <Section icon={Store} title="Store Information">
        <InputField
          label="Store Name"
          value={settings.storeName}
          onChange={(v) => set("storeName", v)}
          placeholder="Kavin Organics"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Phone Number"
            value={settings.storePhone}
            onChange={(v) => set("storePhone", v)}
            placeholder="+91 98765 43210"
          />
          <InputField
            label="Email Address"
            value={settings.storeEmail}
            onChange={(v) => set("storeEmail", v)}
            type="email"
            placeholder="hello@store.com"
          />
        </div>
        <InputField
          label="Store Address"
          value={settings.storeAddress}
          onChange={(v) => set("storeAddress", v)}
          placeholder="Street, City, State — Pincode"
        />
        <InputField
          label="WhatsApp Number"
          value={settings.whatsappNumber}
          onChange={(v) => set("whatsappNumber", v)}
          placeholder="919876543210"
          hint="Include country code, no + or spaces. Used for wa.me/ links."
        />
      </Section>

      {/* Business Hours */}
      <Section icon={Clock} title="Business Hours">
        <div>
          <p className="text-xs font-bold text-[#7a9e6a] uppercase tracking-wider mb-3">Monday – Friday</p>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Opens"
              value={settings.businessHoursMon}
              onChange={(v) => set("businessHoursMon", v)}
              placeholder="9:00 AM"
            />
            <InputField
              label="Closes"
              value={settings.businessHoursMonEnd}
              onChange={(v) => set("businessHoursMonEnd", v)}
              placeholder="6:00 PM"
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-[#7a9e6a] uppercase tracking-wider mb-3">Saturday</p>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Opens"
              value={settings.businessHoursSat}
              onChange={(v) => set("businessHoursSat", v)}
              placeholder="9:00 AM"
            />
            <InputField
              label="Closes"
              value={settings.businessHoursSatEnd}
              onChange={(v) => set("businessHoursSatEnd", v)}
              placeholder="4:00 PM"
            />
          </div>
        </div>
        <div className="bg-[#f0f4ed] rounded-xl p-3 text-xs text-[#7a9e6a]">
          Sunday is always shown as closed. These times appear on the Contact page.
        </div>
      </Section>

      {/* Delivery Settings */}
      <Section icon={Truck} title="Delivery Settings">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Free Delivery Above (₹)"
            value={settings.freeDeliveryThreshold}
            onChange={(v) => set("freeDeliveryThreshold", Number(v))}
            type="number"
            placeholder="999"
            hint="Orders above this get free delivery"
          />
          <InputField
            label="Delivery Fee (₹)"
            value={settings.deliveryFee}
            onChange={(v) => set("deliveryFee", Number(v))}
            type="number"
            placeholder="79"
            hint="Charged on smaller orders"
          />
          <InputField
            label="Max Delivery Days"
            value={settings.maxDeliveryDays}
            onChange={(v) => set("maxDeliveryDays", Number(v))}
            type="number"
            placeholder="4"
            hint="Shown on product pages"
          />
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
          ⚠️ Updating delivery threshold here saves to your database, but the cart and checkout pages also have a <code className="bg-amber-100 px-1 rounded">FREE_DELIVERY_THRESHOLD</code> constant that you should update to match.
        </div>
      </Section>

      {/* Payment Methods */}
      <Section icon={CreditCard} title="Payment Methods">
        <ToggleField
          label="Cash on Delivery (COD)"
          description="Allow customers to pay cash when order arrives"
          value={settings.allowCOD}
          onChange={(v) => set("allowCOD", v)}
        />
        <ToggleField
          label="UPI / GPay / PhonePe"
          description="Allow UPI payments at checkout"
          value={settings.allowUPI}
          onChange={(v) => set("allowUPI", v)}
        />
        <ToggleField
          label="Credit / Debit Card"
          description="Allow card payments at checkout"
          value={settings.allowCard}
          onChange={(v) => set("allowCard", v)}
        />
      </Section>

      {/* Maintenance */}
      <Section icon={Shield} title="Store Visibility">
        <ToggleField
          label="Maintenance Mode"
          description="Temporarily hide the store from customers. Admin panel stays accessible."
          value={settings.maintenanceMode}
          onChange={(v) => set("maintenanceMode", v)}
        />
        {settings.maintenanceMode && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
            ⚠️ <strong>Maintenance mode is ON.</strong> Customers cannot access the store. Remember to turn this off when you're done.
          </div>
        )}
      </Section>

      {/* Save button at bottom too */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md disabled:opacity-60 ${
            saved ? "bg-green-600 text-white" : "bg-[#3d6b35] hover:bg-[#2d5228] text-white"
          }`}
        >
          {saving
            ? <><RefreshCw size={15} className="animate-spin" /> Saving…</>
            : saved
              ? <><Check size={15} /> All changes saved!</>
              : <><Save size={15} /> Save All Settings</>
          }
        </button>
      </div>
    </div>
  );
}