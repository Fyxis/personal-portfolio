export interface Project {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  fullDescription: string;
  tags: string[];
  image: string;
  featured?: boolean;
  liveUrl?: string;
  githubUrl?: string;
  impact?: string;
}

export interface Specialization {
  number: string;
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  icon: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  description: string;
  highlights: string[];
}

export const PORTFOLIO_DATA = {
  profile: {
    fullName: "Adrianus Bagus Setiaji",
    nickname: "Bagus",
    handle: "Fyxis",
    title: "Full Stack Engineer & Technical Project Manager",
    company: "Newsaint Digital Solution",
    companyUrl: "https://newsaint.web.id",
    location: "Semarang, Indonesia (Available Worldwide)",
    status: "Open for High-Impact Projects",
    bio: "Co-Founder and Technical PM / Full Stack Engineer at NEWSAINT. Experienced in spearheading modern software development lifecycles, architecting resilient backend systems, and crafting blazingly fast web applications with uncompromising engineering standards.",
    socials: {
      github: "https://github.com/Fyxis",
      linkedin: "https://www.linkedin.com/in/adrianus-bagus-737418259/",
      instagram: "https://www.instagram.com/bagus.jpeg",
      email: "bagusadrianus@gmail.com",
      website: "https://newsaint.web.id",
    },
    metrics: [
      { value: "4+", label: "Years of Experience", sublabel: "Engineering & Delivery" },
      { value: "15+", label: "Systems Deployed", sublabel: "SaaS & Cloud Solutions" },
      { value: "Co-Founder", label: "NEWSAINT Studio", sublabel: "Newsaint Digital Solution" },
      { value: "99.9%", label: "Uptime & Reliability", sublabel: "Next.js & Cloud Architecture" },
    ],
  },

  specializations: [
    {
      number: "01",
      title: "Full Stack Engineering",
      tagline: "High-Performance Modern Web",
      description: "Building bleeding-edge web platforms with Next.js App Router, React 19, TypeScript, and modular architecture engineered for sub-second response times.",
      technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Server Actions"],
      icon: "Code2",
    },
    {
      number: "02",
      title: "Project Management & Delivery",
      tagline: "Agile Workflow & Cross-Functional Leadership",
      description: "Spearheading product lifecycles from scoping and sprint planning to zero-downtime deployment with transparent, bureaucracy-free execution.",
      technologies: ["Agile / Scrum", "Sprint Scoping", "Architecture Design", "Team Leadership"],
      icon: "Layers",
    },
    {
      number: "03",
      title: "Backend & Scalable Architecture",
      tagline: "Resilient APIs & Database Modeling",
      description: "Engineering high-throughput REST & GraphQL APIs, relational database schemas (PostgreSQL / MySQL), ORM layers (Drizzle / Prisma), and Docker containerization.",
      technologies: ["PostgreSQL", "Node.js", "Drizzle ORM", "Docker", "REST API"],
      icon: "Server",
    },
    {
      number: "04",
      title: "Design Systems & UI/UX",
      tagline: "Precision Prototyping & Micro-Interactions",
      description: "Translating sophisticated concepts into ergonomic digital experiences featuring elegant dark palettes, glassmorphism, and fluid micro-interactions.",
      technologies: ["Figma Systems", "Micro-Interactions", "Responsive UX", "Accessibility"],
      icon: "PenTool",
    },
  ],

  techStack: [
    { name: "Next.js 15", category: "App Router & SSR", color: "#FFFFFF" },
    { name: "React 19", category: "Modern Component Engine", color: "#00D8FF" },
    { name: "TypeScript", category: "Type-Safe Core", color: "#3178C6" },
    { name: "Tailwind CSS", category: "Modern Styling Engine", color: "#38BDF8" },
    { name: "Node.js", category: "Runtime Environment", color: "#68A063" },
    { name: "PostgreSQL", category: "Relational Database", color: "#336791" },
    { name: "Drizzle ORM", category: "Type-Safe DB Layer", color: "#C5F74F" },
    { name: "Docker", category: "Containerization", color: "#2496ED" },
    { name: "Cloudflare", category: "Edge & CDN", color: "#F38020" },
    { name: "Figma", category: "Design System & UX", color: "#F24E1E" },
    { name: "Git & GitHub", category: "Version Control", color: "#F05032" },
    { name: "Express.js", category: "RESTful Services", color: "#EEEEEE" },
  ],

  projects: [
    {
      id: "newsaint-platform",
      title: "NEWSAINT Digital Platform",
      category: "Web SaaS",
      badge: "PRODUCTION STUDIO",
      description: "Official studio platform for Newsaint Digital Solution featuring a perfect 100 performance index, SSG + ISR architecture, and a dynamic multi-currency estimator.",
      fullDescription: "Flagship corporate platform for NEWSAINT studio engineered for extreme speed and global reach. Leverages Next.js App Router, customized Tailwind design tokens, bento grid interactions, and programmatic SEO architecture.",
      tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "SEO Suite"],
      image: "/images/banner-bg-2.jpg",
      featured: true,
      liveUrl: "https://newsaint.web.id",
      githubUrl: "https://github.com/Fyxis",
      impact: "Boosted high-value corporate inbound inquiries and standardized product delivery pipelines.",
    },
    {
      id: "scanly-pos",
      title: "Scanly Flow POS",
      category: "Web SaaS",
      badge: "POINT OF SALE SAAS",
      description: "Intelligent cloud-native point of sale solution for modern retail & F&B enterprises with real-time stock synchronization and analytical sales dashboards.",
      fullDescription: "Enterprise POS system cutting checkout durations by over 40%. Features multi-outlet inventory tracking, role-based access control, offline-first operation, and automated financial report generation.",
      tags: ["Next.js", "PostgreSQL", "Tailwind CSS", "REST API", "Analytics"],
      image: "/images/file-management-systems.svg",
      featured: true,
      liveUrl: "https://newsaint.web.id/#project",
      githubUrl: "https://github.com/Fyxis",
      impact: "Seamlessly handles thousands of inventory SKUs with sub-200ms transaction latencies.",
    },
    {
      id: "finsage-wealth",
      title: "FinSage Wealth Dashboard",
      category: "Web SaaS",
      badge: "FINANCIAL DASHBOARD",
      description: "Comprehensive multi-asset analytics suite with real-time net worth tracking, compound interest simulation, and automated transaction auditing.",
      fullDescription: "Institutional-grade wealth visualization hub displaying multi-portfolio allocations, historical cashflows, and interactive dark-themed performance charts.",
      tags: ["React", "TypeScript", "Tailwind CSS", "Chart.js", "PostgreSQL"],
      image: "/images/realtimeChatApp.svg",
      featured: true,
      liveUrl: "https://newsaint.web.id/#project",
      githubUrl: "https://github.com/Fyxis",
      impact: "Empowers clients with data-driven financial decision making through real-time portfolio tracking.",
    },
    {
      id: "arra-interior",
      title: "ARRA Interior Semarang",
      category: "Company Profile",
      badge: "HIGH-END ARCHITECTURE",
      description: "Luxury interior & architecture showcase featuring high-definition project galleries, interactive consultation estimators, and bespoke typography.",
      fullDescription: "Digital corporate experience for a premier interior architecture studio. Delivers ultra-responsive media viewports, categorical project filtering, and instant inquiry channels.",
      tags: ["Next.js", "Tailwind CSS", "Figma", "Responsive Web"],
      image: "/images/personal-website.svg",
      featured: false,
      liveUrl: "https://newsaint.web.id/#project",
      githubUrl: "https://github.com/Fyxis",
      impact: "Elevated qualified client consultation conversions by 65% within three months.",
    },
    {
      id: "sociora-engine",
      title: "Sociora Social Engine",
      category: "Full Stack",
      badge: "COMMUNITY PLATFORM",
      description: "Scalable interactive social engine featuring recursive comment threads, live notifications, real-time media feeds, and member governance.",
      fullDescription: "High-concurrency social community testing state management limits and real-time event streaming. Includes rich media attachments, bookmarking, and fine-grained privacy controls.",
      tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
      image: "/images/portfolio-design.svg",
      featured: false,
      liveUrl: "https://newsaint.web.id/#project",
      githubUrl: "https://github.com/Fyxis",
      impact: "Stateless decoupled architecture maintaining fluid 60fps responsiveness across mobile and desktop.",
    },
    {
      id: "realtime-chat",
      title: "Realtime Chat Network",
      category: "Full Stack",
      badge: "WEBSOCKET MESSAGING",
      description: "Instant messaging ecosystem featuring live presence status, encrypted chat rooms, media attachments, and real-time delivery receipts.",
      fullDescription: "WebSocket-driven communication backbone enabling low-overhead peer messaging without polling. Supports active typing indicators and persistent message histories.",
      tags: ["React", "Node.js", "Socket.io", "Express", "Tailwind CSS"],
      image: "/images/realtimeChatApp.svg",
      featured: false,
      liveUrl: "https://newsaint.web.id/#project",
      githubUrl: "https://github.com/Fyxis",
      impact: "Sub-100ms message dispatch latency across distributed regional node clusters.",
    },
    {
      id: "sport-garage",
      title: "Sport Garage E-Commerce",
      category: "UI/UX & Mobile",
      badge: "COMMERCE & DESIGN SYSTEM",
      description: "High-energy athletic apparel and gear e-commerce experience with faceted attribute filtering and a friction-free checkout flow.",
      fullDescription: "Dynamic storefront prototype designed with athletic ergonomics, punchy typography, and micro-card product interactions tailored for mobile conversion.",
      tags: ["Figma", "UI/UX Design", "Design System", "React"],
      image: "/images/sport-garage.svg",
      featured: false,
      liveUrl: "https://newsaint.web.id/#project",
      githubUrl: "https://github.com/Fyxis",
      impact: "Complete Figma design system library accelerating frontend implementation velocity.",
    },
    {
      id: "chronotask",
      title: "ChronoTask Productivity Suite",
      category: "Web SaaS",
      badge: "TASK MANAGEMENT",
      description: "Agile sprint coordination and daily workflow suite with intuitive Kanban boards, milestone metrics, and automatic completion analytics.",
      fullDescription: "Engineering task workspace offering custom swimlanes, deadline alerts, sprint retrospectives, and velocity metrics.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Drizzle ORM"],
      image: "/images/kelasku-design.svg",
      featured: false,
      liveUrl: "https://newsaint.web.id/#project",
      githubUrl: "https://github.com/Fyxis",
      impact: "Streamlines internal delivery cycles through real-time roadmap transparency.",
    },
  ],

  experiences: [
    {
      period: "2023 — Present",
      role: "Co-Founder & Technical PM / Full Stack Engineer",
      company: "Newsaint Digital Solution",
      companyUrl: "https://newsaint.web.id",
      location: "Semarang, Indonesia",
      description: "Directing technical planning and client delivery cycles for domestic and international ventures. Architecting modern web ecosystems, managing cloud infrastructure, and ensuring product velocity.",
      highlights: [
        "Architected and deployed 15+ corporate platforms, SaaS applications, and custom digital systems.",
        "Implemented high-performance Next.js 15, TypeScript, and Tailwind CSS pipelines achieving sub-second load times.",
        "Coordinated cross-functional teams (Engineering, UI/UX, QA) under high-velocity agile sprints.",
      ],
    },
    {
      period: "2022 — 2023",
      role: "Full Stack Software Engineer",
      company: "Independent Client Delivery",
      location: "Remote / Hybrid",
      description: "Designed and engineered bespoke end-to-end web applications ranging from interactive frontend experiences to scalable relational database architectures.",
      highlights: [
        "Engineered secure RESTful APIs with strict validation schemas, JWT authentication, and edge caching.",
        "Crafted accessible, conversion-focused user interfaces with smooth micro-interactions.",
        "Integrated critical third-party ecosystems including transactional email, cloud storage, and database persistence.",
      ],
    },
    {
      period: "2021 — 2022",
      role: "Frontend Developer & UI Specialist",
      company: "Digital Project Initiatives",
      location: "Semarang, Indonesia",
      description: "Explored modern frontend architectures, transitioned static interfaces into component-driven React ecosystems, and developed scalable Figma design systems.",
      highlights: [
        "Engineered foundational design systems establishing strict token hierarchy for spacing, typography, and contrast.",
        "Maximized Core Web Vitals performance benchmarks across mobile and desktop environments.",
      ],
    },
  ],
};
