import React from "react";
import { Cpu, Zap, GitPullRequest, ShieldCheck, Check } from "lucide-react";

export const PhilosophySection = () => {
  const pillars = [
    {
      icon: <Cpu className="w-5 h-5 text-[#10B981]" />,
      title: "Scalable Architecture & Clean Code",
      description: "Eliminating technical debt through precise relational schema modeling, strict separation of concerns, and sub-second query latency.",
      points: ["Modular Component Architecture", "Type-safe DB Modeling (Drizzle/Prisma)", "Server Actions & Edge SSR Optimization"],
    },
    {
      icon: <GitPullRequest className="w-5 h-5 text-[#06B6D4]" />,
      title: "Frictionless Project Management",
      description: "Guiding software delivery with lean Agile execution: transparent technical scoping, velocity metrics, and proactive client communication.",
      points: ["Sprint Velocity & Risk Tracking", "Transparent Technical Scoping", "Continuous Stakeholder Alignment"],
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#34D399]" />,
      title: "End-to-End System Ownership",
      description: "Taking holistic accountability from Figma ergonomic wireframing and database design to cloud deployment and ongoing production reliability.",
      points: ["Figma Design Systems & Ergonomics", "Docker Containerization", "Automated CI/CD & Cloudflare Edge"],
    },
  ];

  return (
    <section className="py-20 px-6 md:px-12 max-w-[1600px] mx-auto border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="text-xs text-[#10B981] font-mono font-bold tracking-widest uppercase block mb-2">
            CORE PHILOSOPHY & WORK ETHIC
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            How I Architect & Lead Systems.
          </h2>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm max-w-md leading-relaxed font-mono">
          A rare synergy of deep software engineering capability and disciplined, results-driven technical project leadership.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar, idx) => (
          <div
            key={idx}
            className="p-8 rounded-2xl bg-[#0B0F17] border border-white/5 hover:border-[#10B981]/40 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0E141F] border border-white/10 flex items-center justify-center mb-6 group-hover:border-[#10B981]/50 group-hover:scale-105 transition-all">
                {pillar.icon}
              </div>

              <h3 className="font-heading text-xl font-bold text-white mb-3">
                {pillar.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                {pillar.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              {pillar.points.map((pt, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2 text-xs text-gray-300 font-mono">
                  <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
