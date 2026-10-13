"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderCode,
  Layers,
  Wrench,
  Briefcase,
  User,
  Mail,
  Lock,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  X,
  Shield,
  Terminal,
  Check,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { PortfolioStore } from "@/lib/db";
import { Logo } from "@/components/Logo";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminToken, setAdminToken] = useState("");

  // Store data
  const [storeData, setStoreData] = useState<PortfolioStore | null>(null);
  const [activeTab, setActiveTab] = useState<
    "projects" | "skills" | "tech" | "experience" | "profile" | "messages" | "security"
  >("projects");

  // Save status notification
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals for editing/adding
  const [projectModal, setProjectModal] = useState<{ open: boolean; item: any | null; isNew: boolean }>({
    open: false,
    item: null,
    isNew: false,
  });

  const [skillModal, setSkillModal] = useState<{ open: boolean; item: any | null; isNew: boolean }>({
    open: false,
    item: null,
    isNew: false,
  });

  const [techModal, setTechModal] = useState<{ open: boolean; item: any | null; isNew: boolean }>({
    open: false,
    item: null,
    isNew: false,
  });

  const [expModal, setExpModal] = useState<{ open: boolean; item: any | null; isNew: boolean }>({
    open: false,
    item: null,
    isNew: false,
  });

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Check existing session
  useEffect(() => {
    const savedToken = localStorage.getItem("fyxis_admin_token");
    if (savedToken) {
      setAdminToken(savedToken);
      setIsAuthenticated(true);
      fetchFullData(savedToken);
    }
  }, []);

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setSaveStatus({ type, message });
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAdminToken(data.token);
        localStorage.setItem("fyxis_admin_token", data.token);
        fetchFullData(data.token);
      } else {
        setAuthError(data.error || "Incorrect password. Please try again.");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fyxis_admin_token");
    setIsAuthenticated(false);
    setAdminToken("");
    setStoreData(null);
  };

  const fetchFullData = async (token: string) => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();

      // Also fetch messages
      const msgRes = await fetch("/api/messages", {
        headers: { "x-admin-auth": token },
      });
      const msgData = await msgRes.json();

      setStoreData({
        ...data,
        messages: msgData.messages || [],
      });
    } catch (err) {
      triggerToast("Failed to load data from server", "error");
    }
  };

  const saveToServer = async (newData: PortfolioStore) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": adminToken,
        },
        body: JSON.stringify(newData),
      });

      if (res.ok) {
        setStoreData(newData);
        triggerToast("Data successfully synced to Supabase!");
        return true;
      } else {
        const err = await res.json();
        triggerToast(err.error || "Failed to persist data", "error");
        return false;
      }
    } catch (err) {
      triggerToast("Network error while saving data", "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Projects CRUD
  const saveProject = async (project: any) => {
    if (!storeData) return;
    let updatedProjects = [...storeData.projects];

    const processed = {
      ...project,
      id: project.id || "proj-" + Date.now(),
      tags:
        typeof project.tags === "string"
          ? project.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : project.tags,
    };

    if (projectModal.isNew) {
      updatedProjects.unshift(processed);
    } else {
      updatedProjects = updatedProjects.map((p) =>
        p.id === project.id ? processed : p
      );
    }

    const success = await saveToServer({ ...storeData, projects: updatedProjects });
    if (success) {
      setProjectModal({ open: false, item: null, isNew: false });
    }
  };

  const deleteProject = async (id: string) => {
    if (!storeData || !confirm("Are you sure you want to delete this project?")) return;
    const updated = storeData.projects.filter((p) => p.id !== id);
    await saveToServer({ ...storeData, projects: updated });
  };

  const handleUploadProjectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-admin-auth": adminToken,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setProjectModal((prev) => ({
        ...prev,
        item: { ...prev.item, image: data.url },
      }));

      triggerToast("Image uploaded successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      triggerToast(err.message || "Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSeedProjects = async () => {
    if (!confirm("Import 6 sample production projects into the showcase?")) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": adminToken,
        },
        body: JSON.stringify({ action: "import_samples" }),
      });
      const data = await res.json();
      if (res.ok) {
        if (storeData) {
          setStoreData({ ...storeData, projects: data.projects });
        }
        triggerToast(`Successfully imported ${data.count} sample projects!`);
      }
    } catch (err) {
      triggerToast("Failed to load sample projects", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearProjects = async () => {
    if (!confirm("Clear all projects from showcase?")) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": adminToken,
        },
        body: JSON.stringify({ action: "clear_projects" }),
      });
      if (res.ok) {
        if (storeData) {
          setStoreData({ ...storeData, projects: [] });
        }
        triggerToast("Showcase projects cleared successfully!");
      }
    } catch (err) {
      triggerToast("Failed to clear projects", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Skills CRUD
  const saveSkill = async (skill: any) => {
    if (!storeData) return;
    let updated = [...storeData.specializations];

    const processed = {
      ...skill,
      id: skill.id || "spec-" + Date.now(),
      technologies:
        typeof skill.technologies === "string"
          ? skill.technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
          : skill.technologies,
    };

    if (skillModal.isNew) {
      updated.push(processed);
    } else {
      updated = updated.map((s) => (s.id === skill.id ? processed : s));
    }

    const success = await saveToServer({ ...storeData, specializations: updated });
    if (success) {
      setSkillModal({ open: false, item: null, isNew: false });
    }
  };

  const deleteSkill = async (id: string) => {
    if (!storeData || !confirm("Are you sure you want to delete this module?")) return;
    const updated = storeData.specializations.filter((s) => s.id !== id);
    await saveToServer({ ...storeData, specializations: updated });
  };

  // Tech Stack CRUD
  const saveTech = async (tech: any) => {
    if (!storeData) return;
    let updated = [...storeData.techStack];

    const processed = {
      ...tech,
      id: tech.id || "tech-" + Date.now(),
    };

    if (techModal.isNew) {
      updated.push(processed);
    } else {
      updated = updated.map((t) => (t.id === tech.id ? processed : t));
    }

    const success = await saveToServer({ ...storeData, techStack: updated });
    if (success) {
      setTechModal({ open: false, item: null, isNew: false });
    }
  };

  const deleteTech = async (id: string) => {
    if (!storeData || !confirm("Are you sure you want to delete this technology?")) return;
    const updated = storeData.techStack.filter((t) => t.id !== id);
    await saveToServer({ ...storeData, techStack: updated });
  };

  // Experience CRUD
  const saveExp = async (exp: any) => {
    if (!storeData) return;
    let updated = [...storeData.experiences];

    const processed = {
      ...exp,
      id: exp.id || "exp-" + Date.now(),
      highlights:
        typeof exp.highlights === "string"
          ? exp.highlights.split("\n").map((h: string) => h.trim()).filter(Boolean)
          : exp.highlights,
    };

    if (expModal.isNew) {
      updated.unshift(processed);
    } else {
      updated = updated.map((e) => (e.id === exp.id ? processed : e));
    }

    const success = await saveToServer({ ...storeData, experiences: updated });
    if (success) {
      setExpModal({ open: false, item: null, isNew: false });
    }
  };

  const deleteExp = async (id: string) => {
    if (!storeData || !confirm("Are you sure you want to delete this record?")) return;
    const updated = storeData.experiences.filter((e) => e.id !== id);
    await saveToServer({ ...storeData, experiences: updated });
  };

  // Messages
  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/messages?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-auth": adminToken },
      });
      if (res.ok) {
        if (storeData) {
          setStoreData({
            ...storeData,
            messages: storeData.messages.filter((m) => m.id !== id),
          });
        }
        triggerToast("Message deleted successfully");
      }
    } catch (err) {
      triggerToast("Failed to delete message", "error");
    }
  };

  // Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      triggerToast("Password confirmation does not match", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": adminToken,
        },
        body: JSON.stringify({ action: "change_password", newPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminToken(data.newToken);
        localStorage.setItem("fyxis_admin_token", data.newToken);
        setNewPassword("");
        setConfirmPassword("");
        triggerToast("Admin password successfully updated in Supabase!");
      } else {
        triggerToast(data.error || "Failed to update password", "error");
      }
    } catch (err) {
      triggerToast("Network error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // RENDER LOGIN VIEW (CYBER EMERALD THEME)
  // =========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06090E] flex items-center justify-center p-6 relative overflow-hidden text-[#F8FAFC] selection:bg-[#10B981]/30 selection:text-[#10B981]">
        {/* Cyber ambient glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981] rounded-full blur-[220px] opacity-[0.12] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#06B6D4] rounded-full blur-[200px] opacity-[0.08] pointer-events-none" />

        <div className="max-w-md w-full bg-[#0B0F17] border border-white/10 rounded-2xl p-8 sm:p-10 relative z-10 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
          <div className="flex flex-col items-center text-center mb-8">
            <Logo showText={false} className="mb-4" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[10px] font-mono text-[#10B981] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>SYSTEM_AUTH_GATEWAY // RESTRICTED</span>
            </div>

            <h1 className="font-heading text-2xl font-black tracking-tight text-white mb-2">
              FYXIS ADMIN CMS
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              Authentication required to manage showcase, stack, capabilities, and messages.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3.5 pr-11 text-sm text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-2 text-[11px] font-mono text-gray-500">
                Default password: <span className="text-[#10B981] font-bold">admin</span> (Can be modified inside).
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-[#06090E] py-3.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-white inline-flex items-center gap-1.5 font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER AUTHENTICATED DASHBOARD (CYBER EMERALD THEME)
  // =========================================================
  return (
    <div className="min-h-screen bg-[#06090E] text-[#F8FAFC] selection:bg-[#10B981]/30 selection:text-[#10B981]">
      {/* Toast Notification */}
      {saveStatus && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center gap-2.5 text-xs font-mono font-semibold animate-fadeIn ${
            saveStatus.type === "success"
              ? "bg-[#0B0F17] border-[#10B981]/50 text-[#34D399] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              : "bg-[#0B0F17] border-red-500/50 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          }`}
        >
          {saveStatus.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#06090E]/95 backdrop-blur-xl border-b border-white/5 py-3.5 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-lg text-white">FYXIS CMS</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                ACTIVE SESSION
              </span>
            </div>
            <p className="text-[11px] font-mono text-gray-400">Content Management & Realtime Supabase Sync</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-[#0E141F] hover:bg-[#131A27] border border-white/10 text-xs font-mono text-gray-300 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#06B6D4]" />
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-mono font-semibold text-red-400 hover:text-red-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-white/5">
          {[
            { id: "projects", label: "Project Showcase", icon: <FolderCode className="w-4 h-4" /> },
            { id: "skills", label: "Expertise & Modules", icon: <Layers className="w-4 h-4" /> },
            { id: "tech", label: "Technical Arsenal", icon: <Wrench className="w-4 h-4" /> },
            { id: "experience", label: "Career Experience", icon: <Briefcase className="w-4 h-4" /> },
            { id: "profile", label: "Profile & Contact", icon: <User className="w-4 h-4" /> },
            {
              id: "messages",
              label: `Inbox Messages (${storeData?.messages?.length || 0})`,
              icon: <Mail className="w-4 h-4" />,
            },
            { id: "security", label: "Change Password", icon: <Lock className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#10B981] text-[#06090E] font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                    : "bg-[#0B0F17] text-gray-400 hover:text-white hover:bg-[#0E141F] border border-white/5"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: PROJECTS SHOWCASE ================= */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B0F17] border border-white/5">
              <div>
                <h2 className="font-heading text-xl font-bold text-white mb-1">
                  Manage Project Showcase
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  Current total:{" "}
                  <span className="font-bold text-[#10B981]">{storeData?.projects?.length || 0} Projects</span>
                  . (Public showcase streams this data live from Supabase).
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() =>
                    setProjectModal({
                      open: true,
                      isNew: true,
                      item: {
                        id: "",
                        title: "",
                        category: "Web SaaS",
                        badge: "PROJECT",
                        description: "",
                        fullDescription: "",
                        tags: "Next.js, TypeScript",
                        image: "/images/banner-bg-2.jpg",
                        liveUrl: "",
                        githubUrl: "",
                        impact: "",
                      },
                    })
                  }
                  className="bg-[#10B981] hover:bg-[#059669] text-[#06090E] px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>

                <button
                  onClick={handleSeedProjects}
                  className="bg-[#0E141F] hover:bg-[#131A27] border border-white/10 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-mono font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Import 6 production sample projects"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>Import Sample Projects</span>
                </button>

                {storeData && storeData.projects.length > 0 && (
                  <button
                    onClick={handleClearProjects}
                    className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Projects</span>
                  </button>
                )}
              </div>
            </div>

            {/* List of projects */}
            {!storeData || storeData.projects.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[#0B0F17] border border-white/5 text-center">
                <FolderCode className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="font-heading text-lg font-bold text-white mb-1">
                  No Projects in Showcase Yet
                </h3>
                <p className="text-xs text-gray-400 font-mono max-w-md mx-auto mb-6">
                  Per your preference, the showcase starts empty. Click &ldquo;Add New Project&rdquo; to publish your custom case studies or import sample items.
                </p>
                <button
                  onClick={() =>
                    setProjectModal({
                      open: true,
                      isNew: true,
                      item: {
                        id: "",
                        title: "",
                        category: "Web SaaS",
                        badge: "NEW PROJECT",
                        description: "",
                        fullDescription: "",
                        tags: "Next.js, TypeScript",
                        image: "/images/banner-bg-2.jpg",
                        liveUrl: "",
                        githubUrl: "",
                        impact: "",
                      },
                    })
                  }
                  className="bg-[#10B981] text-[#06090E] px-6 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Project</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeData.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-6 rounded-2xl bg-[#0B0F17] border border-white/5 hover:border-[#10B981]/40 flex flex-col justify-between transition-all"
                  >
                    <div>
                      {/* Project Image Thumbnail */}
                      {proj.image && (
                        <div className="w-full h-36 rounded-xl overflow-hidden mb-4 border border-white/5 bg-[#06090E] flex items-center justify-center p-2.5 relative">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20 uppercase">
                          {proj.badge}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">{proj.category}</span>
                      </div>

                      <h3 className="font-heading text-xl font-bold text-white mb-2">{proj.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-6">
                        {proj.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#0E141F] text-gray-300 border border-white/5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-[#10B981] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setProjectModal({
                              open: true,
                              isNew: false,
                              item: {
                                ...proj,
                                tags: Array.isArray(proj.tags) ? proj.tags.join(", ") : proj.tags,
                              },
                            })
                          }
                          className="p-2 rounded-xl bg-[#0E141F] hover:bg-[#131A27] text-gray-300 hover:text-white cursor-pointer border border-white/5"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProject(proj.id)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer border border-red-500/20"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: SKILLS CRUD ================= */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B0F17] border border-white/5">
              <div>
                <h2 className="font-heading text-xl font-bold text-white mb-1">
                  Specialization Pillars & Capabilities
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  Architectural modules featured in the &ldquo;Expertise&rdquo; section.
                </p>
              </div>

              <button
                onClick={() =>
                  setSkillModal({
                    open: true,
                    isNew: true,
                    item: {
                      id: "",
                      number: "0" + ((storeData?.specializations?.length || 0) + 1),
                      title: "",
                      tagline: "",
                      description: "",
                      technologies: "Next.js, TypeScript",
                      icon: "Code2",
                    },
                  })
                }
                className="bg-[#10B981] hover:bg-[#059669] text-[#06090E] px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Capability Module</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {storeData?.specializations.map((spec) => (
                <div
                  key={spec.id || spec.number}
                  className="p-6 rounded-2xl bg-[#0B0F17] border border-white/5 hover:border-[#10B981]/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black font-heading text-[#10B981]">
                        {spec.number}
                      </span>
                      <span className="text-xs font-mono text-gray-500">Icon: {spec.icon}</span>
                    </div>

                    <span className="text-xs font-mono font-semibold text-[#06B6D4] block mb-1">
                      {spec.tagline}
                    </span>
                    <h3 className="font-heading text-xl font-bold text-white mb-2">{spec.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{spec.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {spec.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-[#0E141F] text-gray-300 border border-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={() =>
                        setSkillModal({
                          open: true,
                          isNew: false,
                          item: {
                            ...spec,
                            technologies: Array.isArray(spec.technologies)
                              ? spec.technologies.join(", ")
                              : spec.technologies,
                          },
                        })
                      }
                      className="p-2 rounded-xl bg-[#0E141F] hover:bg-[#131A27] text-gray-300 hover:text-white cursor-pointer border border-white/5"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSkill(spec.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer border border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: TECH ARSENAL CRUD ================= */}
        {activeTab === "tech" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B0F17] border border-white/5">
              <div>
                <h2 className="font-heading text-xl font-bold text-white mb-1">
                  Production Tech Stack & Tools
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  Technologies featured in the Technical Arsenal Matrix.
                </p>
              </div>

              <button
                onClick={() =>
                  setTechModal({
                    open: true,
                    isNew: true,
                    item: { id: "", name: "", desc: "", color: "#10B981" },
                  })
                }
                className="bg-[#10B981] hover:bg-[#059669] text-[#06090E] px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Technology</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {storeData?.techStack.map((tech) => (
                <div
                  key={tech.id || tech.name}
                  className="p-4 rounded-xl bg-[#0B0F17] border border-white/5 hover:border-[#10B981]/40 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: tech.color || "#10B981", boxShadow: `0 0 10px ${tech.color || "#10B981"}66` }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{tech.name}</h4>
                      <p className="text-[11px] font-mono text-gray-400">{tech.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTechModal({ open: true, isNew: false, item: tech })}
                      className="p-1.5 rounded-lg bg-[#0E141F] text-gray-400 hover:text-white border border-white/5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTech(tech.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:text-red-300 border border-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: EXPERIENCE CRUD ================= */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B0F17] border border-white/5">
              <div>
                <h2 className="font-heading text-xl font-bold text-white mb-1">
                  Career History & Milestones
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  Milestones and executive roles displayed on your professional career ledger.
                </p>
              </div>

              <button
                onClick={() =>
                  setExpModal({
                    open: true,
                    isNew: true,
                    item: {
                      id: "",
                      period: "2024 — Present",
                      role: "",
                      company: "",
                      companyUrl: "",
                      location: "Semarang, Indonesia",
                      description: "",
                      highlights: "",
                    },
                  })
                }
                className="bg-[#10B981] hover:bg-[#059669] text-[#06090E] px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="space-y-4">
              {storeData?.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-6 rounded-2xl bg-[#0B0F17] border border-white/5 hover:border-[#10B981]/40 flex flex-col md:flex-row md:items-start justify-between gap-6 transition-all"
                >
                  <div className="space-y-2 flex-grow">
                    <span className="text-xs font-mono font-bold text-[#10B981] uppercase">
                      {exp.period}
                    </span>
                    <h3 className="font-heading text-xl font-bold text-white">{exp.role}</h3>
                    <p className="text-xs font-mono text-[#06B6D4] font-semibold">
                      {exp.company} • {exp.location}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed pt-2">{exp.description}</p>

                    <div className="pt-3 space-y-1 font-mono">
                      {exp.highlights?.map((h, idx) => (
                        <p key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setExpModal({
                          open: true,
                          isNew: false,
                          item: {
                            ...exp,
                            highlights: Array.isArray(exp.highlights)
                              ? exp.highlights.join("\n")
                              : exp.highlights,
                          },
                        })
                      }
                      className="p-2 rounded-xl bg-[#0E141F] hover:bg-[#131A27] text-gray-300 hover:text-white cursor-pointer border border-white/5"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteExp(exp.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer border border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: PROFILE & CONTACT SETTINGS ================= */}
        {activeTab === "profile" && storeData && (
          <div className="p-8 rounded-2xl bg-[#0B0F17] border border-white/5 max-w-4xl space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-heading text-xl font-bold text-white mb-1">
                Profile & Contact Configuration
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Core identity displayed on Hero, Terminal Telemetry, Contact, Footer, and Metadata.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveToServer(storeData);
              }}
              className="space-y-6 font-mono"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={storeData.profile.fullName}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        profile: { ...storeData.profile, fullName: e.target.value },
                      })
                    }
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-2">
                    Handle / Alias (@Fyxis)
                  </label>
                  <input
                    type="text"
                    value={storeData.profile.handle}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        profile: { ...storeData.profile, handle: e.target.value },
                      })
                    }
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 mb-2">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={storeData.profile.title}
                  onChange={(e) =>
                    setStoreData({
                      ...storeData,
                      profile: { ...storeData.profile, title: e.target.value },
                    })
                  }
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 mb-2">
                  Bio / Executive Summary
                </label>
                <textarea
                  rows={4}
                  value={storeData.profile.bio}
                  onChange={(e) =>
                    setStoreData({
                      ...storeData,
                      profile: { ...storeData.profile, bio: e.target.value },
                    })
                  }
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-2">
                    Studio / Company
                  </label>
                  <input
                    type="text"
                    value={storeData.profile.company}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        profile: { ...storeData.profile, company: e.target.value },
                      })
                    }
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-2">
                    Company Website URL
                  </label>
                  <input
                    type="text"
                    value={storeData.profile.companyUrl}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        profile: { ...storeData.profile, companyUrl: e.target.value },
                      })
                    }
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={storeData.profile.socials.whatsapp}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        profile: {
                          ...storeData.profile,
                          socials: { ...storeData.profile.socials, whatsapp: e.target.value },
                        },
                      })
                    }
                    placeholder="+62813..."
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={storeData.profile.socials.email}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        profile: {
                          ...storeData.profile,
                          socials: { ...storeData.profile.socials, email: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-2">
                    Base Location
                  </label>
                  <input
                    type="text"
                    value={storeData.profile.location}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        profile: { ...storeData.profile, location: e.target.value },
                      })
                    }
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={storeData.profile.socials.github}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        profile: {
                          ...storeData.profile,
                          socials: { ...storeData.profile.socials, github: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={storeData.profile.socials.linkedin}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        profile: {
                          ...storeData.profile,
                          socials: { ...storeData.profile.socials, linkedin: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={storeData.profile.socials.instagram}
                    onChange={(e) =>
                      setStoreData({
                        ...storeData,
                        profile: {
                          ...storeData.profile,
                          socials: { ...storeData.profile.socials, instagram: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#10B981] hover:bg-[#059669] text-[#06090E] px-8 py-3.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase inline-flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 6: MESSAGES INBOX ================= */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0B0F17] border border-white/5">
              <h2 className="font-heading text-xl font-bold text-white mb-1">
                Inquiry Messages Inbox
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Client inquiries and proposals dispatched directly from the contact section.
              </p>
            </div>

            {!storeData?.messages || storeData.messages.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[#0B0F17] border border-white/5 text-center">
                <Mail className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="font-heading text-lg font-bold text-white mb-1">
                  Communications Inbox Empty
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  No transmissions received yet. The contact dispatch form on the main site is live and operational.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {storeData.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-6 rounded-2xl bg-[#0B0F17] border border-white/5 hover:border-[#10B981]/40 flex flex-col md:flex-row md:items-start justify-between gap-6 transition-all"
                  >
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading text-lg font-bold text-white">{msg.name}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20">
                          {msg.subject}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono">
                        {msg.email} • {new Date(msg.createdAt).toLocaleString("en-US")}
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed pt-2 bg-[#0E141F] p-4 rounded-xl border border-white/5">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="px-4 py-2 rounded-xl bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981] hover:text-[#06090E] text-xs font-mono font-bold transition-colors inline-flex items-center gap-1.5 border border-[#10B981]/30"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply Email</span>
                      </a>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer border border-red-500/20"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 7: SECURITY & PASSWORD ================= */}
        {activeTab === "security" && (
          <div className="p-8 rounded-2xl bg-[#0B0F17] border border-white/5 max-w-xl space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-heading text-xl font-bold text-white mb-1">
                Change Admin Password
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Update authentication credentials to safeguard administrative portal access.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-5 font-mono">
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 4 characters..."
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password..."
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#10B981] hover:bg-[#059669] text-[#06090E] px-7 py-3 rounded-xl text-xs font-mono font-bold tracking-widest uppercase inline-flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)]"
              >
                <Lock className="w-4 h-4" />
                <span>Save New Password</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ================= MODAL: EDIT/ADD PROJECT ================= */}
      {projectModal.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setProjectModal({ open: false, item: null, isNew: false })}
        >
          <div
            className="bg-[#0B0F17] border border-white/15 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setProjectModal({ open: false, item: null, isNew: false })}
              className="absolute top-6 right-6 w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-heading text-2xl font-bold text-white mb-6">
              {projectModal.isNew ? "Add New Project" : "Edit Project"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProject(projectModal.item);
              }}
              className="space-y-4 font-mono text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-gray-400 mb-1.5">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={projectModal.item?.title || ""}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        item: { ...projectModal.item, title: e.target.value },
                      })
                    }
                    placeholder="e.g. Scanly Flow POS"
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block uppercase text-gray-400 mb-1.5">
                    Category
                  </label>
                  <select
                    value={projectModal.item?.category || "Web SaaS"}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        item: { ...projectModal.item, category: e.target.value },
                      })
                    }
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="Web SaaS">Web SaaS</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="Company Profile">Company Profile</option>
                    <option value="UI/UX & Mobile">UI/UX & Mobile</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-gray-400 mb-1.5">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    required
                    value={projectModal.item?.badge || ""}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        item: { ...projectModal.item, badge: e.target.value },
                      })
                    }
                    placeholder="e.g. POINT OF SALE SAAS"
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block uppercase text-gray-400 mb-1.5">
                    Technology Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={projectModal.item?.tags || ""}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        item: { ...projectModal.item, tags: e.target.value },
                      })
                    }
                    placeholder="e.g. Next.js, PostgreSQL, Tailwind"
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              {/* Project Showcase Image Upload & Live Preview */}
              <div className="p-4 rounded-xl bg-[#0E141F] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="uppercase text-gray-400 font-mono text-[11px] font-bold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#10B981]" />
                    <span>Project Showcase Image / Banner</span>
                  </label>
                  {projectModal.item?.image && (
                    <button
                      type="button"
                      onClick={() =>
                        setProjectModal((prev) => ({
                          ...prev,
                          item: { ...prev.item, image: "" },
                        }))
                      }
                      className="text-[11px] text-red-400 hover:text-red-300 font-mono flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Image</span>
                    </button>
                  )}
                </div>

                {/* Preview Thumbnail Box */}
                {projectModal.item?.image ? (
                  <div className="w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-[#06090E] relative flex items-center justify-center p-3">
                    <img
                      src={projectModal.item.image}
                      alt="Project Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] text-gray-300 font-mono border border-white/10">
                      Active Preview
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-28 rounded-xl border border-dashed border-white/15 bg-[#06090E]/60 flex flex-col items-center justify-center text-gray-500 gap-1.5 p-4 text-center">
                    <ImageIcon className="w-6 h-6 text-gray-600" />
                    <span className="text-[11px] font-mono text-gray-400">No showcase image selected</span>
                    <span className="text-[10px] font-mono text-gray-500">
                      Upload an image file from your computer or provide a URL below
                    </span>
                  </div>
                )}

                {/* File Upload Button & URL Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">
                      Upload from Computer
                    </label>
                    <label
                      className={`w-full py-2.5 px-4 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-mono font-semibold transition-all cursor-pointer ${
                        uploadingImage
                          ? "bg-[#10B981]/10 border-[#10B981] text-[#34D399]"
                          : "bg-[#06090E] border-white/20 text-gray-300 hover:border-[#10B981] hover:text-[#10B981]"
                      }`}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#10B981]" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 text-[#10B981]" />
                          <span>Choose Image File</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                        disabled={uploadingImage}
                        onChange={handleUploadProjectImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-mono mb-1">
                      Or Direct Image Path / URL
                    </label>
                    <input
                      type="text"
                      value={projectModal.item?.image || ""}
                      onChange={(e) =>
                        setProjectModal((prev) => ({
                          ...prev,
                          item: { ...prev.item, image: e.target.value },
                        }))
                      }
                      placeholder="/images/... or https://..."
                      className="w-full bg-[#06090E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1.5">
                  Brief Summary (Card Preview)
                </label>
                <textarea
                  rows={2}
                  required
                  value={projectModal.item?.description || ""}
                  onChange={(e) =>
                    setProjectModal({
                      ...projectModal,
                      item: { ...projectModal.item, description: e.target.value },
                    })
                  }
                  placeholder="1-2 sentences summarizing the project card..."
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981] resize-none"
                />
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1.5">
                  Full Architectural Description (Modal Detail)
                </label>
                <textarea
                  rows={4}
                  required
                  value={projectModal.item?.fullDescription || ""}
                  onChange={(e) =>
                    setProjectModal({
                      ...projectModal,
                      item: { ...projectModal.item, fullDescription: e.target.value },
                    })
                  }
                  placeholder="Detail primary capabilities, architectural choices, and technical solutions..."
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981] resize-none"
                />
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1.5">
                  Key Impact & Metrics
                </label>
                <input
                  type="text"
                  value={projectModal.item?.impact || ""}
                  onChange={(e) =>
                    setProjectModal({
                      ...projectModal,
                      item: { ...projectModal.item, impact: e.target.value },
                    })
                  }
                  placeholder="e.g. Cut transaction latency by 40%."
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-gray-400 mb-1.5">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={projectModal.item?.liveUrl || ""}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        item: { ...projectModal.item, liveUrl: e.target.value },
                      })
                    }
                    placeholder="https://..."
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block uppercase text-gray-400 mb-1.5">
                    GitHub Repository URL
                  </label>
                  <input
                    type="text"
                    value={projectModal.item?.githubUrl || ""}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        item: { ...projectModal.item, githubUrl: e.target.value },
                      })
                    }
                    placeholder="https://github.com/..."
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setProjectModal({ open: false, item: null, isNew: false })}
                  className="px-5 py-2.5 rounded-xl bg-[#0E141F] hover:bg-[#131A27] text-gray-300 border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#06090E] font-bold tracking-wider cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT/ADD SKILL ================= */}
      {skillModal.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSkillModal({ open: false, item: null, isNew: false })}
        >
          <div
            className="bg-[#0B0F17] border border-white/15 rounded-2xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-2xl font-bold text-white mb-6">
              {skillModal.isNew ? "Add Capability Module" : "Edit Capability Module"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveSkill(skillModal.item);
              }}
              className="space-y-4 font-mono text-xs"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-gray-400 mb-1">
                    Sequence Number
                  </label>
                  <input
                    type="text"
                    required
                    value={skillModal.item?.number || ""}
                    onChange={(e) =>
                      setSkillModal({
                        ...skillModal,
                        item: { ...skillModal.item, number: e.target.value },
                      })
                    }
                    placeholder="01"
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block uppercase text-gray-400 mb-1">Icon</label>
                  <select
                    value={skillModal.item?.icon || "Code2"}
                    onChange={(e) =>
                      setSkillModal({
                        ...skillModal,
                        item: { ...skillModal.item, icon: e.target.value },
                      })
                    }
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="Code2">Code2 (Engineering)</option>
                    <option value="Layers">Layers (Project Management)</option>
                    <option value="Server">Server (Backend Architecture)</option>
                    <option value="PenTool">PenTool (UI/UX Engineering)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1">
                  Module Title
                </label>
                <input
                  type="text"
                  required
                  value={skillModal.item?.title || ""}
                  onChange={(e) =>
                    setSkillModal({
                      ...skillModal,
                      item: { ...skillModal.item, title: e.target.value },
                    })
                  }
                  placeholder="Full Stack Engineering"
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={skillModal.item?.tagline || ""}
                  onChange={(e) =>
                    setSkillModal({
                      ...skillModal,
                      item: { ...skillModal.item, tagline: e.target.value },
                    })
                  }
                  placeholder="High-Performance Modern Web"
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={skillModal.item?.description || ""}
                  onChange={(e) =>
                    setSkillModal({
                      ...skillModal,
                      item: { ...skillModal.item, description: e.target.value },
                    })
                  }
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981] resize-none"
                />
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1">
                  Technologies (Comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={skillModal.item?.technologies || ""}
                  onChange={(e) =>
                    setSkillModal({
                      ...skillModal,
                      item: { ...skillModal.item, technologies: e.target.value },
                    })
                  }
                  placeholder="Next.js, React, TypeScript, Tailwind"
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSkillModal({ open: false, item: null, isNew: false })}
                  className="px-5 py-2 rounded-xl bg-[#0E141F] hover:bg-[#131A27] text-gray-300 border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#06090E] font-bold cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT/ADD TECH ================= */}
      {techModal.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setTechModal({ open: false, item: null, isNew: false })}
        >
          <div
            className="bg-[#0B0F17] border border-white/15 rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-xl font-bold text-white mb-4">
              {techModal.isNew ? "Add Arsenal Technology" : "Edit Technology"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveTech(techModal.item);
              }}
              className="space-y-4 font-mono text-xs"
            >
              <div>
                <label className="block uppercase text-gray-400 mb-1">
                  Technology Name
                </label>
                <input
                  type="text"
                  required
                  value={techModal.item?.name || ""}
                  onChange={(e) =>
                    setTechModal({
                      ...techModal,
                      item: { ...techModal.item, name: e.target.value },
                    })
                  }
                  placeholder="e.g. Next.js 15"
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1">
                  Domain / Category Note
                </label>
                <input
                  type="text"
                  required
                  value={techModal.item?.desc || ""}
                  onChange={(e) =>
                    setTechModal({
                      ...techModal,
                      item: { ...techModal.item, desc: e.target.value },
                    })
                  }
                  placeholder="App Router / Turbopack"
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1">
                  Indicator Color Hex
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={techModal.item?.color || "#10B981"}
                    onChange={(e) =>
                      setTechModal({
                        ...techModal,
                        item: { ...techModal.item, color: e.target.value },
                      })
                    }
                    className="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={techModal.item?.color || "#10B981"}
                    onChange={(e) =>
                      setTechModal({
                        ...techModal,
                        item: { ...techModal.item, color: e.target.value },
                      })
                    }
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setTechModal({ open: false, item: null, isNew: false })}
                  className="px-5 py-2 rounded-xl bg-[#0E141F] hover:bg-[#131A27] text-gray-300 border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#06090E] font-bold cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Save Technology
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT/ADD EXPERIENCE ================= */}
      {expModal.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setExpModal({ open: false, item: null, isNew: false })}
        >
          <div
            className="bg-[#0B0F17] border border-white/15 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-2xl font-bold text-white mb-6">
              {expModal.isNew ? "Add Career Experience" : "Edit Career Experience"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveExp(expModal.item);
              }}
              className="space-y-4 font-mono text-xs"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-gray-400 mb-1">
                    Timeframe / Period
                  </label>
                  <input
                    type="text"
                    required
                    value={expModal.item?.period || ""}
                    onChange={(e) =>
                      setExpModal({
                        ...expModal,
                        item: { ...expModal.item, period: e.target.value },
                      })
                    }
                    placeholder="2023 — Present"
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block uppercase text-gray-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={expModal.item?.location || ""}
                    onChange={(e) =>
                      setExpModal({
                        ...expModal,
                        item: { ...expModal.item, location: e.target.value },
                      })
                    }
                    placeholder="Semarang, ID (Remote)"
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  required
                  value={expModal.item?.role || ""}
                  onChange={(e) =>
                    setExpModal({
                      ...expModal,
                      item: { ...expModal.item, role: e.target.value },
                    })
                  }
                  placeholder="Co-Founder & Technical PM / Full Stack Engineer"
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-gray-400 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={expModal.item?.company || ""}
                    onChange={(e) =>
                      setExpModal({
                        ...expModal,
                        item: { ...expModal.item, company: e.target.value },
                      })
                    }
                    placeholder="Newsaint Digital Solution"
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block uppercase text-gray-400 mb-1">
                    Company Website URL
                  </label>
                  <input
                    type="text"
                    value={expModal.item?.companyUrl || ""}
                    onChange={(e) =>
                      setExpModal({
                        ...expModal,
                        item: { ...expModal.item, companyUrl: e.target.value },
                      })
                    }
                    placeholder="https://..."
                    className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1">
                  Role Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={expModal.item?.description || ""}
                  onChange={(e) =>
                    setExpModal({
                      ...expModal,
                      item: { ...expModal.item, description: e.target.value },
                    })
                  }
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981] resize-none"
                />
              </div>

              <div>
                <label className="block uppercase text-gray-400 mb-1">
                  Key Accomplishments (1 per line)
                </label>
                <textarea
                  rows={4}
                  value={expModal.item?.highlights || ""}
                  onChange={(e) =>
                    setExpModal({
                      ...expModal,
                      item: { ...expModal.item, highlights: e.target.value },
                    })
                  }
                  placeholder="Built and deployed 15+ corporate platforms...&#10;Implemented Next.js 15 with sub-second latency..."
                  className="w-full bg-[#0E141F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981] resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setExpModal({ open: false, item: null, isNew: false })}
                  className="px-5 py-2 rounded-xl bg-[#0E141F] hover:bg-[#131A27] text-gray-300 border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#06090E] font-bold cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
