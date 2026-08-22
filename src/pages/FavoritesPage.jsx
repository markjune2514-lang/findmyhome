import React from 'react';
import { useFavorites } from '../FavoritesContext';
import { useProperties } from '../PropertiesContext';
import { Link } from 'react-router-dom';
import { Heart, Crown, Star, CheckCircle2, Building } from 'lucide-react';
import SEO from '../components/SEO';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { properties } = useProperties();

  const favoriteProperties = properties.filter(prop => favorites.includes(prop.id));

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4 min-h-screen">
      <SEO title="รายการโปรดของฉัน" description="โครงการบ้านและคอนโดที่คุณบันทึกไว้" />
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Heart size={28} className="text-rose-500" fill="currentColor" /> โครงการโปรดของคุณ
      </h1>
      
      {favoriteProperties.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-600">ยังไม่มีโครงการในรายการโปรด</h2>
          <p className="text-gray-400 mt-2">กดหัวใจที่โครงการที่คุณสนใจเพื่อบันทึกไว้ดูภายหลัง</p>
          <Link to="/search" className="btn btn-primary mt-6 inline-block px-8 py-3 rounded-full text-white font-medium">ไปค้นหาโครงการเลย</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map(prop => (
            <Link to={`/property/${prop.id}`} key={prop.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-xl transition-shadow relative border border-gray-100 group flex flex-col">
              <div className="h-48 relative overflow-hidden">
                {prop.image ? (
                  <img src={prop.image.split(',')[0]} alt={prop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center"><Building className="text-gray-400" size={32} /></div>
                )}
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(prop.id); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm text-rose-500 hover:scale-110 transition-transform z-10 border-none cursor-pointer"
                  title="ลบออกจากรายการโปรด"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
                {prop.package_tier === 'super' && <div className="absolute top-3 left-3 bg-rose-600/90 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-bold"><Crown size={12}/> Hot Deal</div>}
                {prop.package_tier === 'sponsored' && <div className="absolute top-3 left-3 bg-amber-400/90 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-bold"><Star size={12} fill="currentColor"/> แนะนำ</div>}
                {prop.package_tier === 'premium' && <div className="absolute top-3 left-3 bg-blue-500/90 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-bold"><CheckCircle2 size={12}/> Verified</div>}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{prop.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{prop.developer}</p>
                <div className="mt-4 pt-3 flex items-center text-[var(--primary)] font-bold text-lg border-t border-gray-100">
                  {prop.price ? `เริ่มต้น  ` : 'ราคาติดต่อสอบถาม'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

