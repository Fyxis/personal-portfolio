import { NextResponse } from "next/server";
import { getAdminPasswordFromSupabase, setAdminPasswordInSupabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { action, password, newPassword } = await request.json();
    const currentPassword = await getAdminPasswordFromSupabase();

    if (action === "login") {
      if (password === currentPassword) {
        return NextResponse.json({
          success: true,
          token: currentPassword,
          message: "Login successful",
        });
      } else {
        return NextResponse.json(
          { success: false, error: "Incorrect password. Please try again." },
          { status: 401 }
        );
      }
    }

    if (action === "change_password") {
      const authHeader = request.headers.get("x-admin-auth");
      if (authHeader !== currentPassword) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!newPassword || newPassword.length < 4) {
        return NextResponse.json(
          { error: "New password must be at least 4 characters" },
          { status: 400 }
        );
      }

      const success = await setAdminPasswordInSupabase(newPassword);
      if (!success) {
        return NextResponse.json(
          { error: "Failed to persist new password in database" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Password updated successfully",
        newToken: newPassword,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
