"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Plus, Trash2, RefreshCw, Check, X, ChevronUp,
  ChevronDown, Image as ImageIcon, List, Lightbulb,
  Type, ArrowLeft, Save, Eye,
} from "lucide-react";

interface Section {
  id: string;
  heading: string;
  content: string[];
  tip?: string;
  image?: string;
  imageAlt?: string;
  list?: string[];
}

interface GuideData {
  id: string;
  slug: string;
  title: string;
  intro: string;
  sections: Section[];
  heroImage: string;
  category: string;
  readTime: number;
  date: string;
  author: string;
  authorRole: string;
  featured: boolean;
  active: boolean;
  excerpt: string;
  tag: string;
}

function makeId() {
  return `sec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function emptySection(): Section {
  return { id: makeId(), heading: "", content: [""], tip: "", image: "", imageAlt: "", list: [] };
}

// ─── Section card ─────────────────────────────────────────────────────────────

const SectionCard = ({
  section, index, total, onChange, onDelete, onMoveUp, onMoveDown,
}: {
  section: Section; index: number; total: number;
  onChange: (s: Section) => void;
  onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void;
}) => {
  const [open, setOpen] = useState(true);
  const set = (field: keyof Section, value: any) => onChange({ ...section, [field]: value });

  const updatePara    = (i: number, v: string) => set("content", (section.content ?? []).map((p, idx) => idx === i ? v : p));
  const addPara       = () => set("content", [...(section.content ?? []), ""]);
  const removePara    = (i: number) => set("content", (section.content ?? []).filter((_, idx) => idx !== i));
  const updateItem    = (i: number, v: string) => set("list", (section.list ?? []).map((l, idx) => idx === i ? v : l));
  const addItem       = () => set("list", [...(section.list ?? []), ""]);
  const removeItem    = (i: number) => set("list", (section.list ?? []).filter((_, idx) => idx !== i));

  return (
    <div className="bg-white border border-[#dce8d4] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#f8faf6] border-b border-[#f0f4ed]">
        <span className="w-6 h-6 rounded-full bg-[#3d6b35] text-white text-xs font-black flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <input
          value={section.heading}
          onChange={(e) => set("heading", e.target.value)}
          placeholder="Section heading…"
          className="flex-1 bg-transparent text-sm font-bold text-[#1e3d18] outline-none placeholder:text-[#9ab890]"
        />
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onMoveUp} disabled={index === 0}
            className="p-1.5 hover:bg-[#eef7e6] rounded-lg disabled:opacity-30 transition-colors" title="Move up">
            <ChevronUp size={14} className="text-[#5a8a50]" />
          </button>
          <button onClick={onMoveDown} disabled={index === total - 1}
            className="p-1.5 hover:bg-[#eef7e6] rounded-lg disabled:opacity-30 transition-colors" title="Move down">
            <ChevronDown size={14} className="text-[#5a8a50]" />
          </button>
          <button onClick={() => setOpen(!open)}
            className="p-1.5 hover:bg-[#eef7e6] rounded-lg transition-colors">
            {open ? <ChevronUp size={14} className="text-[#9ab890]" /> : <ChevronDown size={14} className="text-[#9ab890]" />}
          </button>
          <button onClick={onDelete}
            className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors" title="Delete section">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-4">

          {/* Paragraphs */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Type size={13} className="text-[#3d6b35]" />
              <label className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide">Paragraphs</label>
            </div>
            {(section.content ?? []).map((para, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <textarea
                  value={para}
                  onChange={(e) => updatePara(i, e.target.value)}
                  rows={3}
                  placeholder={`Paragraph ${i + 1}…`}
                  className="flex-1 px-3 py-2 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white resize-none"
                />
                {(section.content ?? []).length > 1 && (
                  <button onClick={() => removePara(i)}
                    className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors shrink-0 self-start mt-1">
                    <X size={13} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addPara}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#3d6b35] hover:bg-[#eef5ea] px-3 py-1.5 rounded-lg transition-colors">
              <Plus size={12} />Add paragraph
            </button>
          </div>

          {/* Bullet list */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <List size={13} className="text-[#3d6b35]" />
              <label className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide">Bullet list (optional)</label>
            </div>
            {(section.list ?? []).map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={item}
                  onChange={(e) => updateItem(i, e.target.value)}
                  placeholder={`List item ${i + 1}…`}
                  className="flex-1 px-3 py-2 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
                />
                <button onClick={() => removeItem(i)}
                  className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors shrink-0">
                  <X size={13} />
                </button>
              </div>
            ))}
            <button onClick={addItem}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#3d6b35] hover:bg-[#eef5ea] px-3 py-1.5 rounded-lg transition-colors">
              <Plus size={12} />Add list item
            </button>
          </div>

          {/* Tip box */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={13} className="text-[#d4a017]" />
              <label className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide">💡 Tip box (optional)</label>
            </div>
            <textarea
              value={section.tip ?? ""}
              onChange={(e) => set("tip", e.target.value)}
              rows={2}
              placeholder="A helpful tip shown in a yellow highlighted box…"
              className="w-full px-3 py-2 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white resize-none"
            />
          </div>

          {/* Section image */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon size={13} className="text-[#3d6b35]" />
              <label className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide">Section image (optional)</label>
            </div>
            <input
              value={section.image ?? ""}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://images.unsplash.com/…"
              className="w-full px-3 py-2 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white mb-2"
            />
            {section.image && (
              <>
                <input
                  value={section.imageAlt ?? ""}
                  onChange={(e) => set("imageAlt", e.target.value)}
                  placeholder="Image description (alt text for accessibility)…"
                  className="w-full px-3 py-2 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white mb-2"
                />
                <img
                  src={section.image}
                  alt={section.imageAlt || "preview"}
                  className="w-full max-h-48 object-cover rounded-xl border border-[#dce8d4]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GuideEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [guide,   setGuide]   = useState<GuideData | null>(null);
  const [sections,setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/guides/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setGuide(data);
          setSections(
            Array.isArray(data.sections) && data.sections.length > 0
              ? data.sections.map((s: any) => ({ ...s, id: s.id || makeId() }))
              : []
          );
        }
      })
      .catch(() => setError("Could not load guide."))
      .finally(() => setLoading(false));
  }, [id]);

  const addSection    = () => setSections((prev) => [...prev, emptySection()]);
  const updateSection = (index: number, updated: Section) =>
    setSections((prev) => prev.map((s, i) => i === index ? updated : s));
  const deleteSection = (index: number) =>
    setSections((prev) => prev.filter((_, i) => i !== index));
  const moveSection   = (index: number, dir: "up" | "down") => {
    setSections((prev) => {
      const arr = [...prev];
      const target = dir === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  const handleSave = async () => {
    if (!guide) return;
    setSaving(true); setError(""); setSaved(false);

    const cleaned = sections
      .map((s) => ({
        ...s,
        content:  (s.content ?? []).filter((p) => p.trim()),
        list:     (s.list ?? []).filter((l) => l.trim()),
        tip:      s.tip?.trim() || undefined,
        image:    s.image?.trim() || undefined,
        imageAlt: s.imageAlt?.trim() || undefined,
      }))
      .filter((s) => s.heading.trim());

    try {
      const res = await fetch(`/api/admin/guides/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...guide, sections: cleaned }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to save."); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <RefreshCw size={24} className="animate-spin text-[#3d6b35]" />
    </div>
  );

  if (!guide) return (
    <div className="text-center py-20">
      <p className="text-[#7a9e6a]">Guide not found.</p>
      <button onClick={() => router.push("/admin/guides")}
        className="mt-4 text-sm font-bold text-[#3d6b35] hover:underline">← Back to Guides</button>
    </div>
  );

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <button onClick={() => router.push("/admin/guides")}
            className="flex items-center gap-1.5 text-sm text-[#7a9e6a] hover:text-[#3d6b35] mb-1 transition-colors">
            <ArrowLeft size={14} />Back to Guides
          </button>
          <h2 className="text-xl font-black text-[#1e3d18] leading-tight">{guide.title}</h2>
          <p className="text-sm text-[#7a9e6a] mt-0.5">
            {sections.length} section{sections.length !== 1 ? "s" : ""} · Editing article content
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`/guides/${guide.slug}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 border border-[#dce8d4] bg-white rounded-xl text-[#3d6b35] hover:bg-[#f0f4ed] text-sm font-semibold transition-colors">
            <Eye size={14} />Preview
          </a>
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all disabled:opacity-60 ${
              saved ? "bg-green-600 text-white" : "bg-[#3d6b35] hover:bg-[#2d5228] text-white"
            }`}
          >
            {saving
              ? <><RefreshCw size={14} className="animate-spin" />Saving…</>
              : saved ? <><Check size={14} />Saved!</>
              : <><Save size={14} />Save Sections</>
            }
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Intro preview */}
      <div className="bg-[#f8faf6] border border-[#dce8d4] rounded-2xl px-5 py-4">
        <p className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide mb-1">Article intro paragraph</p>
        <p className="text-sm text-[#5a8a50] leading-relaxed">
          {guide.intro || "No intro set — edit this in the Guides list page."}
        </p>
      </div>

      {/* Sections */}
      {sections.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#dce8d4] rounded-2xl p-10 text-center">
          <p className="text-[#7a9e6a] font-semibold mb-1">No sections yet</p>
          <p className="text-sm text-[#9ab890] mb-4">
            Add sections to build the article body. Each section has a heading, paragraphs, an optional list, tip, and image.
          </p>
          <button onClick={addSection}
            className="flex items-center gap-2 bg-[#3d6b35] text-white font-bold text-sm px-5 py-2.5 rounded-xl mx-auto hover:bg-[#2d5228] transition-colors">
            <Plus size={15} />Add First Section
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              index={index}
              total={sections.length}
              onChange={(updated) => updateSection(index, updated)}
              onDelete={() => deleteSection(index)}
              onMoveUp={() => moveSection(index, "up")}
              onMoveDown={() => moveSection(index, "down")}
            />
          ))}
        </div>
      )}

      {/* Add section */}
      <button onClick={addSection}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#b8d4a0] hover:border-[#3d6b35] bg-white hover:bg-[#eef5ea] text-[#3d6b35] font-bold text-sm py-3.5 rounded-2xl transition-all">
        <Plus size={16} />Add New Section
      </button>

      {/* Bottom save */}
      <div className="flex justify-end pb-6">
        <button onClick={handleSave} disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-md disabled:opacity-60 transition-all ${
            saved ? "bg-green-600 text-white" : "bg-[#3d6b35] hover:bg-[#2d5228] text-white"
          }`}
        >
          {saving
            ? <><RefreshCw size={15} className="animate-spin" />Saving…</>
            : saved ? <><Check size={15} />All saved!</>
            : <><Save size={15} />Save All Sections</>
          }
        </button>
      </div>
    </div>
  );
}