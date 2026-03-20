import Link from "next/link";
import { ChevronRight, Truck, Clock, MapPin, Phone, Package, CheckCircle } from "lucide-react";

const deliveryZones = [
  { zone: "Namakkal & nearby towns", time: "Next day", fee: "FREE above ₹999" },
  { zone: "Erode, Salem, Dharmapuri", time: "1–2 days", fee: "FREE above ₹999" },
  { zone: "Coimbatore, Trichy, Madurai", time: "2–3 days", fee: "FREE above ₹999" },
  { zone: "Chennai, Other Tamil Nadu", time: "2–4 days", fee: "FREE above ₹999" },
  { zone: "Other South India", time: "3–5 days", fee: "FREE above ₹999" },
];

const steps = [
  { icon: "📦", title: "Order placed", desc: "You place your order online or by phone. We confirm it immediately." },
  { icon: "✅", title: "Order packed", desc: "We carefully pack your items the same day or the next morning." },
  { icon: "🚚", title: "Shipped out", desc: "Your order is handed to our delivery partner with tracking details." },
  { icon: "📞", title: "Delivery call", desc: "Our delivery partner will call you before arriving at your address." },
  { icon: "🌿", title: "Delivered!", desc: "Your garden supplies arrive safely at your doorstep." },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">Shipping & Delivery</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#3d6b35] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Truck size={20} className="text-white" />
            </div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Delivery Information</p>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit leading-tight mb-4">
            Shipping & Delivery
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
            We deliver fresh garden supplies right to your doorstep across Tamil Nadu and South India. Here's everything you need to know.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col gap-8">

        {/* Key facts — quick summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Truck, title: "Free Delivery", desc: "On all orders above ₹999. No hidden charges." },
            { icon: Clock, title: "Fast Dispatch", desc: "Same day or next morning — we don't delay." },
            { icon: Phone, title: "Delivery Call", desc: "Our partner always calls before arriving." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-[#e8e0d0] p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#eef5ea] flex items-center justify-center shrink-0">
                <Icon size={20} className="text-[#3d6b35]" />
              </div>
              <div>
                <p className="text-base font-bold text-[#2a2a1e]">{title}</p>
                <p className="text-sm text-[#5a5a48] mt-0.5 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery charges */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden">
          <div className="bg-[#3d6b35] px-5 sm:px-6 py-4">
            <h2 className="text-xl font-bold text-white">Delivery Charges</h2>
          </div>
          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div className="bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl p-5">
                <p className="text-2xl font-black text-[#3d6b35] mb-1">FREE</p>
                <p className="text-base font-bold text-[#2a2a1e]">Orders above ₹999</p>
                <p className="text-sm text-[#5a5a48] mt-1 leading-snug">No delivery charge at all. Just place your order and we'll take care of the rest.</p>
              </div>
              <div className="bg-[#faf7f2] border border-[#d4c9a8] rounded-2xl p-5">
                <p className="text-2xl font-black text-[#2a2a1e] mb-1">₹79</p>
                <p className="text-base font-bold text-[#2a2a1e]">Orders below ₹999</p>
                <p className="text-sm text-[#5a5a48] mt-1 leading-snug">A small flat charge of ₹79 applies. You can always add more items to get free delivery!</p>
              </div>
            </div>
            <div className="bg-[#fff8ee] border border-[#f0d080] rounded-xl p-4 text-sm text-[#7a5c1e] leading-relaxed">
              💡 <strong>Tip:</strong> Add items worth ₹999 or more to your cart to unlock free delivery. This is shown clearly in your cart before checkout.
            </div>
          </div>
        </div>

        {/* Delivery times by zone */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden">
          <div className="bg-[#3d6b35] px-5 sm:px-6 py-4">
            <h2 className="text-xl font-bold text-white">Delivery Times by Area</h2>
          </div>
          <div className="divide-y divide-[#f0ece4]">
            <div className="grid grid-cols-3 px-5 sm:px-6 py-3 bg-[#faf7f2]">
              <p className="text-xs font-bold text-[#7a7a68] uppercase tracking-wide">Area</p>
              <p className="text-xs font-bold text-[#7a7a68] uppercase tracking-wide">Delivery time</p>
              <p className="text-xs font-bold text-[#7a7a68] uppercase tracking-wide">Delivery fee</p>
            </div>
            {deliveryZones.map(({ zone, time, fee }) => (
              <div key={zone} className="grid grid-cols-3 px-5 sm:px-6 py-4 items-center">
                <p className="text-sm sm:text-base font-semibold text-[#2a2a1e] pr-3">{zone}</p>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#3d6b35] shrink-0" />
                  <p className="text-sm sm:text-base font-bold text-[#3d6b35]">{time}</p>
                </div>
                <p className="text-sm sm:text-base text-[#5a5a48]">{fee}</p>
              </div>
            ))}
          </div>
          <div className="px-5 sm:px-6 py-4 bg-[#faf7f2] border-t border-[#e8e0d0]">
            <p className="text-sm text-[#5a5a48]">
              Delivery times are estimated from the date your order is dispatched. We deliver on all days except Sundays and public holidays.
            </p>
          </div>
        </div>

        {/* How delivery works */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
          <h2 className="text-xl font-bold text-[#2a2a1e] mb-6">How Your Delivery Works</h2>
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[#faf7f2] border border-[#e8e0d0] flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="absolute left-1/2 top-12 w-0.5 h-4 bg-[#d4c9a8] -translate-x-1/2" />
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-base font-bold text-[#2a2a1e]">{step.title}</p>
                  <p className="text-sm sm:text-base text-[#5a5a48] mt-0.5 leading-snug">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
          <h2 className="text-xl font-bold text-[#2a2a1e] mb-4">Tracking Your Order</h2>
          <div className="flex flex-col gap-4 text-base sm:text-lg text-[#3a3a2e] leading-relaxed">
            <p>Once your order is dispatched, we will send the tracking details to your phone number by SMS. You can use this to check where your order is at any time.</p>
            <p>You can also call us at any time with your <strong className="text-[#2a2a1e]">Order ID</strong> (shown in your order confirmation) and we will give you a full update on your delivery.</p>
          </div>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <a href="tel:+919876543210" className="flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-base px-6 py-3.5 rounded-xl transition-colors">
              <Phone size={18} />
              Call for an Update
            </a>
            <Link href="/faq" className="flex items-center justify-center gap-2 bg-white hover:bg-[#faf7f2] border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3d6b35] font-bold text-base px-6 py-3.5 rounded-xl transition-colors">
              Delivery FAQs
            </Link>
          </div>
        </div>

        {/* Packaging */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#eef5ea] flex items-center justify-center shrink-0">
              <Package size={20} className="text-[#3d6b35]" />
            </div>
            <h2 className="text-xl font-bold text-[#2a2a1e]">How We Pack Your Order</h2>
          </div>
          <div className="flex flex-col gap-3 text-base sm:text-lg text-[#3a3a2e] leading-relaxed">
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-[#3d6b35] shrink-0 mt-1" />
              <p>Seeds are packed in airtight, moisture-proof pouches to protect germination quality.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-[#3d6b35] shrink-0 mt-1" />
              <p>Pots and terracotta items are wrapped in bubble wrap and placed in sturdy boxes.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-[#3d6b35] shrink-0 mt-1" />
              <p>Fertilizers and soil media are securely sealed to prevent any leakage.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-[#3d6b35] shrink-0 mt-1" />
              <p>If any item arrives damaged due to transit, we will replace it free of charge — just call us within 48 hours.</p>
            </div>
          </div>
        </div>

        {/* Pincode note */}
        <div className="bg-[#fff8ee] border border-[#f0d080] rounded-2xl p-5 sm:p-6">
          <p className="text-base font-bold text-[#7a5c1e] mb-2">Don't see your area above?</p>
          <p className="text-base text-[#7a5c1e] leading-relaxed">
            We are expanding delivery coverage regularly. Enter your pincode at checkout to check if we deliver to your area. If we can't deliver to your location yet, please call us — we will try our best to arrange delivery for you.
          </p>
          <a href="tel:+919876543210" className="inline-flex items-center gap-2 mt-4 text-base font-bold text-[#7a5c1e] hover:underline">
            <Phone size={16} />
            +91 98765 43210
          </a>
        </div>

        {/* Related links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Returns & Refunds", href: "/returns", desc: "Our easy 7-day return policy", icon: "↩️" },
            { label: "FAQs", href: "/faq", desc: "Common delivery questions", icon: "❓" },
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