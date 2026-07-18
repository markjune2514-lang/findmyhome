import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Heart, Share2, Info, LayoutDashboard } from 'lucide-react';
import { useCompare } from '../CompareContext';
import { useProperties } from '../PropertiesContext';
import './PropertyDetail.css';

export default function PropertyDetail() {
  const { id } = useParams();
  const { properties } = useProperties();
  const prop = properties.find(p => p.id === id) || properties[0];
  const { addToCompare } = useCompare();
  
  const [activeTab, setActiveTab] = useState('รายละเอียด');
  const handleAction = (action) => alert(`กำลังดำเนินการ: ${action}`);

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
          </div>
        </div>
        <div className="text-right">
          <p className="text-light text-sm">เริ่มต้น</p>
          <h2 className="text-primary">{prop.price} ล้าน</h2>
          <p className="text-light text-sm mt-1">{prop.bedrooms} Bed • {prop.size} ตร.ม.</p>
        </div>
      </div>

      <div className="gallery-section mb-8">
        <div className="main-image" style={{ backgroundImage: `url(${prop.image})` }}></div>
        <div className="thumbnail-list">
          <img src={prop.image} alt="thumb" />
          <img src={prop.image} alt="thumb" />
          <img src={prop.image} alt="thumb" />
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button className="btn btn-secondary flex-1" onClick={() => handleAction('บันทึกโครงการ')}><Heart size={18} /> บันทึก</button>
        <button className="btn btn-secondary flex-1" onClick={() => handleAction('คัดลอกลิงก์เพื่อแชร์')}><Share2 size={18} /> แชร์</button>
        <button className="btn btn-secondary flex-1" onClick={() => addToCompare(prop)}><LayoutDashboard size={18} /> เปรียบเทียบ</button>
        <button className="btn btn-primary flex-2" onClick={() => handleAction('ฟอร์มติดต่อโครงการ')}>ติดต่อโครงการ / นัดชม</button>
      </div>

      <div className="content-tabs mb-6">
        {['รายละเอียด', 'แปลนห้อง', 'สิ่งอำนวยความสะดวก', 'ทำเลที่ตั้ง'].map(tab => (
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
                  <Info size={24} color="var(--primary)" />
                  <p className="label">สถานะ</p>
                  <p className="val">{prop.status}</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'แปลนห้อง' && (
            <div className="mb-8">
              <h3 className="mb-4">แปลนห้อง</h3>
              <div className="p-12 text-center bg-neutral-1 rounded-lg text-light">ไม่มีข้อมูลแปลนห้องในขณะนี้</div>
            </div>
          )}

          {activeTab === 'สิ่งอำนวยความสะดวก' && (
            <>
              <h3 className="mb-4">สิ่งอำนวยความสะดวก</h3>
              <ul className="facilities-list flex flex-wrap gap-4 mb-8">
                {prop.facilities?.map((f, i) => (
                  <li key={i} className="facility-badge">{f}</li>
                ))}
              </ul>
            </>
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
