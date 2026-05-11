"use client";

import { useState, useEffect } from "react";
import { Star, Check, RefreshCw, Send, ThumbsUp } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
}

interface ReviewStats {
  count: number;
  avgRating: number;
  breakdown: Record<number, number>;
}

interface ProductReviewsProps {
  productId: string | number;
  productName: string;
}

// ─── Star selector ────────────────────────────────────────────────────────────

const StarSelector = ({
  value, onChange,
}: {
  value: number; onChange: (v: number) => void;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 active:scale-95"
          aria-label={`${s} star${s !== 1 ? "s" : ""}`}
        >
          <Star
            size={32}
            className={
              s <= (hover || value)
                ? "text-[#d4a017] fill-[#d4a017]"
                : "text-[#d0c8b8]"
            }
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-semibold text-[#5a5a48]">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
        </span>
      )}
    </div>
  );
};

// ─── Display stars ────────────────────────────────────────────────────────────

const Stars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={s <= Math.round(rating) ? "text-[#d4a017] fill-[#d4a017]" : "text-[#d0c8b8]"}
      />
    ))}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews,     setReviews]     = useState<Review[]>([]);
  const [stats,       setStats]       = useState<ReviewStats | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [formError,   setFormError]   = useState("");

  const [form, setForm] = useState({
    name: "", phone: "", rating: 0, comment: "",
  });

  // Fetch reviews on mount
  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setReviews(data.reviews);
          setStats(data.stats);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) { setFormError("Please select a star rating."); return; }
    if (!form.name.trim()) { setFormError("Please enter your name."); return; }
    if (form.comment.trim().length < 10) { setFormError("Please write at least 10 characters."); return; }

    setSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productName,
          name:    form.name.trim(),
          phone:   form.phone.trim() || undefined,
          rating:  form.rating,
          comment: form.comment.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? "Failed to submit. Please try again."); return; }
      setSubmitted(true);
      setShowForm(false);
      setForm({ name: "", phone: "", rating: 0, comment: "" });
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Rating breakdown percentage
  const pct = (star: number) => {
    if (!stats || stats.count === 0) return 0;
    return Math.round(((stats.breakdown[star] ?? 0) / stats.count) * 100);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          {stats && stats.count > 0 ? (
            <>
              <span className="text-4xl font-black text-[#3d6b35]">{stats.avgRating}</span>
              <div>
                <Stars rating={stats.avgRating} size={18} />
                <p className="text-sm text-[#7a7a68] mt-0.5">{stats.count} review{stats.count !== 1 ? "s" : ""}</p>
              </div>
            </>
          ) : loading ? (
            <RefreshCw size={18} className="animate-spin text-[#3d6b35]" />
          ) : (
            <p className="text-sm text-[#7a7a68]">No reviews yet — be the first!</p>
          )}
        </div>
        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#eef5ea] hover:bg-[#3d6b35] hover:text-white text-[#3d6b35] border border-[#b8d4a0] font-bold text-sm px-4 py-2.5 rounded-xl transition-all"
          >
            <Star size={15} />Write a Review
          </button>
        )}
      </div>

      {/* Rating breakdown */}
      {stats && stats.count > 0 && (
        <div className="flex flex-col gap-1.5 mb-6 max-w-xs">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-[#5a5a48] w-2.5 shrink-0">{star}</span>
              <Star size={11} className="text-[#d4a017] fill-[#d4a017] shrink-0" />
              <div className="flex-1 h-2 bg-[#e8e0d0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d4a017] rounded-full transition-all duration-500"
                  style={{ width: `${pct(star)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7a7a68] w-7 text-right shrink-0">{pct(star)}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Thank-you message after submit */}
      {submitted && (
        <div className="bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl p-5 mb-6 flex items-start gap-3">
          <ThumbsUp size={20} className="text-[#3d6b35] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#2a2a1e]">Thank you for your review!</p>
            <p className="text-sm text-[#5a5a48] mt-0.5">
              Your review will appear after a quick check by our team (usually within a few hours).
            </p>
          </div>
        </div>
      )}

      {/* Review submission form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#faf7f2] border border-[#e8e0d0] rounded-2xl p-5 mb-6 flex flex-col gap-4"
        >
          <h3 className="text-base font-bold text-[#2a2a1e]">Write Your Review</h3>

          {/* Star rating */}
          <div>
            <label className="block text-sm font-bold text-[#2a2a1e] mb-2">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <StarSelector value={form.rating} onChange={(v) => setForm((p) => ({ ...p, rating: v }))} />
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#2a2a1e] mb-1.5">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Meenakshi R."
                className="w-full bg-white border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#2a2a1e] mb-1.5">
                Phone (optional)
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Helps us verify your purchase"
                className="w-full bg-white border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-bold text-[#2a2a1e] mb-1.5">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
              placeholder="Tell other customers about your experience with this product…"
              rows={4}
              className="w-full bg-white border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
            />
            <p className="text-xs text-[#a8a090] mt-1">{form.comment.length}/1000 characters</p>
          </div>

          {formError && (
            <p className="text-sm text-red-600 font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {formError}
            </p>
          )}

          <p className="text-xs text-[#a8a090]">
            Reviews are checked by our team before appearing publicly. We do not post fake reviews.
          </p>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] disabled:bg-[#a8c890] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all"
            >
              {submitting
                ? <><RefreshCw size={15} className="animate-spin" />Submitting…</>
                : <><Send size={15} />Submit Review</>
              }
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setFormError(""); }}
              className="text-sm font-semibold text-[#7a7a68] hover:text-[#3d6b35] px-4 py-2.5 rounded-xl hover:bg-[#eef5ea] transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#7a9e6a]">
          <RefreshCw size={14} className="animate-spin" />Loading reviews…
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 bg-[#faf7f2] rounded-2xl border border-[#e8e0d0]">
          <Star size={28} className="text-[#d0c8b8] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#7a7a68]">No reviews yet</p>
          <p className="text-xs text-[#a8a090] mt-1">Be the first to review this product!</p>
          {!showForm && !submitted && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 text-sm font-bold text-[#3d6b35] hover:underline"
            >
              Write a Review →
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-[#faf7f2] border border-[#e8e0d0] rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#2a2a1e]">{r.name}</span>
                    {r.verified && (
                      <span className="flex items-center gap-1 text-[10px] text-[#3d6b35] bg-[#eef5ea] px-2 py-0.5 rounded-full font-semibold">
                        <Check size={9} />Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#a8a090] mt-0.5">{r.date}</p>
                </div>
                <Stars rating={r.rating} size={14} />
              </div>
              <p className="text-sm text-[#3a3a2e] leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}