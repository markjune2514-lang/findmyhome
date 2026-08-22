import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Building, Star, Crown, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import { useProperties } from '../PropertiesContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { properties } = useProperties();

  // Sort properties by package_tier/rank_score for featured section
  const featuredProperties = [...properties].sort((a, b) => {
    const tierWeights = { super: 4, sponsored: 3, premium: 2, standard: 1 };
    const weightA = tierWeights[a.package_tier] || tierWeights['standard'];
    const weightB = tierWeights[b.package_tier] || tierWeights['standard'];
    if (weightA !== weightB) return weightB - weightA;
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
      
      {/* Hero Section - Designed using UI/UX Pro Max 'Hero-Centric' Pattern */}
      <div 
        className="relative h-[calc(100dvh-64px)] md:h-[calc(100dvh-72px)] min-h-[500px] flex flex-col justify-between items-center bg-cover bg-center overflow-hidden py-10 md:py-16"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")'
        }}
      >
        {/* Uniform High-Contrast Overlay (UX Pro Max Rule: 60-80% dark overlay for readable white text) */}
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]"></div>
        
        {/* Top Text Section */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 flex flex-col items-center text-center mt-6 md:mt-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight drop-shadow-md text-balance">
            ค้นหาบ้านที่ใช่ <span className="text-orange-400">สไตล์คุณ</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 font-medium tracking-wide leading-relaxed max-w-2xl text-balance drop-shadow-sm">
            แพลตฟอร์มที่รวบรวมโครงการบ้านและคอนโดคุณภาพ และสังคมบ้านที่ดีที่สุด เพื่อการเริ่มต้นชีวิตที่สมบูรณ์แบบ
          </p>
        </div>
        
        {/* Bottom Search Section */}
        <div className="relative z-10 w-full mx-auto px-4 mt-auto mb-10 md:mb-16 flex flex-col items-center">
          <Link 
            to="/search" 
            className="bg-orange-500/30 backdrop-blur-md border border-orange-400/50 rounded-full px-8 py-4 sm:px-10 sm:py-5 inline-flex justify-center items-center gap-3 text-lg md:text-xl shadow-[0_8px_32px_rgba(249,115,22,0.3)] hover:bg-orange-500/50 hover:shadow-[0_8px_32px_rgba(249,115,22,0.5)] hover:scale-105 transition-all duration-300 font-bold text-white tracking-wide"
          >
            <Search size={24} className="text-white" />
            ค้นหาโครงการ
          </Link>
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
                  {prop.image ? (
                    <img 
                      src={prop.image.split(',')[0]} 
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
                  {prop.package_tier === 'super' && (
                    <div className="absolute top-4 right-4 bg-rose-600/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-white shadow-sm flex items-center gap-1">
                      <Crown size={14} fill="currentColor" />
                      Hot Deal
                    </div>
                  )}
                  {prop.package_tier === 'sponsored' && (
                    <div className="absolute top-4 right-4 bg-amber-400/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-white shadow-sm flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      แนะนำ
                    </div>
                  )}
                  {prop.package_tier === 'premium' && (
                    <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-white shadow-sm flex items-center gap-1">
                      <CheckCircle2 size={14} color="white" />
                      Verified
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
