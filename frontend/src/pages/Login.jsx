import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, Mail, Lock, User, ArrowRight, CheckSquare } from 'lucide-react';

export default function Login() {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="flex w-full h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Brand Side - V2 */}
      <div 
        className="hidden lg:flex flex-1 flex-col justify-between bg-[#2b1fcc] text-white p-12 relative overflow-hidden"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center font-bold text-lg tracking-wide shadow-sm">
            <Archive className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">AssetFlow</span>
        </div>

        <div className="relative z-10 -mt-10">
          <h1 className="text-[3.5rem] font-extrabold leading-[1.1] mb-6 tracking-tight">
            Enterprise<br/>
            <span className="text-white/60">Asset & Resource<br/>Management</span>
          </h1>
          <p className="text-white/75 text-base leading-relaxed max-w-sm">
            Streamline your operations with our unified platform for asset tracking, resource allocation, and maintenance scheduling.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img src="https://i.pravatar.cc/150?img=11" className="w-8 h-8 rounded-full border-2 border-[#2b1fcc] bg-white/90" alt="avatar" />
              <img src="https://i.pravatar.cc/150?img=32" className="w-8 h-8 rounded-full border-2 border-[#2b1fcc] bg-white/60" alt="avatar" />
              <div className="w-8 h-8 rounded-full border-2 border-[#2b1fcc] bg-white flex items-center justify-center text-[#2b1fcc] text-xs font-bold">+2k</div>
            </div>
            <span className="text-sm font-medium text-white/80 tracking-wide">Trusted by operations teams worldwide</span>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      </div>

      {/* Form Side */}
      <div className="flex-[0.9] flex items-center justify-center bg-white p-8 relative">
        <div 
          className="w-full max-w-md"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
          }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Create an account</h2>
            <p className="text-slate-500 text-sm">Sign up to start managing your enterprise assets.</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#2b1fcc] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Alex Sterling" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-[#2b1fcc]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#2b1fcc] transition-colors" />
                <input 
                  type="email" 
                  placeholder="alex.sterling@company.com" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-[#2b1fcc]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#2b1fcc] transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-[#2b1fcc]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="terms" className="w-4 h-4 rounded border-slate-300 text-[#2b1fcc] focus:ring-[#2b1fcc] cursor-pointer" />
              <label htmlFor="terms" className="text-[0.8rem] text-slate-600 cursor-pointer select-none">
                I agree to the <a href="#" className="text-[#2b1fcc] font-medium hover:underline transition-colors">Terms & Conditions</a>
              </label>
            </div>

            <button 
              type="submit" 
              className="mt-6 w-full bg-[#2b1fcc] text-white py-3.5 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#2015a3] hover:shadow-[0_8px_20px_rgba(43,31,204,0.3)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Create Account <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <a href="#" className="text-[#2b1fcc] font-bold hover:underline transition-colors">Sign in</a>
          </p>

        </div>
      </div>
    </div>
  );
}
