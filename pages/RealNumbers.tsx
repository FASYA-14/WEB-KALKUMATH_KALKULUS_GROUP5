
import React, { useState } from 'react';
import * as math from 'mathjs';
import MathDisplay from '../components/MathDisplay';
import { getMathExplanation } from '../services/geminiService';
import MathKeypad from '../components/MathKeypad';

const RealNumbers: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const insertAtCursor = (value: string) => {
    setInput(prev => prev + value);
  };

  const calculate = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const evalResult = math.evaluate(input);
      const isRational = math.fraction(evalResult);
      
      const res = {
        value: evalResult,
        abs: Math.abs(evalResult),
        rational: isRational ? "Rasional" : "Irasional",
        latex: math.parse(input).toTex(),
        isInfinite: !isFinite(evalResult)
      };
      
      setResult(res);
      const aiExp = await getMathExplanation('Bilangan Real', input, res);
      setExplanation(aiExp || '');
    } catch (err) {
      alert("Input tidak valid! Pastikan format penulisan benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Kalkulator Bilangan Real</h2>
        <p className="text-slate-500 font-medium">Hitung operasi dasar, nilai mutlak, dan analisis sifat bilangan.</p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-indigo-50 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest ml-1">Input Ekspresi Matematika</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Contoh: (2 + 3) * sqrt(16)"
              className="flex-1 px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all font-mono text-lg"
            />
            <button 
              onClick={calculate}
              disabled={loading}
              className="btn-primary px-10 py-4 text-white rounded-2xl font-black text-lg disabled:opacity-50 transition-all shadow-xl shadow-indigo-200 min-w-[140px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>...</span>
                </div>
              ) : 'Hitung'}
            </button>
          </div>
          
          <MathKeypad onInsert={insertAtCursor} />
        </div>

        {result && (
          <div className="space-y-10 pt-10 border-t border-slate-100 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl text-center border border-indigo-100">
                <span className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Representasi LaTeX</span>
                <MathDisplay math={result.latex} block />
              </div>
              <div className="bg-slate-900 p-8 rounded-3xl text-center shadow-2xl shadow-indigo-200">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Hasil Akhir</span>
                <div className="text-4xl font-black text-white mt-2 tracking-tight">
                  {result.value}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 border border-slate-100 rounded-3xl bg-slate-50 group hover:bg-violet-50 transition-colors">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nilai Mutlak</h4>
                <p className="text-2xl font-black text-slate-900">|{result.value}| = <span className="text-violet-600">{result.abs}</span></p>
              </div>
              <div className="p-6 border border-slate-100 rounded-3xl bg-slate-50 group hover:bg-blue-50 transition-colors">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Klasifikasi Bilangan</h4>
                <p className="text-2xl font-black text-slate-900">{result.rational}</p>
              </div>
            </div>

            {explanation && (
              <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>
                <h4 className="text-lg font-black text-indigo-900 mb-6 flex items-center gap-3">
                  <span className="bg-white w-8 h-8 rounded-lg flex items-center justify-center text-xl shadow-sm">💡</span> 
                  Langkah Penyelesaian
                </h4>
                <div className="prose prose-indigo max-w-none text-indigo-800 font-medium leading-relaxed bg-white/50 p-6 rounded-2xl border border-white/50">
                  <MathDisplay math={explanation} block />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealNumbers;
