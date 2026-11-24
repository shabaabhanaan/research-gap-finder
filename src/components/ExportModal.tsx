'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Code, 
  Printer, 
  BookOpen, 
  FileDown, 
  Users, 
  Sparkles,
  Layers
} from 'lucide-react';
import { SynthesisResult } from '@/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  synthesis: SynthesisResult | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, synthesis }) => {
  const [activeTab, setActiveTab] = useState<'document' | 'markdown' | 'bibtex' | 'json'>('document');
  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !synthesis) return null;

  const projectTitle = synthesis.proposalTitle || 'Research Project Literature Review & Proposal';

  // 1. Generate Standard Markdown
  const generateMarkdown = (): string => {
    return `# Systematic Literature Review & Research Proposal
**Project Title**: ${projectTitle}  
**Field / Domain**: ${synthesis.domain}  
**Date of Synthesis**: ${new Date(synthesis.timestamp).toLocaleDateString()}  
**Publications Analyzed**: ${synthesis.papersAnalyzed} | **Identified Gaps**: ${synthesis.gaps.length}

---

## 1. Executive Summary & Research Context
${synthesis.summary}

---

## 2. 4-Member Research Group Component Work Breakdown Structure

${(synthesis.memberComponents || []).map(m => `### Member ${m.memberNumber}: ${m.componentTitle}
- **Role & Scope**: ${m.scopeAndRole}
- **Individual Research Gap**: ${m.individualResearchGap}
- **Research Questions (RQs)**:
${m.individualResearchQuestions.map(q => `  * ${q}`).join('\n')}
- **Proposed Methodology**: ${m.proposedMethodology}
- **Evaluation & Benchmark**: ${m.datasetOrEvaluation}
- **Expected Deliverables**:
${m.expectedDeliverables.map(d => `  * ${d}`).join('\n')}
`).join('\n---\n\n')}

---

## 3. Taxonomy of Identified Research Gaps

${synthesis.gaps.map((gap, i) => `### 3.${i + 1} [${gap.category.toUpperCase()} GAP] ${gap.title}
- **Void Severity**: ${gap.severity}
- **Gap Diagnosis**: ${gap.description}
- **Empirical Literature Evidence**:
${gap.evidence.map(e => `  - *${e.paperTitle}*: "${e.quoteOrNote}"`).join('\n')}
- **Formulated Research Questions (RQs)**:
${gap.suggestedQuestions.map(q => `  - **${q}**`).join('\n')}
- **Proposed Methodological Intervention**: ${gap.suggestedMethodology}
- **Anticipated Scientific Impact**: ${gap.potentialImpact}
`).join('\n\n')}

---

## 4. Comparative Literature Review Matrix

| Publication | Methodology | Dataset / Corpus | Primary Limitation | Future Direction |
| :--- | :--- | :--- | :--- | :--- |
${synthesis.comparativeMatrix.map(r => `| **${r.title}** | ${r.method} | ${r.data} | ${r.primaryLimitation} | ${r.futureDirection} |`).join('\n')}

---

## 5. Proposed Strategic Research Agenda

${synthesis.recommendedDirections.map((dir, i) => `#### Agenda Track ${i + 1}: ${dir.title}
- **Target Venue Format**: ${dir.targetVenueType}
- **Complexity Tier**: ${dir.difficulty}
- **Scientific Rationale**: ${dir.rationale}
- **Anticipated Academic Contribution**: ${dir.expectedContribution}
`).join('\n')}

---

## 6. Academic References & Literature Bibliography

${(synthesis.references || []).map((ref, idx) => `[${idx + 1}] ${ref.citationIeee}
- **Scope**: ${ref.abstract}
- **DOI / URL**: ${ref.url || ref.doi || 'N/A'}
`).join('\n')}

---
*Exported with ResGap AI — Systematic Academic Literature & Research Gap Discovery Engine*
`;
  };

  // 2. Generate Standard BibTeX
  const generateBibtex = (): string => {
    if (!synthesis.references || synthesis.references.length === 0) {
      return `% No references retrieved yet\n`;
    }
    return synthesis.references.map(r => r.bibtex || '').join('\n\n');
  };

  // 3. Generate Standard Microsoft Word HTML Document
  const generateWordHtml = (): string => {
    return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${projectTitle}</title>
  <style>
    body { font-family: 'Calibri', 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; color: #1e293b; margin: 40pt; }
    h1 { font-size: 20pt; color: #0c2e22; text-align: center; margin-bottom: 6pt; }
    .subtitle { text-align: center; font-size: 11pt; color: #64748b; margin-bottom: 24pt; }
    h2 { font-size: 14pt; color: #0c2e22; border-bottom: 1.5pt solid #059669; padding-bottom: 3pt; margin-top: 20pt; }
    h3 { font-size: 12pt; color: #0f172a; margin-top: 14pt; }
    table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
    th, td { border: 1pt solid #cbd5e1; padding: 6pt 8pt; text-align: left; font-size: 9.5pt; vertical-align: top; }
    th { background-color: #f1f5f9; font-weight: bold; color: #1e293b; }
    .badge { font-size: 8.5pt; font-weight: bold; padding: 2pt 6pt; background-color: #ecfdf5; color: #065f46; border-radius: 4pt; }
    .card { background-color: #f8fafc; border: 1pt solid #e2e8f0; padding: 10pt; border-radius: 6pt; margin-bottom: 10pt; }
    ul { margin: 4pt 0 8pt 16pt; }
    li { margin-bottom: 3pt; }
  </style>
</head>
<body>
  <h1>${projectTitle}</h1>
  <div class="subtitle">
    <strong>Field of Study:</strong> ${synthesis.domain} | <strong>Date:</strong> ${new Date(synthesis.timestamp).toLocaleDateString()}
  </div>

  <h2>1. Executive Summary & Research Landscape</h2>
  <p>${synthesis.summary}</p>

  <h2>2. 4-Member Research Group Component Work Breakdown</h2>
  ${(synthesis.memberComponents || []).map(m => `
    <div class="card">
      <h3>Member ${m.memberNumber}: ${m.componentTitle}</h3>
      <p><strong>Role & Scope:</strong> ${m.scopeAndRole}</p>
      <p><strong>Individual Research Gap:</strong> ${m.individualResearchGap}</p>
      <p><strong>Individual Research Questions (RQs):</strong></p>
      <ul>${m.individualResearchQuestions.map(q => `<li><strong>${q}</strong></li>`).join('')}</ul>
      <p><strong>Methodology:</strong> ${m.proposedMethodology}</p>
      <p><strong>Evaluation & Benchmark:</strong> ${m.datasetOrEvaluation}</p>
      <p><strong>Deliverables:</strong></p>
      <ul>${m.expectedDeliverables.map(d => `<li>${d}</li>`).join('')}</ul>
    </div>
  `).join('')}

  <h2>3. Comparative Literature Review Matrix</h2>
  <table>
    <thead>
      <tr>
        <th>Publication</th>
        <th>Methodology</th>
        <th>Dataset / Corpus</th>
        <th>Primary Limitation</th>
        <th>Future Direction</th>
      </tr>
    </thead>
    <tbody>
      ${synthesis.comparativeMatrix.map(r => `
        <tr>
          <td><strong>${r.title}</strong></td>
          <td>${r.method}</td>
          <td>${r.data}</td>
          <td>${r.primaryLimitation}</td>
          <td>${r.futureDirection}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>4. Taxonomy of Identified Research Gaps</h2>
  ${synthesis.gaps.map((gap) => `
    <div class="card">
      <h3>[${gap.category.toUpperCase()}] ${gap.title} (Severity: ${gap.severity})</h3>
      <p>${gap.description}</p>
      <p><strong>Research Questions:</strong></p>
      <ul>${gap.suggestedQuestions.map(q => `<li>${q}</li>`).join('')}</ul>
      <p><strong>Proposed Methodology:</strong> ${gap.suggestedMethodology}</p>
    </div>
  `).join('')}

  <h2>5. Academic Literature References (IEEE Format)</h2>
  <ul>
    ${(synthesis.references || []).map((r, i) => `<li>[${i + 1}] ${r.citationIeee}</li>`).join('')}
  </ul>

  <p style="text-align: center; color: #94a3b8; font-size: 8.5pt; margin-top: 30pt;">
    Exported from ResGap AI — Systematic Academic Literature & Research Gap Discovery Engine
  </p>
</body>
</html>`;
  };

  const markdownContent = generateMarkdown();
  const bibtexContent = generateBibtex();
  const jsonContent = JSON.stringify(synthesis, null, 2);

  const getActiveContent = () => {
    switch (activeTab) {
      case 'markdown':
        return markdownContent;
      case 'bibtex':
        return bibtexContent;
      case 'json':
        return jsonContent;
      default:
        return markdownContent;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let filename = 'research-proposal-literature-review.md';
    let mime = 'text/markdown';
    let content = markdownContent;

    if (activeTab === 'json') {
      filename = 'research-gaps-synthesis.json';
      mime = 'application/json';
      content = jsonContent;
    } else if (activeTab === 'bibtex') {
      filename = 'references.bib';
      mime = 'application/x-bibtex';
      content = bibtexContent;
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWord = () => {
    const wordHtml = generateWordHtml();
    const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectTitle.slice(0, 35).replace(/[^\w]/g, '_')}_Proposal_Report.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(generateWordHtml());
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 text-[#0d3326] border border-emerald-100">
              <Download className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900">Standard Academic Literature & Proposal Export</h3>
              <p className="text-xs text-slate-500">Formal document preview, Microsoft Word, BibTeX, and print-ready PDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar: Format Selector & Standard Export Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3.5 bg-[#f8faf9] border-b border-slate-200">
          {/* Format Tabs */}
          <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('document')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                activeTab === 'document'
                  ? 'bg-[#0d3326] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>📄 Academic Proposal View</span>
            </button>
            <button
              onClick={() => setActiveTab('markdown')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                activeTab === 'markdown'
                  ? 'bg-[#0d3326] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>Markdown (.md)</span>
            </button>
            <button
              onClick={() => setActiveTab('bibtex')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                activeTab === 'bibtex'
                  ? 'bg-[#0d3326] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>BibTeX (.bib)</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                activeTab === 'json'
                  ? 'bg-[#0d3326] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              <span>JSON</span>
            </button>
          </div>

          {/* Standard Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition cursor-pointer shadow-xs"
              title="Print standard academic report or Save as PDF"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadWord}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#0d3326] border border-emerald-200 transition cursor-pointer shadow-xs"
              title="Download Microsoft Word document (.doc)"
            >
              <Download className="h-3.5 w-3.5 text-emerald-700" />
              <span>Word (.doc)</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition cursor-pointer shadow-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {activeTab !== 'document' && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0d3326] hover:bg-[#124232] text-white transition cursor-pointer shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download {activeTab.toUpperCase()}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content View Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f4f7f6]">
          {activeTab === 'document' ? (
            /* Rendered Standard Academic Document Preview */
            <div
              ref={printAreaRef}
              className="max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-10 shadow-xs text-slate-800 space-y-8"
            >
              {/* Document Header */}
              <div className="text-center pb-6 border-b border-slate-200">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
                  Systematic Literature Review & Capstone Research Proposal
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {projectTitle}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-slate-500">
                  <span><strong>Domain:</strong> {synthesis.domain}</span>
                  <span>•</span>
                  <span><strong>Date:</strong> {new Date(synthesis.timestamp).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-700">Proposal Stage</span>
                </div>
              </div>

              {/* 1. Executive Summary */}
              <div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>1. Executive Summary & Problem Scope</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-[#f8faf9] p-4 rounded-xl border border-slate-200/80">
                  {synthesis.summary}
                </p>
              </div>

              {/* 2. 4-Member Research Group Breakdown */}
              {synthesis.memberComponents && synthesis.memberComponents.length > 0 && (
                <div>
                  <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-700" />
                    <span>2. 4-Member Research Group Work Breakdown Structure</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {synthesis.memberComponents.map(m => (
                      <div key={m.memberNumber} className="p-4 rounded-xl bg-[#f8faf9] border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="text-xs font-mono font-bold text-[#0d3326] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                            Member #{m.memberNumber}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">Independent Sub-Project</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{m.componentTitle}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{m.scopeAndRole}</p>
                        
                        <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-amber-900">
                          <strong>Individual Gap:</strong> {m.individualResearchGap}
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-slate-500">Research Questions:</span>
                          {m.individualResearchQuestions.map((q, qi) => (
                            <div key={qi} className="text-xs text-slate-800 bg-white p-2 rounded border border-slate-200/80 font-medium leading-relaxed">
                              {q}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Systematic Literature Matrix */}
              <div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-700" />
                  <span>3. Comparative Literature Review Matrix</span>
                </h2>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#f8faf9] text-slate-700 font-semibold border-b border-slate-200">
                        <th className="py-2.5 px-3">Publication</th>
                        <th className="py-2.5 px-3">Methodology</th>
                        <th className="py-2.5 px-3">Dataset</th>
                        <th className="py-2.5 px-3 text-amber-700 bg-amber-50/50">Primary Limitation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {synthesis.comparativeMatrix.map((r, ri) => (
                        <tr key={ri} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-xs">{r.title}</td>
                          <td className="py-2.5 px-3 text-slate-600 max-w-xs">{r.method}</td>
                          <td className="py-2.5 px-3 text-slate-600 max-w-xs">{r.data}</td>
                          <td className="py-2.5 px-3 text-amber-900 bg-amber-50/30 max-w-xs">{r.primaryLimitation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Identified Research Gaps */}
              <div>
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-700" />
                  <span>4. Core Synthesized Research Gaps</span>
                </h2>
                <div className="space-y-3">
                  {synthesis.gaps.map((gap, gi) => (
                    <div key={gi} className="p-4 rounded-xl bg-[#f8faf9] border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize">
                          {gap.category} Gap
                        </span>
                        <span className="text-xs text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Severity: {gap.severity}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{gap.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{gap.description}</p>
                      <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80">
                        <strong className="text-slate-900">Proposed Methodology:</strong> {gap.suggestedMethodology}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. References Bibliography */}
              {synthesis.references && synthesis.references.length > 0 && (
                <div>
                  <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-700" />
                    <span>5. Academic References & Literature Citations (IEEE Format)</span>
                  </h2>
                  <div className="p-4 rounded-xl bg-[#f8faf9] border border-slate-200 space-y-2 font-mono text-xs text-slate-700">
                    {synthesis.references.map((r, ri) => (
                      <div key={ri} className="leading-relaxed">
                        {r.citationIeee}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Code / Text Formats View (Markdown, BibTeX, JSON) */
            <div className="max-w-4xl mx-auto bg-white p-5 rounded-2xl border border-slate-200 shadow-xs font-mono text-xs text-slate-800 leading-relaxed overflow-x-auto">
              <pre className="whitespace-pre-wrap">{getActiveContent()}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
