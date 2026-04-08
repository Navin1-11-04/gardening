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
  return jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

// Verify JWT token
export function verifyToken(token: string): AdminToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminToken;
    return decoded;
  } catch (error) {
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
