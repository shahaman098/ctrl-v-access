import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
}

/**
 * Accessible Copy Button complying with Modern Web Guidance:
 * - Uses type="button"
 * - Maintains min touch target (≥32x32px)
 * - Independent role="status" live region outside button for screen reader announcements
 * - Icon transition (Copy -> Check) with non-color indicator
 * - Does not disable button while active to preserve keyboard focus
 */
export const CopyButton: React.FC<CopyButtonProps> = ({ 
  textToCopy, 
  label = "Copy text",
  className = "" 
}) => {
  const [copied, setCopied] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setFeedbackMessage('Copied to clipboard');
    } catch {
      setCopied(false);
      setFeedbackMessage('Copy failed');
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCopied(false);
      setFeedbackMessage('');
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-2 relative">
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[32px] min-w-[32px] focus:outline-none focus-visible:ring-2 focus-visible:ring-nhs-yellow ${
 copied 
 ? 'bg-nhs-green text-white' 
 : 'bg-nhs-blue hover:bg-nhs-darkblue text-white'
 } ${className}`}
        aria-label={label}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Screen reader live region outside the button as required by accessibility standards */}
      <span 
        role="status" 
        aria-live="polite" 
        className="sr-only"
      >
        {feedbackMessage}
      </span>
    </div>
  );
};
