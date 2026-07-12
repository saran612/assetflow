import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, ThermometerSnowflake, User, Cpu
} from 'lucide-react';

// boardData moved to AppContext

import Modal from '../components/Modal';
import { useAppContext } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';

export default function Maintenance() {
  const [mounted, setMounted] = useState(false);
  const { boardData, updateMaintenanceStatus } = useAppContext();
  const { showToast } = useToast();
  
  // Modal State
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Drag-and-Drop State
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [dragSourceColumnId, setDragSourceColumnId] = useState(null);
  const [dragOverColumnId, setDragOverColumnId] = useState(null);

  const handleDragStart = useCallback((e, cardId, columnId) => {
    setDraggedCardId(cardId);
    setDragSourceColumnId(columnId);
    e.dataTransfer.effectAllowed = 'move';
    // Store card id in dataTransfer for cross-browser support
    e.dataTransfer.setData('text/plain', String(cardId));
  }, []);

  const handleDragOver = useCallback((e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumnId !== columnId) {
      setDragOverColumnId(columnId);
    }
  }, [dragOverColumnId]);

  const handleDragLeave = useCallback((e, columnId) => {
    // Only clear if we're actually leaving the column (not entering a child)
    const relatedTarget = e.relatedTarget;
    if (relatedTarget && e.currentTarget.contains(relatedTarget)) return;
    if (dragOverColumnId === columnId) {
      setDragOverColumnId(null);
    }
  }, [dragOverColumnId]);

  const handleDrop = useCallback((e, targetColumnId) => {
    e.preventDefault();
    if (draggedCardId != null && dragSourceColumnId !== targetColumnId) {
      updateMaintenanceStatus(draggedCardId, targetColumnId);
      showToast('Task moved successfully', 'success');
    }
    setDraggedCardId(null);
    setDragSourceColumnId(null);
    setDragOverColumnId(null);
  }, [draggedCardId, dragSourceColumnId, updateMaintenanceStatus, showToast]);

  const handleDragEnd = useCallback(() => {
    setDraggedCardId(null);
    setDragSourceColumnId(null);
    setDragOverColumnId(null);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openCardModal = (card, currentColumnId) => {
    setSelectedCard({ ...card, currentColumnId });
    setNewStatus(currentColumnId);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (newStatus === selectedCard.currentColumnId) {
      setIsModalOpen(false);
      return;
    }
    
    setIsUpdating(true);
    setTimeout(() => {
      updateMaintenanceStatus(selectedCard.id, newStatus);
      setIsUpdating(false);
      setIsModalOpen(false);
      showToast('Task status updated successfully', 'success');
    }, 600);
  };

  return (
    <>
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
          <div 
            key={column.id} 
            className="flex flex-col bg-slate-50/50 rounded-2xl border border-slate-100 p-3 min-w-0"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={(e) => handleDragLeave(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            style={{
              outline: dragOverColumnId === column.id && dragSourceColumnId !== column.id ? '2px solid #2b1fcc' : 'none',
              outlineOffset: '-2px',
              borderRadius: '1rem',
              transition: 'outline 0.15s ease-out'
            }}
          >
            
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
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => { if (draggedCardId == null) openCardModal(card, column.id); }}
                  className={`bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group ${card.activeStyles || ''}`}
                  style={{
                    opacity: draggedCardId === card.id ? 0.4 : 1,
                    cursor: draggedCardId != null ? 'grabbing' : 'grab',
                    transition: 'opacity 0.2s ease-out'
                  }}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Task Status">
        {selectedCard && (
          <form onSubmit={handleUpdateStatus} className="flex flex-col gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-2">
              <h4 className="font-bold text-slate-800 text-sm mb-1">{selectedCard.title}</h4>
              <p className="text-xs text-slate-500">Current Status: <span className="font-semibold uppercase">{selectedCard.currentColumnId}</span></p>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Move to</label>
              <select 
                value={newStatus} onChange={e => setNewStatus(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2b1fcc]/20 focus:border-[#2b1fcc] outline-none bg-white"
              >
                {boardData.map(col => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
            
            <div className="mt-4 flex gap-3 justify-end">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button 
                type="submit" 
                disabled={isUpdating}
                className={`px-6 py-2 text-sm font-bold text-white bg-[#2b1fcc] hover:bg-[#2015a3] rounded-lg transition-all shadow-sm ${isUpdating ? 'opacity-80' : ''}`}
              >
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
