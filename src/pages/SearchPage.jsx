import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search, SlidersHorizontal, Heart, Map as MapIcon, Star, X, ChevronDown, Plus, Check } from 'lucide-react';
import { provincesAndDistricts, transitData } from '../data/locations';
import { Link } from 'react-router-dom';
import { useProperties } from '../PropertiesContext';
import { useCompare } from '../CompareContext';
import './SearchPage.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import L from 'leaflet';
import 'leaflet-draw';

// Fix leaflet icon issue in react
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ray-casting algorithm to check if point is inside a polygon
function isPointInPolygon(point, vs) {
  let x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i][0], yi = vs[i][1];
      let xj = vs[j][0], yj = vs[j][1];
      let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  return inside;
}

function MapDrawControl({ onPolygonDrawn }) {
  const map = useMap();

  React.useEffect(() => {
    if (map.__drawControlAdded) return;
    map.__drawControlAdded = true;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          shapeOptions: { color: '#d38764' }
        },
        circle: {
          shapeOptions: { color: '#d38764' }
        },
        polyline: false,
        rectangle: false,
        circlemarker: false,
        marker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true
      }
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e) => {
      drawnItems.clearLayers(); 
      const layer = e.layer;
      drawnItems.addLayer(layer);
      
      if (onPolygonDrawn) onPolygonDrawn(layer, e.layerType);
    });

    map.on(L.Draw.Event.DELETED, () => {
      if (onPolygonDrawn) onPolygonDrawn(null, null);
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
      map.__drawControlAdded = false;
    };
  }, [map]);

  return null;
}


function MapUpdater({ properties }) {
  const map = useMap();
  React.useEffect(() => {
    if (properties && properties.length > 0) {
      const validPoints = properties
        .filter(p => p.location && p.location.lat && p.location.lng)
        .map(p => [p.location.lat, p.location.lng]);
        
      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        setTimeout(() => {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }, 50);
      }
    }
  }, [properties, map]);
  return null;
}

export default function SearchPage() {
  const { properties } = useProperties();
  const { addToCompare, removeFromCompare, compareList } = useCompare();
  const [activeTab, setActiveTab] = useState('buy');
  const [polygonFilter, setPolygonFilter] = useState(null);
  
  // Location Filter State
  const [selectedProvince, setSelectedProvince] = useState('กรุงเทพมหานคร');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Transit Filter State
  const [transitSystem, setTransitSystem] = useState('');
  const [transitLine, setTransitLine] = useState('');
  const [transitStation, setTransitStation] = useState('');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Property Type State
  const [activePropertyType, setActivePropertyType] = useState('condo');

  // Advanced Filter State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const initialFiltersState = {
    budget: [],
    size: [],
    landSize: [],
    roomType: [],
    livingFormat: [],
    projectType: [],
    special: [],
    facilities: [],
    healthFacilities: [],
    services: [],
    security: [],
    priceRangeStr: 'ไม่จำกัด',
    priceRange: [1, 50]
  };
  const [filters, setFilters] = useState(initialFiltersState);

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const list = prev[category];
      if (list.includes(value)) {
        return { ...prev, [category]: list.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...list, value] };
      }
    });
  };

  const setFilterSingle = (category, value) => {
    setFilters(prev => ({ ...prev, [category]: value }));
  };

  const handlePolygonDrawn = (layer, layerType) => {
    if (!layer) {
      setPolygonFilter(null);
      return;
    }
    let areaSqKm = 0;
    if (layerType === 'circle') {
      const radius = layer.getRadius();
      areaSqKm = (Math.PI * radius * radius) / 1000000;
    } else {
      const latlngs = layer.getLatLngs()[0];
      areaSqKm = L.GeometryUtil.geodesicArea(latlngs) / 1000000;
    }
    setPolygonFilter({ layer, layerType, areaSqKm });
  };

  const filteredProperties = properties.filter(prop => {
    if (polygonFilter) {
      const { layer, layerType } = polygonFilter;
      if (layerType === 'circle') {
        const center = layer.getLatLng();
        const distance = center.distanceTo(L.latLng(prop.location.lat, prop.location.lng));
        if (distance > layer.getRadius()) return false;
      } else {
        const latlngs = layer.getLatLngs()[0];
        const polygonVertices = latlngs.map(ll => [ll.lat, ll.lng]);
        const point = [prop.location.lat, prop.location.lng];
        if (!isPointInPolygon(point, polygonVertices)) return false;
      }
    }
    
    // Search Query
    if (searchQuery && !prop.name.toLowerCase().includes(searchQuery.toLowerCase()) && !prop.station.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Transit
    if (transitStation) {
      if (prop.station !== transitStation) return false;
    } else if (transitLine) {
      if (!transitData[transitSystem][transitLine].includes(prop.station)) return false;
    } else if (transitSystem) {
      const allStationsInSystem = Object.values(transitData[transitSystem]).flat();
      if (!allStationsInSystem.includes(prop.station)) return false;
    }

    // Property Type Filter
    if (activePropertyType === 'condo' && !['High Rise', 'Low Rise', 'Mixed Use'].includes(prop.projectType)) return false;
    if (activePropertyType === 'house' && !['บ้านเดี่ยว', 'บ้านแฝด', 'ทาวน์โฮม'].includes(prop.projectType)) return false;
    if (activePropertyType === 'senior' && !['Wellness Residence', 'Senior Living Community', 'Active Aging Residence', 'Independent Living', 'Assisted Living', 'Nursing Care'].includes(prop.projectType)) return false;

    // Advanced Project Type
    if (filters.projectType && filters.projectType.length > 0 && !filters.projectType.includes(prop.projectType)) return false;

    // Advanced Filters (Array matching)
    if (filters.size && filters.size.length > 0 && !filters.size.includes(prop.size)) return false;
    if (filters.roomType && filters.roomType.length > 0 && !filters.roomType.includes(prop.roomType)) return false;
    if (filters.special && filters.special.length > 0 && !filters.special.some(s => prop.special?.includes(s))) return false;
    if (filters.facilities && filters.facilities.length > 0 && !filters.facilities.some(f => prop.facilities?.includes(f))) return false;
    if (filters.healthFacilities && filters.healthFacilities.length > 0 && !filters.healthFacilities.some(f => prop.healthFacilities?.includes(f))) return false;
    if (filters.services && filters.services.length > 0 && !filters.services.some(s => prop.services?.includes(s))) return false;
    if (filters.security && filters.security.length > 0 && !filters.security.some(s => prop.security?.includes(s))) return false;
    if (filters.landSize && filters.landSize.length > 0 && !filters.landSize.includes(prop.landSize)) return false;
    if (filters.livingFormat && filters.livingFormat.length > 0 && !filters.livingFormat.includes(prop.livingFormat)) return false;

    // Price logic
    if (prop.price < filters.priceRange[0] || prop.price > filters.priceRange[1]) return false;

    return true;
  });

  const handleSearchClick = () => {
    alert(`กำลังค้นหา ${filteredProperties.length} โครงการ ตามเงื่อนไขของคุณ...`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveTab('buy');
    setActivePropertyType('condo');
    setSelectedProvince('กรุงเทพมหานคร');
    setSelectedDistrict('');
    setTransitSystem('');
    setTransitLine('');
    setTransitStation('');
    setPolygonFilter(null);
    setFilters(initialFiltersState);
  };

  return (
    <div className="search-page relative">
      {/* Advanced Filters Drawer/Modal */}
      {showAdvanced && (
        <div className="advanced-modal-overlay">
          <div className="advanced-modal">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-semibold">ตัวกรองเพิ่มเติม</h3>
              <div className="flex items-center gap-4">
                <button 
                  className="btn-ghost text-primary text-sm font-semibold flex items-center" 
                  onClick={() => setFilters(initialFiltersState)}
                >
                  รีเซ็ตทั้งหมด <ChevronDown size={14} className="ml-1" />
                </button>
                <button className="icon-btn" onClick={() => setShowAdvanced(false)}><X size={20} /></button>
              </div>
            </div>
            
            <div className="modal-content" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              

              {activePropertyType === 'condo' && (
                <>
                  
                  <div className="filter-section-block">
                    <h4>พื้นที่ใช้สอย</h4>
                    <div className="pill-grid">
                      {['25 ตร.ม.', '25–30 ตร.ม.', '31–40 ตร.ม.', '41–60 ตร.ม.', '61–80 ตร.ม.'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.size.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('size', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>ประเภทห้อง</h4>
                    <div className="pill-grid">
                      {['1 Bed', '1 Bed Plus', '2 Bed', 'Loft'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.roomType.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('roomType', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>ประเภทโครงการ</h4>
                    <div className="pill-grid">
                      {['Low Rise', 'High Rise', 'Mixed Use'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.projectType.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('projectType', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>จุดเด่นพิเศษ</h4>
                    <div className="pill-grid">
                      {['Pet Friendly'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.special.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('special', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>สิ่งอำนวยความสะดวก</h4>
                    <div className="pill-grid">
                      {['สระว่ายน้ำ', 'Fitness', 'Co-working Space', 'Cafe', 'Garden', 'Kids Room', 'Game Room', 'Yoga Room', 'Sky Lounge', 'EV Charger', 'Smart Locker', 'Shuttle Bus', 'Co kitchen', 'Sauna / Steam', 'Meeting Room', 'Auto Parking'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.facilities.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('facilities', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block mb-8">
                    <h4>การรักษาความปลอดภัย</h4>
                    <div className="pill-grid">
                      {['Key Card Access', 'ระบบอ่านป้ายทะเบียนรถ (LPR)', 'Digital Door Lock', 'Emergency Button', 'Visitor Management'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.security.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('security', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activePropertyType === 'house' && (
                <>
                  
                  <div className="filter-section-block">
                    <h4>ขนาดที่ดิน</h4>
                    <div className="pill-grid">
                      {['ไม่ต่ำกว่า 16 ตารางวา', 'ไม่ต่ำกว่า 35 ตารางวา', 'ไม่ต่ำกว่า 50 ตารางวา', '60-80 ตารางวา', '80-100 ตารางวา', '100-200 ตารางวา', 'มากกว่า 200 ตารางวา'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.landSize.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('landSize', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>พื้นที่ใช้สอย</h4>
                    <div className="pill-grid">
                      {['100 ตร.ม.', '100–150 ตร.ม.', '151–200 ตร.ม.', '201–250 ตร.ม.', '251–300 ตร.ม.', '301–400 ตร.ม.', '401–500 ตร.ม.', 'มากกว่า 500 ตร.ม.'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.size.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('size', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>ประเภทโครงการ</h4>
                    <div className="pill-grid">
                      {['บ้านเดี่ยว', 'บ้านแฝด', 'ทาวน์โฮม'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.projectType.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('projectType', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>สิ่งอำนวยความสะดวก</h4>
                    <div className="pill-grid">
                      {['Clubhouse', 'สระว่ายน้ำ', 'Fitness', 'สวน', 'สนามเด็กเล่น', 'สนามกีฬา', 'EV Charger', 'กล้องวงจรปิด'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.facilities.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('facilities', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block mb-8">
                    <h4>การรักษาความปลอดภัย</h4>
                    <div className="pill-grid">
                      {['CCTV', 'Security 24 ชั่วโมง', 'Double Gate', 'ระบบอ่านป้ายทะเบียนรถ (LPR)'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.security.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('security', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activePropertyType === 'senior' && (
                <>
                  
                  <div className="filter-section-block">
                    <h4>พื้นที่ใช้สอย</h4>
                    <div className="pill-grid">
                      {['ต่ำกว่า 35 ตร.ม.', '35–50 ตร.ม.', '51–70 ตร.ม.', '71–100 ตร.ม.'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.size.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('size', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>รูปแบบการอยู่อาศัย</h4>
                    <div className="pill-grid">
                      {['Wellness Residence', 'Senior Living Community', 'Active Aging Residence', 'Independent Living', 'Assisted Living', 'Nursing Care'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.livingFormat.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('livingFormat', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>สิ่งอำนวยความสะดวกพื้นฐาน</h4>
                    <div className="pill-grid">
                      {['Laundry service*', 'Housekeeping service*', 'Shuttle service*', 'Waste management service*', 'Delivery assistance', 'Parcel and package service', 'Electric vehicle (EV) charging stations', 'Large elevators (sized to accommodate hospital beds)'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.services.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('services', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>สิ่งอำนวยความสะดวกด้านสุขภาพและสันทนาการ</h4>
                    <div className="pill-grid">
                      {['First-aid room', 'Treatment room', 'Exercise room for seniors', 'Healing stone court', 'Meditation room', 'สระว่ายน้ำ', 'สระ Hydrotherapy', 'Fitness', 'Walking Track', 'Bike Lane', 'Yoga Studio', 'ห้องสมุด', 'ห้องกิจกรรม', 'โปรแกรมพาเที่ยว'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.healthFacilities.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('healthFacilities', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>บริการและระบบฉุกเฉิน</h4>
                    <div className="pill-grid">
                      {['บริการฉุกเฉินตลอด 24 ชั่วโมง', 'มีแพทย์ประจำ', 'กายภาพบำบัด', 'ศูนย์ฟื้นฟู', 'คลินิกในโครงการ', 'รถพยาบาลฉุกเฉิน', 'ตรวจสุขภาพประจำปี', 'มีโรงพยาบาลในเครือ'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.special.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('special', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block mb-8">
                    <h4>การรักษาความปลอดภัย</h4>
                    <div className="pill-grid">
                      {['Emergency Call Button', 'Emergency alert system', 'CCTV', 'Security 24 ชั่วโมง'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.security.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('security', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer flex gap-4 mt-4 pt-4 border-t">
              <button className="btn btn-secondary flex-1" style={{ backgroundColor: 'var(--neutral-1)', border: 'none' }} onClick={() => setShowAdvanced(false)}>ยกเลิก</button>
              <button className="btn btn-primary flex-2" onClick={() => setShowAdvanced(false)}>ดูโครงการ {filteredProperties.length} โครงการ</button>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar - Filters */}
      <aside className="filter-sidebar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="ค้นหาโครงการ, ทำเล, BTS, MRT" className="search-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        <div className="filter-section">
          <h3>ค้นหาบ้านและคอนโด</h3>
          <div className="toggle-group">
            <button className={`toggle-btn ${activeTab === 'buy' ? 'active' : ''}`} onClick={() => setActiveTab('buy')}>ซื้อ</button>
            <button className={`toggle-btn ${activeTab === 'rent' ? 'active' : ''}`} onClick={() => setActiveTab('rent')}>เช่า</button>
          </div>
          
          <div className="filter-group">
            <label>ประเภทอสังหาฯ</label>
            <div className="toggle-group flex" style={{ display: 'flex' }}>
              <button className={`toggle-btn flex-1 ${activePropertyType === 'condo' ? 'active' : ''}`} onClick={() => { setActivePropertyType('condo'); setFilters(initialFiltersState); }}>คอนโด</button>
              <button className={`toggle-btn flex-1 ${activePropertyType === 'house' ? 'active' : ''}`} onClick={() => { setActivePropertyType('house'); setFilters(initialFiltersState); }}>บ้าน</button>
              <button className={`toggle-btn flex-1 ${activePropertyType === 'senior' ? 'active' : ''}`} onClick={() => { setActivePropertyType('senior'); setFilters(initialFiltersState); }}>ผู้สูงอายุ</button>
            </div>
          </div>

          <div className="filter-group">
            <label>ทำเล (จังหวัด / เขต)</label>
            <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
              <select className="select-input flex-1" value={selectedProvince} onChange={(e) => { setSelectedProvince(e.target.value); setSelectedDistrict(''); }}>
                {Object.keys(provincesAndDistricts).map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
              <select className="select-input flex-1" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                <option value="">ทุกเขต/อำเภอ</option>
                {provincesAndDistricts[selectedProvince]?.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-group">
            <label>สถานีรถไฟฟ้า (ระบบ / สาย / สถานี)</label>
            <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
                <select className="select-input flex-1" value={transitSystem} onChange={(e) => { setTransitSystem(e.target.value); setTransitLine(''); setTransitStation(''); }}>
                  <option value="">เลือกระบบ</option>
                  <option value="BTS">BTS</option>
                  <option value="MRT">MRT</option>
                  <option value="ARL">ARL (Airport Link)</option>
                  <option value="SRT">SRT (สายสีแดง)</option>
                </select>
                <select className="select-input flex-1" value={transitLine} onChange={(e) => { setTransitLine(e.target.value); setTransitStation(''); }} disabled={!transitSystem}>
                  <option value="">เลือกสาย</option>
                  {transitSystem && Object.keys(transitData[transitSystem]).map(line => (
                    <option key={line} value={line}>{line}</option>
                  ))}
                </select>
              </div>
              <select className="select-input w-full" value={transitStation} onChange={(e) => setTransitStation(e.target.value)} disabled={!transitLine}>
                <option value="">เลือกสถานี</option>
                {transitLine && transitData[transitSystem][transitLine].map(station => (
                  <option key={station} value={station}>{station}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-group mb-6">
            <label>งบประมาณ ({filters.priceRange[0]} - {filters.priceRange[1]} ล้านบาท)</label>
            <div className="price-slider-container" style={{ padding: '0 8px', marginTop: '16px' }}>
              <Slider
                range
                min={1}
                max={50}
                step={0.1}
                value={filters.priceRange}
                onChange={(val) => setFilters(prev => ({...prev, priceRange: val}))}
                trackStyle={[{ backgroundColor: 'var(--primary)' }]}
                handleStyle={[
                  { borderColor: 'var(--primary)', backgroundColor: 'var(--primary)' },
                  { borderColor: 'var(--primary)', backgroundColor: 'var(--primary)' }
                ]}
              />
              <div className="flex justify-between text-xs text-light mt-2" style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                <span>1M</span>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{filters.priceRange[0].toFixed(1)}M - {filters.priceRange[1].toFixed(1)}M</span>
                <span>50M+</span>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-secondary w-full justify-center mt-4" 
            style={{ backgroundColor: showAdvanced ? 'var(--secondary)' : 'var(--white)' }}
            onClick={() => setShowAdvanced(true)}
          >
            <SlidersHorizontal size={16} /> 
            ตัวกรองเพิ่มเติม
          </button>

          <button className="btn btn-primary w-full justify-center mt-4" onClick={handleSearchClick}>
            ค้นหาโครงการ
          </button>

          <button 
            className="w-full text-center mt-4 text-light text-sm hover:text-primary transition-colors"
            onClick={handleResetFilters}
            style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            ล้างตัวกรองทั้งหมด
          </button>
          
          {polygonFilter && (
            <div className="mt-4 p-3 bg-secondary rounded text-sm text-primary text-center font-bold flex flex-col gap-1">
              <span>📍 ค้นหาเฉพาะในพื้นที่นี้</span>
              <span className="text-xs font-normal">ขนาดพื้นที่: {polygonFilter.areaSqKm.toFixed(2)} ตร.กม.</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Map Area */}
      <main className="map-area">
        <MapContainer center={[13.6700, 100.6200]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapDrawControl onPolygonDrawn={handlePolygonDrawn} />
          <MapUpdater properties={filteredProperties} />
          {filteredProperties.map(prop => (
            <Marker key={prop.id} position={[prop.location.lat, prop.location.lng]}>
              <Popup className="property-popup">
                <div className="popup-card">
                  <div className="popup-img" style={{ backgroundImage: `url(${prop.image})` }}>
                    <button className="like-btn"><Heart size={16} color="white" /></button>
                  </div>
                  <div className="popup-content">
                    <h4>{prop.name}</h4>
                    <p className="developer">{prop.developer}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="location-info">
                        <MapIcon size={12} /> {prop.station}
                      </div>
                      <div className="rating-info">
                        <Star size={12} fill="gold" color="gold" /> {prop.rating}
                      </div>
                    </div>
                    <div className="price-specs flex justify-between mt-2">
                      <div>
                        <span className="label">ราคาเริ่มต้น</span>
                        <div className="price">{prop.price} ล้านบาท</div>
                      </div>
                    </div>
                    <Link to={`/property/${prop.id}`} className="btn btn-primary w-full mt-3">
                      ดูรายละเอียดโครงการ
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>

      {/* Right Sidebar - List */}
      <aside className="list-sidebar">
        <div className="list-header">
          <h3>โครงการในพื้นที่นี้</h3>
          <p>{filteredProperties.length} โครงการ {polygonFilter && `| ขอบเขต ${polygonFilter.areaSqKm?.toFixed(2) || 0} ตร.กม.`}</p>
        </div>
        <div className="property-list">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(prop => {
              const isCompared = compareList.some(item => item.id === prop.id);
              return (
                <Link to={`/property/${prop.id}`} key={prop.id} className="prop-card-small" style={{ position: 'relative' }}>
                  <img src={prop.image} alt={prop.name} />
                  <div className="prop-card-info" style={{ paddingRight: '30px' }}>
                    <h4>{prop.name}</h4>
                    <p className="developer">{prop.developer}</p>
                    <p className="price">เริ่มต้น {prop.price} ลบ.</p>
                  </div>
                  <button 
                    className="compare-mini-btn"
                    style={{
                      position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                      width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: 'var(--white)', border: isCompared ? '1px solid var(--primary)' : '1px solid var(--neutral-2)',
                      color: isCompared ? 'var(--primary)' : 'var(--text-light)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      isCompared ? removeFromCompare(prop.id) : addToCompare(prop);
                    }}
                    title={isCompared ? "ลบออกจากการเปรียบเทียบ" : "เพิ่มเข้าเปรียบเทียบ"}
                  >
                    {isCompared ? <Check size={14} /> : <Plus size={14} />}
                  </button>
                </Link>
              );
            })
          ) : (
            <div className="text-center p-4 text-light text-sm">
              ไม่พบโครงการที่ตรงกับเงื่อนไข
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
