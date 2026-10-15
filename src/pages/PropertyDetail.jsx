import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Heart, Share2, Info, LayoutDashboard, ChevronLeft, ChevronRight, Navigation, ExternalLink, Building, Landmark, GraduationCap, Hospital, ShoppingBag, Search, Phone, Waves, Sparkles, ShieldCheck, Activity, BellRing, Gift, Home, Ruler, ZoomIn, ZoomOut, Maximize2, RotateCcw, Image as ImageIcon, Train, Car, Map, Sofa, X, HelpCircle, ChevronDown, Building2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import LoanCalculator from '../components/LoanCalculator';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCompare } from '../CompareContext';
import { useProperties } from '../PropertiesContext';
import { useFavorites } from '../FavoritesContext';
import { useWorkplace } from '../WorkplaceContext';
import SEO from '../components/SEO';
import './PropertyDetail.css';

// Resilient helper to extract floor plan images across various data conventions
const getUnitPlans = (unit) => {
  if (!unit) return [];
  const rawPlans = unit.planImages || unit.plan_images || unit.floorPlans || unit.floorPlan || unit.planImage || [];
  let plans = [];
  if (Array.isArray(rawPlans)) {
    plans = rawPlans.flatMap(p => typeof p === 'string' ? (p.includes(',') ? p.split(',') : [p]) : [p]);
  } else if (typeof rawPlans === 'string' && rawPlans.trim()) {
    plans = rawPlans.split(',');
  }
  const unitImg = typeof unit.image === 'string' ? unit.image.trim() : '';
  const cleaned = plans
    .map(s => typeof s === 'string' ? s.trim() : '')
    .filter(Boolean)
    .filter(url => !unitImg || url !== unitImg);
  return [...new Set(cleaned)];
};

export default function PropertyDetail({ previewData }) {
  const { id } = useParams();
  const { properties, loading: globalLoading, fetchPropertyById } = useProperties();
  const { addToCompare } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { workplace, calculateCommute, setIsWorkplaceModalOpen } = useWorkplace();

  const [fullProp, setFullProp] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Use previewData if provided, or fullProp if loaded, or summary fallback
  const summaryProp = properties.find(p => p.id === id) || null;
  const prop = previewData || fullProp || summaryProp;
  const loading = (globalLoading && !prop) || (detailLoading && !prop);

  // On-demand fetch of heavy property details (unit_types, landmarks, facilities)
  React.useEffect(() => {
    if (previewData || !id) return;
    
    let isMounted = true;
    if (!fullProp || fullProp.id !== id) {
      setDetailLoading(true);
      fetchPropertyById(id).then(data => {
        if (isMounted && data) {
          setFullProp(data);
        }
      }).finally(() => {
        if (isMounted) setDetailLoading(false);
      });
    }
    return () => { isMounted = false; };
  }, [id, previewData, fetchPropertyById]);
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or unit index '0', '1', '2'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxTitle, setLightboxTitle] = useState('');
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [cardPlanIndex, setCardPlanIndex] = useState({}); // Track active floor plan index per unit card

  const openLightbox = (imgUrl, title = '') => {
    setLightboxImage(imgUrl || selectedImage);
    setLightboxTitle(title || prop?.name || '');
    setLightboxZoom(1);
    setIsLightboxOpen(true);
  };

  // Keyboard navigation & zoom shortcuts for lightbox
  React.useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === '+' || e.key === '=') {
        setLightboxZoom(z => Math.min(3, +(z + 0.5).toFixed(1)));
      } else if (e.key === '-') {
        setLightboxZoom(z => Math.max(1, +(z - 0.5).toFixed(1)));
      } else if (e.key === '0') {
        setLightboxZoom(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

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
  const propOverviewImages = Array.isArray(prop?.images) 
    ? prop.images 
    : (typeof prop?.images === 'string' ? prop.images.split(',') : []);
  const mainImages = prop?.image 
    ? (Array.isArray(prop.image) ? prop.image : (typeof prop.image === 'string' ? prop.image.split(',') : [String(prop.image)])).filter(Boolean) 
    : [];
  const combinedOverviewImages = [...new Set([...mainImages, ...propOverviewImages].map(s => typeof s === 'string' ? s.trim() : s).filter(Boolean))];

  const selectedUnitImages = selectedUnit
    ? [...new Set([
        selectedUnit.image, 
        ...getUnitPlans(selectedUnit), 
        ...(Array.isArray(selectedUnit.roomImages) ? selectedUnit.roomImages : (typeof selectedUnit.roomImages === 'string' ? selectedUnit.roomImages.split(',') : []))
      ].map(s => typeof s === 'string' ? s.trim() : s).filter(Boolean))]
    : [];
  const allUnitImages = prop?.unitTypes 
    ? [...new Set(prop.unitTypes.flatMap(u => [
        u.image, 
        ...getUnitPlans(u), 
        ...(Array.isArray(u.roomImages) ? u.roomImages : (typeof u.roomImages === 'string' ? u.roomImages.split(',') : []))
      ]).map(s => typeof s === 'string' ? s.trim() : s).filter(Boolean))] 
    : [];

  // When 'overview', show main project images + overview photos; when specific unit, show that unit's images first!
  const allImages = selectedUnit && selectedUnitImages.length > 0
    ? [...new Set([...selectedUnitImages, ...combinedOverviewImages])]
    : [...new Set([...combinedOverviewImages, ...allUnitImages])];

  const selectedImage = allImages.length > 0 ? allImages[currentIndex] : '';

  // Dynamic Price & Specs
  const displayPriceLabel = (selectedUnit && selectedUnit.price) ? `ราคาสำหรับ ${selectedUnit.name ? 'TYPE: ' + selectedUnit.name : 'TYPE นี้'}` : (prop?.price ? 'ราคาเริ่มต้น' : 'ราคา');
  const displayPrice = (selectedUnit && selectedUnit.price) ? selectedUnit.price : prop?.price;
  const displayPriceTo = selectedUnit ? '' : prop?.priceTo;
  const displaySize = selectedUnit?.size || prop?.size;
  const displayBedrooms = selectedUnit?.bedrooms || prop?.bedrooms;
  const displayBathrooms = selectedUnit?.bathrooms || prop?.bathrooms;
  const displayParking = selectedUnit?.parking || prop?.parking;
  const displayMultipurpose = selectedUnit?.multipurpose || prop?.multipurpose;
  
  // Luxury Rooms
  const displayLivingRoom = selectedUnit?.living_room || selectedUnit?.livingRoom;
  const displayFamilyRoom = selectedUnit?.family_room || selectedUnit?.familyRoom;
  const displayKitchen = selectedUnit?.kitchen;
  const displayDiningRoom = selectedUnit?.dining_room || selectedUnit?.diningRoom;
  const displayMaidRoom = selectedUnit?.maid_room || selectedUnit?.maidRoom;
  const displayPrayerRoom = selectedUnit?.prayer_room || selectedUnit?.prayerRoom;
  const displayElevator = selectedUnit?.elevator;
  const displayPool = selectedUnit?.private_pool || selectedUnit?.privatePool;
  
  const cleanSpec = (s) => typeof s === 'string' ? s.replace(/beds?|bedrooms?|ห้องนอน|ห้องน้ำ|ที่จอดรถ|ห้องอเนกประสงค์/gi, '').trim() : s;
  const cleanMulti = cleanSpec(displayMultipurpose);
  const hasMultipurpose = Boolean(cleanMulti) && cleanMulti !== '0' && cleanMulti !== '-' && cleanMulti !== '';

  // Helper to split comma-separated strings into arrays for distinct tags
  const splitTags = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.flatMap(item => typeof item === 'string' ? item.split(',') : [item])
              .map(s => typeof s === 'string' ? s.trim() : s)
              .filter(Boolean);
  };

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

  // Base URL & Canonicals
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://findmyhome.in.th';
  const pageUrl = typeof window !== 'undefined' ? window.location.href : `${baseUrl}/property/${prop.id}`;

  // 1. Schema.org RealEstateListing / Residence for Search Engines
  const propertySchema = {
    '@context': 'https://schema.org',
    '@type': prop.type === 'คอนโด' ? 'ApartmentComplex' : 'SingleFamilyResidence',
    'additionalType': 'https://schema.org/RealEstateListing',
    'name': prop.name,
    'description': `${prop.name} โครงการ${prop.type} โดย ${prop.developer || ''} ทำเล ${prop.district || ''} ${prop.province || ''} ราคาเริ่มต้น ${prop.price} ${prop.listingType === 'เช่า' ? 'บาท/เดือน' : 'ล้านบาท'} พื้นที่ใช้สอย ${prop.size || '-'} ตร.ม.`,
    'url': pageUrl,
    'image': allImages.slice(0, 6),
    ...(prop.location?.lat && prop.location?.lng ? {
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': prop.location.lat,
        'longitude': prop.location.lng
      }
    } : {}),
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': prop.district || '',
      'addressRegion': prop.province || 'กรุงเทพมหานคร',
      'addressCountry': 'TH'
    },
    'offers': {
      '@type': 'Offer',
      'price': prop.price ? (prop.listingType === 'เช่า' ? parseFloat(prop.price) : parseFloat(prop.price) * 1000000) : undefined,
      'priceCurrency': 'THB',
      'availability': 'https://schema.org/InStock',
      'url': pageUrl
    },
    ...(prop.bedrooms ? { 'numberOfRooms': parseInt(prop.bedrooms, 10) } : {}),
    ...(prop.size ? { 'floorSize': { '@type': 'QuantitativeValue', 'value': parseFloat(prop.size), 'unitCode': 'MTK' } } : {}),
    'amenityFeature': (prop.facilities || []).slice(0, 15).map(f => ({
      '@type': 'LocationFeatureSpecification',
      'name': f,
      'value': true
    }))
  };

  // 2. Schema.org FAQPage for Answer Engine Optimization (AEO - Perplexity, ChatGPT, Gemini, Google AI)
  const faqItems = [
    {
      q: `โครงการ ${prop.name} ราคาเริ่มต้นเท่าไหร่?`,
      a: `โครงการ ${prop.name} มีราคาเริ่มต้นอยู่ที่ ${prop.price} ${prop.listingType === 'เช่า' ? 'บาท/เดือน' : 'ล้านบาท'} พัฒนาโดย ${prop.developer || 'ผู้พัฒนาอสังหาริมทรัพย์ชั้นนำ'}`
    },
    {
      q: `โครงการ ${prop.name} ตั้งอยู่ที่ไหน และการเดินทางสะดวกไหม?`,
      a: `โครงการตั้งอยู่ที่ ${prop.district ? `${prop.district}, ` : ''}${prop.province || 'ประเทศไทย'} ${prop.station ? `ใกล้สถานีรถไฟฟ้า ${prop.station} ${prop.distanceToStation ? `(${prop.distanceToStation})` : ''}` : 'เดินทางสะดวกเชื่อมต่อถนนสายหลักและทางด่วน'}`
    },
    {
      q: `สิ่งอำนวยความสะดวกในโครงการ ${prop.name} มีอะไรบ้าง?`,
      a: prop.facilities && prop.facilities.length > 0 
        ? `สิ่งอำนวยความสะดวกภายในโครงการ ได้แก่ ${prop.facilities.slice(0, 8).join(', ')} พร้อมระบบรักษาความปลอดภัยตลอด 24 ชั่วโมง` 
        : `โครงการมีสิ่งอำนวยความสะดวกและพื้นที่ส่วนกลางครบครันตามมาตรฐานโครงการคุณภาพ`
    },
    {
      q: `โครงการ ${prop.name} มีแบบบ้านหรือยูนิตประเภทใดบ้าง?`,
      a: prop.unitTypes && prop.unitTypes.length > 0
        ? `มีแบบยูนิตทั้งหมด ${prop.unitTypes.length} แบบ ได้แก่ ${prop.unitTypes.map(u => `${u.name} (ขนาด ${u.size} ตร.ม.)`).join(', ')}`
        : `มีขนาดพื้นที่ใช้สอยประมาณ ${prop.size || '-'} ตร.ม. พร้อมฟังก์ชันห้องครบครัน`
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqItems.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a
      }
    }))
  };

  // 3. Schema.org Breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'หน้าแรก',
        'item': baseUrl
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'โครงการทั้งหมด',
        'item': `${baseUrl}/projects`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': prop.name,
        'item': pageUrl
      }
    ]
  };

  return (
    <div className="container py-4 sm:py-8">
      <SEO 
        title={`${prop.name} (${prop.type}) เริ่มต้น ${prop.price} ${prop.listingType === 'เช่า' ? 'บาท/เดือน' : 'ล้านบาท'} - ${prop.developer || 'Find My Home'}`}
        description={`${prop.name} โครงการ${prop.type} โดย ${prop.developer || ''} ทำเล ${prop.district || ''} ${prop.province} ราคาเริ่มต้น ${prop.price} ${prop.listingType === 'เช่า' ? 'บาท/เดือน' : 'ล้านบาท'} ขนาด ${prop.size || '-'} ตร.ม. ดูข้อมูลโครงการ แผนที่ แบบบ้าน และสถานที่ใกล้เคียง`} 
        image={allImages.length > 0 ? allImages[0] : null}
        canonical={pageUrl}
        keywords={`${prop.name}, ${prop.type} ${prop.name}, ${prop.developer}, ${prop.province}, ${prop.district}, ซื้อ${prop.type}, บ้านมือหนึ่ง, คอนโดใกล้รถไฟฟ้า, รีวิว ${prop.name}`}
        jsonLd={[propertySchema, faqSchema, breadcrumbSchema]}
      />
      {/* Title & Developer Row */}
      {/* Header Section: Name & Developer */}
      <div className="prop-header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="prop-title">
            {prop.name}
          </h1>
          {prop.developer && (
            <div className="prop-developer-badge" style={{ marginTop: '8px' }}>
              <span className="developer-name">{prop.developer}</span>
            </div>
          )}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100 shadow-sm">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span className="text-[11px] font-bold">ข้อมูลตรวจสอบแล้ว (Verified)</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium px-1">
              <Activity size={12} className="text-orange-500" />
              อัปเดตล่าสุด: {prop.updated_at ? new Date(prop.updated_at).toLocaleDateString('th-TH', {year: 'numeric', month: 'short', day: 'numeric'}) : 'วันนี้'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={(e) => { e.preventDefault(); toggleFavorite(prop.id); }}
            style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--white)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--neutral-2)' }}
            title={isFavorite(prop.id) ? "ลบออกจากรายการโปรด" : "บันทึกรายการโปรด"}
          >
            <Heart size={20} color={isFavorite(prop.id) ? "#e11d48" : "#64748b"} fill={isFavorite(prop.id) ? "#e11d48" : "transparent"} />
          </button>
        </div>
      </div>

      {/* Modern Premium Tab Bar */}
      <div className="relative group mb-6 overflow-hidden max-w-full">
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
                {u.size ? <span className="ml-1 text-[11px] opacity-75 font-normal">({u.size} ตร.ม.)</span> : null}
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
          {hasMultipurpose && (
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-amber-100">
              <Star size={16} className="text-amber-500" /> {cleanMulti} <span className="hidden sm:inline">อเนกประสงค์</span>
            </div>
          )}
          {displayLivingRoom && (
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-orange-100" title="ห้องนั่งเล่น / ห้องรับแขก">
              <span>🛋️</span> {displayLivingRoom} <span className="hidden sm:inline">ห้องนั่งเล่น</span>
            </div>
          )}
          {displayFamilyRoom && (
            <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-indigo-100" title="ห้องพักผ่อนชั้นบน">
              <span>👨‍👩‍👧</span> {displayFamilyRoom} <span className="hidden sm:inline">พักผ่อนบน</span>
            </div>
          )}
          {displayDiningRoom && (
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-amber-200" title="ส่วนรับประทานอาหาร">
              <span>🍽️</span> {displayDiningRoom} <span className="hidden sm:inline">ทานอาหาร</span>
            </div>
          )}
          {displayKitchen && (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-emerald-200" title="ห้องครัวไทย">
              <span>🍳</span> {displayKitchen} <span className="hidden sm:inline">ครัวไทย</span>
            </div>
          )}
          {displayMaidRoom && (
            <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-rose-100" title="ห้องแม่บ้าน">
              <span>🧹</span> {displayMaidRoom} <span className="hidden sm:inline">ห้องแม่บ้าน</span>
            </div>
          )}
          {displayPrayerRoom && (
            <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-1.5 rounded-lg text-sm font-bold border border-purple-100" title="ห้องพระ">
              <span>🪷</span> {displayPrayerRoom} <span className="hidden sm:inline">ห้องพระ</span>
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
            referrerPolicy="no-referrer"
            onClick={() => openLightbox(selectedImage, `${prop?.name || 'ภาพโครงการ'} (${currentIndex + 1}/${allImages.length})`)}
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
                referrerPolicy="no-referrer"
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
          <button 
            className="btn btn-secondary text-xs py-2 rounded-xl flex items-center justify-center gap-1" 
            onClick={(e) => { e.preventDefault(); toggleFavorite(prop.id); }}
            title={isFavorite(prop.id) ? "ลบออกจากรายการโปรด" : "บันทึกรายการโปรด"}
          >
            <Heart size={15} color={isFavorite(prop.id) ? "#e11d48" : "currentColor"} fill={isFavorite(prop.id) ? "#e11d48" : "transparent"} /> 
            {isFavorite(prop.id) ? "บันทึกแล้ว" : "บันทึก"}
          </button>
          <button className="btn btn-secondary text-xs py-2 rounded-xl flex items-center justify-center gap-1" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('คัดลอกลิงก์เรียบร้อยแล้ว');
          }}>
            <Share2 size={15} /> แชร์
          </button>
          <button className="btn btn-secondary text-xs py-2 rounded-xl flex items-center justify-center gap-1" onClick={() => addToCompare(prop)}>
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
              {(prop.projectHighlights || prop.project_highlights) && (
                <div className="mb-8 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                    <Sparkles className="text-primary" size={20} />
                    <h3 className="text-lg font-black text-gray-900 m-0 tracking-tight">จุดเด่นของโครงการ</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                    {prop.projectHighlights || prop.project_highlights}
                  </p>
                </div>
              )}

              {/* แบบบ้านและแปลนห้อง (Unit Models & Floor Plans) Showcase on Overview Tab */}
              {Array.isArray(prop.unitTypes) && prop.unitTypes.length > 0 && (
                <section className="mb-8" id="overview-floor-plans-section">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                        <Ruler size={22} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 m-0 tracking-tight flex items-center gap-2">
                          แบบบ้านและแปลนห้อง
                          <span className="text-xs font-bold text-gray-400 hidden sm:inline">(Unit Models & Floor Plans)</span>
                        </h3>
                        <p className="text-xs text-gray-500 m-0 mt-0.5">
                          แบบบ้านและแปลนอาคารทั้งหมดในโครงการ คลิกเพื่อซูมดูแปลน 2D หรือเลือกดูรายละเอียดแต่ละแบบ
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        ทั้งหมด {prop.unitTypes.length} แบบบ้าน
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {prop.unitTypes.map((u, idx) => {
                      const unitPlans = getUnitPlans(u);
                      const hasPlans = unitPlans.length > 0;
                      const currentFloorIdx = cardPlanIndex[idx] || 0;
                      const activePlanImg = hasPlans ? (unitPlans[currentFloorIdx] || unitPlans[0]) : null;
                      const previewImg = activePlanImg || u.image || (allImages.length > 0 ? allImages[0] : null);

                      return (
                        <div 
                          key={idx} 
                          className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
                        >
                          {/* Card Header */}
                          <div className="p-4 bg-gradient-to-r from-gray-50/90 via-white to-blue-50/30 border-b border-gray-100 flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-2xs">
                                  TYPE {idx + 1}
                                </span>
                                <h4 className="text-base font-extrabold text-gray-900 m-0 tracking-tight">
                                  {u.name ? `แบบบ้าน ${u.name}` : `ยูนิตแบบที่ ${idx + 1}`}
                                </h4>
                                {(u.type || u.roomType || u.house_type) && (
                                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                                    {u.type || u.roomType || u.house_type}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {u.landSize ? `ที่ดิน ${u.landSize} ตร.วา • ` : ''}
                                พื้นที่ใช้สอย <strong className="text-gray-800">{u.size || u.usableArea || prop.size || '-'}</strong> ตร.ม.
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right shrink-0">
                              <span className="text-[11px] text-gray-400 block font-medium">ราคา</span>
                              <span className="text-base font-black text-primary">
                                {u.price 
                                  ? `${u.price} ${prop.listingType === 'เช่า' ? 'บ./ด.' : 'ลบ.'}`
                                  : (prop.price ? `เริ่ม ${prop.price} ${prop.listingType === 'เช่า' ? 'บ./ด.' : 'ลบ.'}` : 'สอบถาม')
                                }
                              </span>
                            </div>
                          </div>

                          {/* Quick Specs Strip */}
                          <div className="px-4 py-2 bg-gray-50/70 border-b border-gray-100 flex flex-wrap items-center gap-2 text-xs">
                            {(u.bedrooms || prop.bedrooms) && (
                              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                                🛏️ {cleanSpec(u.bedrooms || prop.bedrooms)} นอน
                              </span>
                            )}
                            {(u.bathrooms || prop.bathrooms) && (
                              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                                🚿 {cleanSpec(u.bathrooms || prop.bathrooms)} น้ำ
                              </span>
                            )}
                            {(u.parking || prop.parking) && (
                              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                                🚗 {cleanSpec(u.parking || prop.parking)} จอด
                              </span>
                            )}
                            {Boolean(u.multipurpose || prop.multipurpose) && (
                              <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                ⭐ {cleanSpec(u.multipurpose || prop.multipurpose)} อเนกประสงค์
                              </span>
                            )}
                          </div>

                          {/* Floor Plan Showcase Area */}
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              {/* Floor selector tabs if multiple plans */}
                              {unitPlans.length > 1 && (
                                <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto pb-1">
                                  <span className="text-[11px] font-bold text-gray-400 shrink-0 mr-1">เลือกชั้น:</span>
                                  {unitPlans.map((_, pIdx) => (
                                    <button
                                      key={pIdx}
                                      type="button"
                                      onClick={() => setCardPlanIndex(prev => ({ ...prev, [idx]: pIdx }))}
                                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                                        currentFloorIdx === pIdx 
                                          ? 'bg-blue-600 text-white shadow-xs' 
                                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                      }`}
                                    >
                                      แปลนชั้น {pIdx + 1}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Plan Image Display Container */}
                              <div 
                                className="relative rounded-xl border-2 border-dashed border-gray-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer overflow-hidden group/plan flex items-center justify-center min-h-[220px] max-h-[260px] p-2"
                                onClick={() => {
                                  if (previewImg) {
                                    openLightbox(
                                      previewImg, 
                                      `แบบบ้าน ${u.name || `TYPE ${idx + 1}`} • ${hasPlans ? `แปลนชั้น ${currentFloorIdx + 1}` : 'ภาพตัวอย่างแบบบ้าน'}`
                                    );
                                  }
                                }}
                                title="คลิกเพื่อซูมดูแปลนขนาดใหญ่เต็มจอ"
                              >
                                {previewImg ? (
                                  <>
                                    <img 
                                      src={previewImg} 
                                      alt={`แบบบ้าน ${u.name || idx + 1} ${hasPlans ? `แปลนชั้น ${currentFloorIdx + 1}` : ''}`}
                                      className="max-h-[240px] w-auto max-w-full object-contain mx-auto transition-transform duration-300 group-hover/plan:scale-105"
                                      loading="lazy"
                                      referrerPolicy="no-referrer"
                                    />
                                    
                                    {/* Floor Badge on top-left of image */}
                                    <div className="absolute top-2.5 left-2.5 bg-blue-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                                      <Ruler size={12} />
                                      {hasPlans ? `แปลนชั้น ${currentFloorIdx + 1}` : 'ภาพแบบบ้าน'}
                                    </div>

                                    {/* Zoom hint badge on top-right */}
                                    <div className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-xs flex items-center gap-1 opacity-80 group-hover/plan:opacity-100 transition-opacity">
                                      <ZoomIn size={12} /> ซูมแปลน
                                    </div>

                                    {/* Hover Overlay Button */}
                                    <div className="absolute inset-0 bg-blue-950/30 opacity-0 group-hover/plan:opacity-100 transition-opacity flex items-center justify-center">
                                      <span className="bg-white text-blue-700 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover/plan:translate-y-0 transition-transform">
                                        <Maximize2 size={14} /> ดูแปลนขนาดใหญ่ (High-Res)
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-center py-8 text-gray-400">
                                    <Ruler size={32} className="mx-auto mb-2 text-gray-300" />
                                    <p className="text-xs font-semibold m-0">แบบแปลนอยู่ระหว่างจัดทำ</p>
                                    <p className="text-[11px] text-gray-400 m-0 mt-0.5">ติดต่อโครงการเพื่อขอรับแบบแปลน</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
                              {previewImg ? (
                                <button
                                  type="button"
                                  onClick={() => openLightbox(
                                    previewImg, 
                                    `แบบบ้าน ${u.name || `TYPE ${idx + 1}`} • ${hasPlans ? `แปลนชั้น ${currentFloorIdx + 1}` : 'ภาพตัวอย่าง'}`
                                  )}
                                  className="w-full py-2 px-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <ZoomIn size={14} /> ซูมแปลนห้อง
                                </button>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab(idx.toString());
                                  window.scrollTo({ top: 320, behavior: 'smooth' });
                                }}
                                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                  previewImg 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs' 
                                    : 'col-span-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                                }`}
                              >
                                <span>ดูรายละเอียดแบบนี้</span>
                                <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Project Specs */}
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <Building className="text-primary" size={24} />
                <h3 className="text-xl font-black text-gray-900 m-0 tracking-tight">รายละเอียดและสเปกโครงการ</h3>
              </div>
              <div className="specs-grid mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {(prop.project_type || prop.projectType || prop.type) && (
                  <div className="spec-item p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <Building size={22} color="var(--primary)" />
                    <p className="label text-xs text-gray-400 mt-1">ประเภท</p>
                    <p className="val text-sm font-bold text-gray-800">
                      {prop.project_type || prop.projectType || prop.type}
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
                  {Array.isArray(prop.special) && prop.special.length > 0 && splitTags(prop.special).length > 0 && (
                    <div className="facility-group">
                      <span className="facility-group-title text-pink"><Sparkles size={14} /> จุดเด่น / รูปแบบการอยู่อาศัย:</span>
                      <div className="facility-tags-wrapper">
                        {splitTags(prop.special).map((s, i) => (
                          <span key={i} className="facility-tag tag-pink">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(prop.facilities) && prop.facilities.length > 0 && splitTags(prop.facilities).length > 0 && (
                    <div className="facility-group">
                      <span className="facility-group-title text-blue"><Waves size={14} /> สิ่งอำนวยความสะดวกส่วนกลาง:</span>
                      <div className="facility-tags-wrapper">
                        {splitTags(prop.facilities).map((f, i) => (
                          <span key={i} className="facility-tag tag-blue">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(prop.security) && prop.security.length > 0 && splitTags(prop.security).length > 0 && (
                    <div className="facility-group">
                      <span className="facility-group-title text-emerald"><ShieldCheck size={14} /> ระบบรักษาความปลอดภัย:</span>
                      <div className="facility-tags-wrapper">
                        {splitTags(prop.security).map((s, i) => (
                          <span key={i} className="facility-tag tag-emerald">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(prop.healthFacilities) && prop.healthFacilities.length > 0 && splitTags(prop.healthFacilities).length > 0 && (
                    <div className="facility-group">
                      <span className="facility-group-title text-purple"><Activity size={14} /> บริการด้านสุขภาพ:</span>
                      <div className="facility-tags-wrapper">
                        {splitTags(prop.healthFacilities).map((h, i) => (
                          <span key={i} className="facility-tag tag-purple">{h}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(prop.services) && prop.services.length > 0 && splitTags(prop.services).length > 0 && (
                    <div className="facility-group">
                      <span className="facility-group-title text-amber"><BellRing size={14} /> บริการพิเศษ:</span>
                      <div className="facility-tags-wrapper">
                        {splitTags(prop.services).map((s, i) => (
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
                        {prop.building_details.map((bldg, idx) => {
                          if (typeof bldg === 'string') {
                            return (
                              <div key={idx} className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs font-semibold text-gray-700 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
                                {bldg}
                              </div>
                            );
                          }
                          return (
                            <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col gap-2">
                              <span className="font-bold text-gray-800 text-sm">{bldg?.name || `อาคาร ${idx + 1}`}</span>
                              {Array.isArray(bldg?.facilities) && bldg.facilities.length > 0 && splitTags(bldg.facilities).length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {splitTags(bldg.facilities).map((f, i) => (
                                    <span key={i} className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[10px] text-gray-400 italic">
                                  {prop.facilityType === 'ส่วนกลางเหมือนกันทุกตึก' ? 'ใช้ส่วนกลางร่วมกันทุกอาคาร' : 'ไม่มีข้อมูลส่วนกลางเฉพาะอาคาร'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* ภาพบรรยากาศห้องตัวอย่างและโครงการ (Gallery & Room Atmosphere) */}
                  {allImages && allImages.length > 0 && (
                    <div className="facilities-card mt-6">
                      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                        <h3 className="facilities-card-title m-0 flex items-center gap-2">
                          <ImageIcon color="var(--primary)" size={22} /> ภาพบรรยากาศห้องตัวอย่างและโครงการ
                        </h3>
                        <span className="text-xs text-gray-500 font-bold bg-neutral-100 px-2.5 py-1 rounded-full">
                          ทั้งหมด {allImages.length} รูป
                        </span>
                      </div>

                      {/* Gallery Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {allImages.slice(0, 12).map((img, i) => (
                          <div 
                            key={i} 
                            className="relative rounded-xl overflow-hidden border border-gray-200 group cursor-pointer bg-gray-50 aspect-[4/3] shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                            onClick={() => { setCurrentIndex(i); openLightbox(img, `${prop?.name || 'ภาพบรรยากาศห้องตัวอย่างและโครงการ'} (${i + 1}/${allImages.length})`); }}
                          >
                            <img 
                              src={img} 
                              alt={`gallery-${i}`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" 
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white font-bold text-xs gap-1">
                              <ZoomIn size={14} /> ขยายภาพ
                            </div>
                          </div>
                        ))}
                      </div>

                      {allImages.length > 12 && (
                        <div className="mt-4 text-center">
                          <button 
                            onClick={() => openLightbox(allImages[0], `${prop?.name || 'ภาพบรรยากาศห้องตัวอย่างและโครงการ'}`)}
                            className="px-5 py-2.5 bg-neutral-100 hover:bg-primary hover:text-white text-gray-700 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 shadow-sm border border-gray-200"
                          >
                            <ImageIcon size={14} /> ดูรูปภาพบรรยากาศทั้งหมด ({allImages.length} รูป)
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab !== 'overview' && selectedUnit && (
            <div className="mb-8 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Home className="text-primary" size={24} />
                  <h3 className="text-xl font-black text-gray-900 m-0 tracking-tight">รายละเอียด TYPE: {selectedUnit.name}</h3>
                </div>
                <div className="flex items-center gap-2.5">
                  {selectedUnit.price ? (
                    <span className="text-lg font-black text-primary">
                      {selectedUnit.price} {prop.listingType === 'เช่า' ? 'บาท/เดือน' : 'ล้านบาท'}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="text-xs font-bold text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-gray-200"
                  >
                    <span>← ดูทุกแบบบ้าน (ภาพรวม)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {(selectedUnit.type || selectedUnit.roomType || selectedUnit.house_type) && (
                  <div className="p-3 bg-neutral-50 rounded-xl">
                    <span className="text-xs text-gray-400 block">รูปแบบ</span>
                    <span className="text-sm font-bold text-gray-800">{selectedUnit.type || selectedUnit.roomType || selectedUnit.house_type}</span>
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
                <div className="p-3.5 bg-neutral-50 rounded-xl col-span-2 sm:col-span-4 border border-neutral-100">
                  <span className="text-xs text-gray-500 font-bold block mb-2 flex items-center gap-1.5">
                    <span>🏡</span> ฟังก์ชันห้องและพื้นที่ใช้สอย (Room Functions)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {displayBedrooms && (
                      <span className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                        🛏️ {cleanSpec(displayBedrooms)} ห้องนอน
                      </span>
                    )}
                    {displayBathrooms && (
                      <span className="inline-flex items-center gap-1 bg-white border border-cyan-200 text-cyan-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                        🚿 {cleanSpec(displayBathrooms)} ห้องน้ำ
                      </span>
                    )}
                    {displayParking && (
                      <span className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                        🚗 {cleanSpec(displayParking)} ที่จอดรถ
                      </span>
                    )}
                    {hasMultipurpose && (
                      <span className="inline-flex items-center gap-1 bg-white border border-amber-200 text-amber-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                        ⭐ {cleanMulti} ห้องอเนกประสงค์
                      </span>
                    )}
                    {displayLivingRoom && (
                      <span className="inline-flex items-center gap-1 bg-white border border-orange-200 text-orange-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                        🛋️ {displayLivingRoom} ห้องนั่งเล่น/รับแขก
                      </span>
                    )}
                    {displayFamilyRoom && (
                      <span className="inline-flex items-center gap-1 bg-white border border-indigo-200 text-indigo-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                        👨‍👩‍👧 {displayFamilyRoom} ห้องพักผ่อนชั้นบน
                      </span>
                    )}
                    {displayDiningRoom && (
                      <span className="inline-flex items-center gap-1 bg-white border border-amber-200 text-amber-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                        🍽️ {displayDiningRoom} ส่วนรับประทานอาหาร
                      </span>
                    )}
                    {displayKitchen && (
                      <span className="inline-flex items-center gap-1 bg-white border border-emerald-200 text-emerald-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                        🍳 {displayKitchen} ห้องครัวไทย
                      </span>
                    )}
                    {displayMaidRoom && (
                      <span className="inline-flex items-center gap-1 bg-white border border-rose-200 text-rose-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                        🧹 {displayMaidRoom} ห้องแม่บ้าน
                      </span>
                    )}
                    {displayPrayerRoom && (
                      <span className="inline-flex items-center gap-1 bg-white border border-purple-200 text-purple-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                        🪷 {displayPrayerRoom} ห้องพระ
                      </span>
                    )}
                    {displayElevator && (
                      <span className="inline-flex items-center gap-1 bg-white border border-cyan-200 text-cyan-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                        🛗 {displayElevator} ลิฟต์โดยสาร
                      </span>
                    )}
                    {displayPool && (
                      <span className="inline-flex items-center gap-1 bg-white border border-blue-300 text-blue-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                        🏊 สระว่ายน้ำส่วนตัว
                      </span>
                    )}
                    {Array.isArray(selectedUnit?.rooms_detail) && selectedUnit.rooms_detail.map((rm, rIdx) => {
                      if (['ห้องนอน', 'ห้องน้ำ', 'ที่จอดรถ', 'ห้องอเนกประสงค์', 'ห้องนั่งเล่น', 'ห้องรับแขก', 'ดับเบิ้ลลิฟวิ่งรูม', 'ห้องพักผ่อนชั้นบน', 'ส่วนพักผ่อนขนาดใหญ่', 'ส่วนรับประทานอาหาร', 'ห้องครัว', 'ห้องครัวไทยขนาดใหญ่ส่วนเตรียมอาหาร', 'ห้องแม่บ้าน', 'ห้องพระ', 'ลิฟต์', 'สระว่ายน้ำส่วนตัว'].includes(rm.title)) return null;
                      return (
                        <span key={rIdx} className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-2xs">
                          ✨ {rm.amount}x {rm.title}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {selectedUnit.special && (
                  <div className="p-3 bg-neutral-50 rounded-xl col-span-2">
                    <span className="text-xs text-gray-400 block">จุดเด่นพิเศษ</span>
                    <span className="text-sm font-bold text-gray-800">{selectedUnit.special}</span>
                  </div>
                )}
              </div>

              {/* Floor Plan Showcase (Individual Unit Tab) */}
              {(() => {
                const selectedPlans = getUnitPlans(selectedUnit);
                if (selectedPlans.length === 0) {
                  return (
                    <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-extrabold text-slate-800 m-0 flex items-center gap-2">
                          <Ruler size={16} className="text-primary" /> แปลนบ้านและผังห้อง (Floor Plan)
                        </h4>
                        <span className="text-[11px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                          รออัปเดตแปลน 2D
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 m-0">
                        สำหรับแบบบ้าน TYPE: {selectedUnit.name || ''} ข้อมูลแปลน 2D กำลังอยู่ระหว่างการอัปเดตลายเส้นสถาปัตยกรรม ท่านสามารถติดต่อโครงการเพื่อขอรับแปลนห้องแบบละเอียดได้
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="mb-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-gray-100 pb-3">
                      <div>
                        <h4 className="text-base font-black text-gray-900 m-0 flex items-center gap-2">
                          <Ruler size={18} className="text-primary" /> แปลนบ้านและผังห้อง 2D (Floor Plans)
                        </h4>
                        <p className="text-xs text-gray-500 m-0 mt-0.5">
                          แบบแปลนสถาปัตยกรรมแสดงตำแหน่งห้อง ประตู หน้าต่าง และการจัดวางพื้นที่ใช้สอย
                        </p>
                      </div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 self-start sm:self-center">
                        {selectedPlans.length} ชั้น / แบบแปลน
                      </span>
                    </div>

                    <div className={`grid gap-4 ${selectedPlans.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                      {selectedPlans.map((img, i) => (
                        <div 
                          key={i} 
                          className="bg-slate-50/70 border border-gray-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group/item"
                        >
                          {/* Floor Header Label */}
                          <div className="px-3.5 py-2 bg-white border-b border-gray-100 flex items-center justify-between">
                            <span className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                              {selectedPlans.length > 1 ? `แปลนชั้น ${i + 1} (Floor ${i + 1})` : 'แปลนแบบบ้านมาตรฐาน (Master Plan)'}
                            </span>
                            <button
                              type="button"
                              onClick={() => openLightbox(img, `TYPE: ${selectedUnit.name || ''} • ${selectedPlans.length > 1 ? `แปลนชั้น ${i + 1}` : 'แปลนบ้าน'}`)}
                              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-0.5 rounded"
                            >
                              <ZoomIn size={12} /> ขยายเต็มจอ
                            </button>
                          </div>

                          {/* Image Box */}
                          <div 
                            className="p-3 bg-white flex items-center justify-center cursor-pointer relative min-h-[240px] sm:min-h-[280px]"
                            onClick={() => openLightbox(img, `TYPE: ${selectedUnit.name || ''} • ${selectedPlans.length > 1 ? `แปลนชั้น ${i + 1}` : 'แปลนบ้าน'}`)}
                          >
                            <img 
                              src={img} 
                              alt={`แปลนชั้น ${i + 1}`} 
                              className="w-full h-56 sm:h-72 object-contain group-hover/item:scale-102 transition-transform duration-300"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                            
                            <div className="absolute inset-0 bg-blue-950/20 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="bg-white/95 backdrop-blur-xs text-blue-700 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                                <Maximize2 size={14} /> กดเพื่อซูมและสำรวจสเปกลายเส้นแปลน
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Room Photos */}
              {Array.isArray(selectedUnit.roomImages) && selectedUnit.roomImages.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><ImageIcon size={14} /> ภาพบรรยากาศห้องจริง</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedUnit.roomImages.map((img, i) => (
                      <div 
                        key={i} 
                        className="relative rounded-xl overflow-hidden border border-gray-200 group cursor-pointer bg-gray-50 flex items-center justify-center" 
                        onClick={() => openLightbox(img, `TYPE: ${selectedUnit.name || ''} • ภาพบรรยากาศห้องจริง (${i + 1}/${selectedUnit.roomImages.length})`)}
                      >
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
          {/* Workplace Commute Box */}
          {(() => {
            const commute = calculateCommute(prop?.location?.lat, prop?.location?.lng);
            return (
              <div className="mb-4 bg-white rounded-2xl border border-blue-100/90 shadow-sm p-4 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <h4 className="m-0 text-sm font-extrabold text-slate-900 leading-tight">
                        การเดินทางจากที่ทำงาน
                      </h4>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                        {workplace ? workplace.name : 'ยังไม่ได้ระบุที่ทำงาน'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsWorkplaceModalOpen(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                  >
                    {workplace ? 'เปลี่ยน' : '+ ระบุที่ทำงาน'}
                  </button>
                </div>

                {workplace && commute ? (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-white border border-blue-100 text-center shadow-2xs">
                        <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-bold">
                          <Car size={13} className="text-blue-600" /> ขับรถยนต์
                        </div>
                        <p className="text-base font-black text-slate-900 mt-0.5">
                          ~{commute.driveMinutes} <span className="text-xs font-bold">นาที</span>
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium">ระยะทาง {commute.distanceKm} กม.</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-indigo-100 text-center shadow-2xs">
                        <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-bold">
                          <Train size={13} className="text-indigo-600" /> รถไฟฟ้า/สาธารณะ
                        </div>
                        <p className="text-base font-black text-slate-900 mt-0.5">
                          ~{commute.transitMinutes} <span className="text-xs font-bold">นาที</span>
                        </p>
                        <span className={`inline-block text-[10px] font-bold px-1.5 rounded ${commute.tierColor}`}>
                          {commute.tier}
                        </span>
                      </div>
                    </div>

                    <a
                      href={commute.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer no-underline"
                    >
                      <Navigation size={13} />
                      <span>เปิดนำทาง Google Maps (โครงการ ➜ ที่ทำงาน)</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-dashed border-blue-200 text-center">
                    <p className="text-xs text-slate-600 mb-2">
                      ระบุสถานที่ทำงานของคุณ (เช่น สาทร, อโศก, พระราม 9) เพื่อคำนวณเวลาเดินทางด้วยรถยนต์และรถไฟฟ้า
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsWorkplaceModalOpen(true)}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      + ระบุที่ทำงานตอนนี้
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

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
              {(((Array.isArray(prop.categorizedLandmarks?.transit) && prop.categorizedLandmarks.transit.length > 0) ||
                (Array.isArray(prop.categorizedLandmarks?.transport) && prop.categorizedLandmarks.transport.length > 0)) || prop.station) && (
                <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-900 mb-1.5 flex items-center gap-1.5">
                    <Train size={14} /> รถไฟฟ้า / การเดินทาง
                  </p>
                  <div className="space-y-1">
                    {(prop.categorizedLandmarks?.transit || prop.categorizedLandmarks?.transport)?.length > 0 ? (
                      (prop.categorizedLandmarks.transit || prop.categorizedLandmarks.transport).map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="text-gray-700 font-medium">{item.name}</span>
                          <span className="font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">{item.distance}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-700 font-medium">{prop.station || 'สถานีรถไฟฟ้าใกล้เคียง'}</span>
                        <span className="font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">{prop.distanceToStation || '500 ม.'}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. ห้างสรรพสินค้า / ช้อปปิ้ง */}
              {((Array.isArray(prop.categorizedLandmarks?.malls) && prop.categorizedLandmarks.malls.length > 0) ||
                (Array.isArray(prop.categorizedLandmarks?.shopping) && prop.categorizedLandmarks.shopping.length > 0)) && (
                <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                  <p className="text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
                    <ShoppingBag size={14} /> ห้างสรรพสินค้า / ช้อปปิ้ง
                  </p>
                  <div className="space-y-1">
                    {(prop.categorizedLandmarks.malls || prop.categorizedLandmarks.shopping).map((item, i) => (
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
              {((Array.isArray(prop.categorizedLandmarks?.schools) && prop.categorizedLandmarks.schools.length > 0) ||
                (Array.isArray(prop.categorizedLandmarks?.education) && prop.categorizedLandmarks.education.length > 0)) && (
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap size={14} /> โรงเรียน / มหาวิทยาลัย
                  </p>
                  <div className="space-y-1">
                    {(prop.categorizedLandmarks.schools || prop.categorizedLandmarks.education).map((item, i) => (
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

          {/* AEO / SEO Semantic Q&A Section */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 my-6">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <HelpCircle className="text-primary" size={18} />
              คำถามที่พบบ่อยเกี่ยวกับ {prop.name} (FAQ)
            </h3>
            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <details key={idx} className="group border border-gray-100 rounded-xl p-3.5 bg-gray-50/50 open:bg-white transition-all">
                  <summary className="font-semibold text-xs text-gray-800 cursor-pointer list-none flex justify-between items-center gap-2 select-none">
                    <span>{item.q}</span>
                    <ChevronDown size={14} className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <p className="mt-2.5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-2">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <LoanCalculator priceStr={displayPrice} />
        </div>
      </div>

      {/* Lightbox Modal for Full Image & Floor Plan Viewing */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex flex-col select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsLightboxOpen(false);
            }
          }}
        >
          {/* Lightbox Header Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10 sticky top-0 z-[210] backdrop-blur-md">
            <div className="flex items-center gap-2 text-white max-w-[50vw] sm:max-w-[60vw]">
              <Ruler size={18} className="text-primary shrink-0" />
              <span className="text-xs sm:text-sm font-bold truncate">
                {lightboxTitle || prop?.name || 'ภาพขยาย'}
              </span>
            </div>

            {/* Zoom Controls & Close */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/10 rounded-xl p-1 gap-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setLightboxZoom(z => Math.max(1, +(z - 0.5).toFixed(1)))}
                  disabled={lightboxZoom <= 1}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="ซูมออก (-)"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxZoom(1)}
                  className="px-2 text-[11px] font-mono font-bold text-white/90 hover:text-white cursor-pointer"
                  title="รีเซ็ตขนาด 100%"
                >
                  {Math.round(lightboxZoom * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxZoom(z => Math.min(3, +(z + 0.5).toFixed(1)))}
                  disabled={lightboxZoom >= 3}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="ซูมเข้า (+)"
                >
                  <ZoomIn size={16} />
                </button>
                {lightboxZoom !== 1 && (
                  <button
                    type="button"
                    onClick={() => setLightboxZoom(1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 text-xs transition-all cursor-pointer"
                    title="รีเซ็ตการซูม"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
              </div>

              {/* View original link */}
              {(lightboxImage || selectedImage) && (
                <a
                  href={lightboxImage || selectedImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
                  title="เปิดดูภาพต้นฉบับในแท็บใหม่"
                >
                  <ExternalLink size={14} />
                  <span className="hidden md:inline">ภาพต้นฉบับ</span>
                </a>
              )}

              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setIsLightboxOpen(false)} 
                className="w-8 h-8 sm:w-9 sm:h-9 text-white bg-white/10 hover:bg-red-600 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                title="ปิด (Esc)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Lightbox Body (Scrollable container for zoomed pan) */}
          <div 
            className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsLightboxOpen(false);
              }
            }}
          >
            <div 
              className="relative transition-all max-w-full flex items-center justify-center"
              style={{
                transform: `scale(${lightboxZoom})`,
                transformOrigin: 'center center',
                transition: lightboxZoom === 1 ? 'transform 0.2s ease-out' : 'transform 0.1s ease-out',
                cursor: lightboxZoom > 1 ? 'zoom-out' : 'zoom-in'
              }}
              onClick={() => {
                setLightboxZoom(z => (z === 1 ? 2 : 1));
              }}
              title={lightboxZoom === 1 ? 'คลิกเพื่อซูมขยาย 200%' : 'คลิกเพื่อย่อกลับ 100%'}
            >
              <img 
                src={lightboxImage || selectedImage} 
                alt="Full size plan or property" 
                referrerPolicy="no-referrer"
                className="max-w-[92vw] max-h-[82vh] object-contain rounded-xl shadow-2xl bg-white/5 border border-white/10 pointer-events-auto"
              />
            </div>
          </div>

          {/* Lightbox Footer Hints */}
          <div className="py-2.5 px-4 bg-black/60 border-t border-white/10 text-center text-[11px] text-white/60">
            <span>💡 คลิกที่รูปเพื่อสลับซูมเข้า/ออก (100% / 200%) • ใช้ปุ่ม +/- บนแถบควบคุม • กด Esc เพื่อปิด</span>
          </div>
        </div>
      )}
    </div>
  );
}
