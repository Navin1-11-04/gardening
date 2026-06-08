// app/api/admin/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { requireAdminAuth } from "@/lib/adminAuthServer";
import { verifyCsrf } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth();
  if (!auth.ok) return auth.response;

  const csrf = await verifyCsrf(request);
  if (!csrf.ok) return csrf.response;

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both current and new password are required." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    await connectDB();
    const admin = await Admin.findById(auth.admin.id);
    if (!admin) return NextResponse.json({ error: "Admin not found." }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    return NextResponse.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Failed to change password." }, { status: 500 });
  }
}