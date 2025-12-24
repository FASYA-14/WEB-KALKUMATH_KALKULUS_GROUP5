
import React, { useState } from 'react';
import * as math from 'mathjs';
import MathDisplay from '../components/MathDisplay';
import FunctionGraph from '../components/FunctionGraph';
import { getMathExplanation } from '../services/geminiService';
import MathKeypad from '../components/MathKeypad';

const Integrals: React.FC = () => {
  const [func, setFunc] = useState('x^2');
  const [isDefinite, setIsDefinite] = useState(false);
  const [calcType, setCalcType] = useState<'integral' | 'area' | 'volume'>('integral');
  const [lower, setLower] = useState('0');
  const [upper, setUpper] = useState('2');
  const [axis, setAxis] = useState<'x' | 'y'>('x');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const insertAtCursor = (value: string) => {
    setFunc(prev => prev + value);
  };

  const calculateIntegral = async () => {
    setLoading(true);
    try {
      let finalValue: any = "";
      let resLatex = "";
      const a = Number(lower);
      const b = Number(upper);
      
      const numericalIntegrate = (fExpr: string, start: number, end: number) => {
        const c = math.compile(fExpr);
        const n = 1000;
        const h = (end - start) / n;
        let sum = c.evaluate({ x: start }) + c.evaluate({ x: end });
        for (let i = 1; i < n; i++) {
          const xVal = start + i * h;
          const val = c.evaluate({ x: xVal });
          sum += (i % 2 === 0 ? 2 : 4) * val;
        }
        return (h / 3 * sum);
      };

      if (calcType === 'volume') {
        if (axis === 'x') {
          const volumeVal = Math.PI * numericalIntegrate(`(${func})^2`, a, b);
          finalValue = volumeVal.toFixed(4).replace(/\.?0+$/, "");
          resLatex = `V_x = \\pi \\int_{${lower}}^{${upper}} (${math.parse(func).toTex()})^2 \\, dx`;
        } else {
          const volumeVal = 2 * Math.PI * numericalIntegrate(`abs(x * (${func}))`, a, b);
          finalValue = volumeVal.toFixed(4).replace(/\.?0+$/, "");
          resLatex = `V_y = 2\\pi \\int_{${lower}}^{${upper}} x \\cdot |${math.parse(func).toTex()}| \\, dx`;
        }
      } else if (calcType === 'area') {
        const areaVal = Math.abs(numericalIntegrate(func, a, b));
        finalValue = areaVal.toFixed(4).replace(/\.?0+$/, "");
        resLatex = `L = \\int_{${lower}}^{${upper}} |${math.parse(func).toTex()}| \\, dx`;
      } else {
        if (isDefinite) {
          const integralVal = numericalIntegrate(func, a, b);
          finalValue = integralVal.toFixed(4).replace(/\.?0+$/, "");
          resLatex = `\\int_{${lower}}^{${upper}} ${math.parse(func).toTex()} \\, dx`;
        } else {
          resLatex = `\\int ${math.parse(func).toTex()} \\, dx`;
          finalValue = "Hasil + C";
        }
      }

      const aiExp = await getMathExplanation(
        calcType === 'volume' ? `Volume Benda Putar (Sumbu ${axis.toUpperCase()})` : calcType === 'area' ? 'Luas Daerah' : 'Integral', 
        resLatex, 
        { func, calcType, lower, upper, axis }
      );
      
      setResult({ 
        value: finalValue, 
        latex: resLatex, 
        explanation: aiExp,
        func
      });
    } catch (e) {
      alert("Input tidak valid! Pastikan penulisan fungsi benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => window.history.back()} className="text-indigo-400 hover:text-indigo-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-4xl font-black text-[#7c3aed] tracking-tight font-heading">Integral & Aplikasi</h2>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-50 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Operasi</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'integral', label: 'Integral', icon: '∫' },
                { id: 'area', label: 'Luas', icon: '📐' },
                { id: 'volume', label: 'Volume', icon: '🌪️' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCalcType(item.id as any)}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all ${
                    calcType === item.id ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-lg shadow-indigo-100' : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
            
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fungsi f(x)</label>
              <input 
                type="text"
                value={func}
                onChange={(e) => setFunc(e.target.value)}
                className="input-modern w-full px-8 py-5 rounded-2xl font-mono text-xl text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Parameter Integrasi</label>
            {(calcType !== 'integral' || isDefinite) && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Batas Bawah (a)</label>
                  <input type="text" value={lower} onChange={(e) => setLower(e.target.value)} className="input-modern w-full px-6 py-4 rounded-2xl font-bold text-slate-700 text-center" />
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Batas Atas (b)</label>
                  <input type="text" value={upper} onChange={(e) => setUpper(e.target.value)} className="input-modern w-full px-6 py-4 rounded-2xl font-bold text-slate-700 text-center" />
                </div>
              </div>
            )}
            {calcType === 'integral' && (
              <label className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-colors border-2 border-dashed border-slate-200">
                <input type="checkbox" checked={isDefinite} onChange={(e) => setIsDefinite(e.target.checked)} className="w-6 h-6 rounded-lg text-indigo-600" />
                <span className="text-sm font-black text-slate-600">Aktifkan Batas (Integral Tentu)</span>
              </label>
            )}
            {calcType === 'volume' && (
              <div className="flex gap-4">
                {['x', 'y'].map(s => (
                  <button key={s} onClick={() => setAxis(s as any)} className={`flex-1 py-4 rounded-2xl font-black text-sm border-2 transition-all ${axis === s ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>Sumbu {s.toUpperCase()}</button>
                ))}
              </div>
            )}
            <button 
              onClick={calculateIntegral}
              disabled={loading}
              className="btn-primary w-full py-6 rounded-3xl text-xl text-white font-black shadow-2xl flex items-center justify-center gap-4 mt-2"
            >
              {loading ? <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>Hitung Sekarang</span>}
            </button>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-50">
          <MathKeypad onInsert={insertAtCursor} />
        </div>
      </div>

      {result && (
        <div className="space-y-12 animate-fadeIn">
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-800 font-heading pl-4">Visualisasi Integrasi</h3>
            <FunctionGraph expression={result.func} range={[Number(lower) - 3, Number(upper) + 3]} mode={calcType === 'volume' ? 'volume' : 'normal'} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-8">
              <h3 className="text-2xl font-black text-slate-800 font-heading pl-4">Langkah-Langkah Solusi</h3>
              <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-50 space-y-10">
                <div className="text-slate-500 font-medium leading-relaxed bg-[#f5f3ff] p-8 rounded-3xl border border-purple-100 italic">
                   {result.explanation.split('Langkah 1:')[0]}
                </div>
                
                <div className="space-y-8">
                  {result.explanation.split('Langkah ').slice(1).map((step: string, i: number) => {
                    const [title, ...content] = step.split(':');
                    return (
                      <div key={i} className="flex gap-6 animate-fadeIn">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xl shadow-sm">
                          {i + 1}
                        </div>
                        <div className="space-y-3 pt-2">
                          <h4 className="font-black text-slate-800 text-xl leading-snug">Langkah {title}</h4>
                          <div className="text-slate-600 font-medium leading-relaxed prose max-w-none">
                            <MathDisplay math={content.join(':')} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-8">
              <h3 className="text-2xl font-black text-slate-800 font-heading pl-4 opacity-0">Hasil</h3>
              <div className="bg-purple-50 p-10 rounded-[3rem] shadow-xl border border-purple-100 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px] sticky top-32">
                 <span className="text-xs font-black text-purple-600 uppercase tracking-[0.4em]">Hasil Kalkulasi</span>
                 <div className="text-4xl md:text-5xl font-black text-purple-900 tracking-tighter font-heading italic">
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

export default Integrals;
