import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../PropertiesContext';
import { supabase } from '../supabaseClient';
import {
  Plus, Building2, Home as HomeIcon, LayoutList, Edit, Trash2,
  Layers, Search, X, Save, ChevronDown, ChevronUp, TrendingUp, Eye, Copy, Send
} from 'lucide-react';

// ── Unit Types Manager Modal ────────────────────────────────────────────────
function UnitTypesModal({ prop, onClose, onSaved }) {
  const emptyType = { name: '', price: '', size: '', bedrooms: '', bathrooms: '', parking: '', roomType: '', landSize: '', planImages: [], roomImages: [], useProjectFacilities: true, facilities: [] };
  const [units, setUnits] = useState(
    prop.unitTypes?.length ? prop.unitTypes.map(u => ({ ...emptyType, ...u })) : [{ ...emptyType }]
  );
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(0);

  const handleChange = (idx, field, value) =>
    setUnits(prev => prev.map((u, i) => i === idx ? { ...u, [field]: value } : u));

  const addUnit = () => { setUnits(prev => [...prev, { ...emptyType }]); setExpanded(units.length); };
  const removeUnit = (idx) => { setUnits(prev => prev.filter((_, i) => i !== idx)); setExpanded(Math.max(0, expanded - 1)); };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Auto-calculate the minimum price from the units
      const validUnits = units.filter(u => u.price && !isNaN(parseFloat(u.price)));
      let minPrice = prop.price;
      if (validUnits.length > 0) {
        const minPriceUnit = validUnits.reduce((min, p) => parseFloat(p.price) < parseFloat(min.price) ? p : min, validUnits[0]);
        minPrice = parseFloat(minPriceUnit.price);
      }

      const { error } = await supabase.from('properties')
        .update({ 
          unitTypes: units,
          price: minPrice 
        })
        .eq('id', prop.id);
        
      if (error) throw error;
      onSaved();
      onClose();
    } catch (e) { alert('เกิดข้อผิดพลาด: ' + e.message); }
    setSaving(false);
  };

  const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.625rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', background: '#fafafa' };
  const labelStyle = { fontSize: '0.68rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: '1.5rem', width: '100%', maxWidth: '700px', maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 80px rgba(0,0,0,0.25)' }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', borderRadius: '1.5rem 1.5rem 0 0' }}>
          <div>
            <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>จัดการแบบห้อง / แบบบ้าน</p>
            <h3 style={{ margin: '0.15rem 0 0', fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>{prop.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {units.map((unit, idx) => (
            <div key={idx} style={{ border: `1.5px solid ${expanded === idx ? '#f4c5a8' : '#e2e8f0'}`, borderRadius: '1rem', overflow: 'hidden', transition: 'border-color 0.2s' }}>
              <div onClick={() => setExpanded(expanded === idx ? -1 : idx)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', background: expanded === idx ? '#fef7f0' : '#f8fafc', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>{idx + 1}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{unit.name || `แบบที่ ${idx + 1}`}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>
                      {(unit.price !== null && unit.price !== '') ? `${unit.price} ล้านบาท` : 'สอบถามราคา'}{unit.bedrooms ? ` • ${unit.bedrooms} Bed` : ''}{unit.size ? ` • ${unit.size} ตร.ม.` : ''}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {units.length > 1 && <button onClick={e => { e.stopPropagation(); removeUnit(idx); }} style={{ background: '#fee2e2', border: 'none', borderRadius: '0.5rem', padding: '0.2rem 0.6rem', color: '#dc2626', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700 }}>ลบ</button>}
                  {expanded === idx ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                </div>
              </div>

              {expanded === idx && (
                <div style={{ padding: '1rem', background: '#fff', borderTop: '1px solid #fde8d5' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                      <div>
                        <label style={labelStyle}>การแสดงราคา</label>
                        <select 
                          style={inputStyle}
                          value={(unit.price === '' || unit.price === null) ? 'contact' : 'specify'}
                          onChange={e => {
                            if (e.target.value === 'contact') handleChange(idx, 'price', '');
                            else handleChange(idx, 'price', '0');
                          }}
                        >
                          <option value="specify">ระบุราคาเป็นตัวเลข</option>
                          <option value="contact">แสดงเป็น "สอบถามราคา"</option>
                        </select>
                      </div>
                      {(unit.price !== '' && unit.price !== null) && (
                        <div>
                          <label style={labelStyle}>ราคา (ล้านบาท)</label>
                          <input type="number" step="0.01" value={unit.price || ''} onChange={e => handleChange(idx, 'price', e.target.value)} placeholder="เช่น 3.5" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                      )}
                    </div>
                    {[
                      { label: 'ชื่อแบบ', field: 'name', placeholder: 'เช่น แบบ A, Type 1' },
                      { label: 'พื้นที่ใช้สอย (ตร.ม.)', field: 'size', placeholder: 'เช่น 150' },
                      { label: 'ขนาดที่ดิน (ตร.วา)', field: 'landSize', placeholder: 'เช่น 50' },
                      { label: 'ความกว้าง (ม.)', field: 'width', placeholder: 'เช่น 5.5' },
                      { label: 'ความลึก (ม.)', field: 'depth', placeholder: 'เช่น 10' },
                      { label: 'ห้องนอน', field: 'bedrooms', placeholder: 'เช่น 3' },
                      { label: 'ห้องน้ำ', field: 'bathrooms', placeholder: 'เช่น 2' },
                      { label: 'ที่จอดรถ', field: 'parking', placeholder: 'เช่น 2' },
                      { label: 'ห้องอเนกประสงค์', field: 'multipurpose', placeholder: 'เช่น 1' },
                      { label: 'จุดเด่นพิเศษ', field: 'special', placeholder: 'เช่น ระเบียงกว้าง' },
                      { label: 'รูปแบบห้อง', field: 'roomType', placeholder: 'เช่น 2 Bed' },
                    ].map(({ label, field, placeholder, type }) => (
                      <div key={field}>
                        <label style={labelStyle}>{label}</label>
                        <input type={type || 'text'} value={unit[field] || ''} onChange={e => handleChange(idx, field, e.target.value)} placeholder={placeholder} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <button onClick={addUnit} style={{ width: '100%', padding: '0.75rem', border: '2px dashed #cbd5e1', borderRadius: '1rem', background: 'transparent', color: '#64748b', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> เพิ่มแบบใหม่
          </button>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', background: '#fafafa', borderRadius: '0 0 1.5rem 1.5rem' }}>
          <button onClick={onClose} style={{ padding: '0.625rem 1.25rem', border: '1.5px solid #e2e8f0', borderRadius: '0.75rem', background: '#fff', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>ยกเลิก</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '0.625rem 1.5rem', border: 'none', borderRadius: '0.75rem', background: 'var(--primary)', color: '#fff', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}>
            <Save size={15} /> {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { properties, deleteProperty, fetchProperties, updateProperty } = useProperties();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ทั้งหมด');
  const [managingProp, setManagingProp] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโครงการนี้? (ไม่สามารถกู้คืนได้)')) {
      await deleteProperty(id);
    }
  };

  const handlePublish = async (prop) => {
    if (window.confirm(`คุณต้องการเผยแพร่โครงการ "${prop.name}" ใช่หรือไม่?\n(สถานะจะเปลี่ยนเป็น "เปิด Presale" และแสดงให้ผู้ใช้งานเห็น)`)) {
      const result = await updateProperty(prop.id, { ...prop, status: 'เปิด Presale' });
      if (result === true || result?.success) {
        alert('เผยแพร่โครงการเรียบร้อยแล้ว!');
        if (fetchProperties) fetchProperties();
      } else {
        alert('เกิดข้อผิดพลาดในการเผยแพร่โครงการ');
      }
    }
  };

  const condoCount = properties.filter(p => p.type === 'คอนโด').length;
  const houseCount = properties.filter(p => p.type === 'บ้าน' || p.type === 'ทาวน์โฮม').length;
  const seniorCount = properties.filter(p => p.type === 'Senior Living').length;

  const filtered = properties.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.developer?.toLowerCase().includes(search.toLowerCase()) || p.province?.includes(search);
    const matchType = typeFilter === 'ทั้งหมด' || p.type === typeFilter;
    return matchSearch && matchType;
  });

  const statusStyle = (status) => {
    if (status === 'พร้อมอยู่') return { background: '#dcfce7', color: '#16a34a' };
    if (status === 'เปิด Presale') return { background: '#fef9c3', color: '#ca8a04' };
    if (status === 'ฉบับร่าง') return { background: '#f1f5f9', color: '#64748b' };
    return { background: '#e0f2fe', color: '#0284c7' };
  };

  const typeStyle = (type) => {
    if (type === 'คอนโด') return { background: '#f5f3ff', color: '#7c3aed' };
    if (type === 'Senior Living') return { background: '#fffbeb', color: '#b45309' };
    return { background: '#ecfdf5', color: '#059669' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 900, color: '#0f172a' }}>
              🏠 Admin <span style={{ color: 'var(--primary)' }}>Dashboard</span>
            </h1>
            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.875rem' }}>จัดการข้อมูลโครงการอสังหาริมทรัพย์ทั้งหมด</p>
          </div>
          <Link to="/admin/add" style={{ background: 'var(--primary)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(211,135,100,0.35)', fontSize: '0.875rem' }}>
            <Plus size={18} /> เพิ่มโครงการใหม่
          </Link>
        </div>

        {/* ── Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'โครงการทั้งหมด', value: properties.length, icon: <LayoutList size={22} />, iconColor: '#6366f1', iconBg: '#eef2ff' },
            { label: 'ผู้เข้าชมทั้งหมด (คน)', value: '12,450', icon: <Eye size={22} />, iconColor: '#ec4899', iconBg: '#fce7f3' },
            { label: 'บ้านและทาวน์โฮม', value: houseCount, icon: <HomeIcon size={22} />, iconColor: '#10b981', iconBg: '#ecfdf5' },
            { label: 'คอนโดมิเนียม', value: condoCount, icon: <Building2 size={22} />, iconColor: '#8b5cf6', iconBg: '#f5f3ff' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.25rem', border: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '0.875rem', background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.iconColor, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ margin: 0, fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Analytics Chart (Mock) */}
        <div style={{ background: '#fff', borderRadius: '1.5rem', border: '1px solid #f1f5f9', padding: '1.5rem', marginBottom: '1.75rem', boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} color="var(--primary)" /> คำค้นหายอดฮิต (Top Searches)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { term: 'กรุงเทพมหานคร', count: 4200, width: '100%' },
              { term: 'ทาวน์โฮม', count: 3150, width: '75%' },
              { term: 'บ้านแฝด', count: 2800, width: '66%' },
              { term: 'ใกล้รถไฟฟ้า', count: 1950, width: '46%' },
              { term: 'นนทบุรี', count: 1200, width: '28%' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '100px', fontSize: '0.875rem', color: '#475569', fontWeight: 600 }}>{item.term}</div>
                <div style={{ flex: 1, background: '#f1f5f9', height: '24px', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ width: item.width, background: 'var(--primary)', height: '100%', borderRadius: '12px', transition: 'width 1s ease-in-out' }}></div>
                </div>
                <div style={{ width: '50px', textAlign: 'right', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Table Card */}
        <div style={{ background: '#fff', borderRadius: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 1px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f8fafc', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
            <h3 style={{ margin: 0, fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
              รายการโครงการ <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8' }}>({filtered.length} โครงการ)</span>
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                <input placeholder="ค้นหาโครงการ..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2rem', paddingRight: '0.75rem', paddingTop: '0.45rem', paddingBottom: '0.45rem', border: '1.5px solid #e2e8f0', borderRadius: '0.625rem', fontSize: '0.8rem', outline: 'none', width: 200, background: '#fff' }} />
              </div>
              {['ทั้งหมด', 'คอนโด', 'บ้าน', 'ทาวน์โฮม', 'Senior Living'].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} style={{ padding: '0.375rem 0.875rem', border: '1.5px solid', borderColor: typeFilter === t ? 'var(--primary)' : '#e2e8f0', borderRadius: '2rem', fontSize: '0.72rem', fontWeight: 700, background: typeFilter === t ? 'var(--primary)' : '#fff', color: typeFilter === t ? '#fff' : '#64748b', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['โครงการ', 'ประเภท', 'ราคาเริ่มต้น', 'จังหวัด', 'สถานะ', 'Types', 'จัดการ'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((prop, idx) => (
                  <tr key={prop.id || idx} style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    {/* Project */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={prop.image ? prop.image.split(',')[0] : ''} alt={prop.name} style={{ width: 44, height: 44, borderRadius: '0.75rem', objectFit: 'cover', flexShrink: 0, background: '#f1f5f9', border: '1px solid #f1f5f9' }} onError={e => e.target.style.display = 'none'} />
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.875rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.name}</p>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>{prop.developer}</p>
                        </div>
                      </div>
                    </td>
                    {/* Type */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ padding: '0.2rem 0.7rem', borderRadius: '2rem', fontSize: '0.68rem', fontWeight: 700, ...typeStyle(prop.type) }}>{prop.type}</span>
                    </td>
                    {/* Price */}
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: prop.price ? '#0f172a' : '#94a3b8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {prop.price ? `${prop.price} ลบ.` : 'ติดต่อสอบถาม'}
                    </td>
                    {/* Province */}
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{prop.province}</td>
                    {/* Status */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ padding: '0.2rem 0.7rem', borderRadius: '2rem', fontSize: '0.68rem', fontWeight: 700, ...statusStyle(prop.status), whiteSpace: 'nowrap' }}>{prop.status || '-'}</span>
                    </td>
                    {/* Unit Types Button */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <button onClick={() => setManagingProp(prop)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', background: '#fff', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = '#fef7f0'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = '#fff'; }}
                      >
                        <Layers size={12} /> {prop.unitTypes?.length || 0} Type
                      </button>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                        {prop.status === 'ฉบับร่าง' && (
                          <button onClick={() => handlePublish(prop)} title="เผยแพร่ (Publish)" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', background: '#4f46e5', color: '#fff', textDecoration: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}><Send size={12} /> เผยแพร่</button>
                        )}
                        <Link to={`/admin/add`} state={{ duplicateFrom: prop }} title="คัดลอก (Copy)" style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', background: '#f8fafc', color: '#64748b', textDecoration: 'none', border: '1px solid #e2e8f0', flexShrink: 0 }}><Copy size={14} /></Link>
                        <Link to={`/admin/edit/${prop.id}`} title="แก้ไข" style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', background: '#eff6ff', color: '#3b82f6', textDecoration: 'none', border: '1px solid #dbeafe', flexShrink: 0 }}><Edit size={14} /></Link>
                        <Link to={`/property/${prop.id}`} target="_blank" title="ดูหน้าเว็บ" style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', background: '#f0fdf4', color: '#22c55e', textDecoration: 'none', border: '1px solid #dcfce7', flexShrink: 0 }}><Eye size={14} /></Link>
                        <button onClick={() => handleDelete(prop.id)} title="ลบ" style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', cursor: 'pointer', flexShrink: 0 }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <LayoutList size={48} style={{ margin: '0 auto 1rem', display: 'block', color: '#e2e8f0' }} />
                <p style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 0.25rem' }}>ไม่พบโครงการ</p>
                <p style={{ fontSize: '0.8rem', margin: 0 }}>ลองเปลี่ยน filter หรือเพิ่มโครงการใหม่</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unit Types Modal */}
      {managingProp && (
        <UnitTypesModal
          prop={managingProp}
          onClose={() => setManagingProp(null)}
          onSaved={() => { if (fetchProperties) fetchProperties(); }}
        />
      )}
    </div>
  );
}
