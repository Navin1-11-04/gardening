// lib/useCsrf.ts
// Client-side hook that reads the CSRF token from the cookie
// and returns a fetch wrapper that automatically adds the header.
//
// Usage:
//   const { csrfFetch } = useCsrf();
//   const res = await csrfFetch("/api/admin/products", { method: "POST", ... });

"use client";

import { useCallback } from "react";

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(CSRF_COOKIE + "="));
  return match ? match.split("=")[1] : "";
}

export function useCsrf() {
  const csrfFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const token = getCsrfToken();
      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers ?? {}),
          [CSRF_HEADER]: token,
          "Content-Type":
            (options.headers as Record<string, string>)?.["Content-Type"] ??
            "application/json",
        },
      });
    },
    []
  );

  return { csrfFetch, getCsrfToken };
}