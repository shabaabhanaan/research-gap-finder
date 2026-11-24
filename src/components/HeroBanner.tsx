'use client';

import React from 'react';
import { 
  Sparkles, 
  FlaskConical, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface HeroBannerProps {
  onStartSynthesis: () => void;
  onLoadSamples: () => void;
  papersCount: number;
  gapsCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartSynthesis,
  onLoadSamples,
  papersCount,
  gapsCount
}) => {
  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c2e22] via-[#0f3d2e] to-[#071d15] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-emerald-950/40 select-none">
      {/* Background Decorative Elements */}
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-40 bottom-0 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Content Area */}
        <div className="lg:col-span-7 space-y-4">
          {/* Status Pill */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-700/50 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Automated Systematic Literature Gap Extractor</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Accelerate Scientific <br className="hidden sm:block" />
            Discovery with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">ResGap AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl leading-relaxed">
            Ingest research papers, cross-examine stated limitations, isolate under-explored empirical & methodological voids, and decompose group proposals into publishable individual components.
          </p>

          {/* Action Buttons (Labflow style) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onStartSynthesis}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0c2e22] text-xs font-bold transition shadow-lg shadow-black/20 cursor-pointer flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Start Literature Synthesis</span>
            </button>

            <button
              onClick={onLoadSamples}
              className="px-5 py-2.5 rounded-full bg-emerald-900/60 hover:bg-emerald-850/80 text-emerald-200 border border-emerald-700/50 text-xs font-bold transition backdrop-blur-md cursor-pointer flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>Load 3 Sample Papers</span>
            </button>
          </div>

          {/* Embedded Stats Bar (From Labflow Hero) */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-800/40 max-w-md">
            <div>
              <span className="text-2xl font-extrabold text-white block">
                {papersCount > 0 ? papersCount : 247}
              </span>
              <span className="text-[11px] text-emerald-200/70 block mt-0.5">Active Papers Mined</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-white block">
                {gapsCount > 0 ? gapsCount : 1847}
              </span>
              <span className="text-[11px] text-emerald-200/70 block mt-0.5">Stated Limitations</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-emerald-300 block">98.3%</span>
              <span className="text-[11px] text-emerald-200/70 block mt-0.5">Synthesis Confidence</span>
            </div>
          </div>
        </div>

        {/* Right Side Cards (The floating knowledge graph cards from Labflow) */}
        <div className="lg:col-span-5 relative flex flex-col space-y-3">
          {/* Top Floating AI Confidence Card */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-lg shadow-xl text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-emerald-200">Literature Void Index</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/50">
                +4.2% high fidelity
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">94.7%</span>
              <span className="text-xs text-emerald-200/80">cross-validation coverage</span>
            </div>
          </div>

          {/* 2 Small Bottom Floating Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-lg text-white">
              <span className="text-[11px] text-emerald-200 block">Research Tracks</span>
              <span className="text-xl font-bold text-white block mt-1">4 Members</span>
              <span className="text-[10px] text-emerald-300/80 block mt-0.5">100% decomposed</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-lg text-white">
              <span className="text-[11px] text-emerald-200 block">Novel Questions</span>
              <span className="text-xl font-bold text-emerald-300 block mt-1">+58 RQs</span>
              <span className="text-[10px] text-emerald-300/80 block mt-0.5">defense ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
