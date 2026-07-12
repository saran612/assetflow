import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Box, ArrowRightLeft,
  CalendarCheck, Wrench, ClipboardCheck, BarChart2,
  Bell, Settings, Archive, Search, HelpCircle, Plus
} from 'lucide-react';

export default function DashboardLayout() {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Organization', path: '/organization-setup', icon: Building2 },
    { name: 'Assets', path: '/assets', icon: Box },
    { name: 'Allocation', path: '/allocation', icon: ArrowRightLeft },
    { name: 'Booking', path: '/booking', icon: CalendarCheck },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Audit', path: '/audit', icon: ClipboardCheck },
    { name: 'Reports', path: '/reports', icon: BarChart2 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  return (
    <div className="flex w-full h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20 shadow-sm transition-transform duration-500 ease-out">
        
        {/* Brand */}
        <div className="px-6 py-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2b1fcc] rounded-xl flex items-center justify-center shadow-md">
            <Archive className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">AssetFlow</h1>
            <p className="text-[0.65rem] text-slate-500 uppercase tracking-wider font-semibold">Enterprise Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <NavLink 
                key={link.name}
                to={link.path}
                style={{ 
                  animationDelay: `${index * 50}ms`, 
                  opacity: mounted ? 1 : 0, 
                  transform: mounted ? 'translateX(0)' : 'translateX(-10px)'
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 ease-out w-full text-left
                  ${isActive 
                    ? 'bg-indigo-100/70 text-[#2b1fcc] font-semibold shadow-sm border-l-4 border-[#2b1fcc]' 
                    : 'text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900 hover:pl-4 border-l-4 border-transparent'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2b1fcc]' : 'text-slate-400'}`} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Add Asset Button (Bottom) */}
        <div className="p-4 border-t border-slate-100">
          <button className="w-full bg-[#2b1fcc] text-white py-3 rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 hover:bg-[#2015a3] hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4 stroke-[3]" /> Add New Asset
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className="flex-1 relative overflow-y-auto bg-slate-50/50" 
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        
        {/* Top Global Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search resources, bookings, or assets..." className="w-full bg-slate-100/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-[0.85rem] outline-none hover:bg-white focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#2b1fcc] transition-all shadow-sm" />
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button className="hover:text-slate-700 transition-colors"><HelpCircle className="w-5 h-5" /></button>
            <button className="hover:text-slate-700 transition-colors"><Settings className="w-5 h-5" /></button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <button className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200">
              <img src="https://i.pravatar.cc/150?img=11" alt="Alex Mercer" className="w-8 h-8 rounded-full object-cover shadow-sm" />
              <span className="text-sm font-semibold text-slate-700">Alex M.</span>
            </button>
          </div>
        </header>

        <div 
          className="max-w-[1200px] mx-auto p-8 relative z-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
