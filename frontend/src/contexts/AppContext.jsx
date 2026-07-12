import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Laptop, Projector, Sofa,
  ThermometerSnowflake, Cpu
} from 'lucide-react';
import { apiCall } from '../utils/api';

const initialAssets = [];

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

  const loadAssets = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const data = await apiCall('/assets');
      const mapped = data.map(asset => {
        let categoryName = asset.category?.name || 'Electronics';
        let statusName = asset.status;
        if (statusName) {
          // Replace under_maintenance with Maintenance for frontend tag status styles
          if (statusName === 'under_maintenance') {
            statusName = 'Maintenance';
          } else {
            statusName = statusName.charAt(0).toUpperCase() + statusName.slice(1);
          }
        } else {
          statusName = 'Available';
        }

        let icon = Sofa;
        let iconBg = 'bg-slate-200 text-slate-500';
        const catLower = categoryName.toLowerCase();
        if (catLower.includes('laptop') || catLower.includes('phone') || catLower.includes('monitor') || catLower.includes('electronic')) {
          icon = Laptop;
          iconBg = 'bg-indigo-100 text-[#2b1fcc]';
        }

        const deptMap = {
          1: 'Engineering HQ',
          2: 'Facilities',
          3: 'Field Ops'
        };
        const departmentName = asset.employee?.department_id ? (deptMap[asset.employee.department_id] || 'Other') : 'Warehouse';

        return {
          ...asset,
          tag: asset.serial_number,
          category: categoryName,
          status: statusName,
          location: asset.employee ? `${asset.employee.first_name} ${asset.employee.last_name}` : 'Warehouse',
          department: departmentName,
          lastSeen: 'Connected',
          icon,
          iconBg
        };
      });
      setAssets(mapped);
    } catch (err) {
      console.error('Failed to fetch assets:', err);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const addAsset = async (newAsset) => {
    let categoryId = 1;
    const catLower = newAsset.category?.toLowerCase() || '';
    if (catLower.includes('laptop')) categoryId = 1;
    else if (catLower.includes('monitor')) categoryId = 2;
    else if (catLower.includes('phone') || catLower.includes('electronics')) categoryId = 3;
    else if (catLower.includes('furniture')) categoryId = 4;

    const payload = {
      name: newAsset.name,
      serial_number: newAsset.tag || `SN-${Date.now()}`,
      category_id: categoryId,
      cost: newAsset.cost ? parseFloat(newAsset.cost) : 100.0,
      status: newAsset.status?.toLowerCase() || 'available'
    };

    try {
      await apiCall('/assets', 'POST', payload);
      await loadAssets();
    } catch (err) {
      console.error('Failed to add asset:', err);
      throw err;
    }
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
      assets, setAssets, addAsset, loadAssets,
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
