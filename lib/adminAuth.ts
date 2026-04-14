import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "default-secret";

export interface AdminToken {
  id: string;   // MongoDB ObjectId string
  email: string;
  role: string;
  iat?: number;
}

export function createToken(admin: AdminToken): string {
  return jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): AdminToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminToken;
  } catch {
    return null;
  }
}

export function getTokenFromCookie(cookieString: string): string | null {
  if (!cookieString) return null;
  const cookies = cookieString.split(";").map((c) => c.trim());
  const adminToken = cookies.find((c) => c.startsWith("admin_token="));
  if (!adminToken) return null;
  return adminToken.split("=")[1];
}