'use client';

import React from 'react';
import { Compass, Target, GraduationCap, Award, ArrowRight } from 'lucide-react';
import { RecommendedDirection } from '@/types';

interface ResearchAgendaProps {
  directions: RecommendedDirection[];
}

export const ResearchAgenda: React.FC<ResearchAgendaProps> = ({ directions }) => {
  if (!directions || directions.length === 0) return null;

  const getDifficultyBadge = (difficulty: 'Novice' | 'Intermediate' | 'Advanced') => {
    switch (difficulty) {
      case 'Advanced':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">PhD / Major Grant Level</span>;
      case 'Intermediate':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Master / Conference Paper</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Workshop / Fast-Track Study</span>;
    }
  };

  return (
    <div className="w-full mt-10 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
        <Target className="h-5 w-5 text-cyan-400" />
        <div>
          <h3 className="font-semibold text-base text-white">Actionable Research Agenda & Target Deliverables</h3>
          <p className="text-xs text-slate-400">High-yield project proposals mapped directly to identified literature gaps</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        {directions.map((dir, idx) => (
          <div
            key={dir.id || idx}
            className="flex flex-col justify-between p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/30">
                  {dir.targetVenueType}
                </span>
                {getDifficultyBadge(dir.difficulty)}
              </div>

              <h4 className="font-semibold text-sm text-slate-100 leading-snug">
                {dir.title}
              </h4>

              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                {dir.rationale}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                Expected Contribution:
              </span>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {dir.expectedContribution}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
