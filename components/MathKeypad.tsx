
import React from 'react';

interface MathKeypadProps {
  onInsert: (value: string) => void;
}

const MathKeypad: React.FC<MathKeypadProps> = ({ onInsert }) => {
  const keys = [
    { label: 'x', value: 'x' },
    { label: 'y', value: 'y' },
    { label: 'π', value: 'pi' },
    { label: 'e', value: 'e' },
    { label: '^', value: '^' },
    { label: '√', value: 'sqrt(' },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: 'sin', value: 'sin(' },
    { label: 'cos', value: 'cos(' },
    { label: 'tan', value: 'tan(' },
    { label: 'log', value: 'log(' },
    { label: 'exp', value: 'exp(' },
    { label: 'abs', value: 'abs(' },
    { label: '+', value: '+' },
    { label: '-', value: '-' },
    { label: '×', value: '*' },
    { label: '÷', value: '/' },
  ];

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-6 sm:grid-cols-9 gap-2 mt-4">
      {keys.map((key, idx) => (
        <button
          key={idx}
          onClick={() => onInsert(key.value)}
          className="keypad-btn shadow-sm"
        >
          {key.label}
        </button>
      ))}
    </div>
  );
};

export default MathKeypad;
