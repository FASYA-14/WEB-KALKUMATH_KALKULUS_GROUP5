
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
          finalValue = volumeVal.toFixed(4);
          resLatex = `V_x = \\pi \\int_{${lower}}^{${upper}} (${math.parse(func).toTex()})^2 \\, dx = ${finalValue}`;
        } else {
          const volumeVal = 2 * Math.PI * numericalIntegrate(`abs(x * (${func}))`, a, b);
          finalValue = volumeVal.toFixed(4);
          resLatex = `V_y = 2\\pi \\int_{${lower}}^{${upper}} x \\cdot |${math.parse(func).toTex()}| \\, dx = ${finalValue}`;
        }
      } else if (calcType === 'area') {
        const areaVal = Math.abs(numericalIntegrate(func, a, b));
        finalValue = areaVal.toFixed(4);
        resLatex = `L = \\int_{${lower}}^{${upper}} |${math.parse(func).toTex()}| \\, dx = ${finalValue}`;
      } else {
        if (isDefinite) {
          const integralVal = numericalIntegrate(func, a, b);
          finalValue = integralVal.toFixed(4);
          resLatex = `\\int_{${lower}}^{${upper}} ${math.parse(func).toTex()} \\, dx = ${finalValue}`;
        } else {
          try {
            resLatex = `\\int ${math.parse(func).toTex()} \\, dx`;
            finalValue = "Hasil + C";
          } catch(e) {
            resLatex = `\\int ${func} \\, dx`;
            finalValue = "Hasil + C";
          }
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
      console.error(e);
      alert("Input tidak valid! Pastikan penulisan fungsi benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight font-heading">Kalkulator Integral & Aplikasi</h2>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">Penyelesaian integral tentu, tak tentu, luas daerah hingga volume benda putar dengan akurasi matematis tinggi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Jenis Operasi</label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: 'integral', label: 'Integral Dasar', icon: '∫' },
                  { id: 'area', label: 'Luas Daerah', icon: '📐' },
                  { id: 'volume', label: 'Volume Benda Putar', icon: '🌪️' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCalcType(item.id as any)}
                    className={`flex items-center gap-4 py-4 px-6 rounded-2xl text-base font-extrabold transition-all border-2 ${
                      calcType === item.id 
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-lg shadow-indigo-100' 
                        : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200 hover:text-slate-600'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Fungsi Matematis</label>
              <input 
                type="text"
                value={func}
                onChange={(e) => setFunc(e.target.value)}
                className="input-modern w-full px-6 py-4 rounded-2xl font-mono text-lg text-indigo-900"
                placeholder="Contoh: x^2 + 5"
              />
            </div>

            {(calcType === 'area' || calcType === 'volume' || isDefinite) && (
              <div className="space-y-4 animate-fadeIn">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Batas Integrasi [a, b]</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">a:</span>
                    <input type="text" value={lower} onChange={(e) => setLower(e.target.value)} className="input-modern w-full pl-10 pr-4 py-4 rounded-2xl font-bold text-slate-700 text-center" />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">b:</span>
                    <input type="text" value={upper} onChange={(e) => setUpper(e.target.value)} className="input-modern w-full pl-10 pr-4 py-4 rounded-2xl font-bold text-slate-700 text-center" />
                  </div>
                </div>
              </div>
            )}

            {calcType === 'integral' && !isDefinite && (
              <label className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl cursor-pointer group hover:bg-indigo-50 transition-colors border border-dashed border-slate-200">
                <input 
                  type="checkbox" 
                  checked={isDefinite} 
                  onChange={(e) => setIsDefinite(e.target.checked)}
                  className="w-6 h-6 text-indigo-600 rounded-lg focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-sm font-extrabold text-slate-600 group-hover:text-indigo-700">Gunakan Batas (Integral Tentu)</span>
              </label>
            )}

            {calcType === 'volume' && (
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Rotasi Sumbu</label>
                <div className="flex gap-3">
                  {['x', 'y'].map((s) => (
                    <button 
                      key={s}
                      onClick={() => setAxis(s as any)} 
                      className={`flex-1 py-4 rounded-2xl font-black text-sm border-2 transition-all ${
                        axis === s 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      Sumbu {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={calculateIntegral}
              disabled={loading}
              className="btn-primary w-full py-5 rounded-2xl text-xl shadow-2xl shadow-indigo-100 mt-4 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Menganalisis...</span>
                </>
              ) : (
                <><span>Hitung Sekarang</span> <span>✨</span></>
              )}
            </button>

            <div className="pt-2 border-t border-slate-50">
              <MathKeypad onInsert={insertAtCursor} />
            </div>
          </div>
        </div>

        {/* Right Content: Results & Graph */}
        <div className="lg:col-span-8 space-y-8">
          {result ? (
            <div className="animate-fadeIn space-y-8">
              <div className="bg-slate-900 p-12 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
                 <div className="relative z-10"><MathDisplay math={result.latex} block /></div>
                 {(isDefinite || calcType !== 'integral') && (
                   <div className="mt-10 pt-8 border-t border-white/10 relative z-10">
                     <span className="block text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Hasil Kalkulasi</span>
                     <div className="text-5xl font-black text-white tracking-tighter drop-shadow-lg font-heading italic">
                       {result.value}
                     </div>
                   </div>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <FunctionGraph expression={result.func} range={[Number(lower) - 3, Number(upper) + 3]} />
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                  <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 font-heading">
                    <span className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl shadow-sm">💡</span> 
                    Penjelasan AI
                  </h4>
                  <div className="text-slate-600 font-medium leading-relaxed prose prose-indigo max-w-none flex-grow">
                    <MathDisplay math={result.explanation} block />
                  </div>
                </div>
              </div>

              {calcType === 'volume' && (
                <div className="bg-indigo-900 text-indigo-100 p-8 rounded-[2.5rem] flex items-start gap-6 shadow-2xl relative overflow-hidden group">
                   <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                   <div className="text-4xl">🌀</div>
                   <div>
                     <h5 className="font-black text-white mb-2 text-base uppercase tracking-widest font-heading">Visualisasi 3D Teoretis</h5>
                     <p className="text-indigo-200/90 text-sm font-medium leading-relaxed">
                       {axis === 'x' 
                         ? "Rotasi terhadap sumbu mendatar menciptakan benda putar simetris. Grafik di samping menunjukkan irisan profil utamanya."
                         : "Rotasi terhadap sumbu vertikal (sumbu Y) dihitung menggunakan metode kulit tabung 2πx⋅f(x)."
                       }
                     </p>
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white border-4 border-dashed border-slate-100 rounded-[4rem] p-16 text-center group transition-all hover:bg-slate-50">
              <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-5xl mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">🔍</div>
              <h3 className="text-3xl font-black text-slate-300 mb-4 font-heading">Siap untuk Menghitung?</h3>
              <p className="text-slate-400 max-w-sm font-semibold text-lg leading-relaxed">Masukkan fungsi dan pilih parameter di panel kiri untuk melihat keajaiban kalkulus terjadi secara instan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Integrals;
