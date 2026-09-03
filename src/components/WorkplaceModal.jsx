import React, { useState, useEffect, useRef } from 'react';
import { useWorkplace } from '../WorkplaceContext';
import { searchPlacesLikeGoogle, POPULAR_THAI_PLACES } from '../utils/placeSearch';
import { 
  Building2, MapPin, X, Check, Search, Navigation, Trash2, 
  ArrowRight, Sparkles, Clock, Loader2, Compass, ExternalLink 
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
    }, 220); // Snappy 220ms debounce for Google-like response

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
          // Reverse geocode via Nominatim
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight flex items-center gap-1.5">
                <span>ระบุสถานที่ทำงาน (Workplace)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ค้นหาและคำนวณเวลาเดินทางจริงแบบ Google Maps
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
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-slate-50 border border-blue-200/80 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Check size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                    ที่ทำงานปัจจุบันของคุณ
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

          {/* Google-like Search Bar */}
          <div className="space-y-2">
            <div className="relative">
              {/* Google Search Style Container */}
              <div className="relative flex items-center bg-white border-2 border-blue-500/80 focus-within:border-blue-600 rounded-2xl shadow-md shadow-blue-500/10 transition-all">
                <div className="pl-3.5 pr-2 text-blue-600 flex items-center justify-center pointer-events-none">
                  {isSearching ? (
                    <Loader2 size={18} className="animate-spin text-blue-600" />
                  ) : (
                    <Search size={18} />
                  )}
                </div>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsInputFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="พิมพ์ชื่อตึก, ออฟฟิศ, บริษัท, สถานีรถไฟฟ้า, ซอย..."
                  className="w-full py-3 pr-9 text-xs sm:text-sm font-medium bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
                  autoFocus
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSearchResults([]); searchInputRef.current?.focus(); }}
                    className="absolute right-3 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs transition-colors cursor-pointer"
                    title="ล้างข้อความ"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Google Places Autocomplete Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100 animate-in fade-in-50 zoom-in-95">
                <div className="px-3 py-1.5 bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>ผลการค้นหาสถานที่ ({searchResults.length})</span>
                  <span className="text-blue-600">คลิกเพื่อเลือก</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectPlace(item)}
                      className="p-3 hover:bg-blue-50/70 transition-colors cursor-pointer flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-100 text-base flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                        {item.icon || '📍'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-tight truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.secondary}
                        </p>
                      </div>
                      <div className="text-slate-300 group-hover:text-blue-600 transition-colors mt-1">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No search results hint */}
            {searchQuery.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
              <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-200/80">
                <p className="text-xs text-slate-600 font-bold">ไม่พบสถานที่ "{searchQuery}"</p>
                <p className="text-[11px] text-slate-400 mt-0.5">ลองพิมพ์ชื่ออาคารภาษาอังกฤษ หรือชื่อถนน/สถานีรถไฟฟ้าใกล้เคียง</p>
              </div>
            )}

            {/* Recent Searches (Google-style) */}
            {!searchQuery && recentSearches.length > 0 && (
              <div className="p-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/60">
                <div className="flex items-center justify-between px-1 mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" />
                    ประวัติการค้นหาล่าสุด
                  </span>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-[10px] text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                  >
                    ล้างประวัติ
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((rec, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectPlace(rec)}
                      className="p-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-100 hover:border-blue-200 cursor-pointer transition-colors flex items-center justify-between text-xs"
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
              className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 shadow-2xs cursor-pointer"
            >
              <Navigation size={14} className={geoLoading ? 'animate-spin text-blue-600' : 'text-blue-600'} />
              <span>{geoLoading ? 'กำลังระบุพิกัด GPS...' : '📍 ใช้ตำแหน่งปัจจุบันของฉัน (GPS)'}</span>
            </button>
          </div>

          {/* Quick 1-Click Popular Office Hubs */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
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
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-102'
                        : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-2xs'
                    }`}
                  >
                    <div>
                      <span className="text-sm mb-1 block">{preset.icon}</span>
                      <p className={`text-xs font-black leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {preset.name}
                      </p>
                    </div>
                    <span className={`text-[10px] mt-1.5 font-medium block truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {preset.landmark.split('(')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-slate-100 bg-slate-50/70 flex justify-between items-center text-xs">
          <span className="text-slate-400 text-[11px]">
            ⚡ รองรับพิมพ์ค้นหาชื่อตึก, ถนน, สถานี, หรือบริษัท
          </span>
          <button
            onClick={() => setIsWorkplaceModalOpen(false)}
            className="px-5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
