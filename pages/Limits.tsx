
import React, { useState } from 'react';
import * as math from 'mathjs';
import MathDisplay from '../components/MathDisplay';
import FunctionGraph from '../components/FunctionGraph';
import { getMathExplanation } from '../services/geminiService';
import MathKeypad from '../components/MathKeypad';

const Limits: React.FC = () => {
  const [func, setFunc] = useState('(x^2 - 4)/(x - 2)');
  const [approach, setApproach] = useState('2');
  const [direction, setDirection] = useState<'both' | 'left' | 'right'>('both');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const insertAtCursor = (value: string) => {
    setFunc(prev => prev + value);
  };

  const calculateLimit = async () => {
    setLoading(true);
    try {
      const a = approach.toLowerCase() === 'inf' ? Infinity : Number(approach);
      const compiled = math.compile(func);
      
      const delta = 0.0001;
      let leftVal = NaN;
      let rightVal = NaN;
      
      if (!isFinite(a)) {
        rightVal = compiled.evaluate({ x: 100000 });
        leftVal = compiled.evaluate({ x: -100000 });
      } else {
        leftVal = compiled.evaluate({ x: a - delta });
        rightVal = compiled.evaluate({ x: a + delta });
      }

      let finalResult = "";
      if (direction === 'left') finalResult = leftVal.toFixed(6);
      else if (direction === 'right') finalResult = rightVal.toFixed(6);
      else {
        if (Math.abs(leftVal - rightVal) < 0.01) finalResult = ((leftVal + rightVal) / 2).toFixed(6);
        else finalResult = "Tidak Ada";
      }

      // Cleanup trailing zeros
      if (finalResult !== "Tidak Ada") {
        const numRes = parseFloat(finalResult);
        finalResult = Number.isInteger(numRes) ? numRes.toString() : numRes.toFixed(4).replace(/\.?0+$/, "");
      }

      const resData = {
        value: finalResult,
        latex: `\\lim_{x \\to ${approach}${direction === 'left' ? '^-' : direction === 'right' ? '^+' : ''}} ${math.parse(func).toTex()}`,
        func
      };
      
      const aiExp = await getMathExplanation('Limit', `${resData.latex} = ?`, { func, approach, direction });
      setResult({ ...resData, explanation: aiExp });
    } catch (e) {
      alert("Terjadi kesalahan. Pastikan penulisan fungsi benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn pb-24">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => window.history.back()} className="text-indigo-400 hover:text-indigo-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="arrow-narrow-left" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-4xl font-black text-[#e57373] tracking-tight font-heading">Limit Fungsi</h2>
      </div>

      {/* Input Section */}
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-50 space-y-8">
        <div className="flex items-center gap-3 mb-2">
           <span className="text-xl">💡</span>
           <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Coba Contoh Soal:</span>
           <div className="flex gap-2">
             {['Limit Trigonometri Dasar', 'Limit Pemfaktoran', 'Limit Tak Hingga'].map(label => (
               <button key={label} className="px-4 py-1.5 bg-[#fff7ed] text-[#c2410c] text-[10px] font-black rounded-full border border-orange-100 hover:bg-orange-100 transition-colors">
                 {label}
               </button>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fungsi / Ekspresi Matematika</label>
            <input 
              type="text"
              value={func}
              onChange={(e) => setFunc(e.target.value)}
              className="input-modern w-full px-8 py-5 rounded-2xl font-mono text-xl text-slate-800"
              placeholder="(x^2 - 4)/(x - 2)"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mendekati (x → a)</label>
            <input 
              type="text"
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              className="input-modern w-full px-8 py-5 rounded-2xl font-black text-slate-700 text-xl"
              placeholder="2"
            />
          </div>
        </div>

        <button 
          onClick={calculateLimit}
          disabled={loading}
          className="btn-primary w-full py-6 rounded-3xl text-xl text-white font-black shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 transition-all active:scale-[0.98]"
        >
          {loading ? (
            <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="text-2xl">📝</span>
              <span>Hitung Sekarang</span>
            </>
          )}
        </button>
        
        <div className="pt-4 border-t border-slate-50 opacity-80">
          <MathKeypad onInsert={insertAtCursor} />
        </div>
      </div>

      {result && (
        <div className="space-y-12 animate-fadeIn">
          {/* Visualization Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-800 font-heading pl-4">Visualisasi Grafik</h3>
            <FunctionGraph expression={result.func} range={[Number(approach) - 5, Number(approach) + 5]} />
          </div>

          {/* Results Grid - TWO COLUMN LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Steps Column */}
            <div className="md:col-span-8 space-y-8">
              <h3 className="text-2xl font-black text-slate-800 font-heading pl-4">Langkah-Langkah Solusi</h3>
              <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl border border-slate-50 space-y-10">
                <div className="text-slate-500 font-medium leading-relaxed bg-[#f8fafc] p-8 rounded-3xl border border-slate-100 italic text-sm md:text-base">
                   {result.explanation.split('Langkah 1:')[0]}
                </div>
                
                <div className="space-y-8">
                  {result.explanation.split('Langkah ').slice(1).map((step: string, i: number) => {
                    const [title, ...content] = step.split(':');
                    return (
                      <div key={i} className="flex gap-6 animate-fadeIn" style={{ animationDelay: `${i * 150}ms` }}>
                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ffeaeb] text-[#e57373] flex items-center justify-center font-black text-lg md:text-xl shadow-sm">
                          {i + 1}
                        </div>
                        <div className="space-y-3 pt-1 md:pt-2">
                          <h4 className="font-black text-slate-800 text-lg md:text-xl leading-snug">
                            Langkah {title}
                          </h4>
                          <div className="text-slate-600 font-medium leading-relaxed prose prose-indigo max-w-none">
                            <MathDisplay math={content.join(':')} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Final Result Column */}
            <div className="md:col-span-4 space-y-8">
              <h3 className="text-2xl font-black text-slate-800 font-heading pl-4 opacity-0">Hasil</h3>
              <div className="bg-[#fff7ed] p-10 md:p-12 rounded-[3rem] shadow-xl border border-orange-100 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px] sticky top-32">
                 <span className="text-xs font-black text-[#c2410c] uppercase tracking-[0.4em] mb-2">Hasil Akhir</span>
                 <div className="text-7xl font-black text-[#c2410c] tracking-tighter font-heading italic animate-fadeIn">
                   {result.value}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Limits;
