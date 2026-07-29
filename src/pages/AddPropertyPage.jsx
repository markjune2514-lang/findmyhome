import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../PropertiesContext';
import { provincesAndDistricts, transitData } from '../data/locations';
import { Save, Image as ImageIcon, MapPin, X } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import './AddPropertyPage.css';

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const { addProperty } = useProperties();

  const [formData, setFormData] = useState({
    name: '',
    developer: '',
    type: 'คอนโด',
    projectType: 'High Rise',
    price: '',
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
    unitTypes: [{ name: '', price: '', landSize: '', size: '', bedrooms: '', bathrooms: '', parking: '', roomType: '', planImages: [], roomImages: [] }]
  });
  
  const [customInputs, setCustomInputs] = useState({});
  
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
      unitTypes: [...prev.unitTypes, { name: '', price: '', landSize: '', size: '', bedrooms: '', bathrooms: '', parking: '', roomType: '', planImages: [], roomImages: [] }]
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

  const handleSubmit = (e) => {
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
      price: calculatedPrice || parseFloat(formData.price) || 0,
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

    const newId = addProperty(newProperty);
    alert('เพิ่มโครงการสำเร็จ! คุณสามารถดูโครงการใหม่ได้ในหน้าค้นหา');
    navigate(`/property/${newId}`);
  };

  return (
    <div className="add-property-page bg-background min-h-screen pb-12">
      <div className="admin-header py-6 bg-white border-b mb-8">
        <div className="container flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">เพิ่มโครงการใหม่</h1>
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
              <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold"><MapPin size={16} /> พิกัดแผนที่ (Latitude / Longitude)</h4>
              <p className="text-xs text-light mb-4">ค้นหาพิกัดจาก Google Maps เพื่อให้โครงการแสดงบนหน้าค้นหาได้อย่างแม่นยำ</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <input type="number" step="0.000001" name="lat" value={formData.location.lat} onChange={(e) => setFormData(p => ({...p, location: {...p.location, lat: parseFloat(e.target.value)}}))} placeholder="Latitude" required />
                </div>
                <div className="form-group mb-0">
                  <input type="number" step="0.000001" name="lng" value={formData.location.lng} onChange={(e) => setFormData(p => ({...p, location: {...p.location, lng: parseFloat(e.target.value)}}))} placeholder="Longitude" required />
                </div>
              </div>
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
            <h3 className="section-title">รูปภาพโครงการ</h3>
            <div className="form-group">
              <label>ลิงก์รูปภาพ (Image URL)</label>
              <div className="flex gap-2">
                <input type="url" name="image" className="flex-1" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              </div>
              <p className="text-xs text-light mt-1">วางลิงก์รูปภาพจากเว็บ หรือฝากรูปบนเว็บอื่นๆ แล้วนำ URL มาวาง (หากไม่ใส่จะมีภาพพื้นฐานให้)</p>
            </div>
            {formData.image && (
              <div className="mt-4 rounded-lg overflow-hidden border" style={{ height: '200px', width: '300px' }}>
                <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
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
