
import React, { useState } from 'react';
import * as math from 'mathjs';
import MathDisplay from '../components/MathDisplay';
import { getMathExplanation } from '../services/geminiService';
import MathKeypad from '../components/MathKeypad';

const RealNumbers: React.FC = () => {
  const [input, setInput] = useState('sqrt(2) + pi');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const insertAtCursor = (value: string) => {
    setInput(prev => prev + value);
  };

  const calculate = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const evalResult = math.evaluate(input);
      let classification = "Real";
      try {
        const isRational = math.fraction(evalResult);
        classification = isRational ? "Rasional" : "Irasional";
      } catch (e) {
        classification = "Irasional";
      }
      
      const res = {
        value: typeof evalResult === 'number' ? evalResult.toFixed(4).replace(/\.?0+$/, "") : evalResult.toString(),
        abs: Math.abs(Number(evalResult)).toFixed(4).replace(/\.?0+$/, ""),
        rational: classification,
        latex: math.parse(input).toTex(),
        originalInput: input
      };
      
      const aiExp = await getMathExplanation('Bilangan Real', input, res);
      setResult({ ...res, explanation: aiExp });
    } catch (err) {
      alert("Input tidak valid! Pastikan penulisan ekspresi benar.");
    } finally {
      setLoading(false);
    }
  };

  const parseSteps = (text: string) => {
    const stepRegex = /(?:\*\*|)?LANGKAH \d+[:\- ]+(?:\*\*|)?/gi;
    const parts = text.split(stepRegex);
    const intro = parts[0].trim();
    const steps = parts.slice(1).map(s => s.trim());
    return { intro, steps };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => window.history.back()} className="text-indigo-400 hover:text-indigo-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-4xl font-black text-blue-600 tracking-tight font-heading">Bilangan Real</h2>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-50 space-y-8">
        <div className="space-y-4">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ekspresi Matematika</label>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-modern w-full px-8 py-5 rounded-2xl font-mono text-xl text-slate-800"
            placeholder="sqrt(16) * 2"
          />
        </div>

        <button 
          onClick={calculate}
          disabled={loading}
          className="btn-primary w-full py-6 rounded-3xl text-xl text-white font-black shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98]"
        >
          {loading ? (
            <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="text-2xl">🔢</span>
              <span>Analisis Bilangan</span>
            </>
          )}
        </button>
        
        <div className="pt-4 border-t border-slate-50">
          <MathKeypad onInsert={insertAtCursor} />
        </div>
      </div>

      {result && (
        <div className="space-y-12 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex items-center gap-6">
               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl text-blue-600 shadow-sm font-black italic">|x|</div>
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nilai Mutlak</h4>
                  <p className="text-2xl font-black text-slate-900">{result.abs}</p>
               </div>
            </div>
            <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex items-center gap-6">
               <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl text-indigo-600 shadow-sm font-black italic">ℚ</div>
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Klasifikasi</h4>
                  <p className="text-2xl font-black text-slate-900">{result.rational}</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-8">
              <h3 className="text-2xl font-black text-slate-800 font-heading pl-4">Langkah-Langkah Solusi</h3>
              <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl border border-slate-50 space-y-10">
                {(() => {
                  const { intro, steps } = parseSteps(result.explanation);
                  return (
                    <>
                      {intro && (
                        <div className="text-slate-500 font-medium leading-relaxed bg-[#f8fafc] p-8 rounded-3xl border border-slate-100 italic text-sm md:text-base">
                          {intro}
                        </div>
                      )}
                      <div className="space-y-8">
                        {steps.map((step, i) => (
                          <div key={i} className="flex gap-6 animate-fadeIn" style={{ animationDelay: `${i * 150}ms` }}>
                            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-black text-lg md:text-xl shadow-sm">
                              {i + 1}
                            </div>
                            <div className="space-y-3 pt-1 md:pt-2 flex-1">
                              <div className="text-slate-600 font-medium leading-relaxed prose prose-blue max-w-none">
                                <MathDisplay math={step} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="md:col-span-4 space-y-8">
              <h3 className="text-2xl font-black text-slate-800 font-heading pl-4 opacity-0">Hasil</h3>
              <div className="bg-blue-50 p-10 md:p-12 rounded-[3rem] shadow-xl border border-blue-100 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px] sticky top-32">
                 <span className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Hasil Akhir</span>
                 <div className="text-5xl font-black text-blue-800 tracking-tighter font-heading italic animate-fadeIn">
                   {result.value}
                 </div>
                 <div className="pt-4 border-t border-blue-100 w-full">
                    <MathDisplay math={result.latex} className="text-blue-400 opacity-60" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealNumbers;
