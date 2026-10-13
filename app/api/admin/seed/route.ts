import { NextResponse } from "next/server";
import {
  getPortfolioStoreAsync,
  savePortfolioStoreAsync,
  getAdminPasswordFromSupabase,
} from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-auth");
    const correctPassword = await getAdminPasswordFromSupabase();

    if (authHeader !== correctPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json();
    const store = await getPortfolioStoreAsync();

    if (action === "import_samples") {
      const sampleFile = path.join(process.cwd(), "data", "sample-projects.json");
      if (fs.existsSync(sampleFile)) {
        const samples = JSON.parse(fs.readFileSync(sampleFile, "utf-8"));
        store.projects = samples;
        await savePortfolioStoreAsync(store);
        return NextResponse.json({ success: true, count: samples.length, projects: store.projects });
      }
    }

    if (action === "clear_projects") {
      store.projects = [];
      await savePortfolioStoreAsync(store);
      return NextResponse.json({ success: true, count: 0, projects: [] });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/admin/seed error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
