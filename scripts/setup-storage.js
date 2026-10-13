const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || "";
    value = value.trim().replace(/^['"]|['"]$/g, "");
    env[match[1]] = value;
  }
});

async function setup() {
  const client = new Client({
    host: "db.znyieftopafeywpkscgt.supabase.co",
    port: 5432,
    user: "postgres",
    password: env.SUPABASE_PASS,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to PostgreSQL for Storage setup...");

  await client.query(`
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('portfolio', 'portfolio', true, 15728640, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'])
    ON CONFLICT (id) DO UPDATE SET public = true;
  `);

  await client.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Objects') THEN
        CREATE POLICY "Public Access Objects" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert Objects') THEN
        CREATE POLICY "Public Insert Objects" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Update Objects') THEN
        CREATE POLICY "Public Update Objects" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Delete Objects') THEN
        CREATE POLICY "Public Delete Objects" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio');
      END IF;
    END $$;
  `);

  console.log("Supabase Storage bucket 'portfolio' created with public access policies!");
  await client.end();
}

setup().catch((err) => {
  console.error("Storage setup error:", err);
  process.exit(1);
});
