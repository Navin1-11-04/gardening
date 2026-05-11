"use client";

import { useState, useEffect } from "react";
import {
  Star, Check, X, Trash2, RefreshCw,
  AlertCircle, Search, ChevronDown, Shield,
} from "lucide-react";

interface Review {
  id: string;
  productId: string;
  productName: string;
  name: string;
  phone: string;
  rating: number;
  comment: string;
  verified: boolean;
  approved: boolean;
  createdAt: string;
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map((s) => (
      <Star key={s} size={13}
        className={s <= rating ? "text-[#d4a017] fill-[#d4a017]" : "text-[#d0c8b8]"}
      />
    ))}
  </div>
);

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminReviewsPage() {
  const [reviews,    setReviews]    = useState<Review[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [filter,     setFilter]     = useState<"all" | "pending" | "approved">("pending");
  const [search,     setSearch]     = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actingId,   setActingId]   = useState<string | null>(null);

  useEffect(() => { fetchReviews(); }, [filter]);

  const fetchReviews = async () => {
    setLoading(true); setError("");
    try {
      const param = filter === "all" ? "" : `?status=${filter}`;
      const res = await fetch(`/api/admin/reviews${param}`);
      if (!res.ok) throw new Error();
      setReviews(await res.json());
    } catch {
      setError("Could not load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    setActingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) { alert("Action failed. Please try again."); return; }
      const data = await res.json();
      setReviews((prev) => prev.map((r) =>
        r.id === id
          ? { ...r, approved: data.approved ?? r.approved, verified: data.verified ?? r.verified }
          : r
      ));
      // If filtering by pending and review was approved, remove from list
      if (filter === "pending" && action === "approve") {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = reviews.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q)
    );
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-[#1e3d18]">Product Reviews</h2>
            {pendingCount > 0 && filter !== "approved" && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                {pendingCount} pending
              </span>
            )}
          </div>
          <p className="text-sm text-[#7a9e6a] mt-0.5">{reviews.length} review{reviews.length !== 1 ? "s" : ""} loaded</p>
        </div>
        <button onClick={fetchReviews}
          className="flex items-center gap-2 px-3 py-2 border border-[#dce8d4] bg-white rounded-xl text-[#3d6b35] hover:bg-[#f0f4ed] transition-colors text-sm font-semibold"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />Refresh
        </button>
      </div>

      {/* Info */}
      <div className="bg-[#eef7e6] border border-[#b8d4a0] rounded-2xl px-5 py-3 text-sm text-[#1e3d18]">
        <p className="font-bold mb-0.5">📋 How reviews work</p>
        <p className="text-[#5a8a50]">
          Customers submit reviews from the product page. Reviews are hidden until you approve them here.
          Mark as "Verified" to show the verified purchase badge. Approved reviews appear live on the product page.
        </p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {(["pending", "approved", "all"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                filter === f
                  ? "bg-[#3d6b35] text-white"
                  : "bg-white border border-[#dce8d4] text-[#5a8a50] hover:border-[#3d6b35]"
              }`}
            >
              {f}{f === "pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ab890]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, product, or review text…"
            className="w-full pl-10 pr-4 py-2.5 border border-[#dce8d4] bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35]"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          <AlertCircle size={14} />{error}
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#dce8d4] p-10 text-center">
          <RefreshCw size={22} className="animate-spin text-[#3d6b35] mx-auto mb-2" />
          <p className="text-sm text-[#9ab890]">Loading reviews…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#dce8d4] p-10 text-center">
          <Star size={32} className="text-[#b0c8a0] mx-auto mb-3" />
          <p className="text-[#7a9e6a] font-semibold">
            {filter === "pending" ? "No pending reviews — all clear!" : "No reviews found"}
          </p>
          <p className="text-sm text-[#9ab890] mt-1">
            {filter === "pending"
              ? "New reviews will appear here for approval."
              : search ? "Try a different search." : "No reviews in this category yet."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((review) => (
            <div key={review.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                !review.approved ? "border-amber-200" : "border-[#dce8d4]"
              }`}
            >
              <div className="px-5 py-4">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[#1e3d18]">{review.name}</p>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          <Shield size={9} />Verified
                        </span>
                      )}
                      {!review.approved && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          Pending Approval
                        </span>
                      )}
                      {review.approved && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          Published
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#9ab890] mt-0.5">
                      {timeAgo(review.createdAt)}
                      {review.phone && ` · 📞 ${review.phone}`}
                    </p>
                  </div>
                  <Stars rating={review.rating} />
                </div>

                {/* Product + comment */}
                <div className="bg-[#f8faf6] rounded-xl p-3 mb-3">
                  <p className="text-xs font-bold text-[#5a8a50] mb-1">📦 {review.productName}</p>
                  <p className="text-sm text-[#2a2a1e] leading-relaxed">{review.comment}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Approve / Unapprove */}
                  {!review.approved ? (
                    <button
                      onClick={() => handleAction(review.id, "approve")}
                      disabled={actingId === review.id}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-[#3d6b35] hover:bg-[#2d5228] text-white rounded-xl transition-colors disabled:opacity-60"
                    >
                      {actingId === review.id
                        ? <RefreshCw size={12} className="animate-spin" />
                        : <Check size={12} />
                      }
                      Approve & Publish
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(review.id, "unapprove")}
                      disabled={actingId === review.id}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white border border-[#dce8d4] hover:bg-[#f0f4ed] text-[#5a8a50] rounded-xl transition-colors disabled:opacity-60"
                    >
                      <X size={12} />Unpublish
                    </button>
                  )}

                  {/* Verify / Unverify */}
                  {!review.verified ? (
                    <button
                      onClick={() => handleAction(review.id, "verify")}
                      disabled={actingId === review.id}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white border border-[#dce8d4] hover:bg-[#eef5ea] text-[#3d6b35] rounded-xl transition-colors disabled:opacity-60"
                    >
                      <Shield size={12} />Mark Verified
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(review.id, "unverify")}
                      disabled={actingId === review.id}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white border border-[#dce8d4] hover:bg-[#f0f4ed] text-[#7a9e6a] rounded-xl transition-colors disabled:opacity-60"
                    >
                      <Shield size={12} />Remove Verified
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-500 rounded-xl transition-colors disabled:opacity-40 ml-auto"
                  >
                    {deletingId === review.id
                      ? <RefreshCw size={12} className="animate-spin" />
                      : <Trash2 size={12} />
                    }
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}