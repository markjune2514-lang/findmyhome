import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProperties } from '../PropertiesContext';
import { provincesAndDistricts, transitData } from '../data/locations';
import { Save, Image as ImageIcon, MapPin, X } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import './AddPropertyPage.css';

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { addProperty, updateProperty, properties } = useProperties();

  const [formData, setFormData] = useState({
    name: '',
    developer: '',
    type: 'คอนโด',
    projectType: 'High Rise',
    price: '',
    priceTo: '',
    priceSqm: '',
    bedrooms: '1',
    size: '30',
    landSize: '',
    floors: '',
    totalUnits: '',
    status: 'กำลังก่อสร้าง',
    image: '',
    rating: '5.0',
    location: { lat: 13.7563, lng: 100.5018 },
    province: 'กรุงเทพมหานคร',
    district: '',
    transitSystem: '',
    transitLine: '',
    station: '',
    distanceToStation: '300 ม.',
    roomType: '',
    livingFormat: '',
    special: [],
    facilities: [],
    healthFacilities: [],
    services: [],
    security: [],
    promotions: [],
    transport: [],
    unitTypes: [{ name: '', price: '', landSize: '', size: '', bedrooms: '', bathrooms: '', parking: '', roomType: '', planImages: [], roomImages: [], useProjectFacilities: true, facilities: [] }]
  });
  
  const [customInputs, setCustomInputs] = useState({});
  const [locationInput, setLocationInput] = useState(`${formData.location.lat}, ${formData.location.lng}`);

  useEffect(() => {
    if (isEditMode && properties.length > 0) {
      const propToEdit = properties.find(p => p.id === id);
      if (propToEdit) {
        setFormData(propToEdit);
        setLocationInput(`${propToEdit.location.lat}, ${propToEdit.location.lng}`);
      }
    }
  }, [id, isEditMode, properties]);
  
  const handleLocationStringChange = (e) => {
    const val = e.target.value;
    setLocationInput(val);
    const parts = val.split(',');
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());
      if (!isNaN(lat) && !isNaN(lng)) {
        setFormData(p => ({...p, location: { lat, lng }}));
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
  const condoFacilities = ['Clubhouse', 'สระว่ายน้ำ', 'Fitness', 'Co-working Space', 'Cafe', 'Garden', 'Kids Room', 'Game Room', 'Yoga Room', 'Sky Lounge', 'EV Charger', 'Smart Locker', 'Shuttle Bus', 'Co kitchen', 'Sauna / Steam', 'Meeting Room', 'Auto Parking', 'Playground (สนามเด็กเล่น)'];
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    // Auto-calculate min price and starting values from unitTypes
    let calculatedPrice = 0;
    let calculatedSize = '';
    let calculatedBedrooms = '';
    let calculatedRoomType = '';
    
    if (formData.unitTypes && formData.unitTypes.length > 0) {
      // Filter out empty prices
      const validUnits = formData.unitTypes.filter(u => u.price && !isNaN(parseFloat(u.price)));
      if (validUnits.length > 0) {
        // Find the unit with the minimum price
        const minPriceUnit = validUnits.reduce((min, p) => parseFloat(p.price) < parseFloat(min.price) ? p : min, validUnits[0]);
        calculatedPrice = parseFloat(minPriceUnit.price);
        calculatedSize = minPriceUnit.size || '';
        calculatedBedrooms = minPriceUnit.bedrooms || '';
        calculatedRoomType = minPriceUnit.roomType || '';
      }
    }

    // Prepare the final object shape expected by the app
    const newProperty = {
      ...formData,
      price: parseFloat(formData.price) || calculatedPrice || 0,
      priceTo: parseFloat(formData.priceTo) || 0,
      priceSqm: parseInt(formData.priceSqm) || 0,
      bedrooms: calculatedBedrooms || formData.bedrooms,
      size: calculatedSize || formData.size,
      roomType: calculatedRoomType || formData.roomType,
      floors: parseInt(formData.floors) || 0,
      totalUnits: parseInt(formData.totalUnits) || 0,
      location: {
        lat: parseFloat(formData.location.lat),
        lng: parseFloat(formData.location.lng)
      },
      image: formData.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      reviews: 0
    };

    try {
      let resultId = null;
      if (isEditMode) {
        const success = await updateProperty(id, newProperty);
        if (success) {
          alert('บันทึกการแก้ไขโครงการเรียบร้อยแล้ว!');
          navigate('/admin');
        } else {
          alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล กรุณาลองใหม่อีกครั้ง');
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
            <div className="grid grid-cols-2 gap-4">
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

              <div className="form-group">
                <label>ราคาเริ่มต้น (ล้านบาท) <span className="text-red-500">*</span></label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required placeholder="เช่น 3.5" />
                <p className="text-xs text-light mt-1">*หากเพิ่ม 'แบบห้อง' ด้านล่าง ระบบจะใช้ราคาต่ำสุดจากแบบห้องอัตโนมัติ</p>
              </div>
              <div className="form-group">
                <label>ราคาสูงสุด (ล้านบาท) <span className="text-light">(ไม่บังคับ)</span></label>
                <input type="number" step="0.01" name="priceTo" value={formData.priceTo} onChange={handleChange} placeholder="เช่น 5.9" />
                <p className="text-xs text-light mt-1">หากต้องการแสดงราคาเป็นช่วง (เช่น 3.5 - 5.9 ล้านบาท)</p>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label>จำนวนชั้นทั้งหมด</label>
                <input type="number" name="floors" value={formData.floors} onChange={handleChange} placeholder="เช่น 32" />
              </div>
              <div className="form-group">
                <label>จำนวนยูนิตทั้งหมด</label>
                <input type="number" name="totalUnits" value={formData.totalUnits} onChange={handleChange} placeholder="เช่น 450" />
              </div>
            </div>
          </section>

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
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <div className="form-group mb-0">
                      <label className="text-xs">ราคา (ล้านบาท)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={unit.price} 
                        onChange={(e) => handleUnitTypeChange(idx, 'price', e.target.value)} 
                        placeholder="เช่น 2.59" 
                        required
                        className="text-sm"
                      />
                    </div>
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
            <div className="grid grid-cols-2 gap-4 mb-4">
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
              <p className="text-xs text-light mb-4">คัดลอกพิกัดจาก Google Maps มาวางได้เลย (เช่น 13.80238, 100.05228)</p>
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
            <p className="text-xs text-gray-500 mb-4">เลือกเพิ่มสถานที่สำคัญและระยะทาง (เช่น 450 ม. หรือ 1.2 กม.) เพื่อให้แสดงผลในหน้าโครงการ</p>
            
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              {[
                { key: 'transit', title: '🚆 1. รถไฟฟ้า / การเดินทาง', placeholder: 'เช่น BTS ปากน้ำ, ทางด่วนศรีรัช' },
                { key: 'malls', title: '🏬 2. ห้างสรรพสินค้า / ช้อปปิ้ง', placeholder: 'เช่น เซ็นทรัล นครปฐม, โลตัส' },
                { key: 'hospitals', title: '🏥 3. โรงพยาบาล / สถานพยาบาล', placeholder: 'เช่น รพ.กรุงเทพคริสเตียน, รพ.เปาโล' },
                { key: 'schools', title: '🎓 4. โรงเรียน / มหาวิทยาลัย', placeholder: 'เช่น ม.ศิลปากร, รร.สาธิต' }
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
                            placeholder="เช่น 500 ม. หรือ 1.2 กม."
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
                            className="w-36 text-xs p-2 border rounded-md"
                          />
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



          <div className="form-actions flex justify-end gap-4 mt-8 pt-8 border-t">
            <button type="button" className="btn btn-secondary px-8" onClick={() => navigate(-1)}>ยกเลิก</button>
            <button type="submit" className="btn btn-primary px-8 flex items-center gap-2"><Save size={18} /> บันทึกโครงการ</button>
          </div>
        </form>
      </div>
    </div>
  );
}
