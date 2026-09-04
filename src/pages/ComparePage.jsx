import React, { useState } from 'react';
import { ArrowLeft, Check, X, MapPin, Search, Share2, Download, Plus, Star, CheckCircle2, Building2, Navigation, Clock, Car, Train } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../CompareContext';
import { useWorkplace } from '../WorkplaceContext';
import './ComparePage.css';

export default function ComparePage() {
  const navigate = useNavigate();
  const { compareList, removeFromCompare } = useCompare();
  const { workplace, calculateCommute, setIsWorkplaceModalOpen } = useWorkplace();
  const [activeTab, setActiveTab] = useState('ข้อมูลทั่วไป');
  
  // Calculate commutes for all properties in compareList
  const commutes = compareList.map(prop => {
    const lat = prop.location?.lat || prop.location_lat;
    const lng = prop.location?.lng || prop.location_lng;
    return calculateCommute(lat, lng);
  });

  // Find the closest property to workplace
  let fastestPropIndex = -1;
  let minDistance = Infinity;
  if (workplace) {
    commutes.forEach((c, idx) => {
      if (c && c.distanceKm < minDistance) {
        minDistance = c.distanceKm;
        fastestPropIndex = idx;
      }
    });
  }

  return (
    <div className="container py-8">
      <div className="breadcrumb mb-4 text-sm text-light">
        <Link to="/">หน้าหลัก</Link> &gt; <span className="text-main">เปรียบเทียบโครงการ</span>
      </div>

      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold whitespace-nowrap mb-1">เปรียบเทียบโครงการ</h2>
          <p className="text-light text-sm md:text-base">เปรียบเทียบรายละเอียด ราคา และระยะทางจากที่ทำงานเคียงข้างกัน</p>
        </div>

        {/* Workplace Quick Setting Bar */}
        <div className="flex items-center gap-2.5 p-2 px-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl">
          <Building2 size={18} className="text-blue-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="text-slate-500 block leading-tight">สถานที่ทำงานเป้าหมาย:</span>
            <span className="font-bold text-blue-900">
              {workplace ? workplace.name : 'ยังไม่ได้ระบุที่ทำงาน'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsWorkplaceModalOpen(true)}
            className="ml-2 px-3 py-1 rounded-xl bg-white hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold border border-blue-200 transition-colors shadow-xs cursor-pointer"
          >
            {workplace ? 'เปลี่ยน' : '+ ตั้งค่าที่ทำงาน'}
          </button>
        </div>
      </div>

      <div className="compare-matrix">
        <div className="compare-grid compare-grid-refined">
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
                <div className="label-top-section">
                  <div className="spacer-card">
                    <h3 className="mb-4">ข้อมูลโครงการ</h3>
                    <button className="btn btn-secondary w-full text-sm" onClick={() => navigate('/search')}><Plus size={14} /> เพิ่มโครงการ</button>
                  </div>
                  
                  <div className="content-tabs mb-2 flex flex-wrap gap-1">
                    {['ข้อมูลทั่วไป', 'การเดินทางจากที่ทำงาน', 'สิ่งอำนวยความสะดวก', 'การผ่อนชำระ'].map(tab => (
                      <button 
                        key={tab} 
                        className={`tab text-xs px-2 py-1.5 rounded-lg flex-1 font-semibold transition-all ${
                          activeTab === tab ? 'bg-primary text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                        }`} 
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
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
                  {activeTab === 'การเดินทางจากที่ทำงาน' && (
                    <>
                      <div className="metric-row font-semibold">ที่ทำงานเป้าหมาย</div>
                      <div className="metric-row font-semibold">ระยะทางถึงที่ทำงาน (กม.)</div>
                      <div className="metric-row font-semibold">🚗 เวลาขับรถโดยประมาณ</div>
                      <div className="metric-row font-semibold">🚇 เวลารถไฟฟ้าโดยประมาณ</div>
                      <div className="metric-row font-semibold">ระดับความสะดวก</div>
                      <div className="metric-row font-semibold">เปิดแผนที่นำทาง</div>
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
              {compareList.map((prop, index) => {
                const commute = commutes[index];
                const isFastest = index === fastestPropIndex;

                return (
                  <div key={prop.id} className="compare-column prop-col">
                    <div className="prop-card-compare relative">
                      <span className="badge absolute-badge-top">{index + 1}</span>
                      <button className="remove-btn" onClick={() => removeFromCompare(prop.id)}><X size={14} /></button>
                      <img src={prop.image ? (Array.isArray(prop.image) ? prop.image[0] : (typeof prop.image === 'string' ? prop.image.split(',')[0] : '')) : ''} alt={prop.name} />
                      <div className="p-4">
                        {isFastest && (
                          <div className="mb-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            🏆 ใกล้ที่ทำงานที่สุด
                          </div>
                        )}
                        <h4>{prop.name}</h4>
                        <p className="text-xs text-light mb-2">{prop.developer}</p>
                        <div className="text-sm"><span className="text-primary font-semibold">เริ่มต้น {prop.price} ลบ.</span></div>
                        <div className="text-xs text-light mt-1">
                          {[
                            prop.bedrooms && `${typeof prop.bedrooms === 'string' ? prop.bedrooms.replace(/beds?|bedrooms?|ห้องนอน/gi, '').trim() : prop.bedrooms} ห้องนอน`,
                            prop.bathrooms && `${typeof prop.bathrooms === 'string' ? prop.bathrooms.replace(/baths?|bathrooms?|ห้องน้ำ/gi, '').trim() : prop.bathrooms} ห้องน้ำ`,
                          ].filter(Boolean).join(' ') || prop.roomType || 'ไม่ระบุ'} | {prop.size} {prop.size && !String(prop.size).includes('ตร') ? 'ตร.ม.' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="metrics-list text-center">
                      {activeTab === 'ข้อมูลทั่วไป' && (
                        <>
                          <div className="metric-row">
                            {(prop.type === 'บ้าน' || prop.type === 'ทาวน์โฮม') && ['High Rise', 'Low Rise', 'Mixed Use'].includes(prop.projectType) 
                              ? prop.type 
                              : prop.projectType}
                          </div>
                          <div className="metric-row">{prop.floors}{String(prop.floors).includes('ชั้น') ? '' : ' ชั้น'}</div>
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

                      {activeTab === 'การเดินทางจากที่ทำงาน' && (
                        <>
                          {workplace ? (
                            <>
                              <div className="metric-row text-xs font-bold text-slate-800 truncate px-2" title={workplace.name}>
                                {workplace.name}
                              </div>
                              <div className="metric-row font-black text-slate-900 text-sm">
                                {commute ? `${commute.distanceKm} กม.` : 'ไม่มีข้อมูลพิกัด'}
                              </div>
                              <div className="metric-row font-bold text-blue-600">
                                {commute ? `🚗 ~${commute.driveMinutes} นาที` : '-'}
                              </div>
                              <div className="metric-row font-bold text-indigo-600">
                                {commute ? `🚇 ~${commute.transitMinutes} นาที` : '-'}
                              </div>
                              <div className="metric-row">
                                {commute ? (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${commute.tierColor}`}>
                                    {commute.tier}
                                  </span>
                                ) : '-'}
                              </div>
                              <div className="metric-row flex justify-center">
                                {commute?.googleMapsUrl ? (
                                  <a
                                    href={commute.googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold transition-colors border border-blue-200"
                                  >
                                    <Navigation size={12} /> นำทาง
                                  </a>
                                ) : '-'}
                              </div>
                            </>
                          ) : (
                            <div className="col-span-full py-8 text-center">
                              <p className="text-xs text-slate-500 mb-2">ยังไม่ได้ระบุที่ทำงาน</p>
                              <button
                                onClick={() => setIsWorkplaceModalOpen(true)}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm cursor-pointer"
                              >
                                + ระบุที่ทำงาน
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      {activeTab === 'สิ่งอำนวยความสะดวก' && (
                        <>
                          <div className="metric-row">{prop.facilities?.some(f => typeof f === 'string' && (f.includes('สระว่ายน้ำ') || f.toLowerCase().includes('swimming') || f.toLowerCase().includes('pool'))) ? <Check size={16} color="green" /> : <X size={16} color="red" />}</div>
                          <div className="metric-row">{prop.facilities?.some(f => typeof f === 'string' && (f.includes('ฟิตเนส') || f.toLowerCase().includes('fitness') || f.toLowerCase().includes('gym'))) ? <Check size={16} color="green" /> : <X size={16} color="red" />}</div>
                          <div className="metric-row">{prop.facilities?.some(f => typeof f === 'string' && (f.toLowerCase().includes('co-working') || f.includes('โคเวิร์ค') || f.includes('ทำงาน'))) ? <Check size={16} color="green" /> : <X size={16} color="red" />}</div>
                          <div className="metric-row">{prop.facilities?.some(f => typeof f === 'string' && (f.includes('สวน') || f.toLowerCase().includes('garden') || f.toLowerCase().includes('park'))) ? <Check size={16} color="green" /> : <X size={16} color="red" />}</div>
                        </>
                      )}

                      {activeTab === 'การผ่อนชำระ' && (
                        <>
                          <div className="metric-row">10,000 - 50,000 บาท</div>
                          <div className="metric-row">
                            {prop.price ? `${Math.round((prop.price < 1000 ? prop.price * 1000000 : prop.price) * 0.10 / 24).toLocaleString()} บาท/งวด` : '-'}
                          </div>
                          <div className="metric-row">
                            {prop.price ? `${Math.round((prop.price < 1000 ? prop.price * 1000000 : prop.price) * 0.90).toLocaleString()} บาท` : '-'}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {compareList.length > 0 && (
        <div className="ai-recommendation mt-12 bg-secondary p-8 rounded-2xl shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-primary text-white p-3 rounded-full"><CheckCircle2 size={24} /></div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Recommendation (สรุปคำแนะนำการเลือกซื้อ)</h3>
              <p className="text-light text-sm">จากการวิเคราะห์ข้อมูลโครงการที่คุณเลือกเปรียบเทียบ นี่คือคำแนะนำของเรา</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="recommend-card bg-white p-4 rounded-xl border-l-4 border-primary shadow-sm">
              <h4 className="text-sm font-semibold mb-2">🏆 คุ้มค่าที่สุด (Best Value)</h4>
              <p className="text-primary font-bold mb-1">{compareList[0]?.name}</p>
              <p className="text-xs text-light">ราคาเริ่มต้นต่ำสุดที่ {compareList[0]?.price} ลบ. และได้พื้นที่ส่วนกลางครบครัน ตอบโจทย์การลงทุนและอยู่อาศัยจริง</p>
            </div>

            {compareList.length > 1 && (
              <div className="recommend-card bg-white p-4 rounded-xl border-l-4 border-accent shadow-sm">
                <h4 className="text-sm font-semibold mb-2">🚇 เดินทางสะดวกที่สุด (Best Transit)</h4>
                <p className="text-accent font-bold mb-1">{compareList[1]?.name}</p>
                <p className="text-xs text-light">ห่างจาก {compareList[1]?.station || 'สถานีรถไฟฟ้า'} เพียง {compareList[1]?.distanceToStation || 'ไม่ไกล'} สะดวกสบายที่สุดสำหรับคนใช้รถไฟฟ้าเป็นหลัก</p>
              </div>
            )}

            {workplace && fastestPropIndex >= 0 && (
              <div className="recommend-card bg-white p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                <h4 className="text-sm font-semibold mb-2 text-emerald-700">⚡ ใกล้ที่ทำงานที่สุด (Fastest Commute)</h4>
                <p className="text-emerald-700 font-bold mb-1">{compareList[fastestPropIndex]?.name}</p>
                <p className="text-xs text-light">
                  ใกล้ {workplace.name} ที่สุด เพียง {commutes[fastestPropIndex]?.distanceKm} กม. (ขับรถ ~{commutes[fastestPropIndex]?.driveMinutes} นาที) ช่วยประหยัดเวลาเดินทางไป-กลับต่อวันได้มากที่สุด
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
