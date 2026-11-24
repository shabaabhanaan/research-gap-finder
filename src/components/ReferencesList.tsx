'use client';

import React, { useState } from 'react';
import { BookOpen, Copy, Check, ExternalLink, Globe } from 'lucide-react';
import { ReferenceItem } from '@/types';

interface ReferencesListProps {
  references?: ReferenceItem[];
  proposalTitle?: string;
}

export const ReferencesList: React.FC<ReferencesListProps> = ({ references, proposalTitle }) => {
  const [style, setStyle] = useState<'ieee' | 'apa' | 'bibtex'>('ieee');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!references || references.length === 0) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    let allText = '';
    if (style === 'ieee') {
      allText = references.map(r => r.citationIeee).join('\n\n');
    } else if (style === 'apa') {
      allText = references.map(r => r.citationApa).join('\n\n');
    } else {
      allText = references.map(r => r.bibtex || '').join('\n\n');
    }
    navigator.clipboard.writeText(allText);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full mt-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0d3326]">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Academic Literature References & Benchmark Papers ({references.length})
              </h3>
              {proposalTitle && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Retrieved and verified peer publications related to: <span className="text-[#0d3326] font-semibold">{proposalTitle}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Citation Format Switcher & Copy All */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex bg-[#f8faf9] p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setStyle('ieee')}
              className={`px-2.5 py-1 rounded-lg transition ${
                style === 'ieee' ? 'bg-[#0d3326] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IEEE
            </button>
            <button
              onClick={() => setStyle('apa')}
              className={`px-2.5 py-1 rounded-lg transition ${
                style === 'apa' ? 'bg-[#0d3326] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              APA
            </button>
            <button
              onClick={() => setStyle('bibtex')}
              className={`px-2.5 py-1 rounded-lg transition ${
                style === 'bibtex' ? 'bg-[#0d3326] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              BibTeX
            </button>
          </div>

          <button
            onClick={handleCopyAll}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition"
          >
            {copiedId === 'all' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied All</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* References Grid */}
      <div className="mt-5 space-y-3">
        {references.map((ref, idx) => {
          const displayCitation = style === 'ieee' ? ref.citationIeee : style === 'apa' ? ref.citationApa : (ref.bibtex || ref.citationIeee);

          return (
            <div
              key={ref.id}
              className="p-4 rounded-xl bg-[#f8faf9] border border-slate-200/80 hover:border-slate-300 transition space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-start space-x-2.5">
                  <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded bg-white text-[#0d3326] text-[11px] font-mono font-bold border border-slate-200 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      {ref.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                      <span>{ref.authors.join(', ')}</span>
                      <span>•</span>
                      <span className="text-slate-700 font-mono font-medium">[{ref.year}]</span>
                      <span>•</span>
                      <span className="italic text-slate-600">{ref.venue}</span>
                      {ref.publisher && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-200/60 text-[10px] text-slate-700">
                          {ref.publisher}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Copy single citation */}
                <button
                  onClick={() => handleCopy(displayCitation, ref.id)}
                  className="shrink-0 inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition"
                  title="Copy citation to clipboard"
                >
                  {copiedId === ref.id ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-700 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-400" />
                      <span className="text-[11px]">Copy {style.toUpperCase()}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Formatted Citation Block */}
              <div className="bg-white p-3 rounded-lg border border-slate-200/80 font-mono text-[11px] text-slate-700 leading-relaxed break-words">
                {displayCitation}
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {ref.url && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-emerald-800 hover:underline font-semibold"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Publisher Link / DOI</span>
                  </a>
                )}
                <a
                  href={`https://scholar.google.com/scholar?q=${encodeURIComponent(ref.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
                >
                  <Globe className="h-2.5 w-2.5 text-emerald-600" />
                  <span>Google Scholar</span>
                </a>
                <a
                  href={`https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=${encodeURIComponent(ref.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
                >
                  <ExternalLink className="h-2.5 w-2.5 text-blue-600" />
                  <span>IEEE Xplore</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
