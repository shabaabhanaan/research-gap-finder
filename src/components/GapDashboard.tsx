'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  FlaskConical, 
  BarChart3, 
  Globe2, 
  Cpu, 
  Lightbulb, 
  Copy, 
  Check, 
  Quote, 
  Flame, 
  Layers,
  ExternalLink 
} from 'lucide-react';
import { ResearchGap, GapCategory, SynthesisResult } from '@/types';

interface GapDashboardProps {
  synthesis: SynthesisResult;
}

export const GapDashboard: React.FC<GapDashboardProps> = ({ synthesis }) => {
  const [selectedCategory, setSelectedCategory] = useState<GapCategory | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { key: GapCategory | 'all'; label: string; icon: any; count: number }[] = [
    { key: 'all', label: 'All Gaps', icon: Layers, count: synthesis.gaps.length },
    { 
      key: 'methodological', 
      label: 'Methodological', 
      icon: FlaskConical, 
      count: synthesis.gaps.filter(g => g.category === 'methodological').length 
    },
    { 
      key: 'empirical', 
      label: 'Empirical / Data', 
      icon: BarChart3, 
      count: synthesis.gaps.filter(g => g.category === 'empirical').length 
    },
    { 
      key: 'contextual', 
      label: 'Context / Demographics', 
      icon: Globe2, 
      count: synthesis.gaps.filter(g => g.category === 'contextual').length 
    },
    { 
      key: 'practical', 
      label: 'Practical / Systems', 
      icon: Cpu, 
      count: synthesis.gaps.filter(g => g.category === 'practical').length 
    },
    { 
      key: 'theoretical', 
      label: 'Theoretical', 
      icon: Lightbulb, 
      count: synthesis.gaps.filter(g => g.category === 'theoretical').length 
    }
  ];

  const filteredGaps = selectedCategory === 'all'
    ? synthesis.gaps
    : synthesis.gaps.filter(g => g.category === selectedCategory);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSeverityBadge = (severity: 'High' | 'Medium' | 'Low') => {
    switch (severity) {
      case 'High':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
            <Flame className="h-3 w-3 text-red-400" />
            <span>High Void Severity</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Moderate Gap
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30">
            Exploratory Gap
          </span>
        );
    }
  };

  const getCategoryColor = (category: GapCategory) => {
    switch (category) {
      case 'methodological':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'empirical':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'contextual':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'practical':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'theoretical':
        return 'text-pink-400 bg-pink-500/10 border-pink-500/20';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="w-full mt-8 space-y-6">
      {/* Domain Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-800/40 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 tracking-wider uppercase mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Synthesized Research Field</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {synthesis.domain}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {synthesis.summary}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
            <div className="text-center px-2">
              <div className="text-2xl font-bold font-mono text-cyan-400">{synthesis.papersAnalyzed}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Papers</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-2xl font-bold font-mono text-indigo-400">{synthesis.gaps.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Gaps Isolated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gaps Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredGaps.map((gap, index) => {
          return (
            <div
              key={gap.id}
              className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl hover:shadow-blue-950/20"
            >
              {/* Header: Title, Category Badge, Severity Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="flex items-center space-x-2.5">
                  <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold capitalize ${getCategoryColor(gap.category)}`}>
                    {gap.category} Gap
                  </span>
                  {getSeverityBadge(gap.severity)}
                </div>

                <span className="text-xs font-mono text-slate-500">
                  Gap #{index + 1}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white leading-snug">
                  {gap.title}
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {gap.description}
                </p>
              </div>

              {/* Direct Evidence Trail */}
              {gap.evidence && gap.evidence.length > 0 && (
                <div className="mt-4 bg-slate-950/50 rounded-xl p-3.5 border border-slate-800/60 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400">
                    <Quote className="h-3.5 w-3.5 text-slate-500" />
                    <span>Evidence Trail in Literature</span>
                  </div>
                  <div className="space-y-1.5">
                    {gap.evidence.map((ev, i) => (
                      <div key={i} className="text-xs text-slate-300 border-l-2 border-indigo-500/60 pl-2.5 py-1">
                        <a
                          href={`https://scholar.google.com/scholar?q=${encodeURIComponent(ev.paperTitle)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-1 hover:underline mr-1"
                          title="Open exact publication on Google Scholar"
                        >
                          <span>[{ev.paperTitle}]</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                        </a>
                        <span className="italic text-slate-400">&ldquo;{ev.quoteOrNote}&rdquo;</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulated Research Questions (RQs) */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Formulated Research Questions (RQs)</span>
                  </span>
                </div>
                <div className="space-y-2">
                  {gap.suggestedQuestions.map((rq, rqIdx) => (
                    <div
                      key={rqIdx}
                      className="group flex items-start justify-between gap-3 p-3 rounded-xl bg-blue-950/20 border border-blue-900/30 hover:border-blue-700/50 transition"
                    >
                      <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                        {rq}
                      </p>
                      <button
                        onClick={() => handleCopy(rq, `${gap.id}-rq-${rqIdx}`)}
                        className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-blue-600/20 transition cursor-pointer"
                        title="Copy Question"
                      >
                        {copiedId === `${gap.id}-rq-${rqIdx}` ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Methodology & Impact */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/40">
                  <span className="font-semibold text-slate-300 block mb-1">
                    Proposed Methodological Direction:
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    {gap.suggestedMethodology}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/40">
                  <span className="font-semibold text-emerald-400 block mb-1">
                    Expected Academic Contribution & Impact:
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    {gap.potentialImpact}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
