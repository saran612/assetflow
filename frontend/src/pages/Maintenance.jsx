import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, ThermometerSnowflake, User, Cpu
} from 'lucide-react';

const boardData = [
  {
    id: 'pending',
    title: 'PENDING',
    cards: [
      { 
        id: 1, 
        priority: 'High', 
        priorityColor: 'bg-red-100 text-red-700', 
        title: 'AF-0062 Projector bulb not turning on', 
        icon: Cpu,
        iconText: 'Electronics'
      }
    ]
  },
  {
    id: 'approved',
    title: 'APPROVED',
    cards: [
      { 
        id: 2, 
        priority: 'Medium', 
        priorityColor: 'bg-blue-100 text-blue-700', 
        title: 'AF-003 ac unit noisy compresor', 
        icon: ThermometerSnowflake,
        iconText: 'HVAC'
      }
    ]
  },
  {
    id: 'assigned',
    title: 'TECHNICIAN ASSIGNED',
    cards: [
      { 
        id: 3, 
        priority: 'Low', 
        priorityColor: 'bg-slate-100 text-slate-600', 
        title: 'AF-0078 forklift tech: R varma', 
        tech: 'R. Varma', 
        techInitials: 'RV' 
      }
    ]
  },
  {
    id: 'progress',
    title: 'IN PROGRESS',
    cards: [
      { 
        id: 4, 
        priority: 'Medium', 
        priorityColor: 'bg-blue-100 text-blue-700', 
        title: 'AF-897 Printer Jam parts ordered', 
        progress: 40, 
        statusText: 'Waiting on parts',
        activeStyles: 'border-l-4 border-l-[#2b1fcc]'
      }
    ]
  },
  {
    id: 'resolved',
    title: 'RESOLVED',
    cards: [
      { 
        id: 5, 
        resolved: true, 
        title: 'AF-873 Chair repair resolved 7 Jul', 
        statusText: 'Closed out',
        activeStyles: 'bg-emerald-50/50 border border-emerald-200'
      }
    ]
  }
];

export default function Maintenance() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className="max-w-[1400px] h-[calc(100vh-140px)] mx-auto flex flex-col animate-[fadeIn_0.3s_ease-out]"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-[2rem] font-extrabold text-slate-900 tracking-tight leading-tight">Maintenance Board</h2>
        <p className="text-[0.95rem] text-slate-500 mt-1 font-medium">Track repair workflows and manage technician assignments.</p>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 grid grid-cols-5 gap-4 pb-4">
        {boardData.map((column) => (
          <div key={column.id} className="flex flex-col bg-slate-50/50 rounded-2xl border border-slate-100 p-3 min-w-0">
            
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[0.75rem] font-extrabold text-slate-500 tracking-wider">{column.title}</h3>
              <span className="bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded-full text-[0.65rem] font-bold">
                {column.cards.length} tasks
              </span>
            </div>

            {/* Cards List */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 pb-2">
              {column.cards.map((card) => (
                <div 
                  key={card.id} 
                  className={`bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group ${card.activeStyles || ''}`}
                >
                  
                  {/* Resolved Card Style */}
                  {card.resolved ? (
                    <>
                      <div className="flex items-center gap-1.5 text-emerald-600 mb-3">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[0.75rem] font-bold">Done</span>
                      </div>
                      <h4 className="text-sm font-bold text-emerald-900 mb-4 leading-snug">{card.title}</h4>
                      <p className="text-[0.7rem] font-medium text-emerald-600/80">{card.statusText}</p>
                    </>
                  ) : (
                    /* Normal Card Style */
                    <>
                      <span className={`inline-block px-2 py-1 rounded text-[0.65rem] font-extrabold tracking-wide mb-3 ${card.priorityColor}`}>
                        {card.priority}
                      </span>
                      <h4 className="text-[0.85rem] font-bold text-slate-800 mb-4 leading-snug group-hover:text-[#2b1fcc] transition-colors">{card.title}</h4>
                      
                      {card.icon && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <card.icon className="w-3.5 h-3.5" />
                          <span className="text-[0.7rem] font-medium">{card.iconText}</span>
                        </div>
                      )}

                      {card.tech && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#2b1fcc] flex items-center justify-center text-white text-[0.6rem] font-bold shadow-sm">
                            {card.techInitials}
                          </div>
                          <span className="text-[0.7rem] font-semibold text-slate-600">{card.tech}</span>
                        </div>
                      )}

                      {card.progress !== undefined && (
                        <div className="mt-2">
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-[#2b1fcc] rounded-full" style={{ width: `${card.progress}%` }}></div>
                          </div>
                          <p className="text-[0.65rem] font-semibold text-slate-400">{card.statusText}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer sticky text */}
      <div className="flex-shrink-0 mt-6 pt-4 border-t border-slate-200/60 text-center">
        <p className="text-[0.75rem] font-bold text-slate-400">
          Approving a card moves the asset to under maintenance, resolving return it to availble
        </p>
      </div>

    </div>
  );
}
