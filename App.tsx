
import React, { useState } from 'react';
import { CalculatorType } from './types';
import Home from './pages/Home';
import RealNumbers from './pages/RealNumbers';
import Limits from './pages/Limits';
import Derivatives from './pages/Derivatives';
import Integrals from './pages/Integrals';
import Quiz from './pages/Quiz';

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
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-2xl border-b border-slate-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="gradient-bg w-12 h-12 rounded-2xl flex items-center justify-center text-white group-hover:rotate-12 transition-all shadow-xl shadow-indigo-200">
              <span className="text-xl font-black">KM</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors font-heading">
              KALKUMATH
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as any)}
                className={`text-sm font-extrabold transition-all relative py-2 tracking-widest uppercase ${
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

          <div className="md:hidden">
            <select 
              className="bg-slate-50 border-2 border-slate-100 text-sm font-black text-slate-700 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-indigo-50 outline-none"
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
      <main className="flex-1 py-12 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderPage()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-24 mt-auto border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24">
            <div className="col-span-1 lg:col-span-2 space-y-10">
              <div className="flex items-center gap-3">
                 <div className="bg-indigo-600 w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">K</div>
                 <h3 className="text-white text-3xl font-black tracking-tight font-heading">KALKUMATH</h3>
              </div>
              <p className="max-w-md text-slate-400 text-lg leading-relaxed font-medium">
                Platform pendamping belajar kalkulus terbaik yang menggabungkan presisi matematis dengan estetika desain modern. Dirancang oleh mahasiswa untuk kemudahan belajar.
              </p>
              <div className="flex flex-wrap gap-4">
                 <div className="px-6 py-3 bg-white/5 rounded-2xl text-xs font-black text-slate-300 uppercase tracking-[0.2em] border border-white/5 shadow-inner">Kelompok 5</div>
                 <div className="px-6 py-3 bg-white/5 rounded-2xl text-xs font-black text-slate-300 uppercase tracking-[0.2em] border border-white/5 shadow-inner">Pendidikan Ilmu Komputer 1-A</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-black mb-10 text-xs uppercase tracking-[0.4em] text-indigo-400">Anggota Tim</h4>
              <ul className="text-sm space-y-5 font-bold">
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
                    <span className="text-xs text-slate-600 ml-3.5 group-hover:text-indigo-400 transition-colors">NIM: {member.nim}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black mb-10 text-xs uppercase tracking-[0.4em] text-indigo-400">Eksplorasi</h4>
              <ul className="text-sm space-y-5 font-bold">
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
          <div className="border-t border-white/5 mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-bold tracking-tight text-slate-500">
            <p>&copy; {new Date().getFullYear()} Tim KALKUMATH. Dibuat untuk Keunggulan Akademik.</p>
            <div className="flex gap-10">
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
