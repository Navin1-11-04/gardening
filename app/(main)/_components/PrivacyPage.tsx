import Link from "next/link";
import { ChevronRight, ShieldCheck, Phone, Mail, Lock } from "lucide-react";

const sections = [
  {
    id: "collect",
    title: "What Information We Collect",
    content: [
      "When you place an order, we collect your name, phone number, delivery address, and payment information. We need this to deliver your order and contact you if needed.",
      "If you contact us by phone, WhatsApp, or email, we may keep a record of your message to help us serve you better.",
      "We do not collect any information you haven't given us directly. We do not use cookies to track you across the internet.",
    ],
  },
  {
    id: "use",
    title: "How We Use Your Information",
    content: [
      "To process and deliver your orders.",
      "To contact you about your order — for example, to confirm delivery or let you know if there is a delay.",
      "To send gardening tips and offers by phone or email, if you have subscribed to our newsletter. You can unsubscribe at any time.",
      "To improve our products and service based on customer feedback.",
      "We will never sell your information to anyone, ever.",
    ],
  },
  {
    id: "share",
    title: "Who We Share Your Information With",
    content: [
      "We share your name, phone number, and delivery address with our delivery partners so they can bring your order to you.",
      "We use a trusted payment provider to process payments. We do not store your card details — these go directly to the payment provider.",
      "We do not share your information with any marketing companies, data brokers, or third parties for any other purpose.",
    ],
  },
  {
    id: "safe",
    title: "How We Keep Your Information Safe",
    content: [
      "Our website uses SSL encryption, which means any information you send us is protected in transit.",
      "Access to customer information is restricted to Kavin Organics team members who need it to do their job.",
      "We do not store unnecessary data and regularly review what we hold.",
    ],
  },
  {
    id: "rights",
    title: "Your Rights",
    content: [
      "You can ask us at any time what information we hold about you.",
      "You can ask us to correct any information that is wrong.",
      "You can ask us to delete your information from our records.",
      "You can unsubscribe from our newsletter at any time by calling us or sending us a message.",
      "To exercise any of these rights, simply call or message us at the contact details below.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    content: [
      "We use only essential cookies that are needed to make our website work — for example, to remember what's in your cart.",
      "We do not use advertising cookies or tracking cookies. We do not use Google Analytics or similar tools to track individual visitors.",
    ],
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    content: [
      "By using our website or placing an order, you agree to the following terms.",
      "All prices are shown in Indian Rupees (₹) and include applicable taxes. We reserve the right to change prices without prior notice, but the price shown at the time of your order is the price you pay.",
      "We make every effort to describe our products accurately. If a product arrives significantly different from its description, you may return it under our Returns Policy.",
      "Orders are subject to availability. If a product goes out of stock after you place your order, we will contact you immediately and offer a full refund or an alternative.",
      "We reserve the right to cancel any order at our discretion. If we cancel your order, you will receive a full refund.",
      "We are not liable for any indirect loss or damage arising from the use of our products. Our liability is limited to the value of the products purchased.",
      "These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of courts in Namakkal, Tamil Nadu.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: [
      "We may update this privacy policy from time to time. When we do, we will update the date at the bottom of this page.",
      "If there are significant changes, we will let our customers know by phone or email.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#7a7a68] hover:text-[#3d6b35] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-[#b0a890]" />
          <span className="text-[#2a2a1e] font-medium">Privacy Policy & Terms</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#3d6b35] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Lock size={20} className="text-white" />
            </div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Legal</p>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit leading-tight mb-4">
            Privacy Policy & Terms
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
            We believe in plain, simple language. This page explains exactly what we do with your information and our terms of service — in plain English, not legal jargon.
          </p>
          <p className="text-white/60 text-sm mt-4">Last updated: March 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Table of contents — sticky on desktop */}
          <aside className="w-full lg:w-56 shrink-0 lg:sticky lg:top-28">
            <p className="text-xs font-bold text-[#7a7a68] uppercase tracking-wider mb-3">Jump to section</p>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="shrink-0 lg:shrink text-sm font-semibold text-[#5a5a48] hover:text-[#3d6b35] px-3 py-2.5 rounded-xl hover:bg-[#eef5ea] transition-all whitespace-nowrap lg:whitespace-normal"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* Plain language promise */}
            <div className="bg-[#eef5ea] border border-[#b8d4a0] rounded-2xl p-5 flex items-start gap-4">
              <ShieldCheck size={22} className="text-[#3d6b35] shrink-0 mt-0.5" />
              <div>
                <p className="text-base font-bold text-[#2a2a1e]">Our simple promise to you</p>
                <p className="text-sm sm:text-base text-[#5a5a48] mt-1 leading-relaxed">
                  We will never sell your personal information to anyone. We only collect what we need to process your order and provide good service. That's it.
                </p>
              </div>
            </div>

            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="bg-white rounded-2xl border border-[#e8e0d0] p-5 sm:p-6 scroll-mt-32"
              >
                <h2 className="text-xl font-bold text-[#2a2a1e] mb-4 pb-3 border-b border-[#f0ece4]">
                  {section.title}
                </h2>
                <ul className="flex flex-col gap-4">
                  {section.content.map((para, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3d6b35] shrink-0 mt-2.5" />
                      <p className="text-base sm:text-lg text-[#3a3a2e] leading-relaxed">{para}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact for privacy */}
            <div className="bg-[#faf7f2] border border-[#d4c9a8] rounded-2xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#2a2a1e] mb-3">Questions About Your Privacy?</h2>
              <p className="text-base text-[#5a5a48] mb-5 leading-relaxed">
                If you have any questions about how we use your information, or if you'd like to see, change, or delete your data — please contact us. We're happy to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="tel:+919876543210" className="flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#335c2c] text-white font-bold text-base px-6 py-3.5 rounded-xl transition-colors">
                  <Phone size={18} />
                  +91 98765 43210
                </a>
                <a href="mailto:hello@kavinorganics.in" className="flex items-center justify-center gap-2 bg-white hover:bg-[#faf7f2] border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3d6b35] font-bold text-base px-6 py-3.5 rounded-xl transition-colors">
                  <Mail size={18} />
                  hello@kavinorganics.in
                </a>
              </div>
              <p className="text-xs text-[#a8a090] mt-4">
                Kavin Organics · No. 45, Market Road, Thiruchengode — 637211, Namakkal District, Tamil Nadu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}