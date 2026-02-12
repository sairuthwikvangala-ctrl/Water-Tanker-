
import React from 'react';
import { User } from '../App';

interface ProfilePageProps {
  onNavigate: (page: number) => void;
  user: User | null;
  orderCount: number;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, user, orderCount, onLogout }) => {
  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200">
      <div className="flex items-center bg-white dark:bg-slate-900 p-4 pb-2 justify-between border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-md">
        <button onClick={() => onNavigate(4)} className="flex size-12 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95">
          <span className="material-symbols-outlined text-slate-800 dark:text-slate-200">arrow_back_ios_new</span>
        </button>
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold flex-1 text-center">Profile</h2>
        <div className="w-12"></div>
      </div>

      <div className="flex-grow overflow-y-auto pb-12">
        <div className="flex flex-col p-4 gap-6 max-w-2xl mx-auto">
          <div className="flex p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 animate-fade-in-up">
            <div className="flex w-full items-center gap-5">
              <div className="bg-primary/10 flex items-center justify-center rounded-full h-24 w-24 border-4 border-primary/5 text-primary">
                <span className="material-symbols-outlined text-5xl">person</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-slate-100 text-[22px] font-bold leading-tight tracking-tight">{user?.username || "Guest User"}</p>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal">{user?.mobile || "Not registered"}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <p className="text-primary text-3xl font-black leading-tight">{orderCount}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Total Orders</p>
            </div>
            <div className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <p className="text-emerald-500 text-3xl font-black leading-tight">{Math.floor(orderCount / 10)}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Free Rewards</p>
            </div>
          </div>

          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 px-5 h-20 border-b border-slate-100 dark:border-slate-800">
               <span className="material-symbols-outlined text-primary">call</span>
               <div className="flex-1">
                 <p className="text-sm font-bold text-slate-900 dark:text-white">Phone</p>
                 <p className="text-xs text-slate-500">{user?.mobile || "N/A"}</p>
               </div>
            </div>
            <div className="flex items-center gap-4 px-5 h-20">
               <span className="material-symbols-outlined text-emerald-500">verified_user</span>
               <div className="flex-1">
                 <p className="text-sm font-bold text-slate-900 dark:text-white">Account Status</p>
                 <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Verified Member</p>
               </div>
            </div>
          </div>

          <button onClick={onLogout} className="flex items-center gap-4 bg-white dark:bg-slate-900 px-5 min-h-[72px] justify-start rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/30 shrink-0 size-11">
              <span className="material-symbols-outlined text-rose-500 dark:text-rose-400">logout</span>
            </div>
            <p className="text-rose-600 dark:text-rose-400 text-base font-bold">Sign Out</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
