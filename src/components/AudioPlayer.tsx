import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, FastForward } from 'lucide-react';

interface AudioPlayerProps {
  textToSpeak: string;
  speechRate: number;
  onRateChange: (rate: number) => void;
  lang?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  textToSpeak, 
  speechRate, 
  onRateChange,
  lang = 'en-US'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop speech when text changes
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [textToSpeak]);

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) {
      setStatusMessage('Text-to-speech is not supported by your browser');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      setStatusMessage('Resumed audio narration');
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown or tags for clean speech
    const cleanText = textToSpeak
      .replace(/[#*_`]/g, '')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.lang = lang;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith(lang.slice(0, 2)) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setStatusMessage('Playing audio narration');
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setStatusMessage('Audio narration finished');
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setStatusMessage('Audio playback stopped');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (window.speechSynthesis && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
      setStatusMessage('Audio narration paused');
    }
  };

  const handleReset = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setStatusMessage('Audio playback reset');
    }
  };

  const cycleRate = () => {
    const rates = [0.85, 1.0, 1.25, 1.5];
    const currentIndex = rates.indexOf(speechRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    onRateChange(nextRate);
    if (isPlaying) {
      // Restart with new rate
      handlePlay();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white border border-nhs-grey4 px-4 py-2.5 rounded backdrop-blur-md">
      <div className="flex items-center gap-2 text-nhs-blue font-medium text-xs tracking-wider uppercase">
        <Volume2 className="w-4 h-4 animate-pulse text-nhs-blue" aria-hidden="true" />
        <span>Voice Reader</span>
      </div>

      <div className="flex items-center gap-1.5">
        {!isPlaying ? (
          <button
            type="button"
            onClick={handlePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-nhs-blue hover:bg-nhs-darkblue text-white rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-nhs-yellow"
            aria-label="Play audio narration of document summary"
          >
            <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            <span>{isPaused ? 'Resume' : 'Listen Aloud'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePause}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-nhs-warmyellow hover:bg-nhs-warmyellow text-nhs-text rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-nhs-yellow"
            aria-label="Pause audio narration"
          >
            <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            <span>Pause</span>
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 bg-nhs-grey5 hover:bg-nhs-grey4 text-nhs-text rounded-lg text-xs transition-colors"
            title="Reset audio"
            aria-label="Stop and reset audio narration"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}

        <button
          type="button"
          onClick={cycleRate}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-nhs-grey5 hover:bg-nhs-grey4 text-nhs-text rounded-lg text-xs font-mono transition-colors"
          title="Change playback speed"
          aria-label={`Current speech speed: ${speechRate}x. Click to change.`}
        >
          <FastForward className="w-3 h-3 text-nhs-secondary" aria-hidden="true" />
          <span>{speechRate}x</span>
        </button>
      </div>

      {/* Visual sound waveform indicator when playing */}
      {isPlaying && (
        <div className="flex items-center gap-0.5 ml-2 h-4" aria-hidden="true">
          <span className="w-1 bg-nhs-blue rounded-full animate-pulse h-3"></span>
          <span className="w-1 bg-nhs-blue rounded-full animate-pulse delay-75 h-5"></span>
          <span className="w-1 bg-nhs-blue rounded-full animate-pulse delay-150 h-2"></span>
          <span className="w-1 bg-nhs-blue rounded-full animate-pulse delay-100 h-4"></span>
        </div>
      )}

      {/* Screen reader live region */}
      <span role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </span>
    </div>
  );
};
