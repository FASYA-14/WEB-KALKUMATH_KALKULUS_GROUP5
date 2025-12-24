
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
    // Re-run after a short delay for late rendering
    const timer = setTimeout(typeset, 200);
    return () => clearTimeout(timer);
  }, [math]);

  // Enhanced detection for mixed content vs pure LaTeX
  const hasDelimiters = math.includes('$') || math.includes('\\(') || math.includes('\\[');
  const containsLatex = math.includes('\\') || math.includes('_') || math.includes('^') || math.includes('{');

  let content = math;
  if (!hasDelimiters && containsLatex) {
    // Wrap if it's pure LaTeX without delimiters
    content = block ? `\\[${math}\\]` : `\\(${math}\\)`;
  } else if (!hasDelimiters && !containsLatex && block) {
    // Pure text but requested as block
    content = `\\[${math}\\]`;
  }

  return (
    <div 
      ref={containerRef} 
      className={`mathjax-wrapper prose prose-slate max-w-none ${invert ? 'prose-invert text-white' : 'text-slate-900'} ${block ? 'my-4 text-center block' : 'inline'} ${className}`}
      style={{ wordBreak: 'break-word' }}
    >
      {content}
    </div>
  );
};

export default MathDisplay;
