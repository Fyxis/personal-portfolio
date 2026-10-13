import React from "react";
import { Code2, Layers, Server, PenTool, CheckCircle2, Shield, Wrench, Terminal, Cpu, Zap, Sparkles, Database } from "lucide-react";
import { PortfolioStore } from "@/lib/db";

interface SkillsSectionProps {
  items?: PortfolioStore["specializations"];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ items = [] }) => {
  const iconMap: Record<string, React.ReactNode> = {
    Code2: <Code2 className="w-5 h-5" />,
    Layers: <Layers className="w-5 h-5" />,
    Server: <Server className="w-5 h-5" />,
    PenTool: <PenTool className="w-5 h-5" />,
    Shield: <Shield className="w-5 h-5" />,
    Wrench: <Wrench className="w-5 h-5" />,
    Terminal: <Terminal className="w-5 h-5" />,
    Cpu: <Cpu className="w-5 h-5" />,
    Zap: <Zap className="w-5 h-5" />,
    Sparkles: <Sparkles className="w-5 h-5" />,
    Database: <Database className="w-5 h-5" />,
  };

  return (
    <section id="expertise" className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto border-t border-white/5 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#10B981] rounded-full blur-[200px] opacity-[0.06] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
        <div>
          <span className="text-xs text-[#10B981] font-mono font-bold tracking-widest uppercase block mb-2">
            EXPERTISE & VALUE PROPOSITION
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Core Capabilities & Engineering Modules.
          </h2>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm max-w-md leading-relaxed font-mono">
          Translating high-level business vision into robust, scalable architectures engineered for production reliability.
        </p>
      </div>

      {/* 4 Architectural Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((spec) => (
          <div
            key={spec.id || spec.number}
            className="p-8 rounded-2xl bg-[#0B0F17] border border-white/5 hover:border-[#10B981]/40 hover:bg-[#0E141F] transition-all duration-300 flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#131A27] border border-white/10 flex items-center justify-center text-[#10B981] group-hover:scale-110 group-hover:bg-[#10B981]/10 transition-all">
                  {iconMap[spec.icon] || <Code2 className="w-5 h-5" />}
                </div>
                <span className="text-xs font-mono font-bold text-gray-500 tracking-widest">
                  MODULE {spec.number}
                </span>
              </div>

              <span className="text-xs font-mono font-semibold text-[#06B6D4] block mb-1">
                {spec.tagline}
              </span>
              <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-[#34D399] transition-colors">
                {spec.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6 font-normal">
                {spec.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
              {spec.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#06090E] border border-white/5 text-[11px] font-mono text-gray-300"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
