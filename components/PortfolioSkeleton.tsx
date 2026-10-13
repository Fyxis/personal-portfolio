import React from "react";

export const PortfolioSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#06090E] text-[#F8FAFC] overflow-x-hidden animate-pulse">
      {/* Navbar Skeleton */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-5 md:py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0E141F] border border-white/10" />
          <div className="space-y-1.5">
            <div className="w-24 h-4 rounded bg-[#0E141F]" />
            <div className="w-16 h-2 rounded bg-[#0E141F]/60" />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-16 h-3.5 rounded bg-[#0E141F]" />
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="w-28 h-8 rounded-lg bg-[#0E141F]" />
          <div className="w-32 h-9 rounded-lg bg-[#10B981]/20 border border-[#10B981]/30" />
        </div>
      </div>

      {/* Hero Skeleton (Asymmetric 2-Column Split) */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="w-56 h-7 rounded-full bg-[#0E141F] border border-white/10" />

          <div className="space-y-3">
            <div className="w-4/5 h-10 md:h-14 rounded-xl bg-[#0E141F]" />
            <div className="w-full h-10 md:h-14 rounded-xl bg-[#0E141F]" />
            <div className="w-3/5 h-10 md:h-14 rounded-xl bg-[#0E141F]" />
          </div>

          <div className="space-y-2 pt-2">
            <div className="w-full h-4 rounded bg-[#0E141F]/80" />
            <div className="w-5/6 h-4 rounded bg-[#0E141F]/60" />
          </div>

          {/* Metric cards skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#0B0F17] border border-white/5 space-y-2"
              >
                <div className="w-12 h-6 rounded bg-[#10B981]/20" />
                <div className="w-20 h-3 rounded bg-[#0E141F]" />
                <div className="w-16 h-2.5 rounded bg-[#0E141F]/50" />
              </div>
            ))}
          </div>

          {/* Buttons skeleton */}
          <div className="flex items-center gap-4 pt-4">
            <div className="w-40 h-11 rounded-xl bg-[#10B981]/30 border border-[#10B981]/40" />
            <div className="w-36 h-11 rounded-xl bg-[#0E141F] border border-white/10" />
          </div>
        </div>

        {/* Right Column: Terminal Widget Skeleton */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-[#0B0F17] border border-white/10 overflow-hidden shadow-2xl">
            {/* Terminal Top Bar */}
            <div className="px-4 py-3 bg-[#0E141F] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/40" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <span className="w-3 h-3 rounded-full bg-green-500/40" />
              </div>
              <div className="w-32 h-3 rounded bg-white/10" />
              <div className="w-10 h-3" />
            </div>

            {/* Terminal Body */}
            <div className="p-6 space-y-3 font-mono text-xs">
              <div className="w-3/4 h-3.5 rounded bg-[#10B981]/20" />
              <div className="w-full h-3.5 rounded bg-[#0E141F]" />
              <div className="w-5/6 h-3.5 rounded bg-[#0E141F]" />
              <div className="w-2/3 h-3.5 rounded bg-[#06B6D4]/20" />
              <div className="w-4/5 h-3.5 rounded bg-[#0E141F]" />
              <div className="w-1/2 h-3.5 rounded bg-[#0E141F]" />
              <div className="w-3/4 h-3.5 rounded bg-[#10B981]/20" />
              <div className="w-full h-3.5 rounded bg-[#0E141F]" />
              <div className="w-2/3 h-3.5 rounded bg-[#0E141F]" />
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section Skeleton */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 border-t border-white/5 space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="w-36 h-3 rounded bg-[#10B981]/30" />
            <div className="w-72 h-8 rounded-xl bg-[#0E141F]" />
          </div>
          <div className="w-64 h-8 rounded bg-[#0E141F]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-[#0B0F17] border border-white/5 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0E141F]" />
              <div className="w-48 h-6 rounded bg-[#0E141F]" />
              <div className="w-full h-12 rounded bg-[#0E141F]/60" />
              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="w-3/4 h-3 rounded bg-[#0E141F]" />
                <div className="w-2/3 h-3 rounded bg-[#0E141F]" />
                <div className="w-4/5 h-3 rounded bg-[#0E141F]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Arsenal Skeleton */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 border-t border-white/5 space-y-8">
        <div className="flex justify-between items-center">
          <div className="w-64 h-8 rounded-xl bg-[#0E141F]" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-24 h-8 rounded-xl bg-[#0E141F]" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#0B0F17] border border-white/5 space-y-3"
            >
              <div className="w-3 h-3 rounded-full bg-[#10B981]/30" />
              <div className="w-20 h-4 rounded bg-[#0E141F]" />
              <div className="w-16 h-3 rounded bg-[#0E141F]/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Skills Bento Skeleton */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 border-t border-white/5 space-y-8">
        <div className="w-64 h-8 rounded-xl bg-[#0E141F]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-[#0B0F17] border border-white/5 space-y-4"
            >
              <div className="w-10 h-8 rounded bg-[#10B981]/20" />
              <div className="w-40 h-5 rounded bg-[#06B6D4]/30" />
              <div className="w-60 h-6 rounded bg-[#0E141F]" />
              <div className="w-full h-10 rounded bg-[#0E141F]/60" />
              <div className="flex gap-2 pt-2">
                <div className="w-16 h-6 rounded-lg bg-[#0E141F]" />
                <div className="w-20 h-6 rounded-lg bg-[#0E141F]" />
                <div className="w-16 h-6 rounded-lg bg-[#0E141F]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
