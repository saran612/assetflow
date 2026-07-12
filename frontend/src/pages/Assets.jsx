import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, ChevronDown, MapPin, 
  Laptop, Projector, Sofa, ChevronLeft, ChevronRight,
  Archive, CheckSquare, Wrench, CheckCircle2,
  Download, Printer, SlidersHorizontal
} from 'lucide-react';

// initialAssets moved to AppContext

import Modal from '../components/Modal';
import { useAppContext } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';

export default function Assets() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { assets, addAsset } = useAppContext();
  const { showToast } = useToast();
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', tag: '', category: 'Electronics', status: 'Available', location: '' });
  
  // Filter State
  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilter = (filter) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      addAsset(formData);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFormData({ name: '', tag: '', category: 'Electronics', status: 'Available', location: '' });
      showToast('Asset registered successfully!', 'success');
    }, 800);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Allocated': return 'bg-indigo-100 text-[#2b1fcc]';
      case 'Maintenance': return 'bg-orange-100 text-orange-600';
      case 'Available': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div 
      className="max-w-[1200px] mx-auto flex flex-col gap-5 animate-[fadeIn_0.3s_ease-out]"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex justify-between items-center">
        <div>
          <h2 className="text-[2rem] font-extrabold text-slate-800 tracking-tight leading-tight">Asset Directory</h2>
          <p className="text-[0.95rem] text-slate-500 mt-1 font-medium">Manage and track all registered assets across the organization.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2b1fcc] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-[#2015a3] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center gap-2 tracking-wide"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Register Asset
        </button>
      </div>

      {/* Search Toolbar Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
        <div className="relative group w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#2b1fcc] transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tag, serial, or QR code.." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#2b1fcc]"
          />
        </div>
        <div className="flex items-center gap-3">
          {['Category', 'Status', 'Department'].map((filter) => (
            <button 
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border
                ${activeFilters.includes(filter) 
                  ? 'bg-indigo-50 border-indigo-200 text-[#2b1fcc]' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
            >
              {filter} <ChevronDown className={`w-4 h-4 ${activeFilters.includes(filter) ? 'text-[#2b1fcc]' : 'text-slate-400'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Total Assets', value: '1,248', icon: Archive, bg: 'bg-indigo-100', color: 'text-indigo-500' },
          { label: 'Currently Allocated', value: '856', icon: CheckSquare, bg: 'bg-blue-50', color: 'text-blue-500' },
          { label: 'In Maintenance', value: '42', icon: Wrench, bg: 'bg-orange-50', color: 'text-orange-500' },
          { label: 'Available', value: '350', icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-500' },
        ].map((metric, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${metric.bg} ${metric.color}`}>
              <metric.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 tracking-wide mb-1">{metric.label}</p>
              <h3 className="text-2xl font-extrabold text-slate-900 leading-none">{metric.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Table Header Toolbar */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <h3 className="text-[1.1rem] font-bold text-slate-800">Assets List</h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Density
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="py-4 px-6 text-[0.75rem] font-extrabold text-slate-400 tracking-wide w-[12%]">Tag</th>
                <th className="py-4 px-6 text-[0.75rem] font-extrabold text-slate-400 tracking-wide w-[25%]">Name</th>
                <th className="py-4 px-6 text-[0.75rem] font-extrabold text-slate-400 tracking-wide w-[18%]">Category</th>
                <th className="py-4 px-6 text-[0.75rem] font-extrabold text-slate-400 tracking-wide w-[15%]">Status</th>
                <th className="py-4 px-6 text-[0.75rem] font-extrabold text-slate-400 tracking-wide w-[15%]">Location</th>
                <th className="py-4 px-6 text-[0.75rem] font-extrabold text-slate-400 tracking-wide w-[15%]">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {assets.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.tag.toLowerCase().includes(searchQuery.toLowerCase())).map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors duration-150 group cursor-pointer">
                  <td className="py-6 px-6">
                    <span className="font-bold text-slate-700 text-[0.8rem]">{asset.tag}</span>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${asset.iconBg}`}>
                        <asset.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-700 text-[0.9rem]">{asset.name}</span>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-[0.85rem] font-medium text-slate-500">{asset.category}</td>
                  <td className="py-6 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[0.7rem] font-extrabold tracking-wide ${getStatusStyle(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[0.85rem] font-medium">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="capitalize">{asset.location}</span>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-[0.85rem] font-medium text-slate-500">
                    {asset.lastSeen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-white">
          <p className="text-[0.75rem] font-bold text-slate-400 tracking-wide">Showing 1 to 3 of 45 entries</p>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 text-[0.75rem] font-bold text-slate-300 transition-colors disabled:opacity-50" disabled>
              Prev
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-[#2b1fcc] text-white text-[0.75rem] font-bold shadow-sm">
              1
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 text-[0.75rem] font-bold hover:bg-slate-50 hover:border-slate-300 transition-all">
              2
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 text-[0.75rem] font-bold text-slate-500 hover:text-slate-900 transition-colors">
              Next
            </button>
          </div>
        </div>

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Asset">
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Asset Name</label>
            <input 
              type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Asset Tag</label>
              <input 
                type="text" required value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <select 
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicles">Vehicles</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
              <input 
                type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
              <select 
                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
              >
                <option value="Available">Available</option>
                <option value="Allocated">Allocated</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-3 justify-end">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-6 py-2 text-sm font-bold text-white bg-[#2b1fcc] hover:bg-[#2015a3] rounded-lg transition-all shadow-sm ${isSubmitting ? 'opacity-80' : ''}`}
            >
              {isSubmitting ? 'Processing...' : 'Register Asset'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
