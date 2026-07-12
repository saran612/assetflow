import React, { useState, useEffect } from 'react';
import { 
  Laptop, Building2, Car, TrendingUp, AlertTriangle, 
  Clock, FileText, CheckCircle, Info 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { useToast } from '../contexts/ToastContext';

export default function DashboardOverview() {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [kpis, setKpis] = useState({
    total_assets: 0,
    allocated_assets: 0,
    maintenance_assets: 0,
    available_assets: 0,
    lost_assets: 0,
    overdue_bookings_count: 0,
    total_cost: 0
  });
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    setMounted(true);
    async function loadDashboardData() {
      try {
        const kpiData = await apiCall('/dashboard/kpis');
        setKpis(kpiData);
        
        const logData = await apiCall('/logs');
        if (logData && logData.length > 0) {
          setLogs(logData.slice(0, 4));
        } else {
          setLogs([
            { id: 101, details: "Asset 'MacBook Pro 16\"' allocated to John Doe", timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 102, details: "Maintenance request approved for Delivery Van 3", timestamp: new Date(Date.now() - 7200000).toISOString() },
            { id: 103, details: "Seeded 18 mock database assets", timestamp: new Date(Date.now() - 10800000).toISOString() },
            { id: 104, details: "Organization setup initialized by Admin", timestamp: new Date(Date.now() - 86400000).toISOString() }
          ]);
        }
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      }
    }
    loadDashboardData();
  }, []);

  // Compute active vs others
  const activePercent = kpis.total_assets > 0 
    ? Math.round((kpis.allocated_assets / kpis.total_assets) * 100) 
    : 0;

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const headers = ['Metric', 'Value'];
      const csvRows = [
        ['Total Assets', kpis.total_assets],
        ['Allocated Assets', kpis.allocated_assets],
        ['Under Maintenance', kpis.maintenance_assets],
        ['Available Assets', kpis.available_assets],
        ['Lost Assets', kpis.lost_assets],
        ['Overdue Bookings', kpis.overdue_bookings_count],
        ['Net Asset Value ($)', kpis.total_cost]
      ];
      
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dashboard_kpis_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Exported CSV successfully', 'success');
    } catch (err) {
      showToast('Failed to export CSV', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">Dashboard Overview</h2>
          <p className="text-sm text-slate-500">Welcome back. Here's what's happening with your assets today.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          disabled={isExporting}
          className={`bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all active:scale-95 ${isExporting ? 'opacity-80' : ''}`}
        >
          {isExporting ? 'Exporting...' : 'Export Report'}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Assets', value: kpis.total_assets, change: 'Live', icon: Laptop, color: 'text-[#2b1fcc]', bg: 'bg-indigo-100' },
          { label: 'Allocated Assets', value: kpis.allocated_assets, change: 'Active', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Under Maintenance', value: kpis.maintenance_assets, change: 'Warnings', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Net Asset Value', value: `$${Number(kpis.total_cost).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, change: 'Cost Sum', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-100' },
        ].map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => showToast(`Opening ${stat.label} details...`, 'success')}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer group"
            style={{
              transitionDelay: `${idx * 100}ms`,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(15px)'
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
               </div>
               <span className="text-xs font-bold text-slate-400">
                 {stat.change}
               </span>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 group-hover:text-[#2b1fcc] transition-colors">{stat.label}</h3>
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
            <button 
              onClick={() => {
                showToast("Navigating to activity log...", "success");
                navigate('/audit');
              }}
              className="text-sm font-semibold text-[#2b1fcc] hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div 
                  key={log.id} 
                  onClick={() => showToast(`View activity: ${log.details}`, 'success')}
                  className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group hover:pr-4"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 bg-indigo-100 text-[#2b1fcc]">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-[#2b1fcc] transition-colors">{log.details}</h4>
                    <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No recent activity found.</p>
            )}
          </div>
        </div>

        {/* Asset Status Chart Mock */}
        <div 
          className="col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative group"
          onClick={() => showToast("Opening detailed metrics view...")}
          style={{
            cursor: 'pointer',
            transitionDelay: '500ms',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(15px)'
          }}
        >
          <div className="absolute inset-0 bg-slate-50/0 group-hover:bg-slate-50/50 rounded-2xl transition-colors pointer-events-none"></div>
          
          <h3 className="text-base font-bold text-slate-900 w-full text-left mb-6 relative z-10">Asset Status</h3>
          <div className="relative w-48 h-48 mb-6 z-10 transition-transform duration-500 group-hover:scale-105">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-sm">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="15" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#2b1fcc" strokeWidth="15" strokeDasharray={`${Math.round(activePercent * 2.51)} 251`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-slate-900 group-hover:text-[#2b1fcc] transition-colors">{activePercent}%</span>
              <span className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest">Active</span>
            </div>
          </div>
          
          <div className="w-full flex flex-col gap-2 relative z-10">
            <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#2b1fcc]"></div><span className="text-slate-600 font-medium">Allocated</span></div>
              <span className="font-bold text-slate-900">{kpis.allocated_assets}</span>
            </div>
            <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-slate-600 font-medium">In Maintenance</span></div>
              <span className="font-bold text-slate-900">{kpis.maintenance_assets}</span>
            </div>
            <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-slate-600 font-medium">Available</span></div>
              <span className="font-bold text-slate-900">{kpis.available_assets}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
