import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Plus, LogOut, LayoutDashboard, Home } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Admin Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-30 border-b border-slate-800 shadow-md">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <LayoutDashboard size={18} />
          </div>
          Admin Panel
        </h1>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          <LayoutDashboard size={24} />
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col sticky top-0 h-auto md:h-screen shadow-xl z-20`}>
        <div className="hidden md:block p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white flex items-center gap-3 tracking-wide">
            <div className="bg-primary p-2 rounded-lg text-white">
              <LayoutDashboard size={20} />
            </div>
            Admin Panel
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-2 md:mt-4">
          <Link 
            to="/admin" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive('/admin') ? 'bg-primary/20 text-primary shadow-[inset_4px_0_0_0_#2b5aed] bg-gradient-to-r from-primary/20 to-transparent' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Home size={20} /> แผงควบคุม
          </Link>
          <Link 
            to="/admin/add" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive('/admin/add') ? 'bg-primary/20 text-primary shadow-[inset_4px_0_0_0_#2b5aed] bg-gradient-to-r from-primary/20 to-transparent' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Plus size={20} /> เพิ่มโครงการใหม่
          </Link>
          <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-slate-800">
            <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-xl font-medium transition-all duration-200">
              <Home size={20} /> กลับหน้าหลักผู้ใช้
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="mb-4 px-4">
            <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Logged in as</p>
            <p className="text-sm font-medium text-slate-300 truncate">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl font-medium transition-all duration-200"
          >
            <LogOut size={20} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-slate-50 relative p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
