'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  BookOpen, 
  Users, 
  Layers, 
  FileSpreadsheet, 
  Sparkles, 
  Download, 
  Settings, 
  ShieldCheck, 
  ChevronRight,
  Database,
  BarChart3,
  BookmarkCheck
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSettings: () => void;
  onOpenExport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onNavigate,
  onOpenSettings,
  onOpenExport
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'ingest', label: 'Proposal Ingestion', icon: FlaskConical },
    { id: 'team', label: '4-Member Breakdown', icon: Users },
    { id: 'gaps', label: 'Research Gaps', icon: Sparkles },
    { id: 'matrix', label: 'Literature Matrix', icon: FileSpreadsheet },
    { id: 'references', label: 'References & Citations', icon: BookOpen },
    { id: 'export', label: 'Reports & Export', icon: Download, action: onOpenExport },
    { id: 'settings', label: 'Settings', icon: Settings, action: onOpenSettings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200/90 flex flex-col justify-between min-h-screen py-5 px-4 hidden lg:flex select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-2 pb-6 border-b border-slate-100">
          <div className="h-10 w-10 rounded-xl bg-[#0d3326] flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none flex items-center gap-1.5">
              <span>ResGap</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">AI</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400 mt-1">Research Intelligence</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs transition cursor-pointer ${
                  isActive
                    ? 'bg-[#e8f3ee] text-[#0d3326] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#0d3326]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Quota & Pro Card (From Labflow) */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="bg-[#f8faf9] p-3 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Research Credits</span>
            <span className="font-mono font-bold text-[#0d3326]">8,240</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Indexed Papers</span>
              <span className="font-semibold text-slate-600">24 / 50</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full w-[48%]" />
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="w-full py-2.5 px-3 rounded-xl bg-[#0d3326] hover:bg-[#124233] text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center space-x-1.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>Scholar Pro Active</span>
        </button>
      </div>
    </aside>
  );
};
