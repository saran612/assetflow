import React, { useState } from 'react';
import {
  Search, Bell, Settings, Plus, Calendar, FileText,
  LayoutDashboard, Users, Box, Network, CalendarCheck,
  Wrench, ClipboardCheck, BarChart2, AlertTriangle,
  Laptop, Building2, Car, TrendingUp, Mail, Lock,
  CheckSquare, Square
} from 'lucide-react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          {/* Brand/Promo Side */}
          <div className="brand-side">
            <div className="brand-header">
              <div className="brand-logo">
                <div className="brand-logo-icon">
                  <TrendingUp size={24} />
                </div>
                <span>AssetFlow</span>
              </div>
            </div>
            
            <div className="brand-content">
              <h1>Enterprise Asset & Resource Management Simplified</h1>
              <p>
                Optimize your workspace, track critical inventory, and empower your workforce with our industry-leading resource orchestration platform.
              </p>
            </div>

            <div className="brand-stats">
              <div className="stat-pill">
                <h3>99.9%</h3>
                <p>System Uptime</p>
              </div>
              <div className="stat-pill">
                <h3>12k+</h3>
                <p>Assets Managed</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="form-side">
            <div className="tab-headers">
              <button 
                className={`tab-btn ${!isSignUp ? 'active' : ''}`}
                onClick={() => setIsSignUp(false)}
              >
                SIGN IN
              </button>
              <button 
                className={`tab-btn ${isSignUp ? 'active' : ''}`}
                onClick={() => setIsSignUp(true)}
              >
                CREATE ACCOUNT
              </button>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              {!isSignUp ? (
                <>
                  <div className="input-group">
                    <label>Work Email</label>
                    <div className="input-field-wrapper">
                      <Mail className="input-icon" size={18} />
                      <input 
                        type="email" 
                        placeholder="name@company.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="label-row">
                      <label>Password</label>
                      <a href="#" className="forgot-link">Forgot password?</a>
                    </div>
                    <div className="input-field-wrapper">
                      <Lock className="input-icon" size={18} />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="remember-me-row" onClick={() => setRememberMe(!rememberMe)}>
                    {rememberMe ? (
                      <CheckSquare className="checkbox-icon checked" size={18} />
                    ) : (
                      <Square className="checkbox-icon" size={18} />
                    )}
                    <span>Keep me signed in for 30 days</span>
                  </div>

                  <button type="submit" className="submit-btn">
                    Access Dashboard
                  </button>
                </>
              ) : (
                <>
                  <div className="input-group">
                    <label>Full Name</label>
                    <div className="input-field-wrapper">
                      <Users className="input-icon" size={18} />
                      <input type="text" placeholder="John Doe" required />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Work Email</label>
                    <div className="input-field-wrapper">
                      <Mail className="input-icon" size={18} />
                      <input type="email" placeholder="name@company.com" required />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Password</label>
                    <div className="input-field-wrapper">
                      <Lock className="input-icon" size={18} />
                      <input type="password" placeholder="••••••••" required />
                    </div>
                  </div>

                  <button type="submit" className="submit-btn">
                    Create Account
                  </button>
                </>
              )}

              <div className="sso-divider">
                <span>OR CONTINUE WITH SSO</span>
              </div>

              <div className="sso-buttons">
                <button type="button" className="sso-btn">
                  <svg viewBox="0 0 24 24" width="18" height="18" className="sso-icon">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="sso-btn">
                  <svg viewBox="0 0 23 23" width="18" height="18" className="sso-icon" style={{ marginRight: '6px' }}>
                    <path fill="#F25022" d="M1 1h10v10H1z"/>
                    <path fill="#7FBA00" d="M12 1h10v10H12z"/>
                    <path fill="#00A4EF" d="M1 12h10v10H1z"/>
                    <path fill="#FFB900" d="M12 12h10v10H12z"/>
                  </svg>
                  Microsoft
                </button>
              </div>
            </form>

            <footer className="form-footer">
              <span>© 2024 AssetFlow Inc.</span>
              <div className="footer-links">
                <a href="#">Status</a>
                <a href="#">Help Center</a>
              </div>
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
