
import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import MathDisplay from '../components/MathDisplay';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const qs = await generateQuizQuestions();
      if (qs && qs.length > 0) {
        setQuestions(qs);
      } else {
        throw new Error("No questions returned");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleAnswer = () => {
    if (!selected || !questions[currentIdx]) return;
    
    const correct = questions[currentIdx].correctAnswer === selected;
    if (correct) setScore(s => s + 1);
    
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-6 animate-pulse">
      <div className="relative">
         <div className="w-20 h-20 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-indigo-600 font-black">?</span>
         </div>
      </div>
      <p className="text-slate-500 font-bold text-lg">Membangun bank soal kalkulus...</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="text-center py-32 space-y-6">
      <div className="text-6xl">⚠️</div>
      <h2 className="text-2xl font-black text-slate-800">Gagal memuat kuis</h2>
      <button onClick={loadQuestions} className="btn-primary px-8 py-3 rounded-xl text-white font-bold">Coba Lagi</button>
    </div>
  );

  if (completed) return (
    <div className="max-w-2xl mx-auto bg-white p-16 rounded-[3rem] shadow-2xl text-center space-y-8 border border-slate-100 animate-fadeIn relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
      <div className="text-7xl">🎓</div>
      <h2 className="text-4xl font-black text-slate-900 tracking-tight font-heading">Kuis Selesai!</h2>
      <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">Akurasi Kamu</p>
        <div className="text-7xl font-black gradient-text">
          {Math.round((score / questions.length) * 100)}%
        </div>
        <p className="mt-6 text-slate-600 font-medium">Kamu berhasil menjawab <span className="text-indigo-600 font-black">{score}</span> dari <span className="font-black">{questions.length}</span> soal.</p>
      </div>
      <button 
        onClick={() => {
          setCompleted(false);
          setCurrentIdx(0);
          setScore(0);
          loadQuestions();
        }}
        className="btn-primary w-full py-5 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-100"
      >
        Mulai Kuis Baru
      </button>
    </div>
  );

  const q = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
           <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-lg">
              {currentIdx + 1}
           </div>
           <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Soal Ke {currentIdx + 1} dari {questions.length}</span>
        </div>
        <div className="px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 text-xs font-bold text-indigo-600 shadow-sm">
          {q.category || 'Kalkulus'}
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-indigo-50 relative">
        <div className="mb-12 min-h-[100px] flex items-center justify-center text-center">
          <div className="text-2xl md:text-3xl font-black text-slate-900 leading-[1.3] tracking-tight w-full">
            <MathDisplay math={q.question} block />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {q.options.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => !showResult && setSelected(opt)}
              disabled={showResult}
              className={`group w-full text-left p-6 rounded-3xl border-2 transition-all flex items-center gap-6 ${
                selected === opt 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-4 ring-indigo-50' 
                  : 'border-slate-50 bg-slate-50/50 text-slate-700 hover:border-slate-200 hover:bg-white'
              } ${showResult && opt === q.correctAnswer ? '!border-emerald-500 !bg-emerald-50 !text-emerald-900 !ring-emerald-50' : ''}
              ${showResult && selected === opt && opt !== q.correctAnswer ? '!border-red-500 !bg-red-50 !text-red-900 !ring-red-50' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg transition-colors flex-shrink-0 ${
                selected === opt ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'
              } ${showResult && opt === q.correctAnswer ? '!bg-emerald-500 !text-white' : ''}
              ${showResult && selected === opt && opt !== q.correctAnswer ? '!bg-red-500 !text-white' : ''}`}>
                {String.fromCharCode(65 + i)}
              </div>
              <div className="flex-1 font-bold text-lg"><MathDisplay math={opt} /></div>
              {showResult && opt === q.correctAnswer && <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">✓</span>}
              {showResult && selected === opt && opt !== q.correctAnswer && <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">×</span>}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {!showResult ? (
            <button 
              onClick={handleAnswer}
              disabled={!selected}
              className="btn-primary w-full py-5 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 disabled:opacity-50"
            >
              Kunci Jawaban
            </button>
          ) : (
            <button 
              onClick={nextQuestion}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl"
            >
              {currentIdx === questions.length - 1 ? 'Selesaikan Kuis' : 'Soal Berikutnya'}
            </button>
          )}
        </div>

        {showResult && (
          <div className="mt-10 p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 animate-fadeIn">
            <h4 className="text-xs font-black text-indigo-900 mb-4 uppercase tracking-[0.2em]">Penjelasan Materi</h4>
            <div className="text-indigo-800 font-medium leading-relaxed bg-white p-6 rounded-2xl shadow-sm border border-white">
              <MathDisplay math={q.explanation} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
