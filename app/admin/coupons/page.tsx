"use client";

import { useState, useEffect } from "react";
import {
  Plus, Trash2, RefreshCw, Check, X,
  Tag, AlertCircle, ToggleLeft, ToggleRight, Edit2,
} from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  active: boolean;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  description: string;
  createdAt: string;
}

const EMPTY_FORM = {
  code: "", discount: 10, active: true,
  minOrder: 0, maxUses: 0, expiresAt: "", description: "",
};

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function isExpired(d: string | null) {
  if (!d) return false;
  return new Date(d) < new Date();
}

export default function AdminCouponsPage() {
  const [coupons,    setCoupons]    = useState<Coupon[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [showForm,   setShowForm]   = useState(false);
  const [editId,     setEditId]     = useState<string | null>(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [saveError,  setSaveError]  = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/coupons");
      if (!res.ok) throw new Error();
      setCoupons(await res.json());
    } catch {
      setError("Could not load coupons.");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setSaveError("");
    setShowForm(true);
  };

  const openEdit = (c: Coupon) => {
    setEditId(c.id);
    setForm({
      code:        c.code,
      discount:    c.discount,
      active:      c.active,
      minOrder:    c.minOrder,
      maxUses:     c.maxUses,
      expiresAt:   c.expiresAt ? c.expiresAt.slice(0, 10) : "",
      description: c.description,
    });
    setSaveError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setSaveError("");
    try {
      const method = editId ? "PUT" : "POST";
      const url    = editId ? `/api/admin/coupons/${editId}` : "/api/admin/coupons";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          discount:  Number(form.discount),
          minOrder:  Number(form.minOrder),
          maxUses:   Number(form.maxUses),
          expiresAt: form.expiresAt || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.error ?? "Failed to save."); return; }
      await fetchCoupons();
      setShowForm(false);
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (c: Coupon) => {
    await fetch(`/api/admin/coupons/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...c, active: !c.active }),
    });
    setCoupons((prev) => prev.map((x) => x.id === c.id ? { ...x, active: !x.active } : x));
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch { alert("Failed to delete. Please try again."); }
    finally { setDeletingId(null); }
  };

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-[#1e3d18]">Coupon Codes</h2>
          <p className="text-sm text-[#7a9e6a] mt-0.5">{coupons.length} coupon{coupons.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchCoupons}
            className="flex items-center gap-2 px-3 py-2 border border-[#dce8d4] bg-white rounded-xl text-[#3d6b35] hover:bg-[#f0f4ed] transition-colors text-sm font-semibold"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />Refresh
          </button>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#3d6b35] hover:bg-[#2d5228] text-white rounded-xl font-semibold text-sm transition-colors"
          >
            <Plus size={16} />Add Coupon
          </button>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-[#eef7e6] border border-[#b8d4a0] rounded-2xl px-5 py-4 text-sm text-[#1e3d18]">
        <p className="font-bold mb-1">📋 How coupons work</p>
        <p className="text-[#5a8a50] leading-relaxed">
          Customers enter a coupon code at checkout to get a percentage discount. You can set a minimum order value, expiry date, and usage limit. Inactive coupons won't be accepted at checkout.
        </p>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f4ed] bg-[#f8faf6]">
            <div className="flex items-center gap-3">
              <Tag size={16} className="text-[#3d6b35]" />
              <h3 className="text-sm font-bold text-[#1e3d18]">{editId ? "Edit Coupon" : "Create New Coupon"}</h3>
            </div>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg">
              <X size={18} className="text-[#7a9e6a]" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {saveError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                <AlertCircle size={14} className="shrink-0" />{saveError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1e3d18]">Coupon Code <span className="text-red-500">*</span></label>
                <input
                  type="text" value={form.code} required disabled={!!editId}
                  onChange={(e) => set("code", e.target.value.toUpperCase().replace(/\s/g, ""))}
                  placeholder="e.g. SUMMER20"
                  className="px-4 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] font-mono uppercase bg-white disabled:bg-[#f0f4ed]"
                />
                <p className="text-xs text-[#9ab890]">Uppercase letters and numbers only, no spaces</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1e3d18]">Discount % <span className="text-red-500">*</span></label>
                <input
                  type="number" value={form.discount} required min={1} max={100}
                  onChange={(e) => set("discount", e.target.value)}
                  className="px-4 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1e3d18]">Minimum Order (₹)</label>
                <input
                  type="number" value={form.minOrder} min={0}
                  onChange={(e) => set("minOrder", e.target.value)}
                  placeholder="0 = no minimum"
                  className="px-4 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1e3d18]">Max Uses</label>
                <input
                  type="number" value={form.maxUses} min={0}
                  onChange={(e) => set("maxUses", e.target.value)}
                  placeholder="0 = unlimited"
                  className="px-4 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1e3d18]">Expiry Date (optional)</label>
                <input
                  type="date" value={form.expiresAt}
                  onChange={(e) => set("expiresAt", e.target.value)}
                  className="px-4 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-[#1e3d18]">Description (optional)</label>
                <input
                  type="text" value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="e.g. Summer sale discount"
                  className="px-4 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="text-sm font-bold text-[#1e3d18]">Active</label>
              <button type="button" onClick={() => set("active", !form.active)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${form.active ? "bg-[#3d6b35]" : "bg-[#dce8d4]"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${form.active ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
              <span className="text-sm text-[#7a9e6a]">{form.active ? "Coupon is active and usable at checkout" : "Coupon is inactive — won't be accepted"}</span>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#3d6b35] hover:bg-[#2d5228] text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-60"
              >
                {saving ? <><RefreshCw size={14} className="animate-spin" />Saving…</> : <><Check size={14} />{editId ? "Update Coupon" : "Create Coupon"}</>}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#dce8d4] hover:bg-[#f0f4ed] text-[#5a8a50] rounded-xl font-bold text-sm transition-colors"
              >
                <X size={14} />Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <AlertCircle size={14} />{error}
        </div>
      )}

      {/* Coupons table */}
      <div className="bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0f4ed] bg-[#f8faf6]">
          <h3 className="text-sm font-bold text-[#1e3d18]">All Coupons</h3>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <RefreshCw size={20} className="animate-spin text-[#3d6b35] mx-auto mb-2" />
            <p className="text-sm text-[#9ab890]">Loading coupons…</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-10 text-center">
            <Tag size={32} className="text-[#b0c8a0] mx-auto mb-3" />
            <p className="text-[#7a9e6a] font-semibold">No coupons yet</p>
            <p className="text-sm text-[#9ab890] mt-1">Create your first coupon to offer discounts to customers.</p>
            <p className="text-xs text-[#9ab890] mt-2">Note: Fallback codes GARDEN10, KAVIN20, GREEN15 still work if DB is empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f0f4ed] border-b border-[#dce8d4]">
                  {["Code","Discount","Min Order","Uses","Expires","Status",""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => {
                  const expired = isExpired(c.expiresAt);
                  return (
                    <tr key={c.id} className="border-b border-[#f0f4ed] hover:bg-[#fafcf8] transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-black text-[#1e3d18] font-mono tracking-wider">{c.code}</p>
                          {c.description && <p className="text-xs text-[#9ab890] mt-0.5">{c.description}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-lg font-black text-[#3d6b35]">{c.discount}%</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5a8a50]">
                        {c.minOrder > 0 ? `₹${c.minOrder}` : "None"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5a8a50]">
                        {c.usedCount}{c.maxUses > 0 ? ` / ${c.maxUses}` : " / ∞"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${expired ? "text-red-500" : "text-[#5a8a50]"}`}>
                          {expired ? "⚠️ " : ""}{formatDate(c.expiresAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggleActive(c)}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                            c.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {c.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                          {c.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(c)}
                            className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors" title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.code)}
                            disabled={deletingId === c.id}
                            className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors disabled:opacity-40" title="Delete"
                          >
                            {deletingId === c.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}