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

const SHOWCASE_PROJECTS = [
  {
    id: "rsa-defense",
    title: "Radiant System Accelerate (RSA)",
    category: "Company Profile",
    badge: "CYBER DEFENSE & ENTERPRISE",
    description: "Next-gen corporate digital presence for a cybersecurity enterprise featuring Blue Team defense, Red Team testing, White Team compliance, and IronCloud protection.",
    fullDescription: "Comprehensive corporate platform built for Radiant System Accelerate (RSA), an enterprise cyber defense and IT systems integration firm. Engineered using React 19, Vite, and Tailwind CSS v4, the application features modern dark UI aesthetics, interactive product showcases for Red/Blue/White security teams, dynamic consultation request workflows via EmailJS, and high-performance asset loading.",
    tags: ["React 19", "Vite", "Tailwind CSS v4", "Lucide React", "EmailJS", "Cybersecurity"],
    image: "/images/projects/rsa-showcase.png",
    featured: true,
    liveUrl: "https://radiantsystem.id",
    githubUrl: "https://github.com/Fyxis",
    impact: "Standardized enterprise cybersecurity service offerings with interactive multi-product showcases and automated inbound client consultation pipelines."
  },
  {
    id: "ironcloud-platform",
    title: "IronCloud Security & WAF Platform",
    category: "Web SaaS",
    badge: "ENTERPRISE CLOUD SECURITY",
    description: "Cloudflare-grade multi-tenant WAF firewall, DNS routing, and edge security control plane with strict organizational isolation and PBKDF2 authentication.",
    fullDescription: "Enterprise-grade multi-tenant security operations center built on Next.js 16 (App Router), React 19, and PostgreSQL. Features strict tenant data isolation mimicking Cloudflare's architecture, interactive superadmin tenant switcher, Fernet cryptographic key handling, PBKDF2 SHA-256 session management, live WAF page rule orchestration, DNS record management, SSL/TLS certificate status tracking, zero-flash client caching (SWR), and comprehensive tamper-resistant audit logs.",
    tags: ["Next.js 16", "React 19", "PostgreSQL", "Cloudflare API", "Fernet Cryptography", "Tailwind CSS v4"],
    image: "/images/projects/ironcloud-logo.png",
    featured: true,
    liveUrl: "",
    githubUrl: "https://github.com/Fyxis",
    impact: "Unified multi-tenant domain and firewall operations under a single pane of glass with sub-second tenant switching and zero-leakage data isolation."
  },
  {
    id: "securink-gateway",
    title: "Securink Enterprise Access Gateway",
    category: "Web SaaS",
    badge: "THREAT INTELLIGENCE & LINK SECURITY",
    description: "Secure link infrastructure and multi-tenant access protection suite with cryptographic token verification and real-time edge security monitoring.",
    fullDescription: "High-assurance link security and threat mitigation platform architected on Next.js 16, React 19, Tailwind CSS v4, and PostgreSQL. Integrates Node-Forge cryptography for secure token signing, multi-tenant link routing with strict tenancy boundaries, Cloudflare edge rule enforcement, instantaneous zero-flash state caching, and automated audit logging for enterprise perimeter defense.",
    tags: ["Next.js 16", "React 19", "PostgreSQL", "Node-Forge", "Cloudflare", "Tailwind CSS v4"],
    image: "/images/projects/securink-logo.png",
    featured: true,
    liveUrl: "",
    githubUrl: "https://github.com/Fyxis",
    impact: "Robust cryptographic validation and multi-tenant edge routing safeguarding critical enterprise assets against link spoofing and unauthorized access."
  },
  {
    id: "huashu-marketplace-api",
    title: "Huashu Marketplace Engine",
    category: "Full Stack",
    badge: "BACKEND & PAYMENT GATEWAY",
    description: "High-concurrency e-commerce backend engine with atomic race-condition prevention, Midtrans Snap payment gateway, and RajaOngkir multi-courier shipping.",
    fullDescription: "Production-ready backend API ecosystem architected with Node.js, Express, and Prisma ORM. Features atomic database transaction isolation to eliminate race conditions during high-volume checkout spikes, fully automated Midtrans Snap webhook integration (handling settlement, expired orders, and automated stock replenishment), RajaOngkir real-time shipping rate calculation, JWT stateless authentication, Multer file upload pipelines, and Socket.io real-time buyer-seller chat.",
    tags: ["Node.js", "Express.js", "Prisma ORM", "Midtrans Snap", "RajaOngkir", "Socket.io", "SQLite/Postgres"],
    image: "/images/file-management-systems.svg",
    featured: true,
    liveUrl: "",
    githubUrl: "https://github.com/Fyxis",
    impact: "Zero-loss atomic inventory reservations during concurrent checkouts, with automated payment verification and real-time shipping calculation."
  },
  {
    id: "kt-present-clan",
    title: "KT Present Clan Operations Hub",
    category: "Web SaaS",
    badge: "COMMUNITY SAAS & GAMING OPS",
    description: "Cloud-native Roblox clan attendance & event management system featuring Discord Bot real-time synchronization, PIN authentication, and automated leaderboards.",
    fullDescription: "Specialized operations hub for Kang Tabrak Familia (KT) clan built with Next.js 14, TypeScript, and Supabase PostgreSQL. Features a secure Moderator Gate PIN authentication, real-time Discord Bot API member synchronization (capturing nicknames, avatars, and role hierarchies while filtering bots), Roblox IGN linking, 4-state interactive attendance marking (Present, Excused, Sick, Absent) with bulk controls, instant Discord Markdown announcement generator, CSV data export, and automated top-tier activity leaderboards.",
    tags: ["Next.js 14", "TypeScript", "Supabase", "PostgreSQL", "Discord Bot API", "Tailwind CSS"],
    image: "/images/realtimeChatApp.svg",
    featured: true,
    liveUrl: "",
    githubUrl: "https://github.com/Fyxis",
    impact: "Streamlined clan event operations from hours of manual tracking to automated 1-click Discord roll-calls and real-time member engagement analytics."
  }
];

async function updateProjects() {
  console.log("1. Updating local portfolio-store.json...");
  const storePath = path.join(__dirname, "..", "data", "portfolio-store.json");
  const store = JSON.parse(fs.readFileSync(storePath, "utf-8"));
  store.projects = SHOWCASE_PROJECTS;
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf-8");
  console.log(`Saved ${SHOWCASE_PROJECTS.length} projects to portfolio-store.json`);

  console.log("2. Connecting to Supabase PostgreSQL...");
  const client = new Client({
    host: "db.znyieftopafeywpkscgt.supabase.co",
    port: 5432,
    user: "postgres",
    password: env.SUPABASE_PASS,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Supabase!");

  console.log("3. Clearing and inserting projects into Supabase...");
  await client.query("DELETE FROM projects");

  for (let i = 0; i < SHOWCASE_PROJECTS.length; i++) {
    const pr = SHOWCASE_PROJECTS[i];
    await client.query(
      `
      INSERT INTO projects (
        id, title, category, badge, description, full_description,
        tags, image, live_url, github_url, impact, order_index
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `,
      [
        pr.id,
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
    console.log(`  -> Inserted: ${pr.title}`);
  }

  const res = await client.query("SELECT COUNT(*) FROM projects");
  console.log(`Supabase projects table now has ${res.rows[0].count} projects.`);

  await client.end();
  console.log("Showcase projects updated successfully in both local store and Supabase!");
}

updateProjects().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
