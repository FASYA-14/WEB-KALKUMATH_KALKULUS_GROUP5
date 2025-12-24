
import React, { useState } from 'react';
import * as math from 'mathjs';
import MathDisplay from '../components/MathDisplay';
import FunctionGraph from '../components/FunctionGraph';
import { getMathExplanation } from '../services/geminiService';
import MathKeypad from '../components/MathKeypad';

const Derivatives: React.FC = () => {
  const [func, setFunc] = useState('x^3 - 5x^2 + 2x');
  const [order, setOrder] = useState('1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const insertAtCursor = (value: string) => {
    setFunc(prev => prev + value);
  };

  const calculateDerivative = async () => {
    if (!func) return;
    setLoading(true);
    try {
      let currentExpr = func;
      const numOrder = parseInt(order);
      
      for (let i = 0; i < numOrder; i++) {
        currentExpr = math.derivative(currentExpr, 'x').toString();
      }

      const resData = {
        original: func,
        derivative: currentExpr,
        latex: math.parse(currentExpr).toTex(),
        originalLatex: math.parse(func).toTex(),
        order: numOrder
      };
      
      const aiExp = await getMathExplanation('Turunan', `Turunan orde ke-${numOrder} dari f(x) = ${func} adalah ${currentExpr}`, { func, order: numOrder });
      setResult({ ...resData, explanation: aiExp });
    } catch (e) {
      alert("Kesalahan! Pastikan penulisan fungsi benar.");
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
        <h2 className="text-4xl font-black text-indigo-600 tracking-tight font-heading">Turunan Fungsi</h2>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-50 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fungsi f(x)</label>
            <input 
              type="text"
              value={func}
              onChange={(e) => setFunc(e.target.value)}
              className="input-modern w-full px-8 py-5 rounded-2xl font-mono text-xl text-slate-800"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Orde Turunan (n)</label>
            <input 
              type="number"
              min="1"
              max="5"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="input-modern w-full px-8 py-5 rounded-2xl font-black text-slate-700 text-xl"
            />
          </div>
        </div>
        <button 
          onClick={calculateDerivative}
          disabled={loading}
          className="btn-primary w-full py-6 rounded-3xl text-xl text-white font-black shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4"
        >
          {loading ? <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>Hitung Turunan Orde {order}</span>}
        </button>
        <div className="pt-4 border-t border-slate-50">
          <MathKeypad onInsert={insertAtCursor} />
        </div>
      </div>

      {result && (
        <div className="space-y-12 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest pl-4">Grafik f(x)</h4>
               <FunctionGraph expression={result.original} />
            </div>
            <div className="space-y-4">
               <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest pl-4">Grafik f'({order})(x)</h4>
               <FunctionGraph expression={result.derivative} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-8">
              <h3 className="text-2xl font-black text-slate-800 font-heading pl-4">Langkah-Langkah Solusi</h3>
              <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-50 space-y-10">
                {(() => {
                  const { intro, steps } = parseSteps(result.explanation);
                  return (
                    <>
                      {intro && (
                        <div className="text-slate-500 font-medium leading-relaxed bg-indigo-50/30 p-8 rounded-3xl border border-indigo-100 italic">
                          {intro}
                        </div>
                      )}
                      <div className="space-y-8">
                        {steps.map((step, i) => (
                          <div key={i} className="flex gap-6 animate-fadeIn">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xl shadow-sm">
                              {i + 1}
                            </div>
                            <div className="space-y-3 pt-2 flex-1">
                              <div className="text-slate-600 font-medium leading-relaxed prose max-w-none">
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
              <div className="bg-indigo-50 p-10 rounded-[3rem] shadow-xl border border-indigo-100 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px] sticky top-32">
                 <span className="text-xs font-black text-indigo-500 uppercase tracking-[0.4em]">Hasil Akhir Orde {order}</span>
                 <div className="text-3xl font-black text-indigo-800 tracking-tight font-heading italic">
                    <MathDisplay math={result.latex} block />
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Derivatives;
