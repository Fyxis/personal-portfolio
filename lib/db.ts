import fs from "fs";
import path from "path";
import {
  fetchPortfolioFromSupabase,
  savePortfolioToSupabase,
  getAdminPasswordFromSupabase,
  setAdminPasswordInSupabase,
  fetchMessagesFromSupabase,
  insertMessageIntoSupabase,
  deleteMessageFromSupabase,
} from "./supabase";

const DATA_FILE = path.join(process.cwd(), "data", "portfolio-store.json");

export interface PortfolioStore {
  admin: {
    password?: string;
  };
  profile: {
    fullName: string;
    nickname: string;
    handle: string;
    title: string;
    company: string;
    companyUrl: string;
    location: string;
    status: string;
    bio: string;
    socials: {
      github: string;
      linkedin: string;
      instagram: string;
      email: string;
      whatsapp: string;
      website: string;
    };
    metrics: Array<{
      value: string;
      label: string;
      sublabel: string;
    }>;
  };
  specializations: Array<{
    id: string;
    number: string;
    title: string;
    tagline: string;
    description: string;
    technologies: string[];
    icon: string;
  }>;
  techStack: Array<{
    id: string;
    name: string;
    desc: string;
    color: string;
  }>;
  projects: Array<{
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
  }>;
  experiences: Array<{
    id: string;
    period: string;
    role: string;
    company: string;
    companyUrl?: string;
    location: string;
    description: string;
    highlights: string[];
  }>;
  messages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    read?: boolean;
  }>;
}

// Synchronous local file read (fallback / cache)
export function getPortfolioStore(): PortfolioStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content) as PortfolioStore;
    }
  } catch (error) {
    console.warn("Could not read local portfolio file, using default structure:", error);
  }

  return {
    admin: { password: "admin" },
    profile: {
      fullName: "Adrianus Bagus Setiaji",
      nickname: "Bagus",
      handle: "Fyxis",
      title: "Full Stack Engineer & Technical PM",
      company: "Newsaint Digital Solution",
      companyUrl: "https://newsaint.web.id",
      location: "Semarang, Indonesia",
      status: "Available for Strategic Projects",
      bio: "Co-Founder and Technical PM / Full Stack Engineer at NEWSAINT. Proven track record leading modern software delivery cycles, architecting resilient backend systems, and shipping high-performance web applications with rigorous engineering standards.",
      socials: {
        github: "https://github.com/Fyxis",
        linkedin: "https://www.linkedin.com/in/adrianus-bagus-737418259/",
        instagram: "https://www.instagram.com/bagus.jpeg",
        email: "bagusadrianus@gmail.com",
        whatsapp: "+6287868330917",
        website: "https://newsaint.web.id",
      },
      metrics: [
        { value: "4+", label: "Years of Experience", sublabel: "Engineering & Delivery" },
        { value: "15+", label: "Digital Products", sublabel: "SaaS & Web Solutions" },
        { value: "Co-Founder", label: "NEWSAINT Studio", sublabel: "Newsaint Digital Solution" },
        { value: "99.9%", label: "System Reliability", sublabel: "Next.js & Cloud Core" },
      ],
    },
    specializations: [],
    techStack: [],
    projects: [],
    experiences: [],
    messages: [],
  };
}

// Synchronous local file save
export function savePortfolioStore(data: PortfolioStore): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving local portfolio data:", error);
    return false;
  }
}

// Asynchronous Supabase primary store operations
export async function getPortfolioStoreAsync(): Promise<PortfolioStore> {
  try {
    const supabaseData = await fetchPortfolioFromSupabase();
    // Cache locally
    savePortfolioStore(supabaseData);
    return supabaseData;
  } catch (error) {
    console.warn("Falling back to local cache due to Supabase fetch error:", error);
    return getPortfolioStore();
  }
}

export async function savePortfolioStoreAsync(data: PortfolioStore): Promise<boolean> {
  // Save to both Supabase and local cache
  savePortfolioStore(data);
  try {
    return await savePortfolioToSupabase(data);
  } catch (error) {
    console.error("Error persisting to Supabase:", error);
    return false;
  }
}

export {
  getAdminPasswordFromSupabase,
  setAdminPasswordInSupabase,
  fetchMessagesFromSupabase,
  insertMessageIntoSupabase,
  deleteMessageFromSupabase,
};
