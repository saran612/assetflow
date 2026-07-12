import React, { useState, useEffect } from 'react';
import {
  Building2, Users, ArrowDownToLine, Search, Filter, 
  Plus, Edit2, MoreVertical, Info
} from 'lucide-react';

export default function OrganizationSetup() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Top Navigation Row */}
      <header className="flex items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Organization Setup</h2>
        <div className="h-6 w-px bg-slate-300 mx-6"></div>
        
        <div className="flex items-center bg-slate-200/60 p-1 rounded-full shadow-inner">
          <button className="px-5 py-1.5 text-sm font-semibold text-[#2b1fcc] bg-white rounded-full shadow-sm transition-all duration-300 transform scale-100">
            Departments
          </button>
          <button className="px-5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200">
            Categories
          </button>
          <button className="px-5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200">
            Employee
          </button>
        </div>
      </header>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { title: 'TOTAL DEPARTMENTS', value: '12', icon: Building2, colorClass: 'text-[#2b1fcc]', bgClass: 'bg-indigo-100' },
          { title: 'ACTIVE HEADS', value: '9', icon: Users, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-100' },
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
            placeholder="Search departments..." 
            className="w-80 bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-[#2b1fcc] shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-50 hover:shadow transition-all duration-200 active:scale-95">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-[#2b1fcc] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/30 hover:bg-[#2015a3] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95 animate-pulse-soft">
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
              
              {/* Row 1 */}
              <tr className="group hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#2b1fcc]"></div>
                    <span className="font-bold text-slate-900 text-sm tracking-tight">ENGINEERING</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=32" alt="aditi rao" className="w-8 h-8 rounded-full shadow-sm" />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">aditi rao</div>
                      <div className="text-[0.7rem] text-slate-500 leading-tight">Engineering Dir.</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500">--</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold group-hover:shadow-sm group-hover:saturate-150 transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500">Oct 24, 2023</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="p-1.5 text-slate-400 hover:text-[#2b1fcc] hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="group hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <span className="font-bold text-slate-900 text-sm tracking-tight">FACILITIES</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=12" alt="rohan mehta" className="w-8 h-8 rounded-full shadow-sm" />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">rohan mehta</div>
                      <div className="text-[0.7rem] text-slate-500 leading-tight">Operations Lead</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500">--</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold group-hover:shadow-sm group-hover:saturate-150 transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500">Oct 22, 2023</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="p-1.5 text-slate-400 hover:text-[#2b1fcc] hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>

              {/* Row 3 (Nested) */}
              <tr className="group hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3 pl-6 relative">
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-px bg-slate-300"></div>
                    <div className="absolute left-1 bottom-1/2 w-px h-10 bg-slate-300"></div>
                    
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <span className="font-bold text-slate-900 text-sm tracking-tight leading-tight">FIELD OPS<br/><span className="text-slate-500">(EAST)</span></span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=5" alt="sana iqbal" className="w-8 h-8 rounded-full shadow-sm grayscale opacity-80" />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">sana iqbal</div>
                      <div className="text-[0.7rem] text-slate-500 leading-tight">Field Coordinator</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-700 font-medium">Field Ops</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold group-hover:shadow-sm transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Inactive
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-slate-500">Sep 15, 2023</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="p-1.5 text-slate-400 hover:text-[#2b1fcc] hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>

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

      <style>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(0.98); box-shadow: 0 4px 14px 0 rgba(43, 31, 204, 0.39); }
        }
        .animate-pulse-soft {
          animation: pulse-soft 3s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}
