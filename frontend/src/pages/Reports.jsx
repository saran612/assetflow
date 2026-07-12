import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, MoreVertical, HelpCircle, 
  Settings, Clock, Calendar, AlertCircle, Hourglass
} from 'lucide-react';

const barData = [
  { label: 'Eng', value: 285, height: '60%', color: 'bg-indigo-300' },
  { label: 'Ops', value: 452, height: '95%', color: 'bg-[#2b1fcc]', hasShadow: true },
  { label: 'Sales', value: 238, height: '50%', color: 'bg-indigo-400' },
  { label: 'Mkt', value: 143, height: '30%', color: 'bg-indigo-200' },
];

const linePoints = [
  { label: 'Jan', value: 8,  x: 0,   y: 35 },
  { label: 'Feb', value: 12, x: 20,  y: 30 },
  { label: 'Mar', value: 18, x: 40,  y: 22 },
  { label: 'Apr', value: 24, x: 60,  y: 15 },
  { label: 'May', value: 32, x: 80,  y: 9 },
  { label: 'Jun', value: 38, x: 100, y: 5 },
];

export default function Reports() {
  const [mounted, setMounted] = useState(false);
  const [hoveredBarIdx, setHoveredBarIdx] = useState(null);
  const [hoveredPointIdx, setHoveredPointIdx] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLineHover = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    let nearestIdx = 0;
    let minDist = Infinity;
    linePoints.forEach((pt, idx) => {
      const dist = Math.abs(xRatio - pt.x / 100);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = idx;
      }
    });
    setHoveredPointIdx(nearestIdx);
  }, []);

  return (
    <div 
      className="max-w-[1200px] mx-auto flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[2rem] font-extrabold text-slate-900 tracking-tight leading-tight">Reports & Analytics</h2>
        <p className="text-[0.95rem] text-slate-500 mt-1 font-medium">Gain insights into asset utilization, health, and maintenance trends.</p>
      </div>

      {/* Top Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Assets by Department (Bar Chart Mock) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-80 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Assets by Department</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
          </div>
          
          <div className="flex-1 flex items-end justify-between px-4 gap-4 relative mt-4">
            {/* Background grid lines */}
            <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-slate-100/80 w-full h-0"></div>
              <div className="border-b border-slate-100/80 w-full h-0"></div>
              <div className="border-b border-slate-100/80 w-full h-0"></div>
              <div className="border-b border-slate-100/80 w-full h-0"></div>
            </div>
 
            {/* Bars */}
            <div className="w-full flex justify-between items-end h-full z-10 pb-2">
              {barData.map((bar, idx) => (
                <div 
                  key={idx}
                  className={`w-1/5 bg-gradient-to-t from-[#2b1fcc] to-indigo-400 rounded-t-lg cursor-pointer relative transition-all duration-300`}
                  style={{ 
                    height: bar.height,
                    opacity: hoveredBarIdx !== null && hoveredBarIdx !== idx ? 0.35 : 1,
                    transform: hoveredBarIdx === idx ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'bottom',
                    boxShadow: hoveredBarIdx === idx ? '0 10px 25px -5px rgba(99, 102, 241, 0.45)' : 'none'
                  }}
                  onMouseEnter={() => setHoveredBarIdx(idx)}
                  onMouseLeave={() => setHoveredBarIdx(null)}
                >
                  {hoveredBarIdx === idx && (
                    <div className="absolute -top-12 left-1/2 pointer-events-none z-20" style={{ transform: 'translateX(-50%)' }}>
                      <div className="bg-slate-900 text-white text-[0.7rem] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-slate-800/80 flex flex-col items-center">
                        <span className="text-slate-400 text-[0.6rem] font-semibold">Allocated</span>
                        <span>{bar.value} Units</span>
                      </div>
                      <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #0f172a', margin: '0 auto' }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between px-6 pt-3 text-[0.7rem] font-bold text-slate-400 border-t border-slate-100 mt-2">
            {barData.map((bar, idx) => (
              <span 
                key={idx}
                style={{
                  color: hoveredBarIdx === idx ? '#2b1fcc' : undefined,
                  fontWeight: hoveredBarIdx === idx ? 800 : undefined,
                  transition: 'color 0.15s'
                }}
              >
                {bar.label}
              </span>
            ))}
          </div>
        </div>
 
        {/* Maintenance Frequency (Line Chart Mock) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-80 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Maintenance Frequency</h3>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> +12% this week
            </span>
          </div>
 
          <div className="flex-1 relative w-full h-full mt-4 flex flex-col">
            <div 
              className="flex-1 w-full relative"
              onMouseMove={handleLineHover}
              onMouseLeave={() => setHoveredPointIdx(null)}
              style={{ cursor: 'crosshair' }}
            >
              {/* Grid Lines */}
              <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none z-0">
                <div className="border-b border-slate-100/70 w-full h-0"></div>
                <div className="border-b border-slate-100/70 w-full h-0"></div>
                <div className="border-b border-slate-100/70 w-full h-0"></div>
                <div className="border-b border-slate-100/70 w-full h-0"></div>
              </div>

              <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" stopColor-red="16" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Smooth Area Spline */}
                <path d="M0,35 C20,33 30,22 40,22 C50,22 60,12 80,9 C90,9 100,5 100,5 L100,40 L0,40 Z" fill="url(#chartGrad)" />
                {/* Glowing Smooth Stroke Line */}
                <path d="M0,35 C20,33 30,22 40,22 C50,22 60,12 80,9 C90,9 100,5 100,5" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
 
              {/* Vertical indicator line */}
              {hoveredPointIdx !== null && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${linePoints[hoveredPointIdx].x}%`,
                    top: 0,
                    bottom: 0,
                    width: 1.5,
                    background: 'repeating-linear-gradient(to bottom, #10b981 0, #10b981 3px, transparent 3px, transparent 6px)',
                    zIndex: 4,
                    transition: 'left 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              )}
 
              {/* Data point dot markers */}
              {linePoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="absolute rounded-full pointer-events-none transition-all duration-200 ease-out"
                  style={{
                    left: `${pt.x}%`,
                    top: `${(pt.y / 40) * 100}%`,
                    width: hoveredPointIdx === idx ? 14 : 8,
                    height: hoveredPointIdx === idx ? 14 : 8,
                    backgroundColor: hoveredPointIdx === idx ? '#10b981' : '#ffffff',
                    border: '2.5px solid #10b981',
                    transform: 'translate(-50%, -50%)',
                    opacity: hoveredPointIdx === null ? 0.85 : (hoveredPointIdx === idx ? 1 : 0.35),
                    zIndex: hoveredPointIdx === idx ? 15 : 5,
                    boxShadow: hoveredPointIdx === idx ? '0 0 12px 6px rgba(16, 185, 129, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                />
              ))}
 
              {/* Hover tooltip */}
              {hoveredPointIdx !== null && (
                <div
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: `${linePoints[hoveredPointIdx].x}%`,
                    top: `${(linePoints[hoveredPointIdx].y / 40) * 100}%`,
                    transform: 'translate(-50%, -145%)',
                    transition: 'left 0.15s cubic-bezier(0.16, 1, 0.3, 1), top 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div className="bg-slate-900 text-white text-[0.7rem] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-slate-800/80 flex flex-col items-center">
                    <span className="text-slate-400 text-[0.6rem] font-semibold">{linePoints[hoveredPointIdx].label}</span>
                    <span>{linePoints[hoveredPointIdx].value} Tasks</span>
                  </div>
                  <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #0f172a', margin: '0 auto' }}></div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-3 text-[0.7rem] font-bold text-slate-400 border-t border-slate-100 mt-2">
              {linePoints.map((pt, idx) => (
                <span 
                  key={idx}
                  style={{
                    color: hoveredPointIdx === idx ? '#10b981' : undefined,
                    fontWeight: hoveredPointIdx === idx ? 800 : undefined,
                    transition: 'color 0.15s'
                  }}
                >
                  {pt.label}
                </span>
              ))}
            </div>
          </div>
        </div>
 
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-2 gap-6">
        
        {/* Top Used Assets */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="text-base font-extrabold text-slate-800 mb-6">Top Used Assets</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#2b1fcc] transition-colors"></div>
                <span className="text-sm font-semibold text-slate-700">Conference Room B2</span>
              </div>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-bold">34 bookings this month</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#2b1fcc] transition-colors"></div>
                <span className="text-sm font-semibold text-slate-700">Delivery Van 3</span>
              </div>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-bold">21 trips this month</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#2b1fcc] transition-colors"></div>
                <span className="text-sm font-semibold text-slate-700">Projector AF-0062</span>
              </div>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-bold">18 uses</span>
            </div>
          </div>
        </div>

        {/* Idle Assets */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="text-base font-extrabold text-slate-800 mb-6">Idle assets</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-amber-500 transition-colors"></div>
                <span className="text-sm font-semibold text-slate-700">Camera AF-0301</span>
              </div>
              <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded text-xs font-bold">unused 60+ days</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 group-hover:bg-amber-500 transition-colors"></div>
                <span className="text-sm font-semibold text-slate-700">Office chair AF-0410</span>
              </div>
              <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded text-xs font-bold">unused 45 days</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="mt-4">
        <h3 className="text-[1.1rem] font-extrabold text-slate-800 mb-4">Due for maintenance / nearing retirement</h3>
        <div className="grid grid-cols-2 gap-6">
          
          {/* Due Maintenance Card */}
          <div className="bg-[#fffdf5] border border-[#fef0c7] rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 flex-shrink-0">
              <Calendar className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Projector AF-0057</h4>
              <p className="text-[0.75rem] font-medium text-amber-600/80 mt-0.5">Due in 7 days</p>
            </div>
          </div>

          {/* Nearing Retirement Card */}
          <div className="bg-[#fffbfb] border border-[#fee2e2] rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 flex-shrink-0">
              <Hourglass className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Laptop AF-0020</h4>
              <p className="text-[0.75rem] font-medium text-red-500/80 mt-0.5">4 years old : nearing retirement</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
