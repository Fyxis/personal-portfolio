"use client";

import React from "react";
import { ArrowRight, Github, Linkedin, Instagram, Globe, Sparkles, MapPin, Briefcase, FileCode } from "lucide-react";
import { PortfolioStore } from "@/lib/db";
import { TerminalWidget } from "./TerminalWidget";

interface HeroProps {
  data?: PortfolioStore["profile"];
}

export const Hero: React.FC<HeroProps> = ({ data }) => {
  const profile = data || {
    fullName: "Adrianus Bagus Setiaji",
    nickname: "Bagus",
    handle: "Fyxis",
    title: "Technical Project Manager & Full Stack Engineer",
    company: "Newsaint Digital Solution",
    companyUrl: "https://newsaint.web.id",
    location: "Semarang, Indonesia (Worldwide Remote)",
    status: "Available for Strategic Projects & Leadership",
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
    ],
  };

  return (
    <section id="about" className="relative pt-32 pb-20 md:py-36 px-6 md:px-12 max-w-[1600px] mx-auto overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#10B981] rounded-full blur-[220px] opacity-[0.08] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#06B6D4] rounded-full blur-[220px] opacity-[0.08] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-25 pointer-events-none" />

      {/* 2-Column Asymmetric Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        {/* Left Column: Personal Executive Overview */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Live Availability Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-xs font-mono font-bold text-[#34D399] tracking-wider uppercase">
              {profile.status}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Adrianus Bagus Setiaji
            </h1>
            <p className="text-xl sm:text-2xl font-mono text-[#06B6D4] font-semibold tracking-tight">
              Technical Project Manager & Full Stack Software Engineer
            </p>
          </div>

          {/* Bio Paragraph */}
          <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-normal">
            Co-Founder at <a href={profile.companyUrl} target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-[#34D399] underline underline-offset-4 decoration-[#10B981]/40">{profile.company}</a>. Bridging high-velocity backend & frontend engineering with disciplined, transparent, and measurable agile project delivery.
          </p>

          {/* Inline Minimalist Metrics Chips */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-4 py-2 rounded-xl bg-[#0E141F] border border-white/5 flex items-center gap-2.5">
              <span className="font-heading font-black text-white text-base">4+ Years</span>
              <span className="text-xs text-gray-400 font-mono">Software Dev</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#0E141F] border border-white/5 flex items-center gap-2.5">
              <span className="font-heading font-black text-[#10B981] text-base">15+</span>
              <span className="text-xs text-gray-400 font-mono">Shipped Systems</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-[#0E141F] border border-white/5 flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span className="text-xs text-gray-300 font-mono">Semarang, ID (Worldwide Remote)</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="bg-[#10B981] hover:bg-[#059669] text-[#06090E] px-7 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all inline-flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 cursor-pointer font-mono"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#contact"
              className="bg-[#0E141F] hover:bg-[#131A27] border border-white/10 hover:border-[#10B981]/40 text-gray-200 hover:text-white px-7 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all inline-flex items-center gap-2 cursor-pointer font-mono"
            >
              <span>Initiate Discussion</span>
            </a>

            {/* Social Icons Inline */}
            <div className="flex items-center gap-2 ml-1 text-gray-400">
              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#0E141F] border border-white/5 hover:border-[#10B981]/50 hover:text-white transition-all hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socials.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#0E141F] border border-white/5 hover:border-[#10B981]/50 hover:text-white transition-all hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Developer Terminal Widget */}
        <div className="lg:col-span-5">
          <TerminalWidget />
        </div>
      </div>
    </section>
  );
};
