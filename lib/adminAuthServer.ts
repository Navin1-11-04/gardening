import { cookies } from "next/headers";
import { verifyToken } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

export interface AuthResult {
  ok: true;
  admin: { id: string; email: string; role: string };
}

export interface AuthFailure {
  ok: false;
  response: NextResponse;
}

/**
 * Call at the top of any admin API route handler.
 *
 * Usage:
 *   const auth = await requireAdminAuth();
 *   if (!auth.ok) return auth.response;
 *   // auth.admin is now available
 */
export async function requireAdminAuth(): Promise<AuthResult | AuthFailure> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }),
      };
    }

    return {
      ok: true,
      admin: { id: decoded.id, email: decoded.email, role: decoded.role },
    };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Auth check failed" }, { status: 500 }),
    };
  }
}