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
      <header className="bg-nhs-blue text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-white/15 border border-white/40 flex items-center justify-center text-white">
              <Clipboard className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white">
                  Ctrl+V Access
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-nhs-blue">
                  v1.0 Live
                </span>
              </div>
              <p className="text-xs text-white/85 hidden sm:block">
                Plain-English letters, rights &amp; appeals · Independent tool, not affiliated with the NHS
              </p>
            </div>
          </div>

          {/* Global Controls & Backend Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Backend Indicator Button */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-white hover:bg-nhs-grey4 border border-nhs-grey4 hover:border-nhs-grey3 text-xs text-nhs-text transition-all focus:outline-none focus:ring-2 focus:ring-nhs-yellow"
              title="Click to view AI engine & backend configuration"
              aria-label="View AI engine and backend configuration"
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
 backendStatus.online ? 'bg-nhs-green' : 'bg-nhs-warmyellow'
 }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
 backendStatus.online ? 'bg-nhs-green' : 'bg-nhs-warmyellow'
 }`}></span>
              </span>
              <span className="font-mono text-xs font-medium hidden md:inline">
                {backendStatus.online ? 'Backend: Connected' : 'Engine: Client Offline'}
              </span>
              <Settings className="w-3.5 h-3.5 text-nhs-blue" />
            </button>

            {/* Global Keyboard Shortcut Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-nhs-grey4 text-xs text-nhs-text">
              <span className="text-nhs-secondary">Shortcut:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-nhs-grey5 border border-nhs-grey4 font-mono text-xs text-nhs-blue">
                Ctrl+V
              </kbd>
              <span className="text-nhs-secondary">or</span>
              <kbd className="px-1.5 py-0.5 rounded bg-nhs-grey5 border border-nhs-grey4 font-mono text-xs text-nhs-blue">
                ⌘+V
              </kbd>
            </div>

            <a
              href="https://github.com/shahaman098/ctrl-v-access"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-white underline underline-offset-4 hover:no-underline rounded text-sm font-medium"
              aria-label="View source code on GitHub"
            >
              <Github className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">GitHub</span>
            </a>

            <a
              href="https://ctrl-v-hackathon-31831.devpost.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-nhs-bluetint text-nhs-blue rounded text-sm font-semibold transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-nhs-blue" aria-hidden="true" />
              <span>Ctrl+V Hackathon</span>
            </a>
          </div>
        </div>
      </header>

      {/* Backend & AI Engine Configuration Modal */}
      {showConfigModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nhs-grey5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white border border-nhs-grey4 rounded w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowConfigModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-nhs-secondary hover:text-nhs-blue hover:bg-nhs-grey4 transition-colors"
              aria-label="Close configuration modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded bg-nhs-bluetint border border-nhs-blue text-nhs-blue">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 id="modal-title" className="text-lg font-bold text-nhs-text">AI Engine & Backend Architecture</h3>
                <p className="text-xs text-nhs-secondary">Ctrl+V Access Full-Stack Connectivity</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Server Status Box */}
              <div className="p-3.5 rounded bg-nhs-grey5 border border-nhs-grey4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-nhs-secondary">Backend Server Status:</span>
                  <span className={`font-semibold flex items-center gap-1.5 ${
 backendStatus.online ? 'text-nhs-green' : 'text-nhs-ambertext'
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
                  <span className="text-nhs-secondary">Active AI Model:</span>
                  <span className="font-mono text-nhs-blue text-xs">
                    {backendStatus.model || 'rule-based-nlp-v2'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-nhs-secondary">Sponsor Platform:</span>
                  <span className="text-nhs-text font-medium text-xs">
                    Adaption Platform (AutoScientist / Adaptive Data)
                  </span>
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-xs font-semibold text-nhs-text mb-1.5">
                  AI Model Engine
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => onModelChange(e.target.value)}
                  className="w-full bg-nhs-grey5 border border-nhs-grey4 rounded px-3 py-2 text-xs text-nhs-text focus:outline-none focus:ring-2 focus:ring-nhs-yellow"
                >
                  <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Frontier Multimodal)</option>
                  <option value="gemini-3.5-flash-lite">Google Gemini 3.5 Flash-Lite (High Speed)</option>
                  <option value="rule-based-nlp-v2">Hybrid Rule-Based Legal & Medical NLP (Offline)</option>
                </select>
              </div>

              {/* Custom Gemini API Key Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-nhs-text">
                    Google Gemini API Key (Optional)
                  </label>
                  <span className="text-xs text-nhs-secondary">Stored locally in browser</span>
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  placeholder="AIzaSy... (leave blank to use hybrid local engine)"
                  className="w-full bg-nhs-grey5 border border-nhs-grey4 rounded px-3 py-2 text-xs text-nhs-text font-mono placeholder:text-nhs-secondary focus:outline-none focus:ring-2 focus:ring-nhs-yellow"
                />
                <p className="text-xs text-nhs-secondary mt-1">
                  Works seamlessly without a key using our built-in Flesch-Kincaid & statutory legal parser.
                </p>
              </div>

              {/* Diagnostic Test Button */}
              <div className="pt-2 border-t border-nhs-grey4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-3.5 py-2 rounded bg-nhs-blue hover:bg-nhs-darkblue disabled:bg-nhs-grey3 text-white text-xs font-medium transition-all "
                >
                  {testing ? 'Testing...' : 'Test Backend Connection'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-3.5 py-2 rounded bg-nhs-grey5 hover:bg-nhs-grey4 text-nhs-text text-xs font-medium transition-colors"
                >
                  Done
                </button>
              </div>

              {testResult && (
                <div className="p-2.5 rounded-lg bg-nhs-bluetint border border-nhs-blue text-nhs-blue text-xs">
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
