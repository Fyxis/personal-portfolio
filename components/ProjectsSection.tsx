"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, X, ExternalLink, Github, CheckCircle, Sparkles, FolderCode } from "lucide-react";
import { PortfolioStore } from "@/lib/db";

type Project = PortfolioStore["projects"][0];

interface ProjectsSectionProps {
  items?: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ items = [] }) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelectedProject(null);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedProject]);

  const categories = ["All", "Web SaaS", "Full Stack", "Company Profile", "UI/UX & Mobile"];

  const filteredProjects =
    activeCategory === "All"
      ? items
      : items.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto border-t border-white/5 relative">
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#06B6D4] rounded-full blur-[220px] opacity-[0.05] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="text-xs text-[#10B981] font-mono font-bold tracking-widest uppercase block mb-2">
            ENGINEERING CASE STUDIES
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
            Selected Engineering Projects.
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xl font-mono">
            A curated portfolio of full-stack web platforms, microservices, and client digital products built for speed, resilience, and architectural elegance.
          </p>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B0F17] border border-white/5 text-[11px] font-mono text-gray-400">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>PRODUCTION & CLIENT ARCHIVES</span>
        </div>
      </div>

      {/* If projects exist, show category filter */}
      {items.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all border whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#10B981] border-[#10B981] text-[#06090E] font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-[#0E141F] border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* If projects is EMPTY */}
      {items.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-2xl bg-[#0B0F17] border border-white/5 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#0E141F] border border-white/10 flex items-center justify-center text-[#10B981] mb-5 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <FolderCode className="w-7 h-7 text-[#10B981]" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[11px] font-mono text-[#34D399] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>ARCHIVE CURRENTLY BEING CURATED</span>
            </div>

            <h3 className="font-heading text-xl font-bold text-white mb-2">
              Case Study Showcase in Preparation
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-mono">
              System architecture documentation, open-source repositories, and selected commercial platforms are currently being refined for public release.
            </p>
          </div>
        </div>
      ) : (
        /* Projects List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="p-6 rounded-2xl bg-[#0B0F17] border border-white/5 hover:border-[#10B981]/50 hover:bg-[#0E141F] transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20 uppercase">
                    {project.badge}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#131A27] flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#10B981] group-hover:text-[#06090E] transition-all">
                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  </div>
                </div>

                {project.image && (
                  <div className="w-full h-44 rounded-xl overflow-hidden mb-4 border border-white/5 bg-[#06090E] relative flex items-center justify-center p-3 group-hover:border-[#10B981]/30 transition-all">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-[#10B981] transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#06090E] border border-white/5 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#06090E] text-gray-500">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
                <span className="text-gray-500">{project.category}</span>
                <span className="text-[#10B981] group-hover:underline flex items-center gap-1">
                  <span>View Details</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog Portaled directly to body */}
      {selectedProject && mounted && typeof document !== "undefined" && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-[#0B0F17] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold text-[#10B981] tracking-wider uppercase mb-2 block">
              {selectedProject.badge} • {selectedProject.category}
            </span>

            <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mb-4">
              {selectedProject.title}
            </h3>

            {selectedProject.image && (
              <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden mb-6 border border-white/10 bg-[#06090E] relative flex items-center justify-center p-4">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}

            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-normal">
              {selectedProject.fullDescription || selectedProject.description}
            </p>

            {selectedProject.impact && (
              <div className="p-4 rounded-xl bg-[#0E141F] border border-white/5 mb-6 flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase text-white mb-0.5 font-mono">
                    Key Impact & Results
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-mono">
                    {selectedProject.impact}
                  </p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold text-gray-400 uppercase mb-2">
                Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(selectedProject.tags)
                  ? selectedProject.tags
                  : typeof selectedProject.tags === "string"
                  ? (selectedProject.tags as string).split(",")
                  : []
                ).map((t: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1 rounded-lg bg-[#0E141F] border border-white/5 text-gray-300"
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#10B981] hover:bg-[#059669] text-[#06090E] px-6 py-2.5 rounded-xl text-xs font-bold font-mono uppercase inline-flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Visit Live Demo</span>
                </a>
              )}
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0E141F] hover:bg-[#131A27] border border-white/10 text-gray-300 hover:text-white px-6 py-2.5 rounded-xl text-xs font-bold font-mono uppercase inline-flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
