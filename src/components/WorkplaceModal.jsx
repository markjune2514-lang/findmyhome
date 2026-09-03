import React, { useState, useEffect, useRef } from 'react';
import { useWorkplace } from '../WorkplaceContext';
import { searchPlacesLikeGoogle, POPULAR_THAI_PLACES } from '../utils/placeSearch';
import { 
  Building2, MapPin, X, Check, Search, Navigation, Trash2, 
  ArrowRight, Sparkles, Clock, Loader2 
} from 'lucide-react';

export default function WorkplaceModal() {
  const { 
    workplace, 
    setWorkplace, 
    clearWorkplace, 
    isWorkplaceModalOpen, 
    setIsWorkplaceModalOpen, 
    OFFICE_PRESETS 
  } = useWorkplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const searchInputRef = useRef(null);

  // Recent Searches stored in localStorage
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('fmh_recent_workplaces');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveRecentSearch = (place) => {
    try {
      const filtered = recentSearches.filter(r => r.name !== place.name);
      const updated = [place, ...filtered].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('fmh_recent_workplaces', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save recent search', e);
    }
  };

  const clearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('fmh_recent_workplaces');
  };

  // Google-like live instant debounce search as user types
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchPlacesLikeGoogle(trimmed);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching places:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200); // 200ms debounce for ultra-responsive typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isWorkplaceModalOpen) return null;

  const handleSelectPlace = (place) => {
    const selected = {
      id: place.id || `custom_${Date.now()}`,
      name: place.name,
      landmark: place.secondary || place.landmark || '',
      lat: place.lat,
      lng: place.lng,
      area: place.secondary || place.area || ''
    };
    saveRecentSearch(selected);
    setWorkplace(selected);
    setSearchQuery('');
    setSearchResults([]);
    setIsWorkplaceModalOpen(false);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง GPS');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let placeName = 'ตำแหน่งปัจจุบันของฉัน';
        let secondary = 'พิกัด GPS';
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=th`);
          const data = await res.json();
          if (data && data.display_name) {
            const parts = data.display_name.split(',');
            placeName = parts.slice(0, 2).join(', ').trim();
            secondary = parts.slice(2, 5).join(', ').trim();
          }
        } catch (e) {
          console.error(e);
        }
        const gpsPlace = {
          id: 'custom_gps',
          name: placeName,
          landmark: secondary,
          lat: latitude,
          lng: longitude,
          area: secondary
        };
        saveRecentSearch(gpsPlace);
        setWorkplace(gpsPlace);
        setGeoLoading(false);
        setIsWorkplaceModalOpen(false);
      },
      (err) => {
        alert('ไม่สามารถดึงตำแหน่ง GPS ได้: ' + err.message);
        setGeoLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-[#ede5dd] flex flex-col max-h-[92vh] animate-in zoom-in-95">
        
        {/* Header - Styled to match Find My Home's warm terracotta brand */}
        <div className="p-4 sm:p-5 border-b border-[#f0e8e0] flex justify-between items-center bg-[#fbf7f4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d38764] to-[#b87d4e] text-white flex items-center justify-center shadow-md shadow-[#d38764]/25">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-[#0e0e0c] text-base leading-tight">
                ระบุสถานที่ทำงาน (Workplace)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ค้นหาตึก, บริษัท, สถานี หรือที่ทำงาน เพื่อคำนวณระยะทางจริง
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsWorkplaceModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Active Workplace Indicator (If Set) */}
          {workplace && (
            <div className="p-3.5 rounded-2xl bg-[#fbf7f4] border border-[#f0e2d8] flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#d38764] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Check size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#d38764] uppercase tracking-wider block">
                    ที่ทำงานที่คุณตั้งค่าไว้
                  </span>
                  <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {workplace.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {workplace.landmark || workplace.area}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearWorkplace}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 transition-colors flex-shrink-0 cursor-pointer shadow-2xs"
                title="ลบที่ทำงานนี้"
              >
                <Trash2 size={13} />
                <span>ลบ</span>
              </button>
            </div>
          )}

          {/* Search Bar - Seamless pill style matching Find My Home */}
          <div className="space-y-2">
            <div className="relative">
              <div className="relative flex items-center bg-[#fbf7f4] hover:bg-white focus-within:bg-white border border-[#e8ded5] focus-within:border-[#d38764] focus-within:ring-2 focus-within:ring-[#d38764]/20 rounded-full transition-all duration-200 px-4 py-2.5 shadow-2xs">
                <Search size={18} className="text-[#d38764] shrink-0 mr-2.5 transition-colors" />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsInputFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อตึก, บริษัท, สถานที่ทำงาน, กองบิน, รถไฟฟ้า..."
                  style={{ border: 'none', outline: 'none', background: 'transparent', boxShadow: 'none', padding: 0, margin: 0 }}
                  className="w-full text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 border-none outline-none"
                  autoFocus
                />

                {isSearching && (
                  <Loader2 size={16} className="animate-spin text-[#d38764] shrink-0 ml-2" />
                )}

                {searchQuery && !isSearching && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSearchResults([]); searchInputRef.current?.focus(); }}
                    className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] shrink-0 ml-2 cursor-pointer transition-colors"
                    title="ล้างข้อความ"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Places Autocomplete Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="bg-white border border-[#ede5dd] rounded-2xl shadow-xl overflow-hidden divide-y divide-[#f5eee8] animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-2 bg-[#fbf7f4] text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>ผลการค้นหาสถานที่ ({searchResults.length})</span>
                  <span className="text-[#d38764] font-semibold">คลิกเพื่อเลือก</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectPlace(item)}
                      className="p-3 hover:bg-[#fbf7f4] transition-colors cursor-pointer flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-[#f4e4d7] text-base flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                        {item.icon || '📍'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#d38764] transition-colors leading-tight truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.secondary}
                        </p>
                      </div>
                      <div className="text-slate-300 group-hover:text-[#d38764] transition-colors mt-1">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No search results hint */}
            {searchQuery.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
              <div className="p-4 bg-[#fbf7f4] rounded-2xl text-center border border-[#f0e8e0]">
                <p className="text-xs text-slate-700 font-bold">ไม่พบสถานที่ "{searchQuery}"</p>
                <p className="text-[11px] text-slate-400 mt-0.5">ลองพิมพ์ชื่อสถานที่ใกล้เคียง, ถนน, หรือสถานีรถไฟฟ้า</p>
              </div>
            )}

            {/* Recent Searches */}
            {!searchQuery && recentSearches.length > 0 && (
              <div className="p-3 bg-[#fbf7f4] rounded-2xl border border-[#f0e8e0]">
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                    <Clock size={13} className="text-[#d38764]" />
                    สถานที่ค้นหาล่าสุด
                  </span>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-[10px] text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                  >
                    ล้างประวัติ
                  </button>
                </div>
                <div className="space-y-1.5">
                  {recentSearches.map((rec, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectPlace(rec)}
                      className="p-2.5 rounded-xl bg-white hover:bg-amber-50/40 border border-[#ede5dd] hover:border-[#d38764]/40 cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-800 truncate">{rec.name}</span>
                        <span className="text-[10px] text-slate-400 truncate hidden sm:inline">{rec.landmark}</span>
                      </div>
                      <ArrowRight size={12} className="text-slate-300 shrink-0 ml-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GPS Current Location Option */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
              className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-[#fbf7f4] text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-[#e8ded5] shadow-2xs cursor-pointer"
            >
              <Navigation size={14} className={geoLoading ? 'animate-spin text-[#d38764]' : 'text-[#d38764]'} />
              <span>{geoLoading ? 'กำลังระบุพิกัด GPS...' : '📍 ใช้ตำแหน่งปัจจุบันของฉัน (GPS)'}</span>
            </button>
          </div>

          {/* Quick 1-Click Popular Office Hubs */}
          <div className="pt-3 border-t border-[#f0e8e0]">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#d38764]" />
                ย่านออฟฟิศยอดนิยม (เลือกใน 1 คลิก)
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {OFFICE_PRESETS.map((preset) => {
                const isSelected = workplace?.name === preset.name;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPlace(preset)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#d38764] text-white border-[#d38764] shadow-md shadow-[#d38764]/25 scale-102'
                        : 'bg-white border-[#ede5dd] hover:border-[#d38764]/60 hover:bg-[#fbf7f4] hover:shadow-2xs'
                    }`}
                  >
                    <div>
                      <span className="text-sm mb-1 block">{preset.icon}</span>
                      <p className={`text-xs font-black leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {preset.name}
                      </p>
                    </div>
                    <span className={`text-[10px] mt-1.5 font-medium block truncate ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                      {preset.landmark.split('(')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-[#f0e8e0] bg-[#fbf7f4] flex justify-between items-center text-xs">
          <span className="text-slate-400 text-[11px]">
            ⚡ พิมพ์ค้นหาชื่อตึก, ออฟฟิศ, กองบิน, หรือบริษัทได้ทันที
          </span>
          <button
            onClick={() => setIsWorkplaceModalOpen(false)}
            className="px-5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
