import React, { useState, useEffect } from 'react';
import { 
  Filter, Download, AlertTriangle, Sparkles
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function Notifications() {
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('All');
  const [readIds, setReadIds] = useState(new Set());
  const [showExtra, setShowExtra] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const notifications = [
    {
      id: 1,
      text: <>New laptop <span className="font-bold text-slate-900">assigned to Priya shah</span></>,
      type: 'Assignment',
      time: '2m ago',
      dot: 'bg-emerald-500'
    },
    {
      id: 2,
      text: <>Transfer request <span className="font-bold text-[#2b1fcc]">AF-0055</span> approved</>,
      type: 'Approval',
      time: '18m ago',
      dot: 'bg-amber-400'
    },
    {
      id: 3,
      text: <>Booking successful : <span className="font-bold text-slate-900">Room B2 : 2:00 to 3:00 PM</span></>,
      type: 'Room',
      time: '1h ago',
      dot: 'bg-emerald-500'
    },
    {
      id: 4,
      text: <>Asset transfer : <span className="font-bold text-[#2b1fcc]">AF-0033</span> to facilities dept</>,
      type: 'Internal Move',
      time: '3h ago',
      dot: 'bg-emerald-500'
    },
    {
      id: 5,
      text: <span className="text-[#d93025]">Maintenance <span className="font-bold">AF-0021</span> was due 3 days ago</span>,
      type: 'Pending',
      typeColor: 'text-red-400',
      time: '1d ago',
      dot: 'bg-[#d93025]'
    },
    {
      id: 6,
      text: <span className="text-[#d93025]">Asset flagged : <span className="font-bold text-[#2b1fcc]">AF-0088</span> damaged</span>,
      type: 'Audit',
      typeColor: 'text-red-400',
      time: '2d ago',
      dot: 'bg-[#d93025]'
    }
  ];

  const extraNotifications = [
    {
      id: 7,
      text: <>Laptop <span className="font-bold text-slate-900">AF-0120</span> decommissioned</>,
      type: 'Assignment',
      time: '3d ago',
      dot: 'bg-slate-400'
    },
    {
      id: 8,
      text: <>Booking cancelled : <span className="font-bold text-slate-900">Room C1 : 4:00 PM</span></>,
      type: 'Room',
      time: '4d ago',
      dot: 'bg-amber-400'
    }
  ];

  const allNotifications = showExtra ? [...notifications, ...extraNotifications] : notifications;

  const filteredNotifications = allNotifications.filter(item => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Alerts') return item.type === 'Pending' || item.type === 'Audit';
    if (activeTab === 'Approvals') return item.type === 'Approval' || item.type === 'Assignment';
    if (activeTab === 'Bookings') return item.type === 'Room';
    return true;
  });

  const handleMarkAllRead = () => {
    setReadIds(new Set(allNotifications.map(n => n.id)));
    showToast('All notifications marked as read', 'success');
  };

  const handleExport = () => {
    const headers = ['ID', 'Type', 'Time'];
    const csvContent = [
      headers.join(','),
      ...allNotifications.map(n => `${n.id},${n.type},${n.time}`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'notifications_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Notification logs exported', 'success');
  };

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
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-[2rem] font-extrabold text-slate-900 tracking-tight leading-tight">Alerts & Notifications</h2>
          <p className="text-[0.95rem] text-slate-500 mt-1 font-medium">Operational updates across your enterprise.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('All')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[0.8rem] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[0.8rem] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Logs
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {['All', 'Alerts', 'Approvals', 'Bookings'].map((tab) => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-5 py-2 rounded-full text-[0.8rem] font-bold transition-colors ${
               activeTab === tab 
                 ? 'bg-slate-100 text-slate-800' 
                 : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
             }`}
           >
             {tab}
           </button>
        ))}
      </div>

      {/* Main List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
         {/* Mark all as read */}
         <div className="p-4 flex justify-end border-b border-slate-100">
           <button onClick={handleMarkAllRead} className="text-[0.8rem] font-bold text-[#2b1fcc] hover:text-[#2015a3] hover:underline transition-all">Mark all as read</button>
         </div>

         {/* List items */}
         <div className="flex flex-col">
            {filteredNotifications.map((item) => (
              <div key={item.id} className="flex items-start justify-between p-6 border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <div>
                   <p className="text-[0.95rem] text-slate-700 font-medium group-hover:text-slate-900 transition-colors">{item.text}</p>
                   <p className={`text-[0.7rem] font-bold mt-1 ${item.typeColor || 'text-slate-400'}`}>{item.type}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="text-[0.7rem] font-bold text-slate-400">{item.time}</span>
                   {!readIds.has(item.id) && <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`}></div>}
                </div>
              </div>
            ))}
         </div>

         {/* Load more */}
         <div className="p-6 flex justify-center">
            <button 
              onClick={() => { setShowExtra(true); showToast('Loaded more activities', 'success'); }}
              disabled={showExtra}
              className={`px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-[0.8rem] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all shadow-sm ${showExtra ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {showExtra ? 'No more activities' : 'Load more activities'}
            </button>
         </div>
      </div>

      {/* Bottom widgets */}
      <div className="grid grid-cols-2 gap-6 mt-2">
         {/* Active Alerts */}
         <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100"><AlertTriangle className="w-4 h-4 text-[#d93025]"/></div>
               <span className="font-extrabold text-slate-800 text-[0.95rem]">Active Alerts</span>
            </div>
            <span className="text-[2.2rem] font-extrabold text-slate-900 leading-none">14</span>
         </div>
         {/* System Health */}
         <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100"><Sparkles className="w-4 h-4 text-emerald-500"/></div>
               <span className="font-extrabold text-slate-800 text-[0.95rem]">System Health</span>
            </div>
            <span className="text-[2.2rem] font-extrabold text-slate-900 leading-none">99.9%</span>
         </div>
      </div>

    </div>
  );
}
