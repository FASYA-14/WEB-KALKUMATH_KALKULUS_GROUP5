
import React, { useState } from 'react';
import { CalculatorType } from './types';
import Home from './pages/Home';
import RealNumbers from './pages/RealNumbers';
import Limits from './pages/Limits';
import Derivatives from './pages/Derivatives';
import Integrals from './pages/Integrals';
import Quiz from './pages/Quiz';
import LiveTutor from './components/LiveTutor';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<CalculatorType | 'home'>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onStart={(type) => setCurrentPage(type)} />;
      case 'real': return <RealNumbers />;
      case 'limit': return <Limits />;
      case 'derivative': return <Derivatives />;
      case 'integral': return <Integrals />;
      case 'quiz': return <Quiz />;
      default: return <Home onStart={(type) => setCurrentPage(type)} />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Beranda', icon: '🏠' },
    { id: 'real', label: 'Bilangan Real', icon: '🔢' },
    { id: 'limit', label: 'Limit', icon: '📉' },
    { id: 'derivative', label: 'Turunan', icon: '📈' },
    { id: 'integral', label: 'Integral', icon: '∫' },
    { id: 'quiz', label: 'Kuis', icon: '📝' },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900 bg-[#fbfcfe]">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-purple-100/30 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-2xl border-b border-slate-100 sticky top-0 z-[60] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 md:gap-4 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="btn-primary w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white group-hover:rotate-12 transition-all shadow-xl shadow-indigo-200">
              <span className="text-lg md:text-xl font-black">KM</span>
            </div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors font-heading">
              KALKUMATH
            </h1>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as any)}
                className={`text-[13px] font-extrabold transition-all relative py-2 tracking-widest uppercase ${
                  currentPage === item.id 
                  ? 'text-indigo-600' 
                  : 'text-slate-400 hover:text-indigo-500'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></span>
                )}
              </button>
            ))}
          </nav>

          <div className="lg:hidden">
            <select 
              className="bg-slate-50 border-2 border-slate-100 text-xs font-black text-slate-700 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-50 outline-none"
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value as any)}
            >
              {navItems.map(item => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 md:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderPage()}
        </div>
      </main>

      {/* Live AI Tutor Button */}
      <LiveTutor />

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 md:py-24 mt-auto border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24">
            <div className="col-span-1 lg:col-span-2 space-y-8 md:space-y-10">
              <div className="flex items-center gap-3">
                 <div className="bg-indigo-600 w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-indigo-500/30">K</div>
                 <h3 className="text-white text-2xl md:text-3xl font-black tracking-tight font-heading">KALKUMATH</h3>
              </div>
              <p className="max-w-md text-slate-400 text-base md:text-lg leading-relaxed font-medium">
                Platform pendamping belajar kalkulus terbaik yang menggabungkan presisi matematis dengan estetika desain modern. Dirancang khusus untuk mempermudah eksplorasi matematika mahasiswa.
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                 <div className="px-4 md:px-6 py-2 md:py-3 bg-white/5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-[0.2em] border border-white/5 shadow-inner">Kelompok 5</div>
                 <div className="px-4 md:px-6 py-2 md:py-3 bg-white/5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-[0.2em] border border-white/5 shadow-inner">Pendidikan Ilmu Komputer 1-A</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-black mb-6 md:mb-10 text-[10px] md:text-xs uppercase tracking-[0.4em] text-indigo-400">Anggota Tim</h4>
              <ul className="text-xs md:text-sm space-y-4 md:space-y-5 font-bold">
                {[
                  { name: "Yahfasyat Asabir Abuya", nim: "2502231" },
                  { name: "Moh. Raditya Ridwansyah", nim: "2501015" },
                  { name: "Deden Ahmad Jamil", nim: "2501518" },
                  { name: "Evita Candra Prawita Sari", nim: "2500312" },
                  { name: "Neng Siti Nurparidah", nim: "2502125" }
                ].map((member, i) => (
                  <li key={i} className="hover:text-white transition-colors flex flex-col gap-1 group cursor-default">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full group-hover:scale-150 transition-transform"></span>
                      {member.name}
                    </span>
                    <span className="text-[10px] md:text-xs text-slate-600 ml-3.5 group-hover:text-indigo-400 transition-colors">NIM: {member.nim}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black mb-6 md:mb-10 text-[10px] md:text-xs uppercase tracking-[0.4em] text-indigo-400">Eksplorasi</h4>
              <ul className="text-xs md:text-sm space-y-4 md:space-y-5 font-bold">
                <li><button onClick={() => setCurrentPage('real')} className="hover:text-white flex items-center gap-3 group transition-all">
                  <span className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all text-lg">🔢</span> 
                  Bilangan Real
                </button></li>
                <li><button onClick={() => setCurrentPage('limit')} className="hover:text-white flex items-center gap-3 group transition-all">
                  <span className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all text-lg">📉</span> 
                  Limit Fungsi
                </button></li>
                <li><button onClick={() => setCurrentPage('derivative')} className="hover:text-white flex items-center gap-3 group transition-all">
                  <span className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all text-lg">📈</span> 
                  Turunan Orde
                </button></li>
                <li><button onClick={() => setCurrentPage('integral')} className="hover:text-white flex items-center gap-3 group transition-all">
                  <span className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all text-lg">∫</span> 
                  Integral & Volume
                </button></li>
                <li><button onClick={() => setCurrentPage('quiz')} className="hover:text-white flex items-center gap-3 group transition-all">
                  <span className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all text-lg">📝</span> 
                  Kuis Interaktif
                </button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-16 md:mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs font-bold tracking-tight text-slate-500 text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} Tim KALKUMATH - Kelompok 5. Dibuat dengan presisi untuk Keunggulan Akademik.</p>
            <div className="flex gap-6 md:gap-10">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="hover:text-indigo-400 transition-colors">Info Tagihan</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Dokumentasi</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Privasi</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
