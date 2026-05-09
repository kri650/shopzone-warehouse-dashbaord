import React, { useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiBell, FiHome, FiLogOut, FiMenu, FiTruck, FiBox, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './WarehouseLayout.css';

const WarehouseLayout = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = useMemo(
    () => [
      { to: '/', label: 'Overview', icon: <FiHome /> },
      { to: '/shipments', label: 'Shipments', icon: <FiTruck /> },
      { to: '/inventory', label: 'Stock Inventory', icon: <FiBox /> },
      { to: '/returns', label: 'Returns Queue', icon: <FiRefreshCw /> },
      { to: '/notifications', label: 'Notifications', icon: <FiBell /> },
    ],
    []
  );

  return (
    <div className="dash-shell">
      <aside className={`dash-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="dash-brand">
          <div className="logo">WH</div>
          <div className="brand-text">
            <div className="name">Warehouse</div>
            <div className="sub">{user?.employeeId || user?.role}</div>
          </div>
        </div>

        <nav className="dash-nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `dash-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dash-user">
          <div className="meta">
            <div className="title">{user?.name || 'Staff'}</div>
            <div className="hint">{user?.email}</div>
          </div>
          <button className="btn btn-ghost" onClick={logout} type="button">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="btn btn-ghost mobile-menu" type="button" onClick={() => setMobileOpen((s) => !s)}>
            <FiMenu />
          </button>
          <div className="crumb">Warehouse Ops</div>
          <div className="spacer" />
          <div className="pill">{user?.role || 'warehouse_staff'}</div>
        </header>

        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WarehouseLayout;

