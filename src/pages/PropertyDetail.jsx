import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Heart, Share2, Info, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCompare } from '../CompareContext';
import { useProperties } from '../PropertiesContext';
import './PropertyDetail.css';

export default function PropertyDetail() {
  const { id } = useParams();
  const { properties } = useProperties();
  const prop = properties.find(p => p.id === id) || properties[0];
  const { addToCompare } = useCompare();
  
  const [activeTab, setActiveTab] = useState('รายละเอียด');
  
  const mainImages = prop.image ? prop.image.split(',') : [];
  const allUnitImages = prop.unitTypes ? prop.unitTypes.flatMap(u => [...(u.planImages || []), ...(u.roomImages || [])]) : [];
  
  // Combine all images into a single gallery
  const allImages = [...new Set([...mainImages, ...allUnitImages])].filter(Boolean);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedImage = allImages.length > 0 ? allImages[currentIndex] : '';

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [prop.id]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleAction = (action) => alert(`กำลังดำเนินการ: ${action}`);

  const [selectedUnitFilter, setSelectedUnitFilter] = useState('all');

  const filteredUnitTypes = prop.unitTypes
    ? (selectedUnitFilter === 'all'
        ? prop.unitTypes
        : prop.unitTypes.filter((_, idx) => idx.toString() === selectedUnitFilter))
    : [];

  return (
    <div className="container py-8">
      <div className="breadcrumb mb-4 text-sm text-light">
        <Link to="/search">หน้าหลัก</Link> &gt; <Link to="/search">ค้นหา</Link> &gt; <span className="text-main">{prop.name}</span>
      </div>

      <div className="detail-header flex justify-between items-start mb-6">
        <div>
          <h2>{prop.name}</h2>
          <p className="text-light">{prop.developer}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="badge">{prop.projectType}</span>
            <span className="rating-info"><Star size={16} fill="gold" color="gold" /> {prop.rating} ({prop.reviews || 12} รีวิว)</span>
            {prop.unitTypes && prop.unitTypes.length > 0 && (
              <span className="px-3 py-1 bg-primary/10 text-primary font-semibold rounded-full text-xs border border-primary/20">
                🏡 โครงการนี้มี {prop.unitTypes.length} แบบบ้าน/ห้อง
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-light text-sm">เริ่มต้น</p>
          <h2 className="text-primary">{prop.price} {prop.priceTo ? `- ${prop.priceTo}` : ''} ล้าน</h2>
          <p className="text-light text-sm mt-1">{prop.bedrooms} Bed • {prop.size} {prop.size && !prop.size.includes('ตร') ? 'ตร.ม.' : ''}</p>
        </div>
      </div>

      <div className="gallery-section mb-8">
        <div className="flex items-center gap-4">
          {allImages.length > 1 && (
            <button onClick={handlePrev} className="bg-white hover:bg-neutral-50 border p-3 rounded-full shadow-sm text-neutral-700 transition-colors shrink-0">
              <ChevronLeft size={24} />
            </button>
          )}
          
          <div className="main-image transition-all duration-300 flex-1" style={{ backgroundImage: `url(${selectedImage})`, height: '400px', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #eee' }}></div>
          
          {allImages.length > 1 && (
            <button onClick={handleNext} className="bg-white hover:bg-neutral-50 border p-3 rounded-full shadow-sm text-neutral-700 transition-colors shrink-0">
              <ChevronRight size={24} />
            </button>
          )}
        </div>
        
        {allImages.length > 1 && (
          <div className="thumbnail-list flex gap-3 mt-3 overflow-x-auto pb-2 snap-x">
            {allImages.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`thumb-${idx}`} 
                onClick={() => setCurrentIndex(idx)}
                className={`w-32 h-24 object-cover rounded-md cursor-pointer border-2 shrink-0 snap-start bg-neutral-1 transition-colors ${currentIndex === idx ? 'border-primary' : 'border-transparent hover:border-primary/50'}`} 
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-8">
        <button className="btn btn-secondary flex-1" onClick={() => handleAction('บันทึกโครงการ')}><Heart size={18} /> บันทึก</button>
        <button className="btn btn-secondary flex-1" onClick={() => handleAction('คัดลอกลิงก์เพื่อแชร์')}><Share2 size={18} /> แชร์</button>
        <button className="btn btn-secondary flex-1" onClick={() => addToCompare(prop)}><LayoutDashboard size={18} /> เปรียบเทียบ</button>
        <button className="btn btn-primary flex-2" onClick={() => handleAction('ฟอร์มติดต่อโครงการ')}>ติดต่อโครงการ / นัดชม</button>
      </div>

      <div className="content-tabs mb-6">
        {['รายละเอียด', 'แบบบ้าน/ห้อง', 'สิ่งอำนวยความสะดวก', 'ทำเลที่ตั้ง'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      <div className="flex gap-8">
        <div className="main-info flex-2">
          {activeTab === 'รายละเอียด' && (
            <>
              <h3 className="mb-4">รายละเอียดโครงการ</h3>
              <div className="specs-grid mb-8">
                <div className="spec-item">
                  <Info size={24} color="var(--primary)" />
                  <p className="label">ผู้พัฒนา</p>
                  <p className="val">{prop.developer}</p>
                </div>
                <div className="spec-item">
                  <LayoutDashboard size={24} color="var(--primary)" />
                  <p className="label">จำนวนชั้น</p>
                  <p className="val">{prop.floors} ชั้น</p>
                </div>
                <div className="spec-item">
                  <LayoutDashboard size={24} color="var(--primary)" />
                  <p className="label">จำนวนยูนิต</p>
                  <p className="val">{prop.totalUnits} ยูนิต</p>
                </div>
                <div className="spec-item">
                  <LayoutDashboard size={24} color="var(--primary)" />
                  <p className="label">จำนวนแบบบ้าน/ห้อง</p>
                  <p className="val">{prop.unitTypes?.length || 0} แบบ</p>
                </div>
                <div className="spec-item">
                  <Info size={24} color="var(--primary)" />
                  <p className="label">สถานะ</p>
                  <p className="val">{prop.status}</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'แบบบ้าน/ห้อง' && (
            <div className="mb-8">
              <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <h3 className="m-0">รูปแบบบ้านและห้องในโครงการ</h3>
                {prop.unitTypes && prop.unitTypes.length > 0 && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-xs border border-emerald-200">
                    โครงการนี้มีทั้งหมด {prop.unitTypes.length} แบบบ้าน/ห้อง
                  </span>
                )}
              </div>

              {/* Unit Type Filter Pills */}
              {prop.unitTypes && prop.unitTypes.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-3 mb-4 snap-x">
                  <button
                    onClick={() => setSelectedUnitFilter('all')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors whitespace-nowrap shrink-0 ${
                      selectedUnitFilter === 'all'
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    แสดงทั้งหมด ({prop.unitTypes.length})
                  </button>
                  {prop.unitTypes.map((u, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedUnitFilter(i.toString())}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors whitespace-nowrap shrink-0 ${
                        selectedUnitFilter === i.toString()
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {u.name || `แบบที่ ${i + 1}`} ({u.price} ล้าน)
                    </button>
                  ))}
                </div>
              )}

              {filteredUnitTypes && filteredUnitTypes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUnitTypes.map((unit, idx) => (
                    <div key={idx} className="p-4 border rounded-lg bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        {((unit.planImages && unit.planImages.length > 0) || (unit.roomImages && unit.roomImages.length > 0)) && (
                          <div className="mb-4">
                            {unit.planImages && unit.planImages.length > 0 && (
                              <div className="mb-2">
                                <span className="text-xs font-semibold text-gray-500 mb-1 block">แปลนห้อง (Top View)</span>
                                <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                                  {unit.planImages.map((img, i) => (
                                    <div 
                                      key={i} 
                                      onClick={() => { 
                                        const idx = allImages.indexOf(img);
                                        if (idx !== -1) setCurrentIndex(idx);
                                        window.scrollTo({ top: 0, behavior: 'smooth' }); 
                                      }}
                                      className="min-w-[120px] w-[120px] h-[90px] rounded-md bg-neutral-1 bg-cover bg-center border shrink-0 snap-start cursor-pointer hover:border-primary transition-colors" 
                                      style={{ backgroundImage: `url(${img})` }}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {unit.roomImages && unit.roomImages.length > 0 && (
                              <div>
                                <span className="text-xs font-semibold text-gray-500 mb-1 block">ภาพบรรยากาศห้อง</span>
                                <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                                  {unit.roomImages.map((img, i) => (
                                    <div 
                                      key={i} 
                                      onClick={() => { 
                                        const idx = allImages.indexOf(img);
                                        if (idx !== -1) setCurrentIndex(idx);
                                        window.scrollTo({ top: 0, behavior: 'smooth' }); 
                                      }}
                                      className="min-w-[120px] w-[120px] h-[90px] rounded-md bg-neutral-1 bg-cover bg-center border shrink-0 snap-start cursor-pointer hover:border-primary transition-colors" 
                                      style={{ backgroundImage: `url(${img})` }}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-primary">{unit.name || 'ไม่ระบุชื่อแบบ'}</h4>
                          <span className="font-bold text-main">{unit.price} ล้านบาท</span>
                        </div>
                        <div className="text-sm text-light grid grid-cols-2 gap-2 mt-2">
                          <div><strong>รูปแบบ:</strong> {unit.roomType || '-'}</div>
                          {unit.landSize && <div><strong>ขนาดที่ดิน:</strong> {unit.landSize} ตร.วา</div>}
                          <div><strong>พื้นที่ใช้สอย:</strong> {unit.size ? `${unit.size.replace('ตร.ม.', '').replace('ตร.วา', '').trim()} ตร.ม.` : '-'}</div>
                          <div><strong>ห้องนอน:</strong> {unit.bedrooms || '-'}</div>
                          <div><strong>ห้องน้ำ:</strong> {unit.bathrooms || '-'}</div>
                          <div><strong>ที่จอดรถ:</strong> {unit.parking || '-'}</div>
                        </div>
                      </div>

                      {/* Section for Unit Facilities */}
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        {unit.useProjectFacilities === false && unit.facilities && unit.facilities.length > 0 ? (
                          <div>
                            <span className="text-xs font-bold text-emerald-700 block mb-2">
                              ✨ สิ่งอำนวยความสะดวกเฉพาะแบบนี้:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {unit.facilities.map((fac, i) => (
                                <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
                                  {fac}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs font-medium text-gray-500 block">
                              ✨ สิ่งอำนวยความสะดวก: <span className="text-gray-700 font-semibold">ใช้สิ่งอำนวยความสะดวกส่วนกลางหลักของโครงการ</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-neutral-1 rounded-lg text-light">ไม่มีข้อมูลแบบบ้าน/ห้องในขณะนี้</div>
              )}
            </div>
          )}

          {activeTab === 'สิ่งอำนวยความสะดวก' && (
            <div className="space-y-6 mb-8">
              {prop.special && prop.special.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold text-gray-800">จุดเด่น / รูปแบบการอยู่อาศัย</h3>
                  <ul className="flex flex-wrap gap-2">
                    {prop.special.map((s, i) => (
                      <li key={i} className="px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm font-medium border border-pink-100">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {prop.facilities && prop.facilities.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold text-gray-800">สิ่งอำนวยความสะดวก (Facilities)</h3>
                  <ul className="flex flex-wrap gap-2">
                    {prop.facilities.map((f, i) => (
                      <li key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {prop.security && prop.security.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold text-gray-800">การรักษาความปลอดภัย (Security)</h3>
                  <ul className="flex flex-wrap gap-2">
                    {prop.security.map((s, i) => (
                      <li key={i} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {prop.healthFacilities && prop.healthFacilities.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold text-gray-800">บริการด้านสุขภาพ (Health & Wellness)</h3>
                  <ul className="flex flex-wrap gap-2">
                    {prop.healthFacilities.map((h, i) => (
                      <li key={i} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100">{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {prop.services && prop.services.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold text-gray-800">บริการเสริม (Services)</h3>
                  <ul className="flex flex-wrap gap-2">
                    {prop.services.map((s, i) => (
                      <li key={i} className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-100">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {!prop.special?.length && !prop.facilities?.length && !prop.security?.length && !prop.healthFacilities?.length && !prop.services?.length && (
                <div className="p-8 text-center bg-gray-50 rounded-lg text-gray-500">
                  ไม่มีข้อมูลสิ่งอำนวยความสะดวก
                </div>
              )}
            </div>
          )}

          {activeTab === 'ทำเลที่ตั้ง' && (
            <div className="mb-8">
              <h3 className="mb-4">ทำเลที่ตั้ง</h3>
              <p className="mb-4 text-light">ใกล้ {prop.station} ({prop.distanceToStation})</p>
            </div>
          )}
        </div>
        
        <div className="side-map flex-1">
          <div className="map-card-small">
            <h4 className="mb-2">ทำเลที่ตั้ง</h4>
            <div className="mini-map-placeholder mb-4">
              <MapPin size={32} color="var(--primary)" />
            </div>
            <p className="text-sm font-semibold mb-2">ใกล้สถานที่สำคัญ</p>
            <ul className="nearby-list text-sm text-light">
              <li>{prop.station} <span>{prop.distanceToStation}</span></li>
              <li>Central Bangna <span>2.4 กม.</span></li>
              <li>Mega Bangna <span>3.7 กม.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
