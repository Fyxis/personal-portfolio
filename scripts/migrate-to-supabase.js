const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Load .env
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

// Load current local store data
const storePath = path.join(__dirname, "..", "data", "portfolio-store.json");
const store = JSON.parse(fs.readFileSync(storePath, "utf-8"));

async function migrate() {
  console.log("Connecting to Supabase PostgreSQL...");
  const client = new Client({
    host: "db.znyieftopafeywpkscgt.supabase.co",
    port: 5432,
    user: "postgres",
    password: env.SUPABASE_PASS,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected successfully!");

  console.log("Creating tables...");
  await client.query(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      id TEXT PRIMARY KEY DEFAULT 'auth',
      password TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS profile (
      id TEXT PRIMARY KEY DEFAULT 'main',
      full_name TEXT NOT NULL,
      nickname TEXT,
      handle TEXT,
      title TEXT,
      company TEXT,
      company_url TEXT,
      location TEXT,
      status TEXT,
      bio TEXT,
      socials JSONB DEFAULT '{}'::jsonb,
      metrics JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS specializations (
      id TEXT PRIMARY KEY,
      number TEXT NOT NULL,
      title TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      technologies JSONB DEFAULT '[]'::jsonb,
      icon TEXT,
      order_index INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS tech_stack (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT,
      order_index INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT,
      badge TEXT,
      description TEXT,
      full_description TEXT,
      tags JSONB DEFAULT '[]'::jsonb,
      image TEXT,
      live_url TEXT,
      github_url TEXT,
      impact TEXT,
      order_index INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS experiences (
      id TEXT PRIMARY KEY,
      period TEXT NOT NULL,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      company_url TEXT,
      location TEXT,
      description TEXT,
      highlights JSONB DEFAULT '[]'::jsonb,
      order_index INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log("Setting up Row Level Security and Public Policies...");
  await client.query(`
    ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
    ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
    ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
    ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read profile') THEN
        CREATE POLICY "Public read profile" ON profile FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read specializations') THEN
        CREATE POLICY "Public read specializations" ON specializations FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read tech_stack') THEN
        CREATE POLICY "Public read tech_stack" ON tech_stack FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read projects') THEN
        CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read experiences') THEN
        CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert messages') THEN
        CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);
      END IF;
    END $$;
  `);

  console.log("Migrating data from local JSON store...");

  // 1. Admin Settings
  await client.query(`
    INSERT INTO admin_settings (id, password, updated_at)
    VALUES ('auth', $1, NOW())
    ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password, updated_at = NOW()
  `, [store.admin?.password || "admin"]);
  console.log("✓ Migrated admin password");

  // 2. Profile
  const p = store.profile;
  await client.query(`
    INSERT INTO profile (id, full_name, nickname, handle, title, company, company_url, location, status, bio, socials, metrics, updated_at)
    VALUES ('main', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      nickname = EXCLUDED.nickname,
      handle = EXCLUDED.handle,
      title = EXCLUDED.title,
      company = EXCLUDED.company,
      company_url = EXCLUDED.company_url,
      location = EXCLUDED.location,
      status = EXCLUDED.status,
      bio = EXCLUDED.bio,
      socials = EXCLUDED.socials,
      metrics = EXCLUDED.metrics,
      updated_at = NOW()
  `, [
    p.fullName,
    p.nickname,
    p.handle,
    p.title,
    p.company,
    p.companyUrl,
    p.location,
    p.status,
    p.bio,
    JSON.stringify(p.socials || {}),
    JSON.stringify(p.metrics || []),
  ]);
  console.log("✓ Migrated profile info");

  // 3. Specializations
  await client.query("DELETE FROM specializations;");
  for (let i = 0; i < store.specializations.length; i++) {
    const s = store.specializations[i];
    await client.query(`
      INSERT INTO specializations (id, number, title, tagline, description, technologies, icon, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      s.id || `spec-${i + 1}`,
      s.number,
      s.title,
      s.tagline,
      s.description,
      JSON.stringify(s.technologies || []),
      s.icon,
      i,
    ]);
  }
  console.log(`✓ Migrated ${store.specializations.length} specializations`);

  // 4. Tech Stack
  await client.query("DELETE FROM tech_stack;");
  for (let i = 0; i < store.techStack.length; i++) {
    const t = store.techStack[i];
    await client.query(`
      INSERT INTO tech_stack (id, name, description, color, order_index)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      t.id || `tech-${i + 1}`,
      t.name,
      t.desc,
      t.color,
      i,
    ]);
  }
  console.log(`✓ Migrated ${store.techStack.length} tech stack items`);

  // 5. Projects
  await client.query("DELETE FROM projects;");
  for (let i = 0; i < store.projects.length; i++) {
    const pr = store.projects[i];
    await client.query(`
      INSERT INTO projects (id, title, category, badge, description, full_description, tags, image, live_url, github_url, impact, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      pr.id || `proj-${i + 1}`,
      pr.title,
      pr.category,
      pr.badge,
      pr.description,
      pr.fullDescription,
      JSON.stringify(pr.tags || []),
      pr.image,
      pr.liveUrl,
      pr.githubUrl,
      pr.impact,
      i,
    ]);
  }
  console.log(`✓ Migrated ${store.projects.length} projects (initial state: empty as requested)`);

  // 6. Experiences
  await client.query("DELETE FROM experiences;");
  for (let i = 0; i < store.experiences.length; i++) {
    const e = store.experiences[i];
    await client.query(`
      INSERT INTO experiences (id, period, role, company, company_url, location, description, highlights, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      e.id || `exp-${i + 1}`,
      e.period,
      e.role,
      e.company,
      e.companyUrl,
      e.location,
      e.description,
      JSON.stringify(e.highlights || []),
      i,
    ]);
  }
  console.log(`✓ Migrated ${store.experiences.length} experiences`);

  // 7. Messages
  if (store.messages && store.messages.length > 0) {
    for (const m of store.messages) {
      await client.query(`
        INSERT INTO messages (id, name, email, subject, message, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
      `, [m.id, m.name, m.email, m.subject, m.message, m.createdAt || new Date()]);
    }
    console.log(`✓ Migrated ${store.messages.length} messages`);
  }

  console.log("\nAll data successfully migrated to Supabase!");
  await client.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
