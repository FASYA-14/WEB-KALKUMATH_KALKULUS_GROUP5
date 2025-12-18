
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import * as math from 'mathjs';

interface FunctionGraphProps {
  expression: string;
  range?: [number, number];
  points?: number;
}

const FunctionGraph: React.FC<FunctionGraphProps> = ({ expression, range = [-10, 10], points = 100 }) => {
  const generateData = () => {
    const data = [];
    const step = (range[1] - range[0]) / points;
    
    try {
      const node = math.parse(expression);
      const compiled = node.compile();

      for (let x = range[0]; x <= range[1]; x += step) {
        try {
          const y = compiled.evaluate({ x });
          if (typeof y === 'number' && isFinite(y)) {
            data.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
          }
        } catch (e) {
          // Skip points where function is undefined
        }
      }
    } catch (e) {
      return [];
    }
    return data;
  };

  const data = generateData();

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-100 rounded-3xl text-slate-400 italic font-medium border border-slate-200">
        Grafik tidak dapat ditampilkan untuk ekspresi ini.
      </div>
    );
  }

  return (
    <div className="h-80 w-full bg-white p-6 rounded-[2rem] shadow-xl shadow-indigo-50 border border-indigo-50">
      <h4 className="text-sm font-bold text-slate-500 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
        Visualisasi f(x) = {expression}
      </h4>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={['auto', 'auto']} 
            tick={{fontSize: 11, fill: '#94a3b8'}}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            type="number" 
            domain={['auto', 'auto']} 
            tick={{fontSize: 11, fill: '#94a3b8'}}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
            labelFormatter={(val) => `x: ${val}`}
          />
          <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
          <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={1} />
          <Area 
            type="monotone" 
            dataKey="y" 
            stroke="#8b5cf6" 
            fill="url(#colorY)"
            strokeWidth={3} 
            dot={false} 
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunctionGraph;
