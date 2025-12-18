
import React from 'react';
import { CalculatorType } from '../types';

interface HomeProps {
  onStart: (type: CalculatorType) => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const cards = [
    {
      id: 'real' as CalculatorType,
      title: 'Bilangan Real',
      desc: 'Operasi dasar, nilai mutlak, dan analisis sifat bilangan rasional maupun irasional.',
      icon: '🔢',
      color: 'from-blue-500 to-indigo-400',
      shadow: 'shadow-blue-200'
    },
    {
      id: 'limit' as CalculatorType,
      title: 'Limit Fungsi',
      desc: 'Analisis perilaku fungsi mendekati titik tertentu, limit sepihak, dan limit tak hingga.',
      icon: '📉',
      color: 'from-violet-500 to-purple-400',
      shadow: 'shadow-violet-200'
    },
    {
      id: 'derivative' as CalculatorType,
      title: 'Turunan',
      desc: 'Hitung turunan pertama hingga orde tinggi secara akurat dengan langkah penyelesaian.',
      icon: '📈',
      color: 'from-indigo-600 to-blue-500',
      shadow: 'shadow-indigo-200'
    },
    {
      id: 'integral' as CalculatorType,
      title: 'Integral',
      desc: 'Integral tentu, tak tentu, luas daerah, hingga perhitungan volume benda putar.',
      icon: '∫',
      color: 'from-fuchsia-600 to-pink-500',
      shadow: 'shadow-fuchsia-200'
    },
    {
      id: 'quiz' as CalculatorType,
      title: 'Kuis & Latihan',
      desc: 'Uji pemahamanmu dengan simulasi soal UTS dan kuis interaktif yang menantang.',
      icon: '📝',
      color: 'from-amber-500 to-orange-400',
      shadow: 'shadow-amber-200'
    }
  ];

  return (
    <div className="space-y-32 py-12 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center space-y-10 max-w-5xl mx-auto px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-indigo-50/50 rounded-full blur-[120px] -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-100/80 backdrop-blur-sm text-indigo-700 rounded-full text-xs font-bold tracking-widest mb-6 border border-indigo-200/50 uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Solusi Kalkulus Buat Para Mahasiswa
        </div>
        
        <h2 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05] text-slate-900 font-heading">
          Kuasai Kalkulus dengan <br />
          <span className="gradient-text italic">Desain Interaktif</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-3xl mx-auto font-medium">
          KALKUMATH menggabungkan kecerdasan buatan, visualisasi real-time, dan antarmuka intuitif untuk membantumu menaklukkan setiap tantangan matematika.
        </p>
        
        <div className="pt-10 flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button 
            onClick={() => onStart('real')}
            className="btn-primary px-12 py-6 text-white rounded-3xl font-extrabold text-xl w-full sm:w-auto shadow-2xl shadow-indigo-200"
          >
            Mulai Belajar
          </button>
          <button 
            onClick={() => onStart('quiz')}
            className="px-12 py-6 bg-white text-slate-700 border border-slate-200 rounded-3xl font-extrabold text-xl w-full sm:w-auto hover:bg-slate-50 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-3"
          >
            <span>Latihan Soal</span>
            <span className="text-2xl">📝</span>
          </button>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {cards.map((card) => (
          <div 
            key={card.id}
            onClick={() => onStart(card.id)}
            className="bg-white p-12 rounded-[3rem] border border-slate-100 card-modern cursor-pointer group relative overflow-hidden flex flex-col h-full"
          >
            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${card.color} opacity-[0.03] rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700`}></div>
            
            <div className={`bg-gradient-to-br ${card.color} w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl text-white mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-2xl ${card.shadow}`}>
              {card.icon}
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-5 tracking-tight font-heading">{card.title}</h3>
            <p className="text-slate-500 mb-10 leading-relaxed font-medium text-lg flex-grow">{card.desc}</p>
            
            <div className="flex items-center text-indigo-600 font-extrabold text-lg group-hover:translate-x-3 transition-transform">
              Buka Materi <span className="ml-3 text-2xl">→</span>
            </div>
          </div>
        ))}
      </section>

      {/* Info Section */}
      <section className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-3xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full -mr-250 -mt-250 blur-[120px]"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-12">
            <h3 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] font-heading">Kenapa Memilih <br/><span className="gradient-text">KALKUMATH?</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: "Penjelasan AI Pintar", text: "Dapatkan solusi langkah-demi-langkah yang dipersonalisasi oleh AI." },
                { title: "Grafik Dinamis", text: "Visualisasikan fungsi matematika secara instan dengan grafik interaktif." },
                { title: "Fokus Mahasiswa", text: "Kurikulum yang disesuaikan untuk mahasiswa Ilmu Komputer tingkat awal." },
                { title: "Siap Ujian", text: "Persiapkan dirimu menghadapi UTS dengan bank soal yang menantang." }
              ].map((item, i) => (
                <div key={i} className="space-y-3 group">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-indigo-400 border border-white/10 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    {i+1}
                  </div>
                  <h4 className="font-bold text-xl">{item.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-3xl p-1 rounded-[4rem] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
               <div className="bg-white rounded-[3.8rem] p-10 space-y-8 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-slate-100 rounded-full"></div>
                      <div className="w-20 h-3 bg-slate-50 rounded-full"></div>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">✨</div>
                  </div>
                  <div className="h-64 w-full bg-indigo-50/30 rounded-[2.5rem] border-2 border-dashed border-indigo-100 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center animate-bounce">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full opacity-40"></div>
                    </div>
                    <span className="text-indigo-600 font-black mt-6 tracking-widest text-xs uppercase">Menganalisis Fungsi</span>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-full bg-slate-50 rounded-full"></div>
                    <div className="h-4 w-4/5 bg-slate-50 rounded-full"></div>
                    <div className="h-4 w-2/3 bg-slate-50 rounded-full"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
