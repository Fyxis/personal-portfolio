import { NextResponse } from "next/server";
import {
  getAdminPasswordFromSupabase,
  fetchMessagesFromSupabase,
  insertMessageIntoSupabase,
  deleteMessageFromSupabase,
} from "@/lib/db";
import { sendContactNotificationEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-auth");
    const correctPassword = await getAdminPasswordFromSupabase();

    if (authHeader !== correctPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await fetchMessagesFromSupabase();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const subject =
      typeof body?.subject === "string" && body.subject.trim()
        ? body.subject.trim()
        : "Inquiry";
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (
      name.length > 120 ||
      email.length > 200 ||
      subject.length > 200 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { error: "Message input exceeds allowed character limits" },
        { status: 400 }
      );
    }

    const payload = { name, email, subject, message };
    const [savedToDb, emailResult] = await Promise.all([
      insertMessageIntoSupabase(payload),
      sendContactNotificationEmail(payload),
    ]);

    if (!savedToDb && !emailResult.sent) {
      return NextResponse.json(
        {
          error:
            emailResult.status === "failed"
              ? `Failed to send or store message: ${emailResult.error}`
              : "Failed to store message in database",
        },
        { status: 500 }
      );
    }

    if (emailResult.status === "failed") {
      return NextResponse.json(
        {
          error: `Message saved to Admin Inbox, but failed to forward email via hosting SMTP: ${emailResult.error}`,
          savedToDb,
          emailSent: false,
          emailStatus: emailResult.status,
        },
        { status: 502 }
      );
    }

    if (emailResult.status === "not_configured") {
      console.warn(
        "POST /api/messages saved message to DB, but SMTP_USER/SMTP_PASS is not configured; email forwarding skipped."
      );
    }

    return NextResponse.json({
      success: true,
      savedToDb,
      emailSent: emailResult.sent,
      emailStatus: emailResult.status,
      message: "Your message has been sent successfully",
    });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-auth");
    const correctPassword = await getAdminPasswordFromSupabase();

    if (authHeader !== correctPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    await deleteMessageFromSupabase(id);
    const updatedMessages = await fetchMessagesFromSupabase();

    return NextResponse.json({ success: true, messages: updatedMessages });
  } catch (error) {
    console.error("DELETE /api/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
