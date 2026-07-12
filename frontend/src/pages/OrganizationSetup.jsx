import React, { useState, useEffect } from 'react';
import {
  Building2, Users, ArrowDownToLine, Search, Filter, 
  Plus, Edit2, MoreVertical, Info, X
} from 'lucide-react';

// Initial Mock Data
const initialDepartments = [
  { id: 1, name: 'ENGINEERING', headName: 'aditi rao', headTitle: 'Engineering Dir.', avatar: '32', parentDept: '--', status: 'Active', date: 'Oct 24, 2023', color: 'bg-[#2b1fcc]', nested: false },
  { id: 2, name: 'FACILITIES', headName: 'rohan mehta', headTitle: 'Operations Lead', avatar: '12', parentDept: '--', status: 'Active', date: 'Oct 22, 2023', color: 'bg-slate-400', nested: false },
  { id: 3, name: 'FIELD OPS (EAST)', headName: 'sana iqbal', headTitle: 'Field Coordinator', avatar: '5', parentDept: 'Field Ops', status: 'Inactive', date: 'Sep 15, 2023', color: 'bg-slate-400', nested: true }
];

const initialCategories = [
  { id: 1, name: 'IT EQUIPMENT', items: 452, status: 'Active', date: 'Oct 24, 2023', color: 'bg-indigo-500' },
  { id: 2, name: 'VEHICLES', items: 84, status: 'Active', date: 'Oct 20, 2023', color: 'bg-emerald-500' },
  { id: 3, name: 'OFFICE FURNITURE', items: 1205, status: 'Active', date: 'Oct 15, 2023', color: 'bg-amber-500' }
];

const initialEmployees = [
  { id: 1, name: 'alex sterling', title: 'Operations Dir.', dept: 'Facilities', email: 'alex@assetflow.co', status: 'Active', avatar: '11' },
  { id: 2, name: 'sana iqbal', title: 'Field Coordinator', dept: 'Field Ops', email: 'sana@assetflow.co', status: 'On Leave', avatar: '5' },
  { id: 3, name: 'rohan mehta', title: 'Operations Lead', dept: 'Facilities', email: 'rohan@assetflow.co', status: 'Active', avatar: '12' }
];

import { useToast } from '../contexts/ToastContext';

export default function OrganizationSetup() {
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Departments');
  
  // Data State
  const [departments, setDepartments] = useState(initialDepartments);
  const [categories, setCategories] = useState(initialCategories);
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingDept, setEditingDept] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', headName: '', headTitle: '', parentDept: '--', status: 'Active' });

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredDepartments = departments.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.headName.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredEmployees = employees.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.dept.toLowerCase().includes(searchQuery.toLowerCase()));

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', headName: '', headTitle: '', parentDept: '--', status: 'Active' });
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setModalMode('edit');
    setEditingDept(dept);
    setFormData({ ...dept });
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (modalMode === 'add') {
        const newDept = {
          ...formData,
          id: Date.now(),
          avatar: Math.floor(Math.random() * 50).toString(),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          color: 'bg-indigo-500',
          nested: false
        };
        setDepartments([...departments, newDept]);
        showToast('Department added successfully', 'success');
      } else {
        setDepartments(departments.map(d => d.id === editingDept.id ? { ...d, ...formData } : d));
        showToast('Department updated successfully', 'success');
      }
      setIsSubmitting(false);
      setIsModalOpen(false);
    }, 800);
  };

  return (
    <>
      {/* Top Navigation Row */}
      <header className="flex items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Organization Setup</h2>
        <div className="h-6 w-px bg-slate-300 mx-6"></div>
        
        <div className="flex items-center bg-slate-200/60 p-1 rounded-full shadow-inner relative">
          {['Departments', 'Categories', 'Employee'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 transform ${
                activeTab === tab 
                  ? 'bg-white text-[#2b1fcc] shadow-sm scale-100' 
                  : 'text-slate-600 hover:text-slate-900 scale-95 hover:scale-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area depends on Active Tab */}
      {activeTab === 'Departments' ? (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          {/* Metric Cards Row */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { title: 'TOTAL DEPARTMENTS', value: departments.length.toString(), icon: Building2, colorClass: 'text-[#2b1fcc]', bgClass: 'bg-indigo-100' },
              { title: 'ACTIVE HEADS', value: departments.filter(d => d.status === 'Active').length.toString(), icon: Users, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-100' },
              { title: 'PENDING SYNCS', value: '0', icon: ArrowDownToLine, colorClass: 'text-slate-600', bgClass: 'bg-slate-200' },
            ].map((metric, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex items-center gap-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
                style={{
                  transitionDelay: `${idx * 100}ms`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(15px)'
                }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${metric.bgClass} ${metric.colorClass}`}>
                  <metric.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[0.7rem] font-bold text-slate-500 tracking-wider uppercase mb-1">{metric.title}</h3>
                  <div className="text-3xl font-extrabold text-slate-900 leading-none">{metric.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#2b1fcc] transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search departments..." 
                className="w-80 bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-[#2b1fcc] shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-50 hover:shadow transition-all duration-200 active:scale-95">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 bg-[#2b1fcc] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/30 hover:bg-[#2015a3] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95 animate-pulse-soft"
              >
                <Plus className="w-4 h-4" /> Add Department
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[25%]">Department</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[25%]">Head</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[15%]">Parent Dept</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[15%]">Status</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[15%]">Last Modified</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[5%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDepartments.length === 0 ? (
                     <tr>
                       <td colSpan={6} className="py-8 text-center text-slate-500">No departments found matching your search.</td>
                     </tr>
                  ) : filteredDepartments.map((dept, idx) => (
                    <tr key={dept.id} className="group hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer">
                      <td className="py-4 px-6">
                        <div className={`flex items-center gap-3 ${dept.nested ? 'pl-6 relative' : ''}`}>
                          {dept.nested && (
                            <>
                              <div className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-px bg-slate-300"></div>
                              <div className="absolute left-1 bottom-1/2 w-px h-10 bg-slate-300"></div>
                            </>
                          )}
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dept.color}`}></div>
                          <span className="font-bold text-slate-900 text-sm tracking-tight leading-tight uppercase">
                            {dept.name.replace('(EAST)', '')}
                            {dept.name.includes('(EAST)') && <><br/><span className="text-slate-500">(EAST)</span></>}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={`https://i.pravatar.cc/150?img=${dept.avatar}`} alt={dept.headName} className={`w-8 h-8 rounded-full shadow-sm ${dept.status === 'Inactive' ? 'grayscale opacity-80' : ''}`} />
                          <div>
                            <div className="font-semibold text-slate-900 text-sm capitalize">{dept.headName}</div>
                            <div className="text-[0.7rem] text-slate-500 leading-tight">{dept.headTitle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">{dept.parentDept}</td>
                      <td className="py-4 px-6">
                        {dept.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold group-hover:shadow-sm group-hover:saturate-150 transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold group-hover:shadow-sm transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">{dept.date}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEditModal(dept); }}
                            className="p-1.5 text-slate-400 hover:text-[#2b1fcc] hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); alert(`More options for ${dept.name}`); }}
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alert Box */}
          <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-5 flex items-start gap-3 shadow-sm"
               style={{
                  transitionDelay: '400ms',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(15px)'
               }}>
            <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900">System Note:</span> Editing a department here also drives the picklist in Screen 4 & 5. Ensure all hierarchies are validated before synchronization.
            </p>
          </div>
        </div>
      ) : activeTab === 'Categories' ? (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center justify-between mb-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#2b1fcc] transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..." 
                className="w-80 bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-[#2b1fcc] shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-[#2b1fcc] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/30 hover:bg-[#2015a3] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95 animate-pulse-soft">
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[40%]">Category Name</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[20%]">Total Items</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[15%]">Status</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[20%]">Last Modified</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[5%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.length === 0 ? (
                     <tr><td colSpan={5} className="py-8 text-center text-slate-500">No categories found matching your search.</td></tr>
                  ) : filteredCategories.map((cat) => (
                    <tr key={cat.id} className="group hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                          <span className="font-bold text-slate-900 text-sm tracking-tight uppercase">{cat.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-700">{cat.items}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold group-hover:shadow-sm group-hover:saturate-150 transition-all">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {cat.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">{cat.date}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button onClick={(e) => { e.stopPropagation(); alert('Edit category'); }} className="p-1.5 text-slate-400 hover:text-[#2b1fcc] hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={(e) => { e.stopPropagation(); alert('More options'); }} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center justify-between mb-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#2b1fcc] transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employees..." 
                className="w-80 bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-[#2b1fcc] shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-[#2b1fcc] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/30 hover:bg-[#2015a3] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95 animate-pulse-soft">
                <Plus className="w-4 h-4" /> Add Employee
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[35%]">Employee Name</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[25%]">Contact</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[20%]">Department</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[15%]">Status</th>
                    <th className="py-4 px-6 text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider w-[5%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.length === 0 ? (
                     <tr><td colSpan={5} className="py-8 text-center text-slate-500">No employees found matching your search.</td></tr>
                  ) : filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="group hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={`https://i.pravatar.cc/150?img=${emp.avatar}`} alt={emp.name} className="w-9 h-9 rounded-full shadow-sm" />
                          <div>
                            <div className="font-semibold text-slate-900 text-sm capitalize">{emp.name}</div>
                            <div className="text-[0.75rem] text-slate-500">{emp.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">{emp.email}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-700">{emp.dept}</td>
                      <td className="py-4 px-6">
                        {emp.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold group-hover:shadow-sm group-hover:saturate-150 transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold group-hover:shadow-sm transition-all">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> On Leave
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button onClick={(e) => { e.stopPropagation(); alert('Edit employee'); }} className="p-1.5 text-slate-400 hover:text-[#2b1fcc] hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={(e) => { e.stopPropagation(); alert('More options'); }} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[slideUp_0.3s_ease-out]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {modalMode === 'add' ? 'Add New Department' : 'Edit Department'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleModalSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department Name</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Head Name</label>
                  <input 
                    type="text" required
                    value={formData.headName} onChange={e => setFormData({...formData, headName: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Head Title</label>
                  <input 
                    type="text" required
                    value={formData.headTitle} onChange={e => setFormData({...formData, headTitle: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Parent Dept</label>
                  <select 
                    value={formData.parentDept} onChange={e => setFormData({...formData, parentDept: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
                  >
                    <option value="--">-- (None)</option>
                    <option value="Field Ops">Field Ops</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-sm font-semibold text-white bg-[#2b1fcc] hover:bg-[#2015a3] rounded-lg transition-colors shadow-sm ${isSubmitting ? 'opacity-80' : ''}`}
                >
                  {isSubmitting ? 'Processing...' : (modalMode === 'add' ? 'Create' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(0.98); box-shadow: 0 4px 14px 0 rgba(43, 31, 204, 0.39); }
        }
        .animate-pulse-soft {
          animation: pulse-soft 3s infinite ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
