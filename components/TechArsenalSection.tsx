"use client";

import React, { useState } from "react";
import { PortfolioStore } from "@/lib/db";
import { Wrench, Layers, Server, Code, Palette, Shield } from "lucide-react";

interface TechArsenalProps {
  items?: PortfolioStore["techStack"];
}

export const TechArsenalSection: React.FC<TechArsenalProps> = ({ items = [] }) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = [
    { id: "All", label: "All Stacks" },
    { id: "Frontend", label: "Frontend & UI" },
    { id: "Backend", label: "Backend & Cloud" },
    { id: "DevOps", label: "DevOps & Tooling" },
  ];

  const getDomain = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("next") || n.includes("react") || n.includes("tailwind") || n.includes("typescript") || n.includes("figma")) {
      return "Frontend";
    }
    if (n.includes("node") || n.includes("postgre") || n.includes("drizzle") || n.includes("python") || n.includes("sql") || n.includes("express")) {
      return "Backend";
    }
    return "DevOps";
  };

  const filteredItems = items.filter((item) => {
    if (activeCategory === "All") return true;
    return getDomain(item.name) === activeCategory;
  });

  return (
    <section id="arsenal" className="py-20 px-6 md:px-12 max-w-[1600px] mx-auto border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <span className="text-xs text-[#06B6D4] font-mono font-bold tracking-widest uppercase block mb-2">
            TECHNICAL ARSENAL & TOOLCHAIN
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Production Tools & Tech Stack.
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#10B981] text-[#06090E] font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-[#0E141F] text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tech Matrix Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {filteredItems.map((tech) => (
          <div
            key={tech.id || tech.name}
            className="p-4 rounded-xl bg-[#0B0F17] border border-white/5 hover:border-[#10B981]/40 hover:bg-[#0E141F] transition-all duration-200 group flex flex-col justify-between cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: tech.color || "#10B981", boxShadow: `0 0 10px ${tech.color || "#10B981"}66` }}
              />
              <span className="text-[10px] font-mono text-gray-500 uppercase">
                {getDomain(tech.name)}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#34D399] transition-colors">
                {tech.name}
              </h4>
              <p className="text-[11px] font-mono text-gray-400 line-clamp-1 mt-0.5">
                {tech.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
