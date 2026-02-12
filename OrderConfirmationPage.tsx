
import React, { useEffect } from 'react';

interface LocationData {
  address: string;
  landmark: string;
  coordinates: { lat: number; lng: number } | null;
  isAutoDetected: boolean;
}

interface OrderConfirmationPageProps {
  onNavigate: (page: number) => void;
  location: LocationData;
  addOrder: () => void;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ onNavigate, location, addOrder }) => {
  useEffect(() => {
    addOrder();
  }, []);

  return (
    <div className="relative mx-auto flex h-screen w-full max-w-md flex-col overflow-hidden bg-white dark:bg-background-dark transition-colors duration-200">
      <div className="flex items-center bg-white dark:bg-slate-900 p-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <button onClick={() => onNavigate(4)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-2xl text-slate-800 dark:text-white">arrow_back_ios_new</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-slate-900 dark:text-white pr-10">Order Confirmed</h1>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center animate-zoom-in">
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 shadow-inner">
            <span className="material-symbols-outlined text-6xl text-emerald-500" style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>verified</span>
          </div>
          <div className="flex flex-col gap-2 max-w-[300px]">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Order Successful!</h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Your tanker is scheduled for delivery.</p>
          </div>
          
          {location.landmark && (
            <div className="mt-2 bg-primary/5 p-4 rounded-2xl border border-primary/10 w-full">
               <span className="text-[10px] font-black uppercase text-primary tracking-widest">Delivery Landmark Proof</span>
               <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{location.landmark}</p>
            </div>
          )}

          {location.coordinates && (
            <div className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">GPS COORDINATES LOCKED</div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-5 pb-8 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] animate-slide-up">
        <button onClick={() => onNavigate(4)} className="flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl bg-primary px-5 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-1 active:translate-y-0">
          <span className="truncate">Go to Home</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-zoom-in { animation: zoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default OrderConfirmationPage;
