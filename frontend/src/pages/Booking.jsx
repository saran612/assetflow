import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  AlertTriangle, Building2, ArrowRight 
} from 'lucide-react';

import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

export default function Booking() {
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ date: '2026-07-07', startTime: '10:30', endTime: '11:30', title: '' });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFormData({ date: '2026-07-07', startTime: '10:30', endTime: '11:30', title: '' });
      showToast('Slot booked successfully!', 'success');
    }, 800);
  };

  return (
    <div 
      className="max-w-[1100px] mx-auto animate-[fadeIn_0.3s_ease-out]"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      
      {/* Header & Mini Metrics Row */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[2.2rem] font-extrabold text-slate-900 tracking-tight leading-tight">Resource Booking</h2>
          <p className="text-[0.95rem] text-slate-500 mt-1 font-medium">Manage availability and resolve scheduling conflicts.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-3 px-5 flex flex-col items-center justify-center shadow-sm min-w-[90px]">
            <span className="text-[0.65rem] font-extrabold text-slate-400 tracking-widest uppercase mb-1">Today</span>
            <span className="text-2xl font-extrabold text-[#2b1fcc] leading-none">24</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 px-5 flex flex-col items-center justify-center shadow-sm min-w-[90px]">
            <span className="text-[0.65rem] font-extrabold text-slate-400 tracking-widest uppercase mb-1">Occupancy</span>
            <span className="text-2xl font-extrabold text-slate-900 leading-none">82%</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 px-5 flex flex-col items-center justify-center shadow-sm min-w-[90px]">
            <span className="text-[0.65rem] font-extrabold text-red-500 tracking-widest uppercase mb-1">Pending</span>
            <span className="text-2xl font-extrabold text-red-600 leading-none">3</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Left Column (Calendar & Selection) */}
        <div className="col-span-2 flex flex-col gap-6">
          
          {/* Resource Selector */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <label className="block text-xs font-bold text-slate-500 mb-2">Resource</label>
            <div className="relative cursor-pointer">
              <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-3 text-sm font-medium text-slate-800 outline-none hover:border-slate-300 focus:ring-4 focus:ring-indigo-500/10 focus:border-[#2b1fcc] transition-all shadow-sm cursor-pointer">
                <option>Conference room B2 - Tue, 7 Jul</option>
                <option>Huddle Room C - Tue, 7 Jul</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Calendar View */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
            
            {/* Calendar Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-[#2b1fcc]" />
                <h3 className="text-[1.1rem] font-bold text-slate-800">Tuesday, July 7</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-slate-400">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-slate-400">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative p-6 min-h-[400px]">
              
              {/* Background Grid Lines */}
              <div className="absolute inset-0 p-6 pointer-events-none flex flex-col justify-between">
                {['9:00', '10:00', '11:00', '12:00', '1:00'].map((time) => (
                  <div key={time} className="flex items-center w-full h-[60px] relative">
                    <span className="w-12 text-xs font-semibold text-slate-400">{time}</span>
                    <div className="flex-1 h-px bg-slate-100"></div>
                  </div>
                ))}
              </div>

              {/* Events overlay */}
              <div className="absolute top-6 left-[80px] right-6 h-full pointer-events-none">
                
                {/* Booked Block */}
                <div className="absolute top-[8px] left-0 w-[45%] h-[45px] bg-blue-100/80 border border-blue-200 rounded-lg p-2.5 pointer-events-auto cursor-pointer hover:shadow-md transition-shadow">
                  <h4 className="text-[0.7rem] font-bold text-[#2b1fcc] leading-tight">Booked - Procurement Team - 9 to 10</h4>
                  <p className="text-[0.6rem] text-blue-500 font-semibold mt-0.5">Recurring Weekly</p>
                </div>

                {/* Conflict Block */}
                <div className="absolute top-[30px] right-[5%] w-[48%] h-[60px] bg-red-50/90 border-[1.5px] border-dashed border-red-400 rounded-lg p-2.5 pointer-events-auto flex items-start gap-2 z-10 animate-pulse-conflict">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[0.7rem] font-bold text-red-600 leading-tight mb-0.5">Requested 9:30 to 10:30 - conflict - slot is unavailable</h4>
                    <p className="text-[0.6rem] text-red-500 font-semibold line-through decoration-red-400">Action required to resolve overlap</p>
                  </div>
                </div>

              </div>
              
              {/* Spacer for timeline layout */}
              <div className="h-[240px]"></div>

            </div>

            {/* Action Footer */}
            <div className="p-5 border-t border-slate-50 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#2b1fcc] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 hover:bg-[#2015a3] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
              >
                + Book a slot
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Alternatives) */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-slate-700" />
              <h3 className="text-base font-extrabold text-slate-800">Quick Alternatives</h3>
            </div>

            <div className="flex flex-col gap-4">
              
              <div className="border border-slate-100 hover:border-[#2b1fcc]/30 hover:shadow-md rounded-xl p-4 transition-all cursor-pointer group relative overflow-hidden bg-white">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#2b1fcc] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800 text-[0.85rem]">Huddle Room C</h4>
                    <p className="text-[0.75rem] text-slate-500 font-medium mt-0.5">Capacity: 4 • Avail now</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#2b1fcc] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="border border-slate-100 hover:border-[#2b1fcc]/30 hover:shadow-md rounded-xl p-4 transition-all cursor-pointer group relative overflow-hidden bg-white">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#2b1fcc] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800 text-[0.85rem]">Boardroom East</h4>
                    <p className="text-[0.75rem] text-slate-500 font-medium mt-0.5">Capacity: 12 • Avail 10:30</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book Resource Slot">
        <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Meeting Title</label>
            <input 
              type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Q3 Planning"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
            <input 
              type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Start Time</label>
              <input 
                type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">End Time</label>
              <input 
                type="time" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3 justify-end">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-6 py-2 text-sm font-bold text-white bg-[#2b1fcc] hover:bg-[#2015a3] rounded-lg transition-all shadow-sm ${isSubmitting ? 'opacity-80' : ''}`}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </Modal>

      <style>{`
        @keyframes pulse-conflict {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.4);
            border-color: rgba(248, 113, 113, 0.5);
          }
          50% {
            box-shadow: 0 0 15px 5px rgba(248, 113, 113, 0.15);
            border-color: rgba(248, 113, 113, 1);
          }
        }
        .animate-pulse-conflict {
          animation: pulse-conflict 2.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
