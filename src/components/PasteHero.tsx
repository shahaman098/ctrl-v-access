import React, { useState, useEffect, useRef } from 'react';
import { Clipboard, Sparkles, AlertCircle, ArrowRight, CornerDownLeft, FileText } from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { DocumentAnalysis } from '../types';

interface PasteHeroProps {
  onAnalyze: (text: string) => void;
  onSelectScenario: (scenario: DocumentAnalysis) => void;
  currentDocumentId?: string;
}

export const PasteHero: React.FC<PasteHeroProps> = ({ 
  onAnalyze, 
  onSelectScenario,
  currentDocumentId 
}) => {
  const [inputText, setInputText] = useState('');
  const [isHoveringPaste, setIsHoveringPaste] = useState(false);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Global window paste listener: triggers analysis when user hits Ctrl+V anywhere
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Don't intercept if user is typing inside an input other than our textarea
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'INPUT') return;

      const pastedData = e.clipboardData?.getData('text');
      if (pastedData && pastedData.trim().length > 30) {
        setInputText(pastedData);
        onAnalyze(pastedData);
        setPasteNotice('Detected Ctrl+V! Equalizing your document...');
        setTimeout(() => setPasteNotice(null), 3000);
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [onAnalyze]);

  const handleManualPasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim().length > 0) {
        setInputText(text);
        onAnalyze(text);
        setPasteNotice('Pasted from clipboard! Equalizing...');
        setTimeout(() => setPasteNotice(null), 3000);
      } else {
        setPasteNotice('Clipboard is empty or does not contain text.');
        setTimeout(() => setPasteNotice(null), 3000);
      }
    } catch {
      // If browser clipboard permission blocked, focus the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
        setPasteNotice('Please press Ctrl+V / Cmd+V directly in the box below.');
        setTimeout(() => setPasteNotice(null), 4000);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim().length > 0) {
      onAnalyze(inputText);
    }
  };

  return (
    <section 
      aria-label="Document Paste and Equalizer Input"
      className="max-w-6xl mx-auto px-4 py-8"
    >
      {/* Hero Headline & Value Proposition */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
          <span>Ctrl+V Hackathon Edition — Accessibility & Civic Equalizer</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          The Instant <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">Information Bridge</span> for Inaccessible Bureaucracy
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Hit <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300 font-mono text-sm shadow-sm">Ctrl+V</kbd> with any medical bill, disability denial, university accommodation refusal, or legal notice. Instantly receive <strong>5th-grade clarity</strong>, <strong>statutory rights</strong>, <strong>voice narration</strong>, and a <strong>ready-to-send winning appeal</strong>.
        </p>
      </div>

      {/* Main Paste Box */}
      <div 
        className="relative bg-slate-900/90 rounded-2xl border-2 border-dashed border-indigo-500/50 hover:border-indigo-400 transition-all p-6 shadow-2xl backdrop-blur-xl group"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <Clipboard className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Paste Any Inaccessible Document</h2>
              <p className="text-xs text-slate-400">
                Press <span className="text-indigo-300 font-mono">Ctrl+V</span> anywhere, or click Paste below
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualPasteClick}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all focus-visible:ring-2 focus-visible:ring-indigo-300"
              aria-label="Paste text from your computer clipboard"
            >
              <Clipboard className="w-4 h-4" aria-hidden="true" />
              <span>Paste from Clipboard</span>
            </button>
          </div>
        </div>

        {/* Live Notification Bubble */}
        {pasteNotice && (
          <div 
            role="status" 
            aria-live="polite"
            className="mb-4 p-3 bg-indigo-950/80 border border-indigo-500/50 rounded-xl text-indigo-200 text-xs flex items-center gap-2 animate-fadeIn"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
            <span>{pasteNotice}</span>
          </div>
        )}

        {/* Textarea Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <label htmlFor="document-paste-area" className="sr-only">
            Paste bureaucratic, medical, or legal text here
          </label>
          <textarea
            id="document-paste-area"
            ref={textareaRef}
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your dense denial letter, NHS decision, university notice, or benefit rejection here..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition-colors resize-y leading-relaxed"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[11px]">
                Ctrl + V
              </kbd>
              <span>Instant Universal Equalizer Trigger</span>
            </div>

            <div className="flex items-center gap-2">
              {inputText.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Clear Box
                </button>
              )}
              <button
                type="submit"
                disabled={inputText.trim().length === 0}
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span>Decode & Equalize</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Pre-loaded Benchmark Scenarios for Instant 1-Click Evaluation */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Or test with real-world accessibility benchmark cases:
          </span>
          <span className="text-[11px] text-indigo-400">
            Click any card to load & equalize instantly
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SCENARIOS.map((scenario) => {
            const isSelected = currentDocumentId === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => {
                  setInputText(scenario.rawText);
                  onSelectScenario(scenario);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between group ${
                  isSelected 
                    ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-400/40 shadow-lg' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {scenario.category}
                    </span>
                    <span className="text-[10px] font-semibold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900">
                      {scenario.urgencyLevel}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-white group-hover:text-indigo-300 line-clamp-2 mb-1">
                    {scenario.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {scenario.keyInstitution}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Grade {scenario.readingGradeOriginal} → 5.0</span>
                  <span className="text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">
                    Equalize →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
