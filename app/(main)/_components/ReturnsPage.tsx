import Link from "next/link";
import { ChevronRight, RotateCcw, Phone, CheckCircle, Clock, ShieldCheck } from "lucide-react";

const steps = [
  { num: "1", title: "Call or message us", desc: 'Contact us within 7 days of delivery. Call +91 98765 43210 or WhatsApp us. Have your Order ID ready — it\'s in your order confirmation message.' },
  { num: "2", title: "We arrange pickup", desc: "We will arrange for our delivery partner to collect the item from your home. You don't need to travel anywhere or find a courier." },
  { num: "3", title: "Item is inspected", desc: "Once we receive the returned item, our team inspects it within 1 business day." },
  { num: "4", title: "Refund is processed", desc: "Your refund is issued within 3–5 business days — back to your original payment method, or via UPI/bank transfer for COD orders." },
];

const eligible = [
  "Product is defective or damaged on arrival",
  "Wrong product was delivered",
  "Product is significantly different from the description",
  "Sealed product was received open or tampered",
  "You changed your mind (within 7 days, product unused and in original packaging)",
];

const notEligible = [
  "Products returned after 7 days of delivery",
  "Used products (other than defective)",
  "Seeds where poor germination is due to growing conditions, not seed quality",
  "Products without original packaging",
  "Perishable or opened soil media (unless defective)",
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">Returns & Refunds</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#3d6b35] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <RotateCcw size={20} className="text-white" />
            </div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Returns Policy</p>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit leading-tight mb-4">
            Returns & Refunds
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
            Your happiness matters to us. If something is not right with your order, we will fix it — simply and quickly.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col gap-8">

        {/* Key promise */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "📅", title: "7-Day Returns", desc: "Return any product within 7 days of delivery." },
            { icon: "🏠", title: "We Pick It Up", desc: "Our courier collects from your home — no hassle." },
            { icon: "💰", title: "Full Refund", desc: "You get 100% of what you paid — no deductions." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl p-5 text-center">
              <div className="text-3xl mb-3">{icon}</div>
              <p className="text-lg font-bold text-[#2a2a1e] mb-1">{title}</p>
              <p className="text-sm text-[#5a5a48] leading-snug">{desc}</p>
            </div>
          ))}
        </div>

        {/* How to return */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
          <h2 className="text-xl font-bold text-[#2a2a1e] mb-6">How to Return a Product</h2>
          <div className="flex flex-col gap-5">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#3d6b35] text-white font-black text-base flex items-center justify-center">
                    {step.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="absolute left-1/2 top-10 w-0.5 h-5 bg-[#b8d4a0] -translate-x-1/2" />
                  )}
                </div>
                <div className="flex-1 pt-1.5">
                  <p className="text-base font-bold text-[#2a2a1e]">{step.title}</p>
                  <p className="text-sm sm:text-base text-[#5a5a48] mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href="tel:+919876543210" className="flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-base px-6 py-3.5 rounded-xl transition-colors">
              <Phone size={18} />
              Call to Start a Return
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white hover:bg-[#faf7f2] border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3d6b35] font-bold text-base px-6 py-3.5 rounded-xl transition-colors">
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Refund timing */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#eef5ea] flex items-center justify-center shrink-0">
              <Clock size={20} className="text-[#3d6b35]" />
            </div>
            <h2 className="text-xl font-bold text-[#2a2a1e]">When Will I Get My Refund?</h2>
          </div>
          <div className="flex flex-col gap-4 text-base sm:text-lg text-[#3a3a2e] leading-relaxed">
            <p>Once we receive your returned item, we inspect it and process your refund within <strong className="text-[#2a2a1e]">3 to 5 business days</strong>.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#faf7f2] border border-[#e8e0d0] rounded-xl p-4">
                <p className="text-base font-bold text-[#2a2a1e] mb-1">Online payment (UPI, Card)</p>
                <p className="text-sm text-[#5a5a48] leading-snug">Refund goes back to the same payment method used at checkout. Usually takes 3–5 working days to appear.</p>
              </div>
              <div className="bg-[#faf7f2] border border-[#e8e0d0] rounded-xl p-4">
                <p className="text-base font-bold text-[#2a2a1e] mb-1">Cash on Delivery orders</p>
                <p className="text-sm text-[#5a5a48] leading-snug">Refund is sent to your bank account or UPI ID. We will ask for your details when you contact us.</p>
              </div>
            </div>
          </div>
        </div>

        {/* What can / cannot be returned */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={20} className="text-[#3d6b35]" />
              <h2 className="text-lg font-bold text-[#2a2a1e]">What Can Be Returned</h2>
            </div>
            <ul className="flex flex-col gap-3">
              {eligible.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-[#3d6b35] shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-[#3a3a2e] leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">⚠️</span>
              <h2 className="text-lg font-bold text-[#2a2a1e]">What Cannot Be Returned</h2>
            </div>
            <ul className="flex flex-col gap-3">
              {notEligible.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-4 h-4 shrink-0 mt-0.5 text-[#c0392b] text-base leading-none">✕</span>
                  <span className="text-sm sm:text-base text-[#3a3a2e] leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Damaged / wrong product */}
        <div className="bg-[#fff8ee] border border-[#f0d080] rounded-2xl p-5 sm:p-6">
          <p className="text-lg font-bold text-[#7a5c1e] mb-3">Received a damaged or wrong product?</p>
          <p className="text-base text-[#7a5c1e] leading-relaxed mb-4">
            We are very sorry if that happened. Please take a clear photo of the product and call or WhatsApp us at <strong>+91 98765 43210</strong> within <strong>48 hours of delivery</strong>. We will immediately arrange a free replacement — no questions asked.
          </p>
          <a href="tel:+919876543210" className="inline-flex items-center gap-2 text-base font-bold text-[#7a5c1e] hover:underline">
            <Phone size={16} />
            Call +91 98765 43210
          </a>
        </div>

        {/* Seed note */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
          <h2 className="text-lg font-bold text-[#2a2a1e] mb-3">A Note on Seeds</h2>
          <p className="text-base sm:text-lg text-[#3a3a2e] leading-relaxed">
            Seeds are living products and their germination depends on growing conditions — soil quality, water, sunlight, temperature, and care. We cannot guarantee germination in all conditions, but we do guarantee that every seed packet we sell is fresh and from a trusted source.
          </p>
          <p className="text-base sm:text-lg text-[#3a3a2e] leading-relaxed mt-4">
            If you believe a seed batch was genuinely defective, please contact us and we will assess it fairly. We always err on the side of our customers.
          </p>
        </div>

        {/* Related links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Shipping & Delivery", href: "/shipping", desc: "Delivery times and charges", icon: "🚚" },
            { label: "FAQs", href: "/faq", desc: "Return & refund questions", icon: "❓" },
            { label: "Contact Us", href: "/contact", desc: "Talk to our team directly", icon: "📞" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="flex items-start gap-3 bg-white rounded-2xl border border-[#e8e0d0] hover:border-[#b8d4a0] hover:shadow-sm p-4 transition-all group">
              <span className="text-2xl shrink-0">{link.icon}</span>
              <div>
                <p className="text-sm font-bold text-[#2a2a1e] group-hover:text-[#3d6b35] transition-colors">{link.label}</p>
                <p className="text-xs text-[#7a7a68] mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}