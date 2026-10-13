import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", showText = true }) => {
  return (
    <Link href="/#about" className={`flex items-center gap-3.5 group cursor-pointer ${className}`}>
      {/* Monogram Icon */}
      <div className="relative w-9 h-9 md:w-10 md:h-10 flex-shrink-0">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-[#10B981] rounded-xl blur-md opacity-35 group-hover:opacity-85 transition-opacity duration-300" />
        
        {/* SVG Container */}
        <div className="relative w-full h-full bg-[#0E141F] border border-white/10 group-hover:border-[#10B981]/70 rounded-xl p-1.5 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
            </defs>
            {/* Hexagon Outline */}
            <polygon
              points="50,6 90,28 90,72 50,94 10,72 10,28"
              fill="none"
              stroke="url(#logoGrad)"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Monogram Glyph: A + X + B */}
            <path
              d="M50 20 L26 74 L38 74 L50 46 L62 74 L74 74 L50 20 Z"
              fill="url(#logoGrad)"
            />
            <polygon
              points="38,58 62,58 58,50 42,50"
              fill="#0E141F"
              stroke="url(#logoGrad)"
              strokeWidth="2"
            />
            <circle cx="50" cy="38" r="3" fill="#06B6D4" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-black text-base md:text-lg tracking-wider text-white group-hover:text-white transition-colors">
              FYXIS
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          </div>
          <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
            Adrianus B. Setiaji
          </span>
        </div>
      )}
    </Link>
  );
};
