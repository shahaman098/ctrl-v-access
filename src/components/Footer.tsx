import React from 'react';
import { Heart, ShieldCheck, Accessibility, Keyboard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-200 font-semibold">
            <Accessibility className="w-4 h-4 text-indigo-400" aria-hidden="true" />
            <span>Ctrl+V Access — Universal Civic & Assistive Technology</span>
          </div>
          <p className="max-w-md text-slate-400">
            Dedicated to eliminating the administrative burden that bars disabled, elderly, neurodivergent, and vulnerable citizens from healthcare, housing, and education.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>WCAG AAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-sky-400" aria-hidden="true" />
            <span>Full Keyboard & Screen Reader Ready</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Built for</span>
            <strong className="text-white">Ctrl+V Hackathon</strong>
            <span>by ADHAYAN</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
