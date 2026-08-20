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

  const featuredProperties = properties.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="หน้าแรก" 
        description="Find My Home แพลตฟอร์มค้นหาบ้าน คอนโด ทาวน์โฮม และที่ดิน พร้อมรายละเอียดครบถ้วนเพื่อการตัดสินใจที่ดีที่สุดของคุณ"
      />
      
      {/* Hero Section */}
      <div 
        className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            ค้นหาบ้านที่ใช่ ในสไตล์คุณ
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 drop-shadow-md">
            แพลตฟอร์มที่รวบรวมโครงการบ้าน คอนโด และทาวน์โฮม มากที่สุด
          </p>
          
          <form 
            onSubmit={handleSearch}
            className="w-full max-w-3xl bg-white p-3 md:p-3 rounded-3xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-3"
          >
            <div className="flex-1 w-full flex items-center px-4 bg-gray-50 rounded-2xl md:rounded-full h-14">
              <Search className="text-gray-400 mr-3" size={24} />
              <input 
                type="text" 
                placeholder="พิมพ์ชื่อโครงการ, ทำเล, หรือ BTS/MRT..." 
                className="w-full bg-transparent border-none outline-none text-gray-700 text-base md:text-lg placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-medium text-lg px-8 py-3 md:py-4 rounded-2xl md:rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              ค้นหาเลย
            </button>
          </form>
        </div>
      </div>

      {/* Featured Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">โครงการแนะนำ</h2>
            <p className="text-gray-600">โครงการที่ได้รับความสนใจสูงสุดในขณะนี้</p>
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
