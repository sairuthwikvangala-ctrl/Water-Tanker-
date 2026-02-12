
import React, { useState } from 'react';

interface LocationData {
  address: string;
  landmark: string;
  coordinates: { lat: number; lng: number } | null;
  isAutoDetected: boolean;
}

interface ReceiptDetailsPageProps {
  onNavigate: (page: number) => void;
  location: LocationData;
  options: { type: string; quantity: string };
  mobile: string;
  isFree: boolean;
  setSecondaryMobile: (val: string) => void;
}

const ReceiptDetailsPage: React.FC<ReceiptDetailsPageProps> = ({ onNavigate, location, options, mobile, isFree, setSecondaryMobile }) => {
  const [secondaryInput, setSecondaryInput] = useState("");
  const [error, setError] = useState("");
  
  const baseFare = 450;
  const expressCharge = options.type === 'Express Delivery' ? 150 : 0;
  const total = isFree ? 0 : (baseFare + expressCharge);

  const handleConfirm = () => {
    if (secondaryInput.length !== 10 || isNaN(Number(secondaryInput))) {
      setError("Please enter a valid 10-digit backup mobile number.");
      return;
    }
    if (secondaryInput === mobile) {
      setError("Backup number must be different from primary number.");
      return;
    }
    
    setSecondaryMobile(secondaryInput);
    onNavigate(9);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark transition-colors duration-200">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-background-dark">
        <button onClick={() => onNavigate(7)} className="flex size-10 items-center justify-center text-zinc-900 dark:text-white rounded-full">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-zinc-900 dark:text-white">Order Receipt</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 pb-40 px-4 py-6 max-w-2xl mx-auto w-full animate-fade-in-up">
        {isFree && (
          <div className="mb-6 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 text-center animate-pulse">
             <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em]">Promo Applied: 100% OFF</span>
          </div>
        )}

        <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-xl border border-zinc-100 dark:border-zinc-800 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Plan</h3>
              <p className="text-xl font-bold text-zinc-900 dark:text-white mt-1">{options.type}</p>
            </div>
            <div className="text-right">
              <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Quantity</h3>
              <p className="text-xl font-bold text-zinc-900 dark:text-white mt-1">{options.quantity}</p>
            </div>
          </div>
          
          <div className="space-y-3 pt-6 border-t border-zinc-50 dark:border-zinc-800">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-zinc-500">Base Fare</span>
              <span className={`text-zinc-900 dark:text-white ${isFree ? 'line-through' : ''}`}>₹{baseFare}.00</span>
            </div>
            {expressCharge > 0 && (
              <div className="flex justify-between text-sm font-medium">
                <span className="text-zinc-500">Express Charge</span>
                <span className={`text-zinc-900 dark:text-white ${isFree ? 'line-through' : ''}`}>₹{expressCharge}.00</span>
              </div>
            )}
            <div className="flex justify-between pt-4">
              <span className="text-lg font-black text-zinc-900 dark:text-white">Grand Total</span>
              <span className={`text-2xl font-black ${isFree ? 'text-emerald-500' : 'text-primary'}`}>₹{total}.00</span>
            </div>
          </div>
        </div>

        {/* Mandatory Additional Number Block */}
        <div className="rounded-3xl bg-white dark:bg-zinc-900 p-6 border border-zinc-100 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">security</span>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Security Verification</h2>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 font-medium">
              Primary Phone: <span className="font-bold text-primary">{mobile}</span>
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Emergency Backup Phone (Mandatory)</label>
              <input 
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit backup number"
                className={`w-full h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border-2 ${error ? 'border-rose-500' : 'border-zinc-100 dark:border-zinc-700'} p-4 font-black text-slate-800 dark:text-white outline-none focus:border-primary transition-all`}
                value={secondaryInput}
                onChange={(e) => {
                  setSecondaryInput(e.target.value);
                  setError("");
                }}
              />
              {error && <p className="text-rose-500 text-[10px] font-black uppercase tracking-tight ml-1">{error}</p>}
            </div>
          </div>
          
          <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
            <p className="text-[10px] text-primary/80 font-medium leading-tight">
              * This ensures we can reach you if your primary line is busy or unreachable during delivery.
            </p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-background-dark border-t border-zinc-100 dark:border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleConfirm} 
          className="w-full h-16 bg-primary text-white text-lg font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          {isFree ? 'Confirm Free Booking' : 'Confirm & Pay Cash'}
        </button>
      </div>
    </div>
  );
};

export default ReceiptDetailsPage;
