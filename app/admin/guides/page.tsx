"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, Plus, Edit2, Trash2, RefreshCw,
  Star, Eye, EyeOff, Search, AlertCircle, X, Check,
} from "lucide-react";

interface Guide {
  id: string; slug: string; title: string; category: string;
  tag: string; readTime: number; date: string; image: string;
  featured: boolean; active: boolean;
}

const CATEGORIES = [
  { id: "beginners", label: "For Beginners" },
  { id: "vegetables", label: "Vegetables" },
  { id: "flowers", label: "Flowers & Herbs" },
  { id: "soil", label: "Soil & Fertilizers" },
  { id: "balcony", label: "Balcony Gardening" },
  { id: "tips", label: "Care Tips" },
];

const EMPTY_FORM = {
  slug: "", title: "", excerpt: "", category: "tips", tag: "", readTime: 5,
  date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  author: "Rajan M.", authorRole: "Horticulture Advisor, Kavin Organics",
  heroImage: "", intro: "", featured: false, active: true,
};

// ─── Guide Form Modal ─────────────────────────────────────────────────────────

const GuideFormModal = ({
  guide, onClose, onSaved,
}: { guide: Guide | null; onClose: () => void; onSaved: () => void }) => {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [fullData, setFullData] = useState<any>(null);

  useEffect(() => {
    if (guide) {
      fetch(`/api/admin/guides/${guide.id}`)
        .then((r) => r.json())
        .then((data) => {
          setFullData(data);
          setForm({
            slug:       data.slug ?? "",
            title:      data.title ?? "",
            excerpt:    data.excerpt ?? "",
            category:   data.category ?? "tips",
            tag:        data.tag ?? "",
            readTime:   data.readTime ?? 5,
            date:       data.date ?? "",
            author:     data.author ?? "Rajan M.",
            authorRole: data.authorRole ?? "Horticulture Advisor, Kavin Organics",
            heroImage:  data.heroImage ?? "",
            intro:      data.intro ?? "",
            featured:   data.featured ?? false,
            active:     data.active ?? true,
          });
        })
        .catch(() => setError("Could not load guide data."));
    }
  }, [guide]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.title || !form.heroImage || !form.intro) {
      setError("Slug, title, hero image URL, and intro are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const method = guide ? "PUT" : "POST";
      const url    = guide ? `/api/admin/guides/${guide.id}` : "/api/admin/guides";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sections: fullData?.sections ?? [] }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to save."); return; }
      onSaved();
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1e3d18]">{guide ? "Edit Guide" : "Add New Guide"}</h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1e3d18]">Slug (URL) *</label>
              <input value={form.slug} onChange={set("slug")} placeholder="how-to-grow-tomatoes"
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] font-mono" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1e3d18]">Category *</label>
              <select value={form.category} onChange={set("category")}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]">
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1e3d18]">Title *</label>
            <input value={form.title} onChange={set("title")} placeholder="Article title"
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1e3d18]">Excerpt (short description)</label>
            <textarea value={form.excerpt} onChange={set("excerpt")} rows={2} placeholder="Brief description shown on the guides listing page"
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] resize-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1e3d18]">Hero Image URL *</label>
            <input value={form.heroImage} onChange={set("heroImage")} placeholder="https://images.unsplash.com/..."
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]" />
            {form.heroImage && (
              <img src={form.heroImage} alt="Preview" className="w-full h-32 object-cover rounded-xl border border-gray-200 mt-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-[#1e3d18]">Introduction paragraph *</label>
            <textarea value={form.intro} onChange={set("intro")} rows={3} placeholder="Opening paragraph that appears before the sections..."
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] resize-none" required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1e3d18]">Read time (mins)</label>
              <input type="number" value={form.readTime} onChange={set("readTime")} min={1} max={30}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1e3d18]">Badge/Tag</label>
              <input value={form.tag} onChange={set("tag")} placeholder="e.g. Most Popular"
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1e3d18]">Display date</label>
              <input value={form.date} onChange={set("date")} placeholder="12 Mar 2025"
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1e3d18]">Author name</label>
              <input value={form.author} onChange={set("author")}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#1e3d18]">Author role</label>
              <input value={form.authorRole} onChange={set("authorRole")}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]" />
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setForm((p) => ({ ...p, featured: !p.featured }))}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${form.featured ? "bg-[#3d6b35] border-[#3d6b35]" : "border-gray-300"}`}>
                {form.featured && <Check size={13} className="text-white" />}
              </div>
              <span className="text-sm font-semibold text-[#1e3d18]">Featured (shown at top)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setForm((p) => ({ ...p, active: !p.active }))}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${form.active ? "bg-[#3d6b35] border-[#3d6b35]" : "border-gray-300"}`}>
                {form.active && <Check size={13} className="text-white" />}
              </div>
              <span className="text-sm font-semibold text-[#1e3d18]">Published (visible to customers)</span>
            </label>
          </div>

          {guide && (
            <div className="bg-[#f0f4ed] rounded-xl p-4 text-sm text-[#5a8a50]">
              <p className="font-bold mb-1">Article sections</p>
              <p>This guide has {fullData?.sections?.length ?? 0} section{(fullData?.sections?.length ?? 0) !== 1 ? "s" : ""}. Section content editing is available via the API. Use the Slug to identify the article at <code className="bg-[#dce8d4] px-1 rounded">/guides/{form.slug}</code></p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition">Cancel</button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#3d6b35] hover:bg-[#2d5228] text-white rounded-xl font-semibold text-sm transition disabled:opacity-60"
          >
            {saving ? <><RefreshCw size={14} className="animate-spin" />Saving…</> : <><Check size={14} />{guide ? "Update Guide" : "Create Guide"}</>}
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminGuidesPage() {
  const [guides,   setGuides]   = useState<Guide[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [editing,  setEditing]  = useState<Guide | null | "new">(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchGuides(); }, []);

  const fetchGuides = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/guides");
      if (!res.ok) throw new Error();
      setGuides(await res.json());
    } catch {
      setError("Could not load guides. Make sure the database is connected.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/guides/${id}`, { method: "DELETE" });
      if (res.ok) setGuides((prev) => prev.filter((g) => g.id !== id));
      else alert("Failed to delete. Please try again.");
    } catch { alert("Network error."); }
    finally { setDeleting(null); }
  };

  const handleToggleActive = async (guide: Guide) => {
    const res = await fetch(`/api/admin/guides/${guide.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...guide, heroImage: guide.image, active: !guide.active }),
    });
    if (res.ok) setGuides((prev) => prev.map((g) => g.id === guide.id ? { ...g, active: !g.active } : g));
  };

  const filtered = guides.filter((g) => {
    const q = search.toLowerCase();
    return !q || g.title.toLowerCase().includes(q) || g.slug.includes(q) || g.category.includes(q);
  });

  const catLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-[#1e3d18]">Gardening Guides</h2>
          <p className="text-sm text-[#7a9e6a] mt-0.5">{guides.length} articles</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchGuides} className="flex items-center gap-2 px-3 py-2 border border-[#dce8d4] bg-white rounded-xl text-[#3d6b35] hover:bg-[#f0f4ed] transition-colors text-sm font-semibold">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />Refresh
          </button>
          <button onClick={() => setEditing("new")} className="flex items-center gap-2 px-4 py-2 bg-[#3d6b35] hover:bg-[#2d5228] text-white rounded-xl font-semibold text-sm transition-colors">
            <Plus size={16} />Add Guide
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ab890]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, slug, or category…"
          className="w-full pl-10 pr-4 py-2.5 border border-[#dce8d4] bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]" />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          <AlertCircle size={15} className="shrink-0" />{error}
          <span className="ml-1">If the DB is empty, <a href="/api/admin/guides" className="underline font-semibold">check the API</a> or add your first guide.</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
        {loading ? (
          <div className="p-10 text-center"><RefreshCw size={22} className="animate-spin text-[#3d6b35] mx-auto mb-2" /><p className="text-sm text-[#9ab890]">Loading guides…</p></div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <BookOpen size={32} className="text-[#b0c8a0] mx-auto mb-3" />
            <p className="text-[#7a9e6a] font-semibold">No guides found</p>
            <p className="text-sm text-[#9ab890] mt-1">{search ? "Try a different search." : "Add your first gardening guide."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f0f4ed] border-b border-[#dce8d4]">
                  {["Guide","Category","Tag","Read time","Status",""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#5a8a50] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((guide) => (
                  <tr key={guide.id} className="border-b border-[#f0f4ed] hover:bg-[#fafcf8] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {guide.image && <img src={guide.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#e8e0d0] shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            {guide.featured && <Star size={12} className="text-[#d4a017] fill-[#d4a017] shrink-0" />}
                            <p className="text-sm font-bold text-[#1e3d18] truncate max-w-[240px]">{guide.title}</p>
                          </div>
                          <p className="text-xs font-mono text-[#9ab890]">{guide.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5a8a50] whitespace-nowrap">{catLabel(guide.category)}</td>
                    <td className="px-4 py-3">
                      {guide.tag && <span className="text-xs font-bold bg-[#eef7e6] text-[#3d6b35] px-2.5 py-1 rounded-full">{guide.tag}</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5a8a50]">{guide.readTime} min</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${guide.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {guide.active ? "Published" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <a href={`/guides/${guide.slug}`} target="_blank" rel="noopener noreferrer"
                          className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors" title="Preview">
                          <Eye size={14} />
                        </a>
                        <button onClick={() => handleToggleActive(guide)} className="p-2 hover:bg-amber-50 text-amber-500 rounded-lg transition-colors" title={guide.active ? "Hide" : "Publish"}>
                          {guide.active ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={() => setEditing(guide)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(guide.id, guide.title)} disabled={deleting === guide.id}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors disabled:opacity-40" title="Delete">
                          {deleting === guide.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing !== null && (
        <GuideFormModal
          guide={editing === "new" ? null : (editing as Guide)}
          onClose={() => setEditing(null)}
          onSaved={fetchGuides}
        />
      )}
    </div>
  );
}