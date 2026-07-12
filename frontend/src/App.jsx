import React from 'react';
import {
  Search, Bell, Settings, Plus, Calendar, FileText,
  LayoutDashboard, Users, Box, Network, CalendarCheck,
  Wrench, ClipboardCheck, BarChart2, AlertTriangle,
  Laptop, Building2, Car, TrendingUp, MonitorPlay
} from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <TrendingUp className="logo-icon" />
            <div className="logo-text">
              <h2>AssetFlow</h2>
              <span>Enterprise Management</span>
            </div>
          </div>
        </div>
        
        <ul className="nav-links">
          <li className="nav-item active">
            <LayoutDashboard className="nav-icon" />
            Dashboard
          </li>
          <li className="nav-item">
            <Users className="nav-icon" />
            Organization
          </li>
          <li className="nav-item">
            <Box className="nav-icon" />
            Assets
          </li>
          <li className="nav-item">
            <Network className="nav-icon" />
            Allocation
          </li>
          <li className="nav-item">
            <CalendarCheck className="nav-icon" />
            Booking
          </li>
          <li className="nav-item">
            <Wrench className="nav-icon" />
            Maintenance
          </li>
          <li className="nav-item">
            <ClipboardCheck className="nav-icon" />
            Audit
          </li>
          <li className="nav-item">
            <BarChart2 className="nav-icon" />
            Reports
          </li>
          <li className="nav-item">
            <Bell className="nav-icon" />
            Notifications
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="top-header">
          <div className="search-bar">
            <Search size={18} color="#8b92a5" />
            <input type="text" placeholder="Search assets..." />
          </div>
          <div className="header-actions">
            <button className="icon-button">
              <Bell size={20} />
            </button>
            <button className="icon-button">
              <Settings size={20} />
            </button>
            <img src="https://i.pravatar.cc/150?img=11" alt="User" className="avatar" />
          </div>
        </header>

        {/* Alert Banner */}
        <div className="alert-banner">
          <AlertTriangle size={18} />
          12 items flagged for follow-up.
        </div>

        <div className="content-wrapper">
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div className="dashboard-title">
              <h1>Dashboard Overview</h1>
              <p>Welcome back, here's your asset summary for today.</p>
            </div>
            <div className="dashboard-actions">
              <button className="btn btn-primary">
                <Plus size={16} /> Register Asset
              </button>
              <button className="btn">
                <Calendar size={16} /> Book Resource
              </button>
              <button className="btn">
                <FileText size={16} /> Raise Request
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="metric-cards">
            <div className="metric-card">
              <div className="metric-icon">
                <ClipboardCheck size={20} />
              </div>
              <h3>Assets Available</h3>
              <div className="value">1,248</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">
                <Network size={20} />
              </div>
              <h3>Allocated</h3>
              <div className="value">3,492</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">
                <Calendar size={20} />
              </div>
              <h3>Active Bookings</h3>
              <div className="value">87</div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">
                <Car size={20} />
              </div>
              <h3>Pending Transfers</h3>
              <div className="value">24</div>
            </div>
            <div className="metric-card danger">
              <div className="metric-icon">
                <TrendingUp size={20} />
              </div>
              <h3>Upcoming Returns</h3>
              <div className="value">56</div>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Activity</h2>
                <a href="#" className="view-all">View All</a>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">
                    <Laptop size={20} />
                  </div>
                  <div className="activity-details">
                    <p>MacBook Pro #102 Allocated to Jane Doe</p>
                    <span>10 minutes ago</span>
                  </div>
                  <div className="tag">IT Dept</div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon teal">
                    <Building2 size={20} />
                  </div>
                  <div className="activity-details">
                    <p>Conf Room B2 Booked by Marketing</p>
                    <span>45 minutes ago</span>
                  </div>
                  <div className="tag">Facilities</div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon red">
                    <Wrench size={20} />
                  </div>
                  <div className="activity-details">
                    <p>Maintenance requested for HVAC Unit A</p>
                    <span>2 hours ago</span>
                  </div>
                  <div className="tag">Maintenance</div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">
                    <Car size={20} />
                  </div>
                  <div className="activity-details">
                    <p>Fleet Vehicle 04 returned by John Smith</p>
                    <span>Yesterday, 4:30 PM</span>
                  </div>
                  <div className="tag">Logistics</div>
                </div>
              </div>
            </div>

            {/* Asset Status */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Asset Status</h2>
              </div>
              <div className="chart-container">
                <div className="donut-chart">
                  <svg viewBox="0 0 100 100" width="160" height="160">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#eaedf2" strokeWidth="12" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0ea5e9" strokeWidth="12" strokeDasharray="60 251.2" strokeDashoffset="-163.28" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b28cc" strokeWidth="12" strokeDasharray="163.28 251.2" strokeDashoffset="0" />
                  </svg>
                  <div className="donut-center">
                    <h2>82%</h2>
                    <span>Healthy</span>
                  </div>
                </div>
                
                <div className="legend">
                  <div className="legend-item">
                    <div className="legend-label">
                      <div className="dot in-use"></div>
                      <span>In Use</span>
                    </div>
                    <span className="legend-value">65%</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-label">
                      <div className="dot available"></div>
                      <span>Available</span>
                    </div>
                    <span className="legend-value">25%</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-label">
                      <div className="dot maintenance"></div>
                      <span>Maintenance</span>
                    </div>
                    <span className="legend-value">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
