import React, { useState } from 'react';
import { Clipboard, Shield, ExternalLink, Github, Zap, Server, Settings, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface NavbarProps {
  backendStatus: {
    online: boolean;
    service?: string;
    version?: string;
    model?: string;
    geminiConfigured?: boolean;
  };
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  backendStatus,
  apiKey,
  onApiKeyChange,
  selectedModel,
  onModelChange
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const duration = Math.round(performance.now() - start);
      if (res.ok) {
        const data = await res.json();
        setTestResult(`✓ Connected to ${data.service} (${duration}ms latency). Model: ${data.model}`);
      } else {
        setTestResult(`Error: Server responded with status ${res.status}`);
      }
    } catch (err: any) {
      setTestResult(`Failed to reach backend API: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Clipboard className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Ctrl+V <span className="text-indigo-400">Access</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                  v1.0 Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Universal AI Equalizer for Bureaucracy, Healthcare & Civil Rights
              </p>
            </div>
          </div>

          {/* Global Controls & Backend Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Backend Indicator Button */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Click to view AI engine & backend configuration"
              aria-label="View AI engine and backend configuration"
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  backendStatus.online ? 'bg-emerald-400' : 'bg-amber-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  backendStatus.online ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></span>
              </span>
              <span className="font-mono text-[11px] font-medium hidden md:inline">
                {backendStatus.online ? 'Backend: Connected' : 'Engine: Client Offline'}
              </span>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Global Keyboard Shortcut Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-400">Shortcut:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-indigo-300">
                Ctrl+V
              </kbd>
              <span className="text-slate-400">or</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-indigo-300">
                ⌘+V
              </kbd>
            </div>

            <a
              href="https://github.com/shahaman098/ctrl-v-access"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
              aria-label="View source code on GitHub"
            >
              <Github className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">GitHub</span>
            </a>

            <a
              href="https://ctrl-v-hackathon-31831.devpost.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-semibold transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
              <span>Ctrl+V Hackathon</span>
            </a>
          </div>
        </div>
      </header>

      {/* Backend & AI Engine Configuration Modal */}
      {showConfigModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close configuration modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 id="modal-title" className="text-lg font-bold text-white">AI Engine & Backend Architecture</h3>
                <p className="text-xs text-slate-400">Ctrl+V Access Full-Stack Connectivity</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Server Status Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Backend Server Status:</span>
                  <span className={`font-semibold flex items-center gap-1.5 ${
                    backendStatus.online ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {backendStatus.online ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Online (Port 3001)
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        Client-Side Fallback Active
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Active AI Model:</span>
                  <span className="font-mono text-indigo-300 text-[11px]">
                    {backendStatus.model || 'rule-based-nlp-v2'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Sponsor Platform:</span>
                  <span className="text-slate-300 font-medium text-[11px]">
                    Adaption Platform (AutoScientist / Adaptive Data)
                  </span>
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  AI Model Engine
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => onModelChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Frontier Multimodal)</option>
                  <option value="gemini-3.5-flash-lite">Google Gemini 3.5 Flash-Lite (High Speed)</option>
                  <option value="rule-based-nlp-v2">Hybrid Rule-Based Legal & Medical NLP (Offline)</option>
                </select>
              </div>

              {/* Custom Gemini API Key Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Google Gemini API Key (Optional)
                  </label>
                  <span className="text-[11px] text-slate-500">Stored locally in browser</span>
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  placeholder="AIzaSy... (leave blank to use hybrid local engine)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Works seamlessly without a key using our built-in Flesch-Kincaid & statutory legal parser.
                </p>
              </div>

              {/* Diagnostic Test Button */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/20"
                >
                  {testing ? 'Testing...' : 'Test Backend Connection'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Done
                </button>
              </div>

              {testResult && (
                <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/60 text-indigo-300 text-xs">
                  {testResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
