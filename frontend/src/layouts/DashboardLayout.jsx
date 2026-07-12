import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Box, ArrowRightLeft,
  CalendarCheck, Wrench, ClipboardCheck, BarChart2,
  Bell, Settings, Archive, Search, HelpCircle, Plus, FileText,
  Sun, Moon
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAppContext } from '../contexts/AppContext';
import Modal from '../components/Modal';

export default function DashboardLayout() {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { addAsset, loadAssets } = useAppContext();
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isSubmittingAsset, setIsSubmittingAsset] = useState(false);
  const [assetFormData, setAssetFormData] = useState({ name: '', tag: '', category: 'Electronics', status: 'Available', location: '' });

  const handleAddAssetSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingAsset(true);
    try {
      await addAsset(assetFormData);
      setIsAddAssetOpen(false);
      setAssetFormData({ name: '', tag: '', category: 'Electronics', status: 'Available', location: '' });
      showToast('Asset registered successfully!', 'success');
      await loadAssets();
    } catch (err) {
      showToast(err.message || 'Failed to register asset', 'error');
    } finally {
      setIsSubmittingAsset(false);
    }
  };

  // Overlay States
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const [showUserMenu, setShowUserMenu] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('token');
    showToast('Logged out successfully.', 'success');
    navigate('/');
  };

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

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100 relative">
          {showUserMenu && (
            <div className="absolute bottom-16 left-4 right-4 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-30 animate-[slideUp_0.2s_ease-out]">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                Log Out
              </button>
            </div>
          )}
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-2.5 bg-slate-100/60 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-[0.8rem] font-bold text-slate-900 truncate">Administrator</h4>
              <p className="text-[0.65rem] font-semibold text-slate-500 truncate">admin@assetflow.com</p>
            </div>
          </div>
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
            <input 
              type="text" 
              placeholder="Search resources, bookings, or assets..." 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  showToast(`Searching for: ${e.target.value}`, 'success');
                }
              }}
              className="w-full bg-slate-100/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-[0.85rem] outline-none hover:bg-white focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#2b1fcc] transition-all shadow-sm" 
            />
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-slate-700 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-slate-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                const nextDark = !darkMode;
                setDarkMode(nextDark);
                localStorage.setItem('darkMode', nextDark ? 'true' : 'false');
                showToast(`Dark Mode ${nextDark ? 'Enabled' : 'Disabled'}`, 'success');
              }}
              className="hover:text-slate-700 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <button 
              onClick={() => {
                showToast('Please use the Register Asset button on the Assets page.', 'success');
                navigate('/assets');
              }}
              className="bg-[#2b1fcc] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 hover:bg-[#2015a3] hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add New Asset
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

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="System Settings">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500 mb-2">Configure your preferences and system options here.</p>
          
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Email Notifications</h4>
              <p className="text-xs text-slate-500 mt-0.5">Receive updates about your assets</p>
            </div>
            <div 
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`w-10 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors ${emailNotifications ? 'bg-[#2b1fcc]' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${emailNotifications ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => {
                setIsSavingSettings(true);
                setTimeout(() => {
                  setIsSavingSettings(false);
                  setIsSettingsOpen(false);
                  localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
                  showToast('Settings saved successfully', 'success');
                }, 600);
              }}
              disabled={isSavingSettings}
              className={`px-6 py-2 text-sm font-bold text-white bg-[#2b1fcc] hover:bg-[#2015a3] rounded-lg transition-all shadow-sm ${isSavingSettings ? 'opacity-80' : ''}`}
            >
              {isSavingSettings ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Help Modal */}
      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title="Help & Support">
        <div className="flex flex-col gap-4">
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#2b1fcc] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-indigo-900">Need assistance?</h4>
              <p className="text-xs text-indigo-700 mt-1 leading-relaxed">Our support team is available 24/7 to help you with any issues regarding your enterprise assets.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button 
              onClick={() => {
                setIsHelpOpen(false);
                showToast('Opening Documentation...', 'success');
              }}
              className="p-3 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-[#2b1fcc] transition-all flex flex-col items-center gap-2"
            >
              <FileText className="w-5 h-5 text-slate-400" />
              Documentation
            </button>
            <button 
              onClick={() => {
                setIsHelpOpen(false);
                showToast('Connecting to Support...', 'success');
              }}
              className="p-3 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-[#2b1fcc] transition-all flex flex-col items-center gap-2"
            >
              <HelpCircle className="w-5 h-5 text-slate-400" />
              Contact Support
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
