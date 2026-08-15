import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useProperties } from '../PropertiesContext';
import { provincesAndDistricts, transitData } from '../data/locations';
import { Save, Image as ImageIcon, MapPin, X, Eye, ArrowLeft } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import PropertyDetail from './PropertyDetail';
import './AddPropertyPage.css';

// Haversine formula for distance calculation
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { addProperty, updateProperty, properties } = useProperties();

  const [formData, setFormData] = useState({
    name: '',
    developer: '',
    type: 'คอนโด',
    projectType: 'High Rise',
    price: '',
    priceMode: 'specify',
    priceTo: '',
    priceSqm: '',
    bedrooms: '1',
    size: '30',
    landSize: '',
    floors: '',
    totalUnits: '',
    status: 'กำลังก่อสร้าง',
    image: '',
    logo: '',
    rating: '5.0',
    location: { lat: 13.7563, lng: 100.5018 },
    province: 'กรุงเทพมหานคร',
    district: '',
    transitSystem: '',
    transitLine: '',
    station: '',
    distanceToStation: '',
    roomType: '',
    livingFormat: '',
    promotion: '',
    special: [],
    facilities: [],
    healthFacilities: [],
    services: [],
    security: [],
    promotions: [],
    transport: [],
    building_details: [],
    buildings: '',
    totalLandArea: '',
    projectParking: '',
    facilityType: '',
    fullyFurnished: false,
    listingType: 'ซื้อ',
    unitTypes: [{ name: '', price: '', landSize: '', size: '', bedrooms: '', bathrooms: '', parking: '', roomType: '', planImages: [], roomImages: [], useProjectFacilities: true, facilities: [] }]
  });
  
  const [customInputs, setCustomInputs] = useState({});
  const [locationInput, setLocationInput] = useState(`${formData.location.lat}, ${formData.location.lng}`);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEditMode && properties.length > 0) {
      const propToEdit = properties.find(p => p.id === id);
      if (propToEdit) {
        // Provide safe defaults for arrays and objects that might be null in older properties
        const safeProp = {
          ...propToEdit,
          location: propToEdit.location || { lat: 13.7563, lng: 100.5018 },
          categorizedLandmarks: propToEdit.categorizedLandmarks || { transport: [], shopping: [], hospitals: [], schools: [] },
          special: propToEdit.special || [],
          facilities: propToEdit.facilities || [],
          healthFacilities: propToEdit.healthFacilities || [],
          services: propToEdit.services || [],
          security: propToEdit.security || [],
          promotions: propToEdit.promotions || [],
          transport: propToEdit.transport || [],
          building_details: propToEdit.building_details || [],
          distanceToStation: propToEdit.distanceToStation === '300 ม.' ? '' : (propToEdit.distanceToStation || ''),
          listingType: propToEdit.listingType || 'ซื้อ',
          unitTypes: propToEdit.unitTypes && propToEdit.unitTypes.length > 0 ? propToEdit.unitTypes : [{ name: '', price: '', landSize: '', size: '', bedrooms: '', bathrooms: '', parking: '', roomType: '', planImages: [], roomImages: [], useProjectFacilities: true, facilities: [] }]
        };
        setFormData(safeProp);
        setLocationInput(`${safeProp.location.lat}, ${safeProp.location.lng}`);
      }
    } else if (!isEditMode && location.state && location.state.duplicateFrom) {
      const propToCopy = location.state.duplicateFrom;
      const safeProp = {
        ...propToCopy,
        name: propToCopy.name + " (Copy)",
        id: undefined,
        location: propToCopy.location || { lat: 13.7563, lng: 100.5018 },
        categorizedLandmarks: propToCopy.categorizedLandmarks || { transport: [], shopping: [], hospitals: [], schools: [] },
        special: propToCopy.special || [],
        facilities: propToCopy.facilities || [],
        healthFacilities: propToCopy.healthFacilities || [],
        services: propToCopy.services || [],
        security: propToCopy.security || [],
        promotions: propToCopy.promotions || [],
        transport: propToCopy.transport || [],
        building_details: propToCopy.building_details || [],
        distanceToStation: propToCopy.distanceToStation === '300 ม.' ? '' : (propToCopy.distanceToStation || ''),
        listingType: propToCopy.listingType || 'ซื้อ',
        unitTypes: propToCopy.unitTypes && propToCopy.unitTypes.length > 0 ? propToCopy.unitTypes : [{ name: '', price: '', landSize: '', size: '', bedrooms: '', bathrooms: '', parking: '', roomType: '', planImages: [], roomImages: [], useProjectFacilities: true, facilities: [] }]
      };
      setFormData(safeProp);
      setLocationInput(`${safeProp.location.lat}, ${safeProp.location.lng}`);
    }
  }, [id, isEditMode, properties, location.state]);
  
  const handleLocationStringChange = (e) => {
    const val = e.target.value;
    setLocationInput(val);
    
    // 1. Check for standard decimal format (e.g., 13.565441, 99.812454 or 13.565441 99.812454)
    const decimalMatch = val.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
    if (decimalMatch) {
      setFormData(p => ({...p, location: { lat: parseFloat(decimalMatch[1]), lng: parseFloat(decimalMatch[2]) }}));
      return;
    }

    // 2. Check for DMS format (e.g., 13°33'55.6"N 99°48'44.8"E)
    const dmsRegex = /(\d+)°(\d+)'([\d.]+)"([NS])\s*(\d+)°(\d+)'([\d.]+)"([EW])/i;
    const dmsMatch = val.match(dmsRegex);
    if (dmsMatch) {
      let lat = parseInt(dmsMatch[1], 10) + (parseInt(dmsMatch[2], 10) / 60) + (parseFloat(dmsMatch[3]) / 3600);
      if (dmsMatch[4].toUpperCase() === 'S') lat = -lat;
      let lng = parseInt(dmsMatch[5], 10) + (parseInt(dmsMatch[6], 10) / 60) + (parseFloat(dmsMatch[7]) / 3600);
      if (dmsMatch[8].toUpperCase() === 'W') lng = -lng;
      setFormData(p => ({...p, location: { lat, lng }}));
      return;
    }
    
    // 3. Fallback for simple comma separated without decimals (e.g. 13, 100)
    if (val.includes(',')) {
      const parts = val.split(',');
      if (parts.length >= 2) {
        const lat = parseFloat(parts[0].replace(/[^\d.-]/g, ''));
        const lng = parseFloat(parts[1].replace(/[^\d.-]/g, ''));
        if (!isNaN(lat) && !isNaN(lng)) {
          setFormData(p => ({...p, location: { lat, lng }}));
        }
      }
    }
  };
  
  const handleAddCustom = (field) => {
    if (customInputs[field]?.trim()) {
      const newItem = customInputs[field].trim();
      if (!formData[field].includes(newItem)) {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], newItem] }));
      }
      setCustomInputs(prev => ({ ...prev, [field]: '' }));
    }
  };
  const condoSizes = ['25 ตร.ม.', '25–30 ตร.ม.', '31–40 ตร.ม.', '41–60 ตร.ม.', '61–80 ตร.ม.'];
  const condoRoomTypes = ['1 Bed', '1 Bed Plus', '2 Bed', 'Loft'];
  const condoProjectTypes = ['Low Rise', 'High Rise', 'Mixed Use'];
  const condoSpecials = ['Pet Friendly'];
  const condoFacilities = ['Clubhouse', 'สระว่ายน้ำ', 'Fitness', 'Co-working Space', 'Cafe', 'Garden', 'Kids Room', 'Game Room', 'Yoga Room', 'Sky Lounge', 'EV Charger', 'Smart Locker', 'Shuttle Bus', 'Co kitchen', 'Sauna / Steam', 'Meeting Room', 'Auto Parking', 'Playground (สนามเด็กเล่น)', 'Lobby', 'Mailbox', 'Laundry Room', 'Living Area', 'Vending Machine', 'Jacuzzi', 'Jogging Track', 'Co-living Space'];
  const condoSecurities = ['CCTV', 'Security 24 Hour.', 'Key Card Access', 'ระบบอ่านป้ายทะเบียนรถ (LPR)', 'Digital Door Lock', 'Emergency Button', 'Visitor Management'];

  const houseLandSizes = ['ไม่ต่ำกว่า 16 ตารางวา', 'ไม่ต่ำกว่า 35 ตารางวา', 'ไม่ต่ำกว่า 50 ตารางวา', '60-80 ตารางวา', '80-100 ตารางวา', '100-200 ตารางวา', 'มากกว่า 200 ตารางวา'];
  const houseSizes = ['100 ตร.ม.', '100–150 ตร.ม.', '151–200 ตร.ม.', '201–250 ตร.ม.', '251–300 ตร.ม.', '301–400 ตร.ม.', '401–500 ตร.ม.', 'มากกว่า 500 ตร.ม.'];
  const houseProjectTypes = ['บ้านเดี่ยว', 'บ้านแฝด', 'ทาวน์โฮม'];
  const houseFacilities = ['Clubhouse', 'สระว่ายน้ำ', 'Fitness', 'สวน', 'Playground (สนามเด็กเล่น)', 'สนามกีฬา', 'EV Charger'];
  const houseSecurities = ['CCTV', 'Security 24 Hour.', 'Double Gate', 'ระบบอ่านป้ายทะเบียนรถ (LPR)'];

  const seniorSizes = ['ต่ำกว่า 35 ตร.ม.', '35–50 ตร.ม.', '51–70 ตร.ม.', '71–100 ตร.ม.'];
  const seniorLivingFormats = ['Wellness Residence', 'Senior Living Community', 'Active Aging Residence', 'Independent Living', 'Assisted Living', 'Nursing Care'];
  const seniorServices = ['Laundry service (บริการซักรีด)', 'Housekeeping service (บริการทำความสะอาดห้อง)', 'Waste management service (บริหารจัดการขยะ)', 'Delivery assistance', 'Parcel and package service', 'Electric vehicle (EV) charging stations', 'Large elevators'];
  const seniorFacilities = ['Clubhouse', 'First-aid room', 'Treatment room', 'Exercise room for seniors', 'Healing stone court', 'Meditation room', 'สระว่ายน้ำ', 'สระ Hydrotherapy', 'Fitness', 'Walking Track', 'Bike Lane', 'ห้องสมุด', 'ห้องกิจกรรม', 'โปรแกรมพาเที่ยว'];
  const seniorHealthFacilities = ['บริการฉุกเฉินตลอด 24 ชั่วโมง', 'มีแพทย์ประจำ', 'กายภาพบำบัด', 'ศูนย์ฟื้นฟู', 'คลินิกในโครงการ', 'รถพยาบาลฉุกเฉิน', 'ตรวจสุขภาพประจำปี', 'มีโรงพยาบาลในเครือ'];
  const seniorSecurities = ['CCTV', 'Security 24 Hour.', 'Emergency Button', 'Emergency alert system'];

  const statuses = ['พร้อมอยู่', 'กำลังก่อสร้าง', 'เปิด Presale'];


  
  const renderCheckboxes = (label, field, options) => {
    const allOptions = Array.from(new Set([...options, ...formData[field]]));
    
    return (
      <div className="form-group col-span-2">
        <label>{label}</label>
        <div className="checkbox-grid">
          {allOptions.map(opt => (
            <label key={opt} className="checkbox-label">
              <input 
                type="checkbox" 
                checked={formData[field].includes(opt)}
                onChange={() => toggleArrayItem(field, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
        <div className="mt-3 flex gap-2 max-w-sm">
          <input 
            type="text" 
            placeholder="เพิ่มอื่นๆ (โปรดระบุ)..." 
            value={customInputs[field] || ''}
            onChange={(e) => setCustomInputs(prev => ({ ...prev, [field]: e.target.value }))}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom(field);
              }
            }}
            className="flex-1 text-sm px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          <button 
            type="button"
            onClick={() => handleAddCustom(field)}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors border"
          >
            เพิ่ม
          </button>
        </div>
      </div>
    );
  };
  
  const handleAutoCalculateDistance = async (catKey, idx, placeName) => {
    if (!placeName) {
      alert("กรุณาพิมพ์ชื่อสถานที่ก่อนคำนวณระยะทาง");
      return;
    }
    if (!formData.location || !formData.location.lat) {
      alert("กรุณาปักหมุดทำเลที่ตั้งโครงการด้านบนก่อน เพื่อใช้เป็นจุดอ้างอิง");
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const placeLat = parseFloat(data[0].lat);
        const placeLon = parseFloat(data[0].lon);
        const distKm = getDistanceFromLatLonInKm(formData.location.lat, formData.location.lng, placeLat, placeLon);
        const distStr = distKm < 1 ? `${Math.round(distKm * 1000)} ม.` : `${distKm.toFixed(1)} กม.`;
        
        setFormData(prev => {
          const list = [...(prev.categorizedLandmarks?.[catKey] || [])];
          list[idx] = { ...list[idx], distance: distStr };
          return {
            ...prev,
            categorizedLandmarks: { ...(prev.categorizedLandmarks || {}), [catKey]: list }
          };
        });
      } else {
        alert("ไม่พบข้อมูลสถานที่ในระบบแผนที่ กรุณากรอกระยะทางด้วยตนเอง");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการดึงข้อมูลระยะทาง");
    }
  };

  const renderSelect = (label, field, options) => (
    <div className="form-group">
      <label>{label}</label>
      <select name={field} value={formData[field]} onChange={handleChange}>
        <option value="">เลือก{label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let updates = { [name]: value };
      if (name === 'type') {
        if (value === 'คอนโด') updates.projectType = condoProjectTypes[0];
        else if (value === 'บ้าน' || value === 'ทาวน์โฮม') updates.projectType = houseProjectTypes[0];
        else if (value === 'ผู้สูงอายุ') updates.projectType = seniorLivingFormats[0];
        else updates.projectType = '';
      }
      if (name === 'buildings') {
        const numBuildings = parseInt(value, 10);
        if (!isNaN(numBuildings) && numBuildings > 0) {
          const currentDetails = prev.building_details || [];
          if (currentDetails.length < numBuildings) {
            updates.building_details = [
              ...currentDetails,
              ...Array.from({ length: numBuildings - currentDetails.length }).map(() => ({ name: '', facilities: [] }))
            ];
          } else if (currentDetails.length > numBuildings) {
            updates.building_details = currentDetails.slice(0, numBuildings);
          }
        } else {
          updates.building_details = [];
        }
      }
      return { ...prev, ...updates };
    });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => {
      if (prev[field].includes(item)) {
        return { ...prev, [field]: prev[field].filter(i => i !== item) };
      }
      return { ...prev, [field]: [...prev[field], item] };
    });
  };

  const handleAddUnitType = () => {
    setFormData(prev => ({
      ...prev,
      unitTypes: [...prev.unitTypes, { name: '', price: '', landSize: '', size: '', bedrooms: '', bathrooms: '', parking: '', roomType: '', planImages: [], roomImages: [], useProjectFacilities: true, facilities: [] }]
    }));
  };

  const handleRemoveUnitType = (index) => {
    setFormData(prev => ({
      ...prev,
      unitTypes: prev.unitTypes.filter((_, i) => i !== index)
    }));
  };

  const handleUnitTypeChange = (index, field, value) => {
    setFormData(prev => {
      const newUnitTypes = [...prev.unitTypes];
      newUnitTypes[index] = { ...newUnitTypes[index], [field]: value };
      return { ...prev, unitTypes: newUnitTypes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation for Required Fields
    if (!formData.name || !formData.name.trim()) {
      alert('กรุณากรอก "ชื่อโครงการ" ให้ครบถ้วนก่อนบันทึก');
      return;
    }

    // Helper to safely parse numbers with commas (e.g. "1,500,000" -> 1500000)
    const parseNumberClean = (val) => {
      if (val === null || val === undefined || val === '') return null;
      const cleanStr = String(val).replace(/,/g, '');
      const num = parseFloat(cleanStr);
      return isNaN(num) ? null : num;
    };

    // Auto-calculate min price and starting values from unitTypes
    let calculatedPrice = 0;
    let calculatedSize = '';
    let calculatedBedrooms = '';
    let calculatedRoomType = '';
    
    if (formData.unitTypes && formData.unitTypes.length > 0) {
      // Filter out empty prices
      const validUnits = formData.unitTypes.filter(u => u.price && parseNumberClean(u.price) !== null);
      if (validUnits.length > 0) {
        // Find the unit with the minimum price
        const minPriceUnit = validUnits.reduce((min, p) => parseNumberClean(p.price) < parseNumberClean(min.price) ? p : min, validUnits[0]);
        calculatedPrice = parseNumberClean(minPriceUnit.price);
        calculatedSize = minPriceUnit.size || '';
        calculatedBedrooms = minPriceUnit.bedrooms || '';
        calculatedRoomType = minPriceUnit.roomType || '';
      }
    }

    // Prepare the final object shape expected by the app
    const newProperty = {
      ...formData,
      // If there are valid units, use calculatedPrice (min unit price). Otherwise use formData.price.
      price: calculatedPrice ? calculatedPrice : parseNumberClean(formData.price),
      priceTo: parseNumberClean(formData.priceTo),
      priceSqm: parseNumberClean(formData.priceSqm),
      bedrooms: calculatedBedrooms || formData.bedrooms,
      size: calculatedSize || formData.size,
      roomType: calculatedRoomType || formData.roomType,
      floors: parseNumberClean(formData.floors) || 0,
      totalUnits: parseNumberClean(formData.totalUnits) || 0,
      location: {
        lat: parseFloat(formData.location.lat) || 13.75,
        lng: parseFloat(formData.location.lng) || 100.5
      },
      image: formData.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      reviews: 0
    };

    try {
      let resultId = null;
      if (isEditMode) {
        const result = await updateProperty(id, newProperty);
        if (result?.success || result === true) {
          alert('บันทึกการแก้ไขโครงการเรียบร้อยแล้ว!');
          navigate('/admin');
        } else {
          const msg = result?.message || 'ไม่ทราบสาเหตุ';
          alert('เกิดข้อผิดพลาด: ' + msg);
        }
      } else {
        resultId = await addProperty(newProperty);
        if (resultId) {
          alert('เพิ่มโครงการสำเร็จ! คุณสามารถดูโครงการใหม่ได้ในหน้าค้นหา');
          navigate(`/property/${resultId}`);
        } else {
          alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาตรวจสอบสิทธิ์การเขียนฐานข้อมูล (RLS) ใน Supabase');
        }
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาด: ' + err.message);
    }
  };

  return (
    <div className="add-property-page bg-background min-h-screen pb-12">
      <div className="admin-header py-6 bg-white border-b mb-8">
        <div className="container flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{isEditMode ? 'แก้ไขโครงการ' : 'เพิ่มโครงการใหม่'}</h1>
            <p className="text-light">ระบบจัดการข้อมูลโครงการ (Admin)</p>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl">
        <form className="add-form bg-white p-8 rounded-lg shadow-sm" onSubmit={handleSubmit}>
          
          {/* ข้อมูลพื้นฐาน */}
          <section className="form-section">
            <h3 className="section-title">ข้อมูลพื้นฐาน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label>ประเภทประกาศ <span className="text-red-500">*</span></label>
                <select name="listingType" value={formData.listingType} onChange={handleChange}>
                  <option value="ซื้อ">ขาย (ซื้อ)</option>
                  <option value="เช่า">เช่า</option>
                </select>
              </div>
              <div className="form-group">
                <label>ชื่อโครงการ <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="เช่น ไอดิโอ โมบิ สุขุมวิท" />
              </div>
              <div className="form-group">
                <label>ผู้พัฒนาโครงการ <span className="text-red-500">*</span></label>
                <input type="text" name="developer" value={formData.developer} onChange={handleChange} required placeholder="เช่น Ananda Development" />
              </div>
              <div className="form-group">
                <label>กลุ่มอสังหาฯ (ประเภทใหญ่)</label>
                                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="คอนโด">คอนโด (Condo)</option>
                  <option value="บ้าน">บ้าน (House)</option>
                  <option value="ทาวน์โฮม">ทาวน์โฮม (Townhome)</option>
                  <option value="ผู้สูงอายุ">ผู้สูงอายุ (Senior Living)</option>
                  <option value="ที่ดิน">ที่ดินเปล่า (Land)</option>
                </select>
              </div>

              {formData.type !== 'ที่ดิน' && (
                <div className="form-group">
                  <label>รูปแบบโครงการย่อย</label>
                  {(formData.type === 'บ้าน' || formData.type === 'ทาวน์โฮม') ? (
                    <div className="flex flex-wrap gap-4 mt-2">
                      {houseProjectTypes.map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={(formData.projectType || '').includes(opt)}
                            onChange={(e) => {
                              const currentTypes = (formData.projectType || '').split(',').map(s => s.trim()).filter(Boolean);
                              let newTypes;
                              if (e.target.checked) {
                                newTypes = [...currentTypes, opt];
                              } else {
                                newTypes = currentTypes.filter(t => t !== opt);
                              }
                              setFormData(prev => ({ ...prev, projectType: newTypes.join(', ') }));
                            }}
                            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                          />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <select name="projectType" value={formData.projectType} onChange={handleChange}>
                      {formData.type === 'คอนโด' && condoProjectTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      {formData.type === 'ผู้สูงอายุ' && seniorLivingFormats.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}
                </div>
              )}

              <div className="form-group">
                <label>การแสดงราคาเริ่มต้น</label>
                <select 
                  className="form-control mb-2"
                  value={formData.priceMode || ((formData.price === '' || formData.price === null) ? 'contact' : 'specify')} 
                  onChange={(e) => {
                    const mode = e.target.value;
                    if (mode === 'contact') {
                      setFormData(prev => ({ ...prev, priceMode: mode, price: '', priceTo: '' }));
                    } else {
                      setFormData(prev => ({ ...prev, priceMode: mode, price: '' }));
                    }
                  }}
                >
                  <option value="specify">ระบุราคาเป็นตัวเลข</option>
                  <option value="contact">แสดงเป็น "สอบถามราคา"</option>
                </select>

                {((formData.priceMode ? formData.priceMode === 'specify' : (formData.price !== '' && formData.price !== null))) && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#64748b' }}>ราคาเริ่มต้น (ล้านบาท)</label>
                      <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} placeholder="เช่น 3.5" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#64748b' }}>ราคาสูงสุด <span className="text-light">(ไม่บังคับ)</span></label>
                      <input type="number" step="0.01" name="priceTo" value={formData.priceTo} onChange={handleChange} placeholder="เช่น 5.9" />
                    </div>
                  </div>
                )}
                <p className="text-xs text-light mt-2">*หากเพิ่ม 'แบบห้อง' ด้านล่าง ระบบจะใช้ราคาต่ำสุดจากแบบห้องอัตโนมัติ</p>
              </div>

              <div className="form-group md:col-span-2">
                <label>จุดเด่นของโครงการ (Project Highlights)</label>
                <textarea 
                  name="projectHighlights" 
                  value={formData.projectHighlights || ''} 
                  onChange={handleChange} 
                  placeholder="อธิบายจุดเด่นของโครงการ ทำเล สิ่งอำนวยความสะดวก หรือความพิเศษอื่นๆ"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <div className="form-group">
                <label>สถานะการก่อสร้าง</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* รายละเอียดอาคาร */}
          <section className="form-section">
            <h3 className="section-title">รายละเอียดอาคาร</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label>จำนวนชั้นทั้งหมด</label>
                <input type="number" name="floors" value={formData.floors} onChange={handleChange} placeholder="เช่น 32" />
              </div>
              <div className="form-group">
                <label>จำนวนยูนิตทั้งหมด</label>
                <input type="number" name="totalUnits" value={formData.totalUnits} onChange={handleChange} placeholder="เช่น 450" />
              </div>
              <div className="form-group">
                <label>พื้นที่โครงการ (ขนาดที่ดินรวม)</label>
                <input type="text" name="totalLandArea" value={formData.totalLandArea || ''} onChange={handleChange} placeholder="เช่น 5-0-10 ไร่" />
              </div>
              {formData.type === 'คอนโด' && (
                <>
                  <div className="form-group">
                    <label>จำนวนอาคาร</label>
                    <input type="number" name="buildings" value={formData.buildings || ''} onChange={handleChange} placeholder="เช่น 1" />
                  </div>
                  <div className="form-group">
                    <label>ที่จอดรถโครงการ</label>
                    <input type="text" name="projectParking" value={formData.projectParking || ''} onChange={handleChange} placeholder="เช่น 228 คัน (39%) หรือ 1ห้อง/1ที่" />
                  </div>
                  <div className="form-group">
                    <label>รูปแบบส่วนกลาง</label>
                    <select name="facilityType" value={formData.facilityType || ''} onChange={handleChange}>
                      <option value="">เลือกรูปแบบส่วนกลาง</option>
                      <option value="ส่วนกลางแยกตึก">ส่วนกลางแยกตึก</option>
                      <option value="ส่วนกลางเหมือนกันทุกตึก">ส่วนกลางเหมือนกันทุกตึก</option>
                    </select>
                  </div>
                  <div className="form-group col-span-2 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        name="fullyFurnished" 
                        checked={formData.fullyFurnished || false} 
                        onChange={(e) => setFormData(prev => ({ ...prev, fullyFurnished: e.target.checked }))} 
                        className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="font-bold text-gray-700">Fully Furnished (ตกแต่งครบพร้อมอยู่)</span>
                    </label>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ข้อมูลรายอาคาร (ถ้ามี) */}
          {formData.type === 'คอนโด' && formData.building_details && formData.building_details.length > 0 && (
            <section className="form-section">
              <h3 className="section-title">ข้อมูลรายอาคาร ({formData.building_details.length} อาคาร)</h3>
              <div className="space-y-4">
                {formData.building_details.map((bldg, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                    <div className="form-group mb-3">
                      <label className="font-bold text-gray-800">ชื่ออาคาร {idx + 1}</label>
                      <input 
                        type="text" 
                        value={bldg.name || ''} 
                        onChange={(e) => {
                          const newName = e.target.value;
                          setFormData(prev => {
                            const newDetails = [...prev.building_details];
                            newDetails[idx] = { ...newDetails[idx], name: newName };
                            return { ...prev, building_details: newDetails };
                          });
                        }}
                        placeholder={`เช่น Tower ${String.fromCharCode(65 + idx)} หรือ อาคาร ${idx + 1}`} 
                        className="form-control"
                      />
                    </div>
                    {formData.facilityType === 'ส่วนกลางแยกตึก' && (
                      <div className="form-group mb-0">
                        <label className="font-bold text-gray-800 mb-2 block">ส่วนกลางเฉพาะอาคารนี้</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {Array.from(new Set([...condoFacilities, ...(bldg.facilities || [])])).map(fac => (
                            <label key={fac} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors">
                              <input 
                                type="checkbox"
                                checked={bldg.facilities?.includes(fac) || false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setFormData(prev => {
                                    const newDetails = [...prev.building_details];
                                    const currentFacs = newDetails[idx].facilities || [];
                                    newDetails[idx] = {
                                      ...newDetails[idx],
                                      facilities: checked 
                                        ? [...currentFacs, fac] 
                                        : currentFacs.filter(f => f !== fac)
                                    };
                                    return { ...prev, building_details: newDetails };
                                  });
                                }}
                                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                              />
                              {fac}
                            </label>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="เพิ่มส่วนกลางอื่นๆ"
                            value={customInputs[`building_fac_${idx}`] || ''}
                            onChange={(e) => setCustomInputs(prev => ({ ...prev, [`building_fac_${idx}`]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const val = customInputs[`building_fac_${idx}`]?.trim();
                                if (val) {
                                  setFormData(prev => {
                                    const newDetails = [...prev.building_details];
                                    const currentFacs = newDetails[idx].facilities || [];
                                    if (!currentFacs.includes(val)) {
                                      newDetails[idx] = { ...newDetails[idx], facilities: [...currentFacs, val] };
                                    }
                                    return { ...prev, building_details: newDetails };
                                  });
                                  setCustomInputs(prev => ({ ...prev, [`building_fac_${idx}`]: '' }));
                                }
                              }
                            }}
                            className="form-control text-xs py-1.5 px-2 w-48"
                          />
                          <button
                            type="button"
                            onClick={() => {
                                const val = customInputs[`building_fac_${idx}`]?.trim();
                                if (val) {
                                  setFormData(prev => {
                                    const newDetails = [...prev.building_details];
                                    const currentFacs = newDetails[idx].facilities || [];
                                    if (!currentFacs.includes(val)) {
                                      newDetails[idx] = { ...newDetails[idx], facilities: [...currentFacs, val] };
                                    }
                                    return { ...prev, building_details: newDetails };
                                  });
                                  setCustomInputs(prev => ({ ...prev, [`building_fac_${idx}`]: '' }));
                                }
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded border border-gray-300"
                          >
                            เพิ่ม
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* รูปแบบบ้าน / แบบห้อง (Unit Types) */}
          <section className="form-section">
            <div className="flex justify-between items-center mb-4">
              <h3 className="section-title mb-0">รูปแบบบ้าน/แบบห้อง (Unit Types)</h3>
              <button type="button" onClick={handleAddUnitType} className="btn btn-primary text-sm px-4 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 border-none">
                + เพิ่มแบบห้อง
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.unitTypes.map((unit, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-neutral-1 relative group">
                  {formData.unitTypes.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveUnitType(idx)}
                      className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="form-group mb-0 md:col-span-2">
                      <label className="text-xs">ชื่อแบบ (เช่น Type A, 1 Bedroom)</label>
                      <input 
                        type="text" 
                        value={unit.name} 
                        onChange={(e) => handleUnitTypeChange(idx, 'name', e.target.value)} 
                        placeholder="ชื่อแบบห้อง" 
                        required
                        className="text-sm"
                      />
                    </div>
                    <div className="form-group mb-0 md:col-span-2">
                      <label className="text-xs">การแสดงราคา</label>
                      <select 
                        className="form-control text-sm"
                        value={(unit.price === '' || unit.price === null) ? 'contact' : 'specify'}
                        onChange={(e) => {
                          if (e.target.value === 'contact') handleUnitTypeChange(idx, 'price', '');
                          else handleUnitTypeChange(idx, 'price', '0');
                        }}
                      >
                        <option value="specify">ระบุราคาเป็นตัวเลข</option>
                        <option value="contact">แสดงเป็น "สอบถามราคา"</option>
                      </select>
                    </div>
                    {(unit.price !== '' && unit.price !== null) && (
                      <div className="form-group mb-0 md:col-span-2">
                        <label className="text-xs">ราคา (ล้านบาท)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={unit.price} 
                          onChange={(e) => handleUnitTypeChange(idx, 'price', e.target.value)} 
                          placeholder="เช่น 2.59" 
                          className="form-control text-sm"
                        />
                      </div>
                    )}
                    <div className="form-group mb-0">
                      <label className="text-xs">ขนาดที่ดิน (ตร.วา)</label>
                      <input 
                        type="text" 
                        value={unit.landSize || ''} 
                        onChange={(e) => handleUnitTypeChange(idx, 'landSize', e.target.value)} 
                        placeholder="เช่น 50" 
                        className="text-sm"
                      />
                    </div>
                    {(formData.type === 'บ้าน' || formData.type === 'ทาวน์โฮม') && (
                      <>
                        <div className="form-group mb-0">
                          <label className="text-xs">ความกว้าง (ม.)</label>
                          <input 
                            type="text" 
                            value={unit.width || ''} 
                            onChange={(e) => handleUnitTypeChange(idx, 'width', e.target.value)} 
                            placeholder="เช่น 5.5" 
                            className="text-sm"
                          />
                        </div>
                        <div className="form-group mb-0">
                          <label className="text-xs">ความลึก (ม.)</label>
                          <input 
                            type="text" 
                            value={unit.depth || ''} 
                            onChange={(e) => handleUnitTypeChange(idx, 'depth', e.target.value)} 
                            placeholder="เช่น 10" 
                            className="text-sm"
                          />
                        </div>
                      </>
                    )}
                    <div className="form-group mb-0">
                      <label className="text-xs">พื้นที่ใช้สอย (ตร.ม.)</label>
                      <input 
                        type="text" 
                        value={unit.size} 
                        onChange={(e) => handleUnitTypeChange(idx, 'size', e.target.value)} 
                        placeholder="เช่น 150" 
                        className="text-sm"
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label className="text-xs">รูปแบบห้อง</label>
                      <input 
                        type="text" 
                        value={unit.roomType} 
                        onChange={(e) => handleUnitTypeChange(idx, 'roomType', e.target.value)} 
                        placeholder="เช่น 1 Bed, Studio" 
                        className="text-sm"
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label className="text-xs">ห้องนอน</label>
                      <input 
                        type="text" 
                        value={unit.bedrooms} 
                        onChange={(e) => handleUnitTypeChange(idx, 'bedrooms', e.target.value)} 
                        placeholder="เช่น 1" 
                        className="text-sm"
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label className="text-xs">ห้องน้ำ</label>
                      <input 
                        type="text" 
                        value={unit.bathrooms || ''} 
                        onChange={(e) => handleUnitTypeChange(idx, 'bathrooms', e.target.value)} 
                        placeholder="เช่น 1" 
                        className="text-sm"
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label className="text-xs">ที่จอดรถ</label>
                      <input 
                        type="text" 
                        value={unit.parking || ''} 
                        onChange={(e) => handleUnitTypeChange(idx, 'parking', e.target.value)} 
                        placeholder="เช่น 1 หรือ 2" 
                        className="text-sm"
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label className="text-xs">ห้องอเนกประสงค์</label>
                      <input 
                        type="text" 
                        value={unit.multipurpose || ''} 
                        onChange={(e) => handleUnitTypeChange(idx, 'multipurpose', e.target.value)} 
                        placeholder="เช่น 1" 
                        className="text-sm"
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label className="text-xs">จุดเด่นพิเศษ</label>
                      <input 
                        type="text" 
                        value={unit.special || ''} 
                        onChange={(e) => handleUnitTypeChange(idx, 'special', e.target.value)} 
                        placeholder="เช่น ระเบียงกว้าง, วิวสระ" 
                        className="text-sm"
                      />
                    </div>
                    <div className="form-group mb-0 md:col-span-4 mt-2">
                      <ImageUploader 
                        label="แปลนห้อง (Top View)"
                        images={unit.planImages}
                        onChange={(images) => handleUnitTypeChange(idx, 'planImages', images)}
                      />
                    </div>
                    <div className="form-group mb-0 md:col-span-4 mt-2">
                      <ImageUploader 
                        label="รูปภาพห้อง / บรรยากาศ (Gallery)"
                        images={unit.roomImages}
                        onChange={(images) => handleUnitTypeChange(idx, 'roomImages', images)}
                      />
                    </div>

                    {/* สิ่งอำนวยความสะดวกประจำแบบบ้าน/ห้อง */}
                    <div className="form-group mb-0 md:col-span-4 mt-3 bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={unit.useProjectFacilities !== false} 
                            onChange={(e) => handleUnitTypeChange(idx, 'useProjectFacilities', e.target.checked)}
                            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                          />
                          ใช้สิ่งอำนวยความสะดวกเดียวกับโครงการหลัก (Facility เหมือนกัน)
                        </label>
                        {unit.useProjectFacilities === false && (
                          <button
                            type="button"
                            onClick={() => {
                              const allProjFac = [
                                ...(formData.facilities || []),
                                ...(formData.special || []),
                                ...(formData.security || []),
                                ...(formData.healthFacilities || []),
                                ...(formData.services || [])
                              ];
                              handleUnitTypeChange(idx, 'facilities', Array.from(new Set(allProjFac)));
                            }}
                            className="text-xs text-primary hover:underline font-semibold bg-primary/10 px-2 py-1 rounded"
                          >
                            + คัดลอกสิ่งอำนวยความสะดวกจากโครงการหลักมาใส่
                          </button>
                        )}
                      </div>

                      {unit.useProjectFacilities === false && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <label className="text-xs font-semibold text-gray-600 block mb-1">
                            สิ่งอำนวยความสะดวกเฉพาะแบบบ้าน/ห้องนี้ (คั่นด้วยเครื่องหมายจุลภาค , )
                          </label>
                          <input 
                            type="text"
                            value={Array.isArray(unit.facilities) ? unit.facilities.join(', ') : (unit.facilities || '')}
                            onChange={(e) => handleUnitTypeChange(idx, 'facilities', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            placeholder="เช่น สระว่ายน้ำส่วนตัว, EV Charger, อ่างอาบน้ำ, ลิฟต์ส่วนตัว, Smart Home"
                            className="w-full text-sm p-2 border rounded focus:ring-1 focus:ring-primary outline-none"
                          />
                          <p className="text-[11px] text-gray-400 mt-1">
                            * หากแยกสิ่งอำนวยความสะดวกเฉพาะแบบ ระบบจะแสดงข้อมูลชุดนี้เมื่อผู้ชมกดดูแบบบ้านนี้
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-light mt-2">
              * ระบบจะนำแบบห้องที่มี "ราคาต่ำสุด" ไปตั้งเป็นราคาเริ่มต้นและขนาดเริ่มต้นของโครงการนี้โดยอัตโนมัติ
            </p>
          </section>

          {/* ทำเลที่ตั้ง */}
          <section className="form-section">
            <h3 className="section-title">ทำเลที่ตั้ง</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label>จังหวัด</label>
                <select name="province" value={formData.province} onChange={(e) => { handleChange(e); setFormData(p => ({...p, district: ''})) }}>
                  {Object.keys(provincesAndDistricts).map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>เขต / อำเภอ</label>
                <select name="district" value={formData.district} onChange={handleChange}>
                  <option value="">เลือกเขต/อำเภอ</option>
                  {provincesAndDistricts[formData.province]?.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              
              {/* Transit */}
              <div className="form-group">
                <label>ระบบรถไฟฟ้า</label>
                <select name="transitSystem" value={formData.transitSystem} onChange={(e) => { handleChange(e); setFormData(p => ({...p, transitLine: '', station: ''})) }}>
                  <option value="">เลือกระบบ</option>
                  {Object.keys(transitData).map(sys => (
                    <option key={sys} value={sys}>{sys}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>สายรถไฟฟ้า</label>
                <select name="transitLine" value={formData.transitLine} onChange={(e) => { handleChange(e); setFormData(p => ({...p, station: ''})) }} disabled={!formData.transitSystem}>
                  <option value="">เลือกสาย</option>
                  {formData.transitSystem && Object.keys(transitData[formData.transitSystem]).map(line => (
                    <option key={line} value={line}>{line}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>สถานีรถไฟฟ้า</label>
                <select name="station" value={formData.station} onChange={handleChange} disabled={!formData.transitLine}>
                  <option value="">เลือกสถานี</option>
                  {formData.transitLine && transitData[formData.transitSystem][formData.transitLine].map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>ระยะห่างจากสถานี</label>
                <input type="text" name="distanceToStation" value={formData.distanceToStation} onChange={handleChange} placeholder="เช่น 200 ม. หรือ 1.5 กม." />
              </div>
            </div>

            <div className="bg-neutral-1 p-4 rounded-lg">
              <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold"><MapPin size={16} /> พิกัดแผนที่ (Latitude, Longitude)</h4>
              <p className="text-xs text-light mb-4">คัดลอกพิกัดจาก Google Maps มาวางได้เลย (รองรับทั้งแบบ 13.8023, 100.0522 และ 13°33'55"N 99°48'44"E)</p>
              <div className="form-group mb-0">
                <input 
                  type="text" 
                  value={locationInput} 
                  onChange={handleLocationStringChange} 
                  placeholder="เช่น 13.802386110244578, 100.05228075612297" 
                  required 
                  className="w-full"
                />
              </div>
            </div>
          </section>

          {/* สถานที่สำคัญใกล้เคียงแยก 4 หมวดหมู่ */}
          <section className="form-section">
            <h3 className="section-title">📍 สถานที่สำคัญใกล้เคียงและระยะทาง (แอดมินเลือกระบุ)</h3>
            <p className="text-xs text-gray-500 mb-4">พิมพ์ตัวเลขระบบจะแปลงเป็น กม. ให้อัตโนมัติ (เช่น พิมพ์ 800 จะเปลี่ยนเป็น 0.8 กม.)</p>
            
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              {[
                { key: 'transit', title: '🚆 รถไฟฟ้า / การเดินทาง', placeholder: 'เช่น BTS ปากน้ำ, ทางด่วนศรีรัช' },
                { key: 'malls', title: '🏬 ห้างสรรพสินค้า / ช้อปปิ้ง', placeholder: 'เช่น เซ็นทรัล นครปฐม, โลตัส' },
                { key: 'hospitals', title: '🏥 โรงพยาบาล / สถานพยาบาล', placeholder: 'เช่น รพ.กรุงเทพคริสเตียน, รพ.เปาโล' },
                { key: 'schools', title: '🎓 โรงเรียน / มหาวิทยาลัย', placeholder: 'เช่น ม.ศิลปากร, รร.สาธิต' }
              ].map(cat => (
                <div key={cat.key} className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-800">{cat.title}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => {
                          const current = prev.categorizedLandmarks?.[cat.key] || [];
                          return {
                            ...prev,
                            categorizedLandmarks: {
                              ...(prev.categorizedLandmarks || {}),
                              [cat.key]: [...current, { name: '', distance: '' }]
                            }
                          };
                        });
                      }}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      + เพิ่มสถานที่
                    </button>
                  </div>

                  {(!formData.categorizedLandmarks?.[cat.key] || formData.categorizedLandmarks[cat.key].length === 0) ? (
                    <div className="text-[11px] text-gray-400 italic">ยังไม่ได้เพิ่มรายการในหมวดนี้ (กด + เพิ่มสถานที่ ด้านบน)</div>
                  ) : (
                    <div className="space-y-2">
                      {formData.categorizedLandmarks[cat.key].map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder={cat.placeholder}
                            value={item.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData(prev => {
                                const list = [...(prev.categorizedLandmarks?.[cat.key] || [])];
                                list[idx] = { ...list[idx], name: val };
                                return {
                                  ...prev,
                                  categorizedLandmarks: { ...(prev.categorizedLandmarks || {}), [cat.key]: list }
                                };
                              });
                            }}
                            className="flex-1 text-xs p-2 border rounded-md"
                          />
                          <input
                            type="text"
                            placeholder="เช่น 800 (ม.) หรือ 1.2 (กม.)"
                            value={item.distance}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData(prev => {
                                const list = [...(prev.categorizedLandmarks?.[cat.key] || [])];
                                list[idx] = { ...list[idx], distance: val };
                                return {
                                  ...prev,
                                  categorizedLandmarks: { ...(prev.categorizedLandmarks || {}), [cat.key]: list }
                                };
                              });
                            }}
                            onBlur={(e) => {
                              let val = e.target.value.trim();
                              if (!val || val.match(/[ก-ฮa-zA-Z]/)) return; // ข้ามถ้าว่างหรือมีตัวอักษรแล้ว
                              let num = parseFloat(val);
                              if (!isNaN(num)) {
                                if (num >= 10) num = num / 1000; // ถ้าค่าเกิน 10 ตีความเป็นเมตร ให้แปลงเป็นกิโลเมตร
                                const newVal = num + ' กม.';
                                setFormData(prev => {
                                  const list = [...(prev.categorizedLandmarks?.[cat.key] || [])];
                                  list[idx] = { ...list[idx], distance: newVal };
                                  return {
                                    ...prev,
                                    categorizedLandmarks: { ...(prev.categorizedLandmarks || {}), [cat.key]: list }
                                  };
                                });
                              }
                            }}
                            className="w-36 text-xs p-2 border rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleAutoCalculateDistance(cat.key, idx, item.name)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1.5 rounded border border-gray-300 whitespace-nowrap"
                            title="คำนวณระยะทางอัตโนมัติ"
                          >
                            คำนวณ
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => {
                                const list = [...(prev.categorizedLandmarks?.[cat.key] || [])].filter((_, i) => i !== idx);
                                return {
                                  ...prev,
                                  categorizedLandmarks: { ...(prev.categorizedLandmarks || {}), [cat.key]: list }
                                };
                              });
                            }}
                            className="text-red-500 hover:bg-red-50 p-1 rounded-md"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* สิ่งอำนวยความสะดวกและจุดเด่น */}
          <section className="form-section">
            <h3 className="section-title">สิ่งอำนวยความสะดวกและจุดเด่น</h3>
            <div className="bg-neutral-1 p-6 rounded-lg mb-4">
              {formData.type === 'คอนโด' && (
                <div className="grid grid-cols-1 gap-6">
                  {renderCheckboxes('จุดเด่นพิเศษ', 'special', condoSpecials)}
                  {renderCheckboxes('สิ่งอำนวยความสะดวก (Facilities)', 'facilities', condoFacilities)}
                  {renderCheckboxes('การรักษาความปลอดภัย (Security)', 'security', condoSecurities)}
                </div>
              )}
              
              {(formData.type === 'บ้าน' || formData.type === 'ทาวน์โฮม') && (
                <div className="grid grid-cols-1 gap-6">
                  {renderCheckboxes('สิ่งอำนวยความสะดวก (Facilities)', 'facilities', houseFacilities)}
                  {renderCheckboxes('การรักษาความปลอดภัย (Security)', 'security', houseSecurities)}
                </div>
              )}
              
              {formData.type === 'ผู้สูงอายุ' && (
                <div className="grid grid-cols-1 gap-6">
                  {renderCheckboxes('รูปแบบการอยู่อาศัย (Living Format)', 'special', seniorLivingFormats)}
                  {renderCheckboxes('บริการเสริม (Services)', 'services', seniorServices)}
                  {renderCheckboxes('สิ่งอำนวยความสะดวก (Facilities)', 'facilities', seniorFacilities)}
                  {renderCheckboxes('บริการด้านสุขภาพ (Health & Wellness)', 'healthFacilities', seniorHealthFacilities)}
                  {renderCheckboxes('การรักษาความปลอดภัย (Security)', 'security', seniorSecurities)}
                </div>
              )}
            </div>

            <div className="bg-neutral-1 p-6 rounded-lg mb-4 mt-4">
              <div className="form-group mb-0">
                <label className="block text-sm font-bold text-dark mb-2">โปรโมชั่น (Promotion)</label>
                <textarea 
                  name="promotion" 
                  value={formData.promotion || ''} 
                  onChange={handleChange} 
                  placeholder="เช่น ฟรีดาวน์ ฟรีโอน ของแถม 10 รายการ..." 
                  className="form-control"
                  rows="3"
                ></textarea>
                <p className="text-xs text-light mt-1">อธิบายโปรโมชั่นหรือสิทธิพิเศษของโครงการ (ถ้ามี)</p>
              </div>
            </div>
          </section>

          {/* รูปภาพโลโก้สำหรับแผนที่ */}
          <section className="form-section">
            <h3 className="section-title">โลโก้โครงการ (สำหรับแสดงบนหมุดแผนที่)</h3>
            <ImageUploader 
              label="อัปโหลดรูปโลโก้โครงการ"
              multiple={false}
              images={formData.logo ? [formData.logo] : []}
              onChange={(images) => setFormData(p => ({...p, logo: images[0] || ''}))}
            />
          </section>

          {/* รูปภาพ */}
          <section className="form-section">
            <h3 className="section-title">รูปภาพโครงการ (แกลเลอรี่หลัก)</h3>
            <ImageUploader 
              label="อัปโหลดรูปภาพจากเครื่อง หรือวาง URL"
              multiple={true}
              images={formData.image ? formData.image.split(',') : []}
              onChange={(images) => setFormData(p => ({...p, image: images.join(',')}))}
            />
          </section>



          <div className="form-actions flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-8 border-t">
            <button type="button" className="btn btn-secondary w-full sm:w-auto px-8 py-2.5" onClick={() => navigate(-1)}>ยกเลิก</button>
            <button type="button" className="btn w-full sm:w-auto px-8 py-2.5 flex justify-center items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200" onClick={() => setShowPreview(true)}>
              <Eye size={18} /> ดูตัวอย่าง (Preview)
            </button>
            <button type="submit" className="btn btn-primary w-full sm:w-auto px-8 py-2.5 flex justify-center items-center gap-2"><Save size={18} /> บันทึกโครงการ</button>
          </div>
        </form>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <div className="sticky top-0 z-[110] bg-white border-b shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
              <Eye /> โหมดแสดงตัวอย่าง (Preview Mode)
            </h2>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button onClick={() => setShowPreview(false)} className="flex-1 sm:flex-none btn px-3 sm:px-6 py-2 shadow-sm flex justify-center items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 text-sm sm:text-base">
                <ArrowLeft size={16} /> <span className="hidden sm:inline">กลับไปแก้ไข</span><span className="sm:hidden">แก้ไข</span>
              </button>
              <button onClick={(e) => {
                setShowPreview(false);
                setTimeout(() => handleSubmit({ preventDefault: () => {} }), 100);
              }} className="flex-1 sm:flex-none btn btn-primary px-3 sm:px-6 py-2 shadow-sm flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-none text-sm sm:text-base">
                <Save size={16} /> บันทึกโครงการ
              </button>
            </div>
          </div>
          <div className="bg-gray-50 min-h-screen">
             <PropertyDetail previewData={formData} />
          </div>
        </div>
      )}
    </div>
  );
}
