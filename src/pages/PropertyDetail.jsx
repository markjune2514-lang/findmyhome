import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Heart, Share2, Info, LayoutDashboard, ChevronLeft, ChevronRight, Navigation, ExternalLink, Building, Landmark, GraduationCap, Hospital, ShoppingBag, Search, Phone, Waves, Sparkles, ShieldCheck, Activity, BellRing, Gift, Home, Ruler, ZoomIn, Image as ImageIcon, Train, Car, Map, Sofa, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCompare } from '../CompareContext';
import { useProperties } from '../PropertiesContext';
import SEO from '../components/SEO';
import './PropertyDetail.css';

export default function PropertyDetail({ previewData }) {
  const { id } = useParams();
  const { properties, loading } = useProperties();
  const { addToCompare } = useCompare();

  const prop = previewData || properties.find(p => p.id === id) || (properties.length > 0 ? properties[0] : null);
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or unit index '0', '1', '2'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Scroll Tab Logic
  const tabScrollRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (tabScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  React.useEffect(() => {
    // Slight delay to allow DOM to render tabs before checking
    setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [prop?.unitTypes]);

  const scrollTabs = (direction) => {
    if (tabScrollRef.current) {
      const scrollAmount = 250;
      tabScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 300); // Check again after smooth scroll
    }
  };

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
  const displayPriceLabel = selectedUnit ? `ราคาสำหรับ ${selectedUnit.name ? 'TYPE: ' + selectedUnit.name : 'TYPE นี้'}` : 'ราคาเริ่มต้น';
  const displayPrice = selectedUnit ? selectedUnit.price : prop?.price;
  const displayPriceTo = selectedUnit ? '' : prop?.priceTo;
  const displaySize = selectedUnit?.size || prop?.size;
  const displayBedrooms = selectedUnit?.bedrooms || prop?.bedrooms;
  const displayBathrooms = selectedUnit?.bathrooms || prop?.bathrooms;
  const displayParking = selectedUnit?.parking || prop?.parking;
  const displayMultipurpose = selectedUnit?.multipurpose || prop?.multipurpose;
  
  const cleanSpec = (s) => typeof s === 'string' ? s.replace(/beds?|bedrooms?|ห้องนอน|ห้องน้ำ|ที่จอดรถ|ห้องอเนกประสงค์/gi, '').trim() : s;

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
        <Link to="/search" className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-2 max-w-fit mx-auto">
          <Search size={18} /> ไปยังหน้าค้นหาโครงการ
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
      <SEO 
        title={prop.name} 
        description={`${prop.name} โดย ${prop.developer} - ${prop.type} เริ่มต้น ${prop.price} ${prop.listingType === 'เช่า' ? 'บาท/เดือน' : 'ล้านบาท'} ${prop.province}`} 
        image={allImages.length > 0 ? allImages[0] : null}
      />
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
            <span className="developer-name">{prop.developer}</span>
          </div>
        )}
      </div>

      {/* Modern Premium Tab Bar */}
      <div className="relative group mb-6">
        {/* Left Arrow Indicator */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-[0.25rem] flex items-center pr-8 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none">
            <button 
              onClick={() => scrollTabs('left')}
              className="pointer-events-auto bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all ml-1"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

        <div 
          className="tab-scroll-container" 
          style={{ marginBottom: 0 }}
          ref={tabScrollRef}
          onScroll={checkScroll}
        >
          <div className="tab-track">
            <button
              onClick={() => setActiveTab('overview')}
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            >
              ภาพรวมโครงการ
            </button>

            {Array.isArray(prop.unitTypes) && prop.unitTypes.map((u, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i.toString())}
                className={`tab-btn ${activeTab === i.toString() ? 'active' : ''}`}
              >
                {u.name ? `TYPE: ${u.name}` : `TYPE ${i + 1}`}
              </button>
            ))}
          </div>
        </div>

        {/* Right Arrow Indicator */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-[0.25rem] flex items-center pl-8 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none">
            <button 
              onClick={() => scrollTabs('right')}
              className="pointer-events-auto bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all mr-1"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Price & Specs Summary Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500 font-medium">{selectedUnit ? `ราคาสำหรับ ${selectedUnit.name ? 'TYPE: ' + selectedUnit.name : 'TYPE นี้'}` : (displayPrice ? 'ราคาเริ่มต้น' : 'ราคา')}</span>
          <h2 className={`font-black tracking-tight ${!displayPrice ? 'text-primary' : 'text-gray-900'} leading-none m-0`} style={{ fontSize: '1.8rem' }}>
              {displayPrice 
                ? <>{displayPrice} {displayPriceTo ? `- ${displayPriceTo}` : ''} <span className="text-base font-bold">{prop.listingType === 'เช่า' ? 'บาท/เดือน' : 'ล้านบาท'}</span></>
                : 'ราคาติดต่อสอบถาม'
              }
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
          {displayBedrooms && (
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-blue-100">
              <span>🛏️</span> {cleanSpec(displayBedrooms)} <span className="hidden sm:inline">ห้องนอน</span>
            </div>
          )}
          {displayBathrooms && (
            <div className="flex items-center gap-1.5 bg-cyan-50 text-cyan-700 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-cyan-100">
              <span>🚿</span> {cleanSpec(displayBathrooms)} <span className="hidden sm:inline">ห้องน้ำ</span>
            </div>
          )}
          {displayParking && (
            <div className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-slate-200">
              <Car size={16} className="text-slate-500" /> {cleanSpec(displayParking)} <span className="hidden sm:inline">ที่จอดรถ</span>
            </div>
          )}
          {displayMultipurpose && (
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-amber-100">
              <Star size={16} className="text-amber-500" /> {cleanSpec(displayMultipurpose)} <span className="hidden sm:inline">อเนกประสงค์</span>
            </div>
          )}
          {displaySize && (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-emerald-100">
              <Ruler size={16} className="text-emerald-500" /> {displaySize} {displaySize && !String(displaySize).includes('ตร') ? 'ตร.ม.' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Main Image Gallery Carousel with Side Arrows Overlayed */}
      <div className="gallery-section mb-5">
        <div style={{position: 'relative', width: '100%', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', background: '#111'}}>
          <img
            src={selectedImage}
            alt="property"
            onClick={() => setIsLightboxOpen(true)}
            style={{width: '100%', height: '400px', objectFit: 'contain', objectPosition: 'center', display: 'block', transition: 'opacity 0.3s', cursor: 'pointer'}}
          />

          {/* Enlarge Hint */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 pointer-events-none backdrop-blur-sm">
            <ZoomIn size={14} /> กดเพื่อดูรูปเต็ม
          </div>

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
          className="btn btn-primary w-full py-3.5 text-sm sm:text-base font-bold shadow-md rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          onClick={() => handleAction('ฟอร์มติดต่อโครงการ')}
        >
          <Phone size={18} /> ติดต่อโครงการ / นัดชมสถานที่จริง
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
              {/* Project Highlights */}
              {prop.projectHighlights && (
                <div className="mb-8 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                    <Sparkles className="text-primary" size={20} />
                    <h3 className="text-lg font-black text-gray-900 m-0 tracking-tight">จุดเด่นของโครงการ</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                    {prop.projectHighlights}
                  </p>
                </div>
              )}

              {/* Project Specs */}
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <Building className="text-primary" size={24} />
                <h3 className="text-xl font-black text-gray-900 m-0 tracking-tight">รายละเอียดและสเปกโครงการ</h3>
              </div>
              <div className="specs-grid mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {prop.projectType && (
                  <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <Building size={22} color="var(--primary)" />
                    <p className="label text-xs text-gray-400 mt-1">ประเภท</p>
                    <p className="val text-sm font-bold text-gray-800">
                      {(prop.type === 'บ้าน' || prop.type === 'ทาวน์โฮม') && ['High Rise', 'Low Rise', 'Mixed Use'].includes(prop.projectType) 
                        ? prop.type 
                        : prop.projectType}
                    </p>
                  </div>
                )}
                {prop.roomType && (
                  <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <Home size={22} color="var(--primary)" />
                    <p className="label text-xs text-gray-400 mt-1">รูปแบบ</p>
                    <p className="val text-sm font-bold text-gray-800">{prop.roomType}</p>
                  </div>
                )}
                <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <Info size={22} color="var(--primary)" />
                  <p className="label text-xs text-gray-400 mt-1">ผู้พัฒนา</p>
                  <p className="val text-sm font-bold text-gray-800">{prop.developer}</p>
                </div>
                <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <LayoutDashboard size={22} color="var(--primary)" />
                  <p className="label text-xs text-gray-400 mt-1">จำนวนชั้น</p>
                  <p className="val text-sm font-bold text-gray-800">{prop.floors}{String(prop.floors).includes('ชั้น') ? '' : ' ชั้น'}</p>
                </div>
                <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <LayoutDashboard size={22} color="var(--primary)" />
                  <p className="label text-xs text-gray-400 mt-1">จำนวนยูนิต</p>
                  <p className="val text-sm font-bold text-gray-800">{prop.totalUnits} ยูนิต</p>
                </div>
                {prop.buildings && (
                  <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <Building size={22} color="var(--primary)" />
                    <p className="label text-xs text-gray-400 mt-1">จำนวนอาคาร</p>
                    <p className="val text-sm font-bold text-gray-800">{prop.buildings} อาคาร</p>
                  </div>
                )}
                {prop.totalLandArea && (
                  <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <Map size={22} color="var(--primary)" />
                    <p className="label text-xs text-gray-400 mt-1">ขนาดที่ดิน</p>
                    <p className="val text-sm font-bold text-gray-800">{prop.totalLandArea}</p>
                  </div>
                )}
                {prop.projectParking && (
                  <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center md:col-span-2">
                    <Car size={22} color="var(--primary)" />
                    <p className="label text-xs text-gray-400 mt-1">ที่จอดรถ</p>
                    <p className="val text-sm font-bold text-gray-800">{prop.projectParking}</p>
                  </div>
                )}
                {prop.fullyFurnished && (
                  <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <Sofa size={22} color="var(--primary)" />
                    <p className="label text-xs text-gray-400 mt-1">ตกแต่ง</p>
                    <p className="val text-sm font-bold text-gray-800 text-primary">Fully Furnished</p>
                  </div>
                )}
                <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <Info size={22} color="var(--primary)" />
                  <p className="label text-xs text-gray-400 mt-1">สถานะโครงการ</p>
                  <p className="val text-sm font-bold text-gray-800">{prop.status}</p>
                </div>
              </div>

              {/* Facilities Section in Overview */}
              <div className="facilities-card">
                <h3 className="facilities-card-title">
                  <Waves color="var(--primary)" size={22} /> สิ่งอำนวยความสะดวกในโครงการ
                </h3>

                <div className="space-y-4">
                  {Array.isArray(prop.special) && prop.special.length > 0 && (
                    <div className="facility-group">
                      <span className="facility-group-title text-pink"><Sparkles size={14} /> จุดเด่น / รูปแบบการอยู่อาศัย:</span>
                      <div className="facility-tags-wrapper">
                        {prop.special.map((s, i) => (
                          <span key={i} className="facility-tag tag-pink">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(prop.facilities) && prop.facilities.length > 0 && (
                    <div className="facility-group">
                      <span className="facility-group-title text-blue"><Waves size={14} /> สิ่งอำนวยความสะดวกส่วนกลาง:</span>
                      <div className="facility-tags-wrapper">
                        {prop.facilities.map((f, i) => (
                          <span key={i} className="facility-tag tag-blue">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(prop.security) && prop.security.length > 0 && (
                    <div className="facility-group">
                      <span className="facility-group-title text-emerald"><ShieldCheck size={14} /> ระบบรักษาความปลอดภัย:</span>
                      <div className="facility-tags-wrapper">
                        {prop.security.map((s, i) => (
                          <span key={i} className="facility-tag tag-emerald">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(prop.healthFacilities) && prop.healthFacilities.length > 0 && (
                    <div className="facility-group">
                      <span className="facility-group-title text-purple"><Activity size={14} /> บริการด้านสุขภาพ:</span>
                      <div className="facility-tags-wrapper">
                        {prop.healthFacilities.map((h, i) => (
                          <span key={i} className="facility-tag tag-purple">{h}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(prop.services) && prop.services.length > 0 && (
                    <div className="facility-group">
                      <span className="facility-group-title text-amber"><BellRing size={14} /> บริการพิเศษ:</span>
                      <div className="facility-tags-wrapper">
                        {prop.services.map((s, i) => (
                          <span key={i} className="facility-tag tag-amber">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {prop.promotion && (
                    <div className="facility-group">
                      <span className="facility-group-title text-rose"><Gift size={14} /> โปรโมชั่น / สิทธิพิเศษ:</span>
                      <div className="promotion-box">
                        {prop.promotion}
                      </div>
                    </div>
                  )}

                  {Array.isArray(prop.building_details) && prop.building_details.length > 0 && (
                    <div className="facility-group">
                      <span className="facility-group-title text-indigo"><Building size={14} /> ข้อมูลรายอาคาร:</span>
                      <div className="flex flex-col gap-3 mt-2">
                        {prop.building_details.map((bldg, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col gap-2">
                            <span className="font-bold text-gray-800 text-sm">{bldg.name || `อาคาร ${idx + 1}`}</span>
                            {Array.isArray(bldg.facilities) && bldg.facilities.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {bldg.facilities.map((f, i) => (
                                  <span key={i} className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-400 italic">
                                {prop.facilityType === 'ส่วนกลางเหมือนกันทุกตึก' ? 'ใช้ส่วนกลางร่วมกันทุกอาคาร' : 'ไม่มีข้อมูลส่วนกลางเฉพาะอาคาร'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab !== 'overview' && selectedUnit && (
            <div className="mb-8 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Home className="text-primary" size={24} />
                  <h3 className="text-xl font-black text-gray-900 m-0 tracking-tight">รายละเอียด TYPE: {selectedUnit.name}</h3>
                </div>
                {selectedUnit.price ? (
                  <span className="text-lg font-black text-primary">
                    {selectedUnit.price} {prop.listingType === 'เช่า' ? 'บาท/เดือน' : 'ล้านบาท'}
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {selectedUnit.roomType && (
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-xs text-gray-400 block">รูปแบบ</span>
                    <span className="text-sm font-bold text-gray-800">{selectedUnit.roomType}</span>
                  </div>
                )}
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
                {selectedUnit.width && (
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-xs text-gray-400 block">ความกว้าง</span>
                    <span className="text-sm font-bold text-gray-800">{selectedUnit.width} ม.</span>
                  </div>
                )}
                {selectedUnit.depth && (
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-xs text-gray-400 block">ความลึก</span>
                    <span className="text-sm font-bold text-gray-800">{selectedUnit.depth} ม.</span>
                  </div>
                )}
                <div className="p-3 bg-neutral-50 rounded-xl">
                  <span className="text-xs text-gray-400 block">ห้องนอน / ห้องน้ำ / อเนกประสงค์ / ที่จอดรถ</span>
                  <span className="text-sm font-bold text-gray-800">
                    {[
                      displayBedrooms ? `${cleanSpec(displayBedrooms)} ห้องนอน` : null,
                      displayBathrooms ? `${cleanSpec(displayBathrooms)} ห้องน้ำ` : null,
                      displayMultipurpose ? `${cleanSpec(displayMultipurpose)} อเนกประสงค์` : null,
                      displayParking ? `${cleanSpec(displayParking)} ที่จอดรถ` : null
                    ].filter(Boolean).join(' / ') || 'ไม่ระบุ'}
                  </span>
                </div>
                {selectedUnit.special && (
                  <div className="p-3 bg-neutral-50 rounded-xl col-span-2">
                    <span className="text-xs text-gray-400 block">จุดเด่นพิเศษ</span>
                    <span className="text-sm font-bold text-gray-800">{selectedUnit.special}</span>
                  </div>
                )}
              </div>

              {/* Floor Plan Images */}
              {Array.isArray(selectedUnit.planImages) && selectedUnit.planImages.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Ruler size={14} /> แปลนห้อง (Floor Plan)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedUnit.planImages.map((img, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden border border-gray-200 group cursor-pointer bg-gray-50 flex items-center justify-center" onClick={() => { const idx = allImages.indexOf(img); if (idx !== -1) setCurrentIndex(idx); }}>
                        <img src={img} alt={`plan-${i}`} className="w-full h-44 object-contain group-hover:scale-105 transition-all" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white font-bold text-xs gap-1"><ZoomIn size={14} /> ขยายภาพ</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Photos */}
              {Array.isArray(selectedUnit.roomImages) && selectedUnit.roomImages.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><ImageIcon size={14} /> ภาพบรรยากาศห้องจริง</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedUnit.roomImages.map((img, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden border border-gray-200 group cursor-pointer bg-gray-50 flex items-center justify-center" onClick={() => { const idx = allImages.indexOf(img); if (idx !== -1) setCurrentIndex(idx); }}>
                        <img src={img} alt={`room-${i}`} className="w-full h-32 object-contain group-hover:scale-105 transition-all" />
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
                      <div className="flex items-center gap-1 mb-1"><MapPin size={12} className="text-primary" /> {prop.name}</div>
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
              {((Array.isArray(prop.categorizedLandmarks?.transit) && prop.categorizedLandmarks.transit.length > 0) || prop.station) && (
                <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-900 mb-1.5 flex items-center gap-1.5">
                    <Train size={14} /> รถไฟฟ้า / การเดินทาง
                  </p>
                  <div className="space-y-1">
                    {Array.isArray(prop.categorizedLandmarks?.transit) && prop.categorizedLandmarks.transit.length > 0 ? (
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
              {Array.isArray(prop.categorizedLandmarks?.malls) && prop.categorizedLandmarks.malls.length > 0 && (
                <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                  <p className="text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
                    <ShoppingBag size={14} /> ห้างสรรพสินค้า / ช้อปปิ้ง
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
              {Array.isArray(prop.categorizedLandmarks?.hospitals) && prop.categorizedLandmarks.hospitals.length > 0 && (
                <div className="bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                  <p className="text-xs font-bold text-rose-900 mb-1.5 flex items-center gap-1.5">
                    <Hospital size={14} /> โรงพยาบาล / สถานพยาบาล
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
              {Array.isArray(prop.categorizedLandmarks?.schools) && prop.categorizedLandmarks.schools.length > 0 && (
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap size={14} /> โรงเรียน / มหาวิทยาลัย
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

      {/* Lightbox Modal for Full Image Viewing */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col p-4 overflow-y-auto">
          <div className="flex justify-end mb-4 sticky top-0 z-[210]">
            <button onClick={() => setIsLightboxOpen(false)} className="text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 flex items-start justify-center pb-10">
            <img 
              src={selectedImage} 
              alt="Full size property" 
              className="max-w-full h-auto rounded-lg shadow-2xl"
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
