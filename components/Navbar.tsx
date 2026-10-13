"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { MessageSquare, Menu, X, ArrowUpRight } from "lucide-react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = ["about", "arsenal", "expertise", "projects", "experience", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "ABOUT", href: "#about", id: "about" },
    { label: "ARSENAL", href: "#arsenal", id: "arsenal" },
    { label: "EXPERTISE", href: "#expertise", id: "expertise" },
    { label: "PROJECTS", href: "#projects", id: "projects" },
    { label: "EXPERIENCE", href: "#experience", id: "experience" },
    { label: "CONTACT", href: "#contact", id: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#06090E]/95 backdrop-blur-xl border-b border-white/5 py-3.5 shadow-xl"
          : "bg-transparent py-5 md:py-6"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-mono font-medium tracking-wider text-gray-400">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`transition-colors cursor-pointer ${
                  isActive
                    ? "text-[#10B981] font-bold"
                    : "hover:text-white"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="https://newsaint.web.id"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg text-[11px] font-mono text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>NEWSAINT Studio</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#06B6D4]" />
          </a>

          <a
            href="#contact"
            className="bg-[#10B981] hover:bg-[#059669] text-[#06090E] px-5 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition-all inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <a
            href="#contact"
            className="bg-[#10B981] text-[#06090E] px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer"
          >
            Contact
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-8 h-8 rounded-lg bg-[#0E141F] border border-white/10 flex items-center justify-center text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0F17] border-b border-white/10 px-6 py-6 transition-all">
          <div className="flex flex-col gap-3 font-mono text-xs">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-[#10B981] py-1.5 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
