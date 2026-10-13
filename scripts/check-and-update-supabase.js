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

async function main() {
  const client = new Client({
    host: "db.znyieftopafeywpkscgt.supabase.co",
    port: 5432,
    user: "postgres",
    password: env.SUPABASE_PASS,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Supabase Postgres.");

  // 1. Profile: update company and metrics
  const profileRes = await client.query("SELECT id, company, metrics FROM profile WHERE id = 'main'");
  if (profileRes.rows.length > 0) {
    let metrics = profileRes.rows[0].metrics || [];
    if (Array.isArray(metrics)) {
      metrics = metrics.map(m => {
        if (m.sublabel) {
          let s = m.sublabel;
          s = s.replace(/PT Selaras Digital Labs/g, "Newsaint Digital Solution");
          s = s.replace(/Newsaint Digital Labs/g, "Newsaint Digital Solution");
          s = s.replace(/Selaras/g, "Newsaint");
          return { ...m, sublabel: s };
        }
        return m;
      });
    }

    const newCompany = "Newsaint Digital Solution";

    await client.query(
      "UPDATE profile SET company = $1, metrics = $2, updated_at = NOW() WHERE id = 'main'",
      [newCompany, JSON.stringify(metrics)]
    );
    console.log("Updated profile successfully. Company:", newCompany, "Metrics:", metrics);
  }

  // 2. Experiences: update company
  const updateExp = await client.query(
    "UPDATE experiences SET company = 'Newsaint Digital Solution' WHERE company ILIKE '%Selaras%' OR company ILIKE '%Newsaint Digital Labs%'"
  );
  console.log(`Updated ${updateExp.rowCount} experience records to 'Newsaint Digital Solution'.`);

  // 3. Projects: update descriptions if any
  const projRes = await client.query(
    "SELECT id, title, description, full_description FROM projects WHERE description ILIKE '%Selaras%' OR full_description ILIKE '%Selaras%' OR description ILIKE '%Newsaint Digital Labs%' OR full_description ILIKE '%Newsaint Digital Labs%'"
  );
  for (const p of projRes.rows) {
    let newDesc = (p.description || "")
      .replace(/PT Selaras Digital Labs/g, "Newsaint Digital Solution")
      .replace(/Newsaint Digital Labs/g, "Newsaint Digital Solution")
      .replace(/Selaras/g, "Newsaint");
    let newFullDesc = (p.full_description || "")
      .replace(/PT Selaras Digital Labs/g, "Newsaint Digital Solution")
      .replace(/Newsaint Digital Labs/g, "Newsaint Digital Solution")
      .replace(/Selaras/g, "Newsaint");
    await client.query(
      "UPDATE projects SET description = $1, full_description = $2 WHERE id = $3",
      [newDesc, newFullDesc, p.id]
    );
    console.log(`Updated project ${p.id}.`);
  }

  // Verification query
  const checkAny = await client.query(`
    SELECT 'experiences_selaras' as tbl, count(*) from experiences WHERE company ILIKE '%Selaras%'
    UNION ALL
    SELECT 'experiences_labs' as tbl, count(*) from experiences WHERE company ILIKE '%Digital Labs%'
    UNION ALL
    SELECT 'profile_selaras' as tbl, count(*) from profile WHERE company ILIKE '%Selaras%' OR metrics::text ILIKE '%Selaras%'
    UNION ALL
    SELECT 'profile_labs' as tbl, count(*) from profile WHERE company ILIKE '%Digital Labs%' OR metrics::text ILIKE '%Digital Labs%'
    UNION ALL
    SELECT 'projects_selaras' as tbl, count(*) from projects WHERE description ILIKE '%Selaras%' OR full_description ILIKE '%Selaras%'
    UNION ALL
    SELECT 'projects_labs' as tbl, count(*) from projects WHERE description ILIKE '%Digital Labs%' OR full_description ILIKE '%Digital Labs%'
  `);
  console.log("Verification results (should all be 0):", checkAny.rows);

  await client.end();
  console.log("Finished successfully.");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
