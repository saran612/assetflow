import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import OrganizationSetup from './pages/OrganizationSetup';
import Assets from './pages/Assets';
import Booking from './pages/Booking';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        
        {/* Protected/Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/organization-setup" element={<OrganizationSetup />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/booking" element={<Booking />} />
          
          {/* Catch-all for other sidebar links currently not implemented */}
          <Route path="*" element={
            <div className="flex items-center justify-center h-full">
              <h2 className="text-2xl font-bold text-slate-400">Page under construction</h2>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
