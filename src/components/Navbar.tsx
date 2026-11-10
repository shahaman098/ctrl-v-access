import React from 'react';
import { Clipboard, Shield, ExternalLink, Github, Zap } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
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

        {/* Global Keyboard Shortcut Pill & Metadata */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
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
  );
};
