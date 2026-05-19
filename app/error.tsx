"use client";

// app/error.tsx
// Global error boundary — catches unhandled runtime errors in the app.

import { useEffect } from "react";
import Link from "next/link";
import { Leaf, RefreshCw, Home, Phone } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in dev; swap for Sentry / LogRocket in production
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-4 text-center">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#c0392b] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#3d6b35] opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#3d6b35] rounded-2xl flex items-center justify-center mb-3 shadow-lg">
            <Leaf size={30} className="text-white" />
          </div>
          <p className="text-sm font-bold text-[#7a9e5f] uppercase tracking-[0.25em]">
            Kavin Organics
          </p>
        </div>

        {/* Error icon */}
        <div className="text-6xl mb-4">⚠️</div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#2a2a1e] font-outfit mb-3">
          Something Went Wrong
        </h1>
        <p className="text-base text-[#7a7a68] leading-relaxed mb-8 max-w-sm mx-auto">
          We hit an unexpected error. This has been noted.
          Please try again — it usually fixes itself!
        </p>

        {/* Error digest for support (only show in production) */}
        {error.digest && (
          <p className="text-xs text-[#a8a090] mb-6 font-mono bg-white border border-[#e8e0d0] rounded-lg px-4 py-2 inline-block">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#2e5228] text-white font-bold text-base px-6 py-3.5 rounded-xl transition-colors shadow-md"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white hover:bg-[#faf7f2] border-2 border-[#d4c9a8] hover:border-[#3d6b35] text-[#3d6b35] font-bold text-base px-6 py-3.5 rounded-xl transition-colors"
          >
            <Home size={18} />
            Go to Homepage
          </Link>
        </div>

        {/* Help */}
        <div className="bg-white border border-[#e8e0d0] rounded-2xl px-5 py-4">
          <p className="text-sm text-[#5a5a48] mb-2">
            If the problem persists, call us and we'll help you place your order:
          </p>
          <a
            href="tel:+919876543210"
            className="flex items-center justify-center gap-2 text-base font-bold text-[#3d6b35] hover:underline"
          >
            <Phone size={16} />
            +91 98765 43210
          </a>
        </div>
      </div>
    </div>
  );
}