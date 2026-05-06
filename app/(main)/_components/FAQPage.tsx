"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight, ChevronDown, ChevronUp,
  Search, Phone, MessageSquare, Leaf, RefreshCw,
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQGroup {
  id: string;
  emoji: string;
  label: string;
  faqs: FAQ[];
}

// Fallback static data
const FALLBACK_GROUPS: FAQGroup[] = [
  {
    id: "ordering", emoji: "🛒", label: "Ordering & Payment",
    faqs: [
      { id: "o1", question: "How do I place an order?", answer: "It is very easy! Browse our products, tap 'Add to Cart' on any product you like, then tap 'Proceed to Checkout'. Enter your delivery address, choose how you want to pay, and confirm your order." },
      { id: "o2", question: "What payment methods do you accept?", answer: "We accept Cash on Delivery, UPI (GPay, PhonePe, Paytm), Credit & Debit Cards, and Net Banking. Cash on Delivery is available on all orders." },
      { id: "o3", question: "Can I pay cash when the order is delivered?", answer: "Yes! Cash on Delivery is available for all orders. Simply choose 'Cash on Delivery' at checkout." },
      { id: "o4", question: "Can I change or cancel my order after placing it?", answer: "You can cancel or change your order within 2 hours of placing it. Please call us at +91 98765 43210 as soon as possible." },
      { id: "o5", question: "I need help placing my order. Can someone assist me?", answer: "Of course! Just call us at +91 98765 43210 (Mon–Sat, 9am–6pm) and one of our friendly team members will walk you through the order process step by step." },
    ],
  },
  {
    id: "delivery", emoji: "🚚", label: "Delivery & Shipping",
    faqs: [
      { id: "d1", question: "How long does delivery take?", answer: "Most orders are delivered within 2 to 4 business days. For locations in Namakkal and nearby areas, delivery is often done the next day." },
      { id: "d2", question: "How much does delivery cost?", answer: "Delivery is FREE on all orders above ₹999. For orders below ₹999, a small delivery charge of ₹79 applies." },
      { id: "d3", question: "Which areas do you deliver to?", answer: "We currently deliver across Tamil Nadu and most major cities in South India. Enter your pincode at checkout to confirm." },
      { id: "d4", question: "Will I be called before delivery?", answer: "Yes! Our delivery partner will always call you before arriving." },
      { id: "d5", question: "Can I track my order?", answer: "Yes. Once your order is shipped, we will send the tracking details to your phone number. You can also call us with your Order ID." },
    ],
  },
  {
    id: "returns", emoji: "↩️", label: "Returns & Refunds",
    faqs: [
      { id: "r1", question: "Can I return a product if I am not happy with it?", answer: "Yes! We have a simple 7-day return policy. If you are not satisfied with your purchase for any reason, contact us within 7 days of delivery." },
      { id: "r2", question: "How do I return a product?", answer: "Simply call us at +91 98765 43210 within 7 days of delivery. We will arrange for our delivery partner to pick up the item from your home." },
      { id: "r3", question: "How long does it take to get a refund?", answer: "Once we receive the returned item, your refund will be processed within 3 to 5 business days." },
      { id: "r4", question: "What if I received a damaged or wrong product?", answer: "Please take a photo of the product and call or WhatsApp us at +91 98765 43210 within 48 hours. We will immediately send you a replacement at no extra cost." },
    ],
  },
  {
    id: "gardening", emoji: "🪴", label: "Gardening Help",
    faqs: [
      { id: "g1", question: "I am a beginner. Where do I start?", answer: "Welcome to gardening! We recommend starting with easy-to-grow vegetables like tomatoes, chilies, and spinach. Call us and we will suggest the perfect beginner kit for your space." },
      { id: "g2", question: "Can I garden on a small balcony?", answer: "Absolutely! Balcony gardening is perfect for small spaces. Grow bags are ideal for balconies — lightweight, don't take much space, and work great for tomatoes, chilies, herbs, and leafy greens." },
      { id: "g3", question: "How much water do plants need?", answer: "A simple rule: water when the top 1 inch of soil feels dry to your finger. Most vegetable plants need watering every 1 to 2 days in summer." },
    ],
  },
];

const FAQItem = ({
  faq, isOpen, onToggle,
}: {
  faq: FAQ; isOpen: boolean; onToggle: () => void;
}) => (
  <div className={`border-b border-[#e8e0d0] last:border-0 transition-colors ${isOpen ? "bg-[#faf7f2]" : ""}`}>
    <button
      onClick={onToggle}
      className="w-full flex items-start justify-between gap-4 px-5 sm:px-6 py-5 text-left hover:bg-[#faf7f2] transition-colors"
      aria-expanded={isOpen}
    >
      <span className={`text-base sm:text-lg font-bold leading-snug transition-colors ${isOpen ? "text-[#3d6b35]" : "text-[#2a2a1e]"}`}>
        {faq.question}
      </span>
      <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? "bg-[#3d6b35] text-white" : "bg-[#f0ece4] text-[#7a7a68]"}`}>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </span>
    </button>
    {isOpen && (
      <div className="px-5 sm:px-6 pb-5">
        <p className="text-base sm:text-lg text-[#3a3a2e] leading-relaxed">{faq.answer}</p>
        {faq.answer.includes("+91 98765 43210") && (
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-2 mt-4 bg-[#eef5ea] hover:bg-[#3d6b35] hover:text-white text-[#3d6b35] border border-[#b8d4a0] hover:border-[#3d6b35] font-bold text-sm px-4 py-2.5 rounded-xl transition-all"
          >
            <Phone size={15} />
            Call +91 98765 43210
          </a>
        )}
      </div>
    )}
  </div>
);

export default function FAQPage() {
  const [groups,      setGroups]      = useState<FAQGroup[]>(FALLBACK_GROUPS);
  const [loadingContent, setLoadingContent] = useState(true);
  const [openId,      setOpenId]      = useState<string | null>("o1");
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch FAQ content from admin content API
  useEffect(() => {
    fetch("/api/content/faq")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.groups?.length) {
          setGroups(data.groups);
        }
      })
      .catch(() => {/* use fallback */})
      .finally(() => setLoadingContent(false));
  }, []);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return groups
      .filter((g) => activeGroup === "all" || g.id === activeGroup)
      .map((g) => ({
        ...g,
        faqs: g.faqs.filter(
          (f) => !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.faqs.length > 0);
  }, [activeGroup, searchQuery, groups]);

  const totalResults = filteredGroups.reduce((s, g) => s + g.faqs.length, 0);

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">FAQs</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#3d6b35] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Help Centre</p>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit leading-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed mb-8">
            Find answers to common questions. Can't find what you need? We're just a call away.
          </p>
          {/* Search bar */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 max-w-xl shadow-md">
            <Search size={22} className="text-[#7a9e5f] shrink-0" />
            <input
              type="text"
              placeholder="Search your question here..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setActiveGroup("all"); }}
              className="flex-1 bg-transparent outline-none text-base text-[#2a2a1e] placeholder:text-[#b0a890]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-[#a8a090] hover:text-[#3d6b35] text-sm font-semibold shrink-0">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* LEFT: Category nav */}
          <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-28">
            <h2 className="text-sm font-bold text-[#7a7a68] uppercase tracking-wider mb-3">Browse by Topic</h2>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
              <button
                onClick={() => { setActiveGroup("all"); setSearchQuery(""); }}
                className={`flex items-center gap-2.5 shrink-0 lg:shrink px-4 py-3 rounded-xl text-sm font-bold transition-all text-left w-full ${
                  activeGroup === "all" && !searchQuery ? "bg-[#3d6b35] text-white shadow-sm" : "bg-white border border-[#e8e0d0] text-[#5a5a48] hover:border-[#3d6b35] hover:text-[#3d6b35]"
                }`}
              >
                <span className="text-base">📋</span>
                <span className="whitespace-nowrap">All Questions</span>
                <span className="ml-auto text-xs opacity-70 hidden lg:inline">
                  {groups.reduce((s, g) => s + g.faqs.length, 0)}
                </span>
              </button>
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { setActiveGroup(g.id); setSearchQuery(""); }}
                  className={`flex items-center gap-2.5 shrink-0 lg:shrink px-4 py-3 rounded-xl text-sm font-bold transition-all text-left w-full ${
                    activeGroup === g.id && !searchQuery ? "bg-[#3d6b35] text-white shadow-sm" : "bg-white border border-[#e8e0d0] text-[#5a5a48] hover:border-[#3d6b35] hover:text-[#3d6b35]"
                  }`}
                >
                  <span className="text-base">{g.emoji}</span>
                  <span className="whitespace-nowrap">{g.label}</span>
                  <span className="ml-auto text-xs opacity-70 hidden lg:inline">{g.faqs.length}</span>
                </button>
              ))}
            </div>

            <div className="hidden lg:block mt-6 bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl p-5">
              <p className="text-base font-bold text-[#2a2a1e] mb-1">Still have questions?</p>
              <p className="text-sm text-[#5a5a48] mb-4 leading-snug">Our team is happy to help you directly.</p>
              <a href="tel:+919876543210" className="flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-sm py-3 rounded-xl transition-colors mb-2">
                <Phone size={16} />Call Us Now
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white hover:bg-[#f5f0ea] border border-[#b8d4a0] text-[#3d6b35] font-bold text-sm py-3 rounded-xl transition-colors"
              >
                <MessageSquare size={16} />WhatsApp Us
              </a>
            </div>
          </div>

          {/* RIGHT: FAQ accordion */}
          <div className="flex-1 min-w-0">
            {loadingContent && (
              <div className="flex items-center gap-2 text-sm text-[#7a9e6a] mb-4">
                <RefreshCw size={14} className="animate-spin" />Loading latest FAQs…
              </div>
            )}

            {searchQuery && (
              <div className="mb-5 flex items-center gap-2">
                <Search size={16} className="text-[#7a9e5f]" />
                <p className="text-base text-[#5a5a48]">
                  <span className="font-bold text-[#2a2a1e]">{totalResults}</span> result{totalResults !== 1 ? "s" : ""} for "{searchQuery}"
                </p>
              </div>
            )}

            {filteredGroups.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e8e0d0] p-10 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#2a2a1e] mb-2">No results found</h3>
                <p className="text-base text-[#7a7a68] mb-6 max-w-sm mx-auto">
                  We couldn't find an answer for "{searchQuery}". Try different words or contact us directly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="tel:+919876543210" className="flex items-center justify-center gap-2 bg-[#3d6b35] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#335c2c] transition-colors">
                    <Phone size={16} />Call Us
                  </a>
                  <button onClick={() => setSearchQuery("")} className="flex items-center justify-center gap-2 bg-white border-2 border-[#d4c9a8] text-[#5a5a48] font-bold px-6 py-3 rounded-xl hover:border-[#3d6b35] hover:text-[#3d6b35] transition-colors">
                    Clear Search
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden">
                    <div className="flex items-center gap-3 px-5 sm:px-6 py-4 bg-[#faf7f2] border-b border-[#e8e0d0]">
                      <span className="text-2xl">{group.emoji}</span>
                      <h2 className="text-lg font-bold text-[#2a2a1e]">{group.label}</h2>
                      <span className="ml-auto text-sm font-semibold text-[#7a9e5f] bg-[#eef5ea] px-2.5 py-0.5 rounded-full">
                        {group.faqs.length}
                      </span>
                    </div>
                    {group.faqs.map((faq) => (
                      <FAQItem
                        key={faq.id}
                        faq={faq}
                        isOpen={openId === faq.id}
                        onToggle={() => toggle(faq.id)}
                      />
                    ))}
                  </div>
                ))}

                <div className="bg-[#3d6b35] rounded-2xl p-6 sm:p-8 text-white text-center">
                  <p className="text-xl font-bold mb-2">Didn't find your answer?</p>
                  <p className="text-white/75 text-base mb-6 max-w-md mx-auto">
                    Our garden experts are happy to help with any question.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="tel:+919876543210" className="flex items-center justify-center gap-2 bg-white text-[#3d6b35] font-bold text-base px-6 py-3.5 rounded-xl hover:bg-[#f0f0f0] transition-colors">
                      <Phone size={18} />Call +91 98765 43210
                    </a>
                    <Link href="/contact" className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-base px-6 py-3.5 rounded-xl transition-colors">
                      <MessageSquare size={18} />Send a Message
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}