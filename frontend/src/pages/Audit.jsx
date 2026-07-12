import React, { useState, useEffect } from 'react';
import { 
  Download, MapPin, CheckCircle2, XCircle, AlertTriangle, ArrowRight
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function Audit() {
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();
  const [auditClosed, setAuditClosed] = useState(false);
  const [auditItems, setAuditItems] = useState([
    { id: 1, name: 'Laptop', subtitle: null, location: 'Desk E12', status: 'Verified' },
    { id: 2, name: 'Office chair', subtitle: 'Herman Miller Aeron', location: 'Desk E14', status: 'Missing' },
    { id: 3, name: 'Monitor', subtitle: 'Dell 27"', location: 'Desk E15', status: 'Damaged' }
  ]);

  const cycleStatus = (id) => {
    const statuses = ['Verified', 'Missing', 'Damaged'];
    setAuditItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextIdx = (statuses.indexOf(item.status) + 1) % statuses.length;
        return { ...item, status: statuses[nextIdx] };
      }
      return item;
    }));
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Verified': return { bg: 'bg-indigo-100 text-indigo-500', icon: CheckCircle2 };
      case 'Missing': return { bg: 'bg-red-100 text-red-500', icon: XCircle };
      case 'Damaged': return { bg: 'bg-slate-100 text-slate-500', icon: AlertTriangle };
      default: return { bg: 'bg-slate-100 text-slate-500', icon: AlertTriangle };
    }
  };

  const handleCloseAudit = () => {
    setAuditClosed(true);
    showToast('Audit cycle closed successfully', 'success');
  };

  const handleDownloadReport = () => {
    const headers = ['Item', 'Location', 'Status'];
    const csvContent = [
      headers.join(','),
      ...auditItems.map(item => `${item.name},${item.location},${item.status}`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'audit_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit report downloaded', 'success');
  };

  const pendingCount = auditItems.filter(i => i.status !== 'Verified').length;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className="max-w-[1000px] mx-auto flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      
      {/* Header */}
      <div>
        <h2 className="text-[2rem] font-extrabold text-slate-900 tracking-tight leading-tight">Audit</h2>
        <p className="text-[0.95rem] text-slate-500 mt-1 font-medium">Manage active inventory verifications.</p>
      </div>

      {/* Top Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex justify-between items-center mt-2">
        <div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-3">Audit: Engineering dept - 1-15 jul</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-500">A. Rao, S. Iqbal</span>
            <div className="w-px h-4 bg-slate-300"></div>
            <span className={`px-2.5 py-0.5 rounded-full text-[0.7rem] font-extrabold tracking-wide ${auditClosed ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-[#2b1fcc]'}`}>{auditClosed ? 'Closed' : 'In Progress'}</span>
          </div>
        </div>
        <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-slate-300 transition-colors" onClick={handleDownloadReport}>
          {/* Subtle document graphic background */}
          <div className="absolute top-2 right-2 w-10 h-3 bg-slate-200/50 rounded-sm"></div>
          <div className="absolute top-6 right-2 w-8 h-3 bg-slate-200/50 rounded-sm"></div>
          <div className="absolute top-10 right-2 w-10 h-3 bg-slate-200/50 rounded-sm"></div>
          <div className="bg-white p-2 rounded shadow-sm border border-slate-200 z-10 group-hover:-translate-y-0.5 transition-transform">
            <Download className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Checklist Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Card Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-[1.1rem] font-extrabold text-slate-800">Verification Checklist</h3>
          <span className="text-xs font-bold text-slate-400">Showing {pendingCount} pending items</span>
        </div>

        {/* Table/List */}
        <div className="w-full">
          {/* Header Row */}
          <div className="flex px-6 py-3 bg-slate-50/50 border-b border-slate-100 text-[0.75rem] font-extrabold text-slate-500">
            <div className="flex-[2]"></div>
            <div className="flex-[2]">Expected location</div>
            <div className="flex-1 text-right">Verification</div>
          </div>

          {/* Item Rows - data driven */}
          {auditItems.map((item) => {
            const style = getStatusStyle(item.status);
            const StatusIcon = style.icon;
            return (
              <div key={item.id} className="flex items-center px-6 py-5 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex-[2]">
                  <h4 className="text-[0.85rem] font-extrabold text-slate-800">{item.name}</h4>
                  {item.subtitle && <p className="text-[0.7rem] text-slate-400 font-medium">{item.subtitle}</p>}
                </div>
                <div className="flex-[2] flex items-center gap-1.5 text-[0.85rem] font-medium text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400" /> {item.location}
                </div>
                <div className="flex-1 flex justify-end">
                  <button onClick={() => cycleStatus(item.id)} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[0.75rem] font-bold cursor-pointer hover:opacity-80 transition-opacity ${style.bg}`}>
                    <StatusIcon className="w-3.5 h-3.5" /> {item.status}
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      <div className="w-full h-px bg-slate-200 mt-2 mb-2"></div>

      {/* Alert Banner */}
      <div className="bg-red-50 border border-red-200/60 rounded-xl p-5 flex justify-between items-center shadow-sm">
        <div>
          <h4 className="text-[0.85rem] font-extrabold text-red-600 mb-1">2 assets flagged - discrepancy report generated automatically</h4>
          <p className="text-[0.75rem] font-medium text-red-500/80">Action workflow has been initiated for AF-9921 and AF-9838.</p>
        </div>
        <button onClick={handleDownloadReport} className="text-[0.8rem] font-bold text-red-600 hover:text-red-700 hover:underline transition-all">
          View Report
        </button>
      </div>

      {/* Action Button */}
      <div className="flex justify-end mt-2">
        <button 
          onClick={handleCloseAudit}
          disabled={auditClosed}
          className={`bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md shadow-slate-900/20 hover:bg-slate-900 hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 ${auditClosed ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {auditClosed ? 'Audit Closed' : <>Close audit cycle <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>

    </div>
  );
}
