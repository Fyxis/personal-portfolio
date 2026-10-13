import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getPostgresPool } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    if (!filename) {
      return NextResponse.json({ error: "Filename required" }, { status: 400 });
    }

    // 1. Try local filesystem first
    const diskPath = path.join(process.cwd(), "public", "uploads", filename);
    if (fs.existsSync(diskPath)) {
      const buffer = fs.readFileSync(diskPath);
      const ext = path.extname(filename).toLowerCase();
      const mimeMap: Record<string, string> = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
        ".gif": "image/gif",
      };
      const contentType = mimeMap[ext] || "application/octet-stream";

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // 2. Fallback to Supabase media table
    const pool = getPostgresPool();
    const res = await pool.query(
      "SELECT mime_type, data FROM media WHERE filename = $1 OR id = $1 LIMIT 1",
      [filename]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const row = res.rows[0];
    const imageBuffer = Buffer.from(row.data, "base64");

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": row.mime_type || "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("GET /api/media error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
