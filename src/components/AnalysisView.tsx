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

  // Synchronize checklist when selected document changes
  React.useEffect(() => {
    setChecklist(document.level3Checklist);
  }, [document.id, document.level3Checklist]);

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
      <div className="bg-white border border-nhs-grey4 rounded p-6 mb-6 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-nhs-grey4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-nhs-bluetint text-nhs-blue border border-nhs-blue">
                {document.category}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
 document.urgencyLevel === 'critical' 
 ? 'bg-nhs-redtint text-nhs-red border border-nhs-red' 
 : 'bg-nhs-yellowtint text-nhs-ambertext border border-nhs-warmyellow'
 }`}>
                <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                <span>Urgency: {document.urgencyLevel.toUpperCase()}</span>
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-nhs-text mb-1">
              {document.title}
            </h2>
            <p className="text-xs text-nhs-secondary">
              Issuing Authority: <strong className="text-nhs-text">{document.keyInstitution}</strong>
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
          <div className="bg-nhs-grey5 border border-nhs-grey4 rounded p-3.5">
            <span className="text-xs font-medium text-nhs-secondary uppercase tracking-wider block mb-1">
              Original Reading Level
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-nhs-red">
                Grade {document.readingGradeOriginal}
              </span>
              <span className="text-xs text-nhs-secondary">College / Legal</span>
            </div>
          </div>

          <div className="bg-nhs-grey5 border border-nhs-blue rounded p-3.5 ring-1 ring-nhs-blue">
            <span className="text-xs font-medium text-nhs-blue uppercase tracking-wider block mb-1">
              Ctrl+V Equalized Level
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-nhs-green">
                Grade {document.readingGradeSimplified}
              </span>
              <span className="text-xs text-nhs-green font-semibold">Universal Access</span>
            </div>
          </div>

          <div className="bg-nhs-grey5 border border-nhs-grey4 rounded p-3.5">
            <span className="text-xs font-medium text-nhs-secondary uppercase tracking-wider block mb-1">
              Jargon Stripped
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-nhs-blue">
                {document.jargonTermsCount} terms
              </span>
              <span className="text-xs text-nhs-secondary">demystified</span>
            </div>
          </div>

          <div className="bg-nhs-grey5 border border-nhs-grey4 rounded p-3.5">
            <span className="text-xs font-medium text-nhs-secondary uppercase tracking-wider block mb-1">
              Statutory Deadline
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-nhs-ambertext">
                {document.daysRemaining ? `${document.daysRemaining}d` : 'Active'}
              </span>
              <span className="text-xs text-nhs-secondary truncate">{document.deadline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabbed Interface */}
      <div className="bg-white border border-nhs-grey4 rounded overflow-hidden backdrop-blur-md">
        {/* Navigation Tabs */}
        <div 
          role="tablist" 
          aria-label="Equalizer Analysis Levels"
          className="flex flex-wrap border-b border-nhs-grey4 bg-nhs-grey5 px-2 pt-2 gap-1"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'clarity'}
            onClick={() => setActiveTab('clarity')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-semibold transition-all border-b-2 ${
 activeTab === 'clarity'
 ? 'bg-white text-nhs-blue border-nhs-blue '
 : 'text-nhs-secondary hover:text-nhs-blue border-transparent'
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
 ? 'bg-white text-nhs-blue border-nhs-blue '
 : 'text-nhs-secondary hover:text-nhs-blue border-transparent'
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
 ? 'bg-white text-nhs-blue border-nhs-blue '
 : 'text-nhs-secondary hover:text-nhs-blue border-transparent'
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
 ? 'bg-white text-nhs-green border-nhs-green '
 : 'text-nhs-secondary hover:text-nhs-blue border-transparent'
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
 ? 'bg-white text-nhs-blue border-nhs-blue '
 : 'text-nhs-secondary hover:text-nhs-blue border-transparent'
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
 ? 'bg-white text-nhs-text border-nhs-grey3 '
 : 'text-nhs-secondary hover:text-nhs-blue border-transparent'
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
              <div className="p-4 bg-nhs-greentint border border-nhs-green rounded">
                <span className="text-xs font-bold uppercase tracking-wider text-nhs-green block mb-1">
                  The 30-Second Bottom Line
                </span>
                <p className="text-sm sm:text-base text-nhs-green font-medium leading-relaxed">
                  {document.level1Summary.bottomLine}
                </p>
              </div>

              {/* Main Plain English Breakdown */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-nhs-blue">
                  What This Document Actually Means:
                </h3>
                <div className="text-nhs-text text-sm sm:text-base leading-relaxed bg-nhs-grey5 p-4 rounded border border-nhs-grey4">
                  {formatBionic(document.level1Summary.plainEnglish, settings.bionicReading)}
                </div>
              </div>

              {/* Key Takeaways */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-nhs-blue mb-3">
                  Key Points at a Glance:
                </h3>
                <ul className="space-y-2.5">
                  {document.level1Summary.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-nhs-text bg-nhs-grey5 p-3 rounded-lg border border-nhs-grey4">
                      <span className="w-5 h-5 rounded-full bg-nhs-bluetint text-nhs-blue border border-nhs-blue flex items-center justify-center shrink-0 text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span>{formatBionic(point, settings.bionicReading)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Jargon Demystifier */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-nhs-blue mb-3">
                  Demystified Jargon Dictionary ({document.jargonDictionary.length} terms):
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {document.jargonDictionary.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-nhs-grey5 border border-nhs-grey4 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-nhs-red line-through opacity-80">
                          {item.term}
                        </span>
                        <span className="text-xs text-nhs-secondary">→</span>
                        <span className="text-xs font-semibold text-nhs-green">Plain Meaning</span>
                      </div>
                      <p className="text-xs text-nhs-text leading-relaxed">
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
              <div className="p-4 bg-nhs-bluetint border border-nhs-blue rounded">
                <span className="text-xs font-bold uppercase tracking-wider text-nhs-blue block mb-1">
                  Governing Statutory Authority
                </span>
                <p className="text-base text-nhs-text font-semibold">
                  {document.level2Rights.statutoryAuthority}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-nhs-blue mb-3">
                  Your Statutory Rights & Protections:
                </h3>
                <div className="space-y-3">
                  {document.level2Rights.statutoryRights.map((right, idx) => (
                    <div key={idx} className="p-4 bg-nhs-grey5 border border-nhs-grey4 rounded flex items-start gap-3">
                      <Scale className="w-5 h-5 text-nhs-blue shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="text-sm text-nhs-text leading-relaxed">
                        {formatBionic(right, settings.bionicReading)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-nhs-blue mb-3">
                  Legal Citations & Regulatory Codes:
                </h3>
                <ul className="space-y-2">
                  {document.level2Rights.legalCitations.map((cite, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-mono text-nhs-text bg-nhs-grey5 p-2.5 rounded-lg border border-nhs-grey4">
                      <span className="w-2 h-2 rounded-full bg-nhs-green" aria-hidden="true"></span>
                      <span>{cite}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-nhs-blue mb-3">
                  Hidden Entitlements You May Be Eligible For:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {document.level2Rights.hiddenEntitlements.map((ent, idx) => (
                    <div key={idx} className="p-3 bg-nhs-grey5 border border-nhs-green rounded text-xs text-nhs-text flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-nhs-green shrink-0" aria-hidden="true" />
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
              <div className="p-4 bg-nhs-grey5 border border-nhs-grey4 rounded">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-nhs-secondary font-medium">Resolution Progress</span>
                  <span className="text-nhs-green font-bold">{progressPercent}% complete ({completedCount}/{checklist.length})</span>
                </div>
                <div className="w-full h-2.5 bg-nhs-grey5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-nhs-blue to-nhs-blue transition-all duration-300"
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
                    className={`p-4 rounded border transition-all cursor-pointer flex items-start gap-3.5 ${
 item.completed 
 ? 'bg-nhs-greentint border-nhs-green opacity-80' 
 : 'bg-nhs-grey5 border-nhs-grey4 hover:border-nhs-grey3'
 }`}
                  >
                    <input
                      type="checkbox"
                      id={`chk-${item.id}`}
                      checked={item.completed}
                      onChange={() => toggleChecklist(item.id)}
                      className="w-4 h-4 rounded text-nhs-blue focus:ring-nhs-yellow mt-1 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <label 
                          htmlFor={`chk-${item.id}`} 
                          className={`text-sm font-semibold cursor-pointer ${
 item.completed ? 'line-through text-nhs-secondary' : 'text-nhs-text'
 }`}
                        >
                          {item.task}
                        </label>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
 item.urgency === 'high' 
 ? 'bg-nhs-redtint text-nhs-red border border-nhs-red' 
 : 'bg-nhs-grey5 text-nhs-text'
 }`}>
                          {item.urgency}
                        </span>
                      </div>
                      <p className="text-xs text-nhs-secondary leading-relaxed mb-2">
                        {item.description}
                      </p>
                      {item.requiredDoc && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-nhs-grey5 text-nhs-blue text-xs font-mono">
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
                  className="flex items-center gap-2 px-4 py-2 bg-nhs-grey5 hover:bg-nhs-grey4 text-nhs-text rounded text-xs font-semibold transition-colors"
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-nhs-greentint border border-nhs-green rounded">
                <div>
                  <h3 className="text-sm font-bold text-nhs-text mb-1">
                    Ready-to-Paste Formal Appeal & Procedural Review Letter
                  </h3>
                  <p className="text-xs text-nhs-green">
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
                    className="p-2 bg-nhs-grey5 hover:bg-nhs-grey4 text-nhs-text rounded-lg text-xs transition-colors"
                    title="Download Letter as TXT"
                    aria-label="Download Appeal Letter as TXT"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Subject & Recipient Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-nhs-grey5 border border-nhs-grey4 rounded">
                  <span className="text-nhs-secondary uppercase tracking-wider font-semibold block mb-0.5">
                    Recipient:
                  </span>
                  <span className="text-nhs-text font-mono">
                    {document.level4AppealDraft.recipient}
                  </span>
                </div>
                <div className="p-3 bg-nhs-grey5 border border-nhs-grey4 rounded">
                  <span className="text-nhs-secondary uppercase tracking-wider font-semibold block mb-0.5">
                    Legal Grounds:
                  </span>
                  <span className="text-nhs-green font-mono">
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
                  className="w-full bg-nhs-grey5 border border-nhs-grey4 rounded p-4 text-nhs-text font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-nhs-yellow"
                />
              </div>

              <div className="p-3 bg-nhs-grey5 border border-nhs-grey4 rounded text-xs text-nhs-secondary flex items-center justify-between">
                <span>Tip: Replace bracketed items (e.g. <code>[Your Full Name]</code>) before submitting.</span>
                <span className="text-nhs-blue font-semibold">Ctrl+C → Ctrl+V ready</span>
              </div>
            </div>
          )}

          {/* TAB 5: SMART FORM BRIDGE */}
          {activeTab === 'form' && (
            <div className="space-y-6">
              <div className="p-4 bg-nhs-bluetint border border-nhs-blue rounded">
                <h3 className="text-sm font-bold text-nhs-text mb-1">
                  Smart Form Response Bridge (Ctrl+V Assistant)
                </h3>
                <p className="text-xs text-nhs-text">
                  When government or medical portal applications ask confusing questions designed to disqualify you, paste these legally calibrated answers.
                </p>
              </div>

              <div className="space-y-4">
                {document.smartFormBridge.map((item, idx) => (
                  <div key={idx} className="p-4 bg-nhs-grey5 border border-nhs-grey4 rounded space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-nhs-blue">
                        {item.field}
                      </span>
                      <CopyButton 
                        textToCopy={item.suggestedAnswer} 
                        label="Copy Answer" 
                      />
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-nhs-grey4">
                      <span className="text-xs font-semibold text-nhs-secondary block mb-0.5">Portal Question:</span>
                      <p className="text-xs text-nhs-text font-medium italic">"{item.question}"</p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-nhs-secondary block mb-1">Why this question is a trap:</span>
                      <p className="text-xs text-nhs-text leading-relaxed">{item.explanation}</p>
                    </div>

                    <div className="p-3 bg-nhs-greentint border border-nhs-green rounded-lg">
                      <span className="text-xs font-semibold text-nhs-green block mb-1">Recommended Answer to Paste (Ctrl+V):</span>
                      <p className="text-xs text-nhs-green font-mono leading-relaxed">{item.suggestedAnswer}</p>
                    </div>

                    <div className="text-xs text-nhs-secondary">
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
                <span className="text-xs text-nhs-secondary">
                  Raw input received by Ctrl+V Equalizer:
                </span>
                <CopyButton textToCopy={document.rawText} label="Copy Original" />
              </div>
              <pre className="p-4 bg-nhs-grey5 border border-nhs-grey4 rounded text-xs font-mono text-nhs-secondary whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[500px]">
                {document.rawText}
              </pre>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
