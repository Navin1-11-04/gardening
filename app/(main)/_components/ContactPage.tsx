"use client";

import { useState } from "react";
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle2,
  ChevronRight, MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface FormState {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY: FormState = { name: "", phone: "", email: "", subject: "", message: "" };

const SUBJECTS = [
  "Product enquiry",
  "Order status",
  "Bulk / wholesale order",
  "Gardening advice",
  "Delivery enquiry",
  "Other",
];

export default function ContactPage() {
  const [form,     setForm]     = useState<FormState>(EMPTY);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError("Please fill in your name, phone and message.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to send. Please try again."); return; }
      setSuccess(true);
      setForm(EMPTY);
    } catch {
      setError("Network error. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={13} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">Contact Us</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#1e3d18] py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3d6b35] opacity-20 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#7ab648] opacity-10 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Get in Touch 🌿</h1>
          <p className="text-[#a0c890] text-base leading-relaxed">
            Have a question about our products or your order? We're here to help. Most queries are answered within a few hours.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT: Contact Form ── */}
          <div className="flex-1 min-w-0">
            {success ? (
              <div className="bg-white rounded-2xl border border-[#e8e0d0] p-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#eef5ea] rounded-full mb-5">
                  <CheckCircle2 size={32} className="text-[#3d6b35]" />
                </div>
                <h2 className="text-2xl font-bold text-[#2a2a1e] mb-3">Message Received!</h2>
                <p className="text-[#5a5a48] text-base leading-relaxed mb-6">
                  Thank you for reaching out. We'll get back to you on WhatsApp or phone within a few hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-[#3d6b35] hover:bg-[#2e5228] text-white font-bold px-6 py-3 rounded-xl transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e8e0d0] p-6 sm:p-8 flex flex-col gap-5">
                <h2 className="text-xl font-bold text-[#2a2a1e]">Send us a message</h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#2a2a1e] mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" value={form.name} onChange={set("name")}
                      placeholder="e.g. Meenakshi Rajan"
                      className="w-full bg-[#faf7f2] border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2a2a1e] mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel" value={form.phone} onChange={set("phone")}
                      placeholder="e.g. 98765 43210"
                      className="w-full bg-[#faf7f2] border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#2a2a1e] mb-1.5">Email (optional)</label>
                  <input
                    type="email" value={form.email} onChange={set("email")}
                    placeholder="your@email.com"
                    className="w-full bg-[#faf7f2] border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#2a2a1e] mb-1.5">Subject</label>
                  <select
                    value={form.subject} onChange={set("subject")}
                    className="w-full bg-[#faf7f2] border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  >
                    <option value="">Select a subject…</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#2a2a1e] mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.message} onChange={set("message")}
                    placeholder="Tell us what you need help with…"
                    rows={5}
                    className="w-full bg-[#faf7f2] border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] disabled:bg-[#a8c890] text-white font-bold py-4 rounded-xl transition-all shadow-md"
                >
                  {loading ? (
                    <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sending…</>
                  ) : (
                    <><Send size={18} />Send Message</>
                  )}
                </button>

                <p className="text-xs text-center text-[#a8a090]">
                  Prefer to talk? Call us directly — <a href="tel:+919876543210" className="text-[#3d6b35] font-semibold">+91 98765 43210</a>
                </p>
              </form>
            )}
          </div>

          {/* ── RIGHT: Contact Info ── */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
            {/* Quick contact */}
            <div className="bg-[#1e3d18] rounded-2xl p-6 text-white">
              <h3 className="text-base font-bold mb-4 text-[#a0d878]">Quick Contact</h3>

              <a href="tel:+919876543210" className="flex items-center gap-3 mb-4 group">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <Phone size={18} className="text-[#7ab648]" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Phone / WhatsApp</p>
                  <p className="text-sm font-bold text-white">+91 98765 43210</p>
                </div>
              </a>

              <a href="mailto:hello@kavinorganics.in" className="flex items-center gap-3 mb-4 group">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                  <Mail size={18} className="text-[#7ab648]" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Email</p>
                  <p className="text-sm font-bold text-white">hello@kavinorganics.in</p>
                </div>
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%2C%20I%20have%20a%20question%20about%20Kavin%20Organics"
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20bc59] text-white font-bold py-3 rounded-xl transition-all text-sm mt-2"
              >
                <MessageSquare size={16} />Chat on WhatsApp
              </a>
            </div>

            {/* Address & Hours */}
            <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 bg-[#eef5ea] rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={16} className="text-[#3d6b35]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide mb-0.5">Store Address</p>
                  <p className="text-sm text-[#5a5a48] leading-relaxed">
                    No. 45, Market Road,<br />
                    Thiruchengode — 637211<br />
                    Namakkal District, Tamil Nadu
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[#eef5ea] rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={16} className="text-[#3d6b35]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1e3d18] uppercase tracking-wide mb-1">Business Hours</p>
                  <div className="text-sm text-[#5a5a48] space-y-0.5">
                    <div className="flex justify-between gap-4">
                      <span>Mon – Fri</span><span className="font-semibold text-[#2a2a1e]">9am – 6pm</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Saturday</span><span className="font-semibold text-[#2a2a1e]">9am – 4pm</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Sunday</span><span className="font-semibold text-red-500">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ hint */}
            <div className="bg-[#fff8ee] border border-[#f0d080] rounded-2xl px-5 py-4 text-sm text-[#7a5c1e]">
              <p className="font-bold mb-1">💡 Common questions</p>
              <ul className="space-y-1 text-xs leading-relaxed">
                <li>• Orders are delivered in 2–4 business days</li>
                <li>• Free delivery on orders above ₹999</li>
                <li>• WhatsApp us for bulk / wholesale pricing</li>
                <li>• We ship across all of Tamil Nadu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}