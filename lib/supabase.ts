import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";
import { PortfolioStore } from "./db";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL ;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ;
const SUPABASE_PASS = process.env.SUPABASE_PASS ;

// Supabase REST client
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Postgres connection pool for server-side route handlers
function extractSupabaseProjectRef(url?: string): string {
  const match = url?.match(/https?:\/\/([a-z0-9-]+)\.supabase\.co/i);
  return match?.[1] || "znyieftopafeywpkscgt";
}

function getPostgresConnectionString(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL;
}

function hasPostgresCredentials(): boolean {
  return Boolean(getPostgresConnectionString() || SUPABASE_PASS);
}

function getAdminServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !serviceKey) return null;
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function formatSafeDbError(error: unknown): string {
  if (!error || typeof error !== "object") return "Unknown database error";
  const err = error as { code?: string; message?: string };
  if (err.code === "28P01" || err.code === "28000") {
    return "Database authentication failed (check SUPABASE_PASS)";
  }
  if (err.code) {
    return `Database error (${err.code})`;
  }
  return err.message ? err.message.slice(0, 120) : "Unknown database error";
}

let pool: Pool | null = null;

export function getPostgresPool(): Pool {
  if (!pool) {
    const connectionString = getPostgresConnectionString();
    const projectRef = extractSupabaseProjectRef(SUPABASE_URL);
    const poolConfig = connectionString
      ? {
          connectionString,
          ssl: { rejectUnauthorized: false },
          max: 5,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
        }
      : {
          // Use Supavisor IPv4 pooler so serverless runtimes (e.g. Vercel) can reach Supabase Postgres
          host: process.env.SUPABASE_DB_HOST || "aws-0-ap-northeast-1.pooler.supabase.com",
          port: Number(process.env.SUPABASE_DB_PORT || 6543),
          user: process.env.SUPABASE_DB_USER || `postgres.${projectRef}`,
          password: SUPABASE_PASS,
          database: "postgres",
          ssl: { rejectUnauthorized: false },
          max: 5,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
        };

    pool = new Pool(poolConfig);
    pool.on("error", (err) => {
      console.error("Unexpected PostgreSQL pool error:", err.message);
    });
  }
  return pool;
}

// Fetch complete portfolio data from Supabase
export async function fetchPortfolioFromSupabase(): Promise<PortfolioStore> {
  const p = getPostgresPool();

  try {
    const [
      profileRes,
      specRes,
      techRes,
      projRes,
      expRes,
      adminRes,
    ] = await Promise.all([
      p.query("SELECT * FROM profile WHERE id = 'main' LIMIT 1"),
      p.query("SELECT * FROM specializations ORDER BY order_index ASC"),
      p.query("SELECT * FROM tech_stack ORDER BY order_index ASC"),
      p.query("SELECT * FROM projects ORDER BY order_index ASC"),
      p.query("SELECT * FROM experiences ORDER BY order_index ASC"),
      p.query("SELECT password FROM admin_settings WHERE id = 'auth' LIMIT 1"),
    ]);

    const profileRow = profileRes.rows[0] || {};
    const adminPassword = adminRes.rows[0]?.password || "admin";

    const specializations = specRes.rows.map((row) => ({
      id: row.id,
      number: row.number,
      title: row.title,
      tagline: row.tagline,
      description: row.description,
      technologies: Array.isArray(row.technologies) ? row.technologies : [],
      icon: row.icon,
    }));

    const techStack = techRes.rows.map((row) => ({
      id: row.id,
      name: row.name,
      desc: row.description || row.desc,
      color: row.color,
    }));

    const projects = projRes.rows.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      badge: row.badge,
      description: row.description,
      fullDescription: row.full_description,
      tags: Array.isArray(row.tags) ? row.tags : [],
      image: row.image,
      liveUrl: row.live_url,
      githubUrl: row.github_url,
      impact: row.impact,
    }));

    const experiences = expRes.rows.map((row) => ({
      id: row.id,
      period: row.period,
      role: row.role,
      company: row.company,
      companyUrl: row.company_url,
      location: row.location,
      description: row.description,
      highlights: Array.isArray(row.highlights) ? row.highlights : [],
    }));

    return {
      admin: { password: adminPassword },
      profile: {
        fullName: profileRow.full_name || "Adrianus Bagus Setiaji",
        nickname: profileRow.nickname || "Bagus",
        handle: profileRow.handle || "Fyxis",
        title: profileRow.title || "Full Stack Engineer & Technical PM",
        company: profileRow.company || "Newsaint Digital Solution",
        companyUrl: profileRow.company_url || "https://newsaint.web.id",
        location: profileRow.location || "Semarang, Indonesia",
        status: profileRow.status || "Available for Strategic Projects",
        bio: profileRow.bio || "",
        socials: profileRow.socials || {
          github: "https://github.com/Fyxis",
          linkedin: "https://www.linkedin.com/in/adrianus-bagus-737418259/",
          instagram: "https://www.instagram.com/bagus.jpeg",
          email: "bagusadrianus@gmail.com",
          whatsapp: "+6287868330917",
          website: "https://newsaint.web.id",
        },
        metrics: profileRow.metrics || [],
      },
      specializations,
      techStack,
      projects,
      experiences,
      messages: [],
    };
  } catch (error) {
    console.error("Error fetching portfolio from Supabase:", error);
    throw error;
  }
}

// Save complete portfolio updates to Supabase
export async function savePortfolioToSupabase(data: PortfolioStore): Promise<boolean> {
  const p = getPostgresPool();
  const client = await p.connect();

  try {
    await client.query("BEGIN");

    // 1. Profile
    if (data.profile) {
      const prof = data.profile;
      await client.query(
        `
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
      `,
        [
          prof.fullName,
          prof.nickname,
          prof.handle,
          prof.title,
          prof.company,
          prof.companyUrl,
          prof.location,
          prof.status,
          prof.bio,
          JSON.stringify(prof.socials || {}),
          JSON.stringify(prof.metrics || []),
        ]
      );
    }

    // 2. Specializations
    if (data.specializations) {
      await client.query("DELETE FROM specializations");
      for (let i = 0; i < data.specializations.length; i++) {
        const s = data.specializations[i];
        await client.query(
          `
          INSERT INTO specializations (id, number, title, tagline, description, technologies, icon, order_index)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
          [
            s.id || `spec-${i + 1}`,
            s.number,
            s.title,
            s.tagline,
            s.description,
            JSON.stringify(s.technologies || []),
            s.icon,
            i,
          ]
        );
      }
    }

    // 3. Tech Stack
    if (data.techStack) {
      await client.query("DELETE FROM tech_stack");
      for (let i = 0; i < data.techStack.length; i++) {
        const t = data.techStack[i];
        await client.query(
          `
          INSERT INTO tech_stack (id, name, description, color, order_index)
          VALUES ($1, $2, $3, $4, $5)
        `,
          [t.id || `tech-${i + 1}`, t.name, t.desc, t.color, i]
        );
      }
    }

    // 4. Projects
    if (data.projects) {
      await client.query("DELETE FROM projects");
      for (let i = 0; i < data.projects.length; i++) {
        const pr = data.projects[i];
        await client.query(
          `
          INSERT INTO projects (id, title, category, badge, description, full_description, tags, image, live_url, github_url, impact, order_index)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `,
          [
            pr.id || `proj-${i + 1}`,
            pr.title,
            pr.category,
            pr.badge,
            pr.description,
            pr.fullDescription,
            JSON.stringify(pr.tags || []),
            pr.image,
            pr.liveUrl || "",
            pr.githubUrl || "",
            pr.impact || "",
            i,
          ]
        );
      }
    }

    // 5. Experiences
    if (data.experiences) {
      await client.query("DELETE FROM experiences");
      for (let i = 0; i < data.experiences.length; i++) {
        const e = data.experiences[i];
        await client.query(
          `
          INSERT INTO experiences (id, period, role, company, company_url, location, description, highlights, order_index)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
          [
            e.id || `exp-${i + 1}`,
            e.period,
            e.role,
            e.company,
            e.companyUrl || "",
            e.location,
            e.description,
            JSON.stringify(e.highlights || []),
            i,
          ]
        );
      }
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saving portfolio to Supabase:", error);
    return false;
  } finally {
    client.release();
  }
}

// Password operations
export async function getAdminPasswordFromSupabase(): Promise<string> {
  if (hasPostgresCredentials()) {
    const p = getPostgresPool();
    try {
      const res = await p.query("SELECT password FROM admin_settings WHERE id = 'auth' LIMIT 1");
      if (res.rows[0]?.password) {
        return res.rows[0].password;
      }
    } catch (error) {
      console.error("Error getting admin password from Supabase Postgres:", error);
    }
  }

  const serviceClient = getAdminServiceClient();
  if (serviceClient) {
    try {
      const { data, error } = await serviceClient
        .from("admin_settings")
        .select("password")
        .eq("id", "auth")
        .limit(1)
        .maybeSingle();
      if (!error && data?.password) {
        return data.password;
      }
    } catch (error) {
      console.error("Error getting admin password from Supabase REST:", error);
    }
  }

  return "admin";
}

export async function updateAdminPasswordInSupabase(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  let pgError: unknown = null;

  if (hasPostgresCredentials()) {
    const p = getPostgresPool();
    try {
      await p.query(
        `
        INSERT INTO admin_settings (id, password, updated_at)
        VALUES ('auth', $1, NOW())
        ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password, updated_at = NOW()
      `,
        [newPassword]
      );
      return { success: true };
    } catch (error) {
      pgError = error;
      console.error("Error setting admin password in Supabase Postgres:", error);
    }
  }

  const serviceClient = getAdminServiceClient();
  if (serviceClient) {
    try {
      const { error } = await serviceClient
        .from("admin_settings")
        .upsert(
          { id: "auth", password: newPassword, updated_at: new Date().toISOString() },
          { onConflict: "id" }
        );
      if (!error) {
        return { success: true };
      }
      console.error("Error setting admin password via Supabase REST:", error);
      return { success: false, error: error.message };
    } catch (error) {
      console.error("Error setting admin password via Supabase REST:", error);
      return { success: false, error: formatSafeDbError(error) };
    }
  }

  if (!hasPostgresCredentials()) {
    return {
      success: false,
      error: "Missing SUPABASE_PASS, DATABASE_URL, or SUPABASE_SERVICE_ROLE_KEY in server environment",
    };
  }

  return { success: false, error: formatSafeDbError(pgError) };
}

export async function setAdminPasswordInSupabase(newPassword: string): Promise<boolean> {
  const result = await updateAdminPasswordInSupabase(newPassword);
  return result.success;
}

// Messages operations
export async function fetchMessagesFromSupabase(): Promise<any[]> {
  const p = getPostgresPool();
  try {
    const res = await p.query("SELECT * FROM messages ORDER BY created_at DESC");
    return res.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error("Error fetching messages from Supabase:", error);
    return [];
  }
}

export async function insertMessageIntoSupabase(msg: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const p = getPostgresPool();
  try {
    const id = "msg-" + Date.now();
    await p.query(
      `
      INSERT INTO messages (id, name, email, subject, message, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `,
      [id, msg.name, msg.email, msg.subject, msg.message]
    );
    return true;
  } catch (error) {
    console.error("Error inserting message into Supabase:", error);
    return false;
  }
}

export async function deleteMessageFromSupabase(id: string): Promise<boolean> {
  const p = getPostgresPool();
  try {
    await p.query("DELETE FROM messages WHERE id = $1", [id]);
    return true;
  } catch (error) {
    console.error("Error deleting message from Supabase:", error);
    return false;
  }
}
