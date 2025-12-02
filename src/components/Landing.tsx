
import React from 'react';
import { ViewState } from '../types';
import { Wrench, Bot, Hammer, BookOpen, LogIn } from 'lucide-react';
import Logo from './Logo';

interface LandingProps {
  onNavigate: (view: ViewState) => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  
  const floatingWords = [
    { text: 'HONESTY', top: '10%', left: '10%', delay: '0s', duration: '4s' },
    { text: 'SPEED', top: '20%', left: '80%', delay: '1s', duration: '5s' },
    { text: 'POWER', top: '70%', left: '15%', delay: '2s', duration: '6s' },
    { text: 'SERVICE', top: '80%', left: '70%', delay: '0.5s', duration: '4.5s' },
    { text: 'COMMITMENT', top: '40%', left: '5%', delay: '3s', duration: '7s' },
    { text: 'QUALITY', top: '15%', left: '60%', delay: '1.5s', duration: '5.5s' },
    { text: 'TRUST', top: '60%', left: '85%', delay: '2.5s', duration: '6.5s' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      
      {/* --- BACKGROUND WORDS --- */}
      {floatingWords.map((word, index) => (
        <div 
          key={index}
          className="absolute text-slate-700/10 font-black text-4xl md:text-6xl select-none pointer-events-none z-0"
          style={{ 
            top: word.top, 
            left: word.left, 
            animation: `floatWord ${word.duration} infinite alternate`
          }}
        >
          {word.text}
        </div>
      ))}

      {/* --- BACKGROUND TEXTURE --- */}
      <div className="absolute inset-0 bg-slate-950 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
      </div>

      <style>{`
        @keyframes floatWord { 0% { opacity: 0; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0.9); } }
        
        .animate-fade-in { animation: fadeIn 2s ease-out forwards; animation-delay: 0.5s; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* --- CONTENT --- */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
        
        {/* Logo - Moved Higher */}
        <div className="mb-12 transform hover:scale-105 transition-transform duration-500">
          <Logo size="xl" variant="light" />
        </div>

        {/* DIAMOND LAYOUT CONTAINER - Larger Buttons */}
        <div className="relative p-8 mb-12">
           <div className="grid grid-cols-2 gap-2 transform rotate-45 scale-95 md:scale-100">
              
              {/* 1. TOP: New Ticket (Red) */}
              <button 
                onClick={() => onNavigate('PUBLIC_NEW_TICKET')}
                className="group w-28 h-28 md:w-36 md:h-36 bg-slate-800/90 backdrop-blur-md border border-red-500/30 rounded-3xl hover:bg-red-600 hover:border-red-400 hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all duration-300 flex items-center justify-center relative overflow-hidden shadow-2xl"
              >
                <div className="transform -rotate-45 flex flex-col items-center justify-center text-center">
                  <Wrench className="text-red-500 group-hover:text-white mb-2 w-8 h-8 md:w-10 md:h-10 transition-colors" />
                  <span className="text-white font-bold text-xs md:text-sm leading-tight">ثبت<br/>خرابی</span>
                </div>
              </button>

              {/* 2. RIGHT: Knowledge Base (Green) */}
              <button 
                onClick={() => onNavigate('PUBLIC_TRAINING')}
                className="group w-28 h-28 md:w-36 md:h-36 bg-slate-800/90 backdrop-blur-md border border-emerald-500/30 rounded-3xl hover:bg-emerald-600 hover:border-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300 flex items-center justify-center relative overflow-hidden shadow-2xl"
              >
                <div className="transform -rotate-45 flex flex-col items-center justify-center text-center">
                  <BookOpen className="text-emerald-500 group-hover:text-white mb-2 w-8 h-8 md:w-10 md:h-10 transition-colors" />
                  <span className="text-white font-bold text-xs md:text-sm leading-tight">پایگاه<br/>دانش</span>
                </div>
              </button>

              {/* 3. LEFT: AI Support (Blue) */}
              <button 
                onClick={() => onNavigate('PUBLIC_AI_SUPPORT')}
                className="group w-28 h-28 md:w-36 md:h-36 bg-slate-800/90 backdrop-blur-md border border-blue-500/30 rounded-3xl hover:bg-blue-600 hover:border-blue-400 hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all duration-300 flex items-center justify-center relative overflow-hidden shadow-2xl"
              >
                <div className="transform -rotate-45 flex flex-col items-center justify-center text-center">
                  <Bot className="text-blue-500 group-hover:text-white mb-2 w-8 h-8 md:w-10 md:h-10 transition-colors" />
                  <span className="text-white font-bold text-xs md:text-sm leading-tight">هوش<br/>مصنوعی</span>
                </div>
              </button>

              {/* 4. BOTTOM: Renovation (Amber) */}
              <button 
                onClick={() => onNavigate('PUBLIC_RENOVATION')}
                className="group w-28 h-28 md:w-36 md:h-36 bg-slate-800/90 backdrop-blur-md border border-amber-500/30 rounded-3xl hover:bg-amber-600 hover:border-amber-400 hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all duration-300 flex items-center justify-center relative overflow-hidden shadow-2xl"
              >
                <div className="transform -rotate-45 flex flex-col items-center justify-center text-center">
                  <Hammer className="text-amber-500 group-hover:text-white mb-2 w-8 h-8 md:w-10 md:h-10 transition-colors" />
                  <span className="text-white font-bold text-xs md:text-sm leading-tight">بازسازی<br/>آسانسور</span>
                </div>
              </button>

           </div>
        </div>

        {/* Staff Login Link */}
        <button 
          onClick={() => onNavigate('LOGIN')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-medium py-2 px-6 rounded-full border border-slate-800 hover:border-slate-600 hover:bg-slate-800 backdrop-blur-sm mt-2 z-30"
        >
          <LogIn size={14} />
          <span>ورود پرسنل شرکت</span>
        </button>

        <div className="mt-8 text-center opacity-40">
            <p className="text-[9px] text-slate-500 tracking-wider">PAR SANAT SOUD SUPPORT SYSTEM v3.3</p>
        </div>

      </div>
    </div>
  );
};

export default Landing;
