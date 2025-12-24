
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
    if (window.MathJax && containerRef.current) {
      window.MathJax.typesetPromise([containerRef.current]).catch((err: any) => console.error(err));
    }
  }, [math]);

  const isMixed = math.includes('$');

  return (
    <div 
      ref={containerRef} 
      className={`mathjax-wrapper prose prose-slate max-w-none ${invert ? 'prose-invert text-white' : 'text-slate-900'} ${block ? 'my-4 text-center' : 'inline-block'} ${className}`}
    >
      {isMixed ? math : (block ? `\\[${math}\\]` : `\\(${math}\\)`)}
    </div>
  );
};

export default MathDisplay;
