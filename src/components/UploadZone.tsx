'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, Loader2, Plus, BookOpen, Search, Compass, FileCheck, Users, ChevronDown } from 'lucide-react';
import { Paper, SynthesisResult } from '@/types';
import { SAMPLE_PAPERS } from '@/lib/samplePapers';

interface UploadZoneProps {
  onPaperAdded: (paper: Paper) => void;
  onLoadSamples: () => void;
  onProposalAnalyzed?: (result: SynthesisResult, retrievedPapers: Paper[]) => void;
  apiKey?: string;
  engine?: 'local' | 'gemini' | 'openai';
}

export const UploadZone: React.FC<UploadZoneProps> = ({ 
  onPaperAdded, 
  onLoadSamples, 
  onProposalAnalyzed,
  apiKey,
  engine = 'local'
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'upload'>('text');
  const [uploadMode, setUploadMode] = useState<'proposal' | 'literature'>('proposal');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Manual text entry state
  const [manualTitle, setManualTitle] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [manualText, setManualText] = useState('');
  const [paperCountLimit, setPaperCountLimit] = useState<number>(10);

  // 4-Member Group Component state
  const [showGroupInputs, setShowGroupInputs] = useState(false);
  const [memberComponents, setMemberComponents] = useState({
    member1: '',
    member2: '',
    member3: '',
    member4: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      await processFiles(files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const processFiles = async (files: File[]) => {
    setError(null);
    setIsProcessing(true);

    if (uploadMode === 'proposal' && onProposalAnalyzed && files.length > 0) {
      // Process first file as research proposal
      const proposalFile = files[0];
      setStatusText(`Analyzing proposal & discovering references from academic literature...`);
      const formData = new FormData();
      formData.append('file', proposalFile);
      formData.append('limit', String(paperCountLimit));
      if (apiKey) formData.append('apiKey', apiKey);
      if (engine) formData.append('model', engine);

      try {
        const res = await fetch('/api/analyze-proposal', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to analyze proposal.');
        }
        onProposalAnalyzed(data.result, data.retrievedPapers || []);
      } catch (err: any) {
        console.error('Proposal file error:', err);
        setError(err.message || 'Error analyzing proposal PDF.');
      } finally {
        setIsProcessing(false);
        setStatusText('');
      }
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setStatusText(`Parsing (${i + 1}/${files.length}): ${file.name}...`);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/parse-paper', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || `Failed to parse ${file.name}`);
        }

        onPaperAdded(data.paper);
      } catch (err: any) {
        console.error('File processing error:', err);
        setError(err.message || 'Error parsing uploaded manuscript.');
      }
    }

    setIsProcessing(false);
    setStatusText('');
  };

  const handleAnalyzeProposal = async () => {
    if (!manualTitle.trim() && !manualText.trim()) return;

    setError(null);
    setIsProcessing(true);
    setStatusText('Querying CrossRef, IEEE & ACM literature for peer references & synthesizing research gaps...');

    const formData = new FormData();
    if (manualTitle.trim()) formData.append('title', manualTitle.trim());
    if (manualText.trim()) formData.append('text', manualText.trim());
    formData.append('limit', String(paperCountLimit));
    if (apiKey) formData.append('apiKey', apiKey);
    if (engine) formData.append('model', engine);
    if (memberComponents.member1.trim()) formData.append('member1', memberComponents.member1.trim());
    if (memberComponents.member2.trim()) formData.append('member2', memberComponents.member2.trim());
    if (memberComponents.member3.trim()) formData.append('member3', memberComponents.member3.trim());
    if (memberComponents.member4.trim()) formData.append('member4', memberComponents.member4.trim());

    try {
      const res = await fetch('/api/analyze-proposal', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze proposal and discover references.');
      }

      if (onProposalAnalyzed) {
        onProposalAnalyzed(data.result, data.retrievedPapers || []);
      }
    } catch (err: any) {
      setError(err.message || 'Error discovering literature references and synthesizing research gaps.');
    } finally {
      setIsProcessing(false);
      setStatusText('');
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    setError(null);
    setIsProcessing(true);
    setStatusText('Analyzing paper text and extracting limitations...');

    const formData = new FormData();
    formData.append('text', manualText);
    if (manualTitle.trim()) {
      formData.append('title', manualTitle.trim());
    }
    if (manualUrl.trim()) {
      formData.append('url', manualUrl.trim());
    }

    try {
      const res = await fetch('/api/parse-paper', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse text.');
      }

      onPaperAdded(data.paper);
      setManualTitle('');
      setManualUrl('');
      setManualText('');
    } catch (err: any) {
      setError(err.message || 'Error parsing manuscript text.');
    } finally {
      setIsProcessing(false);
      setStatusText('');
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 md:p-7 shadow-xs">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Input Research Proposal or Literature</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter your proposal headline or upload a PDF to automatically retrieve academic references and synthesize gaps.
          </p>
        </div>

        {/* 1-Click Sample Button */}
        <button
          onClick={onLoadSamples}
          disabled={isProcessing}
          type="button"
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#f4f7f6] hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer whitespace-nowrap shadow-xs"
        >
          <BookOpen className="h-3.5 w-3.5 text-emerald-700" />
          <span>Load 3 Sample Papers</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mt-4 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'text'
              ? 'bg-[#0d3326] text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Proposal Topic / Abstract</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'upload'
              ? 'bg-[#0d3326] text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          <span>PDF Upload (Proposal or Papers)</span>
        </button>
      </div>

      {/* Error notification */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 text-xs text-red-700 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-500 font-semibold">Upload Mode:</span>
            <button
              type="button"
              onClick={() => setUploadMode('proposal')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
                uploadMode === 'proposal'
                  ? 'bg-[#0d3326] text-white font-bold shadow-xs'
                  : 'bg-[#f4f7f6] text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              📝 Proposal PDF (Auto-Find References & Gaps)
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('literature')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
                uploadMode === 'literature'
                  ? 'bg-[#0d3326] text-white font-bold shadow-xs'
                  : 'bg-[#f4f7f6] text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              📄 Literature Papers PDF (Manual Synthesis)
            </button>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                : 'border-slate-200 hover:border-slate-300 bg-[#f8faf9]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              multiple={uploadMode === 'literature'}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mx-auto h-12 w-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-emerald-800 mb-3 group-hover:scale-110 transition">
              {isProcessing ? (
                <Loader2 className="h-6 w-6 text-emerald-700 animate-spin" />
              ) : (
                <Upload className="h-6 w-6 text-emerald-700" />
              )}
            </div>

            <h3 className="font-bold text-sm text-slate-800 mb-1">
              {isProcessing
                ? statusText
                : uploadMode === 'proposal'
                ? 'Drop your Research Proposal PDF here to Auto-Discover References & Gaps'
                : 'Drop research papers (PDF) here or click to browse'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {uploadMode === 'proposal'
                ? 'ResGap will extract your research domain, query IEEE & ACM literature for peer references, and pinpoint research gaps.'
                : 'Supports batch PDF upload of published peer papers for cross-paper literature synthesis.'}
            </p>
          </div>
        </div>
      ) : (
        /* Text Entry Tab */
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Research Title or Proposal Headline (e.g. FlakeLens: Trace-Aware Framework for Flaky Web Test Triage)"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8faf9] border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition font-medium"
            />
            <input
              type="text"
              placeholder="Optional Link / DOI (e.g. https://ieeexplore.ieee.org/... or arXiv / DOI)"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8faf9] border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition font-mono text-xs"
            />
          </div>
          <div>
            <textarea
              rows={4}
              placeholder="Paste proposal abstract, problem statement, or description (or leave brief summary of what you are proposing)..."
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8faf9] border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono transition"
            />
          </div>

          {/* 4-Member Research Group Configuration Accordion */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => setShowGroupInputs(!showGroupInputs)}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-[#0d3326] hover:text-emerald-800 transition cursor-pointer select-none"
            >
              <Users className="h-4 w-4 text-emerald-700" />
              <span>👥 4-Member Research Group Mode (Click to customize individual member component focuses)</span>
              <ChevronDown className={`h-3 w-3 transform transition-transform ${showGroupInputs ? 'rotate-180' : ''}`} />
            </button>

            {showGroupInputs && (
              <div className="mt-3 p-4 rounded-xl bg-[#f8faf9] border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Member 1 Component Focus
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Trace Ingestion & Telemetry Profiler"
                    value={memberComponents.member1}
                    onChange={(e) => setMemberComponents({ ...memberComponents, member1: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Member 2 Component Focus
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AI-Assisted Failure Triage & Classification"
                    value={memberComponents.member2}
                    onChange={(e) => setMemberComponents({ ...memberComponents, member2: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Member 3 Component Focus
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fault Localization & DOM Slicing"
                    value={memberComponents.member3}
                    onChange={(e) => setMemberComponents({ ...memberComponents, member3: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Member 4 Component Focus
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Verified Automated Patch Repair"
                    value={memberComponents.member4}
                    onChange={(e) => setMemberComponents({ ...memberComponents, member4: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Literature Depth Selection */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#f8faf9] border border-slate-200">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-emerald-700" />
              <span className="text-xs font-semibold text-slate-700">Literature Depth (Papers to Analyze):</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPaperCountLimit(num)}
                  className={`px-2.5 py-1 rounded transition cursor-pointer ${
                    paperCountLimit === num
                      ? 'bg-[#0d3326] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {num} Papers {num === 10 ? '★' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Primary Action: Auto-Find References & Gaps */}
            <button
              type="button"
              onClick={handleAnalyzeProposal}
              disabled={isProcessing || (!manualTitle.trim() && !manualText.trim())}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#0d3326] hover:bg-[#124233] disabled:opacity-40 transition-all shadow-md shadow-emerald-950/20 cursor-pointer flex items-center space-x-2"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
              ) : (
                <Sparkles className="h-4 w-4 text-emerald-400" />
              )}
              <span>Auto-Find References & Generate 4-Member Research Gaps</span>
            </button>

            {/* Secondary Action: Add as individual manual paper */}
            <button
              type="button"
              onClick={handleManualSubmit}
              disabled={isProcessing || !manualText.trim()}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 bg-[#f4f7f6] hover:bg-slate-100 border border-slate-200 disabled:opacity-40 transition cursor-pointer flex items-center space-x-1.5"
            >
              <Plus className="h-3.5 w-3.5 text-slate-500" />
              <span>Add as Single Paper to Matrix</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
