import React, { useState } from 'react';
import { useWorkplace } from '../WorkplaceContext';
import { Building2, MapPin, X, Check, Search, Navigation, Trash2, ArrowRight, Sparkles } from 'lucide-react';

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
  const [customName, setCustomName] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);

  if (!isWorkplaceModalOpen) return null;

  const handleSelectPreset = (preset) => {
    setWorkplace({
      id: preset.id,
      name: preset.name,
      landmark: preset.landmark,
      lat: preset.lat,
      lng: preset.lng,
      area: preset.area
    });
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
        try {
          // Reverse geocode via Nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=th`);
          const data = await res.json();
          if (data && data.display_name) {
            const parts = data.display_name.split(',');
            placeName = parts.slice(0, 3).join(', ');
          }
        } catch (e) {
          console.error(e);
        }
        setWorkplace({
          id: 'custom_gps',
          name: placeName,
          landmark: 'พิกัด GPS',
          lat: latitude,
          lng: longitude,
          area: 'พิกัดปัจจุบัน'
        });
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

  const handleSearchPlaces = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      // Search Nominatim with Thailand viewbox focus
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery + ' กรุงเทพ')}&format=json&countrycodes=th&limit=5&accept-language=th`);
      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (item) => {
    const displayName = customName.trim() || item.display_name.split(',')[0];
    setWorkplace({
      id: 'search_' + item.place_id,
      name: displayName,
      landmark: item.display_name.split(',').slice(0, 2).join(', '),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      area: item.display_name.split(',').slice(1, 3).join(', ')
    });
    setSearchResults([]);
    setSearchQuery('');
    setCustomName('');
    setIsWorkplaceModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                ระบุสถานที่ทำงาน (Workplace)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ดูระยะทางและเวลาเดินทางจริง เพื่อเปรียบเทียบทุกโครงการ
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsWorkplaceModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Active Workplace Indicator (If Set) */}
          {workplace && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Check size={18} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                    ที่ทำงานปัจจุบันของคุณ
                  </span>
                  <p className="text-sm font-black text-slate-900 truncate">
                    {workplace.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {workplace.landmark || workplace.area}
                  </p>
                </div>
              </div>
              <button
                onClick={clearWorkplace}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-white hover:bg-rose-50 border border-rose-200 transition-colors flex-shrink-0"
                title="ลบที่ทำงาน"
              >
                <Trash2 size={13} />
                <span>ลบ</span>
              </button>
            </div>
          )}

          {/* Quick 1-Click Popular Office Hubs */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
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
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-102'
                        : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <span className="text-base mb-1 block">{preset.icon}</span>
                      <p className={`text-xs font-extrabold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {preset.name}
                      </p>
                    </div>
                    <span className={`text-[10px] mt-2 font-medium block truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {preset.landmark.split('(')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-xs font-bold text-slate-400">หรือ</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Custom Search Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Search size={14} className="text-blue-600" />
              ค้นหาชื่อตึก / สถานที่ทำงานของคุณ
            </h4>

            <form onSubmit={handleSearchPlaces} className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="เช่น สีลมคอมเพล็กซ์, เซ็นทรัลเวิลด์, ซอยทองหล่อ..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSearching ? 'ค้นหา...' : 'ค้นหา'}
              </button>
            </form>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 max-h-48 overflow-y-auto">
                {searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectSearchResult(res)}
                    className="p-2.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-100 hover:border-blue-200 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <MapPin size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                        {res.display_name.split(',')[0]}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {res.display_name}
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-slate-400 mt-1" />
                  </div>
                ))}
              </div>
            )}

            {/* Use Current GPS Button */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-200/80 cursor-pointer"
            >
              <Navigation size={14} className={geoLoading ? 'animate-spin text-blue-600' : 'text-blue-600'} />
              <span>{geoLoading ? 'กำลังดึงพิกัด GPS...' : '📍 ใช้ตำแหน่งปัจจุบันของฉัน (GPS)'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            onClick={() => setIsWorkplaceModalOpen(false)}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
