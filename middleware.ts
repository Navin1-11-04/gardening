import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/adminAuth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Allow login page through always
  if (pathname === "/admin/login") return NextResponse.next();

  // Get token from cookie
  const token = request.cookies.get("admin_token")?.value;
  console.log("[Middleware] Pathname:", pathname);
  console.log("[Middleware] Token present:", !!token);
  console.log(
    "[Middleware] Token value:",
    token ? token.substring(0, 20) + "..." : "none",
  );

  if (!token) {
    console.log("[Middleware] No token, redirecting to login");
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const decoded = verifyToken(token);
  console.log("[Middleware] Token verified:", !!decoded);

  if (!decoded) {
    console.log("[Middleware] Token verification failed, redirecting to login");
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("admin_token");
    return response;
  }

  // Token valid — allow through
  console.log("[Middleware] Token valid, allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
