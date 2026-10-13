"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Copy, Check, RotateCcw } from "lucide-react";

const CMD1 = "fyxis --inspect --live-status";
const CMD2 = "echo $CURRENT_MISSION";
const MISSION_TEXT =
  '"Architecting resilient web systems and steering high-velocity engineering delivery."';

export const TerminalWidget = () => {
  const [activeTab, setActiveTab] = useState<"status" | "profile" | "stack">("status");
  const [copied, setCopied] = useState(false);

  // Typewriter animation states
  const [typedCmd1, setTypedCmd1] = useState("");
  const [visibleOutputs, setVisibleOutputs] = useState<number>(0);
  const [typedCmd2, setTypedCmd2] = useState("");
  const [typedMission, setTypedMission] = useState("");
  const [showStatusState, setShowStatusState] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFastForward = () => {
    setTypedCmd1(CMD1);
    setVisibleOutputs(5);
    setTypedCmd2(CMD2);
    setTypedMission(MISSION_TEXT);
    setShowStatusState(true);
    setIsFinished(true);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTypedCmd1("");
    setVisibleOutputs(0);
    setTypedCmd2("");
    setTypedMission("");
    setShowStatusState(false);
    setIsFinished(false);
    setAnimKey((prev) => prev + 1);
  };

  useEffect(() => {
    let isCancelled = false;
    let timer: NodeJS.Timeout;

    // Reset sequence
    setTypedCmd1("");
    setVisibleOutputs(0);
    setTypedCmd2("");
    setTypedMission("");
    setShowStatusState(false);
    setIsFinished(false);

    // 1. Type CMD1 character by character
    let c1 = 0;
    const typeCommand1 = () => {
      if (isCancelled) return;
      if (c1 <= CMD1.length) {
        setTypedCmd1(CMD1.slice(0, c1));
        c1++;
        timer = setTimeout(typeCommand1, 26);
      } else {
        timer = setTimeout(streamOutputs, 180);
      }
    };

    // 2. Stream identity outputs line-by-line
    let lineIdx = 0;
    const streamOutputs = () => {
      if (isCancelled) return;
      if (lineIdx < 5) {
        lineIdx++;
        setVisibleOutputs(lineIdx);
        timer = setTimeout(streamOutputs, 70);
      } else {
        timer = setTimeout(typeCommand2, 220);
      }
    };

    // 3. Type CMD2 character by character
    let c2 = 0;
    const typeCommand2 = () => {
      if (isCancelled) return;
      if (c2 <= CMD2.length) {
        setTypedCmd2(CMD2.slice(0, c2));
        c2++;
        timer = setTimeout(typeCommand2, 28);
      } else {
        timer = setTimeout(typeMissionText, 160);
      }
    };

    // 4. Type mission quote
    let mIdx = 0;
    const typeMissionText = () => {
      if (isCancelled) return;
      if (mIdx <= MISSION_TEXT.length) {
        setTypedMission(MISSION_TEXT.slice(0, mIdx));
        mIdx += 2;
        timer = setTimeout(typeMissionText, 18);
      } else {
        setTypedMission(MISSION_TEXT);
        timer = setTimeout(() => {
          if (isCancelled) return;
          setShowStatusState(true);
          setIsFinished(true);
        }, 140);
      }
    };

    // Initial brief boot delay
    timer = setTimeout(typeCommand1, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [animKey]);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-[#0B0F17] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden font-mono text-left relative group hover:border-[#10B981]/50 transition-all duration-300">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] rounded-full blur-[80px] opacity-10 pointer-events-none" />

      {/* Terminal Title Bar */}
      <div className="bg-[#0E141F] px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-xs text-gray-400 font-sans font-medium flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
            <span>fyxis-terminal@workstation: ~</span>
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            className="text-gray-400 hover:text-[#10B981] transition-colors text-xs flex items-center gap-1 p-1 rounded hover:bg-white/5 cursor-pointer"
            title="Replay typing animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => copyToClipboard("npx adrianus-bagus-portfolio")}
            className="text-gray-400 hover:text-white transition-colors text-xs flex items-center gap-1 p-1 rounded hover:bg-white/5 cursor-pointer"
            title="Copy command"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#10B981]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#090D14] px-4 pt-2 border-b border-white/5 flex items-center gap-2 text-xs">
        {[
          { id: "status", label: "system_status.sh" },
          { id: "profile", label: "engineer_profile.json" },
          { id: "stack", label: "architecture.config.ts" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-t-lg transition-colors cursor-pointer text-[11px] ${
              activeTab === tab.id
                ? "bg-[#0B0F17] text-[#34D399] border-t border-x border-white/10 font-bold"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Terminal Content Body */}
      <div className="p-5 text-xs text-gray-300 space-y-3 leading-relaxed min-h-[300px] select-text">
        {activeTab === "status" && (
          <div
            className="space-y-2 select-text cursor-default"
            onClick={!isFinished ? handleFastForward : undefined}
            title={!isFinished ? "Click to fast-forward typing" : undefined}
          >
            {/* Command 1 */}
            <div className="text-gray-400 flex items-center gap-2">
              <span className="text-[#10B981] font-bold">$</span>
              <span className="text-white font-medium">{typedCmd1}</span>
              {visibleOutputs === 0 && (
                <span className="inline-block w-2 h-3.5 bg-[#10B981] animate-pulse" />
              )}
            </div>

            {/* Outputs 1 */}
            {visibleOutputs > 0 && (
              <div className="pl-4 space-y-1.5 border-l-2 border-[#10B981]/30 my-2">
                {visibleOutputs >= 1 && (
                  <p className="animate-fadeIn">
                    <span className="text-[#06B6D4] font-semibold">IDENTITY:</span> Adrianus
                    Bagus Setiaji (@Fyxis)
                  </p>
                )}
                {visibleOutputs >= 2 && (
                  <p className="animate-fadeIn">
                    <span className="text-[#06B6D4] font-semibold">CORE ROLES:</span> Co-Founder &
                    PM / Full Stack Software Engineer
                  </p>
                )}
                {visibleOutputs >= 3 && (
                  <p className="animate-fadeIn">
                    <span className="text-[#06B6D4] font-semibold">COMPANY:</span> Newsaint Digital Solution
                  </p>
                )}
                {visibleOutputs >= 4 && (
                  <p className="animate-fadeIn">
                    <span className="text-[#06B6D4] font-semibold">LOCATION:</span> Semarang,
                    Central Java (UTC+7 / Remote)
                  </p>
                )}
                {visibleOutputs >= 5 && (
                  <p className="animate-fadeIn">
                    <span className="text-[#06B6D4] font-semibold">METRICS:</span> 4+ YOE · 15+
                    Enterprise Deliveries · 99.9% Uptime
                  </p>
                )}
              </div>
            )}

            {/* Command 2 */}
            {visibleOutputs >= 5 && (
              <div className="text-gray-400 flex items-center gap-2 pt-2 animate-fadeIn">
                <span className="text-[#10B981] font-bold">$</span>
                <span className="text-white font-medium">{typedCmd2}</span>
                {typedCmd2.length > 0 && typedMission.length === 0 && (
                  <span className="inline-block w-2 h-3.5 bg-[#10B981] animate-pulse" />
                )}
              </div>
            )}

            {/* Mission Output */}
            {typedMission.length > 0 && (
              <p className="pl-4 text-emerald-400 font-mono">
                {typedMission}
                {!showStatusState && (
                  <span className="inline-block w-2 h-3.5 bg-[#10B981] ml-1 animate-pulse" />
                )}
              </p>
            )}

            {/* Final System State */}
            {showStatusState && (
              <div className="pt-2 flex items-center gap-2 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-gray-400 text-[11px]">
                  System state: ACTIVE & READY FOR PROJECTS
                </span>
                <span className="inline-block w-2 h-3.5 bg-[#10B981] animate-pulse ml-1" />
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-1 font-mono text-[11px] animate-fadeIn text-gray-300">
            <p className="text-gray-500">{`// engineer_profile.json`}</p>
            <p>{`{`}</p>
            <p className="pl-4">
              <span className="text-emerald-400">&quot;engineer&quot;</span>:{" "}
              <span className="text-amber-300">&quot;Adrianus Bagus Setiaji&quot;</span>,
            </p>
            <p className="pl-4">
              <span className="text-emerald-400">&quot;leadership&quot;</span>:{" "}
              <span className="text-amber-300">
                &quot;Co-Founder & Technical PM @ NewSaint&quot;
              </span>,
            </p>
            <p className="pl-4">
              <span className="text-emerald-400">&quot;specialty&quot;</span>: [
            </p>
            <p className="pl-8 text-cyan-300">&quot;Full Stack Web Architecture&quot;,</p>
            <p className="pl-8 text-cyan-300">&quot;Agile Sprint Scoping & Execution&quot;,</p>
            <p className="pl-8 text-cyan-300">&quot;Relational Database & Cloud APIs&quot;</p>
            <p className="pl-4">],</p>
            <p className="pl-4">
              <span className="text-emerald-400">&quot;availability&quot;</span>:{" "}
              <span className="text-purple-300">true</span>,
            </p>
            <p className="pl-4">
              <span className="text-emerald-400">&quot;contact&quot;</span>:{" "}
              <span className="text-amber-300">&quot;bagusadrianus@gmail.com&quot;</span>
            </p>
            <p>{`}`}</p>
          </div>
        )}

        {activeTab === "stack" && (
          <div className="space-y-2 animate-fadeIn">
            <p className="text-gray-500">{`// Production Technical Stack`}</p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 rounded-lg bg-[#0E141F] border border-white/5">
                <span className="text-[#06B6D4] block font-bold mb-1">Frontend Core</span>
                <span className="text-gray-300">Next.js 15, React 19, TypeScript, Tailwind</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0E141F] border border-white/5">
                <span className="text-[#10B981] block font-bold mb-1">Backend & APIs</span>
                <span className="text-gray-300">Node.js, PostgreSQL, Drizzle ORM, REST/GraphQL</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0E141F] border border-white/5">
                <span className="text-purple-400 block font-bold mb-1">Management & Delivery</span>
                <span className="text-gray-300">Scrum, Sprint Scoping, Client Architecture</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0E141F] border border-white/5">
                <span className="text-amber-400 block font-bold mb-1">Infrastructure</span>
                <span className="text-gray-300">Docker, Cloudflare Edge, Git CI/CD</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="bg-[#0E141F] px-4 py-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>TypeScript strict: enabled</span>
        </span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};
