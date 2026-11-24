'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { HeroBanner } from '@/components/HeroBanner';
import { MetricsRow } from '@/components/MetricsRow';
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
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [activeSection, setActiveSection] = useState('overview');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [synthesis, setSynthesis] = useState<SynthesisResult | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [engine, setEngine] = useState<'local' | 'gemini' | 'openai'>('local');
  const [error, setError] = useState<string | null>(null);

  // Load API key & engine from localStorage if present
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
    await runSynthesisWithPapers(SAMPLE_PAPERS);
  };

  const handleProposalAnalyzed = (result: SynthesisResult, retrievedPapers: Paper[]) => {
    setSynthesis(result);
    if (retrievedPapers && retrievedPapers.length > 0) {
      setPapers(retrievedPapers);
    }
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
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
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred during synthesis.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const scrollToInput = () => {
    document.getElementById('ingest-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(`${sectionId}-section`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f4f7f6] text-slate-800 antialiased font-sans">
      {/* Labflow Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <TopHeader
          onOpenExport={() => setIsExportOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          papersCount={papers.length}
          domain={synthesis?.domain}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Deep Forest Green Hero Banner */}
          <HeroBanner
            onStartSynthesis={scrollToInput}
            onLoadSamples={handleLoadSamples}
            papersCount={papers.length}
            gapsCount={synthesis?.gaps.length || 0}
          />

          {/* 8-Stat KPI Metrics Row */}
          <MetricsRow
            papersCount={papers.length}
            gapsCount={synthesis?.gaps.length || 0}
            referencesCount={synthesis?.references?.length || 0}
          />

          {/* Paper / Proposal Ingestion Zone */}
          <section id="ingest-section" className="pt-2">
            <UploadZone
              onPaperAdded={handlePaperAdded}
              onLoadSamples={handleLoadSamples}
              onProposalAnalyzed={handleProposalAnalyzed}
              apiKey={apiKey}
              engine={engine}
            />
          </section>

          {/* Mined Publications List */}
          <PaperList
            papers={papers}
            onRemovePaper={handleRemovePaper}
            onClearAll={handleClearAll}
          />

          {/* Manual Synthesis CTA when papers loaded but not synthesized */}
          {papers.length > 0 && !synthesis && (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Ready to Synthesize {papers.length} Academic Publication{papers.length > 1 ? 's' : ''}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
                Cross-examine all extracted methodologies, datasets, and limitations to isolate the critical research voids.
              </p>
              <button
                onClick={runSynthesis}
                disabled={isSynthesizing}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#0d3326] hover:bg-[#124232] shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
                <span>{isSynthesizing ? 'Synthesizing Literature Voids...' : 'Synthesize Research Gaps Now'}</span>
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800 text-center">
              {error}
            </div>
          )}

          {/* Synthesis Results Section */}
          {synthesis && (
            <section id="results-section" className="pt-4 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              {/* Academic Literature References */}
              {synthesis.references && synthesis.references.length > 0 && (
                <div id="references-section">
                  <ReferencesList
                    references={synthesis.references}
                    proposalTitle={synthesis.proposalTitle}
                  />
                </div>
              )}

              {/* 4-Member Research Group Component Breakdown */}
              {synthesis.memberComponents && synthesis.memberComponents.length > 0 && (
                <div id="team-section">
                  <MemberComponentsView
                    components={synthesis.memberComponents}
                    projectTitle={synthesis.proposalTitle}
                  />
                </div>
              )}

              {/* Primary Gap Dashboard */}
              <div id="gaps-section">
                <GapDashboard synthesis={synthesis} />
              </div>

              {/* Systematic Literature Matrix */}
              <div id="matrix-section">
                <ComparativeMatrix matrix={synthesis.comparativeMatrix} />
              </div>

              {/* Strategic Research Agenda */}
              <ResearchAgenda directions={synthesis.recommendedDirections} />
            </section>
          )}

          {/* Dashboard Footer */}
          <footer className="pt-10 pb-6 border-t border-slate-200/80 text-center text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-600">
              ResGap AI • Systematic Literature Review & Void Extractor
            </p>
            <p>
              Empowering principal investigators, postgraduate researchers, and academic teams.
            </p>
          </footer>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={handleSetApiKey}
        engine={engine}
        setEngine={handleSetEngine}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        synthesis={synthesis}
      />
    </div>
  );
}
