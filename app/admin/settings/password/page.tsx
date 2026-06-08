"use client";

// app/admin/settings/password/page.tsx
// Admin password change page — accessible from /admin/settings/password

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Eye, EyeOff, RefreshCw, Check, AlertCircle } from "lucide-react";

export default function ChangePasswordPage() {
  const [current,    setCurrent]    = useState("");
  const [next,       setNext]       = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showCur,    setShowCur]    = useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");

  const strength = (p: string) => {
    let s = 0;
    if (p.length >= 8)  s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strengthLabel = ["", "Very weak", "Weak", "Fair", "Strong", "Very strong"];
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-600"];
  const s = strength(next);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (next !== confirm) { setError("New passwords do not match."); return; }
    if (next.length < 8)  { setError("Password must be at least 8 characters."); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to change password."); return; }
      setSuccess(true);
      setCurrent(""); setNext(""); setConfirm("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <Link href="/admin/settings" className="flex items-center gap-1.5 text-sm text-[#7a9e6a] hover:text-[#3d6b35] mb-2 transition-colors">
          <ArrowLeft size={14} />Back to Settings
        </Link>
        <h2 className="text-2xl font-black text-[#1e3d18]">Change Password</h2>
        <p className="text-sm text-[#7a9e6a] mt-0.5">Use a strong password with letters, numbers and symbols.</p>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-800">
          <Check size={16} className="shrink-0 text-green-600" />
          Password changed successfully. Use your new password next time you log in.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#dce8d4] p-6 space-y-5">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <AlertCircle size={14} className="shrink-0" />{error}
          </div>
        )}

        {/* Current password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#1e3d18]">Current Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ab890]" />
            <input
              type={showCur ? "text" : "password"}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Enter current password"
              required
              className="w-full pl-10 pr-10 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
            />
            <button type="button" onClick={() => setShowCur(!showCur)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ab890] hover:text-[#3d6b35]">
              {showCur ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#1e3d18]">New Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ab890]" />
            <input
              type={showNew ? "text" : "password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Minimum 8 characters"
              required
              className="w-full pl-10 pr-10 py-2.5 border border-[#dce8d4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white"
            />
            <button type="button" onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ab890] hover:text-[#3d6b35]">
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {next && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= s ? strengthColor[s] : "bg-[#e8f0e4]"}`} />
                ))}
              </div>
              <p className={`text-xs font-semibold ${s >= 4 ? "text-green-600" : s >= 3 ? "text-yellow-600" : "text-red-500"}`}>
                {strengthLabel[s]}
              </p>
            </div>
          )}
        </div>

        {/* Confirm */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-[#1e3d18]">Confirm New Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat new password"
            required
            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3d6b35] bg-white ${
              confirm && next !== confirm ? "border-red-300" : "border-[#dce8d4]"
            }`}
          />
          {confirm && next !== confirm && (
            <p className="text-xs text-red-500 font-semibold">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving || (!!confirm && next !== confirm)}
          className="w-full flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#2d5228] disabled:bg-[#a8c890] text-white font-bold text-sm py-3 rounded-xl transition-colors"
        >
          {saving ? <><RefreshCw size={14} className="animate-spin" />Changing…</> : <><Check size={14} />Change Password</>}
        </button>
      </form>

      <div className="bg-[#fff8ee] border border-[#f0d080] rounded-2xl px-5 py-4 text-sm text-[#7a5c1e]">
        <p className="font-bold mb-1">Tips for a strong password</p>
        <ul className="space-y-0.5 text-xs">
          <li>• At least 12 characters long</li>
          <li>• Mix of uppercase, lowercase, numbers and symbols</li>
          <li>• Don't reuse passwords from other accounts</li>
          <li>• Store it in a password manager</li>
        </ul>
      </div>
    </div>
  );
}