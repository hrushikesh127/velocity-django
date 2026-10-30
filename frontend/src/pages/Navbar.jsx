import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getuser } from '../App';
import { settoken } from '../utils/apiclient';
import Usedata from '../hooks/usedata';
import './navbar.css';
import Notificationbox from './notificationbox';
import Chatbox from './chatbox';

function Navbar() {
  const user = getuser();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotify, setShowNotify] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowNotify(false);
    setShowChat(false);
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
                  onClick={() => {
                    setShowNotify(!showNotify);
                    setShowChat(false);
                  }}
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

                {/* User Pill - Navigates to Edit Profile */}
                <NavLink
                  to="/profile"
                  className={({ isActive }) => `user-profile-badge ${isActive ? 'active' : ''}`}
                  title="Click to view and edit profile credentials"
                >
                  <span className="user-avatar">
                    {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                  <span className="user-name-label">{user.username || 'Account'}</span>
                  <svg className="user-edit-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </NavLink>

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

            <button
              type="button"
              className={`icon-button chatbot-trigger ${showChat ? 'active' : ''}`}
              onClick={() => {
                setShowChat(!showChat);
                setShowNotify(false);
                setMobileMenuOpen(false);
              }}
              aria-label={showChat ? 'Close car assistant' : 'Open car assistant'}
              aria-expanded={showChat}
              title="Car assistant"
            >
              <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="7" width="16" height="13" rx="4" />
                <path d="M12 3v4M9 13h.01M15 13h.01M9 17h6" />
                <path d="M2 12v3M22 12v3" />
              </svg>
            </button>

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
              <NavLink to="/profile" className="mobile-user-card" title="Click to edit profile">
                <div className="user-avatar large">
                  {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="mobile-user-info">
                  <p className="mobile-username">{user.username || 'User'}</p>
                  <p className="mobile-email">Edit profile credentials →</p>
                </div>
                {user.isadmin && <span className="mobile-admin-tag">Admin</span>}
              </NavLink>
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
      {showChat && <Chatbox onClose={() => setShowChat(false)} />}
    </>
  );
}

export default Navbar;
