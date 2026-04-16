"use client";

import { useState, useEffect } from "react";
import {
  Plus, Edit2, Trash2, AlertCircle, RefreshCw,
  Check, X, Tag,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  nameTa?: string;
  slug: string;
}

interface FormState {
  name: string;
  nameTa: string;
  slug: string;
}

const EMPTY_FORM: FormState = { name: "", nameTa: "", slug: "" };

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [form,       setForm]       = useState<FormState>(EMPTY_FORM);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saveError,  setSaveError]  = useState("");

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error();
      setCategories(await res.json());
    } catch {
      setError("Could not load categories.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, nameTa: cat.nameTa ?? "", slug: cat.slug });
    setSaveError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSaveError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      setSaveError("Name and slug are required.");
      return;
    }
    setSaving(true);
    setSaveError("");

    try {
      const isEdit = !!editingId;
      const url    = isEdit ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:   form.name.trim(),
          nameTa: form.nameTa.trim() || undefined,
          slug:   form.slug.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) { setSaveError(data.error ?? "Failed to save."); return; }

      await fetchCategories();
      cancelEdit();
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { alert(data.error ?? "Delete failed."); return; }
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Network error.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1e3d18]">Categories</h2>
          <p className="text-sm text-[#7a9e6a] mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={fetchCategories}
          className="flex items-center gap-2 px-3 py-2 border border-[#dce8d4] bg-white rounded-xl text-[#3d6b35] hover:bg-[#f0f4ed] transition-colors text-sm font-semibold"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Add / Edit Form */}
      <div className="bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f0f4ed] bg-[#f8faf6]">
          <div className="w-8 h-8 rounded-lg bg-[#eef7e6] flex items-center justify-center">
            <Tag size={14} className="text-[#3d6b35]" />
          </div>
          <h3 className="text-sm font-bold text-[#1e3d18]">
            {editingId ? "Edit Category" : "Add New Category"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {saveError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              <AlertCircle size={14} className="shrink-0" />
              {saveError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1e3d18]">
                Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                placeholder="e.g. Seeds"
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((p) => ({
                    ...p,
                    name,
                    // Auto-fill slug only when creating (not editing)
                    slug: editingId ? p.slug : slugify(name),
                  }));
                }}
                className="w-full px-4 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1e3d18]">Name (Tamil)</label>
              <input
                type="text"
                value={form.nameTa}
                placeholder="e.g. விதைகள்"
                onChange={(e) => setForm((p) => ({ ...p, nameTa: e.target.value }))}
                className="w-full px-4 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1e3d18]">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.slug}
              placeholder="e.g. seeds"
              onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
              className="w-full px-4 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white font-mono"
              required
            />
            <p className="text-xs text-[#9ab890]">
              Used in URLs and filters. Lowercase letters, numbers and hyphens only.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#3d6b35] hover:bg-[#2d5228] text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-60"
            >
              {saving
                ? <><RefreshCw size={14} className="animate-spin" /> Saving…</>
                : <><Check size={14} /> {editingId ? "Save Changes" : "Add Category"}</>
              }
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#dce8d4] hover:bg-[#f0f4ed] text-[#5a8a50] rounded-xl font-bold text-sm transition-colors"
              >
                <X size={14} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0f4ed] bg-[#f8faf6]">
          <h3 className="text-sm font-bold text-[#1e3d18]">All Categories</h3>
        </div>

        {error && (
          <div className="flex items-center gap-2 m-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <AlertCircle size={14} className="shrink-0" />{error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw size={20} className="animate-spin text-[#3d6b35] mx-auto mb-2" />
            <p className="text-sm text-[#9ab890]">Loading…</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#9ab890]">
            No categories yet. Add your first one above.
          </div>
        ) : (
          <div className="divide-y divide-[#f0f4ed]">
            {categories.map((cat) => (
              <div key={cat._id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-[#fafcf8] transition-colors ${
                  editingId === cat._id ? "bg-[#f0f4ed]" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-[#1e3d18]">{cat.name}</p>
                    {cat.nameTa && (
                      <p className="text-xs text-[#7a9e6a] font-medium">{cat.nameTa}</p>
                    )}
                  </div>
                  <p className="text-xs font-mono text-[#9ab890] mt-0.5">/{cat.slug}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    disabled={deletingId === cat._id}
                    className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    {deletingId === cat._id
                      ? <RefreshCw size={14} className="animate-spin" />
                      : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}