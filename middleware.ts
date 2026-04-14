import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// TextEncoder produces a Uint8Array that `jose` expects
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "default-secret"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only gate /admin/* paths
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Login page is always accessible
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get("admin_token")?.value;

  // No token → redirect to login
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Verify with jose (fully Edge-compatible — no Node.js crypto needed)
  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Invalid / expired token → clear cookie and redirect
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    const res = NextResponse.redirect(url);
    res.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};