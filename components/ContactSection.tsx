"use client";

import React, { useState } from "react";
import { MessageSquare, Mail, MapPin, Send, CheckCircle2, ArrowUpRight, Github, Linkedin, Instagram, PhoneCall, Sparkles } from "lucide-react";
import { PortfolioStore } from "@/lib/db";

interface ContactSectionProps {
  profile?: PortfolioStore["profile"];
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Build Web Application / SaaS",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const userProfile = profile || {
    fullName: "Adrianus Bagus Setiaji",
    nickname: "Bagus",
    handle: "Fyxis",
    title: "Technical Project Manager & Full Stack Engineer",
    company: "Newsaint Digital Solution",
    companyUrl: "https://newsaint.web.id",
    location: "Semarang, Indonesia (Worldwide Remote)",
    status: "Available for Strategic Projects & Leadership",
    bio: "",
    socials: {
      github: "https://github.com/Fyxis",
      linkedin: "https://www.linkedin.com/in/adrianus-bagus-737418259/",
      instagram: "https://www.instagram.com/bagus.jpeg",
      email: "bagusadrianus@gmail.com",
      whatsapp: "+6287868330917",
      website: "https://newsaint.web.id",
    },
    metrics: [],
  };

  const quickTopics = [
    "Build Web Application / SaaS",
    "Backend Architecture Consulting",
    "Agile Delivery & Technical PM",
    "Strategic Partnership & Advisory",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "Build Web Application / SaaS",
          message: "",
        });
      } else {
        setErrorMsg(data.error || "Failed to dispatch message.");
      }
    } catch (err) {
      setErrorMsg("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto border-t border-white/5 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
        <div>
          <span className="text-xs text-[#10B981] font-mono font-bold tracking-widest uppercase block mb-2">
            DIRECT DISPATCH & COLLABORATION
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Initiate Technical Collaboration.
          </h2>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm max-w-md font-mono leading-relaxed">
          Have a product concept, agile sprint management requirement, or want to discuss modern systems architecture? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Connect Channels */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-7 rounded-2xl bg-[#0B0F17] border border-white/5 space-y-6">
            <h3 className="font-heading text-xl font-bold text-white">
              Direct Channels
            </h3>

            <div className="space-y-4 text-xs font-mono">
              {/* WhatsApp direct */}
              <a
                href={`https://wa.me/${userProfile.socials.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#0E141F] border border-white/5 hover:border-[#10B981]/50 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">FAST RESPONSE</span>
                    <span className="text-white font-bold">WhatsApp Direct</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#10B981] transition-colors" />
              </a>

              {/* Email direct */}
              <a
                href={`mailto:${userProfile.socials.email}`}
                className="p-4 rounded-xl bg-[#0E141F] border border-white/5 hover:border-[#06B6D4]/50 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#06B6D4]/10 flex items-center justify-center text-[#06B6D4]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">DIRECT EMAIL</span>
                    <span className="text-white font-bold">{userProfile.socials.email}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#06B6D4] transition-colors" />
              </a>

              {/* Location */}
              <div className="p-4 rounded-xl bg-[#0E141F] border border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                  <MapPin className="w-4 h-4 text-[#10B981]" />
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">TIMEZONE</span>
                  <span className="text-white font-bold">Semarang, Indonesia (UTC+7 / Worldwide Remote)</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-white/5 flex items-center gap-2">
              {userProfile.socials.github && (
                <a
                  href={userProfile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#0E141F] border border-white/5 hover:border-[#10B981]/50 text-gray-400 hover:text-white transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {userProfile.socials.linkedin && (
                <a
                  href={userProfile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#0E141F] border border-white/5 hover:border-[#10B981]/50 text-gray-400 hover:text-white transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {userProfile.socials.instagram && (
                <a
                  href={userProfile.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#0E141F] border border-white/5 hover:border-[#10B981]/50 text-gray-400 hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Direct Message Form with Quick Topic Selector */}
        <div className="lg:col-span-7">
          <div className="p-7 sm:p-8 rounded-2xl bg-[#0B0F17] border border-white/5">
            <h3 className="font-heading text-xl font-bold text-white mb-2">
              Send a Direct Message
            </h3>
            <p className="text-gray-400 text-xs font-mono mb-6">
              Dispatches directly to my centralized communications inbox in real-time.
            </p>

            {submitted ? (
              <div className="py-12 px-6 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-center animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto mb-3" />
                <h4 className="font-heading text-xl font-bold text-white mb-2">
                  Message Successfully Dispatched!
                </h4>
                <p className="text-gray-300 text-xs sm:text-sm font-mono max-w-sm mx-auto mb-6">
                  Thank you for reaching out. Your transmission has been recorded and I will respond to your email promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                {/* Quick Topic Selector Chips */}
                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-2">
                    Quick Inquiry Focus
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickTopics.map((topic, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setFormData({ ...formData, subject: topic })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          formData.subject === topic
                            ? "bg-[#10B981] text-[#06090E] font-bold"
                            : "bg-[#0E141F] text-gray-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Morgan"
                      className="w-full bg-[#06090E] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#10B981] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@enterprise.com"
                      className="w-full bg-[#06090E] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#10B981] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1.5">
                    Project Details & Scope
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your product goals, architectural scope, or planned timelines..."
                    className="w-full bg-[#06090E] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#10B981] font-mono resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-[#06090E] py-3.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>DISPATCHING...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>DISPATCH MESSAGE NOW</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
