import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, Star } from 'lucide-react';
import SEO from '../components/SEO';
import { useProperties } from '../PropertiesContext';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { properties } = useProperties();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  // Sort properties by package_tier/rank_score for featured section
  const featuredProperties = [...properties].sort((a, b) => {
    if (a.package_tier === 'sponsored' && b.package_tier !== 'sponsored') return -1;
    if (a.package_tier !== 'sponsored' && b.package_tier === 'sponsored') return 1;
    const scoreA = a.rank_score || 0;
    const scoreB = b.rank_score || 0;
    if (scoreA !== scoreB) return scoreB - scoreA;
    // Fallback to random or created_at if same tier
    return 0;
  }).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="หน้าแรก" 
        description="Find My Home แพลตฟอร์มค้นหาบ้าน คอนโด ทาวน์โฮม และที่ดิน พร้อมรายละเอียดครบถ้วนเพื่อการตัดสินใจที่ดีที่สุดของคุณ"
      />
      
      {/* Hero Section */}
      <div 
        className="relative h-[calc(100dvh-64px)] md:h-[calc(100dvh-72px)] min-h-[500px] flex flex-col justify-between pt-8 md:pt-16 pb-6 md:pb-10 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")'
        }}
      >
        {/* Gradient Overlays: Dedicated strong gradients for top (text) and bottom (search bar) */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 w-full h-[50%] bg-gradient-to-b from-black/90 via-black/60 to-transparent"></div>
        <div className="absolute bottom-0 w-full h-[40%] bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        
        {/* Top Text Section */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col items-center text-center">
          <h1 className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] tracking-wide whitespace-nowrap">
            ค้นหาบ้านที่ใช่ สไตล์คุณ
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 drop-shadow-[0_4px_10px_rgba(0,0,0,1)] font-medium tracking-wide leading-relaxed max-w-2xl text-balance">
            แพลตฟอร์มที่รวบรวมโครงการบ้านและคอนโด และสังคมบ้านที่ดีที่สุด
          </p>
        </div>
        
        {/* Bottom Search Section (At the bottom of the screen) */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col items-center">
          <form 
            onSubmit={handleSearch}
            className="w-full max-w-4xl bg-white/20 backdrop-blur-md border border-white/30 p-2 md:p-3 rounded-[2rem] md:rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center gap-2 md:gap-3"
          >
            <div className="flex-1 w-full flex items-center px-4 bg-white/80 backdrop-blur-sm rounded-[1.5rem] md:rounded-full h-14 md:h-16 border border-white/50">
              <Search className="text-gray-600 mr-2 md:mr-3 shrink-0" size={24} />
              <input 
                type="text" 
                placeholder="พิมพ์ชื่อโครงการ, ทำเล, หรือ BTS..." 
                className="w-full bg-transparent border-none outline-none text-gray-800 text-base md:text-lg placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full md:w-auto bg-[var(--primary)] hover:bg-[var(--accent)] text-white font-medium text-lg px-8 py-3.5 md:h-16 rounded-[1.5rem] md:rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl shrink-0"
            >
              ค้นหาเลย
            </button>
          </form>
        </div>
      </div>

      {/* Featured Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-wide">โครงการแนะนำ</h2>
            <p className="text-gray-600 text-lg tracking-wide">โครงการที่ได้รับความสนใจสูงสุดในขณะนี้</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map(prop => (
              <div 
                key={prop.id} 
                onClick={() => navigate(`/property/${prop.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group flex flex-col"
              >
                <div className="h-60 overflow-hidden relative">
                  {prop.images ? (
                    <img 
                      src={prop.images.split(',')[0]} 
                      alt={prop.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Building className="text-gray-400" size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium text-primary shadow-sm">
                    {prop.type || 'บ้าน'}
                  </div>
                  {prop.package_tier === 'sponsored' && (
                    <div className="absolute top-4 right-4 bg-amber-400/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-white shadow-sm flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      แนะนำ
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{prop.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-2 mb-4">
                    <MapPin size={16} />
                    {prop.province || 'กรุงเทพมหานคร'}
                  </p>
                  <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">ราคาเริ่มต้น</p>
                      <p className="text-2xl font-bold text-primary">
                        {prop.price ? prop.price + ' ลบ.' : 'ติดต่อสอบถาม'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors"
            >
              ดูโครงการทั้งหมด
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
