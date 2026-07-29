import React from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../PropertiesContext';
import { Plus } from 'lucide-react';

export default function AdminDashboard() {
  const { properties } = useProperties();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">ภาพรวมระบบ (Dashboard)</h2>
          <p className="text-gray-500">จัดการข้อมูลโครงการอสังหาริมทรัพย์ทั้งหมดของคุณ</p>
        </div>
          <Link to="/admin/add" className="btn btn-primary flex items-center gap-2 px-6 py-2">
            <Plus size={20} /> เพิ่มโครงการใหม่
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-gray-500 font-medium mb-2">โครงการทั้งหมด</h3>
            <p className="text-3xl font-bold text-gray-800">{properties.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-gray-500 font-medium mb-2">คอนโดมิเนียม</h3>
            <p className="text-3xl font-bold text-gray-800">{properties.filter(p => p.type === 'คอนโด').length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-gray-500 font-medium mb-2">บ้านและทาวน์โฮม</h3>
            <p className="text-3xl font-bold text-gray-800">{properties.filter(p => p.type === 'บ้าน' || p.type === 'ทาวน์โฮม').length}</p>
          </div>
        </div>

        {/* Property List */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold text-gray-800">โครงการล่าสุด</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm">
                  <th className="p-4 font-medium border-b">ชื่อโครงการ</th>
                  <th className="p-4 font-medium border-b">ประเภท</th>
                  <th className="p-4 font-medium border-b">ราคาเริ่มต้น</th>
                  <th className="p-4 font-medium border-b">ทำเล</th>
                  <th className="p-4 font-medium border-b text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {properties.slice(0, 10).map((prop, idx) => (
                  <tr key={prop.id || idx} className="hover:bg-gray-50 border-b last:border-b-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={prop.image} alt={prop.name} className="w-10 h-10 rounded-md object-cover" />
                        <div>
                          <p className="font-medium text-gray-800">{prop.name}</p>
                          <p className="text-xs text-gray-500">{prop.developer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 text-xs">{prop.type}</span>
                    </td>
                    <td className="p-4 font-medium">{prop.price} ลบ.</td>
                    <td className="p-4 text-gray-600">{prop.province}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link to={`/property/${prop.id}`} target="_blank" className="text-primary hover:underline text-xs">ดูหน้าเว็บ</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {properties.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                ยังไม่มีโครงการในระบบ
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
