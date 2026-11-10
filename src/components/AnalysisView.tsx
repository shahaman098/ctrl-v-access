import React, { useState } from 'react';
import { 
  DocumentAnalysis, 
  AccessibilitySettings, 
  ChecklistItem 
} from '../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  BookOpen, 
  Scale, 
  ListTodo, 
  Mail, 
  HelpCircle, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  Download,
  Share2
} from 'lucide-react';
import { formatBionic } from '../utils/bionic';
import { CopyButton } from './CopyButton';
import { AudioPlayer } from './AudioPlayer';

interface AnalysisViewProps {
  document: DocumentAnalysis;
  settings: AccessibilitySettings;
  onUpdateSpeechRate: (rate: number) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ 
  document, 
  settings,
  onUpdateSpeechRate
}) => {
  const [activeTab, setActiveTab] = useState<'clarity' | 'rights' | 'checklist' | 'appeal' | 'form' | 'raw'>('clarity');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(document.level3Checklist);

  // Update checklist item completion
  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedCount = checklist.filter(c => c.completed).length;
  const progressPercent = Math.round((completedCount / Math.max(1, checklist.length)) * 100);

  // Text for the Audio Player (summarizes the bottom line and action)
  const narrationSummary = `Equalized summary for ${document.title}. Bottom line: ${document.level1Summary.bottomLine}. The decision was issued by ${document.keyInstitution}. You have ${document.daysRemaining || 21} days remaining to respond. Key points: ${document.level1Summary.bulletPoints.join('. ')}`;

  const downloadAppealLetter = () => {
    const content = `SUBJECT: ${document.level4AppealDraft.subject}
RECIPIENT: ${document.level4AppealDraft.recipient}
LEGAL BASIS: ${document.level4AppealDraft.legalBasis}

${document.level4AppealDraft.letterBody}`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `appeal-letter-${document.category}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadChecklist = () => {
    const content = `ACTION CHECKLIST FOR: ${document.title}
Issued by: ${document.keyInstitution}
Deadline: ${document.deadline}

${checklist.map((c, i) => `[${c.completed ? 'X' : ' '}] ${i + 1}. ${c.task}\n    Description: ${c.description}\n    Priority: ${c.urgency.toUpperCase()}${c.requiredDoc ? `\n    Required Doc: ${c.requiredDoc}` : ''}`).join('\n\n')}`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `action-checklist-${document.category}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <article 
      aria-label="Equalized Document Analysis and Action Plan"
      className="max-w-6xl mx-auto px-4 pb-16"
    >
      {/* Overview Card with Readability Metrics & Audio Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                {document.category}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                document.urgencyLevel === 'critical' 
                  ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                <span>Urgency: {document.urgencyLevel.toUpperCase()}</span>
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {document.title}
            </h2>
            <p className="text-xs text-slate-400">
              Issuing Authority: <strong className="text-slate-200">{document.keyInstitution}</strong>
            </p>
          </div>

          {/* Audio Player embedded right in header */}
          <div className="shrink-0">
            <AudioPlayer 
              textToSpeak={narrationSummary}
              speechRate={settings.speechRate}
              onRateChange={onUpdateSpeechRate}
              lang={settings.language === 'es' ? 'es-ES' : settings.language === 'fr' ? 'fr-FR' : 'en-US'}
            />
          </div>
        </div>

        {/* Readability & Equalizer Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Original Reading Level
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-rose-400">
                Grade {document.readingGradeOriginal}
              </span>
              <span className="text-[10px] text-slate-500">College / Legal</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-indigo-900/50 rounded-xl p-3.5 ring-1 ring-indigo-500/20">
            <span className="text-[11px] font-medium text-indigo-300 uppercase tracking-wider block mb-1">
              Ctrl+V Equalized Level
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-emerald-400">
                Grade {document.readingGradeSimplified}
              </span>
              <span className="text-[10px] text-emerald-500 font-semibold">Universal Access</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Jargon Stripped
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-sky-400">
                {document.jargonTermsCount} terms
              </span>
              <span className="text-[10px] text-slate-500">demystified</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Statutory Deadline
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-amber-400">
                {document.daysRemaining ? `${document.daysRemaining}d` : 'Active'}
              </span>
              <span className="text-[10px] text-slate-400 truncate">{document.deadline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabbed Interface */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        {/* Navigation Tabs */}
        <div 
          role="tablist" 
          aria-label="Equalizer Analysis Levels"
          className="flex flex-wrap border-b border-slate-800 bg-slate-950/60 px-2 pt-2 gap-1"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'clarity'}
            onClick={() => setActiveTab('clarity')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'clarity'
                ? 'bg-slate-900 text-indigo-300 border-indigo-500 shadow'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>1. Plain English</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'rights'}
            onClick={() => setActiveTab('rights')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'rights'
                ? 'bg-slate-900 text-indigo-300 border-indigo-500 shadow'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Scale className="w-4 h-4" aria-hidden="true" />
            <span>2. Your Legal Rights</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'checklist'}
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'checklist'
                ? 'bg-slate-900 text-indigo-300 border-indigo-500 shadow'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <ListTodo className="w-4 h-4" aria-hidden="true" />
            <span>3. Action Checklist ({completedCount}/{checklist.length})</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'appeal'}
            onClick={() => setActiveTab('appeal')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'appeal'
                ? 'bg-slate-900 text-emerald-400 border-emerald-500 shadow'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span>4. Auto-Drafted Appeal</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'form'}
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'form'
                ? 'bg-slate-900 text-indigo-300 border-indigo-500 shadow'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
            <span>5. Smart Form Bridge</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'raw'}
            onClick={() => setActiveTab('raw')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'raw'
                ? 'bg-slate-900 text-slate-300 border-slate-600 shadow'
                : 'text-slate-500 hover:text-slate-300 border-transparent'
            }`}
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>Raw Original</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="p-6">
          {/* TAB 1: PLAIN ENGLISH CLARITY */}
          {activeTab === 'clarity' && (
            <div className="space-y-6">
              {/* Bottom line callout */}
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  The 30-Second Bottom Line
                </span>
                <p className="text-sm sm:text-base text-emerald-200 font-medium leading-relaxed">
                  {document.level1Summary.bottomLine}
                </p>
              </div>

              {/* Main Plain English Breakdown */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">
                  What This Document Actually Means:
                </h3>
                <div className="text-slate-200 text-sm sm:text-base leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  {formatBionic(document.level1Summary.plainEnglish, settings.bionicReading)}
                </div>
              </div>

              {/* Key Takeaways */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-3">
                  Key Points at a Glance:
                </h3>
                <ul className="space-y-2.5">
                  {document.level1Summary.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 bg-slate-950/30 p-3 rounded-lg border border-slate-800/80">
                      <span className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span>{formatBionic(point, settings.bionicReading)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Jargon Demystifier */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-3">
                  Demystified Jargon Dictionary ({document.jargonDictionary.length} terms):
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {document.jargonDictionary.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-rose-300 line-through opacity-80">
                          {item.term}
                        </span>
                        <span className="text-xs text-slate-500">→</span>
                        <span className="text-xs font-semibold text-emerald-400">Plain Meaning</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.plainMeaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: YOUR RIGHTS & LEGAL PROTECTIONS */}
          {activeTab === 'rights' && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-950/40 border border-indigo-500/40 rounded-xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
                  Governing Statutory Authority
                </span>
                <p className="text-base text-white font-semibold">
                  {document.level2Rights.statutoryAuthority}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-3">
                  Your Statutory Rights & Protections:
                </h3>
                <div className="space-y-3">
                  {document.level2Rights.statutoryRights.map((right, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3">
                      <Scale className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="text-sm text-slate-200 leading-relaxed">
                        {formatBionic(right, settings.bionicReading)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-3">
                  Legal Citations & Regulatory Codes:
                </h3>
                <ul className="space-y-2">
                  {document.level2Rights.legalCitations.map((cite, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true"></span>
                      <span>{cite}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-3">
                  Hidden Entitlements You May Be Eligible For:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {document.level2Rights.hiddenEntitlements.map((ent, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/40 border border-emerald-900/50 rounded-xl text-xs text-slate-300 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>{ent}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACTION CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400 font-medium">Resolution Progress</span>
                  <span className="text-emerald-400 font-bold">{progressPercent}% complete ({completedCount}/{checklist.length})</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>

              {/* Action Items List */}
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      item.completed 
                        ? 'bg-emerald-950/20 border-emerald-800/60 opacity-80' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`chk-${item.id}`}
                      checked={item.completed}
                      onChange={() => toggleChecklist(item.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-1 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <label 
                          htmlFor={`chk-${item.id}`} 
                          className={`text-sm font-semibold cursor-pointer ${
                            item.completed ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {item.task}
                        </label>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          item.urgency === 'high' 
                            ? 'bg-rose-950 text-rose-300 border border-rose-900' 
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {item.urgency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">
                        {item.description}
                      </p>
                      {item.requiredDoc && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-indigo-300 text-[11px] font-mono">
                          <FileText className="w-3 h-3" aria-hidden="true" />
                          <span>Required: {item.requiredDoc}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={downloadChecklist}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download Action Checklist (.txt)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: AUTO-DRAFTED APPEAL LETTER */}
          {activeTab === 'appeal' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-emerald-950/30 border border-emerald-600/40 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Ready-to-Paste Formal Appeal & Procedural Review Letter
                  </h3>
                  <p className="text-xs text-emerald-300">
                    Drafted with statutory citations, legal precedents, and standard administrative wording.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <CopyButton 
                    textToCopy={document.level4AppealDraft.letterBody} 
                    label="Copy Appeal Letter" 
                  />
                  <button
                    type="button"
                    onClick={downloadAppealLetter}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                    title="Download Letter as TXT"
                    aria-label="Download Appeal Letter as TXT"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Subject & Recipient Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-0.5">
                    Recipient:
                  </span>
                  <span className="text-slate-200 font-mono">
                    {document.level4AppealDraft.recipient}
                  </span>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-0.5">
                    Legal Grounds:
                  </span>
                  <span className="text-emerald-400 font-mono">
                    {document.level4AppealDraft.legalBasis}
                  </span>
                </div>
              </div>

              {/* Letter Body Preview */}
              <div className="relative">
                <label htmlFor="appeal-letter-text" className="sr-only">Formal Appeal Letter</label>
                <textarea
                  id="appeal-letter-text"
                  readOnly
                  rows={14}
                  value={document.level4AppealDraft.letterBody}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between">
                <span>Tip: Replace bracketed items (e.g. <code>[Your Full Name]</code>) before submitting.</span>
                <span className="text-indigo-400 font-semibold">Ctrl+C → Ctrl+V ready</span>
              </div>
            </div>
          )}

          {/* TAB 5: SMART FORM BRIDGE */}
          {activeTab === 'form' && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl">
                <h3 className="text-sm font-bold text-white mb-1">
                  Smart Form Response Bridge (Ctrl+V Assistant)
                </h3>
                <p className="text-xs text-slate-300">
                  When government or medical portal applications ask confusing questions designed to disqualify you, paste these legally calibrated answers.
                </p>
              </div>

              <div className="space-y-4">
                {document.smartFormBridge.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        {item.field}
                      </span>
                      <CopyButton 
                        textToCopy={item.suggestedAnswer} 
                        label="Copy Answer" 
                      />
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Portal Question:</span>
                      <p className="text-xs text-slate-200 font-medium italic">"{item.question}"</p>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block mb-1">Why this question is a trap:</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.explanation}</p>
                    </div>

                    <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg">
                      <span className="text-[11px] font-semibold text-emerald-400 block mb-1">Recommended Answer to Paste (Ctrl+V):</span>
                      <p className="text-xs text-emerald-200 font-mono leading-relaxed">{item.suggestedAnswer}</p>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <strong>Tactical Advice:</strong> {item.tips}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: RAW ORIGINAL TEXT */}
          {activeTab === 'raw' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Raw input received by Ctrl+V Equalizer:
                </span>
                <CopyButton textToCopy={document.rawText} label="Copy Original" />
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-400 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[500px]">
                {document.rawText}
              </pre>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
