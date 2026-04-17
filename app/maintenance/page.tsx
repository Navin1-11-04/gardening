import Link from "next/link";
import { Leaf, Phone, Mail } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#1e3d18] flex flex-col items-center justify-center px-4 text-center">
      {/* Background texture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#3d6b35] opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#7ab648] opacity-15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-lg w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#7ab648] rounded-2xl flex items-center justify-center mb-4 shadow-2xl shadow-[#7ab648]/30">
            <Leaf size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">KAVIN</h1>
          <p className="text-[#7ab648] font-bold tracking-[0.3em] text-sm mt-0.5">ORGANICS</p>
        </div>

        {/* Message */}
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-10 backdrop-blur-sm">
          <div className="text-5xl mb-6">🌱</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
            We'll be back soon!
          </h2>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-6">
            Our store is currently undergoing some maintenance. We're working hard to get everything ready for you.
          </p>
          <div className="bg-white/10 rounded-2xl px-5 py-4 mb-8">
            <p className="text-[#a8d878] text-sm font-semibold">
              🕐 We expect to be back within a few hours. Thank you for your patience!
            </p>
          </div>

          {/* Contact options */}
          <p className="text-white/60 text-sm mb-4">Need something urgent? Reach us directly:</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="tel:+919876543210"
              className="flex-1 flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#4a8040] text-white font-bold py-3 rounded-xl transition-colors"
            >
              <Phone size={18} />
              Call Us
            </a>
            <a href="mailto:hello@kavinorganics.in"
              className="flex-1 flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold py-3 rounded-xl transition-colors"
            >
              <Mail size={18} />
              Email Us
            </a>
          </div>
        </div>

        {/* Admin link */}
        <p className="mt-8 text-white/30 text-xs">
          Are you the store admin?{" "}
          <Link href="/admin/login" className="text-white/50 hover:text-white underline transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}