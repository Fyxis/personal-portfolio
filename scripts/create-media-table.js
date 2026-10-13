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

async function run() {
  const client = new Client({
    host: "db.znyieftopafeywpkscgt.supabase.co",
    port: 5432,
    user: "postgres",
    password: env.SUPABASE_PASS,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Supabase PostgreSQL for Media table creation...");

  await client.query(`
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      data TEXT NOT NULL,
      url TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE media ENABLE ROW LEVEL SECURITY;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read media') THEN
        CREATE POLICY "Public read media" ON media FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert media') THEN
        CREATE POLICY "Public insert media" ON media FOR INSERT WITH CHECK (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public delete media') THEN
        CREATE POLICY "Public delete media" ON media FOR DELETE USING (true);
      END IF;
    END $$;
  `);

  console.log("Media table successfully created with public access policies!");
  await client.end();
}

run().catch((err) => {
  console.error("Error creating media table:", err);
  process.exit(1);
});
