
import React, { useState } from 'react';
import { Order } from '../App';

interface HistoryPageProps {
  onNavigate: (page: number) => void;
  userOrders: Order[];
}

const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate, userOrders }) => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');

  const filteredData = userOrders.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return item.status !== 'Completed';
    if (filter === 'Completed') return item.status === 'Completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'Started': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
      case 'Pending': return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background-light dark:bg-background-dark transition-colors duration-200">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 px-4 py-4">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <button onClick={() => onNavigate(4)} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Order History</h1>
        </div>
      </header>

      <div className="px-6 py-4 max-w-2xl mx-auto w-full">
        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl gap-1">
          {['All', 'Pending', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                filter === tab 
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-6 pb-12">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.id} className="relative bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">water_drop</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">{item.quantity} - {item.type}</h3>
                      <p className="text-xs text-slate-500 font-medium">Order: {item.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="text-xs font-medium">{item.timestamp}</span>
                  </div>
                  <span className={`text-lg font-black ${item.isFree ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                    {item.price}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="size-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-5xl text-slate-300">receipt_long</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Orders Found</h3>
              <p className="text-sm text-slate-500 mt-1">Start booking your tankers now!</p>
              <button onClick={() => onNavigate(6)} className="mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform">Book Now</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
