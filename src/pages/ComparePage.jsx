import React, { useState } from 'react';
import { ArrowLeft, Check, X, MapPin, Search, Share2, Download, Plus, Star, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../CompareContext';
import './ComparePage.css';

export default function ComparePage() {
  const navigate = useNavigate();
  const { compareList, removeFromCompare } = useCompare();
  const [activeTab, setActiveTab] = useState('ข้อมูลทั่วไป');
  
  const handleAction = (action) => alert(`กำลังดำเนินการ: ${action}`);

  return (
    <div className="container py-8">
      <div className="breadcrumb mb-4 text-sm text-light">
        <Link to="/search">หน้าหลัก</Link> &gt; <span className="text-main">เปรียบเทียบโครงการ</span>
      </div>

      <div className="flex justify-between items-end mb-6">
        <div>
          <h2>เปรียบเทียบโครงการ</h2>
          <p className="text-light">เลือกโครงการที่คุณสนใจเพื่อเปรียบเทียบรายละเอียด</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary" onClick={() => handleAction('แชร์ข้อมูลเปรียบเทียบ')}><Share2 size={16} /> แชร์</button>
          <button className="btn btn-secondary" onClick={() => handleAction('ดาวน์โหลดข้อมูลเปรียบเทียบ PDF')}><Download size={16} /> ดาวน์โหลด PDF</button>
        </div>
      </div>

      <div className="compare-matrix">
        <div className="compare-grid">
          {compareList.length === 0 ? (
            <div className="p-12 text-center text-light col-span-full w-full bg-white rounded shadow-sm">
              ยังไม่มีโครงการในรายการเปรียบเทียบ<br/>
              ลองไปที่หน้าค้นหาหรือหน้าโครงการ แล้วคลิกปุ่ม "เปรียบเทียบ" เพื่อเพิ่มโครงการดูครับ
              <br/><br/>
              <Link to="/search" className="btn btn-primary inline-flex mt-4">ไปที่หน้าค้นหา</Link>
            </div>
          ) : (
            <>
              {/* Sticky Header Row (Labels) */}
              <div className="compare-column label-col">
                <div className="label-top-section" style={{ height: '290px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem 1rem 0 1rem', borderBottom: '1px solid var(--neutral-2)' }}>
                  <div className="spacer-card">
                    <h3 className="mb-4">ข้อมูลโครงการ</h3>
                    <button className="btn btn-secondary w-full text-sm" onClick={() => navigate('/search')}><Plus size={14} /> เพิ่มโครงการ</button>
                  </div>
                  
                  <div className="content-tabs mb-2 flex">
                    {['ข้อมูลทั่วไป', 'สิ่งอำนวยความสะดวก', 'การผ่อนชำระ'].map(tab => (
                      <button key={tab} className={`tab text-xs px-2 flex-1 ${activeTab === tab ? 'active' : ''}`} style={{ padding: '0.5rem', textAlign: 'center', borderBottom: activeTab === tab ? '2px solid var(--primary)' : 'none', color: activeTab === tab ? 'var(--primary)' : 'var(--text-light)', fontWeight: activeTab === tab ? 'bold' : 'normal' }} onClick={() => setActiveTab(tab)}>{tab}</button>
                    ))}
                  </div>
                </div>
                
                <div className="metrics-list">
                  {activeTab === 'ข้อมูลทั่วไป' && (
                    <>
                      <div className="metric-row font-semibold">ประเภทโครงการ</div>
                      <div className="metric-row font-semibold">จำนวนชั้น</div>
                      <div className="metric-row font-semibold">จำนวนยูนิต</div>
                      <div className="metric-row font-semibold">สถานะการก่อสร้าง</div>
                      <div className="metric-row font-semibold">ราคาเริ่มต้น</div>
                      <div className="metric-row font-semibold">ราคาเฉลี่ย/ตร.ม.</div>
                      <div className="metric-row font-semibold">ระยะจากรถไฟฟ้า</div>
                      <div className="metric-row font-semibold">คะแนนรีวิว</div>
                    </>
                  )}
                  {activeTab === 'สิ่งอำนวยความสะดวก' && (
                    <>
                      <div className="metric-row font-semibold">สระว่ายน้ำ</div>
                      <div className="metric-row font-semibold">ฟิตเนส</div>
                      <div className="metric-row font-semibold">Co-working Space</div>
                      <div className="metric-row font-semibold">สวนส่วนกลาง</div>
                    </>
                  )}
                  {activeTab === 'การผ่อนชำระ' && (
                    <>
                      <div className="metric-row font-semibold">เงินจอง</div>
                      <div className="metric-row font-semibold">ผ่อนดาวน์/เดือน</div>
                      <div className="metric-row font-semibold">ยอดโอนกรรมสิทธิ์</div>
                    </>
                  )}
                </div>
              </div>

              {/* Property Columns */}
              {compareList.map((prop, index) => (
                <div key={prop.id} className="compare-column prop-col">
                  <div className="prop-card-compare" style={{ height: '290px' }}>
                    <span className="badge absolute-badge-top">{index + 1}</span>
                    <button className="remove-btn" onClick={() => removeFromCompare(prop.id)}><X size={14} /></button>
                    <img src={prop.image} alt={prop.name} />
                    <div className="p-4">
                      <h4>{prop.name}</h4>
                      <p className="text-xs text-light mb-2">{prop.developer}</p>
                      <div className="text-sm"><span className="text-primary font-semibold">เริ่มต้น {prop.price} ลบ.</span></div>
                      <div className="text-xs text-light mt-1">{prop.bedrooms} Bed | {prop.size} ตร.ม.</div>
                    </div>
                  </div>

                  <div className="metrics-list text-center">
                    {activeTab === 'ข้อมูลทั่วไป' && (
                      <>
                        <div className="metric-row">{prop.projectType}</div>
                        <div className="metric-row">{prop.floors} ชั้น</div>
                        <div className="metric-row">{prop.totalUnits} ยูนิต</div>
                        <div className="metric-row">{prop.status}</div>
                        <div className="metric-row font-semibold">{prop.price} ลบ.</div>
                        <div className="metric-row">{prop.priceSqm?.toLocaleString() || '-'} บาท/ตร.ม.</div>
                        <div className="metric-row">{prop.station} {prop.distanceToStation}</div>
                        <div className="metric-row flex justify-center items-center gap-1">
                          {prop.rating} <Star size={12} fill="gold" color="gold" />
                        </div>
                      </>
                    )}
                    {activeTab === 'สิ่งอำนวยความสะดวก' && (
                      <>
                        <div className="metric-row">{prop.facilities?.includes('สระว่ายน้ำ') ? <Check size={16} color="green" /> : <X size={16} color="red" />}</div>
                        <div className="metric-row">{prop.facilities?.includes('ฟิตเนส') ? <Check size={16} color="green" /> : <X size={16} color="red" />}</div>
                        <div className="metric-row">{prop.facilities?.includes('Co-working Space') ? <Check size={16} color="green" /> : <X size={16} color="red" />}</div>
                        <div className="metric-row">{prop.facilities?.includes('สวนส่วนกลาง') ? <Check size={16} color="green" /> : <X size={16} color="red" />}</div>
                      </>
                    )}
                    {activeTab === 'การผ่อนชำระ' && (
                      <>
                        <div className="metric-row">10,000 บาท</div>
                        <div className="metric-row">{(prop.price * 1000).toLocaleString()} บาท</div>
                        <div className="metric-row">{(prop.price * 950000).toLocaleString()} บาท</div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {compareList.length > 0 && (
        <div className="ai-recommendation mt-12 bg-secondary p-8 rounded-lg shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-primary text-white p-3 rounded-full"><CheckCircle2 size={24} /></div>
            <div>
              <h3>AI Recommendation</h3>
              <p className="text-light text-sm">จากการวิเคราะห์ข้อมูลโครงการที่คุณเลือกเปรียบเทียบ นี่คือคำแนะนำของเรา</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="recommend-card bg-white p-4 rounded-lg border-l-4 border-primary shadow-sm">
              <h4 className="text-sm font-semibold mb-2">🏆 คุ้มค่าที่สุด (Best Value)</h4>
              <p className="text-primary font-bold mb-1">{compareList[0]?.name}</p>
              <p className="text-xs text-light">ราคาเริ่มต้นต่ำสุดที่ {compareList[0]?.price} ลบ. และได้พื้นที่ส่วนกลางครบครัน ตอบโจทย์การลงทุนและอยู่อาศัยจริง</p>
            </div>
            {compareList.length > 1 && (
              <div className="recommend-card bg-white p-4 rounded-lg border-l-4 border-accent shadow-sm">
                <h4 className="text-sm font-semibold mb-2">🚇 เดินทางสะดวกที่สุด (Best Location)</h4>
                <p className="text-accent font-bold mb-1">{compareList[1]?.name}</p>
                <p className="text-xs text-light">ห่างจาก {compareList[1]?.station} เพียง {compareList[1]?.distanceToStation} สะดวกสบายที่สุดสำหรับคนใช้รถไฟฟ้าเป็นหลัก</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
