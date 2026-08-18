import React, { useState } from 'react';
import { useProperties } from '../PropertiesContext';
import { Link } from 'react-router-dom';
import { Star, Map as MapIcon, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const { properties } = useProperties();
  const [activeCategory, setActiveCategory] = useState('all');

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
    switch(activeCategory) {
      case 'new':
        return baseProperties.filter(p => p.status === 'กำลังก่อสร้าง' || p.status === 'เปิด Presale');
      case 'transit':
        return baseProperties.filter(p => p.distanceToStation && p.distanceToStation.includes('ม.') && parseInt(p.distanceToStation) < 500);
      case 'family':
        return baseProperties.filter(p => p.projectType && p.projectType.includes('บ้าน'));
      case 'luxury':
        return baseProperties.filter(p => p.price >= 10);
      default:
        return baseProperties;
    }
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
        {/* Categories */}
        <div className="category-tabs flex gap-2 sm:gap-4 mb-3 sm:mb-6 overflow-x-auto pb-2 whitespace-nowrap">
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

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProperties.map(prop => (
            <Link to={`/property/${prop.id}`} key={prop.id} className="project-card-large">
              <div className="project-img-wrapper">
                <img src={prop.image ? prop.image.split(',')[0] : ''} alt={prop.name} />
                <div className="project-badges">
                  <span className="badge badge-dark">
                    {(prop.type === 'บ้าน' || prop.type === 'ทาวน์โฮม') && ['High Rise', 'Low Rise', 'Mixed Use'].includes(prop.projectType) 
                        ? prop.type 
                        : prop.projectType}
                  </span>
                  {prop.status === 'เปิด Presale' && <span className="badge badge-primary">Presale</span>}
                </div>
              </div>
              <div className="project-info p-6">
                <h3 className="mb-1">{prop.name}</h3>
                <p className="developer text-sm text-light mb-4">{prop.developer}</p>
                
                <div className="flex justify-between items-center mb-4 text-sm">
                  <div className="flex items-center gap-1 text-light">
                    <MapIcon size={14} /> {prop.station}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} fill="gold" color="gold" /> {prop.rating}
                  </div>
                </div>

                <div className="flex justify-between items-end border-t pt-4">
                  <div>
                    <p className="text-xs text-light">{prop.price ? 'ราคาเริ่มต้น' : 'ราคา'}</p>
                    <h3 className="text-primary">{prop.price ? `${prop.price} ลบ.` : 'ราคาติดต่อสอบถาม'}</h3>
                  </div>
                  <div className="btn-text text-primary flex items-center text-sm font-semibold">
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
