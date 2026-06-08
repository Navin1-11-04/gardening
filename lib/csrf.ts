// lib/csrf.ts
// Lightweight CSRF protection using the Double-Submit Cookie pattern.
// - Server generates a random token and sets it in a cookie (not httpOnly)
// - Client reads the cookie and sends it in a custom header X-CSRF-Token
// - Server verifies the header matches the cookie
//
// Usage in API route:
//   const csrf = await verifyCsrf(request);
//   if (!csrf.ok) return csrf.response;
//
// Usage in client component:
//   import { getCsrfToken } from "@/lib/csrf";
//   const token = getCsrfToken();  // reads from cookie
//   fetch("/api/...", { headers: { "X-CSRF-Token": token } })

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const CSRF_COOKIE  = "csrf_token";
const CSRF_HEADER  = "x-csrf-token";
const TOKEN_LENGTH = 32;

// ── Server: generate and set token ───────────────────────────────────────────

export async function ensureCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CSRF_COOKIE)?.value;
  if (existing) return existing;

  const token = crypto.randomBytes(TOKEN_LENGTH).toString("hex");
  return token;
}

// ── Server: verify incoming request has valid CSRF token ──────────────────────

export interface CsrfResult {
  ok: true;
}
export interface CsrfFailure {
  ok: false;
  response: NextResponse;
}

export async function verifyCsrf(
  request: NextRequest
): Promise<CsrfResult | CsrfFailure> {
  // Skip for GET, HEAD, OPTIONS — they should be safe/idempotent
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return { ok: true };
  }

  const cookieToken  = request.cookies.get(CSRF_COOKIE)?.value;
  const headerToken  = request.headers.get(CSRF_HEADER);

  if (!cookieToken || !headerToken) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "CSRF token missing" },
        { status: 403 }
      ),
    };
  }

  // Timing-safe comparison
  try {
    const cookieBuf = Buffer.from(cookieToken, "hex");
    const headerBuf = Buffer.from(headerToken, "hex");

    if (
      cookieBuf.length !== headerBuf.length ||
      !crypto.timingSafeEqual(cookieBuf, headerBuf)
    ) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "CSRF token mismatch" },
          { status: 403 }
        ),
      };
    }
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "CSRF token invalid" },
        { status: 403 }
      ),
    };
  }

  return { ok: true };
}

// ── Response helper: set CSRF cookie on any response ─────────────────────────

export function setCsrfCookie(
  response: NextResponse,
  token: string
): NextResponse {
  response.cookies.set(CSRF_COOKIE, token, {
    httpOnly: false,            // Must be readable by JS (Double-Submit pattern)
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,        // 8 hours
  });
  return response;
}