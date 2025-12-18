
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
      alert("Error: Pastikan penulisan fungsi benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Kalkulator Turunan</h2>
        <p className="text-slate-500">Hitung turunan pertama, kedua, dan orde tinggi dengan aturan kalkulus.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Fungsi f(x)</label>
              <input 
                type="text"
                value={func}
                onChange={(e) => setFunc(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="3x^2 + sin(x)"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Orde Turunan</label>
              <input 
                type="number"
                min="1"
                max="5"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button 
              onClick={calculateDerivative}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
            >
              {loading ? 'Menghitung...' : 'Turunkan'}
            </button>
            <MathKeypad onInsert={insertAtCursor} />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {result ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fungsi Asli</span>
                  <div className="mt-2"><MathDisplay math={`f(x) = ${result.originalLatex}`} block /></div>
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    {result.order === 1 ? 'Turunan Pertama' : `Turunan Orde ${result.order}`}
                  </span>
                  <div className="mt-2"><MathDisplay math={`f^{(${result.order})}(x) = ${result.latex}`} block /></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FunctionGraph expression={result.original} />
                <FunctionGraph expression={result.derivative} />
              </div>

              <div className="bg-indigo-50 p-6 rounded-2xl">
                <h4 className="text-sm font-bold text-indigo-900 mb-3">Penjelasan AI:</h4>
                <div className="prose prose-indigo max-w-none text-indigo-800">
                  <MathDisplay math={result.explanation} block />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-slate-400 text-center">
              Masukkan fungsi untuk melihat hasil turunan, langkah penyelesaian, dan visualisasi grafik fungsi & turunannya.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Derivatives;
