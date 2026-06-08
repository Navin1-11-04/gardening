import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "default-secret"
);

const CSRF_COOKIE = "csrf_token";

function generateCsrfToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Admin routes — require JWT ──────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      const response = NextResponse.next();
      // Ensure admin always has a CSRF token cookie
      if (!request.cookies.get(CSRF_COOKIE)?.value) {
        response.cookies.set(CSRF_COOKIE, generateCsrfToken(), {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 8, // 8 hours
        });
      }
      return response;
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      const res = NextResponse.redirect(url);
      res.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
      return res;
    }
  }

  // ── 2. Maintenance mode ────────────────────────────────────────────────────
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/admin") ||
    pathname === "/favicon.ico";

  if (!isPublicAsset) {
    const maintenance = request.cookies.get("maintenance_mode")?.value === "true";
    if (maintenance) {
      const url = request.nextUrl.clone();
      url.pathname = "/maintenance";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};