import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Heart, Bell, User } from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="layout">
      <header className="navbar">
        <div className="container flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="logo flex items-center gap-2">
            <Home className="logo-icon" size={24} color="var(--primary)" />
            <div className="logo-text">
              <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Find My Home</span>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>ที่อยู่ที่ใช่ เริ่มต้นที่นี่</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="nav-links flex items-center gap-6">
            <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>ค้นหา</Link>
            <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>โครงการ</Link>
            <Link to="/compare" className={location.pathname === '/compare' ? 'active' : ''}>เปรียบเทียบ</Link>
            <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>บทความ</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>เกี่ยวกับเรา</Link>
            <Link to="/admin/add" className={location.pathname === '/admin/add' ? 'active font-semibold text-primary' : 'font-semibold text-primary'}>+ เพิ่มโครงการ</Link>
          </nav>

          {/* User Actions */}
          <div className="user-actions flex items-center gap-4">
            <button className="icon-btn"><Heart size={20} /></button>
            <button className="icon-btn relative">
              <Bell size={20} />
              <span className="notification-dot">2</span>
            </button>
            <button className="profile-btn">
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
