<div align="center">

# ⚡ Adrianus Bagus Setiaji (Fyxis) — Personal Portfolio & CMS

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

**High-performance, full-stack personal portfolio and production-ready Admin CMS engineered for extreme speed, rich micro-interactions, and enterprise-grade reliability.**

[🌐 Live Platform](https://newsaint.web.id) • [💼 LinkedIn](https://www.linkedin.com/in/adrianus-bagus-737418259/) • [🐙 GitHub](https://github.com/Fyxis) • [✉️ Email](mailto:bagusadrianus@gmail.com)

</div>

---

## 🎯 Overview

This repository houses the modern, high-velocity engineering portfolio of **Adrianus Bagus Setiaji (`@Fyxis`)** — Co-Founder & Technical Project Manager / Full Stack Engineer at **Newsaint Digital Solution**. 

Migrated from legacy Create React App (CRA) to a cutting-edge **Next.js 14 App Router** architecture, this project integrates directly with a live **Supabase PostgreSQL** cluster for dynamic content updates, media storage, visitor inquiries, and an intuitive Admin Command Center.

---

## ✨ Key Features & Architectural Highlights

### 🖥️ Frontend & Interactive UX
- **Interactive Terminal Telemetry Widget**: Simulates terminal commands (`fyxis --inspect --live-status`), dynamic typing streams, mission outputs, and fast-forward/replay controls.
- **Sticky Scroll Manifesto Section**: High-impact scroll-locked text reveal that unblurs manifesto statements line-by-line using `requestAnimationFrame` before unlocking the page flow.
- **Project Showcase & Modal Portal**: Bento-grid case studies with category filtering (`Web SaaS`, `Full Stack`, `Company Profile`, `UI/UX & Mobile`) and SSR-safe React Portal modals (`z-[9999]`) preventing CSS parent clipping.
- **Direct Dispatch Collaboration Form**: Visitor inquiry form with quick topic chips, validation, and real-time submission to database.
- **Cyber & Dark Carbon Design System**: Tailored aesthetics built on `#06090E` (Carbon Dark), `#10B981` (Cyber Emerald), and `#06B6D4` (Electric Cyan).

### ⚙️ Backend, CMS & Database
- **Full-featured Admin Command Center (`/admin`)**: Password-authenticated CMS with tabs to manage Profile, Projects, Tech Stack, Experiences, Specializations, and Media.
- **PostgreSQL Pool & Transactional Persistence**: Robust relational persistence with ACID transactions for content synchronization.
- **Direct Image Upload & Media Backup**: Built-in `/api/upload` endpoint saving images to `public/uploads` with base64 data persistence in Supabase `media` table.
- **Visitor Message Inbox**: View, count, and manage direct inquiries from recruiters and clients in real time.
- **Offline / Failover Resiliency**: If external database connectivity is unavailable, the application gracefully falls back to local data snapshots (`data/portfolio-store.json`).

### 🔍 Search Engine Optimization (SEO)
- **SERP-Optimized Title & Metadata**: High-CTR title hierarchy (`Adrianus Bagus Setiaji (Fyxis) | Technical PM & Full Stack Engineer`).
- **Dynamic Sitemap (`/sitemap.xml`)**: Automated indexing via Next.js metadata route (`app/sitemap.ts`).
- **Schema.org Structured Data**: Integrated JSON-LD (`Person` & `WebSite` graph) for Google Knowledge Graph readiness.
- **Social Sharing Previews**: Open Graph 1200×630 banners and Twitter `summary_large_image` cards.
- **Crawler Protection**: `robots.txt` and `robots: { index: false, follow: false }` shielding the `/admin` command center and internal `/api/` routes.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 18](https://react.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/), `tailwind-merge`, `clsx` |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [Supabase](https://supabase.com/) & [PostgreSQL](https://www.postgresql.org/) (`pg` connection pool) |
| **Fonts** | Google Fonts: `Space Grotesk` (Body) & `Archivo` (Headings) |

---

## 📁 Project Structure

```text
personal-portfolio/
├── app/                        # Next.js 14 App Router
│   ├── admin/                  # Admin Command Center & CMS
│   │   ├── layout.tsx          # Admin layout (robots: noindex, nofollow)
│   │   └── page.tsx            # Protected CMS interface
│   ├── api/                    # Serverless backend route handlers
│   │   ├── admin/seed/         # Import/clear sample projects
│   │   ├── auth/               # Password verification & change password
│   │   ├── media/[filename]/   # Dynamic media streaming fallback
│   │   ├── messages/           # Contact form dispatch & inbox CRUD
│   │   ├── portfolio/          # Public GET & Admin POST sync
│   │   └── upload/             # Image file upload handler
│   ├── globals.css             # Tailwind base & custom utilities
│   ├── layout.tsx              # Root layout with SEO & JSON-LD
│   ├── page.tsx                # Main portfolio landing page
│   └── sitemap.ts              # Automated dynamic sitemap.xml
├── components/                 # Reusable UI component modules
│   ├── ContactSection.tsx      # Contact dispatch form & quick chips
│   ├── ExperienceSection.tsx   # Professional experience timeline
│   ├── Footer.tsx              # Footer credits & social links
│   ├── Hero.tsx                # Hero section with bio & metrics
│   ├── Logo.tsx                # SVG Monogram logo with emerald glow
│   ├── Navbar.tsx              # Fixed blur navigation with scrollspy
│   ├── PhilosophySection.tsx   # Engineering & leadership pillars
│   ├── PortfolioSkeleton.tsx   # Cyber skeleton loading screen
│   ├── ProjectsSection.tsx     # Case studies & interactive modal portal
│   ├── SkillsSection.tsx       # Core engineering capabilities
│   ├── StatementRevealSection.tsx # Sticky scroll manifesto unblur
│   ├── TechArsenalSection.tsx  # Production tools & category filter
│   └── TerminalWidget.tsx      # Interactive terminal typewriter widget
├── data/                       # Local data stores & fallback schemas
│   ├── portfolio-store.json    # Local JSON fallback store
│   ├── portfolioData.ts        # Default seed profile & experiences
│   └── sample-projects.json    # Showcase project templates
├── design-system/              # Design tokens & color specs (MASTER.md)
├── lib/                        # Core backend libraries & DB pool
│   ├── db.ts                   # Unified DB layer with auto-failover
│   ├── supabase.ts             # Supabase PostgreSQL client & query methods
│   └── utils.ts                # Class name merger (clsx + tailwind-merge)
├── public/                     # Static assets (images, logos, robots, manifest)
│   ├── images/                 # Project screenshots & branding badges
│   └── uploads/                # User uploaded screenshots from CMS
├── scripts/                    # Migration & database maintenance scripts
├── .env.example                # Template for environment variables
├── next.config.js              # Next.js compiler settings
├── tailwind.config.js          # Tailwind theme tokens & color definitions
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm** (or yarn / pnpm)
- A [Supabase](https://supabase.com/) project with PostgreSQL database

### 2. Installation
Clone the repository:
```bash
git clone https://github.com/Fyxis/personal-portfolio.git
cd personal-portfolio
```

Install dependencies:
```bash
npm install
```

### 3. Environment Variables Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your Supabase connection parameters:
```env
# SUPABASE DATABASE CONFIG
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_PASS=your-database-password

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Database Setup & Migration (Optional)
Run the migration script to automatically create all required tables (`profile`, `specializations`, `tech_stack`, `projects`, `experiences`, `admin_settings`, `messages`, `media`):
```bash
node scripts/migrate-to-supabase.js
node scripts/create-media-table.js
```

### 5. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build
Verify compilation and produce optimized static bundles:
```bash
npm run build
npm run start
```

---

## 🔒 Security Best Practices

- Secret `.env` credentials are strictly ignored via `.gitignore` and never committed.
- Admin CMS routes and endpoints validate passwords against the database.
- Database operations utilize SQL parameter binding (`$1, $2, ...`) to eliminate SQL injection vulnerabilities.
- File uploads are validated for MIME type (`PNG, JPG, WEBP, SVG, GIF`) and size limited to 10MB.

---

## 👨‍💻 Author & Contact

**Adrianus Bagus Setiaji (`Fyxis`)**
* **Title**: Technical Project Manager & Senior Full Stack Engineer
* **Company**: Newsaint Digital Solution
* **Website**: [https://newsaint.web.id](https://newsaint.web.id)
* **GitHub**: [@Fyxis](https://github.com/Fyxis)
* **LinkedIn**: [adrianus-bagus-737418259](https://www.linkedin.com/in/adrianus-bagus-737418259/)
* **Email**: [bagusadrianus@gmail.com](mailto:bagusadrianus@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
