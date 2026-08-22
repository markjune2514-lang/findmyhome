import React, { useState } from 'react';
import { useProperties } from '../PropertiesContext';
import { useFavorites } from '../FavoritesContext';
import { Link } from 'react-router-dom';
import { Star, Map as MapIcon, ChevronRight, LayoutGrid, List, Crown, CheckCircle2, Heart } from 'lucide-react';
import SEO from '../components/SEO';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const { properties } = useProperties();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recommended');

  const categories = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'new', name: 'โครงการใหม่' },
    { id: 'transit', name: 'ติดรถไฟฟ้า' },
    { id: 'family', name: 'บ้านสำหรับครอบครัว' },
    { id: 'luxury', name: 'ระดับลักซ์ชัวรี่' }
  ];

  // Simple mock filtering logic for demonstration
  const getFilteredProperties = () => {
    let baseProperties = properties.filter(p => p.status !== 'ฉบับร่าง');
    let filtered = baseProperties;
    
    switch(activeCategory) {
      case 'new':
        filtered = baseProperties.filter(p => p.status === 'กำลังก่อสร้าง' || p.status === 'เปิด Presale');
        break;
      case 'transit':
        filtered = baseProperties.filter(p => p.distanceToStation && p.distanceToStation.includes('ม.') && parseInt(p.distanceToStation) < 500);
        break;
      case 'family':
        filtered = baseProperties.filter(p => p.projectType && p.projectType.includes('บ้าน'));
        break;
      case 'luxury':
        filtered = baseProperties.filter(p => p.price >= 10);
        break;
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'recommended') {
        const tierWeights = { super: 4, sponsored: 3, premium: 2, standard: 1 };
        const weightA = tierWeights[a.package_tier] || tierWeights['standard'];
        const weightB = tierWeights[b.package_tier] || tierWeights['standard'];
        if (weightA !== weightB) return weightB - weightA;
        
        // Fallback to rank_score or date
        const scoreA = a.rank_score || 0;
        const scoreB = b.rank_score || 0;
        if (scoreA !== scoreB) return scoreB - scoreA;
      }
      
      if (sortBy === 'price_asc') {
        const priceA = a.price || 999999;
        const priceB = b.price || 999999;
        return priceA - priceB;
      }
      if (sortBy === 'price_desc') {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return priceB - priceA;
      }
      if (sortBy === 'newest') {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      }
      return 0;
    });
  };

  const filteredProperties = getFilteredProperties();

  return (
    <div className="projects-page">
      <SEO 
        title="รวมโครงการอสังหาริมทรัพย์ที่น่าสนใจ" 
        description="เลือกดูโครงการบ้านเดี่ยว ทาวน์โฮม คอนโดมิเนียมที่คุณสนใจ เรียงตามโครงการใหม่ โครงการติดรถไฟฟ้า และอื่นๆ" 
      />
      {/* Hero Section */}
      <section className="projects-hero">
        <div className="hero-content text-center">
          <h1>ค้นหาแรงบันดาลใจสำหรับที่อยู่อาศัยใหม่</h1>
          <p>รวมโครงการบ้านและคอนโดคุณภาพจากผู้พัฒนาชั้นนำ คัดสรรมาเพื่อคุณโดยเฉพาะ</p>
        </div>
      </section>

      <div className="container py-3 sm:py-6">
        {/* Controls Bar: Categories + Sort & View Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 sm:mb-6">
          {/* Categories */}
          <div className="category-tabs flex gap-2 sm:gap-4 overflow-x-auto pb-2 whitespace-nowrap scrollbar-hide">
            {categories.map(cat => (
              <button 
                key={cat.id} 
                className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* View & Sort Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200">
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-1 rounded-sm flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'}`}
                title="มุมมองแบบรายการ"
              >
                <List size={16} />
              </button>
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-1 rounded-sm flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'}`}
                title="มุมมองแบบตาราง"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
            
            <div className="sort-dropdown">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-gray-700 shadow-sm cursor-pointer"
              >
                <option value="recommended">เรียงตาม: แนะนำ</option>
                <option value="price_asc">ราคา: ต่ำ-สูง</option>
                <option value="price_desc">ราคา: สูง-ต่ำ</option>
                <option value="newest">มาใหม่ล่าสุด</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className={`projects-grid ${viewMode === 'list' ? 'list-view-mode' : ''}`}>
          {filteredProperties.map(prop => (
            <Link to={`/property/${prop.id}`} key={prop.id} className="project-card-large">
              <div className="project-img-wrapper">
                <img src={prop.image ? prop.image.split(',')[0] : ''} alt={prop.name} />
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(prop.id); }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-transform z-10 border-none cursor-pointer ${isFavorite(prop.id) ? 'bg-white/90 text-rose-500 hover:scale-110' : 'bg-black/30 text-white hover:bg-white/90 hover:text-rose-500'}`}
                  title={isFavorite(prop.id) ? "ลบออกจากรายการโปรด" : "เพิ่มในรายการโปรด"}
                >
                  <Heart size={16} fill={isFavorite(prop.id) ? "currentColor" : "none"} strokeWidth={isFavorite(prop.id) ? 0 : 2} />
                </button>
                <div className="project-badges">
                  <span className="badge badge-dark">
                    {(prop.type === 'บ้าน' || prop.type === 'ทาวน์โฮม') && ['High Rise', 'Low Rise', 'Mixed Use'].includes(prop.projectType) 
                        ? prop.type 
                        : prop.projectType}
                  </span>
                  {prop.status === 'เปิด Presale' && <span className="badge badge-primary">Presale</span>}
                </div>
              </div>
              <div className="project-info p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="mb-1 flex items-center gap-1">
                    {prop.package_tier === 'super' && <Crown size={16} fill="#e11d48" color="#e11d48" title="Super Exclusive" />}
                    {prop.package_tier === 'sponsored' && <Star size={16} fill="#f59e0b" color="#f59e0b" title="โครงการแนะนำ" />}
                    {prop.package_tier === 'premium' && <CheckCircle2 size={16} color="#3b82f6" title="Verified" />}
                    <span className="line-clamp-1">{prop.name}</span>
                  </h3>
                  <p className="developer text-sm text-light mb-4">{prop.developer}</p>
                  
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <div className="flex items-center gap-1 text-light line-clamp-1">
                      <MapIcon size={14} /> {prop.station}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={14} fill="gold" color="gold" /> {prop.rating}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-auto">
                  <div>
                    <p className="text-xs text-light">{prop.price ? 'ราคาเริ่มต้น' : 'ราคา'}</p>
                    <h3 className="text-[var(--primary)]">{prop.price ? `${prop.price} ลบ.` : 'ติดต่อสอบถาม'}</h3>
                  </div>
                  <div className="btn-text text-[var(--primary)] flex items-center text-sm font-semibold shrink-0">
                    ดูรายละเอียด <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {filteredProperties.length === 0 && (
            <div className="col-span-full text-center p-12 text-light bg-neutral-1 rounded-lg">
              ไม่พบโครงการในหมวดหมู่นี้
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
