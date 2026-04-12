import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/adminAuth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only gate /admin/* paths
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // The login page itself is always accessible
  if (pathname === "/admin/login") return NextResponse.next();

  // Read the cookie
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    const res = NextResponse.redirect(url);
    // Clear the invalid cookie
    res.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
    return res;
  }

  // Valid token — let request through
  return NextResponse.next();
}

export const config = {
  // Match every /admin/* route including nested
  matcher: ["/admin/:path*"],
};