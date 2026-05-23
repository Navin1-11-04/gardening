"use client";

// app/admin/error.tsx
// Catches runtime errors inside the admin panel.
// Does NOT affect the customer-facing site.

import { useEffect } from "react";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin panel error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f0f4ed] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#dce8d4] p-8 text-center shadow-lg">
        {/* Icon */}
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={30} className="text-red-500" />
        </div>

        <h1 className="text-xl font-black text-[#1e3d18] mb-2">
          Admin Panel Error
        </h1>
        <p className="text-sm text-[#7a9e6a] leading-relaxed mb-6">
          Something went wrong in the admin panel. This has been noted.
          Try refreshing — it usually fixes itself.
        </p>

        {error.digest && (
          <p className="text-xs text-[#9ab890] font-mono bg-[#f0f4ed] rounded-lg px-3 py-2 mb-6 inline-block">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-[#3d6b35] hover:bg-[#2d5228] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
          <a
            href="/admin/dashboard"
            className="flex items-center justify-center gap-2 bg-white border border-[#dce8d4] hover:bg-[#f0f4ed] text-[#3d6b35] font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            <Home size={15} />
            Go to Dashboard
          </a>
        </div>

        <p className="text-xs text-[#9ab890] mt-5">
          If this keeps happening, check your MongoDB connection and env vars.
        </p>
      </div>
    </div>
  );
}