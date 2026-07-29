import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Plus, LogOut, LayoutDashboard, Home } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <LayoutDashboard size={24} />
            Admin Panel
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Home size={20} /> แผงควบคุม
          </Link>
          <Link 
            to="/admin/add" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/admin/add') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Plus size={20} /> เพิ่มโครงการใหม่
          </Link>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors mt-8">
            <Home size={20} /> กลับหน้าหลักผู้ใช้
          </Link>
        </nav>
        <div className="p-4 border-t">
          <div className="mb-4 px-4">
            <p className="text-xs text-gray-500 font-semibold mb-1">LOGGED IN AS</p>
            <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors"
          >
            <LogOut size={20} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
