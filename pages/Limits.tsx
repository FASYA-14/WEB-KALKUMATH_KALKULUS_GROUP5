
import React, { useState } from 'react';
import * as math from 'mathjs';
import MathDisplay from '../components/MathDisplay';
import FunctionGraph from '../components/FunctionGraph';
import { getMathExplanation } from '../services/geminiService';
import MathKeypad from '../components/MathKeypad';

const Limits: React.FC = () => {
  const [func, setFunc] = useState('sin(x)/x');
  const [approach, setApproach] = useState('0');
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
        else finalResult = "Tidak Ada (Limit Kiri ≠ Kanan)";
      }

      const resData = {
        value: finalResult,
        latex: `\\lim_{x \\to ${approach}${direction === 'left' ? '^-' : direction === 'right' ? '^+' : ''}} ${math.parse(func).toTex()}`,
        func
      };
      
      const aiExp = await getMathExplanation('Limit', `${resData.latex} = ?`, { func, approach, direction });
      setResult({ ...resData, explanation: aiExp });
    } catch (e) {
      alert("Terjadi kesalahan. Pastikan penulisan fungsi benar (gunakan format standar seperti x^2).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight font-heading">Kalkulator Limit Fungsi</h2>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">Analisis perilaku fungsi mendekati titik tertentu dengan presisi tinggi dan penjelasan AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Fungsi f(x)</label>
              <input 
                type="text"
                value={func}
                onChange={(e) => setFunc(e.target.value)}
                className="input-modern w-full px-6 py-4 rounded-2xl font-mono text-lg text-indigo-900"
                placeholder="x^2 - 4"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mendekati (x → a)</label>
              <input 
                type="text"
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                className="input-modern w-full px-6 py-4 rounded-2xl font-bold text-slate-700"
                placeholder="0 atau inf"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Arah Pendekatan</label>
              <select 
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="input-modern w-full px-6 py-4 rounded-2xl font-bold text-slate-700 appearance-none bg-no-repeat bg-[right_1.5rem_center]"
              >
                <option value="both">Kedua Sisi (Normal)</option>
                <option value="left">Limit Kiri (-)</option>
                <option value="right">Limit Kanan (+)</option>
              </select>
            </div>
            <button 
              onClick={calculateLimit}
              disabled={loading}
              className="btn-primary w-full py-5 rounded-2xl text-xl shadow-2xl shadow-indigo-100 mt-4 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Menganalisis...</span>
                </>
              ) : (
                <><span>Analisis Limit</span> <span>📉</span></>
              )}
            </button>
            <div className="pt-2 border-t border-slate-50">
              <MathKeypad onInsert={insertAtCursor} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          {result ? (
            <div className="animate-fadeIn space-y-8">
              <div className="bg-slate-900 p-12 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                  <div className="relative z-10">
                    <span className="block text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Persoalan</span>
                    <MathDisplay math={result.latex} block />
                  </div>
                  <div className="hidden md:block w-px h-16 bg-white/10"></div>
                  <div className="relative z-10">
                    <span className="block text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Hasil</span>
                    <div className="text-4xl font-black text-indigo-400 tracking-tighter italic font-heading">
                      {result.value}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <FunctionGraph expression={result.func} range={[Number(approach) - 5, Number(approach) + 5]} />
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                  <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 font-heading">
                    <span className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl shadow-sm">💡</span> 
                    Penjelasan AI
                  </h4>
                  <div className="text-slate-600 font-medium leading-relaxed prose prose-indigo max-w-none flex-grow overflow-auto">
                    <MathDisplay math={result.explanation} block />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white border-4 border-dashed border-slate-100 rounded-[4rem] p-16 text-center group transition-all hover:bg-slate-50">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-5xl mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">🔍</div>
              <h3 className="text-3xl font-black text-slate-300 mb-4 font-heading">Siap untuk Menganalisis?</h3>
              <p className="text-slate-400 max-w-sm font-semibold text-lg leading-relaxed">Masukkan fungsi dan nilai pendekatan x di panel kiri untuk melihat analisis limit yang mendalam.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Limits;
