import React from "react";
import { Logo } from "./Logo";
import { ArrowUp, Github, Linkedin, Instagram, Globe } from "lucide-react";
import { PortfolioStore } from "@/lib/db";

interface FooterProps {
  profile?: PortfolioStore["profile"];
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const userProfile = profile || {
    fullName: "Adrianus Bagus Setiaji",
    nickname: "Bagus",
    handle: "Fyxis",
    company: "Newsaint Digital Solution",
    companyUrl: "https://newsaint.web.id",
    socials: {
      github: "https://github.com/Fyxis",
      linkedin: "https://www.linkedin.com/in/adrianus-bagus-737418259/",
      instagram: "https://www.instagram.com/bagus.jpeg",
      email: "bagusadrianus@gmail.com",
      website: "https://newsaint.web.id",
    },
  };

  return (
    <footer className="border-t border-white/5 bg-[#04060A] py-14 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/5">
          {/* Logo & Identity */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <Logo />
            <p className="text-xs text-gray-400 max-w-sm mt-1 font-mono">
              Co-Founder & Technical PM / Full Stack Engineer at NEWSAINT ({userProfile.company}).
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono font-semibold tracking-wider text-gray-400">
            <a href="#about" className="hover:text-white transition-colors">
              ABOUT
            </a>
            <a href="#arsenal" className="hover:text-white transition-colors">
              ARSENAL
            </a>
            <a href="#expertise" className="hover:text-white transition-colors">
              EXPERTISE
            </a>
            <a href="#projects" className="hover:text-white transition-colors">
              PROJECTS
            </a>
            <a href="#experience" className="hover:text-white transition-colors">
              EXPERIENCE
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              CONTACT
            </a>
          </div>

          {/* Social Icons & Back to top */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              {userProfile.socials.github && (
                <a
                  href={userProfile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:border-[#10B981]/50 hover:text-[#10B981] transition-all hover:scale-110 cursor-pointer"
                  aria-label="GitHub"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {userProfile.socials.linkedin && (
                <a
                  href={userProfile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:border-[#10B981]/50 hover:text-[#10B981] transition-all hover:scale-110 cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {userProfile.socials.instagram && (
                <a
                  href={userProfile.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:border-[#10B981]/50 hover:text-[#10B981] transition-all hover:scale-110 cursor-pointer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              {userProfile.socials.website && (
                <a
                  href={userProfile.socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:border-[#10B981]/50 hover:text-[#10B981] transition-all hover:scale-110 cursor-pointer"
                  aria-label="NEWSAINT Website"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <a
              href="#about"
              className="w-9 h-9 rounded-full bg-[#10B981]/10 hover:bg-[#10B981] border border-[#10B981]/30 text-[#10B981] hover:text-[#06090E] flex items-center justify-center transition-all cursor-pointer shadow-sm"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="font-mono">
            © {new Date().getFullYear()} {userProfile.fullName} ({userProfile.handle}). All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 font-mono">
            <span>Powered by</span>
            <span className="text-gray-300 font-bold">Next.js 14</span>
            <span>&</span>
            <span className="text-[#10B981] font-bold">Cyber Architecture</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
