import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, MoreVertical, HelpCircle, 
  Settings, Clock, Calendar, AlertCircle, Hourglass
} from 'lucide-react';

export default function Reports() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className="max-w-[1200px] mx-auto flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[2rem] font-extrabold text-slate-900 tracking-tight leading-tight">Reports & Analytics</h2>
        <p className="text-[0.95rem] text-slate-500 mt-1 font-medium">Gain insights into asset utilization, health, and maintenance trends.</p>
      </div>

      {/* Top Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Assets by Department (Bar Chart Mock) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-80">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Assets by Department</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
          </div>
          
          <div className="flex-1 flex items-end justify-between px-4 gap-4 relative mt-4">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              <div className="border-b border-slate-100 w-full h-0"></div>
              <div className="border-b border-slate-100 w-full h-0"></div>
              <div className="border-b border-slate-100 w-full h-0"></div>
              <div className="border-b border-slate-100 w-full h-0"></div>
            </div>

            {/* Bars */}
            <div className="w-full flex justify-between items-end h-full z-10 pb-2">
              <div className="w-1/5 bg-indigo-300 h-[60%] rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer"></div>
              <div className="w-1/5 bg-[#2b1fcc] h-[95%] rounded-t-sm shadow-[0_4px_15px_rgba(43,31,204,0.3)] hover:opacity-90 transition-opacity cursor-pointer relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 hover:opacity-100">452</div>
              </div>
              <div className="w-1/5 bg-indigo-400 h-[50%] rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer"></div>
              <div className="w-1/5 bg-indigo-200 h-[30%] rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer"></div>
            </div>
          </div>
          <div className="flex justify-between px-6 pt-3 text-[0.7rem] font-bold text-slate-400 border-t border-slate-100 mt-2">
            <span>Eng</span>
            <span>Ops</span>
            <span>Sales</span>
            <span>Mkt</span>
          </div>
        </div>

        {/* Maintenance Frequency (Line Chart Mock) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-80">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Maintenance Frequency</h3>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-xs font-bold">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>

          <div className="flex-1 relative w-full h-full mt-4 flex flex-col">
            <div className="flex-1 w-full relative">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,35 Q20,33 30,25 T60,15 T100,5 L100,40 L0,40 Z" fill="url(#chartGrad)" />
                <path d="M0,35 Q20,33 30,25 T60,15 T100,5" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            
            <div className="flex justify-between pt-3 text-[0.7rem] font-bold text-slate-400 border-t border-slate-100 mt-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Top Used Assets */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="text-base font-extrabold text-slate-800 mb-6">Top Used Assets</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#2b1fcc] transition-colors"></div>
                <span className="text-sm font-semibold text-slate-700">Conference Room B2</span>
              </div>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-bold">34 bookings this month</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#2b1fcc] transition-colors"></div>
                <span className="text-sm font-semibold text-slate-700">Delivery Van 3</span>
              </div>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-bold">21 trips this month</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#2b1fcc] transition-colors"></div>
                <span className="text-sm font-semibold text-slate-700">Projector AF-0062</span>
              </div>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-bold">18 uses</span>
            </div>
          </div>
        </div>

        {/* Idle Assets */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="text-base font-extrabold text-slate-800 mb-6">Idle assets</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-amber-500 transition-colors"></div>
                <span className="text-sm font-semibold text-slate-700">Camera AF-0301</span>
              </div>
              <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded text-xs font-bold">unused 60+ days</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 group-hover:bg-amber-500 transition-colors"></div>
                <span className="text-sm font-semibold text-slate-700">Office chair AF-0410</span>
              </div>
              <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded text-xs font-bold">unused 45 days</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="mt-4">
        <h3 className="text-[1.1rem] font-extrabold text-slate-800 mb-4">Due for maintenance / nearing retirement</h3>
        <div className="grid grid-cols-2 gap-6">
          
          {/* Due Maintenance Card */}
          <div className="bg-[#fffdf5] border border-[#fef0c7] rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 flex-shrink-0">
              <Calendar className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Projector AF-0057</h4>
              <p className="text-[0.75rem] font-medium text-amber-600/80 mt-0.5">Due in 7 days</p>
            </div>
          </div>

          {/* Nearing Retirement Card */}
          <div className="bg-[#fffbfb] border border-[#fee2e2] rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 flex-shrink-0">
              <Hourglass className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Laptop AF-0020</h4>
              <p className="text-[0.75rem] font-medium text-red-500/80 mt-0.5">4 years old : nearing retirement</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
