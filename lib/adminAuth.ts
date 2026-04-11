import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "default-secret";

export interface AdminToken {
  id: number;
  email: string;
  role: string;
  iat?: number;
}

// Create JWT token
export function createToken(admin: AdminToken): string {
  console.log(
    "[createToken] JWT_SECRET:",
    JWT_SECRET ? JWT_SECRET.substring(0, 10) + "..." : "NOT SET",
  );

  return jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

// Verify JWT token
export function verifyToken(token: string): AdminToken | null {
  try {
    console.log(
      "[verifyToken] JWT_SECRET:",
      JWT_SECRET ? JWT_SECRET.substring(0, 10) + "..." : "NOT SET",
    );
    console.log("[verifyToken] Token:", token.substring(0, 30) + "...");

    const decoded = jwt.verify(token, JWT_SECRET) as AdminToken;
    console.log("[verifyToken] Decoded successfully:", decoded);
    return decoded;
  } catch (error) {
    console.error("[verifyToken] Error:", error);
    return null;
  }
}

// Extract token from cookie
export function getTokenFromCookie(cookieString: string): string | null {
  if (!cookieString) return null;
  const cookies = cookieString.split(";").map((c) => c.trim());
  const adminToken = cookies.find((c) => c.startsWith("admin_token="));
  if (!adminToken) return null;
  return adminToken.split("=")[1];
}
