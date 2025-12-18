
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
        else finalResult = "Tidak Ada (Limit Kiri != Kanan)";
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
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Kalkulator Limit</h2>
        <p className="text-slate-500">Hitung limit fungsi, limit sepihak, dan limit tak hingga.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Fungsi f(x)</label>
              <input 
                type="text"
                value={func}
                onChange={(e) => setFunc(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="x^2 - 4"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mendekati (x → a)</label>
              <input 
                type="text"
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="0 atau inf"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Arah</label>
              <select 
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="both">Kedua Sisi (Default)</option>
                <option value="left">Limit Kiri (-)</option>
                <option value="right">Limit Kanan (+)</option>
              </select>
            </div>
            <button 
              onClick={calculateLimit}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md mt-4"
            >
              {loading ? 'Menganalisis...' : 'Hitung Limit'}
            </button>
            <MathKeypad onInsert={insertAtCursor} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                  <div className="text-center md:text-left">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Persoalan</span>
                    <div className="mt-2"><MathDisplay math={result.latex} block /></div>
                  </div>
                  <div className="h-px md:h-12 w-12 md:w-px bg-slate-100"></div>
                  <div className="text-center md:text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hasil</span>
                    <div className="text-3xl font-extrabold text-indigo-600 mt-2">{result.value}</div>
                  </div>
                </div>

                <div className="space-y-8">
                  <FunctionGraph expression={result.func} range={[Number(approach) - 5, Number(approach) + 5]} />
                  
                  <div className="bg-blue-50 p-6 rounded-2xl">
                    <h4 className="text-sm font-bold text-blue-900 mb-3">Langkah Penyelesaian AI:</h4>
                    <div className="text-blue-800 leading-relaxed whitespace-pre-wrap">
                       <MathDisplay math={result.explanation} block />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-slate-400 text-center">
              Masukkan fungsi dan nilai pendekatan untuk melihat analisis limit dan grafik.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Limits;
