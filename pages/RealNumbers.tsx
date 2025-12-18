
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
      let classification = "Real";
      try {
        const isRational = math.fraction(evalResult);
        classification = isRational ? "Rasional" : "Irasional";
      } catch (e) {}
      
      const res = {
        value: evalResult,
        abs: Math.abs(evalResult),
        rational: classification,
        latex: math.parse(input).toTex(),
        isInfinite: !isFinite(evalResult)
      };
      
      setResult(res);
      const aiExp = await getMathExplanation('Bilangan Real', input, res);
      setExplanation(aiExp || '');
    } catch (err) {
      alert("Input tidak valid! Pastikan penulisan ekspresi benar (contoh: 2 + sqrt(16)).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight font-heading">Kalkulator Bilangan Real</h2>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">Analisis operasi dasar, nilai mutlak, hingga klasifikasi bilangan dengan presisi tinggi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Input Ekspresi Matematika</label>
              <div className="space-y-4">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Contoh: (2 + 3) * sqrt(16)"
                  className="input-modern w-full px-6 py-4 rounded-2xl font-mono text-lg text-indigo-900"
                />
                <button 
                  onClick={calculate}
                  disabled={loading}
                  className="btn-primary w-full py-5 rounded-2xl text-xl shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Menghitung...</span>
                    </>
                  ) : (
                    <><span>Hitung Sekarang</span> <span>🔢</span></>
                  )}
                </button>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-50">
              <MathKeypad onInsert={insertAtCursor} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          {result ? (
            <div className="animate-fadeIn space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-center text-center">
                  <span className="block text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Hasil Akhir</span>
                  <div className="text-5xl font-black text-white tracking-tighter drop-shadow-lg font-heading italic">
                    {result.value}
                  </div>
                </div>
                <div className="bg-indigo-50 p-10 rounded-[2.5rem] border border-indigo-100 flex flex-col justify-center text-center">
                  <span className="block text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Representasi LaTeX</span>
                  <MathDisplay math={result.latex} block />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex items-center gap-6">
                   <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl text-purple-600 shadow-sm">|x|</div>
                   <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Nilai Mutlak</h4>
                      <p className="text-2xl font-black text-slate-900">{result.abs}</p>
                   </div>
                </div>
                <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex items-center gap-6">
                   <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl text-blue-600 shadow-sm">ℚ</div>
                   <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Klasifikasi</h4>
                      <p className="text-2xl font-black text-slate-900">{result.rational}</p>
                   </div>
                </div>
              </div>

              {explanation && (
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                  <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 font-heading">
                    <span className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl shadow-sm">💡</span> 
                    Langkah Penyelesaian AI
                  </h4>
                  <div className="text-slate-600 font-medium leading-relaxed prose prose-indigo max-w-none">
                    <MathDisplay math={explanation} block />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white border-4 border-dashed border-slate-100 rounded-[4rem] p-16 text-center group transition-all hover:bg-slate-50">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-5xl mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">🔍</div>
              <h3 className="text-3xl font-black text-slate-300 mb-4 font-heading">Siap untuk Menghitung?</h3>
              <p className="text-slate-400 max-w-sm font-semibold text-lg leading-relaxed">Gunakan keypad atau ketik langsung ekspresi matematika di panel kiri untuk mulai menganalisis sifat bilangan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealNumbers;
