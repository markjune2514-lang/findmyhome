import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Plus, LogOut, LayoutDashboard, Home, ExternalLink, ShieldCheck, Menu, X, Building2 } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans antialiased text-slate-800">
      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900/95 backdrop-blur-md text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight">Find My Home</h1>
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block -mt-0.5">Admin Suite</span>
          </div>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-900 border-r border-slate-800/80 
        flex flex-col shadow-2xl z-40 md:z-20 select-none
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Building2 size={22} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight leading-tight">Find My Home</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Admin Portal</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            เมนูหลัก (Management)
          </div>

          <Link 
            to="/admin" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isActive('/admin') 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} className={isActive('/admin') ? 'text-white' : 'text-slate-400'} />
            <span>แผงควบคุมหลัก</span>
          </Link>

          <Link 
            to="/admin/add" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isActive('/admin/add') 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            }`}
          >
            <Plus size={18} className={isActive('/admin/add') ? 'text-white' : 'text-slate-400'} />
            <span>เพิ่มโครงการใหม่</span>
          </Link>

          <div className="pt-5 pb-2 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            มุมมองผู้ใช้ (User View)
          </div>

          <Link 
            to="/" 
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 text-slate-300 hover:bg-slate-800/70 hover:text-white rounded-xl font-semibold text-sm transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <Home size={18} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span>เปิดหน้าเว็บผู้ใช้</span>
            </div>
            <ExternalLink size={14} className="text-slate-500 group-hover:text-slate-300" />
          </Link>
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">ผู้ดูแลระบบ</span>
                <ShieldCheck size={13} className="text-emerald-400 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 truncate" title={user?.email}>{user?.email || 'admin'}</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-600/80 rounded-xl font-semibold text-xs transition-all duration-200 border border-rose-500/20 hover:border-transparent"
          >
            <LogOut size={16} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Page Content */}
      <main className="flex-1 overflow-x-hidden min-h-screen bg-slate-100">
        <Outlet />
      </main>
    </div>
  );
}
