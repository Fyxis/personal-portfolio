import { NextResponse } from "next/server";
import {
  getAdminPasswordFromSupabase,
  fetchMessagesFromSupabase,
  insertMessageIntoSupabase,
  deleteMessageFromSupabase,
} from "@/lib/db";

export const dynamic = "force-dynamic";

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
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const success = await insertMessageIntoSupabase({
      name,
      email,
      subject: subject || "Inquiry",
      message,
    });

    if (!success) {
      return NextResponse.json(
        { error: "Failed to store message in database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
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
