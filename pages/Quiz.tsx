
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
    setCompleted(false);
    setCurrentIdx(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    
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
    <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-fadeIn">
      <div className="relative">
         <div className="w-24 h-24 border-[10px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-indigo-600 font-black text-xl">?</span>
         </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-slate-800 font-black text-2xl font-heading">Menyiapkan Tantangan Baru</p>
        <p className="text-slate-400 font-medium">AI sedang meramu soal kalkulus unik untukmu...</p>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="text-center py-32 space-y-6 bg-white rounded-[3rem] shadow-xl border border-slate-100">
      <div className="text-7xl">📡</div>
      <h2 className="text-2xl font-black text-slate-800">Koneksi API Terganggu</h2>
      <p className="text-slate-500">Gagal mengambil bank soal dari Gemini.</p>
      <button onClick={loadQuestions} className="btn-primary px-10 py-4 rounded-2xl text-white font-bold shadow-lg">Coba Lagi</button>
    </div>
  );

  if (completed) return (
    <div className="max-w-3xl mx-auto bg-white p-16 rounded-[4rem] shadow-2xl text-center space-y-10 border border-slate-100 animate-fadeIn relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
      
      <div className="space-y-4">
        <div className="text-8xl mb-4 drop-shadow-xl">🏆</div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tight font-heading">Kuis Selesai!</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Hasil evaluasi belajar kamu hari ini</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100 shadow-inner">
          <p className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-2">Skor Akhir</p>
          <div className="text-7xl font-black text-indigo-700 font-heading">
            {Math.round((score / questions.length) * 100)}
          </div>
        </div>
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-2">Jawaban Benar</p>
          <div className="text-7xl font-black text-slate-700 font-heading">
            {score}<span className="text-3xl text-slate-300">/{questions.length}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button 
          onClick={loadQuestions}
          className="btn-primary flex-1 py-6 text-white rounded-3xl font-black text-xl shadow-2xl shadow-indigo-200 transition-all hover:scale-[1.02]"
        >
          🔄 Kuis Baru (Soal Berbeda)
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="bg-slate-100 text-slate-600 flex-1 py-6 rounded-3xl font-black text-xl hover:bg-slate-200 transition-all"
        >
          🏠 Kembali ke Beranda
        </button>
      </div>
    </div>
  );

  const q = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn pb-20">
      {/* Progress Header */}
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
           <div className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-xl text-lg">
              {currentIdx + 1}
           </div>
           <div>
              <span className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Progress Latihan</span>
              <div className="flex gap-1.5 mt-1">
                {questions.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIdx ? 'w-8 bg-indigo-600' : i < currentIdx ? 'w-4 bg-emerald-400' : 'w-4 bg-slate-200'}`}></div>
                ))}
              </div>
           </div>
        </div>
        <div className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
          {q.category || 'Kalkulus'}
        </div>
      </div>

      <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border border-indigo-50 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 p-8 text-indigo-50/30 text-9xl font-black pointer-events-none select-none italic">
          #{currentIdx + 1}
        </div>

        {/* Question Area */}
        <div className="mb-16 relative z-10">
          <div className="text-2xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight text-center">
            <MathDisplay math={q.question} block />
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-5 relative z-10">
          {q.options.map((opt: string, i: number) => {
            const isCorrect = opt === q.correctAnswer;
            const isSelected = selected === opt;
            
            let btnClass = "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-indigo-200 hover:bg-white";
            if (showResult) {
              if (isCorrect) btnClass = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-4 ring-emerald-100/50";
              else if (isSelected) btnClass = "border-red-500 bg-red-50 text-red-900 ring-4 ring-red-100/50";
              else btnClass = "border-slate-100 bg-slate-50/30 text-slate-400 opacity-60";
            } else if (isSelected) {
              btnClass = "border-indigo-600 bg-indigo-50 text-indigo-900 ring-4 ring-indigo-100/50";
            }

            return (
              <button
                key={i}
                onClick={() => !showResult && setSelected(opt)}
                disabled={showResult}
                className={`group w-full text-left p-7 rounded-[2.5rem] border-2 transition-all flex items-center gap-6 ${btnClass}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all flex-shrink-0 ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                } ${showResult && isCorrect ? '!bg-emerald-500 !text-white' : ''}
                ${showResult && isSelected && !isCorrect ? '!bg-red-500 !text-white' : ''}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <div className="flex-1 font-bold text-lg md:text-xl"><MathDisplay math={opt} /></div>
                
                {showResult && isCorrect && (
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">✓</div>
                )}
                {showResult && isSelected && !isCorrect && (
                  <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">×</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-16">
          {!showResult ? (
            <button 
              onClick={handleAnswer}
              disabled={!selected}
              className="btn-primary w-full py-6 text-white rounded-[2rem] font-black text-2xl shadow-2xl shadow-indigo-200 disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
            >
              Kunci Jawaban 🎯
            </button>
          ) : (
            <button 
              onClick={nextQuestion}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-2xl hover:bg-slate-800 transition-all shadow-2xl animate-fadeIn"
            >
              {currentIdx === questions.length - 1 ? 'Lihat Skor Akhir 🏁' : 'Soal Berikutnya ➡️'}
            </button>
          )}
        </div>

        {/* Explanation Section */}
        {showResult && (
          <div className="mt-12 p-10 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] shadow-2xl animate-fadeIn border-4 border-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">💡</div>
              <div>
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Analisis Pembahasan</h4>
                <p className="text-white font-black text-lg font-heading">Mengapa jawabannya {q.correctAnswer}?</p>
              </div>
            </div>
            <div className="text-indigo-100 font-medium leading-relaxed bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
              <MathDisplay math={q.explanation} invert />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
