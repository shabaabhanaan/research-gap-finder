'use client';

import React, { useState } from 'react';
import { Users, User, Check, Copy, Sparkles, BookOpen, Layers, Target, Cpu, CheckCircle2, ChevronRight } from 'lucide-react';
import { MemberComponent } from '@/types';

interface MemberComponentsViewProps {
  components?: MemberComponent[];
  projectTitle?: string;
}

export const MemberComponentsView: React.FC<MemberComponentsViewProps> = ({ components, projectTitle }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | 'all' | null>(null);

  if (!components || components.length === 0) return null;

  const getMemberColor = (num: number) => {
    switch (num) {
      case 1:
        return {
          border: 'border-blue-500/40 hover:border-blue-400',
          badge: 'bg-blue-950/80 text-blue-400 border-blue-800/60',
          glow: 'from-blue-900/20 to-transparent',
          accent: 'text-blue-400',
          pill: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
        };
      case 2:
        return {
          border: 'border-indigo-500/40 hover:border-indigo-400',
          badge: 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60',
          glow: 'from-indigo-900/20 to-transparent',
          accent: 'text-indigo-400',
          pill: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
        };
      case 3:
        return {
          border: 'border-purple-500/40 hover:border-purple-400',
          badge: 'bg-purple-950/80 text-purple-400 border-purple-800/60',
          glow: 'from-purple-900/20 to-transparent',
          accent: 'text-purple-400',
          pill: 'bg-purple-500/10 text-purple-300 border-purple-500/20'
        };
      case 4:
      default:
        return {
          border: 'border-emerald-500/40 hover:border-emerald-400',
          badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
          glow: 'from-emerald-900/20 to-transparent',
          accent: 'text-emerald-400',
          pill: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
        };
    }
  };

  const handleCopySingle = (member: MemberComponent) => {
    const text = `### [Member ${member.memberNumber} Component] ${member.componentTitle}
- **Role & Scope**: ${member.scopeAndRole}
- **Individual Research Gap**: ${member.individualResearchGap}
- **Individual Research Questions**:
${member.individualResearchQuestions.map(q => `  - ${q}`).join('\n')}
- **Proposed Methodology**: ${member.proposedMethodology}
- **Evaluation & Dataset**: ${member.datasetOrEvaluation}
- **Expected Deliverables**:
${member.expectedDeliverables.map(d => `  - ${d}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(member.memberNumber);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const text = `# 4-Member Research Group Component Breakdown
**Main Research Project**: ${projectTitle || 'Unified Research Project'}

${components.map(m => `## Member ${m.memberNumber}: ${m.componentTitle}
- **Scope & Role**: ${m.scopeAndRole}
- **Individual Research Gap**: ${m.individualResearchGap}
- **Research Questions (RQs)**:
${m.individualResearchQuestions.map(q => `  * ${q}`).join('\n')}
- **Proposed Methodology**: ${m.proposedMethodology}
- **Evaluation & Dataset**: ${m.datasetOrEvaluation}
- **Key Deliverables**:
${m.expectedDeliverables.map(d => `  * ${d}`).join('\n')}
`).join('\n---\n\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedIndex('all');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full mt-10 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>4-Member Research Group Component Breakdown</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  4 Independent Components
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Deconstructed into 4 non-overlapping, individual research modules for group capstone/dissertation defense.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyAll}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition shrink-0 cursor-pointer"
        >
          {copiedIndex === 'all' ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied All 4 Components!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Full 4-Member Workplan</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {components.map((member) => {
          const colors = getMemberColor(member.memberNumber);
          const isCopied = copiedIndex === member.memberNumber;

          return (
            <div
              key={member.memberNumber}
              className={`rounded-2xl border bg-slate-950/70 p-5 transition-all hover:shadow-xl flex flex-col justify-between ${colors.border}`}
            >
              <div>
                {/* Member Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2.5">
                    <span className={`h-7 px-2.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-center ${colors.badge}`}>
                      Member {member.memberNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      Component #{member.memberNumber}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopySingle(member)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
                    title={`Copy Member ${member.memberNumber} proposal`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-slate-400" />
                        <span className="text-[11px]">Copy Plan</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Component Title */}
                <div className="mt-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Individual Research Component Title
                  </span>
                  <h4 className="text-base font-bold text-white mt-1 leading-snug">
                    {member.componentTitle}
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {member.scopeAndRole}
                  </p>
                </div>

                {/* Individual Research Gap */}
                <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-400 mb-1">
                    <Target className="h-3.5 w-3.5" />
                    <span>Member&apos;s Individual Research Gap</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {member.individualResearchGap}
                  </p>
                </div>

                {/* Individual Research Questions */}
                <div className="mt-4 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Individual Research Questions (RQs)</span>
                  </span>
                  <div className="space-y-1.5">
                    {member.individualResearchQuestions.map((rq, idx) => (
                      <div
                        key={idx}
                        className="text-xs p-2 rounded-lg bg-blue-950/20 border border-blue-900/30 text-slate-200 leading-relaxed font-medium"
                      >
                        {rq}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Methodology & Evaluation */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
                    <span className="font-semibold text-slate-400 block mb-0.5">Methodology:</span>
                    <span className="text-slate-300 text-[11px] leading-snug block">{member.proposedMethodology}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
                    <span className="font-semibold text-slate-400 block mb-0.5">Evaluation & Benchmark:</span>
                    <span className="text-slate-300 text-[11px] leading-snug block">{member.datasetOrEvaluation}</span>
                  </div>
                </div>
              </div>

              {/* Expected Deliverables */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Key Individual Deliverables (For Thesis / Viva)
                </span>
                <ul className="space-y-1">
                  {member.expectedDeliverables.map((item, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center space-x-1.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span className="text-[11px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
