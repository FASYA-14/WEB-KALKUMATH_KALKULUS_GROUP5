
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import * as math from 'mathjs';

interface FunctionGraphProps {
  expression: string;
  range?: [number, number];
  points?: number;
  mode?: 'normal' | 'volume';
}

const FunctionGraph: React.FC<FunctionGraphProps> = ({ expression, range = [-10, 10], points = 100, mode = 'normal' }) => {
  const data = useMemo(() => {
    const plotData = [];
    const step = (range[1] - range[0]) / points;
    
    try {
      const node = math.parse(expression);
      const compiled = node.compile();

      for (let x = range[0]; x <= range[1]; x += step) {
        try {
          const y = compiled.evaluate({ x });
          if (typeof y === 'number' && isFinite(y)) {
            if (mode === 'volume') {
              plotData.push({ 
                x: Number(x.toFixed(2)), 
                y: Number(y.toFixed(2)),
                y_neg: -Number(y.toFixed(2)) 
              });
            } else {
              plotData.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
            }
          }
        } catch (e) {
          // Skip undefined points
        }
      }
    } catch (e) {
      return [];
    }
    return plotData;
  }, [expression, range, points, mode]);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-50 rounded-[2rem] text-slate-400 italic font-medium border-2 border-dashed border-slate-200">
        Grafik tidak dapat dimuat (Ekspresi tidak valid)
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col min-h-[350px] transition-all duration-500 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xs font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          {mode === 'volume' ? 'Irisan Benda Putar' : 'Visualisasi Fungsi'}
        </h4>
        <div className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-tighter">
          f(x) = {expression}
        </div>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAreaNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="x" 
              type="number" 
              domain={['auto', 'auto']} 
              tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              type="number" 
              domain={['auto', 'auto']} 
              tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: 'bold' }}
            />
            <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
            <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={1} />
            
            <Area 
              type="monotone" 
              dataKey="y" 
              stroke="#4f46e5" 
              fill="url(#colorArea)"
              strokeWidth={3} 
              dot={false}
              isAnimationActive={true}
            />
            {mode === 'volume' && (
              <Area 
                type="monotone" 
                dataKey="y_neg" 
                stroke="#f43f5e" 
                fill="url(#colorAreaNeg)"
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive={true}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FunctionGraph;
