import React from 'react';
import { NavLink } from 'react-router-dom';
import './adminnavbar.css';

function Adminnavbar() {
  return (
    <div className="admin-nav-wrapper">
      <div className="admin-nav-banner">
        <span className="admin-badge-indicator"></span>
        <span className="admin-banner-text">ADMIN CONSOLE</span>
      </div>
      <nav className="mininavbar" aria-label="Admin navigation">
        <NavLink to="/viewcars" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>Inventory Fleet</span>
        </NavLink>

        <NavLink to="/createcar" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>List Vehicle</span>
        </NavLink>

        <NavLink to="/requests" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span>Client Requests</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Adminnavbar;
