import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Plus, LogOut, LayoutDashboard, Home, ExternalLink, ShieldCheck, Menu, X, Building2 } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'A';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
      {/* ── TOP HORIZONTAL NAVBAR (แนวนอนด้านบน) ── */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand + Desktop Horizontal Nav Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Logo */}
            <Link to="/admin" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <Building2 size={20} />
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight text-white leading-tight">Find My Home</h1>
                <div className="flex items-center gap-1.5 -mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin Portal</span>
                </div>
              </div>
            </Link>

            {/* Divider */}
            <div className="hidden md:block h-6 w-px bg-slate-800"></div>

            {/* Horizontal Nav Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-1.5">
              <Link 
                to="/admin" 
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive('/admin') 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard size={16} />
                <span>แผงควบคุมหลัก</span>
              </Link>

              <Link 
                to="/admin/add" 
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive('/admin/add') 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Plus size={16} />
                <span>เพิ่มโครงการใหม่</span>
              </Link>

              <Link 
                to="/" 
                target="_blank"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-all group"
              >
                <Home size={16} className="group-hover:text-cyan-400 transition-colors" />
                <span>เปิดหน้าเว็บผู้ใช้</span>
                <ExternalLink size={12} className="text-slate-500 group-hover:text-cyan-400" />
              </Link>
            </nav>
          </div>

          {/* Right: User Profile Chip + Logout Button (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* User Chip */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
                {userInitial}
              </div>
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-[11px] font-bold text-white">ผู้ดูแลระบบ</span>
                  <ShieldCheck size={12} className="text-emerald-400" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium truncate block max-w-[140px]" title={user?.email}>
                  {user?.email || 'admin'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-600 rounded-xl transition-all border border-rose-500/20 hover:border-transparent"
              title="ออกจากระบบ"
            >
              <LogOut size={14} />
              <span>ออกจากระบบ</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900/98 px-4 py-3 space-y-2 animate-in slide-in-from-top-3">
            <Link 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                isActive('/admin') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>แผงควบคุมหลัก</span>
            </Link>

            <Link 
              to="/admin/add" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                isActive('/admin/add') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Plus size={16} />
              <span>เพิ่มโครงการใหม่</span>
            </Link>

            <Link 
              to="/" 
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <Home size={16} />
                <span>เปิดหน้าเว็บผู้ใช้</span>
              </div>
              <ExternalLink size={14} className="text-slate-500" />
            </Link>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 truncate max-w-[200px]">{user?.email}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 rounded-lg"
              >
                <LogOut size={13} />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── FULL WIDTH MAIN CONTENT (ขยายเต็มหน้าจอ) ── */}
      <main className="flex-1 w-full bg-slate-100">
        <Outlet />
      </main>
    </div>
  );
}
