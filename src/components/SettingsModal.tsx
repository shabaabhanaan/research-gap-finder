'use client';

import React from 'react';
import { X, Key, Cpu, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  engine: 'local' | 'gemini' | 'openai';
  setEngine: (engine: 'local' | 'gemini' | 'openai') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  engine,
  setEngine
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0d3326]">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Synthesis Engine Settings</h3>
              <p className="text-xs text-slate-500">Choose inference reasoning mode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Engine Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Inference Mode
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setEngine('local')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  engine === 'local'
                    ? 'border-emerald-700 bg-emerald-50/60 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-sm text-[#0d3326]">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Built-in NLP</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">100% Free & Offline. No API Key required.</p>
              </button>

              <button
                type="button"
                onClick={() => setEngine('gemini')}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  engine === 'gemini'
                    ? 'border-emerald-700 bg-emerald-50/60 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-sm text-[#0d3326]">
                  <Key className="h-4 w-4 text-emerald-600" />
                  <span>Gemini API</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Deep LLM reasoning across complex papers.</p>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {engine === 'gemini' && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8faf9] border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
              />
              <p className="text-[11px] text-slate-500">
                Key is stored only in your browser session and used solely to analyze the uploaded text.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#0d3326] hover:bg-[#124232] text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
