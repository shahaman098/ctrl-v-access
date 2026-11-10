import React from 'react';
import { AccessibilitySettings } from '../types';
import { Sparkles, Eye, Type, Contrast, Globe, Zap } from 'lucide-react';

interface AccessibilityBarProps {
  settings: AccessibilitySettings;
  onChange: (settings: AccessibilitySettings) => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English (Original)' },
  { code: 'es', label: 'Español (Spanish)' },
  { code: 'fr', label: 'Français (French)' },
  { code: 'ar', label: 'العربية (Arabic)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'uk', label: 'Українська (Ukrainian)' },
  { code: 'ur', label: 'اردو (Urdu)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'zh', label: '中文 (Chinese)' },
  { code: 'pt', label: 'Português (Portuguese)' },
];

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({ settings, onChange }) => {
  const toggleBionic = () => {
    onChange({ ...settings, bionicReading: !settings.bionicReading });
  };

  const toggleDyslexic = () => {
    onChange({ ...settings, dyslexicFont: !settings.dyslexicFont });
  };

  const toggleContrast = () => {
    onChange({ ...settings, highContrast: !settings.highContrast });
  };

  const cycleFontSize = () => {
    const sizes: AccessibilitySettings['fontSize'][] = ['sm', 'md', 'lg', 'xl'];
    const curIdx = sizes.indexOf(settings.fontSize);
    const nextSize = sizes[(curIdx + 1) % sizes.length];
    onChange({ ...settings, fontSize: nextSize });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...settings, language: e.target.value });
  };

  return (
    <div 
      role="region" 
      aria-label="Assistive Reading & Accessibility Controls"
      className="sticky top-16 z-40 bg-white border-b border-nhs-grey4 px-4 py-2 text-sm text-nhs-text"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-nhs-blue font-semibold tracking-wide">
          <Eye className="w-4 h-4" aria-hidden="true" />
          <span>Cognitive & Visual Equalizer:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Bionic Reading Toggle */}
          <button
            type="button"
            onClick={toggleBionic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
 settings.bionicReading 
 ? 'bg-nhs-bluetint border-nhs-blue text-nhs-blue ring-1 ring-nhs-blue' 
 : 'bg-nhs-grey5 border-nhs-grey4 hover:border-nhs-grey3 text-nhs-text'
 }`}
            aria-pressed={settings.bionicReading}
            title="Bolds the initial letters of each word to guide the eye (for ADHD and fast reading)"
          >
            <Zap className={`w-3.5 h-3.5 ${settings.bionicReading ? 'text-nhs-blue' : 'text-nhs-secondary'}`} aria-hidden="true" />
            <span>Bionic Focus {settings.bionicReading ? 'ON' : 'OFF'}</span>
          </button>

          {/* Dyslexia Font Toggle */}
          <button
            type="button"
            onClick={toggleDyslexic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
 settings.dyslexicFont 
 ? 'bg-nhs-yellowtint border-nhs-warmyellow text-nhs-ambertext ring-1 ring-nhs-yellow' 
 : 'bg-nhs-grey5 border-nhs-grey4 hover:border-nhs-grey3 text-nhs-text'
 }`}
            aria-pressed={settings.dyslexicFont}
            title="Toggles Lexend dyslexia-friendly typeface with enhanced letter spacing"
          >
            <Type className={`w-3.5 h-3.5 ${settings.dyslexicFont ? 'text-nhs-ambertext' : 'text-nhs-secondary'}`} aria-hidden="true" />
            <span>Dyslexia Font {settings.dyslexicFont ? 'ON' : 'OFF'}</span>
          </button>

          {/* High Contrast Mode Toggle */}
          <button
            type="button"
            onClick={toggleContrast}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
 settings.highContrast 
 ? 'bg-nhs-yellowtint border-nhs-warmyellow text-nhs-ambertext ring-1 ring-nhs-yellow' 
 : 'bg-nhs-grey5 border-nhs-grey4 hover:border-nhs-grey3 text-nhs-text'
 }`}
            aria-pressed={settings.highContrast}
            title="WCAG AAA High Contrast mode (yellow on pure black)"
          >
            <Contrast className={`w-3.5 h-3.5 ${settings.highContrast ? 'text-nhs-ambertext' : 'text-nhs-secondary'}`} aria-hidden="true" />
            <span>Contrast {settings.highContrast ? 'AAA' : 'Standard'}</span>
          </button>

          {/* Font Size Adjuster */}
          <button
            type="button"
            onClick={cycleFontSize}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-nhs-grey5 border-nhs-grey4 hover:border-nhs-grey3 text-nhs-text font-medium transition-colors"
            title="Cycle text sizes (Small, Medium, Large, XL)"
            aria-label={`Current font size: ${settings.fontSize.toUpperCase()}. Click to enlarge.`}
          >
            <span className="font-mono text-xs uppercase tracking-wider">Size: {settings.fontSize}</span>
          </button>

          {/* Multilingual Adaptation */}
          <div className="flex items-center gap-1 bg-nhs-grey5 border border-nhs-grey4 rounded-lg px-2 py-1">
            <Globe className="w-3.5 h-3.5 text-nhs-blue" aria-hidden="true" />
            <select
              value={settings.language}
              onChange={handleLanguageChange}
              aria-label="Select target language for translation and plain language equalizing"
              className="bg-transparent text-xs text-nhs-text border-none focus:outline-none cursor-pointer pr-1"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-white text-nhs-text">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
