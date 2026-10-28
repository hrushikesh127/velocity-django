import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getuser } from '../App';
import { settoken } from '../utils/apiclient';
import Usedata from '../hooks/usedata';
import './navbar.css';
import Notificationbox from './notificationbox';

function Navbar() {
  const user = getuser();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotify, setShowNotify] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowNotify(false);
  }, [location.pathname]);

  // Fetch notifications to get unread count badge
  const { data: notifications } = Usedata(user ? 'bookings/notifications/' : null);
  const unreadCount = notifications?.filter((n) => !n.is_read)?.length || 0;

  const handleLogout = () => {
    localStorage.removeItem('velocitytoken');
    settoken(null);
    navigate('/login');
  };

  return (
    <>
      <header className="navbar-container">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <NavLink to="/" className="brand-logo" aria-label="Velocity Home">
            <span className="brand-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.2"/>
              </svg>
            </span>
            <span className="brand-text">VELOCITY</span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" aria-label="Main navigation">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Showroom
            </NavLink>
            <NavLink to="/compare" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Compare
            </NavLink>
            {user?.isadmin && (
              <NavLink to="/viewcars" className={({ isActive }) => `nav-link admin-pill ${isActive ? 'active' : ''}`}>
                <span className="admin-indicator"></span>
                Admin Suite
              </NavLink>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="nav-actions">
            {user ? (
              <>
                {/* Notification Trigger Button */}
                <button
                  type="button"
                  className={`icon-button ${showNotify ? 'active' : ''}`}
                  onClick={() => setShowNotify(!showNotify)}
                  aria-label="View notifications"
                  title="Notifications"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="notification-badge" aria-label={`${unreadCount} unread notifications`}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* User Pill */}
                <div className="user-profile-badge" title={`Signed in as ${user.username || user.email || 'User'}`}>
                  <span className="user-avatar">
                    {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                  <span className="user-name-label">{user.username || 'Account'}</span>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  className="logout-button"
                  onClick={handleLogout}
                  title="Sign out of your account"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span className="logout-text">Exit</span>
                </button>
              </>
            ) : (
              <div className="auth-buttons-group">
                <NavLink to="/login" className="login-link">Sign In</NavLink>
                <NavLink to="/register" className="register-link">Register</NavLink>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Menu */}
        <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-drawer-content">
            {user && (
              <div className="mobile-user-card">
                <div className="user-avatar large">
                  {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="mobile-user-info">
                  <p className="mobile-username">{user.username || 'User'}</p>
                  <p className="mobile-email">{user.email || 'Verified Account'}</p>
                </div>
                {user.isadmin && <span className="mobile-admin-tag">Admin</span>}
              </div>
            )}

            <nav className="mobile-links" aria-label="Mobile navigation">
              <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} end>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Showroom
              </NavLink>

              <NavLink to="/compare" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                Compare Cars
              </NavLink>

              {user?.isadmin && (
                <NavLink to="/viewcars" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  Admin Suite
                </NavLink>
              )}
            </nav>

            <div className="mobile-drawer-footer">
              {user ? (
                <button type="button" className="mobile-logout-btn" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              ) : (
                <div className="mobile-auth-actions">
                  <NavLink to="/login" className="mobile-login-btn">Sign In</NavLink>
                  <NavLink to="/register" className="mobile-register-btn">Create Account</NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-in Notifications Modal / Box */}
      {showNotify && <Notificationbox setshownotify={setShowNotify} />}
    </>
  );
}

export default Navbar;
