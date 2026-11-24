'use client';

import React from 'react';
import { Table, FileSpreadsheet, ArrowUpRight, ExternalLink, Globe } from 'lucide-react';
import { MatrixRow } from '@/types';

interface ComparativeMatrixProps {
  matrix: MatrixRow[];
}

export const ComparativeMatrix: React.FC<ComparativeMatrixProps> = ({ matrix }) => {
  if (!matrix || matrix.length === 0) return null;

  return (
    <div className="w-full mt-10 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="font-semibold text-base text-white">Comparative Literature Review Matrix</h3>
            <p className="text-xs text-slate-400">Systematic cross-examination of methods, datasets, limitations, and future work</p>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 rounded-tl-xl">Paper / Publication</th>
              <th className="py-3 px-4">Methodology</th>
              <th className="py-3 px-4">Dataset / Corpus</th>
              <th className="py-3 px-4 text-amber-400">Primary Limitation</th>
              <th className="py-3 px-4 text-cyan-400 rounded-tr-xl">Stated Future Work</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {matrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition">
                <td className="py-3.5 px-4 font-medium text-slate-200 max-w-xs align-top">
                  <div className="font-semibold text-white leading-snug">{row.title}</div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {row.url && (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 transition"
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                        <span>Direct Paper</span>
                      </a>
                    )}
                    <a
                      href={`https://scholar.google.com/scholar?q=${encodeURIComponent(row.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Google Scholar search"
                    >
                      <Globe className="h-2.5 w-2.5 text-emerald-400" />
                      <span>Scholar</span>
                    </a>
                    <a
                      href={`https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=${encodeURIComponent(row.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="IEEE Xplore search"
                    >
                      <ExternalLink className="h-2.5 w-2.5 text-cyan-400" />
                      <span>IEEE</span>
                    </a>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-300 max-w-xs align-top leading-relaxed">
                  {row.method}
                </td>
                <td className="py-3 px-4 text-slate-300 max-w-xs align-top leading-relaxed">
                  {row.data}
                </td>
                <td className="py-3 px-4 text-amber-300/90 max-w-xs align-top leading-relaxed bg-amber-950/10">
                  {row.primaryLimitation}
                </td>
                <td className="py-3 px-4 text-cyan-300/90 max-w-xs align-top leading-relaxed bg-cyan-950/10">
                  {row.futureDirection}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
