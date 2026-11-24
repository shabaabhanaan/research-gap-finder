'use client';

import React from 'react';
import { FileSpreadsheet, ExternalLink, Globe } from 'lucide-react';
import { MatrixRow } from '@/types';

interface ComparativeMatrixProps {
  matrix: MatrixRow[];
}

export const ComparativeMatrix: React.FC<ComparativeMatrixProps> = ({ matrix }) => {
  if (!matrix || matrix.length === 0) return null;

  return (
    <div className="w-full mt-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0d3326]">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Comparative Literature Review Matrix</h3>
            <p className="text-xs text-slate-500">Systematic cross-examination of methods, datasets, limitations, and future work</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {matrix.length} Studies Mined
        </span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f8faf9] text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-3 px-4">Paper / Publication</th>
              <th className="py-3 px-4">Methodology</th>
              <th className="py-3 px-4">Dataset / Corpus</th>
              <th className="py-3 px-4 text-amber-700 bg-amber-50/50">Primary Limitation</th>
              <th className="py-3 px-4 text-emerald-800 bg-emerald-50/40">Stated Future Work</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {matrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs align-top">
                  <div className="font-semibold text-slate-900 leading-snug">{row.title}</div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {row.url && (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition"
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                        <span>Direct Paper</span>
                      </a>
                    )}
                    <a
                      href={`https://scholar.google.com/scholar?q=${encodeURIComponent(row.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Google Scholar search"
                    >
                      <Globe className="h-2.5 w-2.5 text-emerald-600" />
                      <span>Scholar</span>
                    </a>
                    <a
                      href={`https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=${encodeURIComponent(row.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="IEEE Xplore search"
                    >
                      <ExternalLink className="h-2.5 w-2.5 text-blue-600" />
                      <span>IEEE</span>
                    </a>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600 max-w-xs align-top leading-relaxed">
                  {row.method}
                </td>
                <td className="py-3 px-4 text-slate-600 max-w-xs align-top leading-relaxed">
                  {row.data}
                </td>
                <td className="py-3 px-4 text-amber-900 max-w-xs align-top leading-relaxed bg-amber-50/40">
                  {row.primaryLimitation}
                </td>
                <td className="py-3 px-4 text-emerald-950 max-w-xs align-top leading-relaxed bg-emerald-50/30">
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
