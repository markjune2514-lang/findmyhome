import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Heart, Bell, User, Menu, X, Search, Building, Scale, Newspaper, Info } from 'lucide-react';
import { useCompare } from '../CompareContext';
import './Layout.css';

export default function Layout() {
  const location = useLocation();
  const { compareList } = useCompare();
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
          <div className="mobile-menu-drawer">
            <Link 
              to="/search" 
              className={`mobile-menu-link ${location.pathname === '/search' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-2"><Search size={18}/> ค้นหาโครงการ</span>
            </Link>
            <Link 
              to="/projects" 
              className={`mobile-menu-link ${location.pathname === '/projects' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-2"><Building size={18}/> รวมโครงการ</span>
            </Link>
            <Link 
              to="/compare" 
              className={`mobile-menu-link ${location.pathname === '/compare' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-2"><Scale size={18}/> เปรียบเทียบโครงการ</span>
            </Link>
            <Link 
              to="/blog" 
              className={`mobile-menu-link ${location.pathname === '/blog' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-2"><Newspaper size={18}/> บทความน่ารู้</span>
            </Link>
            <Link 
              to="/about" 
              className={`mobile-menu-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-2"><Info size={18}/> เกี่ยวกับเรา</span>
            </Link>
          </div>
        )}
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      {/* Floating Compare Button */}
      {compareList.length > 0 && location.pathname !== '/compare' && (
        <div className="fixed bottom-6 left-0 w-full px-4 z-50 flex justify-center pointer-events-none animate-in slide-in-from-bottom-5 fade-in duration-300">
          <Link 
            to="/compare" 
            className="pointer-events-auto flex w-full max-w-md items-center justify-center gap-3 px-6 py-3.5 bg-[var(--primary)] text-white rounded-full shadow-[0_8px_30px_rgba(249,115,22,0.4)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.6)] hover:-translate-y-1 transition-all"
          >
            <div className="relative">
              <Scale size={22} className="text-white" />
              <span className="absolute -top-2 -right-3 bg-white text-[var(--primary)] text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                {compareList.length}
              </span>
            </div>
            <span className="font-semibold text-[1rem]">เปรียบเทียบโครงการ</span>
          </Link>
        </div>
      )}
    </div>
  );
}
