import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Heart, Bell, User, Menu, X } from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="layout">
      <header className="navbar">
        <div className="container flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="logo flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <Home className="logo-icon" size={24} color="var(--primary)" />
            <div className="logo-text">
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Find My Home</span>
              <span className="hidden sm:block" style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>ที่อยู่ที่ใช่ เริ่มต้นที่นี่</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-links hidden md:flex items-center gap-6">
            <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>ค้นหา</Link>
            <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>โครงการ</Link>
            <Link to="/compare" className={location.pathname === '/compare' ? 'active' : ''}>เปรียบเทียบ</Link>
            <Link to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>บทความ</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>เกี่ยวกับเรา</Link>
          </nav>

          {/* User Actions & Mobile Hamburger */}
          <div className="user-actions flex items-center gap-3">
            <button className="icon-btn"><Heart size={20} /></button>
            <button className="icon-btn relative">
              <Bell size={20} />
              <span className="notification-dot">2</span>
            </button>
            <button className="profile-btn">
              <User size={20} />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button 
              className="md:hidden icon-btn p-2" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 shadow-lg px-4 py-3 flex flex-col gap-3 transition-all animate-fadeIn">
            <Link 
              to="/search" 
              className={`py-2 px-3 rounded-md font-medium text-sm ${location.pathname === '/search' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              🔍 ค้นหาโครงการ
            </Link>
            <Link 
              to="/projects" 
              className={`py-2 px-3 rounded-md font-medium text-sm ${location.pathname === '/projects' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              🏢 รวมโครงการ
            </Link>
            <Link 
              to="/compare" 
              className={`py-2 px-3 rounded-md font-medium text-sm ${location.pathname === '/compare' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              ⚖️ เปรียบเทียบโครงการ
            </Link>
            <Link 
              to="/blog" 
              className={`py-2 px-3 rounded-md font-medium text-sm ${location.pathname === '/blog' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              📰 บทความน่ารู้
            </Link>
            <Link 
              to="/about" 
              className={`py-2 px-3 rounded-md font-medium text-sm ${location.pathname === '/about' ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              ℹ️ เกี่ยวกับเรา
            </Link>
          </div>
        )}
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
