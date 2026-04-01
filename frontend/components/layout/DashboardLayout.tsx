"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { LogOut, Search, LayoutDashboard, BarChart3, ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
  onSearch?: (value: string) => void;
  onNewTask?: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Görevler", icon: LayoutDashboard, path: "/tasks" },
  { id: "stats", label: "İstatistikler", icon: BarChart3, path: "/tasks/stats" },
];

export default function DashboardLayout({
  children,
  onSearch,
  onNewTask,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const activeMenu = pathname.startsWith("/tasks/stats")
    ? "stats"
    : pathname.startsWith("/tasks")
    ? "dashboard"
    : "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="layout-root">

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${isCollapsed ? "sidebar--collapsed" : "sidebar--open"}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">TM</div>
          {!isCollapsed && <span className="sidebar-logo-text">Task Manager</span>}
        </div>

        {/* Toggle */}
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Menüyü aç" : "Menüyü kapat"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Nav */}
        <nav className="sidebar-nav">
          {menuItems.map(({ id, label, icon: Icon, path }) => (
            <button
              key={id}
              onClick={() => router.push(path)}
              className={`sidebar-nav-item ${activeMenu === id ? "sidebar-nav-item--active" : ""}`}
              title={isCollapsed ? label : undefined}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button
            className="sidebar-logout"
            onClick={handleLogout}
            title={isCollapsed ? "Çıkış Yap" : undefined}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* ── RIGHT SIDE ── */}
      <div className={`layout-right ${isCollapsed ? "layout-right--collapsed" : "layout-right--open"}`}>

        {/* NAVBAR */}
        <header className="navbar">
          {/* Search */}
          <div className="navbar-search">
            <Search size={16} className="navbar-search-icon" />
            <input
              type="text"
              placeholder="Görevlerde ara..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="navbar-search-input"
            />
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            <button className="navbar-new-btn" onClick={() => onNewTask?.()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Yeni Görev
            </button>

            <button
              className="navbar-logout-btn"
              onClick={handleLogout}
              title="Çıkış Yap"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="layout-main">
          {children}
        </main>
      </div>

      <style>{`
        .layout-root {
          min-height: 100svh;
          display: flex;
          background: linear-gradient(135deg, #ede9fe 0%, #dbeafe 50%, #e0e7ff 100%);
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* ── Sidebar ── */
        .sidebar {
          position: fixed;
          top: 0; left: 0;
          height: 100%;
          background: #fff;
          border-right: 1px solid rgba(109,40,217,0.08);
          box-shadow: 4px 0 24px rgba(109,40,217,0.07);
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem 0;
          transition: width 0.25s ease;
          overflow: hidden;
        }
        .sidebar--collapsed { width: 72px; }
        .sidebar--open      { width: 220px; }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0 1rem;
          margin-bottom: 2rem;
          width: 100%;
          overflow: hidden;
        }

        .sidebar-logo-mark {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(109,40,217,0.3);
          letter-spacing: 0.02em;
        }

        .sidebar-logo-text {
          font-size: 0.9rem;
          font-weight: 700;
          color: #3b0764;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }

        .sidebar-toggle {
          position: absolute;
          top: 1.4rem;
          right: -11px;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(109,40,217,0.35);
          transition: transform 0.15s;
          z-index: 51;
        }
        .sidebar-toggle:hover { transform: scale(1.1); }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          width: 100%;
          padding: 0 0.75rem;
          flex: 1;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.7rem 0.85rem;
          border-radius: 11px;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          background: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          overflow: hidden;
        }
        .sidebar-nav-item:hover {
          background: #faf5ff;
          color: #7c3aed;
        }
        .sidebar-nav-item--active {
          background: #f3f0ff;
          color: #7c3aed;
          font-weight: 600;
        }

        .sidebar-footer {
          width: 100%;
          padding: 0 0.75rem;
          margin-top: auto;
        }

        .sidebar-logout {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.7rem 0.85rem;
          border-radius: 11px;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #9ca3af;
          background: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          overflow: hidden;
        }
        .sidebar-logout:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        /* ── Right side ── */
        .layout-right {
          display: flex;
          flex-direction: column;
          flex: 1;
          transition: margin-left 0.25s ease;
          min-width: 0;
        }
        .layout-right--collapsed { margin-left: 72px; }
        .layout-right--open      { margin-left: 220px; }

        /* ── Navbar ── */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1.5rem;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(109,40,217,0.08);
          box-shadow: 0 2px 12px rgba(109,40,217,0.06);
        }

        .navbar-search {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #faf5ff;
          border: 1.5px solid #ede9fe;
          border-radius: 10px;
          padding: 0.5rem 0.85rem;
          flex: 1;
          max-width: 360px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .navbar-search:focus-within {
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }

        .navbar-search-icon { color: #a78bfa; flex-shrink: 0; }

        .navbar-search-input {
          background: none;
          border: none;
          outline: none;
          font-size: 0.875rem;
          color: #1f2937;
          width: 100%;
          font-family: inherit;
        }
        .navbar-search-input::placeholder { color: #c4b5fd; }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-left: auto;
        }

        .navbar-new-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
          font-size: 0.875rem;
          font-weight: 600;
          border: none;
          border-radius: 9px;
          cursor: pointer;
          box-shadow: 0 3px 12px rgba(109,40,217,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
          white-space: nowrap;
        }
        .navbar-new-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(109,40,217,0.4);
        }
        .navbar-new-btn:active { transform: scale(0.97); }

        .navbar-logout-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 9px;
          border: 1.5px solid #fecaca;
          background: #fef2f2;
          color: #dc2626;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
        }
        .navbar-logout-btn:hover {
          background: #fee2e2;
          transform: translateY(-1px);
        }

        /* ── Main ── */
        .layout-main {
          flex: 1;
          padding: 1.75rem 1.5rem;
        }
      `}</style>
    </div>
  );
}