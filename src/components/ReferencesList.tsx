'use client';

import React, { useState } from 'react';
import { BookOpen, Copy, Check, ExternalLink, Globe, FileCode2, Sparkles } from 'lucide-react';
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
    <div className="w-full mt-10 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <h3 className="font-bold text-base text-white">
              Academic Literature References & Benchmark Papers ({references.length})
            </h3>
          </div>
          {proposalTitle && (
            <p className="text-xs text-slate-400 mt-1">
              Retrieved and verified peer publications related to: <span className="text-blue-300 font-semibold">{proposalTitle}</span>
            </p>
          )}
        </div>

        {/* Citation Format Switcher & Copy All */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setStyle('ieee')}
              className={`px-2.5 py-1 rounded-lg transition ${
                style === 'ieee' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              IEEE
            </button>
            <button
              onClick={() => setStyle('apa')}
              className={`px-2.5 py-1 rounded-lg transition ${
                style === 'apa' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              APA
            </button>
            <button
              onClick={() => setStyle('bibtex')}
              className={`px-2.5 py-1 rounded-lg transition ${
                style === 'bibtex' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BibTeX
            </button>
          </div>

          <button
            onClick={handleCopyAll}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {copiedId === 'all' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied All</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* References Grid */}
      <div className="mt-5 space-y-3.5">
        {references.map((ref, idx) => {
          const displayCitation = style === 'ieee' ? ref.citationIeee : style === 'apa' ? ref.citationApa : (ref.bibtex || ref.citationIeee);

          return (
            <div
              key={ref.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-start space-x-2.5">
                  <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded bg-blue-950 text-blue-400 text-[11px] font-mono font-bold border border-blue-900/60 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                      {ref.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>{ref.authors.join(', ')}</span>
                      <span>•</span>
                      <span className="text-slate-300 font-mono">[{ref.year}]</span>
                      <span>•</span>
                      <span className="italic text-slate-400">{ref.venue}</span>
                      {ref.publisher && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-800/80 text-[10px] text-blue-300">
                          {ref.publisher}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Copy single citation */}
                <button
                  onClick={() => handleCopy(displayCitation, ref.id)}
                  className="shrink-0 inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
                  title="Copy citation to clipboard"
                >
                  {copiedId === ref.id ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-400" />
                      <span className="text-[11px]">Copy {style.toUpperCase()}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Formatted Citation String Box */}
              <div className="bg-slate-900/90 rounded-lg p-2.5 font-mono text-[11px] text-slate-300 border border-slate-800/80 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {displayCitation}
              </div>

              {/* Links & Abstract snippet */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                {ref.abstract && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 max-w-2xl leading-relaxed">
                    <span className="text-slate-500 font-semibold">Scope: </span>
                    {ref.abstract}
                  </p>
                )}

                <div className="flex items-center space-x-2 shrink-0">
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 transition"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>{ref.doi ? 'Open DOI / Paper' : 'Direct Link'}</span>
                    </a>
                  )}
                  <a
                    href={`https://scholar.google.com/scholar?q=${encodeURIComponent(ref.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    <Globe className="h-3 w-3 text-emerald-400" />
                    <span>Scholar</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
