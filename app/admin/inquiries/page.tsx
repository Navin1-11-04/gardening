"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare, Phone, Mail, Search, RefreshCw,
  CheckCircle2, Clock, ChevronDown, ChevronUp, Trash2, AlertCircle,
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

const STATUS_CONFIG = {
  new:     { label: "New",     color: "bg-red-100 text-red-700",    icon: Clock },
  read:    { label: "Read",    color: "bg-amber-100 text-amber-700", icon: Clock },
  replied: { label: "Replied", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const InquiryCard = ({
  inquiry, onStatusChange, onDelete,
}: {
  inquiry: Inquiry;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(inquiry.status === "new");
  const cfg = STATUS_CONFIG[inquiry.status];
  const SIcon = cfg.icon;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all ${inquiry.status === "new" ? "border-red-200" : "border-[#dce8d4]"}`}>
      <button
        onClick={() => {
          setExpanded(!expanded);
          if (inquiry.status === "new") onStatusChange(inquiry.id, "read");
        }}
        className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-[#fafcf8] transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-[#eef7e6] flex items-center justify-center shrink-0">
          <MessageSquare size={18} className="text-[#3d6b35]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-sm font-bold text-[#1e3d18]">{inquiry.name}</p>
            <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
              <SIcon size={10} />{cfg.label}
            </span>
            {inquiry.status === "new" && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </div>
          <p className="text-xs text-[#5a8a50] font-semibold truncate">{inquiry.subject || "No subject"}</p>
          <p className="text-xs text-[#9ab890] mt-0.5">{timeAgo(inquiry.createdAt)}</p>
        </div>
        {expanded ? <ChevronUp size={16} className="text-[#9ab890] shrink-0 mt-1" /> : <ChevronDown size={16} className="text-[#9ab890] shrink-0 mt-1" />}
      </button>

      {expanded && (
        <div className="border-t border-[#f0f4ed] px-5 py-4 flex flex-col gap-4">
          {/* Contact info */}
          <div className="flex gap-4 flex-wrap">
            <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 text-sm font-semibold text-[#3d6b35] hover:underline">
              <Phone size={14} />{inquiry.phone}
            </a>
            {inquiry.email && (
              <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 text-sm font-semibold text-[#3d6b35] hover:underline">
                <Mail size={14} />{inquiry.email}
              </a>
            )}
          </div>

          {/* Message */}
          <div className="bg-[#f8faf6] rounded-xl p-4">
            <p className="text-sm text-[#2a2a1e] leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            {inquiry.status !== "replied" && (
              <button
                onClick={() => onStatusChange(inquiry.id, "replied")}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-[#3d6b35] hover:bg-[#2d5228] text-white rounded-xl transition-colors"
              >
                <CheckCircle2 size={13} />Mark as Replied
              </button>
            )}
            {inquiry.status === "replied" && (
              <button
                onClick={() => onStatusChange(inquiry.id, "read")}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white border border-[#dce8d4] hover:bg-[#f0f4ed] text-[#5a8a50] rounded-xl transition-colors"
              >
                Mark as Unread
              </button>
            )}
            <a
              href={`https://wa.me/${inquiry.phone.replace(/\D/g, "")}?text=Hi+${encodeURIComponent(inquiry.name.split(" ")[0])}%2C+thank+you+for+reaching+out+to+Kavin+Organics!`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-[#25d366] hover:bg-[#1ebe58] text-white rounded-xl transition-colors"
            >
              💬 Reply on WhatsApp
            </a>
            {inquiry.email && (
              <a
                href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white border border-[#dce8d4] hover:bg-[#f0f4ed] text-[#5a8a50] rounded-xl transition-colors"
              >
                <Mail size={13} />Reply by Email
              </a>
            )}
            <button
              onClick={() => onDelete(inquiry.id)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-500 rounded-xl transition-colors ml-auto"
            >
              <Trash2 size={13} />Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminInquiriesPage() {
  const [inquiries,   setInquiries]   = useState<Inquiry[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [search,      setSearch]      = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "replied">("all");

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/inquiries");
      if (!res.ok) throw new Error();
      setInquiries(await res.json());
    } catch {
      setError("Could not load messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status: status as any } : i));
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
  };

  const filtered = inquiries.filter((i) => {
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || i.name.toLowerCase().includes(q) || i.phone.includes(q) || i.message.toLowerCase().includes(q) || i.subject.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-[#1e3d18]">Customer Messages</h2>
            {newCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                {newCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-[#7a9e6a] mt-0.5">{inquiries.length} total messages</p>
        </div>
        <button onClick={fetchInquiries} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 border border-[#dce8d4] bg-white rounded-xl text-[#3d6b35] hover:bg-[#f0f4ed] transition-colors text-sm font-semibold"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ab890]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages, names, phone…"
            className="w-full pl-10 pr-4 py-2.5 border border-[#dce8d4] bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "new", "read", "replied"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-sm font-bold rounded-xl transition-all capitalize ${statusFilter === s ? "bg-[#3d6b35] text-white" : "bg-white border border-[#dce8d4] text-[#5a8a50] hover:border-[#3d6b35]"}`}
            >
              {s}{s === "new" && newCount > 0 ? ` (${newCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <AlertCircle size={14} />{error}
        </div>
      )}

      {/* Inquiries list */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw size={24} className="animate-spin text-[#3d6b35] mx-auto mb-3" />
          <p className="text-sm text-[#9ab890]">Loading messages…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#dce8d4] p-12 text-center">
          <MessageSquare size={32} className="text-[#b0c8a0] mx-auto mb-3" />
          <p className="text-[#7a9e6a] font-semibold">No messages found</p>
          <p className="text-sm text-[#9ab890] mt-1">
            {search || statusFilter !== "all" ? "Try adjusting your filters." : "No customer messages yet."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}