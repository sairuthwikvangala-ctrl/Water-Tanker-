
import React, { useState, useEffect } from 'react';

interface HomePageProps {
  onNavigate: (page: number) => void;
  orderCount: number;
  promoCode: string | null;
  setPromoCode: (code: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, orderCount, promoCode, setPromoCode }) => {
  const [isDrivingAway, setIsDrivingAway] = useState(false);
  const currentProgress = (orderCount % 10) === 0 && orderCount > 0 ? 10 : (orderCount % 10);
  const progressPercent = (currentProgress / 10) * 100;
  const isFull = currentProgress === 10 && !promoCode;

  const handleClaim = () => {
    setIsDrivingAway(true);
    setTimeout(() => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setPromoCode(code);
      setIsDrivingAway(false);
    }, 1500);
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark transition-colors duration-200 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col items-center pt-8 px-6 shrink-0 z-20">
        <h1 className="font-serif-display text-4xl font-bold italic text-slate-900 dark:text-white mb-4">
          Your tanker
        </h1>
        
        <div className="flex gap-3 w-full max-w-sm justify-center">
          <button onClick={() => onNavigate(5)} className="flex items-center gap-2 px-4 h-10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-md border border-slate-200/50 text-xs font-bold active:scale-95 transition-all">
            <span className="material-symbols-outlined text-primary text-lg">history</span>
            <span>History</span>
          </button>
          <button onClick={() => onNavigate(10)} className="flex items-center gap-2 px-4 h-10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-md border border-slate-200/50 text-xs font-bold active:scale-95 transition-all">
            <span className="material-symbols-outlined text-primary text-lg">account_circle</span>
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Hero / Progress Area */}
      <div className="flex-1 min-h-0 flex flex-row items-center justify-center px-4 sm:px-10 gap-2 sm:gap-6 relative overflow-visible z-10 py-2">
        
        {/* Tanker */}
        <div className={`relative flex-1 h-full max-h-[35vh] transition-all duration-[1500ms] ease-in-out transform ${isDrivingAway ? 'translate-x-[250%] opacity-0' : 'translate-x-0 opacity-100'}`}>
          <div 
            className="w-full h-full bg-contain bg-center bg-no-repeat drop-shadow-2xl"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4IVLOypzqZDSt0HYPwVI8WHh-o6EAL4suPhi3Got_EMwQ8HxYFbWu8Q45Tc1MvV1_FTOG6tuy2gmYleDJQiYotE4SkHQN6AoggYrT1gxgLGFslYLA2UuALsgYTQA7lbvvJy0JPTuvxHCPiNbim7PbdraW1Pd5S_erCYtSqnOG0OVkokRHvtFawklT8MfdkWAnyCjDa9OYm8tpypfcsd8GMYJbiv_x-w6qXgyDPnaCY5bafW181aWa7ZOK1w0DeqArdpou2SexIKL8")' }}
          ></div>
        </div>

        {/* Vertical Tube Progress */}
        <div className="flex flex-col items-center gap-2 animate-fade-in shrink-0">
          <div className="relative w-4 h-[30vh] bg-slate-200/30 dark:bg-slate-800/30 rounded-full border-[2px] border-white dark:border-slate-700 shadow-inner overflow-hidden flex items-end">
            <div 
              className="w-full bg-gradient-to-t from-primary to-sky-400 transition-all duration-[1500ms] ease-out"
              style={{ height: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-black text-slate-900 dark:text-white leading-none">
              {currentProgress}<span className="text-slate-400 text-[10px]">/10</span>
            </h2>
            <p className="text-[6px] font-black uppercase tracking-tighter text-primary mt-0.5">Progress</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 pb-10 pt-4 shrink-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <div className="max-w-md mx-auto flex flex-col items-center">
          
          {isFull && (
            <button 
              onClick={handleClaim}
              className="mb-4 w-full h-14 bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl shadow-xl animate-pulse active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              Claim Reward
            </button>
          )}
          
          {promoCode && (
            <div className="mb-4 w-full p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-emerald-500/20 shadow-lg text-center animate-bounce">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 block mb-1">Promo Active</span>
              <p className="text-2xl font-black text-primary tracking-[0.2em]">{promoCode}</p>
            </div>
          )}

          <p className="mb-4 text-xs font-medium text-slate-500 text-center">Ready for a refill? Book your next delivery instantly.</p>
          
          <button 
            onClick={() => onNavigate(6)} 
            className="w-full h-16 bg-primary rounded-2xl text-lg font-bold tracking-wider text-white shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined font-bold">water_drop</span>
            Book Tanker Now
          </button>
          
          <button onClick={() => onNavigate(11)} className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            About your tanker
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
