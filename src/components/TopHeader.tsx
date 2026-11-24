'use client';

import React from 'react';
import { 
  Search, 
  ChevronDown, 
  Bell, 
  Download, 
  Sparkles,
  Calendar,
  Layers,
  Settings
} from 'lucide-react';

interface TopHeaderProps {
  onOpenExport: () => void;
  onOpenSettings: () => void;
  papersCount: number;
  domain?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenExport,
  onOpenSettings,
  papersCount,
  domain = 'Automated Software Engineering'
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Search Input Bar */}
      <div className="flex items-center space-x-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search experiments, literature, DOIs, methodologies..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f8faf9] border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Filter Dropdown Pills (Like Labflow) */}
      <div className="hidden md:flex items-center space-x-2.5">
        <button
          onClick={onOpenSettings}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f4f7f6] hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
        >
          <Layers className="h-3.5 w-3.5 text-emerald-700" />
          <span className="truncate max-w-[140px]">{domain}</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>

        <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f4f7f6] text-slate-700 border border-slate-200">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span>2024–2026</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          title="Engine Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#f4f7f6] hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer shadow-xs"
        >
          <Download className="h-3.5 w-3.5 text-slate-600" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
