
import React, { useState } from 'react';

interface LandingPageProps {
  onNavigate: (page: number) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [stayLoggedIn, setStayLoggedIn] = useState(() => {
    return localStorage.getItem('stayLoggedIn') === 'true';
  });

  const handleToggle = (checked: boolean) => {
    setStayLoggedIn(checked);
    localStorage.setItem('stayLoggedIn', checked.toString());
  };

  const handleLogin = () => {
    onNavigate(2);
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(3);
  };

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-background-light dark:bg-background-dark transition-colors duration-200 overflow-hidden">
      
      {/* Top Section: Large Branding Image - Takes max available space */}
      <div className="relative w-full flex-[3] overflow-hidden min-h-[35vh]">
        <div 
          className="absolute inset-0 bg-center bg-cover transition-transform duration-1000"
          style={{ 
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBII3wxxG2QDT_gAt149T-oUQz-r2cgMDkez7rLg3mAe9B8ghUaPoLVUgL-m_mfLenNboQkP9Qx8doryMT8e3wpbkXql4aK0NyCL-eRO_lPwtFK77Mq7_I6lLnOP4PD6vIwKigdLr_1jpibu9vs_fXCsjD3dXBttQEAYavazw8_5j6NQkq2JOX9POfIFHlq3NtTnzk9O_Qt4mNcUCx-6_zTin6uwvYyKNwlC4Pg_SuhByd2_6mZ6WbYAqYMAZiaMAC98xLlQbxPNKb8")' 
          }}
        >
          {/* Enhanced gradient for better transition to bottom content */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-light dark:to-background-dark"></div>
        </div>
      </div>

      {/* Bottom Content Area - Anchored to bottom */}
      <div className="flex shrink-0 flex-col px-8 pb-8 pt-2 z-10 animate-slide-up bg-background-light dark:bg-background-dark">
        <div className="mb-6">
          <h1 className="text-slate-900 dark:text-white text-5xl font-bold italic tracking-tighter mb-1 font-serif-display">
            Your tanker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-[280px]">
            The smarter way to manage your water delivery needs.
          </p>
        </div>

        {/* Buttons - Centered and visible */}
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
          <button 
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary h-14 transition-all shadow-lg shadow-primary/20 active:scale-[0.97]"
          >
            <span className="material-symbols-outlined text-white font-bold">person</span>
            <span className="text-white text-base font-bold">Login to Account</span>
          </button>

          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-medium">New around here?</span>
            <button 
              onClick={handleRegister}
              className="text-primary text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Footer Settings */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
          <label className="flex items-center gap-2 cursor-pointer group select-none">
            <input 
              className="peer hidden" 
              type="checkbox"
              checked={stayLoggedIn}
              onChange={(e) => handleToggle(e.target.checked)}
            />
            <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[10px] font-bold opacity-0 peer-checked:opacity-100">check</span>
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Stay logged in
            </span>
          </label>
          <span className="text-slate-300 dark:text-slate-700 text-[9px] font-black uppercase tracking-widest">Secure 256-bit</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp { 
          from { transform: translateY(30px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      ` }} />
    </div>
  );
};

export default LandingPage;
