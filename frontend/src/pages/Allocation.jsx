import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, Laptop, User, Send, Activity, 
  Info, ChevronDown 
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAppContext } from '../contexts/AppContext';

export default function Allocation() {
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();
  const { assets, allocationHistory, addAllocationEntry } = useAppContext();
  
  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ to: '', reason: '' });
  const [selectedAssetId, setSelectedAssetId] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (assets && assets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(assets[0].id);
    }
  }, [assets, selectedAssetId]);

  const selectedAsset = assets ? (assets.find(a => String(a.id) === String(selectedAssetId)) || assets[0]) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.to) {
      showToast('Please select a recipient employee', 'error');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      addAllocationEntry({ to: formData.to, reason: formData.reason });
      setIsSubmitting(false);
      setFormData({ to: '', reason: '' });
      showToast('Transfer request submitted successfully', 'success');
    }, 800);
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
      <div>
        <h2 className="text-[2rem] font-extrabold text-slate-800 tracking-tight leading-tight">Allocation & Transfer</h2>
        <p className="text-[0.95rem] text-slate-500 mt-1 font-medium">Manage custody and assignment for high-value organizational assets.</p>
      </div>

      {/* Alert Box */}
      {selectedAsset && (selectedAsset.status?.toLowerCase() === 'allocated' || selectedAsset.status?.toLowerCase() === 'assigned') && (
        <div className="bg-red-50/80 border border-red-100 rounded-xl p-4 flex items-start gap-3 shadow-sm mt-2">
          <AlertCircle className="w-5 h-5 text-[#d93025] flex-shrink-0 mt-0.5" fill="currentColor" stroke="white" />
          <div>
            <h4 className="text-sm font-bold text-[#d93025]">Already Allocated to Priya Shah (Engineering)</h4>
            <p className="text-[0.8rem] text-red-600/80 mt-0.5 font-medium">Direct re-allocation is blocked - submit a transfer request below.</p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="col-span-2 flex flex-col gap-6">
          
          {/* Asset Identification */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-[1.1rem] font-extrabold text-slate-800 mb-6">Asset Identification</h3>
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 mb-2">Select Asset to View/Transfer</label>
              <div className="relative cursor-pointer group">
                <select 
                  value={selectedAssetId} 
                  onChange={e => setSelectedAssetId(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-700 font-medium outline-none hover:border-slate-300 focus:border-[#2b1fcc] focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer"
                >
                  <option value="" disabled hidden>Choose Asset...</option>
                  {assets && assets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.tag || `AF-${asset.id}`} - {asset.name} ({asset.status})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-hover:text-slate-700" />
              </div>
            </div>

            {selectedAsset && (
              <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 flex items-center justify-between mt-4">
                <div>
                  <p className="text-[0.7rem] font-bold text-slate-500 tracking-wide mb-1.5">Asset Detail</p>
                  <div className="flex items-center gap-3">
                    <Laptop className="w-5 h-5 text-[#2b1fcc]" />
                    <span className="font-bold text-slate-800 text-[0.95rem]">
                      {selectedAsset.tag || `AF-${selectedAsset.id}`} - {selectedAsset.name}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-[#2b1fcc] rounded text-[0.7rem] font-extrabold tracking-wide uppercase">
                  {selectedAsset.status}
                </span>
              </div>
            )}
          </div>

          {/* Transfer Request */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            
            <h3 className="text-[1.1rem] font-extrabold text-slate-800 mb-6">Transfer Request</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">From</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    disabled 
                    value={selectedAsset && (selectedAsset.status?.toLowerCase() === 'allocated' || selectedAsset.status?.toLowerCase() === 'assigned') ? 'Priya Shah' : 'Unallocated / Available'} 
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-500 font-medium outline-none cursor-not-allowed" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">To</label>
                <div className="relative cursor-pointer group">
                  <select 
                    value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-700 font-medium outline-none hover:border-slate-300 focus:border-[#2b1fcc] focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer"
                  >
                    <option value="" disabled hidden>Select Employee...</option>
                    <option value="Alex Mercer">Alex Mercer</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-hover:text-slate-700" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 mb-2">Reason</label>
              <textarea 
                rows="4" 
                value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}
                placeholder="Provide reason for transfer..."
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-600 font-medium outline-none hover:border-slate-300 focus:border-[#2b1fcc] focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none placeholder:text-slate-400/80"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`bg-[#3a2cdb] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 hover:bg-[#2015a3] hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 ${isSubmitting ? 'opacity-80' : ''}`}
              >
                {isSubmitting ? 'Processing...' : <><Send className="w-3.5 h-3.5" /> Submit Request</>}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column */}
        <div className="col-span-1 flex flex-col gap-6">
          
          {/* Asset Health */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-slate-700" />
              <h3 className="text-[1.1rem] font-extrabold text-slate-800">Asset Health</h3>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[0.75rem] font-semibold text-slate-500">Condition</span>
                <span className="text-[0.75rem] font-bold text-slate-800">Good (85%)</span>
              </div>
              <div className="h-[6px] w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#124b61] rounded-full w-[85%]"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-3">
                <p className="text-[0.6rem] font-bold text-slate-500 mb-1 uppercase tracking-wide">Purchase Date</p>
                <p className="text-[0.75rem] font-bold text-slate-800">Oct 15, 2022</p>
              </div>
              <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-3">
                <p className="text-[0.6rem] font-bold text-slate-500 mb-1 uppercase tracking-wide">Warranty Exp</p>
                <p className="text-[0.75rem] font-bold text-slate-800">Oct 15, 2025</p>
              </div>
            </div>
          </div>

          {/* Allocation history */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1">
            <h3 className="text-[1.1rem] font-extrabold text-slate-800 mb-6">Allocation history</h3>
            
            <div className="relative pl-4 border-l border-slate-100 flex flex-col gap-8">
              
              {allocationHistory.map((entry) => (
                <div key={entry.id} className="relative">
                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${entry.active ? 'bg-[#2b1fcc]' : 'bg-slate-200'}`}></div>
                  <p className="text-[0.65rem] font-bold text-slate-500 mb-1">{entry.date}</p>
                  <p className="text-sm font-medium text-slate-600 leading-snug">
                    {entry.action} <span className="font-bold text-slate-800">{entry.person}</span>
                    {entry.dept && <><br/>{entry.dept}</>}
                  </p>
                  {entry.condition && (
                    <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded text-[0.65rem] font-bold text-slate-500 mt-2">
                      <Info className="w-3 h-3 text-slate-400" /> condition: {entry.condition}
                    </div>
                  )}
                  {entry.reason && (
                    <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded text-[0.65rem] font-bold text-slate-500 mt-2">
                      <Info className="w-3 h-3 text-slate-400" /> reason: {entry.reason}
                    </div>
                  )}
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
