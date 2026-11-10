import React, { useState } from 'react';
import { SCENARIOS } from './data/scenarios';
import { DocumentAnalysis, AccessibilitySettings } from './types';
import { analyzePastedDocument } from './utils/analyzer';
import { Navbar } from './components/Navbar';
import { AccessibilityBar } from './components/AccessibilityBar';
import { PasteHero } from './components/PasteHero';
import { AnalysisView } from './components/AnalysisView';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [currentDocument, setCurrentDocument] = useState<DocumentAnalysis>(SCENARIOS[0]);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    dyslexicFont: false,
    bionicReading: false,
    highContrast: false,
    fontSize: 'md',
    speechRate: 1.0,
    language: 'en'
  });

  const handleAnalyze = (text: string) => {
    // Check if pasted text matches one of our known scenarios
    const matchedScenario = SCENARIOS.find(s => 
      s.rawText.trim() === text.trim() || 
      text.includes(s.title) || 
      (s.rawText.length > 50 && text.includes(s.rawText.slice(0, 50)))
    );

    if (matchedScenario) {
      setCurrentDocument(matchedScenario);
    } else {
      const generated = analyzePastedDocument(text);
      setCurrentDocument(generated);
    }

    // Scroll to analysis view
    setTimeout(() => {
      const el = document.getElementById('analysis-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSelectScenario = (scenario: DocumentAnalysis) => {
    setCurrentDocument(scenario);
    setTimeout(() => {
      const el = document.getElementById('analysis-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleUpdateSpeechRate = (rate: number) => {
    setSettings(prev => ({ ...prev, speechRate: rate }));
  };

  // Determine root class modifiers for accessibility settings
  const fontSizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }[settings.fontSize];

  return (
    <div className={`min-h-screen flex flex-col bg-slate-950 text-slate-100 ${
      settings.dyslexicFont ? 'dyslexia-font' : ''
    } ${settings.highContrast ? 'high-contrast' : ''} ${fontSizeClass}`}>
      {/* Top Navigation */}
      <Navbar />

      {/* Assistive Accessibility Controls Bar */}
      <AccessibilityBar 
        settings={settings} 
        onChange={setSettings} 
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Document Paste / Input Section */}
        <PasteHero 
          onAnalyze={handleAnalyze} 
          onSelectScenario={handleSelectScenario}
          currentDocumentId={currentDocument.id}
        />

        {/* Real-time Analysis & Equalizer View */}
        <div id="analysis-section" className="scroll-mt-20">
          <AnalysisView 
            document={currentDocument} 
            settings={settings}
            onUpdateSpeechRate={handleUpdateSpeechRate}
          />
        </div>
      </main>

      {/* Accessible Footer */}
      <Footer />
    </div>
  );
};

export default App;
