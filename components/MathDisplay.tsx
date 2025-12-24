
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

    // Try immediate typeset
    typeset();
    
    // Fallback if MathJax is still loading or DOM is updating
    const timer = setTimeout(typeset, 100);
    return () => clearTimeout(timer);
  }, [math]);

  // If the string contains LaTeX commands but no $ signs, let's wrap it to be safe
  const needsWrapping = (math.includes('\\') || math.includes('_') || math.includes('^')) && !math.includes('$');
  const isMixed = math.includes('$');

  let content = math;
  if (!isMixed && needsWrapping) {
    content = block ? `\\[${math}\\]` : `\\(${math}\\)`;
  } else if (!isMixed && !needsWrapping && block) {
    content = `\\[${math}\\]`;
  } else if (!isMixed && !needsWrapping && !block) {
    content = `\\(${math}\\)`;
  }

  return (
    <div 
      ref={containerRef} 
      className={`mathjax-wrapper prose prose-slate max-w-none ${invert ? 'prose-invert text-white' : 'text-slate-900'} ${block ? 'my-4 text-center' : 'inline-block'} ${className}`}
    >
      {content}
    </div>
  );
};

export default MathDisplay;
