"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Send,
  Check,
  Leaf,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const contactChannels = [
  {
    id: "phone",
    icon: Phone,
    label: "Call Us",
    value: "+91 98765 43210",
    subtext: "Talk to a garden expert directly",
    action: "tel:+919876543210",
    actionLabel: "Call Now",
    bg: "#eef5ea",
    border: "#b8d4a0",
    iconBg: "#3d6b35",
    iconColor: "white",
    priority: true,
  },
  {
    id: "whatsapp",
    icon: MessageSquare,
    label: "WhatsApp",
    value: "+91 98765 43210",
    subtext: "Send us a message anytime",
    action: "https://wa.me/919876543210",
    actionLabel: "Open WhatsApp",
    bg: "#e8f5ee",
    border: "#86d4a8",
    iconBg: "#25a244",
    iconColor: "white",
    priority: true,
  },
  {
    id: "email",
    icon: Mail,
    label: "Email Us",
    value: "hello@kavinorganics.in",
    subtext: "We reply within 24 hours",
    action: "mailto:hello@kavinorganics.in",
    actionLabel: "Send Email",
    bg: "#faf7f2",
    border: "#d4c9a8",
    iconBg: "#7a5c1e",
    iconColor: "white",
    priority: false,
  },
];

const businessHours = [
  { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM", open: true },
  { day: "Saturday", hours: "9:00 AM – 4:00 PM", open: true },
  { day: "Sunday", hours: "Closed", open: false },
];

const subjectOptions = [
  "Question about a product",
  "Help with my order",
  "Delivery & shipping",
  "Returns & refunds",
  "Gardening advice",
  "Bulk / wholesale order",
  "Other",
];

// ─── Field Component ──────────────────────────────────────────────────────────

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-base font-bold text-[#2a2a1e]">
      {label}
      {required && <span className="text-[#c0392b] ml-1">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full bg-white border-2 border-[#d4c9a8] focus:border-[#3d6b35] rounded-xl px-4 py-3.5 text-base text-[#2a2a1e] placeholder:text-[#b0a890] outline-none transition-colors";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    subject: subjectOptions[0],
    message: "",
  });
  const [formState, setFormState] = useState<FormState>("idle");

  const set = (k: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const isValid = form.name.trim() && form.phone.trim() && form.message.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setFormState("submitting");
    // Simulate API call — replace with real endpoint
    await new Promise((r) => setTimeout(r, 1500));
    setFormState("success");
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* ── Breadcrumb ─────────────────────────────── */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">Contact Us</span>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────── */}
      <div className="bg-[#3d6b35] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Get in Touch</p>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit leading-tight mb-4">
            We're Here to Help
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
            Whether you have a question about a product, need gardening advice, or want help with your order — our friendly team is just a call or message away.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* ── LEFT COLUMN (contact channels + hours + map) ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Contact channels */}
            <div>
              <h2 className="text-xl font-bold text-[#2a2a1e] mb-4">Reach Us Directly</h2>
              <div className="flex flex-col gap-4">
                {contactChannels.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <div
                      key={ch.id}
                      className="rounded-2xl border-2 p-5 transition-all duration-200"
                      style={{ backgroundColor: ch.bg, borderColor: ch.border }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: ch.iconBg }}
                        >
                          <Icon size={22} color={ch.iconColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#7a7a68] uppercase tracking-wide mb-0.5">
                            {ch.label}
                          </p>
                          <p className="text-xl font-black text-[#2a2a1e] leading-tight">
                            {ch.value}
                          </p>
                          <p className="text-sm text-[#5a5a48] mt-1">{ch.subtext}</p>
                        </div>
                      </div>
                      <a
                        href={ch.action}
                        target={ch.id === "whatsapp" ? "_blank" : undefined}
                        rel={ch.id === "whatsapp" ? "noopener noreferrer" : undefined}
                        className="mt-4 w-full flex items-center justify-center gap-2 font-bold text-base py-3 rounded-xl transition-all active:scale-[.98]"
                        style={{
                          backgroundColor: ch.iconBg,
                          color: ch.iconColor,
                        }}
                      >
                        <Icon size={18} />
                        {ch.actionLabel}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#eef5ea] flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-[#3d6b35]" />
                </div>
                <h2 className="text-lg font-bold text-[#2a2a1e]">Business Hours</h2>
              </div>
              <div className="flex flex-col gap-3">
                {businessHours.map(({ day, hours, open }) => (
                  <div
                    key={day}
                    className="flex items-center justify-between gap-4 py-3 border-b border-[#f0ece4] last:border-0"
                  >
                    <span className="text-base font-semibold text-[#3a3a2e]">{day}</span>
                    <span
                      className={`text-base font-bold ${
                        open ? "text-[#3d6b35]" : "text-[#c0392b]"
                      }`}
                    >
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 bg-[#eef5ea] border border-[#b8d4a0] rounded-xl px-4 py-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3d6b35] animate-pulse shrink-0" />
                <p className="text-sm font-semibold text-[#3d6b35]">
                  We're open right now — call us!
                </p>
              </div>
            </div>

            {/* Store Address */}
            <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#eef5ea] flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-[#3d6b35]" />
                </div>
                <h2 className="text-lg font-bold text-[#2a2a1e]">Our Store</h2>
              </div>
              <p className="text-base font-bold text-[#2a2a1e]">Kavin Organics</p>
              <p className="text-sm text-[#5a5a48] mt-1 leading-relaxed">
                No. 45, Market Road,<br />
                Thiruchengode — 637211,<br />
                Namakkal District, Tamil Nadu
              </p>
              <a
                href="https://maps.google.com/?q=Thiruchengode,Tamil+Nadu"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 bg-[#faf7f2] hover:bg-[#eef5ea] border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3d6b35] font-bold text-sm py-3 rounded-xl transition-all"
              >
                <MapPin size={16} />
                View on Google Maps
              </a>

              {/* Static map placeholder — replace with real embed */}
              <div className="mt-4 rounded-xl overflow-hidden border border-[#e8e0d0] bg-[#f0ece4] h-40 flex items-center justify-center">
                <iframe
                  title="Kavin Organics location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31385.78!2d77.893!3d11.476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9f0e5c3a3b3b3%3A0x1!2sThiruchengode%2C+Tamil+Nadu!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (inquiry form) ──────────── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden">
              {/* Form header */}
              <div className="bg-[#3d6b35] px-6 py-5">
                <h2 className="text-xl font-bold text-white">Send Us a Message</h2>
                <p className="text-white/75 text-sm mt-1">
                  Fill in the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              {formState === "success" ? (
                /* Success state */
                <div className="p-8 sm:p-10 flex flex-col items-center text-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-[#eef5ea] border-2 border-[#b8d4a0] flex items-center justify-center">
                    <Check size={36} className="text-[#3d6b35]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#2a2a1e] mb-2">Message Sent!</h3>
                    <p className="text-base text-[#5a5a48] leading-relaxed max-w-sm">
                      Thank you, {form.name.split(" ")[0] || "friend"}! We've received your message and will get back to you within 24 hours.
                    </p>
                  </div>
                  <div className="bg-[#faf7f2] border border-[#d4c9a8] rounded-2xl p-4 w-full max-w-sm text-left">
                    <p className="text-sm font-bold text-[#2a2a1e] mb-1">Need a faster response?</p>
                    <p className="text-sm text-[#5a5a48]">Call or WhatsApp us at</p>
                    <a href="tel:+919876543210" className="text-lg font-black text-[#3d6b35] hover:underline">
                      +91 98765 43210
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      setFormState("idle");
                      setForm({ name: "", phone: "", email: "", subject: subjectOptions[0], message: "" });
                    }}
                    className="text-sm font-semibold text-[#3d6b35] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-5">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Your Name" required>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Meenakshi Rajan"
                        value={form.name}
                        onChange={set("name")}
                      />
                    </Field>
                    <Field label="Phone Number" required>
                      <input
                        type="tel"
                        className={inputClass}
                        placeholder="e.g. 98765 43210"
                        value={form.phone}
                        onChange={set("phone")}
                      />
                    </Field>
                  </div>

                  <Field label="Email Address">
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="your@email.com (optional)"
                      value={form.email}
                      onChange={set("email")}
                    />
                  </Field>

                  <Field label="What is your question about?" required>
                    <div className="relative">
                      <select
                        className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                        value={form.subject}
                        onChange={set("subject")}
                      >
                        {subjectOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronRight
                        size={18}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-[#7a7a68] pointer-events-none"
                      />
                    </div>
                  </Field>

                  <Field label="Your Message" required>
                    <textarea
                      className={`${inputClass} resize-none`}
                      rows={5}
                      placeholder="Tell us how we can help you. Please be as detailed as you like — the more you share, the better we can assist you."
                      value={form.message}
                      onChange={set("message")}
                    />
                  </Field>

                  {/* Tip box */}
                  <div className="flex items-start gap-3 bg-[#faf7f2] border border-[#d4c9a8] rounded-xl p-4">
                    <span className="text-xl shrink-0">💡</span>
                    <p className="text-sm text-[#5a5a48] leading-relaxed">
                      <span className="font-bold text-[#2a2a1e]">Prefer to speak to someone? </span>
                      Call us at <a href="tel:+919876543210" className="font-bold text-[#3d6b35] hover:underline">+91 98765 43210</a> — we're happy to help over the phone.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || formState === "submitting"}
                    className={`w-full flex items-center justify-center gap-3 font-bold text-lg py-4 rounded-xl transition-all active:scale-[.98] shadow-md ${
                      !isValid
                        ? "bg-[#a8c890] text-white cursor-not-allowed"
                        : formState === "submitting"
                          ? "bg-[#3d6b35] text-white opacity-80 cursor-wait"
                          : "bg-[#3d6b35] hover:bg-[#2e5228] text-white"
                    }`}
                  >
                    {formState === "submitting" ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending your message…
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-xs text-[#a8a090] text-center">
                    Your information is kept private and will only be used to respond to your enquiry.
                  </p>
                </form>
              )}
            </div>

            {/* Quick links below form */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Frequently Asked Questions", href: "/faq", desc: "Quick answers to common questions", icon: "❓" },
                { label: "Shipping & Delivery", href: "/shipping", desc: "Delivery times, charges & areas", icon: "🚚" },
                { label: "Returns & Refunds", href: "/returns", desc: "Our easy 7-day return policy", icon: "↩️" },
                { label: "Browse Products", href: "/shop", desc: "Seeds, pots, fertilizers & more", icon: "🌿" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-start gap-4 bg-white rounded-2xl border border-[#e8e0d0] hover:border-[#b8d4a0] hover:shadow-sm p-4 transition-all group"
                >
                  <span className="text-2xl shrink-0">{link.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#2a2a1e] group-hover:text-[#3d6b35] transition-colors">
                      {link.label}
                    </p>
                    <p className="text-xs text-[#7a7a68] mt-0.5">{link.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#b0a890] shrink-0 mt-0.5 group-hover:text-[#3d6b35] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}