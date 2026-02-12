
import React, { useState } from 'react';

interface BookingOptionsPageProps {
  onNavigate: (page: number) => void;
  options: { type: string; quantity: string };
  setOptions: React.Dispatch<React.SetStateAction<{ type: string; quantity: string }>>;
  userPromoCode: string | null;
  setIsFree: (val: boolean) => void;
}

const BookingOptionsPage: React.FC<BookingOptionsPageProps> = ({ onNavigate, options, setOptions, userPromoCode, setIsFree }) => {
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<'idle'|'valid'|'invalid'>('idle');

  const validatePromo = () => {
    if (promoInput === userPromoCode && userPromoCode !== null) {
      setPromoStatus('valid');
      setIsFree(true);
    } else if (promoInput !== "") {
      setPromoStatus('invalid');
      setIsFree(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 pb-3 sticky top-0 z-10 backdrop-blur-md">
        <button onClick={() => onNavigate(4)} className="flex size-10 items-center justify-center text-slate-800 dark:text-slate-200 rounded-full hover:bg-slate-100 transition-colors">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-slate-900 dark:text-white pr-10">Options</h1>
      </div>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full space-y-10">
        <section className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-4">Delivery Type</h2>
          <div className="flex h-14 w-full items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 p-1.5 shadow-inner">
            {['Normal Delivery', 'Express Delivery'].map(type => (
              <label key={type} className={`flex h-full flex-1 cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-bold transition-all ${options.type === type ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-400'}`}>
                <span className="truncate">{type}</span>
                <input className="sr-only" type="radio" checked={options.type === type} onChange={() => setOptions(prev => ({ ...prev, type }))} />
              </label>
            ))}
          </div>
        </section>

        <section className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-4">Quantity</h2>
          <div className="flex h-14 w-full items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 p-1.5 shadow-inner">
            {['2500 Liters', '5000 Liters', '10000 Liters'].map((q) => (
              <label key={q} className={`flex h-full flex-1 cursor-pointer items-center justify-center rounded-lg px-2 text-[13px] font-bold transition-all ${options.quantity === q ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-400'}`}>
                <span className="truncate">{q}</span>
                <input className="sr-only" type="radio" checked={options.quantity === q} onChange={() => setOptions(prev => ({ ...prev, quantity: q }))} />
              </label>
            ))}
          </div>
        </section>

        <section className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-4">Redeem Free Order</h2>
          <div className="flex flex-col gap-3">
            <div className="relative group">
              <input 
                className={`h-14 w-full rounded-xl border-2 ${promoStatus === 'valid' ? 'border-emerald-500 bg-emerald-50/50' : promoStatus === 'invalid' ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'} p-4 text-base font-black tracking-widest uppercase outline-none transition-all`} 
                placeholder="ENTER 6-LETTER CODE" 
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toLowerCase())}
              />
              <button 
                onClick={validatePromo}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white text-[10px] font-black uppercase rounded-lg shadow-sm"
              >
                Apply
              </button>
            </div>
            {promoStatus === 'valid' && <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest ml-1 animate-pulse">PROMO APPLIED! Order is Free.</p>}
            {promoStatus === 'invalid' && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest ml-1">Invalid or Expired Code.</p>}
          </div>
        </section>
      </main>

      <div className="sticky bottom-0 bg-white dark:bg-slate-900 p-6 border-t border-slate-200 dark:border-slate-800">
        <button onClick={() => onNavigate(7)} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 h-16 text-lg font-bold text-white shadow-lg active:scale-95">
          <span>Delivery Location</span>
          <span className="material-symbols-outlined font-bold">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default BookingOptionsPage;
