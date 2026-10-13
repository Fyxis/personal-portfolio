"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatementRevealSection } from "@/components/StatementRevealSection";
import { PhilosophySection } from "@/components/PhilosophySection";
import { TechArsenalSection } from "@/components/TechArsenalSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { PortfolioSkeleton } from "@/components/PortfolioSkeleton";
import { PortfolioStore } from "@/lib/db";

export default function Home() {
  const [store, setStore] = useState<PortfolioStore | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPortfolio() {
      try {
        const res = await fetch("/api/portfolio", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load portfolio");
        const data = await res.json();
        if (isMounted) {
          setStore(data);
        }
      } catch (err) {
        console.error("Error loading portfolio from database:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading || !store) {
    return <PortfolioSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#06090E] text-[#F8FAFC] selection:bg-[#10B981]/30 selection:text-[#10B981] relative overflow-x-clip">
      <Navbar />
      <main>
        <Hero data={store.profile} />
        <StatementRevealSection />
        <PhilosophySection />
        <TechArsenalSection items={store.techStack} />
        <SkillsSection items={store.specializations} />
        <ProjectsSection items={store.projects} />
        <ExperienceSection items={store.experiences} />
        <ContactSection profile={store.profile} />
      </main>
      <Footer profile={store.profile} />
    </div>
  );
}
