import React, { useState, useEffect } from 'react';
import { 
  Laptop, Building2, Car, TrendingUp, AlertTriangle, 
  CheckCircle, Clock, FileText 
} from 'lucide-react';

export default function DashboardOverview() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">Dashboard Overview</h2>
          <p className="text-sm text-slate-500">Welcome back, Alex. Here's what's happening with your assets today.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Assets', value: '2,481', change: '+12%', icon: Laptop, color: 'text-[#2b1fcc]', bg: 'bg-indigo-100' },
          { label: 'Active Work Orders', value: '45', change: '-3%', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Pending Approvals', value: '12', change: '+2', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Maintenance Costs', value: '$124.5k', change: '+8%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-100' },
        ].map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md cursor-default"
            style={{
              transitionDelay: `${idx * 100}ms`,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(15px)'
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
            <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <div 
          className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          style={{
            transitionDelay: '400ms',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(15px)'
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
            <button className="text-sm font-semibold text-[#2b1fcc] hover:underline">View All</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              { title: 'MacBook Pro 16" assigned to Sarah Jenkins', time: '2 hours ago', icon: Laptop, color: 'bg-indigo-100 text-[#2b1fcc]' },
              { title: 'HVAC Maintenance completed at HQ', time: '4 hours ago', icon: Building2, color: 'bg-emerald-100 text-emerald-600' },
              { title: 'New Fleet Vehicle registration pending', time: '1 day ago', icon: Car, color: 'bg-amber-100 text-amber-600' },
              { title: 'Software License renewal approved', time: '1 day ago', icon: FileText, color: 'bg-blue-100 text-blue-600' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900">{activity.title}</h4>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Status Chart Mock */}
        <div 
          className="col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center"
          style={{
            transitionDelay: '500ms',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(15px)'
          }}
        >
          <h3 className="text-base font-bold text-slate-900 w-full text-left mb-6">Asset Status</h3>
          <div className="relative w-48 h-48 mb-6">
            {/* SVG Donut Chart Mock */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="15" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#2b1fcc" strokeWidth="15" strokeDasharray="163 251" strokeLinecap="round" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="15" strokeDasharray="63 251" strokeDashoffset="-163" strokeLinecap="round" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="15" strokeDasharray="25 251" strokeDashoffset="-226" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-900">82%</span>
              <span className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest">Active</span>
            </div>
          </div>
          
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#2b1fcc]"></div><span className="text-slate-600">Active</span></div>
              <span className="font-bold text-slate-900">2,034</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-slate-600">In Maintenance</span></div>
              <span className="font-bold text-slate-900">295</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-slate-600">Retired</span></div>
              <span className="font-bold text-slate-900">152</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
