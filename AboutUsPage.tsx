import React from 'react';

interface AboutUsPageProps {
  onNavigate: (page: number) => void;
}

/**
 * AboutUsPage - Page 11 of the application.
 * Precise implementation of the "About Us" design.
 */
const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 min-h-screen">
      {/* iOS Status Bar Spacer */}
      <div className="h-11 w-full bg-background-light/80 dark:bg-background-dark/80 sticky top-0 z-50 ios-blur"></div>
      
      {/* Navigation Header */}
      <nav className="sticky top-11 z-50 bg-background-light/80 dark:bg-background-dark/80 ios-blur border-b border-slate-200 dark:border-slate-800 px-4 h-12 flex items-center justify-between">
        <button 
          onClick={() => onNavigate(4)}
          className="flex items-center text-primary hover:opacity-70 transition-opacity active:scale-95"
        >
          <span className="material-icons text-2xl">chevron_left</span>
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2 text-slate-900 dark:text-white">About Us</h1>
        <div className="w-10"></div> {/* Spacer */}
      </nav>

      <main className="pb-32 animate-fade-in">
        {/* Hero Section */}
        <div className="relative h-64 w-full overflow-hidden">
          <img 
            className="w-full h-full object-cover" 
            alt="Professional blue water tanker truck" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMjsAV45pINEQLSfkddpcw2t2c7jXHv14lqsQioiOc0IqII2Krc1ConZBFBKJJq0muMmkTradqz-B6NpYSMQXmjEQCdLDxD2nXjaaLGI5xvoSSxxHPF-39obkMZRyNt83dX3wzwntQgsz5DDSKf1bk8KzDuTmKkvvAOOqniw4qB1Kiu3kqpveynoURqDPtXLwYUAfhDTB9fTcvUoSuEimP89P_0h6riord_Bxy_Fax82dKcqCvw_HNO5kkCL1amzUQj-SBHvTTmdeO"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent"></div>
        </div>

        <div className="px-6 -mt-12 relative z-10 max-w-2xl mx-auto">
          {/* Mission Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5">
              <span className="material-icons text-primary text-3xl">water_drop</span>
            </div>
            <h2 className="text-2xl font-black mb-4 text-slate-900 dark:text-white">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 font-medium">
              At Your Tanker, we believe that access to clean water should be effortless. We are dedicated to revolutionizing the water delivery industry by connecting households and businesses with reliable tanker services at the touch of a button.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Our commitment is rooted in punctuality and transparency. We leverage advanced logistics to ensure that your water arrives exactly when you need it, ensuring every drop counts.
            </p>
          </div>

          {/* Why Choose Us Section */}
          <section className="mt-12">
            <h3 className="text-xl font-black mb-6 px-1 text-slate-900 dark:text-white">Why Choose Us</h3>
            <div className="space-y-4">
              {/* Benefits list */}
              {[
                { icon: 'verified', title: 'Certified Quality', desc: 'All our water partners undergo rigorous quality checks for purity and safety.' },
                { icon: 'schedule', title: 'On-Time Delivery', desc: 'Real-time tracking ensures tankers arrive at your doorstep exactly on schedule.' },
                { icon: 'payments', title: 'Fair Pricing', desc: 'Transparent, competitive rates with no hidden fees or surge pricing.' },
                { icon: 'support_agent', title: '24/7 Availability', desc: 'Our booking system and support team are available around the clock.' },
              ].map((benefit, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.01]"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-icons text-primary">{benefit.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{benefit.title}</h4>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 leading-normal">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Company Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 pb-12">
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center shadow-inner">
              <div className="text-3xl font-black text-primary">10k+</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mt-2">Deliveries</div>
            </div>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center shadow-inner">
              <div className="text-3xl font-black text-primary">4.9/5</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mt-2">User Rating</div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom CTA Section */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background-light/90 dark:bg-background-dark/90 ios-blur border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-2xl mx-auto">
          <button 
            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            onClick={() => alert("Connecting to support...")}
          >
            <span className="material-icons text-xl">headset_mic</span>
            <span className="text-lg">Contact Support</span>
          </button>
        </div>
        {/* iOS Home Indicator Spacer */}
        <div className="h-4"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
};

export default AboutUsPage;