import { NextResponse } from "next/server";
import {
  getPortfolioStoreAsync,
  savePortfolioStoreAsync,
  getAdminPasswordFromSupabase,
  PortfolioStore,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = await getPortfolioStoreAsync();
    // Strip admin password and messages from public payload
    const { admin, messages, ...publicData } = store;
    return NextResponse.json(publicData);
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-auth");
    const correctPassword = await getAdminPasswordFromSupabase();

    if (authHeader !== correctPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentStore = await getPortfolioStoreAsync();
    const body = await request.json();

    const updatedStore: PortfolioStore = {
      ...currentStore,
      ...body,
      admin: currentStore.admin,
      messages: currentStore.messages,
    };

    const saved = await savePortfolioStoreAsync(updatedStore);
    if (!saved) {
      return NextResponse.json({ error: "Failed to persist data in Supabase" }, { status: 500 });
    }

    const { admin, ...safeData } = updatedStore;
    return NextResponse.json({ success: true, data: safeData });
  } catch (error) {
    console.error("POST /api/portfolio error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
