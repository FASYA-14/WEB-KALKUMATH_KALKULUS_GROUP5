
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    MathJax: any;
  }
}

interface MathDisplayProps {
  math: string;
  block?: boolean;
  className?: string;
  invert?: boolean;
}

const MathDisplay: React.FC<MathDisplayProps> = ({ math, block = false, className = "", invert = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const typeset = () => {
      if (window.MathJax && containerRef.current) {
        window.MathJax.typesetPromise([containerRef.current]).catch((err: any) => 
          console.error("MathJax error:", err)
        );
      }
    };

    typeset();
    // Re-run after a short delay to ensure everything is in the DOM
    const timer = setTimeout(typeset, 300);
    return () => clearTimeout(timer);
  }, [math]);

  // Enhanced detection for mixed content vs pure LaTeX commands
  const hasDelimiters = math.includes('$') || math.includes('\\(') || math.includes('\\[');
  const containsLatexCommands = math.includes('\\') || math.includes('_') || math.includes('^') || math.includes('{');

  let content = math;
  if (!hasDelimiters && containsLatexCommands) {
    // If it looks like LaTeX but has no delimiters, wrap it
    content = block ? `\\[${math}\\]` : `\\(${math}\\)`;
  } else if (!hasDelimiters && block) {
    // Pure text block
    content = `\\[${math}\\]`;
  }

  return (
    <div 
      ref={containerRef} 
      className={`mathjax-wrapper prose prose-slate max-w-none ${invert ? 'prose-invert text-white' : 'text-slate-900'} ${block ? 'my-4 text-center block' : 'inline'} ${className}`}
      style={{ wordBreak: 'break-word', display: block ? 'block' : 'inline' }}
    >
      {content}
    </div>
  );
};

export default MathDisplay;
