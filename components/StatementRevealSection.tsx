"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface StatementRevealProps {
  badge?: string;
  statement?: string;
  buttonText?: string;
  buttonHref?: string;
}

export const StatementRevealSection: React.FC<StatementRevealProps> = ({
  badge = "ABOUT ME • CORE MANIFESTO",
  statement = "Bagus is a hyper-focused full stack engineer and technical project leader dedicated to engineering resilient cloud architectures, scalable web systems, and high-velocity digital products that empower ambitious teams to innovate at extreme speed.",
  buttonText = "EXPLORE ARSENAL & SYSTEMS",
  buttonHref = "#arsenal",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const words = statement.split(" ");

  useEffect(() => {
    let ticking = false;

    const calculateProgress = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Distance the container can scroll while sticky top-0 is locked in viewport
      const totalDistance = rect.height - windowHeight;

      if (totalDistance > 0) {
        // Distance traveled after reaching sticky top position (rect.top <= 0)
        const traveled = -rect.top;
        const progress = Math.min(Math.max(traveled / totalDistance, 0), 1);
        setScrollProgress(progress);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", calculateProgress, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateProgress);
    };
  }, []);

  return (
    // Outer scroll track: 300vh pins the viewport while the user scrolls to reveal
    <section ref={containerRef} className="relative h-[300vh] w-full bg-[#06090E]">
      {/* Pinned Sticky Viewport: Stays locked in place until text is 100% unblurred */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center px-6 md:px-12 z-20">
        {/* Cyber Emerald Ambient Glow Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981] rounded-full blur-[220px] opacity-[0.045] pointer-events-none" />

        <div className="max-w-5xl w-full text-left relative z-10">
          {/* Cyber Emerald Theme Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#34D399] text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>{badge}</span>
            </div>
          </div>

          {/* Editorial Text with Strict Sequential Word-by-Word Unblur */}
          <h2 className="font-heading font-semibold sm:font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.38] sm:leading-[1.32] tracking-tight text-white mb-10 select-text">
            {words.map((word, idx) => {
              // Word unblur range: starts at 0.03, finishes completely by 0.85
              const unblurStart = 0.03;
              const unblurEnd = 0.85;
              const step = (unblurEnd - unblurStart) / words.length;

              const wordStart = unblurStart + idx * step;
              const wordEnd = wordStart + step * 1.5;

              let wordFactor = 0;
              if (scrollProgress >= wordEnd) {
                wordFactor = 1;
              } else if (scrollProgress > wordStart) {
                wordFactor = (scrollProgress - wordStart) / (wordEnd - wordStart);
              }

              // Interactive hover highlight
              const isHovered =
                hoveredIndex !== null && Math.abs(hoveredIndex - idx) <= 1;

              // Before being scrolled: word is 100% blurred (16px), 12% opacity, dim gray
              // When reached: word unblurs smoothly to 0px blur, 100% opacity, pure solid white
              const blurPx = isHovered ? 0 : Math.max(0, 16 * (1 - wordFactor));
              const opacity = isHovered ? 1 : 0.12 + 0.88 * wordFactor;
              const isRevealed = wordFactor >= 0.85 || isHovered;

              return (
                <span
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="inline-block mr-[0.28em] transition-all duration-200 cursor-default"
                  style={{
                    filter: `blur(${blurPx.toFixed(1)}px)`,
                    opacity: opacity,
                    color: isRevealed ? "#FFFFFF" : "#6B7280",
                    transform: isHovered ? "translateY(-1px)" : "translateY(0)",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </h2>

          {/* Minimalist Outline Action Button - Appears once text reaches full reveal */}
          <div
            className="transition-all duration-500"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollProgress - 0.78) / 0.15)),
              transform: `translateY(${Math.max(0, (1 - scrollProgress) * 24)}px)`,
              pointerEvents: scrollProgress >= 0.82 ? "auto" : "none",
            }}
          >
            <Link
              href={buttonHref}
              className="px-6 py-3.5 rounded-xl bg-[#0E141F] border border-white/10 hover:border-[#10B981] text-xs font-mono font-bold uppercase tracking-wider text-white inline-flex items-center gap-3 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] group"
            >
              <span>{buttonText}</span>
              <ArrowUpRight className="w-4 h-4 text-[#10B981] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Scroll Progress & Status Indicator */}
          <div className="mt-8 flex items-center gap-3 text-[11px] font-mono text-gray-500">
            <span className="text-gray-400 uppercase tracking-widest">
              {scrollProgress < 0.85 ? "SCROLL TO UNBLUR" : "MANIFESTO UNLOCKED"}
            </span>
            <div className="w-32 h-[3px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#10B981] transition-all duration-75 shadow-[0_0_10px_#10B981]"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-[#10B981] font-bold">{Math.round(scrollProgress * 100)}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
