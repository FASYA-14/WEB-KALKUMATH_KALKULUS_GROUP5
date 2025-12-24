
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
    if (!func || approach === '') return;
    setLoading(true);
    try {
      const a = approach.toLowerCase() === 'inf' ? Infinity : Number(approach);
      const compiled = math.compile(func);
      
      const delta = 0.0001;
      let leftVal = NaN;
      let rightVal = NaN;
      
      try {
        if (!isFinite(a)) {
          rightVal = compiled.evaluate({ x: 100000 });
          leftVal = compiled.evaluate({ x: -100000 });
        } else {
          leftVal = compiled.evaluate({ x: a - delta });
          rightVal = compiled.evaluate({ x: a + delta });
        }
      } catch (e) {
        console.error("Evaluation Error", e);
      }

      let finalResult = "";
      if (direction === 'left') finalResult = isNaN(leftVal) ? "Tak Terhingga" : leftVal.toFixed(6);
      else if (direction === 'right') finalResult = isNaN(rightVal) ? "Tak Terhingga" : rightVal.toFixed(6);
      else {
        if (isNaN(leftVal) || isNaN(rightVal)) finalResult = "Tak Terhingga";
        else if (Math.abs(leftVal - rightVal) < 0.01) finalResult = ((leftVal + rightVal) / 2).toFixed(6);
        else finalResult = "Tidak Ada";
      }

      if (finalResult !== "Tidak Ada" && finalResult !== "Tak Terhingga") {
        const numRes = parseFloat(finalResult);
        finalResult = Number.isInteger(numRes) ? numRes.toString() : numRes.toFixed(4).replace(/\.?0+$/, "");
      }

      const resData = {
        value: finalResult,
        latex: `\\lim_{x \\to ${approach}${direction === 'left' ? '^-' : direction === 'right' ? '^+' : ''}} ${math.parse(func).toTex()}`,
        func,
        approachValue: isFinite(a) ? a : 0
      };
      
      const aiExp = await getMathExplanation('Limit', `${resData.latex} = ?`, { func, approach, direction });
      setResult({ ...resData, explanation: aiExp });
    } catch (e) {
      alert("Terjadi kesalahan. Pastikan penulisan fungsi benar.");
    } finally {
      setLoading(false);
    }
  };

  const parseSteps = (text: string) => {
    if (!text) return { intro: "", steps: [] };
    // Regex case-insensitive untuk LANGKAH/Langkah/Step
    const stepRegex = /(?:\*\*|)?(?:LANGKAH|Langkah|Step|step)\s+\d+[:\- ]*(?:\*\*|)?/gi;
    const parts = text.split(stepRegex);
    const intro = parts[0]?.trim() || "";
    const steps = parts.slice(1).map(s => s.trim()).filter(s => s.length > 0);
    return steps.length === 0 ? { intro: "", steps: [text] } : { intro, steps };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => window.history.back()} className="text-indigo-400 hover:text-indigo-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-4xl font-black text-[#e57373] tracking-tight font-heading">Limit Fungsi</h2>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-50 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fungsi / Ekspresi</label>
            <input type="text" value={func} onChange={(e) => setFunc(e.target.value)} className="input-modern w-full px-8 py-5 rounded-2xl font-mono text-xl" />
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">x → a</label>
            <input type="text" value={approach} onChange={(e) => setApproach(e.target.value)} className="input-modern w-full px-8 py-5 rounded-2xl font-black text-xl" />
          </div>
        </div>
        <button onClick={calculateLimit} disabled={loading} className="btn-primary w-full py-6 rounded-3xl text-xl text-white font-black shadow-2xl flex items-center justify-center gap-4">
          {loading ? <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>Hitung Sekarang</span>}
        </button>
        <div className="pt-4 border-t border-slate-50">
          <MathKeypad onInsert={insertAtCursor} />
        </div>
      </div>

      {result && (
        <div className="space-y-12 animate-fadeIn">
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-800 font-heading pl-4">Visualisasi Grafik</h3>
            <FunctionGraph expression={result.func} range={[result.approachValue - 5, result.approachValue + 5]} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-8">
              <h3 className="text-2xl font-black text-slate-800 font-heading pl-4">Solusi Langkah demi Langkah</h3>
              <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl border border-slate-50 space-y-10">
                {(() => {
                  const { intro, steps } = parseSteps(result.explanation || "");
                  return (
                    <>
                      {intro && <div className="text-slate-500 italic bg-[#f8fafc] p-8 rounded-3xl border border-slate-100"><MathDisplay math={intro} /></div>}
                      <div className="space-y-8">
                        {steps.map((step, i) => (
                          <div key={i} className="flex gap-6 animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ffeaeb] text-[#e57373] flex items-center justify-center font-black text-lg shadow-sm border-2 border-white">{i + 1}</div>
                            <div className="flex-1 text-slate-600 pt-2"><MathDisplay math={step} /></div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="md:col-span-4">
              <div className="bg-[#fff7ed] p-10 rounded-[3rem] shadow-xl border border-orange-100 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px] sticky top-32">
                 <span className="text-xs font-black text-[#c2410c] uppercase tracking-widest">Hasil Akhir</span>
                 <div className="text-6xl font-black text-[#c2410c] font-heading">{result.value}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Limits;
