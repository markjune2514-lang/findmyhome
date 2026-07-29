import React from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../PropertiesContext';
import { Plus, Building2, Home as HomeIcon, LayoutList, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { properties } = useProperties();

  const condoCount = properties.filter(p => p.type === 'คอนโด').length;
  const houseCount = properties.filter(p => p.type === 'บ้าน' || p.type === 'ทาวน์โฮม').length;

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">ภาพรวมระบบ <span className="text-primary font-normal">Dashboard</span></h2>
          <p className="text-gray-500 text-lg">จัดการข้อมูลโครงการอสังหาริมทรัพย์ทั้งหมดของคุณได้อย่างง่ายดาย</p>
        </div>
        <Link to="/admin/add" className="bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:-translate-y-1">
          <Plus size={20} /> เพิ่มโครงการใหม่
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <LayoutList size={80} />
          </div>
          <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4">
            <LayoutList size={24} />
          </div>
          <h3 className="text-gray-500 font-medium mb-1">โครงการทั้งหมด</h3>
          <p className="text-4xl font-bold text-gray-800">{properties.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Building2 size={80} />
          </div>
          <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 mb-4">
            <Building2 size={24} />
          </div>
          <h3 className="text-gray-500 font-medium mb-1">คอนโดมิเนียม</h3>
          <p className="text-4xl font-bold text-gray-800">{condoCount}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <HomeIcon size={80} />
          </div>
          <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
            <HomeIcon size={24} />
          </div>
          <h3 className="text-gray-500 font-medium mb-1">บ้านและทาวน์โฮม</h3>
          <p className="text-4xl font-bold text-gray-800">{houseCount}</p>
        </div>
      </div>

      {/* Property List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">โครงการอัปเดตล่าสุด</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-5 font-semibold border-b border-gray-100">ชื่อโครงการ</th>
                <th className="p-5 font-semibold border-b border-gray-100">ประเภท</th>
                <th className="p-5 font-semibold border-b border-gray-100">ราคาเริ่มต้น</th>
                <th className="p-5 font-semibold border-b border-gray-100">ทำเล</th>
                <th className="p-5 font-semibold border-b border-gray-100 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {properties.slice(0, 10).map((prop, idx) => (
                <tr key={prop.id || idx} className="hover:bg-gray-50/80 border-b border-gray-50 last:border-b-0 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={prop.image} alt={prop.name} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-base">{prop.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{prop.developer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${prop.type === 'คอนโด' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {prop.type}
                    </span>
                  </td>
                  <td className="p-5 font-bold text-gray-700">{prop.price} ลบ.</td>
                  <td className="p-5 text-gray-500">{prop.province}</td>
                  <td className="p-5 text-right">
                    <Link to={`/property/${prop.id}`} target="_blank" className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-medium text-sm transition-colors bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg">
                      ดูหน้าเว็บ <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <LayoutList size={48} className="text-gray-300 mb-4" />
              <p className="text-lg">ยังไม่มีโครงการในระบบ</p>
              <p className="text-sm text-gray-400 mt-1">เริ่มเพิ่มโครงการแรกของคุณเพื่อดูสถิติ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
