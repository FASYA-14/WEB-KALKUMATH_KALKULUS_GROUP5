
import React, { useEffect, useRef } from 'react';

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
    if (window.MathJax && containerRef.current) {
      // Membersihkan container sebelum render ulang jika perlu
      window.MathJax.typesetPromise([containerRef.current]).catch((err: any) => console.error(err));
    }
  }, [math]);

  // Jika math mengandung '$', asumsikan itu adalah teks campuran (AI Response)
  // MathJax akan mencari delimiter $ atau $$ secara otomatis.
  const isMixed = math.includes('$');

  return (
    <div 
      ref={containerRef} 
      className={`mathjax-wrapper prose prose-slate max-w-none ${block ? 'my-4 text-center' : 'inline-block'}`}
    >
      {isMixed ? math : (block ? `\\[${math}\\]` : `\\(${math}\\)`)}
    </div>
  );
};

export default MathDisplay;
