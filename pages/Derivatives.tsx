
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
      alert("Kesalahan! Pastikan penulisan fungsi benar (contoh: 3x^2).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight font-heading">Kalkulator Turunan Orde</h2>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">Hitung turunan pertama hingga orde tinggi secara otomatis dengan aturan diferensiasi lengkap.</p>
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
                placeholder="3x^2 + sin(x)"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Orde Turunan (n)</label>
              <input 
                type="number"
                min="1"
                max="5"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="input-modern w-full px-6 py-4 rounded-2xl font-bold text-slate-700"
              />
            </div>
            <button 
              onClick={calculateDerivative}
              disabled={loading}
              className="btn-primary w-full py-5 rounded-2xl text-xl shadow-2xl shadow-indigo-100 mt-4 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Menghitung...</span>
                </>
              ) : (
                <><span>Turunkan Fungsi</span> <span>📈</span></>
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
              <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/5">
                    <span className="block text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Fungsi Asli</span>
                    <MathDisplay math={`f(x) = ${result.originalLatex}`} block />
                  </div>
                  <div className="text-center p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/10">
                    <span className="block text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">
                      {result.order === 1 ? 'Turunan Pertama' : `Turunan Orde ${result.order}`}
                    </span>
                    <MathDisplay math={`f^{(${result.order})}(x) = ${result.latex}`} block />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FunctionGraph expression={result.original} />
                <FunctionGraph expression={result.derivative} />
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 font-heading">
                  <span className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl shadow-sm">💡</span> 
                  Langkah Diferensiasi
                </h4>
                <div className="text-slate-600 font-medium leading-relaxed prose prose-indigo max-w-none overflow-auto">
                  <MathDisplay math={result.explanation} block />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white border-4 border-dashed border-slate-100 rounded-[4rem] p-16 text-center group transition-all hover:bg-slate-50">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-5xl mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">🔍</div>
              <h3 className="text-3xl font-black text-slate-300 mb-4 font-heading">Mulai Diferensiasi?</h3>
              <p className="text-slate-400 max-w-sm font-semibold text-lg leading-relaxed">Masukkan fungsi f(x) dan orde turunan yang diinginkan di panel kiri untuk melihat hasilnya secara instan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Derivatives;
