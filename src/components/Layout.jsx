import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Heart, Bell, User, Menu, X, Search, Building, Scale, Newspaper, Info, Building2 } from 'lucide-react';
import { useCompare } from '../CompareContext';
import { useFavorites } from '../FavoritesContext';
import { useWorkplace } from '../WorkplaceContext';
import './Layout.css';

export default function Layout() {
  const location = useLocation();
  const { compareList } = useCompare();
  const { favorites } = useFavorites();
  const { workplace, setIsWorkplaceModalOpen } = useWorkplace();
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
          <div className="user-actions flex items-center gap-2.5">
            {/* Workplace Selector Badge */}
            <button
              type="button"
              onClick={() => setIsWorkplaceModalOpen(true)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                workplace 
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-xs' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="คลิกเพื่อระบุหรือเปลี่ยนสถานที่ทำงาน เพื่อดูระยะทางและเวลาเดินทาง"
            >
              <Building2 size={14} className={workplace ? 'text-blue-600' : 'text-slate-400'} />
              <span className="max-w-[140px] truncate">
                {workplace ? workplace.name : '+ ระบุที่ทำงาน'}
              </span>
            </button>

            <Link to="/favorites" className="icon-btn relative" title="รายการโปรด">
              <Heart size={20} />
              {favorites?.length > 0 && (
                <span className="notification-dot" style={{ background: '#e11d48' }}>{favorites.length}</span>
              )}
            </Link>
            <Link to="/admin" className="profile-btn" title="ระบบจัดการหลังบ้าน (Admin)">
              <User size={20} />
            </Link>

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
            {/* Workplace Mobile Card */}
            <div 
              onClick={() => { setIsWorkplaceModalOpen(true); setMobileMenuOpen(false); }}
              className="p-3 mx-2 my-2 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Building2 size={18} className="text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-blue-600 font-bold uppercase block leading-none">สถานที่ทำงาน</span>
                  <span className="text-xs font-black text-blue-950 truncate block mt-0.5">
                    {workplace ? workplace.name : 'ระบุที่ทำงานของคุณ'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200 flex-shrink-0">
                {workplace ? 'เปลี่ยน' : 'ตั้งค่า'}
              </span>
            </div>

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
              to="/favorites" 
              className={`mobile-menu-link ${location.pathname === '/favorites' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-2"><Heart size={18}/> โครงการโปรด</span>
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
