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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-blue-400" />
            <h3 className="font-semibold text-lg text-white">Synthesis Engine Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Engine Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Inference Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEngine('local')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  engine === 'local'
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-medium text-sm text-slate-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Built-in NLP</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">100% Free & Offline. No API Key required.</p>
              </button>

              <button
                type="button"
                onClick={() => setEngine('gemini')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  engine === 'gemini'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-medium text-sm text-slate-200">
                  <Key className="h-4 w-4 text-indigo-400" />
                  <span>Gemini API</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Deep LLM reasoning across complex papers.</p>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          {engine === 'gemini' && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              <p className="text-[11px] text-slate-500">
                Key is stored only in your browser session and used solely to analyze the uploaded text.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition cursor-pointer shadow-md shadow-blue-600/20"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
