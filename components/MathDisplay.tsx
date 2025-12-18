
import React, { useEffect, useRef } from 'react';

// Add type definition for MathJax on the window object to fix TypeScript errors
declare global {
  interface Window {
    MathJax: any;
  }
}

interface MathDisplayProps {
  math: string;
  block?: boolean;
}

const MathDisplay: React.FC<MathDisplayProps> = ({ math, block = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if MathJax exists on window to avoid runtime errors and fix TS property access
    if (window.MathJax && containerRef.current) {
      window.MathJax.typesetPromise([containerRef.current]);
    }
  }, [math]);

  return (
    <div ref={containerRef} className={`mathjax-wrapper ${block ? 'my-4 text-center' : 'inline-block'}`}>
      {block ? `\\[${math}\\]` : `\\(${math}\\)`}
    </div>
  );
};

export default MathDisplay;
