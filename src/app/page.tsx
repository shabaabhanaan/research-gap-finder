'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { UploadZone } from '@/components/UploadZone';
import { PaperList } from '@/components/PaperList';
import { GapDashboard } from '@/components/GapDashboard';
import { ComparativeMatrix } from '@/components/ComparativeMatrix';
import { ResearchAgenda } from '@/components/ResearchAgenda';
import { ReferencesList } from '@/components/ReferencesList';
import { MemberComponentsView } from '@/components/MemberComponentsView';
import { ExportModal } from '@/components/ExportModal';
import { SettingsModal } from '@/components/SettingsModal';
import { Paper, SynthesisResult } from '@/types';
import { SAMPLE_PAPERS } from '@/lib/samplePapers';
import { 
  Sparkles, 
  FlaskConical, 
  Search, 
  FileCheck, 
  BookOpen, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [synthesis, setSynthesis] = useState<SynthesisResult | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [engine, setEngine] = useState<'local' | 'gemini' | 'openai'>('local');
  const [error, setError] = useState<string | null>(null);

  // Load API key from localStorage if present
  useEffect(() => {
    const savedKey = localStorage.getItem('resgap_api_key');
    if (savedKey) setApiKey(savedKey);
    const savedEngine = localStorage.getItem('resgap_engine') as any;
    if (savedEngine) setEngine(savedEngine);
  }, []);

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('resgap_api_key', key);
  };

  const handleSetEngine = (eng: 'local' | 'gemini' | 'openai') => {
    setEngine(eng);
    localStorage.setItem('resgap_engine', eng);
  };

  const handlePaperAdded = (newPaper: Paper) => {
    setPapers((prev) => [...prev, newPaper]);
  };

  const handleRemovePaper = (id: string) => {
    setPapers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearAll = () => {
    setPapers([]);
    setSynthesis(null);
  };

  const handleLoadSamples = async () => {
    setPapers(SAMPLE_PAPERS);
    // Auto-synthesize for immediate satisfaction
    await runSynthesisWithPapers(SAMPLE_PAPERS);
  };

  const handleProposalAnalyzed = (result: SynthesisResult, retrievedPapers: Paper[]) => {
    setSynthesis(result);
    if (retrievedPapers && retrievedPapers.length > 0) {
      setPapers(retrievedPapers);
    }
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const runSynthesis = async () => {
    await runSynthesisWithPapers(papers);
  };

  const runSynthesisWithPapers = async (targetPapers: Paper[]) => {
    if (targetPapers.length === 0) return;
    setError(null);
    setIsSynthesizing(true);

    try {
      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          papers: targetPapers,
          apiKey: apiKey.trim() || undefined,
          model: engine
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize research gaps');
      }

      setSynthesis(data.result);
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred during synthesis.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        papersCount={papers.length}
        hasResults={!!synthesis}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onSynthesize={runSynthesis}
        isSynthesizing={isSynthesizing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Automated Systematic Literature Gap Extractor</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Pinpoint <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">Research Gaps</span> & Formulate Novel Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
            Ingest peer-reviewed manuscripts or abstracts. ResGap parses cross-paper limitations, identifies under-explored empirical & methodological voids, and formulates publishable Research Questions (RQs).
          </p>

          {/* Workflow Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 text-left">
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start space-x-3">
              <span className="h-6 w-6 rounded-full bg-blue-950 text-blue-400 border border-blue-800/40 text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Ingest Papers</span>
                <span className="text-[11px] text-slate-400">PDFs, abstracts, or sample literature</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start space-x-3">
              <span className="h-6 w-6 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/40 text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Mine Limitations</span>
                <span className="text-[11px] text-slate-400">Extracts threats to validity & constraints</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start space-x-3">
              <span className="h-6 w-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40 text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Synthesize Gaps</span>
                <span className="text-[11px] text-slate-400">Actionable RQs & comparative matrix</span>
              </div>
            </div>
          </div>
        </div>

        {/* Paper Ingestion Section */}
        <UploadZone
          onPaperAdded={handlePaperAdded}
          onLoadSamples={handleLoadSamples}
          onProposalAnalyzed={handleProposalAnalyzed}
          apiKey={apiKey}
          engine={engine}
        />

        {/* List of Extracted Papers */}
        <PaperList
          papers={papers}
          onRemovePaper={handleRemovePaper}
          onClearAll={handleClearAll}
        />

        {/* Floating / Sticky Synthesize Trigger if papers loaded but not synthesized */}
        {papers.length > 0 && !synthesis && (
          <div className="mt-8 text-center p-8 rounded-2xl bg-gradient-to-b from-blue-950/30 to-indigo-950/20 border border-blue-900/40">
            <h3 className="text-lg font-bold text-white mb-2">
              Ready to Synthesize {papers.length} Academic Publication{papers.length > 1 ? 's' : ''}
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto mb-5">
              Cross-examine all extracted limitations, methodologies, and datasets to uncover the unresolved research gaps.
            </p>
            <button
              onClick={runSynthesis}
              disabled={isSynthesizing}
              className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-600/30 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
              <span>{isSynthesizing ? 'Synthesizing Literature Voids...' : 'Synthesize Research Gaps Now'}</span>
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-950/50 border border-red-800 text-sm text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Synthesis Results Section */}
        {synthesis && (
          <section id="results-section" className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Academic Literature References */}
            {synthesis.references && synthesis.references.length > 0 && (
              <ReferencesList
                references={synthesis.references}
                proposalTitle={synthesis.proposalTitle}
              />
            )}

            {/* 4-Member Research Group Component Breakdown */}
            {synthesis.memberComponents && synthesis.memberComponents.length > 0 && (
              <MemberComponentsView
                components={synthesis.memberComponents}
                projectTitle={synthesis.proposalTitle}
              />
            )}

            {/* Primary Gap Dashboard */}
            <GapDashboard synthesis={synthesis} />

            {/* Systematic Literature Matrix */}
            <ComparativeMatrix matrix={synthesis.comparativeMatrix} />

            {/* Strategic Research Agenda */}
            <ResearchAgenda directions={synthesis.recommendedDirections} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
          <p className="font-medium text-slate-400">
            ResGap — Academic Literature & Research Gap Discovery Engine
          </p>
          <p>
            Designed for graduate researchers, principal investigators, and scholars to accelerate rigorous literature review.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={handleSetApiKey}
        engine={engine}
        setEngine={handleSetEngine}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        synthesis={synthesis}
      />
    </div>
  );
}
