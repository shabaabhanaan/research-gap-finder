'use client';

import React from 'react';
import { Microscope, Sparkles, Settings, FileSpreadsheet, Download } from 'lucide-react';

interface NavbarProps {
  papersCount: number;
  hasResults: boolean;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  onSynthesize: () => void;
  isSynthesizing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  papersCount,
  hasResults,
  onOpenSettings,
  onOpenExport,
  onSynthesize,
  isSynthesizing
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Microscope className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">ResGap</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20">
                Gap Finder
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Academic Literature & Niche Void Synthesizer</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {papersCount > 0 && (
            <button
              onClick={onSynthesize}
              disabled={isSynthesizing}
              className="relative group inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className={`h-4 w-4 text-cyan-200 ${isSynthesizing ? 'animate-spin' : ''}`} />
              <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize Gaps'}</span>
              <span className="ml-1 text-xs px-1.5 py-0.2 bg-white/20 rounded-full font-mono">
                {papersCount}
              </span>
            </button>
          )}

          {hasResults && (
            <button
              onClick={onOpenExport}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
              title="Export Literature Review / Markdown"
            >
              <Download className="h-4 w-4 text-slate-400" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 transition cursor-pointer"
            title="Model & Engine Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
