import React from "react";
import { Calendar, MapPin, Check, ArrowUpRight, Award, Shield } from "lucide-react";
import { PortfolioStore } from "@/lib/db";

interface ExperienceSectionProps {
  items?: PortfolioStore["experiences"];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ items = [] }) => {
  return (
    <section id="experience" className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto border-t border-white/5 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
        <div>
          <span className="text-xs text-[#06B6D4] font-mono font-bold tracking-widest uppercase block mb-2">
            CAREER LEDGER & TRACK RECORD
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Professional Track Record.
          </h2>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm max-w-md font-mono leading-relaxed">
          Demonstrated excellence in architecting digital products, steering engineering sprints, and completing mission-critical client deliveries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Timeline Ledger */}
        <div className="lg:col-span-8 space-y-5">
          {items.map((exp, idx) => (
            <div
              key={exp.id || idx}
              className="p-7 rounded-2xl bg-[#0B0F17] border border-white/5 hover:border-[#10B981]/40 hover:bg-[#0E141F] transition-all duration-300"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-[#10B981] px-2.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                      {exp.period}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] font-mono font-bold text-[#06B6D4] px-2 py-0.5 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20">
                        CURRENT ROLE
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-0.5">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <span className="text-gray-300 font-semibold">{exp.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#10B981]" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {exp.companyUrl && (
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#06090E] border border-white/5 text-gray-400 hover:text-white hover:border-[#10B981]/40 transition-colors"
                    title="Company Website"
                  >
                    <ArrowUpRight className="w-4 h-4 text-[#10B981]" />
                  </a>
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                {exp.description}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-white/5">
                {exp.highlights?.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2 text-xs text-gray-400 font-mono">
                    <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Leadership & Studio Card */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-7 rounded-2xl bg-[#0B0F17] border border-white/5 space-y-5">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Shield className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#06B6D4] font-bold block mb-1">
                ENTREPRENEURIAL LEADERSHIP
              </span>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                Co-Founder @ Newsaint Digital Solution
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                Together with the NEWSAINT engineering squad, we build enterprise web systems, high-performance SaaS applications, and modern digital platforms worldwide.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-gray-400">
                <span>Methodology:</span>
                <span className="text-white font-bold">Agile & Scrum</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Core Focus:</span>
                <span className="text-white font-bold">Architecture & Delivery</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Location:</span>
                <span className="text-white font-bold">Semarang, ID (Remote)</span>
              </div>
            </div>

            <a
              href="https://newsaint.web.id"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0E141F] hover:bg-[#131A27] text-white border border-white/10 hover:border-[#10B981]/50 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
            >
              <span>Visit Studio Website</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
