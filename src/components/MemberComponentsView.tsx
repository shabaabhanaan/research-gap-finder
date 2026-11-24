'use client';

import React, { useState } from 'react';
import { Users, Check, Copy, Sparkles, BookOpen, Layers, Target, Cpu } from 'lucide-react';
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
          border: 'border-emerald-200 hover:border-emerald-300',
          badge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          accent: 'text-emerald-900',
          pill: 'bg-emerald-50 text-emerald-800 border-emerald-200'
        };
      case 2:
        return {
          border: 'border-teal-200 hover:border-teal-300',
          badge: 'bg-teal-50 text-teal-900 border-teal-200',
          accent: 'text-teal-900',
          pill: 'bg-teal-50 text-teal-800 border-teal-200'
        };
      case 3:
        return {
          border: 'border-blue-200 hover:border-blue-300',
          badge: 'bg-blue-50 text-blue-900 border-blue-200',
          accent: 'text-blue-900',
          pill: 'bg-blue-50 text-blue-800 border-blue-200'
        };
      case 4:
      default:
        return {
          border: 'border-slate-200 hover:border-slate-300',
          badge: 'bg-slate-100 text-slate-800 border-slate-200',
          accent: 'text-slate-900',
          pill: 'bg-slate-100 text-slate-700 border-slate-200'
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
    <div className="w-full mt-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0d3326]">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <span>4-Member Research Group Component Breakdown</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  4 Independent Components
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Deconstructed into 4 non-overlapping, individual research modules for group capstone or dissertation defense.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyAll}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0d3326] hover:bg-[#124232] text-white shadow-xs transition shrink-0 cursor-pointer"
        >
          {copiedIndex === 'all' ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-300" />
              <span>Copied All Components</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Full Group Breakdown</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of 4 Member Cards */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {components.map((member) => {
          const styling = getMemberColor(member.memberNumber);
          return (
            <div
              key={member.memberNumber}
              className={`rounded-2xl border ${styling.border} bg-white p-5 flex flex-col justify-between shadow-xs transition hover:shadow-sm`}
            >
              <div>
                {/* Member Badge & Title */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${styling.badge}`}>
                      Member #{member.memberNumber} Sub-Project
                    </span>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {member.componentTitle}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleCopySingle(member)}
                    className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    title={`Copy Member ${member.memberNumber} Component`}
                  >
                    {copiedIndex === member.memberNumber ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Scope & Role */}
                <div className="mt-3.5 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Scope & Core Role:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-[#f8faf9] p-2.5 rounded-xl border border-slate-200/60">
                    {member.scopeAndRole}
                  </p>
                </div>

                {/* Individual Research Gap */}
                <div className="mt-3 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 block">
                    Individual Research Gap / Problem:
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/60">
                    {member.individualResearchGap}
                  </p>
                </div>

                {/* Individual Research Questions */}
                <div className="mt-3 space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0d3326] block">
                    Independent Research Questions (RQs):
                  </span>
                  <div className="space-y-1">
                    {member.individualResearchQuestions.map((rq, qIdx) => (
                      <div
                        key={qIdx}
                        className="text-xs text-slate-800 bg-[#f8faf9] border border-slate-200/80 p-2 rounded-lg leading-relaxed flex items-start gap-1.5"
                      >
                        <span className="font-mono text-emerald-700 font-bold shrink-0">RQ{qIdx + 1}:</span>
                        <span>{rq}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proposed Methodology & Dataset */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Proposed Methodology:
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {member.proposedMethodology}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Evaluation & Dataset:
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {member.datasetOrEvaluation}
                    </p>
                  </div>
                </div>

                {/* Expected Deliverables */}
                <div className="mt-3 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Individual Deliverables:
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1">
                    {member.expectedDeliverables.map((del, dIdx) => (
                      <li key={dIdx} className="flex items-center space-x-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
