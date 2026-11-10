import React from 'react';

/**
 * Transforms plain text into Bionic Reading format.
 * Bolds the first 40-50% of each word to guide the eye, helping neurodivergent
 * readers (ADHD, dyslexia) read faster with lower cognitive fatigue.
 */
export function formatBionic(text: string, enabled: boolean): React.ReactNode {
  if (!enabled || !text) return text;

  // Split text by words while preserving spacing and linebreaks
  const paragraphs = text.split('\n');

  return (
    <>
      {paragraphs.map((para, pIdx) => {
        if (!para.trim()) return <br key={pIdx} />;
        
        const words = para.split(/(\s+)/);
        return (
          <p key={pIdx} className="mb-3 leading-relaxed">
            {words.map((word, wIdx) => {
              if (/^\s+$/.test(word)) {
                return <span key={wIdx}>{word}</span>;
              }

              // Extract punctuation from ends
              const match = word.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9]+)([^a-zA-Z0-9]*)$/);
              if (!match) {
                return <span key={wIdx}>{word}</span>;
              }

              const [, prefix, core, suffix] = match;
              const mid = Math.ceil(core.length * 0.45);
              const boldPart = core.slice(0, mid);
              const restPart = core.slice(mid);

              return (
                <span key={wIdx} className="inline-block">
                  {prefix}
                  <strong className="font-extrabold text-nhs-text">{boldPart}</strong>
                  <span className="opacity-90">{restPart}</span>
                  {suffix}
                </span>
              );
            })}
          </p>
        );
      })}
    </>
  );
}
