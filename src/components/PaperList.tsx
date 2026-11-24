'use client';

import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, FileText, AlertTriangle, Compass, Database, Cpu, ExternalLink, Globe } from 'lucide-react';
import { Paper } from '@/types';

interface PaperListProps {
  papers: Paper[];
  onRemovePaper: (id: string) => void;
  onClearAll: () => void;
}

export const PaperList: React.FC<PaperListProps> = ({ papers, onRemovePaper, onClearAll }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (papers.length === 0) return null;

  return (
    <div className="w-full mt-6 bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Analyzed Publications ({papers.length})
            </h3>
            <p className="text-[11px] text-slate-400">Extracted limitations, methodologies, datasets & future work</p>
          </div>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-slate-400 hover:text-red-500 transition cursor-pointer flex items-center space-x-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {papers.map((paper, index) => {
          const isExpanded = expandedId === paper.id;
          const limitationsCount = paper.limitations?.length || 0;
          const futureWorkCount = paper.futureWork?.length || 0;

          return (
            <div
              key={paper.id}
              className="border border-slate-200/90 rounded-xl bg-white hover:bg-[#fcfdfd] transition-all overflow-hidden shadow-2xs"
            >
              {/* Paper Header Row */}
              <div
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                onClick={() => setExpandedId(isExpanded ? null : paper.id)}
              >
                <div className="flex items-start space-x-3">
                  <span className="shrink-0 flex items-center justify-center h-6 w-6 rounded-lg bg-[#0d3326] text-emerald-400 text-xs font-mono font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {paper.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                      {paper.year && <span className="text-slate-600 font-mono font-semibold">[{paper.year}]</span>}
                      {paper.venue && <span className="text-slate-600 italic font-sans">{paper.venue}</span>}
                      {paper.authors && paper.authors.length > 0 && (
                        <span>by {paper.authors.join(', ')}</span>
                      )}
                    </div>

                    {/* Exact Paper Links & Academic Search Shortcuts */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-1.5" onClick={(e) => e.stopPropagation()}>
                      {paper.url && (
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition shadow-2xs"
                          title="Open direct paper link or DOI"
                        >
                          <ExternalLink className="h-3 w-3 text-emerald-700" />
                          <span>View Original Paper</span>
                        </a>
                      )}
                      <a
                        href={`https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] bg-[#f4f7f6] hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition"
                        title="Search publication on Google Scholar"
                      >
                        <Globe className="h-3 w-3 text-emerald-700" />
                        <span>Google Scholar</span>
                      </a>
                      <a
                        href={`https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=${encodeURIComponent(paper.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] bg-[#f4f7f6] hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition"
                        title="Search publication on IEEE Xplore"
                      >
                        <ExternalLink className="h-3 w-3 text-blue-700" />
                        <span>IEEE Xplore</span>
                      </a>
                      <a
                        href={`https://www.semanticscholar.org/search?q=${encodeURIComponent(paper.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] bg-[#f4f7f6] hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition"
                        title="Search publication on Semantic Scholar"
                      >
                        <ExternalLink className="h-3 w-3 text-indigo-700" />
                        <span>Semantic Scholar</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Badges & Expand */}
                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-600" />
                    <span>{limitationsCount} limitations</span>
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold flex items-center gap-1">
                    <Compass className="h-3 w-3 text-cyan-600" />
                    <span>{futureWorkCount} future works</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePaper(paper.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                    title="Remove paper"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-[#f8faf9] text-xs space-y-3.5">
                  {/* Abstract */}
                  {paper.abstract && (
                    <div>
                      <span className="font-bold text-slate-800 block mb-1">Abstract</span>
                      <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                        {paper.abstract}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Methodology */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center space-x-1.5 text-blue-700 font-bold mb-1">
                        <Cpu className="h-3.5 w-3.5" />
                        <span>Extracted Methodology</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {paper.methodology || 'No explicit methodology section extracted.'}
                      </p>
                    </div>

                    {/* Dataset */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center space-x-1.5 text-indigo-700 font-bold mb-1">
                        <Database className="h-3.5 w-3.5" />
                        <span>Dataset / Benchmark</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {paper.datasetOrSample || 'No explicit dataset details extracted.'}
                      </p>
                    </div>
                  </div>

                  {/* Extracted Limitations */}
                  {limitationsCount > 0 && (
                    <div>
                      <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        <span>Extracted Limitations & Bottlenecks</span>
                      </span>
                      <ul className="space-y-1 pl-4 list-disc text-slate-700 marker:text-amber-500">
                        {paper.limitations.map((lim, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {lim}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Future Directions */}
                  {futureWorkCount > 0 && (
                    <div>
                      <span className="font-bold text-cyan-900 flex items-center gap-1.5 mb-1.5">
                        <Compass className="h-3.5 w-3.5 text-cyan-600" />
                        <span>Stated Future Work & Open Challenges</span>
                      </span>
                      <ul className="space-y-1 pl-4 list-disc text-slate-700 marker:text-cyan-500">
                        {paper.futureWork.map((fw, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {fw}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
