import React, { useState } from 'react';
import {
  Search, Bell, Settings, Plus, Calendar, FileText,
  LayoutDashboard, Users, Box, Network, CalendarCheck,
  Wrench, ClipboardCheck, BarChart2, AlertTriangle,
  Laptop, Building2, Car, TrendingUp, Mail, Lock,
  CheckSquare, Square, Info, ArrowRight
} from 'lucide-react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          {/* Brand/Promo Side */}
          <div className="brand-side-v2">
            <div className="brand-header-v2">
              <div className="logo-badge">AF</div>
            </div>
            
            <div className="brand-content-v2">
              <h1>
                AssetFlow —<br />
                <span className="fade-text">login</span>
              </h1>
              <p>
                Manage your digital infrastructure with the world's most advanced asset orchestration platform.
              </p>
            </div>

            <div className="brand-footer-v2">
              <div className="trusted-row">
                <div className="avatar-group">
                  <div className="avatar-circle"></div>
                  <div className="avatar-circle"></div>
                  <div className="avatar-circle count">+12k</div>
                </div>
                <span>Trusted by teams worldwide</span>
              </div>
              <div className="system-status">
                V2.4.0-STABLE &nbsp;•&nbsp; SYSTEM STATUS: ONLINE
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="form-side-v2">
            <div className="form-container-v2">
              <div className="welcome-header">
                <h2>Welcome Back</h2>
                <p>Enter your credentials to access your workspace.</p>
              </div>

              <form onSubmit={handleLogin} className="auth-form-v2">
                <div className="input-group-v2">
                  <label>EMAIL</label>
                  <div className="input-wrapper-v2">
                    <Mail className="input-icon-v2" size={16} />
                    <input 
                      type="email" 
                      placeholder="name@company.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group-v2">
                  <div className="label-row-v2">
                    <label>PASSWORD</label>
                    <a href="#" className="forgot-link-v2">Forgot password?</a>
                  </div>
                  <div className="input-wrapper-v2">
                    <Lock className="input-icon-v2" size={16} />
                    <input 
                      type="password" 
                      placeholder="********" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="signin-btn-v2">
                  Sign In to Workspace
                </button>
              </form>

              <div className="divider-v2">
                <span>SYSTEM ACCESS</span>
              </div>

              <div className="signup-section-v2">
                <h3>New here?</h3>
                <p>Join the orchestration revolution.</p>
                
                <div className="info-box-v2">
                  <Info size={16} className="info-icon-v2" />
                  <span>Sign up creates an employee account admin roles assigned later</span>
                </div>

                <button type="button" className="create-account-btn-v2">
                  Create Account <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <footer className="footer-v2">
              <div className="footer-links-v2">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
              <span className="copyright-v2">© 2024 AssetFlow Inc.</span>
            </footer>
          </div>
        </div>
      </div>
    );
  }

  // If logged in, render the dashboard
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

        {/* Quick logout option */}
        <div style={{ padding: '0 24px 24px' }}>
          <button className="btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsLoggedIn(false)}>
            Log Out
          </button>
        </div>
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
