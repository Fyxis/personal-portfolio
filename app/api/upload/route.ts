import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminPasswordFromSupabase } from "@/lib/db";
import { getPostgresPool } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Authenticate admin
    const authHeader = request.headers.get("x-admin-auth");
    const correctPassword = await getAdminPasswordFromSupabase();

    if (authHeader !== correctPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 3. Validate mime type
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PNG, JPG, WEBP, SVG, and GIF are allowed." },
        { status: 400 }
      );
    }

    // 4. Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // 5. Read buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 6. Generate unique filename
    const originalName = file.name || "upload";
    const ext = path.extname(originalName).toLowerCase() || ".png";
    const baseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 30);
    const uniqueFilename = `${baseName}-${Date.now()}${ext}`;

    // 7. Save to public/uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    // 8. Persist backup in Supabase PostgreSQL media table
    try {
      const pool = getPostgresPool();
      const base64Data = buffer.toString("base64");
      await pool.query(
        `
        INSERT INTO media (id, filename, mime_type, data, url)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          filename = EXCLUDED.filename,
          mime_type = EXCLUDED.mime_type,
          data = EXCLUDED.data,
          url = EXCLUDED.url
      `,
        [uniqueFilename, uniqueFilename, file.type, base64Data, publicUrl]
      );
    } catch (dbErr) {
      console.warn("Could not save media backup to PostgreSQL media table:", dbErr);
      // Non-fatal: local file was saved successfully
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
