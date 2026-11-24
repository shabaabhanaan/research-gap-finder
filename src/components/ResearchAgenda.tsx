'use client';

import React from 'react';
import { Target } from 'lucide-react';
import { RecommendedDirection } from '@/types';

interface ResearchAgendaProps {
  directions: RecommendedDirection[];
}

export const ResearchAgenda: React.FC<ResearchAgendaProps> = ({ directions }) => {
  if (!directions || directions.length === 0) return null;

  const getDifficultyBadge = (difficulty: 'Novice' | 'Intermediate' | 'Advanced') => {
    switch (difficulty) {
      case 'Advanced':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">PhD / Major Grant Level</span>;
      case 'Intermediate':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Master / Conference Paper</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Workshop / Fast-Track Study</span>;
    }
  };

  return (
    <div className="w-full mt-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-200">
        <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0d3326]">
          <Target className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-900">Actionable Research Agenda & Target Deliverables</h3>
          <p className="text-xs text-slate-500">High-yield project proposals mapped directly to identified literature gaps</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        {directions.map((dir, idx) => (
          <div
            key={dir.id || idx}
            className="flex flex-col justify-between p-5 rounded-xl bg-[#f8faf9] border border-slate-200/80 hover:border-slate-300 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-[#0d3326] font-bold px-2 py-0.5 rounded bg-white border border-slate-200">
                  {dir.targetVenueType}
                </span>
                {getDifficultyBadge(dir.difficulty)}
              </div>

              <h4 className="font-bold text-sm text-slate-900 leading-snug">
                {dir.title}
              </h4>

              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                {dir.rationale}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                Expected Contribution:
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {dir.expectedContribution}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
