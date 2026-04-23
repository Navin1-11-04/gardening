"use client";

import { useState, useEffect } from "react";
import {
  Save, RefreshCw, Check, AlertCircle, ChevronDown, ChevronUp,
  Plus, Trash2, Home, Info, HelpCircle, Truck, RotateCcw, Phone,
} from "lucide-react";

// ─── Page definitions ─────────────────────────────────────────────────────────

const PAGES = [
  { key: "homepage", label: "Homepage",        icon: Home,       desc: "Slider slides, announcement bar" },
  { key: "about",    label: "About Us",        icon: Info,       desc: "Story, stats, team, reviews" },
  { key: "faq",      label: "FAQs",            icon: HelpCircle, desc: "Questions and answers" },
  { key: "shipping", label: "Shipping",        icon: Truck,      desc: "Delivery zones and fees" },
  { key: "returns",  label: "Returns",         icon: RotateCcw,  desc: "Policy, process, eligibility" },
  { key: "contact",  label: "Contact Details", icon: Phone,      desc: "Phone, email, address, hours" },
];

// ─── Generic helpers ──────────────────────────────────────────────────────────

const Input = ({
  label, value, onChange, placeholder, multiline = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide">{label}</label>
    {multiline ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="w-full px-3 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white resize-none"
      />
    ) : (
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
      />
    )}
  </div>
);

const Section = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f8faf6] transition-colors">
        <span className="text-sm font-bold text-[#1e3d18]">{title}</span>
        {open ? <ChevronUp size={16} className="text-[#9ab890]" /> : <ChevronDown size={16} className="text-[#9ab890]" />}
      </button>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-[#f0f4ed]"><div className="h-1" />{children}</div>}
    </div>
  );
};

// ─── Homepage editor ──────────────────────────────────────────────────────────

const HomepageEditor = ({ value, onChange }: { value: any; onChange: (v: any) => void }) => {
  const slides = value?.sliderItems ?? [];

  const updateSlide = (i: number, field: string, v: string) => {
    const updated = slides.map((s: any, idx: number) => idx === i ? { ...s, [field]: v } : s);
    onChange({ ...value, sliderItems: updated });
  };

  const addSlide = () => onChange({ ...value, sliderItems: [...slides, { imgUrl: "", tag: "", title: "", subtitle: "", ctaText: "Shop Now", ctaHref: "/shop" }] });
  const removeSlide = (i: number) => onChange({ ...value, sliderItems: slides.filter((_: any, idx: number) => idx !== i) });

  return (
    <div className="space-y-4">
      <Section title="Announcement Bar">
        <Input label="Announcement text" value={value?.announcementBar ?? ""} onChange={(v) => onChange({ ...value, announcementBar: v })} placeholder="Free delivery on orders above ₹999 | Call us: +91 98765 43210" />
      </Section>

      <Section title="Slider Slides">
        {slides.map((slide: any, i: number) => (
          <div key={i} className="border border-[#dce8d4] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5a8a50]">Slide {i + 1}</span>
              {slides.length > 1 && (
                <button onClick={() => removeSlide(i)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors"><Trash2 size={13} /></button>
              )}
            </div>
            <Input label="Image URL" value={slide.imgUrl} onChange={(v) => updateSlide(i, "imgUrl", v)} placeholder="https://images.unsplash.com/..." />
            {slide.imgUrl && <img src={slide.imgUrl} alt="" className="w-full h-24 object-cover rounded-lg border border-[#dce8d4]" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
            <div className="grid grid-cols-2 gap-3">
              <Input label="Tag pill (e.g. Premium Seeds)" value={slide.tag} onChange={(v) => updateSlide(i, "tag", v)} />
              <Input label="CTA button text" value={slide.ctaText} onChange={(v) => updateSlide(i, "ctaText", v)} placeholder="Shop Seeds" />
            </div>
            <Input label="Headline" value={slide.title} onChange={(v) => updateSlide(i, "title", v)} placeholder="Grow healthy plants from the finest seeds." />
            <Input label="Subtitle" value={slide.subtitle} onChange={(v) => updateSlide(i, "subtitle", v)} placeholder="Handpicked varieties for home & balcony gardens." />
            <Input label="CTA link (e.g. /shop/seeds)" value={slide.ctaHref} onChange={(v) => updateSlide(i, "ctaHref", v)} placeholder="/shop/seeds" />
          </div>
        ))}
        {slides.length < 5 && (
          <button onClick={addSlide} className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-[#eef5ea] rounded-xl transition-colors">
            <Plus size={14} />Add Slide
          </button>
        )}
      </Section>
    </div>
  );
};

// ─── About editor ─────────────────────────────────────────────────────────────

const AboutEditor = ({ value, onChange }: { value: any; onChange: (v: any) => void }) => {
  const stats   = value?.stats ?? [];
  const team    = value?.teamMembers ?? [];
  const reviews = value?.reviews ?? [];
  const paras   = value?.storyParagraphs ?? [];

  return (
    <div className="space-y-4">
      <Section title="Hero">
        <Input label="Hero title" value={value?.heroTitle ?? ""} onChange={(v) => onChange({ ...value, heroTitle: v })} />
        <Input label="Hero subtitle" value={value?.heroSubtitle ?? ""} onChange={(v) => onChange({ ...value, heroSubtitle: v })} multiline />
      </Section>

      <Section title="Our Story paragraphs">
        {paras.map((p: string, i: number) => (
          <div key={i} className="flex gap-2">
            <textarea value={p} rows={2} onChange={(e) => { const updated = paras.map((x: string, idx: number) => idx === i ? e.target.value : x); onChange({ ...value, storyParagraphs: updated }); }}
              className="flex-1 px-3 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white resize-none"
            />
            <button onClick={() => onChange({ ...value, storyParagraphs: paras.filter((_: string, idx: number) => idx !== i) })} className="p-2 hover:bg-red-50 text-red-400 rounded-lg shrink-0"><Trash2 size={13} /></button>
          </div>
        ))}
        <button onClick={() => onChange({ ...value, storyParagraphs: [...paras, ""] })} className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-[#eef5ea] rounded-xl transition-colors"><Plus size={14} />Add paragraph</button>
      </Section>

      <Section title="Stats bar (4 numbers)">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s: any, i: number) => (
            <div key={i} className="border border-[#dce8d4] rounded-xl p-3 space-y-2">
              <Input label="Number" value={s.number} onChange={(v) => { const u = stats.map((x: any, idx: number) => idx === i ? { ...x, number: v } : x); onChange({ ...value, stats: u }); }} />
              <Input label="Label" value={s.label} onChange={(v) => { const u = stats.map((x: any, idx: number) => idx === i ? { ...x, label: v } : x); onChange({ ...value, stats: u }); }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Team members">
        {team.map((m: any, i: number) => (
          <div key={i} className="border border-[#dce8d4] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5a8a50]">Member {i + 1}</span>
              <button onClick={() => onChange({ ...value, teamMembers: team.filter((_: any, idx: number) => idx !== i) })} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg"><Trash2 size={13} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Name" value={m.name} onChange={(v) => { const u = team.map((x: any, idx: number) => idx === i ? { ...x, name: v } : x); onChange({ ...value, teamMembers: u }); }} />
              <Input label="Role" value={m.role} onChange={(v) => { const u = team.map((x: any, idx: number) => idx === i ? { ...x, role: v } : x); onChange({ ...value, teamMembers: u }); }} />
            </div>
            <Input label="Photo URL" value={m.image} onChange={(v) => { const u = team.map((x: any, idx: number) => idx === i ? { ...x, image: v } : x); onChange({ ...value, teamMembers: u }); }} />
            <Input label="Bio" value={m.bio} onChange={(v) => { const u = team.map((x: any, idx: number) => idx === i ? { ...x, bio: v } : x); onChange({ ...value, teamMembers: u }); }} multiline />
          </div>
        ))}
        <button onClick={() => onChange({ ...value, teamMembers: [...team, { name: "", role: "", bio: "", image: "" }] })} className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-[#eef5ea] rounded-xl transition-colors"><Plus size={14} />Add team member</button>
      </Section>

      <Section title="Customer reviews">
        {reviews.map((r: any, i: number) => (
          <div key={i} className="border border-[#dce8d4] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5a8a50]">Review {i + 1}</span>
              <button onClick={() => onChange({ ...value, reviews: reviews.filter((_: any, idx: number) => idx !== i) })} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg"><Trash2 size={13} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Reviewer name" value={r.name} onChange={(v) => { const u = reviews.map((x: any, idx: number) => idx === i ? { ...x, name: v } : x); onChange({ ...value, reviews: u }); }} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide">Rating (1–5)</label>
                <select value={r.rating} onChange={(e) => { const u = reviews.map((x: any, idx: number) => idx === i ? { ...x, rating: Number(e.target.value) } : x); onChange({ ...value, reviews: u }); }}
                  className="px-3 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white">
                  {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} stars</option>)}
                </select>
              </div>
            </div>
            <Input label="Review text" value={r.comment} onChange={(v) => { const u = reviews.map((x: any, idx: number) => idx === i ? { ...x, comment: v } : x); onChange({ ...value, reviews: u }); }} multiline />
          </div>
        ))}
        <button onClick={() => onChange({ ...value, reviews: [...reviews, { name: "", rating: 5, comment: "" }] })} className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-[#eef5ea] rounded-xl transition-colors"><Plus size={14} />Add review</button>
      </Section>
    </div>
  );
};

// ─── FAQ editor ───────────────────────────────────────────────────────────────

const FaqEditor = ({ value, onChange }: { value: any; onChange: (v: any) => void }) => {
  const groups = value?.groups ?? [];

  const updateGroup = (gi: number, field: string, v: any) => {
    onChange({ ...value, groups: groups.map((g: any, i: number) => i === gi ? { ...g, [field]: v } : g) });
  };

  const updateFaq = (gi: number, fi: number, field: string, v: string) => {
    const newFaqs = groups[gi].faqs.map((f: any, i: number) => i === fi ? { ...f, [field]: v } : f);
    updateGroup(gi, "faqs", newFaqs);
  };

  return (
    <div className="space-y-4">
      {groups.map((group: any, gi: number) => (
        <Section key={gi} title={`${group.emoji} ${group.label}`}>
          {group.faqs.map((faq: any, fi: number) => (
            <div key={fi} className="border border-[#dce8d4] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5a8a50]">Q{fi + 1}</span>
                <button onClick={() => updateGroup(gi, "faqs", group.faqs.filter((_: any, i: number) => i !== fi))} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg"><Trash2 size={13} /></button>
              </div>
              <Input label="Question" value={faq.question} onChange={(v) => updateFaq(gi, fi, "question", v)} />
              <Input label="Answer" value={faq.answer} onChange={(v) => updateFaq(gi, fi, "answer", v)} multiline />
            </div>
          ))}
          <button onClick={() => updateGroup(gi, "faqs", [...group.faqs, { id: `${group.id}${group.faqs.length + 1}`, question: "", answer: "" }])}
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-[#eef5ea] rounded-xl transition-colors"><Plus size={14} />Add FAQ
          </button>
        </Section>
      ))}
    </div>
  );
};

// ─── Shipping editor ──────────────────────────────────────────────────────────

const ShippingEditor = ({ value, onChange }: { value: any; onChange: (v: any) => void }) => {
  const zones = value?.deliveryZones ?? [];
  return (
    <div className="space-y-4">
      <Section title="Charges">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Free delivery above (₹)" value={String(value?.freeThreshold ?? 999)} onChange={(v) => onChange({ ...value, freeThreshold: Number(v) })} />
          <Input label="Standard delivery fee (₹)" value={String(value?.standardFee ?? 79)} onChange={(v) => onChange({ ...value, standardFee: Number(v) })} />
        </div>
      </Section>
      <Section title="Delivery zones">
        {zones.map((z: any, i: number) => (
          <div key={i} className="border border-[#dce8d4] rounded-xl p-4 grid grid-cols-3 gap-3">
            <Input label="Area" value={z.zone} onChange={(v) => { const u = zones.map((x: any, idx: number) => idx === i ? { ...x, zone: v } : x); onChange({ ...value, deliveryZones: u }); }} />
            <Input label="Time" value={z.time} onChange={(v) => { const u = zones.map((x: any, idx: number) => idx === i ? { ...x, time: v } : x); onChange({ ...value, deliveryZones: u }); }} />
            <Input label="Fee display" value={z.fee} onChange={(v) => { const u = zones.map((x: any, idx: number) => idx === i ? { ...x, fee: v } : x); onChange({ ...value, deliveryZones: u }); }} />
          </div>
        ))}
        <button onClick={() => onChange({ ...value, deliveryZones: [...zones, { zone: "", time: "", fee: "" }] })} className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-[#eef5ea] rounded-xl transition-colors"><Plus size={14} />Add zone</button>
      </Section>
      <Section title="Other">
        <Input label="Packaging note" value={value?.packagingNote ?? ""} onChange={(v) => onChange({ ...value, packagingNote: v })} multiline />
        <Input label="Business days" value={value?.businessDays ?? ""} onChange={(v) => onChange({ ...value, businessDays: v })} />
      </Section>
    </div>
  );
};

// ─── Returns editor ───────────────────────────────────────────────────────────

const ReturnsEditor = ({ value, onChange }: { value: any; onChange: (v: any) => void }) => {
  const eligible    = value?.eligible ?? [];
  const notEligible = value?.notEligible ?? [];

  return (
    <div className="space-y-4">
      <Section title="Policy terms">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Return window (days)" value={String(value?.windowDays ?? 7)} onChange={(v) => onChange({ ...value, windowDays: Number(v) })} />
          <Input label="Refund timeline" value={value?.refundDays ?? ""} onChange={(v) => onChange({ ...value, refundDays: v })} placeholder="3–5 business days" />
        </div>
      </Section>
      <Section title="What can be returned">
        {eligible.map((item: string, i: number) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={(e) => { const u = eligible.map((x: string, idx: number) => idx === i ? e.target.value : x); onChange({ ...value, eligible: u }); }}
              className="flex-1 px-3 py-2 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
            />
            <button onClick={() => onChange({ ...value, eligible: eligible.filter((_: string, idx: number) => idx !== i) })} className="p-2 hover:bg-red-50 text-red-400 rounded-lg"><Trash2 size={13} /></button>
          </div>
        ))}
        <button onClick={() => onChange({ ...value, eligible: [...eligible, ""] })} className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-[#eef5ea] rounded-xl transition-colors"><Plus size={14} />Add item</button>
      </Section>
      <Section title="What cannot be returned">
        {notEligible.map((item: string, i: number) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={(e) => { const u = notEligible.map((x: string, idx: number) => idx === i ? e.target.value : x); onChange({ ...value, notEligible: u }); }}
              className="flex-1 px-3 py-2 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
            />
            <button onClick={() => onChange({ ...value, notEligible: notEligible.filter((_: string, idx: number) => idx !== i) })} className="p-2 hover:bg-red-50 text-red-400 rounded-lg"><Trash2 size={13} /></button>
          </div>
        ))}
        <button onClick={() => onChange({ ...value, notEligible: [...notEligible, ""] })} className="flex items-center gap-2 px-3 py-2 text-sm text-[#3d6b35] hover:bg-[#eef5ea] rounded-xl transition-colors"><Plus size={14} />Add item</button>
      </Section>
    </div>
  );
};

// ─── Contact editor ───────────────────────────────────────────────────────────

const ContactEditor = ({ value, onChange }: { value: any; onChange: (v: any) => void }) => (
  <div className="space-y-4">
    <Section title="Contact details">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Phone number" value={value?.phone ?? ""} onChange={(v) => onChange({ ...value, phone: v })} placeholder="+91 98765 43210" />
        <Input label="WhatsApp number (no + or spaces)" value={value?.whatsapp ?? ""} onChange={(v) => onChange({ ...value, whatsapp: v })} placeholder="919876543210" />
      </div>
      <Input label="Email address" value={value?.email ?? ""} onChange={(v) => onChange({ ...value, email: v })} />
      <Input label="Store address" value={value?.address ?? ""} onChange={(v) => onChange({ ...value, address: v })} multiline />
    </Section>
    <Section title="Business hours">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Weekdays open" value={value?.hours?.weekdays?.open ?? "9:00 AM"} onChange={(v) => onChange({ ...value, hours: { ...value?.hours, weekdays: { ...value?.hours?.weekdays, open: v } } })} />
        <Input label="Weekdays close" value={value?.hours?.weekdays?.close ?? "6:00 PM"} onChange={(v) => onChange({ ...value, hours: { ...value?.hours, weekdays: { ...value?.hours?.weekdays, close: v } } })} />
        <Input label="Saturday open" value={value?.hours?.saturday?.open ?? "9:00 AM"} onChange={(v) => onChange({ ...value, hours: { ...value?.hours, saturday: { ...value?.hours?.saturday, open: v } } })} />
        <Input label="Saturday close" value={value?.hours?.saturday?.close ?? "4:00 PM"} onChange={(v) => onChange({ ...value, hours: { ...value?.hours, saturday: { ...value?.hours?.saturday, close: v } } })} />
      </div>
    </Section>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminContentPage() {
  const [activeKey, setActiveKey]   = useState("homepage");
  const [content,   setContent]     = useState<any>(null);
  const [loading,   setLoading]     = useState(false);
  const [saving,    setSaving]      = useState(false);
  const [saved,     setSaved]       = useState(false);
  const [error,     setError]       = useState("");

  useEffect(() => { loadContent(activeKey); }, [activeKey]);

  const loadContent = async (key: string) => {
    setLoading(true);
    setError("");
    setContent(null);
    try {
      const res = await fetch(`/api/admin/content/${key}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setContent(data.value ?? data);
    } catch {
      setError("Could not load content. Check your database connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/content/${activeKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: content }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed."); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const activePage = PAGES.find((p) => p.key === activeKey)!;

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-[#1e3d18]">Page Content</h2>
          <p className="text-sm text-[#7a9e6a] mt-0.5">Edit text and content for all pages without touching code</p>
        </div>
        <button onClick={handleSave} disabled={saving || loading || !content}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 ${saved ? "bg-green-600 text-white" : "bg-[#3d6b35] hover:bg-[#2d5228] text-white"}`}
        >
          {saving ? <><RefreshCw size={15} className="animate-spin" />Saving…</> : saved ? <><Check size={15} />Saved!</> : <><Save size={15} />Save Changes</>}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
          <AlertCircle size={15} className="shrink-0" />{error}
        </div>
      )}

      <div className="flex gap-5 items-start">
        {/* Page selector sidebar */}
        <div className="w-48 shrink-0">
          <p className="text-xs font-bold text-[#7a9e6a] uppercase tracking-wider mb-2">Select page</p>
          <div className="flex flex-col gap-1">
            {PAGES.map((page) => {
              const Icon = page.icon;
              return (
                <button key={page.key} onClick={() => setActiveKey(page.key)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left w-full transition-all text-sm ${
                    activeKey === page.key ? "bg-[#3d6b35] text-white" : "bg-white border border-[#dce8d4] text-[#5a8a50] hover:border-[#3d6b35]"
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold truncate">{page.label}</p>
                    <p className={`text-[10px] truncate ${activeKey === page.key ? "text-white/70" : "text-[#9ab890]"}`}>{page.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor panel */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#eef7e6] flex items-center justify-center">
              <activePage.icon size={15} className="text-[#3d6b35]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1e3d18]">{activePage.label}</h3>
              <p className="text-xs text-[#9ab890]">{activePage.desc}</p>
            </div>
            <button onClick={() => loadContent(activeKey)} className="ml-auto p-2 hover:bg-[#f0f4ed] rounded-lg transition-colors">
              <RefreshCw size={14} className={`text-[#9ab890] ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-[#dce8d4] p-10 text-center">
              <RefreshCw size={22} className="animate-spin text-[#3d6b35] mx-auto mb-2" />
              <p className="text-sm text-[#9ab890]">Loading content…</p>
            </div>
          ) : !content ? (
            <div className="bg-white rounded-2xl border border-[#dce8d4] p-10 text-center">
              <p className="text-sm text-[#9ab890]">No content loaded.</p>
            </div>
          ) : (
            <div>
              {activeKey === "homepage" && <HomepageEditor value={content} onChange={setContent} />}
              {activeKey === "about"    && <AboutEditor    value={content} onChange={setContent} />}
              {activeKey === "faq"      && <FaqEditor      value={content} onChange={setContent} />}
              {activeKey === "shipping" && <ShippingEditor value={content} onChange={setContent} />}
              {activeKey === "returns"  && <ReturnsEditor  value={content} onChange={setContent} />}
              {activeKey === "contact"  && <ContactEditor  value={content} onChange={setContent} />}
            </div>
          )}

          {content && (
            <div className="mt-5 flex justify-end">
              <button onClick={handleSave} disabled={saving}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md disabled:opacity-60 ${saved ? "bg-green-600 text-white" : "bg-[#3d6b35] hover:bg-[#2d5228] text-white"}`}
              >
                {saving ? <><RefreshCw size={15} className="animate-spin" />Saving…</> : saved ? <><Check size={15} />Saved!</> : <><Save size={15} />Save Changes</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}