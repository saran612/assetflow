import React, { useState, useEffect, useRef } from 'react';
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
import { useDebounce } from '../utils/hooks';
import { apiCall } from '../utils/api';

export default function Assets() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { assets, addAsset, loadAssets } = useAppContext();
  const { showToast } = useToast();
  
  const [kpis, setKpis] = useState({ total_assets: 0, allocated_assets: 0, maintenance_assets: 0, available_assets: 0 });
  const [selectedAssetDetail, setSelectedAssetDetail] = useState(null);

  const handleStatusChangeInDetail = async (newStatus) => {
    try {
      await apiCall(`/assets/${selectedAssetDetail.id}/status`, 'PATCH', { status: newStatus });
      showToast(`Asset status successfully updated to ${newStatus}`, 'success');
      await loadAssets();
      setSelectedAssetDetail(prev => ({
        ...prev,
        status: newStatus === 'under_maintenance' ? 'Maintenance' : newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
      }));
      await loadKpis();
    } catch (err) {
      showToast(err.message || 'Failed to update asset status', 'error');
    }
  };

  const loadKpis = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const data = await apiCall('/dashboard/kpis');
      setKpis(data);
    } catch (err) {
      console.error('Failed to load KPIs:', err);
    }
  };

  useEffect(() => {
    loadAssets();
    loadKpis();
  }, []);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', tag: '', category: 'Electronics', status: 'Available', location: '' });
  
  // Filter State
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  
  // Pagination & Display State
  const [currentPage, setCurrentPage] = useState(1);
  const [density, setDensity] = useState('normal');

  // Debounced search — input state updates immediately for the user,
  // but the filtered list only recomputes after 300ms of inactivity.
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Dynamic categories and departments extraction
  const uniqueCategories = ['All', ...new Set(assets.map(a => a.category).filter(Boolean))];
  const uniqueDepartments = ['All', ...new Set(assets.map(a => a.department).filter(Boolean))];

  // Compute Filtered and Paginated Data
  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || a.tag.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || a.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || a.department === departmentFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesDept;
  });

  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / itemsPerPage));
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportCSV = () => {
    const headers = ['Tag', 'Name', 'Category', 'Status', 'Location', 'Last Seen'];
    const csvContent = [
      headers.join(','),
      ...filteredAssets.map(a => `${a.tag},${a.name},${a.category},${a.status},${a.location},${a.lastSeen}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'assets_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV successfully', 'success');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addAsset(formData);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFormData({ name: '', tag: '', category: 'Electronics', status: 'Available', location: '' });
      showToast('Asset registered successfully!', 'success');
      loadKpis();
    } catch (err) {
      setIsSubmitting(false);
      showToast(err.message || 'Failed to register asset', 'error');
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, categoryFilter, statusFilter, departmentFilter]);

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
          <select 
            value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full text-sm font-semibold bg-slate-50 border border-slate-200 text-slate-600 outline-none hover:bg-slate-100 focus:ring-2 focus:ring-[#2b1fcc]/20 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1.41%200L6%204.58L10.59%200L12%201.41L6%207.41L0%201.41L1.41%200Z%22%20fill%3D%22%2394a3b8%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_8px] bg-[position:calc(100%-12px)_center] bg-no-repeat pr-8"
          >
            <option value="All">All Categories</option>
            {uniqueCategories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select 
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full text-sm font-semibold bg-slate-50 border border-slate-200 text-slate-600 outline-none hover:bg-slate-100 focus:ring-2 focus:ring-[#2b1fcc]/20 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1.41%200L6%204.58L10.59%200L12%201.41L6%207.41L0%201.41L1.41%200Z%22%20fill%3D%22%2394a3b8%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_8px] bg-[position:calc(100%-12px)_center] bg-no-repeat pr-8"
          >
            <option value="All">Status</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <select 
            value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full text-sm font-semibold bg-slate-50 border border-slate-200 text-slate-600 outline-none hover:bg-slate-100 focus:ring-2 focus:ring-[#2b1fcc]/20 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1.41%200L6%204.58L10.59%200L12%201.41L6%207.41L0%201.41L1.41%200Z%22%20fill%3D%22%2394a3b8%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_8px] bg-[position:calc(100%-12px)_center] bg-no-repeat pr-8"
          >
            <option value="All">All Departments</option>
            {uniqueDepartments.filter(d => d !== 'All').map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Total Assets', value: kpis.total_assets || 0, icon: Archive, bg: 'bg-indigo-100', color: 'text-indigo-500' },
          { label: 'Currently Allocated', value: kpis.allocated_assets || 0, icon: CheckSquare, bg: 'bg-blue-50', color: 'text-blue-500' },
          { label: 'In Maintenance', value: kpis.maintenance_assets || 0, icon: Wrench, bg: 'bg-orange-50', color: 'text-orange-500' },
          { label: 'Available', value: kpis.available_assets || 0, icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-500' },
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
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button 
              onClick={() => setDensity(d => d === 'normal' ? 'compact' : 'normal')}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> {density === 'normal' ? 'Compact' : 'Normal'}
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
              {paginatedAssets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">No assets found matching your criteria.</td>
                </tr>
              ) : paginatedAssets.map((asset) => (
                <tr 
                  key={asset.id} 
                  onClick={() => setSelectedAssetDetail(asset)}
                  className="hover:bg-slate-50/50 transition-colors duration-150 group cursor-pointer"
                >
                  <td className={`px-6 ${density === 'compact' ? 'py-3' : 'py-6'}`}>
                    <span className="font-bold text-slate-700 text-[0.8rem]">{asset.tag}</span>
                  </td>
                  <td className={`px-6 ${density === 'compact' ? 'py-3' : 'py-6'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${asset.iconBg}`}>
                        <asset.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-700 text-[0.9rem]">{asset.name}</span>
                    </div>
                  </td>
                  <td className={`px-6 text-[0.85rem] font-medium text-slate-500 ${density === 'compact' ? 'py-3' : 'py-6'}`}>{asset.category}</td>
                  <td className={`px-6 ${density === 'compact' ? 'py-3' : 'py-6'}`}>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[0.7rem] font-extrabold tracking-wide ${getStatusStyle(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className={`px-6 ${density === 'compact' ? 'py-3' : 'py-6'}`}>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[0.85rem] font-medium">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="capitalize">{asset.location}</span>
                    </div>
                  </td>
                  <td className={`px-6 text-[0.85rem] font-medium text-slate-500 ${density === 'compact' ? 'py-3' : 'py-6'}`}>
                    {asset.lastSeen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-white">
          <p className="text-[0.75rem] font-bold text-slate-400 tracking-wide">
            Showing {filteredAssets.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAssets.length)} of {filteredAssets.length} entries
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-[0.75rem] font-bold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-30"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 flex items-center justify-center rounded text-[0.75rem] font-bold transition-all shadow-sm
                  ${currentPage === i + 1 
                    ? 'bg-[#2b1fcc] text-white' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-[0.75rem] font-bold text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-30"
            >
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

      {/* Asset Detail Modal */}
      {selectedAssetDetail && (
        <Modal 
          isOpen={!!selectedAssetDetail} 
          onClose={() => setSelectedAssetDetail(null)} 
          title="Asset Detailed Information"
        >
          <div className="flex flex-col gap-6">
            
            {/* Header Info */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 text-[#2b1fcc] rounded-xl flex items-center justify-center">
                <Laptop className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-extrabold text-slate-800 truncate">{selectedAssetDetail.name}</h4>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Serial: {selectedAssetDetail.tag}</p>
              </div>
            </div>

            {/* Grid Attributes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/20">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wide">Category</span>
                <p className="text-sm font-bold text-slate-700 mt-1">{selectedAssetDetail.category}</p>
              </div>
              <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/20">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wide">Current Status</span>
                <p className="text-sm font-bold text-slate-700 mt-1">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${getStatusStyle(selectedAssetDetail.status)}`}>
                    {selectedAssetDetail.status}
                  </span>
                </p>
              </div>
              <div className="border border-slate-100 p-3 rounded-lg bg-slate-50/20 col-span-2">
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wide">Location / Custodian</span>
                <p className="text-sm font-bold text-slate-700 mt-1 capitalize">{selectedAssetDetail.location || 'Warehouse'}</p>
              </div>
            </div>

            {/* Related Actions */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Related Actions</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAssetDetail.status?.toLowerCase() !== 'available' && (
                  <button 
                    onClick={() => handleStatusChangeInDetail('available')}
                    className="px-3.5 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100"
                  >
                    Set Available
                  </button>
                )}
                {selectedAssetDetail.status?.toLowerCase() !== 'under_maintenance' && selectedAssetDetail.status?.toLowerCase() !== 'maintenance' && (
                  <button 
                    onClick={() => handleStatusChangeInDetail('under_maintenance')}
                    className="px-3.5 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100"
                  >
                    Send to Maintenance
                  </button>
                )}
                {selectedAssetDetail.status?.toLowerCase() !== 'retired' && (
                  <button 
                    onClick={() => handleStatusChangeInDetail('retired')}
                    className="px-3.5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
                  >
                    Retire Asset
                  </button>
                )}
                {selectedAssetDetail.status?.toLowerCase() !== 'disposed' && (
                  <button 
                    onClick={() => handleStatusChangeInDetail('disposed')}
                    className="px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                  >
                    Dispose Asset
                  </button>
                )}
              </div>
            </div>

          </div>
        </Modal>
      )}
    </div>
  );
}
