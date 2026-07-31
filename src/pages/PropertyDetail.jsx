import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Heart, Share2, Info, LayoutDashboard, ChevronLeft, ChevronRight, Navigation, ExternalLink, Building, Landmark, GraduationCap, Hospital, ShoppingBag } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCompare } from '../CompareContext';
import { useProperties } from '../PropertiesContext';
import './PropertyDetail.css';

export default function PropertyDetail() {
  const { id } = useParams();
  const { properties, loading } = useProperties();
  const { addToCompare } = useCompare();

  const prop = properties.find(p => p.id === id) || (properties.length > 0 ? properties[0] : null);
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or unit index '0', '1', '2'
  const [currentIndex, setCurrentIndex] = useState(0);

  // Determine current unit selected (null if 'overview')
  const selectedUnit = (activeTab !== 'overview' && prop?.unitTypes && prop.unitTypes[parseInt(activeTab)])
    ? prop.unitTypes[parseInt(activeTab)]
    : null;

  // Filter Images based on activeTab
  const mainImages = prop?.image ? prop.image.split(',') : [];
  const selectedUnitImages = selectedUnit
    ? [...(selectedUnit.planImages || []), ...(selectedUnit.roomImages || [])].filter(Boolean)
    : [];
  const allUnitImages = prop?.unitTypes ? prop.unitTypes.flatMap(u => [...(u.planImages || []), ...(u.roomImages || [])]) : [];

  // When 'overview', show main project images + overview photos; when specific unit, show that unit's images first!
  const allImages = selectedUnit && selectedUnitImages.length > 0
    ? [...new Set([...selectedUnitImages, ...mainImages])].filter(Boolean)
    : [...new Set([...mainImages, ...allUnitImages])].filter(Boolean);

  const selectedImage = allImages.length > 0 ? allImages[currentIndex] : '';

  // Dynamic Price & Specs
  const displayPriceLabel = selectedUnit ? `ราคาสำหรับ ${selectedUnit.name || 'แบบห้องนี้'}` : 'ราคาเริ่มต้น';
  const displayPrice = selectedUnit ? selectedUnit.price : prop?.price;
  const displayPriceTo = selectedUnit ? '' : prop?.priceTo;
  const displaySize = selectedUnit?.size || prop?.size;
  const displayBedrooms = selectedUnit?.bedrooms || selectedUnit?.roomType || prop?.bedrooms;

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab, prop?.id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-bold">กำลังโหลดข้อมูลโครงการ...</p>
      </div>
    );
  }

  if (!prop) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-background">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">ไม่พบข้อมูลโครงการนี้</h2>
        <p className="text-gray-500 mb-6 text-sm">โครงการที่คุณค้นหาอาจถูกลบ หรืออาจไม่มีข้อมูลอยู่ในขณะนี้</p>
        <Link to="/search" className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-dark transition-all">
          🔍 ไปยังหน้าค้นหาโครงการ
        </Link>
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleAction = (action) => alert(`กำลังดำเนินการ: ${action}`);

  return (
    <div className="container py-4 sm:py-8">
      {/* Title & Developer Row */}
      {/* Header Section: Name & Developer */}
      <div className="prop-header-container">
        <div>
          <h1 className="prop-title">
            {prop.name}
          </h1>
        </div>
        {prop.developer && (
          <div className="prop-developer-badge">
            <span className="developer-label">Developer</span>
            <span className="developer-name">{prop.developer}</span>
          </div>
        )}
      </div>

      {/* Modern Premium Tab Bar */}
      <div className="tab-scroll-container">
        <div className="tab-track">
          <button
            onClick={() => setActiveTab('overview')}
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            ภาพรวมโครงการ
          </button>

          {prop.unitTypes && prop.unitTypes.map((u, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i.toString())}
              className={`tab-btn ${activeTab === i.toString() ? 'active' : ''}`}
            >
              {u.name ? `แบบห้อง: ${u.name}` : `แบบห้องที่ ${i + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* Price & Specs Summary Row */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <span className="text-xs text-gray-500 block">{selectedUnit ? `ราคาสำหรับ ${selectedUnit.name || 'แบบห้องนี้'}` : (displayPrice ? 'ราคาเริ่มต้น' : 'ราคา')}</span>
          <div className="text-lg sm:text-2xl font-black text-primary leading-none mt-0.5">
            {displayPrice
              ? <>{displayPrice} {displayPriceTo ? `- ${displayPriceTo}` : ''} <span className="text-sm font-bold">ล้านบาท</span></>
              : 'ราคาติดต่อสอบถาม'
            }
          </div>
        </div>
        {selectedUnit && (
          <div className="text-xs sm:text-sm font-semibold text-gray-600 text-right">
            {displayBedrooms && `${displayBedrooms} Bed • `}{displaySize} {displaySize && !displaySize.includes('ตร') ? 'ตร.ม.' : ''}
          </div>
        )}
      </div>

      {/* Main Image Gallery Carousel with Side Arrows Overlayed */}
      <div className="gallery-section mb-5">
        <div style={{position: 'relative', width: '100%', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', background: '#111'}}>
          <img
            src={selectedImage}
            alt="property"
            style={{width: '100%', height: '320px', objectFit: 'cover', objectPosition: 'center', display: 'block', transition: 'opacity 0.3s'}}
          />

          {allImages.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                aria-label="Previous image"
                style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.25)', border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)', zIndex: 10,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.25)'}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNext}
                aria-label="Next image"
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.25)', border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)', zIndex: 10,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.25)'}
              >
                <ChevronRight size={20} />
              </button>
              <div style={{
                position: 'absolute', bottom: '10px', right: '12px',
                background: 'rgba(0,0,0,0.45)', color: 'white', fontSize: '11px',
                padding: '2px 10px', borderRadius: '999px', backdropFilter: 'blur(4px)', fontWeight: 600, zIndex: 10
              }}>
                {currentIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails row */}
        {allImages.length > 1 && (
          <div className="thumbnail-list flex gap-3 mt-3 overflow-x-auto pb-2 snap-x scrollbar-none">
            {allImages.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`thumb-${idx}`} 
                onClick={() => setCurrentIndex(idx)}
                className={`w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-xl cursor-pointer border-2 shrink-0 snap-start transition-all ${currentIndex === idx ? 'border-primary shadow-md scale-95' : 'border-transparent opacity-75 hover:opacity-100'}`} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="flex flex-col gap-2.5 mb-6 sm:mb-8">
        <button 
          className="btn btn-primary w-full py-3.5 text-sm sm:text-base font-bold shadow-md rounded-2xl flex items-center justify-center gap-2"
          onClick={() => handleAction('ฟอร์มติดต่อโครงการ')}
        >
          📞 ติดต่อโครงการ / นัดชมสถานที่จริง
        </button>

        <div className="grid grid-cols-3 gap-2">
          <button className="btn btn-secondary text-xs py-2 rounded-xl" onClick={() => handleAction('บันทึกโครงการ')}>
            <Heart size={15} /> บันทึก
          </button>
          <button className="btn btn-secondary text-xs py-2 rounded-xl" onClick={() => handleAction('คัดลอกลิงก์เพื่อแชร์')}>
            <Share2 size={15} /> แชร์
          </button>
          <button className="btn btn-secondary text-xs py-2 rounded-xl" onClick={() => addToCompare(prop)}>
            <LayoutDashboard size={15} /> เปรียบเทียบ
          </button>
        </div>
      </div>

      {/* Main Details Area */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="main-info flex-2">
          {activeTab === 'overview' && (
            <>
              {/* Project Specs */}
              <h3 className="mb-4 text-lg font-bold text-gray-900">🏢 รายละเอียดและสเปกโครงการ</h3>
              <div className="specs-grid mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <Info size={22} color="var(--primary)" />
                  <p className="label text-xs text-gray-400 mt-1">ผู้พัฒนา</p>
                  <p className="val text-sm font-bold text-gray-800">{prop.developer}</p>
                </div>
                <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <LayoutDashboard size={22} color="var(--primary)" />
                  <p className="label text-xs text-gray-400 mt-1">จำนวนชั้น</p>
                  <p className="val text-sm font-bold text-gray-800">{prop.floors} ชั้น</p>
                </div>
                <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <LayoutDashboard size={22} color="var(--primary)" />
                  <p className="label text-xs text-gray-400 mt-1">จำนวนยูนิต</p>
                  <p className="val text-sm font-bold text-gray-800">{prop.totalUnits} ยูนิต</p>
                </div>
                <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <Info size={22} color="var(--primary)" />
                  <p className="label text-xs text-gray-400 mt-1">สถานะโครงการ</p>
                  <p className="val text-sm font-bold text-gray-800">{prop.status}</p>
                </div>
              </div>

              {/* Facilities Section in Overview */}
              <div className="mb-8 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🏊 สิ่งอำนวยความสะดวกในโครงการ (Facilities)
                </h3>

                <div className="space-y-4">
                  {prop.special && prop.special.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-pink-700 block mb-2">✨ จุดเด่น / รูปแบบการอยู่อาศัย:</span>
                      <div className="flex flex-wrap gap-2">
                        {prop.special.map((s, i) => (
                          <span key={i} className="px-3.5 py-1.5 bg-pink-50 text-pink-700 rounded-full text-xs font-semibold border border-pink-100">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {prop.facilities && prop.facilities.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-blue-700 block mb-2">🏊 สิ่งอำนวยความสะดวกส่วนกลาง:</span>
                      <div className="flex flex-wrap gap-2">
                        {prop.facilities.map((f, i) => (
                          <span key={i} className="px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {prop.security && prop.security.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-emerald-700 block mb-2">🛡️ ระบบรักษาความปลอดภัย:</span>
                      <div className="flex flex-wrap gap-2">
                        {prop.security.map((s, i) => (
                          <span key={i} className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {prop.healthFacilities && prop.healthFacilities.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-purple-700 block mb-2">🏥 บริการด้านสุขภาพ:</span>
                      <div className="flex flex-wrap gap-2">
                        {prop.healthFacilities.map((h, i) => (
                          <span key={i} className="px-3.5 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-100">{h}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {prop.services && prop.services.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-amber-700 block mb-2">🛎️ บริการพิเศษ:</span>
                      <div className="flex flex-wrap gap-2">
                        {prop.services.map((s, i) => (
                          <span key={i} className="px-3.5 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-100">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {prop.promotion && (
                    <div>
                      <span className="text-xs font-bold text-rose-600 block mb-2">🎁 โปรโมชั่น / สิทธิพิเศษ:</span>
                      <div className="p-3.5 bg-rose-50 text-rose-700 rounded-xl text-sm leading-relaxed border border-rose-100 shadow-sm whitespace-pre-wrap">
                        {prop.promotion}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab !== 'overview' && selectedUnit && (
            <div className="mb-8 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 m-0">🏡 รายละเอียดแบบ: {selectedUnit.name}</h3>
                <span className="text-lg font-black text-primary">{selectedUnit.price} ล้านบาท</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="text-xs text-gray-400 block">พื้นที่ใช้สอย</span>
                  <span className="text-sm font-bold text-gray-800">{selectedUnit.size || selectedUnit.usableArea || prop.size} ตร.ม.</span>
                </div>
                {selectedUnit.landSize && (
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-xs text-gray-400 block">ขนาดที่ดิน</span>
                    <span className="text-sm font-bold text-gray-800">{selectedUnit.landSize} ตร.วา</span>
                  </div>
                )}
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="text-xs text-gray-400 block">ห้องนอน / ห้องน้ำ</span>
                  <span className="text-sm font-bold text-gray-800">{selectedUnit.bedrooms || selectedUnit.roomType || prop.bedrooms} Bed</span>
                </div>
              </div>

              {/* Floor Plan Images */}
              {selectedUnit.planImages && selectedUnit.planImages.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📐 แปลนห้อง (Floor Plan)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedUnit.planImages.map((img, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden border border-gray-200 group cursor-pointer" onClick={() => { const idx = allImages.indexOf(img); if (idx !== -1) setCurrentIndex(idx); }}>
                        <img src={img} alt={`plan-${i}`} className="w-full h-44 object-cover group-hover:scale-105 transition-all" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white font-bold text-xs">🔍 ขยายภาพ</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Photos */}
              {selectedUnit.roomImages && selectedUnit.roomImages.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">🛋️ ภาพบรรยากาศห้องจริง</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedUnit.roomImages.map((img, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden border border-gray-200 group cursor-pointer" onClick={() => { const idx = allImages.indexOf(img); if (idx !== -1) setCurrentIndex(idx); }}>
                        <img src={img} alt={`room-${i}`} className="w-full h-32 object-cover group-hover:scale-105 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="side-map flex-1">
          <div className="map-card-small overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="m-0 text-base font-bold text-gray-800 flex items-center gap-1.5">
                <MapPin size={18} className="text-primary" /> ทำเลและสถานที่ใกล้เคียง
              </h4>
              <span className="text-xs text-gray-500 font-medium">{prop.province || 'กรุงเทพและปริมณฑล'}</span>
            </div>
            
            {/* Interactive Leaflet Map */}
            <div className="map-container-wrapper">
              <MapContainer 
                center={[prop.location?.lat || 13.7563, prop.location?.lng || 100.5018]} 
                zoom={14} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <Marker position={[prop.location?.lat || 13.7563, prop.location?.lng || 100.5018]}>
                  <Popup>
                    <div className="text-xs font-bold p-1">
                      📍 {prop.name}<br />
                      <span className="font-normal text-gray-500">{prop.developer}</span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>

              {/* Direct Open in Google Maps Overlay Button */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${prop.location?.lat || 13.7563},${prop.location?.lng || 100.5018}`}
                target="_blank"
                rel="noopener noreferrer"
                className="google-maps-overlay-btn"
              >
                <Navigation size={12} className="text-primary" /> Google Maps
              </a>
            </div>

            {/* Categorized Landmark Distances */}
            <div className="space-y-3">
              {/* 1. รถไฟฟ้า / การเดินทาง */}
              {((prop.categorizedLandmarks?.transit && prop.categorizedLandmarks.transit.length > 0) || prop.station) && (
                <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-900 mb-1.5 flex items-center gap-1">
                    🚆 รถไฟฟ้า / การเดินทาง
                  </p>
                  <div className="space-y-1">
                    {prop.categorizedLandmarks?.transit && prop.categorizedLandmarks.transit.length > 0 ? (
                      prop.categorizedLandmarks.transit.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="text-gray-700 font-medium">{item.name}</span>
                          <span className="font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">{item.distance}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-700 font-medium">{prop.station || 'สถานีรถไฟฟ้าใกล้เคียง'}</span>
                          <span className="font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">{prop.distanceToStation || '500 ม.'}</span>
                        </div>
                        {prop.province === 'นครปฐม' && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-700 font-medium">ทางด่วนศรีรัช-วงแหวนรอบนอก</span>
                            <span className="font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">12.5 กม.</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* 2. ห้างสรรพสินค้า / ช้อปปิ้ง */}
              {prop.categorizedLandmarks?.malls && prop.categorizedLandmarks.malls.length > 0 && (
                <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                  <p className="text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1">
                    🏬 ห้างสรรพสินค้า / ช้อปปิ้ง
                  </p>
                  <div className="space-y-1">
                    {prop.categorizedLandmarks.malls.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        <span className="font-bold text-amber-600 bg-white px-2 py-0.5 rounded border border-amber-200">{item.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. โรงพยาบาล */}
              {prop.categorizedLandmarks?.hospitals && prop.categorizedLandmarks.hospitals.length > 0 && (
                <div className="bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                  <p className="text-xs font-bold text-rose-900 mb-1.5 flex items-center gap-1">
                    🏥 โรงพยาบาล / สถานพยาบาล
                  </p>
                  <div className="space-y-1">
                    {prop.categorizedLandmarks.hospitals.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        <span className="font-bold text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-200">{item.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. โรงเรียน / มหาวิทยาลัย */}
              {prop.categorizedLandmarks?.schools && prop.categorizedLandmarks.schools.length > 0 && (
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-900 mb-1.5 flex items-center gap-1">
                    🎓 โรงเรียน / มหาวิทยาลัย
                  </p>
                  <div className="space-y-1">
                    {prop.categorizedLandmarks.schools.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        <span className="font-bold text-emerald-600 bg-white px-2 py-0.5 rounded border border-emerald-200">{item.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href={`https://www.google.com/maps/search/places+near+${prop.location?.lat || 13.7563},${prop.location?.lng || 100.5018}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all"
            >
              <ExternalLink size={14} /> เปิดดูแผนที่สถานที่สำคัญรอบข้างทั้งหมดบน Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
