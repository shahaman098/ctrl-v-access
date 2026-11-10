import React, { useState, useEffect, useRef } from 'react';
import { 
  Clipboard, 
  Sparkles, 
  ArrowRight, 
  Search, 
  FileText, 
  Scale, 
  X, 
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { SEARCH_DATABASE, SearchResultItem } from '../data/searchDatabase';
import { DocumentAnalysis } from '../types';

interface PasteHeroProps {
  onAnalyze: (text: string) => void;
  onSelectScenario: (scenario: DocumentAnalysis) => void;
  currentDocumentId?: string;
  isAnalyzing?: boolean;
  activeModel?: string;
  backendOnline?: boolean;
}

export const PasteHero: React.FC<PasteHeroProps> = ({ 
  onAnalyze, 
  onSelectScenario,
  currentDocumentId,
  isAnalyzing = false,
  activeModel = 'gemini-3.8-flash',
  backendOnline = true
}) => {
  const [activeMode, setActiveMode] = useState<'paste' | 'search'>('paste');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global window paste listener: triggers analysis when user hits Ctrl+V anywhere
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Don't intercept if user is typing inside an input other than our textarea
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'INPUT' && target.id !== 'document-paste-area') return;

      const pastedData = e.clipboardData?.getData('text');
      if (pastedData && pastedData.trim().length > 30) {
        setInputText(pastedData);
        onAnalyze(pastedData);
        setActiveMode('paste');
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
        setActiveMode('paste');
        setPasteNotice('Pasted from clipboard! Equalizing...');
        setTimeout(() => setPasteNotice(null), 3000);
      } else {
        setPasteNotice('Clipboard is empty or does not contain text.');
        setTimeout(() => setPasteNotice(null), 3000);
      }
    } catch {
      // If browser clipboard permission blocked, focus the textarea
      setActiveMode('paste');
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

  // Filter search results
  const filteredSearchResults = SEARCH_DATABASE.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.statutoryAuthority.toLowerCase().includes(q) ||
      item.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredSearchResults.length > 0) {
      onSelectScenario(filteredSearchResults[0].documentAnalysis);
    } else if (searchQuery.trim().length > 0) {
      // Generate custom analysis from search query
      onAnalyze(`INQUIRY REGARDING STATUTORY CITIZEN RIGHTS & ENTITLEMENTS: ${searchQuery}\n\nUser is requesting assistance understanding official criteria, reasonable adjustments, appeal rights, and statutory deadlines regarding: ${searchQuery}.`);
    }
  };

  return (
    <section 
      aria-label="Document Paste and Equalizer Input"
      className="max-w-6xl mx-auto px-4 py-8"
    >
      {/* Hero: NHS.UK-style blue panel */}
      <div className="bg-nhs-blue text-white px-6 py-8 sm:px-10 sm:py-9 mb-8">
        <p className="text-lg font-semibold text-white/90 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span>Ctrl+V Hackathon 2026 · Accessibility and civic rights</span>
        </p>
        <h1 className="text-3xl sm:text-[42px] font-bold text-white leading-tight mb-4 max-w-4xl">
          The instant information bridge for inaccessible bureaucracy
        </h1>
        <p className="text-white text-lg leading-relaxed max-w-4xl">
          Press <kbd className="px-2 py-0.5 rounded bg-white text-nhs-blue font-mono text-base font-bold">Ctrl+V</kbd> with any medical letter, disability decision, university refusal or housing notice. You get <strong>plain English</strong>, <strong>your rights</strong>, <strong>audio narration</strong> and a <strong>ready-to-send appeal</strong>.
        </p>
      </div>

      {/* Main Container with Mode Switcher */}
      <div 
        className="relative bg-white border border-nhs-grey4 p-6 group"
      >
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-nhs-grey4">
          <div className="flex items-center gap-2 bg-nhs-grey5 p-1 rounded border border-nhs-grey4">
            <button
              type="button"
              onClick={() => setActiveMode('paste')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
 activeMode === 'paste'
 ? 'bg-nhs-blue text-white '
 : 'text-nhs-blue hover:bg-white hover:underline'
 }`}
              aria-pressed={activeMode === 'paste'}
            >
              <Clipboard className="w-4 h-4" aria-hidden="true" />
              <span>Paste Document (Ctrl+V)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('search');
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
 activeMode === 'search'
 ? 'bg-nhs-blue text-white '
 : 'text-nhs-blue hover:bg-white hover:underline'
 }`}
              aria-pressed={activeMode === 'search'}
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>Search Rights & Guidance</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualPasteClick}
              className="flex items-center gap-2 px-4 py-2 bg-nhs-bluetint hover:bg-nhs-bluetint text-nhs-blue border border-nhs-blue rounded text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-nhs-yellow"
              aria-label="Paste text from computer clipboard"
            >
              <Clipboard className="w-3.5 h-3.5 text-nhs-blue" aria-hidden="true" />
              <span>Paste from Clipboard</span>
            </button>
          </div>
        </div>

        {/* Live Notification Bubble */}
        {pasteNotice && (
          <div 
            role="status" 
            aria-live="polite"
            className="mb-4 p-3 bg-nhs-bluetint border border-nhs-blue rounded text-nhs-blue text-xs flex items-center gap-2 animate-fadeIn"
          >
            <Sparkles className="w-4 h-4 text-nhs-blue shrink-0" aria-hidden="true" />
            <span>{pasteNotice}</span>
          </div>
        )}

        {/* MODE 1: PASTE VIEW */}
        {activeMode === 'paste' && (
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
              className="w-full bg-white border-2 border-nhs-secondary p-4 text-nhs-text text-base placeholder:text-nhs-secondary text-sm focus:outline-none focus:border-nhs-blue focus:ring-1 focus:ring-nhs-yellow font-mono transition-colors resize-y leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-nhs-secondary">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-nhs-grey5 border border-nhs-grey4 rounded text-nhs-text font-mono text-xs">
                    Ctrl + V
                  </kbd>
                  <span className="hidden sm:inline">Instant Equalizer Trigger</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-nhs-grey4 text-xs text-nhs-blue">
                  <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-nhs-green animate-pulse' : 'bg-nhs-warmyellow'}`}></span>
                  <span>{backendOnline ? 'AI Backend Online' : 'Client Mode'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {inputText.trim().length > 0 && !isAnalyzing && (
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="px-3 py-1.5 text-xs text-nhs-secondary hover:text-nhs-blue transition-colors"
                  >
                    Clear Box
                  </button>
                )}
                <button
                  type="submit"
                  disabled={inputText.trim().length === 0 || isAnalyzing}
                  className="flex items-center gap-2 nhs-button px-5 py-2.5 bg-nhs-green hover:bg-nhs-hovergreen disabled:opacity-40 disabled:hover:bg-nhs-grey3 text-white rounded text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-nhs-yellow"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Equalizing via AI Backend...</span>
                    </>
                  ) : (
                    <>
                      <span>Decode & Equalize</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* MODE 2: SEARCH RIGHTS & GUIDANCE VIEW */}
        {activeMode === 'search' && (
          <div className="space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <label htmlFor="rights-search-input" className="sr-only">
                Search statutory citizen rights, regulations, and entitlements
              </label>
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-nhs-blue absolute left-4 pointer-events-none" aria-hidden="true" />
                <input
                  id="rights-search-input"
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search condition or statute (e.g., 'glucose monitor', 'PIP 0 points', 'warm home', 'free prescription')..."
                  className="w-full bg-nhs-grey5 border border-nhs-blue rounded py-3.5 pl-12 pr-28 text-nhs-text placeholder:text-nhs-secondary text-sm focus:outline-none focus:border-nhs-blue focus:ring-1 focus:ring-nhs-yellow transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-24 p-1 text-nhs-secondary hover:text-nhs-blue transition-colors"
                    aria-label="Clear search query"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 px-3.5 py-1.5 bg-nhs-blue hover:bg-nhs-darkblue text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Keyword Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-semibold text-nhs-secondary mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-nhs-blue" aria-hidden="true" />
                Quick filter:
              </span>
              {[
                { label: 'All', value: 'all' },
                { label: 'Healthcare', value: 'healthcare' },
                { label: 'Disability', value: 'disability' },
                { label: 'Education', value: 'education' },
                { label: 'Housing', value: 'housing' },
                { label: 'Employment', value: 'employment' }
              ].map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
 selectedCategory === cat.value
 ? 'bg-nhs-blue text-white'
 : 'bg-nhs-grey5 text-nhs-text hover:bg-nhs-grey4'
 }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Live Search Results List */}
            <div 
              role="region" 
              aria-label="Search results" 
              className="mt-4 space-y-2.5 max-h-[360px] overflow-y-auto pr-1"
            >
              <div 
                role="status" 
                aria-live="polite" 
                className="text-xs text-nhs-secondary pb-1"
              >
                Showing {filteredSearchResults.length} statutory guidance & rights cases:
              </div>

              {filteredSearchResults.length > 0 ? (
                filteredSearchResults.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectScenario(item.documentAnalysis)}
                    className="p-3.5 bg-nhs-grey5 border border-nhs-grey4 hover:border-nhs-blue rounded transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-nhs-grey5 text-nhs-blue">
                          {item.category}
                        </span>
                        <span className="text-xs font-mono text-nhs-green">
                          {item.statutoryAuthority}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-semibold text-nhs-text group-hover:text-nhs-blue transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-nhs-secondary leading-relaxed line-clamp-2">
                        {item.summary}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectScenario(item.documentAnalysis);
                      }}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-nhs-bluetint group-hover:bg-nhs-blue text-nhs-blue group-hover:text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      <span>Equalize & Load</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center bg-nhs-grey5 border border-nhs-grey4 rounded">
                  <p className="text-xs text-nhs-secondary mb-3">
                    No exact statutory match found for "{searchQuery}".
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSearchSubmit({ preventDefault: () => {} } as any)}
                    className="px-4 py-2 bg-nhs-blue hover:bg-nhs-darkblue text-white rounded text-xs font-semibold transition-colors"
                  >
                    Analyze "{searchQuery}" as Custom Citizen Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pre-loaded Benchmark Scenarios for Instant 1-Click Evaluation */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-nhs-secondary">
            Or test with real-world accessibility benchmark cases:
          </span>
          <span className="text-xs text-nhs-blue">
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
                className={`text-left p-3.5 rounded border transition-all flex flex-col justify-between group ${
 isSelected 
 ? 'bg-nhs-bluetint border-nhs-blue ring-2 ring-nhs-blue ' 
 : 'bg-white border-nhs-grey4 hover:border-nhs-blue hover:bg-nhs-grey4'
 }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-nhs-grey5 text-nhs-text">
                      {scenario.category}
                    </span>
                    <span className="text-xs font-semibold text-nhs-red bg-nhs-redtint px-1.5 py-0.5 rounded border border-nhs-red">
                      {scenario.urgencyLevel}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-nhs-text group-hover:text-nhs-blue line-clamp-2 mb-1">
                    {scenario.title}
                  </h3>
                  <p className="text-xs text-nhs-secondary line-clamp-2">
                    {scenario.keyInstitution}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-nhs-grey4 flex items-center justify-between text-xs text-nhs-secondary">
                  <span>Grade {scenario.readingGradeOriginal} → {scenario.readingGradeSimplified}</span>
                  <span className="text-nhs-blue font-medium group-hover:translate-x-0.5 transition-transform">
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
