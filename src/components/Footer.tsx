import React from 'react';
import { Heart, ShieldCheck, Accessibility, Keyboard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-4 border-nhs-blue bg-nhs-grey4 py-10 px-4 text-sm text-nhs-text">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-nhs-text font-semibold">
            <Accessibility className="w-4 h-4 text-nhs-blue" aria-hidden="true" />
            <span>Ctrl+V Access — Universal Civic & Assistive Technology</span>
          </div>
          <p className="max-w-md text-nhs-text">
            Dedicated to eliminating the administrative burden that bars disabled, elderly, neurodivergent, and vulnerable citizens from healthcare, housing, and education.
          </p>
          <p className="max-w-xl text-nhs-secondary">
            Independent tool, not affiliated with or endorsed by the NHS. Visual style follows the open-source NHS.UK design system. Guidance here is general information, not legal or medical advice.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-nhs-green" aria-hidden="true" />
            <span>AAA high-contrast mode</span>
          </div>
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-nhs-blue" aria-hidden="true" />
            <span>Full Keyboard & Screen Reader Ready</span>
          </div>
          <div className="flex items-center gap-1.5 text-nhs-secondary">
            <span>Built for</span>
            <strong className="text-nhs-text">Ctrl+V Hackathon</strong>
            <span>by ADHAYAN</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
