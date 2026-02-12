
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../App';

interface RegisterPageProps {
  onNavigate: (page: number) => void;
  onRegisterSuccess: (user: User) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [incomingOtp, setIncomingOtp] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(() => {
    return localStorage.getItem('stayLoggedIn') === 'true';
  });
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return false;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value !== "" && index < 3) otpRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleGetOtp = () => {
    setError("");
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    
    // Generate a TRULY random 4-digit OTP (not 1986)
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setIncomingOtp(randomCode);
    setCountdown(60);
    setShowNotification(true);
    
    // Keep toast visible for 15 seconds for user to read it
    setTimeout(() => setShowNotification(false), 15000);
  };

  const handleVerify = () => {
    setError("");
    const cleanUser = username.trim();
    const cleanPass = password.trim();
    
    // Admin check
    const isAdmin = cleanUser === "sNChRvP@420#$@" && cleanPass === "CrewMates@056@#SN";
    if (isAdmin) {
      onRegisterSuccess({ username: "Administrator", mobile: "ADMIN" });
      onNavigate(12);
      return;
    }

    if (!phoneNumber) { setError("Phone number required"); return; }
    if (!username) { setError("Username required"); return; }
    if (!password || password.length < 6) { setError("Password too short"); return; }

    const enteredOtp = otp.join("");
    // Must match the randomly generated code
    if (enteredOtp !== incomingOtp || incomingOtp === "") {
      setError("Invalid verification code. Check the top notification.");
      return;
    }

    const newUser: User = { username: cleanUser, mobile: phoneNumber, password: cleanPass };
    const users: User[] = JSON.parse(localStorage.getItem('yt_users') || '[]');
    
    if (users.some(u => u.mobile === phoneNumber)) {
        setError("This number is already registered.");
        return;
    }

    users.push(newUser);
    localStorage.setItem('yt_users', JSON.stringify(users));
    onRegisterSuccess(newUser);
  };

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-background-light dark:bg-background-dark p-4 md:p-10 transition-colors duration-200 overflow-hidden">
      
      {/* Dynamic Toast Notification */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-[360px] transition-all duration-500 transform ${showNotification ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0 pointer-events-none'}`}>
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined font-bold">sms</span>
          </div>
          <div className="flex-1">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Verification Code</h4>
            <p className="text-base font-medium text-slate-900 dark:text-white">Your OTP is <span className="font-black text-primary tracking-widest">{incomingOtp}</span></p>
          </div>
          <button onClick={() => setShowNotification(false)} className="text-slate-300 hover:text-slate-500 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* Floating Back Button */}
      <div className="z-20 mb-4">
        <button 
          onClick={() => onNavigate(1)} 
          className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined text-slate-800 dark:text-white">arrow_back</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 no-scrollbar">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Register</h1>
          <p className="text-slate-500 text-sm mt-1 mb-8">Create an account to start booking</p>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Phone Number</label>
              <div className="relative">
                <input 
                  className="h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-5 text-base outline-none focus:border-primary transition-all font-bold" 
                  placeholder="9876543210" 
                  type="text" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                />
                <button 
                  onClick={handleGetOtp} 
                  disabled={countdown > 0} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest transition-colors hover:bg-primary/20"
                >
                  {countdown > 0 ? `${countdown}s` : 'Get OTP'}
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Username</label>
              <input 
                className="h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-5 text-base outline-none focus:border-primary transition-all" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Create Password</label>
              <input 
                className="h-14 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-5 text-base outline-none focus:border-primary transition-all" 
                type="password" 
                placeholder="••••••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Verification Code</label>
              <div className="flex justify-between gap-3">
                {otp.map((digit, index) => (
                  <input 
                    key={index} 
                    ref={(el) => (otpRefs.current[index] = el)} 
                    className="w-full h-16 rounded-2xl text-center text-3xl font-black border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary outline-none transition-all shadow-sm" 
                    maxLength={1} 
                    type="tel" 
                    value={digit} 
                    onChange={(e) => handleOtpChange(e.target, index)} 
                    onKeyDown={(e) => handleKeyDown(e, index)} 
                  />
                ))}
              </div>
            </div>

            <div className="mt-2">
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <input className="peer hidden" type="checkbox" checked={stayLoggedIn} onChange={(e) => {
                  setStayLoggedIn(e.target.checked);
                  localStorage.setItem('stayLoggedIn', e.target.checked.toString());
                }} />
                <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[10px] font-bold opacity-0 peer-checked:opacity-100">check</span>
                </div>
                <span className="text-slate-500 text-xs font-medium">Stay logged in</span>
              </label>
            </div>
          </div>
          
          {error && <p className="text-rose-500 text-xs font-bold text-center mt-6 animate-shake">{error}</p>}
        </div>

        {/* Action Button */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={handleVerify} 
            className="w-full h-14 bg-primary rounded-2xl text-white font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
          >
            Verify & Register
          </button>
          <div className="text-center mt-4">
            <button 
              onClick={() => onNavigate(2)}
              className="text-xs font-bold text-slate-400"
            >
              Already a member? <span className="text-primary font-black uppercase tracking-widest ml-1 underline underline-offset-4 decoration-2">Log in</span>
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      ` }} />
    </div>
  );
};

export default RegisterPage;
