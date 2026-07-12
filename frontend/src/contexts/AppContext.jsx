import React, { createContext, useContext, useState } from 'react';
import { 
  Laptop, Projector, Sofa,
  ThermometerSnowflake, Cpu
} from 'lucide-react';

const initialAssets = [
  { id: 1, tag: 'AF-0012', name: 'Dell Laptop', category: 'Electronics', status: 'Allocated', location: 'bengaluru', lastSeen: '2 hours ago', icon: Laptop, iconBg: 'bg-indigo-100 text-[#2b1fcc]' },
  { id: 2, tag: 'AF-0062', name: 'Projector', category: 'Electronics', status: 'Maintenance', location: 'HQ floor 2', lastSeen: 'Yesterday', icon: Projector, iconBg: 'bg-indigo-100 text-[#2b1fcc]' },
  { id: 3, tag: 'AF-0201', name: 'Office chair', category: 'Furniture', status: 'Available', location: 'Warehouse', lastSeen: '3 days ago', icon: Sofa, iconBg: 'bg-slate-200 text-slate-500' }
];

const initialBoardData = [
  {
    id: 'pending', title: 'PENDING',
    cards: [
      { id: 1, priority: 'High', priorityColor: 'bg-red-100 text-red-700', title: 'AF-0062 Projector bulb not turning on', icon: Cpu, iconText: 'Electronics' }
    ]
  },
  {
    id: 'approved', title: 'APPROVED',
    cards: [
      { id: 2, priority: 'Medium', priorityColor: 'bg-blue-100 text-blue-700', title: 'AF-003 ac unit noisy compresor', icon: ThermometerSnowflake, iconText: 'HVAC' }
    ]
  },
  {
    id: 'assigned', title: 'TECHNICIAN ASSIGNED',
    cards: [
      { id: 3, priority: 'Low', priorityColor: 'bg-slate-100 text-slate-600', title: 'AF-0078 forklift tech: R varma', tech: 'R. Varma', techInitials: 'RV' }
    ]
  },
  {
    id: 'progress', title: 'IN PROGRESS',
    cards: [
      { id: 4, priority: 'Medium', priorityColor: 'bg-blue-100 text-blue-700', title: 'AF-897 Printer Jam parts ordered', progress: 40, statusText: 'Waiting on parts', activeStyles: 'border-l-4 border-l-[#2b1fcc]' }
    ]
  },
  {
    id: 'resolved', title: 'RESOLVED',
    cards: [
      { id: 5, resolved: true, title: 'AF-873 Chair repair resolved 7 Jul', statusText: 'Closed out', activeStyles: 'bg-emerald-50/50 border border-emerald-200' }
    ]
  }
];

const initialBookings = [
  { id: 1, title: 'Procurement Team', date: '2026-07-07', startTime: '09:00', endTime: '10:00', resource: 'Conference Room B2', recurring: true },
  { id: 2, title: 'Conflict Request', date: '2026-07-07', startTime: '09:30', endTime: '10:30', resource: 'Conference Room B2', conflict: true }
];

const initialAllocationHistory = [
  { id: 1, date: 'Mar 12, 2023', action: 'Allocated to', person: 'Priya shah', dept: 'Engineering', active: true },
  { id: 2, date: 'Jan 04, 2023', action: 'Returned by', person: 'Arjun Nair', dept: null, condition: 'good', active: false }
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [assets, setAssets] = useState(initialAssets);
  const [boardData, setBoardData] = useState(initialBoardData);
  const [bookings, setBookings] = useState(initialBookings);
  const [allocationHistory, setAllocationHistory] = useState(initialAllocationHistory);

  const addAsset = (newAsset) => {
    let icon = Sofa;
    if (newAsset.category === 'Electronics') icon = Laptop;
    
    setAssets(prev => [{
      ...newAsset,
      id: Date.now(),
      icon,
      iconBg: 'bg-indigo-100 text-[#2b1fcc]',
      lastSeen: 'Just now'
    }, ...prev]);
  };

  const addBooking = (booking) => {
    setBookings(prev => [...prev, {
      ...booking,
      id: Date.now(),
      resource: 'Conference Room B2',
      conflict: false,
      recurring: false
    }]);
  };

  const addAllocationEntry = (entry) => {
    setAllocationHistory(prev => [{
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      action: 'Transferred to',
      person: entry.to,
      dept: null,
      condition: null,
      reason: entry.reason,
      active: true
    }, ...prev.map(h => ({ ...h, active: false }))]);
  };

  const updateMaintenanceStatus = (cardId, newColumnId) => {
    setBoardData(prevBoard => {
      let movedCard = null;
      const removedBoard = prevBoard.map(col => {
        const cardIndex = col.cards.findIndex(c => c.id === cardId);
        if (cardIndex > -1) {
          movedCard = col.cards[cardIndex];
          return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
        }
        return col;
      });

      if (!movedCard) return prevBoard;

      return removedBoard.map(col => {
        if (col.id === newColumnId) {
          return { ...col, cards: [movedCard, ...col.cards] };
        }
        return col;
      });
    });
  };

  return (
    <AppContext.Provider value={{
      assets, setAssets, addAsset,
      boardData, setBoardData, updateMaintenanceStatus,
      bookings, addBooking,
      allocationHistory, addAllocationEntry
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
