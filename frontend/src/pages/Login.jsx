import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, Mail, Lock, User, ArrowRight, Info } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function Login() {
  const [mounted, setMounted] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Form State
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', terms: false });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (isSignUp && !formData.fullName.trim()) {
      return setError('Please enter your full name.');
    }
    if (!formData.email.trim() || !formData.password.trim()) {
      return setError('Please fill in all required fields.');
    }
    if (isSignUp && !formData.terms) {
      return setError('You must agree to the Terms & Conditions.');
    }

    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Sign up payload
        const names = formData.fullName.trim().split(' ');
        const firstName = names[0] || '';
        const lastName = names.slice(1).join(' ') || '';
        
        const response = await fetch('http://localhost:8000/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            first_name: firstName,
            last_name: lastName
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || 'Sign up failed');
        }
        
        setIsSignUp(false);
        setFormData({ fullName: '', email: formData.email, password: '', terms: false });
        showToast('Account created successfully! Please sign in.', 'success');
      } else {
        // Login payload
        const formBody = new URLSearchParams();
        formBody.append('username', formData.email);
        formBody.append('password', formData.password);
        
        const response = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formBody
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || 'Invalid email or password');
        }
        
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        
        showToast('Successfully signed in.', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setIsSignUp(!isSignUp);
    setError('');
    setFormData({ fullName: '', email: '', password: '', terms: false });
  };

  return (
    <div className="flex w-full h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Brand Side */}
      <div 
        className="hidden lg:flex flex-1 flex-col justify-between bg-[#2b1fcc] text-white p-12 relative overflow-hidden"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-sm">
            <Archive className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">AssetFlow</span>
        </div>

        <div className="relative z-10 -mt-10">
          <h1 className="text-[3.5rem] font-extrabold leading-[1.1] mb-6 tracking-tight animate-[fadeIn_0.5s_ease-out]">
            {isSignUp ? 'Enterprise' : 'Welcome'}<br/>
            <span className="text-white/60">{isSignUp ? 'Asset & Resource\nManagement' : 'Back to AssetFlow'}</span>
          </h1>
          <p className="text-white/75 text-base leading-relaxed max-w-sm">
            {isSignUp 
              ? 'Streamline your operations with our unified platform for asset tracking, resource allocation, and maintenance.'
              : 'Log in to securely manage your enterprise assets, track field resources, and optimize operations.'}
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-5">
          <span className="text-sm font-medium text-white/80 tracking-wide">Trusted by operations teams worldwide</span>
        </div>

        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      </div>

      {/* Form Side */}
      <div className="flex-[0.9] flex items-center justify-center bg-white p-8 relative">
        <div 
          className="w-full max-w-md animate-[fadeIn_0.4s_ease-out]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
          }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {isSignUp ? 'Create an account' : 'Sign in to your account'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isSignUp ? 'Sign up to start managing your enterprise assets.' : 'Welcome back! Please enter your details.'}
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium animate-[fadeIn_0.2s_ease-out]">
                {error}
              </div>
            )}
            
            {isSignUp && (
              <div className="animate-[slideUp_0.2s_ease-out]">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#2b1fcc] transition-colors" />
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Alex Sterling" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-[#2b1fcc]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#2b1fcc] transition-colors" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="alex.sterling@company.com" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-[#2b1fcc]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                {!isSignUp && <a href="#" className="text-xs font-semibold text-[#2b1fcc] hover:underline">Forgot password?</a>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#2b1fcc] transition-colors" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-[#2b1fcc]"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="flex items-center gap-2 mt-2 animate-[fadeIn_0.3s_ease-out]">
                <input 
                  type="checkbox" id="terms" 
                  checked={formData.terms}
                  onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                  className="w-4 h-4 rounded border-slate-300 text-[#2b1fcc] focus:ring-[#2b1fcc] cursor-pointer" 
                />
                <label htmlFor="terms" className="text-[0.8rem] text-slate-600 cursor-pointer select-none">
                  I agree to the <a href="#" className="text-[#2b1fcc] font-medium hover:underline transition-colors">Terms & Conditions</a>
                </label>
              </div>
            )}

            {isSignUp && (
              <div className="mt-2 bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-start gap-2.5 animate-[fadeIn_0.3s_ease-out]">
                <Info className="w-4 h-4 text-[#2b1fcc] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-800">Note:</span> Sign up creates an <span className="font-semibold">Employee</span> account. Admin roles can be assigned later.
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`mt-4 w-full bg-[#2b1fcc] text-white py-3.5 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#2015a3] hover:shadow-[0_8px_20px_rgba(43,31,204,0.3)] hover:-translate-y-0.5 active:scale-[0.98] ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>{isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <a href="#" onClick={toggleMode} className="text-[#2b1fcc] font-bold hover:underline transition-colors">
              {isSignUp ? 'Sign in' : 'Create one'}
            </a>
          </p>

        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
