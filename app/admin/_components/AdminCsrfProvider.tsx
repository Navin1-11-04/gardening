// app/admin/_components/AdminCsrfProvider.tsx
// Drop this inside AdminLayout (or wrap children with it).
// It patches the global fetch for all admin pages so every request
// automatically includes the X-CSRF-Token header.
"use client";

import { useEffect } from "react";

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(CSRF_COOKIE + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : "";
}

/**
 * Patches window.fetch so every request to /api/admin/* automatically
 * includes the X-CSRF-Token header. Mount once at the admin layout level.
 */
export function AdminCsrfProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input instanceof Request ? input.url : String(input);

      // Only patch admin API calls
      if (url.includes("/api/admin/")) {
        const token = getCsrfToken();
        if (token) {
          init = {
            ...init,
            headers: {
              ...(init?.headers ?? {}),
              [CSRF_HEADER]: token,
            },
          };
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
}