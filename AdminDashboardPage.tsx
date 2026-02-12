
import React, { useState, useEffect } from 'react';
import { Order } from '../App';

interface AdminDashboardPageProps {
  onNavigate: (page: number) => void;
  orders: Order[];
  updateStatus: (id: string, status: 'Pending' | 'Started' | 'Completed') => void;
  onLogout: () => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate, orders, updateStatus, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Completed'>('Pending');
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  const pendingOrders = orders.filter(o => o.status !== 'Completed');
  const completedOrders = orders.filter(o => o.status === 'Completed');

  const handleAction = (order: Order) => {
    if (order.status === 'Pending') {
      updateStatus(order.id, 'Started');
    } else if (order.status === 'Started') {
      setSuccessOrderId(order.id);
      setTimeout(() => {
        updateStatus(order.id, 'Completed');
        setSuccessOrderId(null);
      }, 2000);
    }
  };

  return (
    <div className="relative mx-auto flex h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark font-sans overflow-hidden transition-colors duration-200">
      
      <div className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <div className="flex justify-between items-center px-6 pt-4 pb-2">
          <span className="text-sm font-bold text-slate-900 dark:text-white">Admin View</span>
          <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
            <span className="material-icons text-[18px]">signal_cellular_alt</span>
            <span className="material-icons text-[18px]">wifi</span>
            <span className="material-icons text-[18px]">battery_full</span>
          </div>
        </div>
        
        <header className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Admin Hub</h1>
          <button onClick={onLogout} className="flex items-center justify-center p-2 bg-rose-100 dark:bg-rose-900/30 rounded-full text-rose-500">
            <span className="material-icons">logout</span>
          </button>
        </header>
      </div>

      <main className="flex-1 overflow-y-auto px-5 pb-32 no-scrollbar">
        <div className="bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl flex mb-6 shadow-inner">
          <button onClick={() => setActiveTab('Pending')} className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'Pending' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500'}`}>Active ({pendingOrders.length})</button>
          <button onClick={() => setActiveTab('Completed')} className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'Completed' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500'}`}>Archived ({completedOrders.length})</button>
        </div>

        <div className="space-y-4">
          {(activeTab === 'Pending' ? pendingOrders : completedOrders).map(order => (
            <div key={order.id} className={`relative bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 transition-all ${successOrderId === order.id ? 'scale-[1.02] border-emerald-500' : ''}`}>
              {successOrderId === order.id && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 rounded-2xl backdrop-blur-sm animate-fade-in">
                   <span className="material-symbols-outlined text-emerald-500 text-6xl animate-bounce">check_circle</span>
                   <p className="text-emerald-500 font-black uppercase tracking-widest text-sm mt-2">Success!</p>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${order.status === 'Started' ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-primary/10 text-primary'}`}>
                    <span className="material-icons">{order.status === 'Started' ? 'local_shipping' : 'water_drop'}</span>
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">{order.id}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{order.timestamp}</p>
                  </div>
                </div>
                {order.isFree ? (
                  <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">FREE ORDER</span>
                ) : (
                  <span className="text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest border bg-slate-50 dark:bg-slate-700 text-slate-400">{order.type}</span>
                )}
              </div>

              <div className="space-y-3 mb-5 pl-1">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">person</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">{order.customerName}</span>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-slate-400">P: {order.mobile}</span>
                       <span className="text-[10px] font-black text-primary">ALT: {order.secondaryMobile}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-slate-300 text-xl">place</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">{order.landmark}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{order.address}</span>
                  </div>
                </div>
              </div>

              {activeTab === 'Pending' && (
                <button onClick={() => handleAction(order)} className={`w-full h-14 rounded-xl text-white text-[11px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform ${order.status === 'Started' ? 'bg-amber-500' : 'bg-primary'}`}>
                  {order.status === 'Pending' ? 'Start Delivery' : 'Mark Delivered'}
                </button>
              )}
            </div>
          ))}

          {(activeTab === 'Pending' ? pendingOrders : completedOrders).length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <span className="material-symbols-outlined text-6xl">inventory_2</span>
                <p className="text-xs font-black uppercase tracking-widest mt-4">No {activeTab} Orders</p>
             </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 px-8 py-4 flex justify-between items-center z-50 rounded-t-[32px]">
        <div className="flex flex-col items-center gap-1.5 text-primary">
          <span className="material-icons text-2xl">dashboard</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Live Hub</span>
        </div>
        <div onClick={() => onNavigate(4)} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-primary transition-colors cursor-pointer">
          <span className="material-icons text-2xl">home</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Client View</span>
        </div>
      </nav>
    </div>
  );
};

export default AdminDashboardPage;
