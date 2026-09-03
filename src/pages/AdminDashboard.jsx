import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../PropertiesContext';
import { supabase } from '../supabaseClient';
import {
  Plus, Building2, Home as HomeIcon, LayoutList, Edit, Trash2,
  Layers, Search, X, Save, ChevronDown, ChevronUp, TrendingUp, Eye, EyeOff, Copy, Send, Star, Crown, CheckCircle2, FileEdit, ThumbsUp,
  Download, RefreshCw, Filter, ArrowUpDown, Globe, Shield, Sparkles, CheckSquare, Square, BarChart3, Settings, HelpCircle, ExternalLink, ChevronLeft, ChevronRight, Check
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
          unit_types: units,
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
  const { properties, deleteProperty, fetchProperties, updateProperty, heroImage, setHeroImage } = useProperties();
  
  // Navigation & Workspace Tabs
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'developers' | 'analytics' | 'system'
  
  // Search, Filters, Sorting & Pagination
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ทั้งหมด');
  const [developerFilter, setDeveloperFilter] = useState('ทั้งหมด');
  const [statusFilter, setStatusFilter] = useState('ทั้งหมด');
  const [tierFilter, setTierFilter] = useState('ทั้งหมด');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'units_desc'
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals & Selection State
  const [managingProp, setManagingProp] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [seoModalOpen, setSeoModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Analytics State
  const [totalViews, setTotalViews] = useState(0);
  const [topSearches, setTopSearches] = useState([]);
  const [dailyViews, setDailyViews] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: dailyData, error: dailyError } = await supabase
          .from('daily_page_views')
          .select('*')
          .order('view_date', { ascending: false })
          .limit(7);
        if (!dailyError && dailyData) {
          setDailyViews(dailyData.reverse());
        }

        const { data: viewsData, error: viewsError } = await supabase
          .from('page_views')
          .select('views');
        if (!viewsError && viewsData) {
          const sum = viewsData.reduce((acc, curr) => acc + (Number(curr.views) || 0), 0);
          setTotalViews(sum);
        }

        const { data: searchData, error: searchError } = await supabase
          .from('search_stats')
          .select('*')
          .order('count', { ascending: false })
          .limit(5);
        if (!searchError && searchData) {
          setTopSearches(searchData);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  // Developer List with Counts
  const developerList = useMemo(() => {
    const counts = {};
    properties.forEach(p => {
      const dev = p.developer?.trim() || 'ไม่ระบุผู้พัฒนา';
      counts[dev] = (counts[dev] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [properties]);

  // KPI Metrics
  const condoCount = useMemo(() => properties.filter(p => p.type === 'คอนโด').length, [properties]);
  const houseCount = useMemo(() => properties.filter(p => p.type === 'บ้าน' || p.type === 'ทาวน์โฮม').length, [properties]);
  const draftCount = useMemo(() => properties.filter(p => p.status === 'ฉบับร่าง').length, [properties]);
  const publishedCount = properties.length - draftCount;
  
  const superCount = useMemo(() => properties.filter(p => p.package_tier === 'super').length, [properties]);
  const sponsoredCount = useMemo(() => properties.filter(p => p.package_tier === 'sponsored').length, [properties]);
  const premiumCount = useMemo(() => properties.filter(p => p.package_tier === 'premium').length, [properties]);

  // Filtering & Sorting
  const filteredProperties = useMemo(() => {
    let result = properties.filter(p => {
      const q = search.toLowerCase().trim();
      const matchSearch = !q || 
        p.name?.toLowerCase().includes(q) || 
        p.developer?.toLowerCase().includes(q) || 
        p.province?.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q) ||
        p.station?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q);
      
      const matchType = typeFilter === 'ทั้งหมด' || p.type === typeFilter;
      
      const devName = p.developer?.trim() || 'ไม่ระบุผู้พัฒนา';
      const matchDeveloper = developerFilter === 'ทั้งหมด' || devName === developerFilter;
      
      const matchStatus = statusFilter === 'ทั้งหมด' || 
        (statusFilter === 'เผยแพร่แล้ว' && p.status !== 'ฉบับร่าง') ||
        (statusFilter === 'ฉบับร่าง' && p.status === 'ฉบับร่าง') ||
        p.status === statusFilter;

      const matchTier = tierFilter === 'ทั้งหมด' || 
        (tierFilter === 'standard' && (!p.package_tier || p.package_tier === 'standard')) ||
        p.package_tier === tierFilter;

      return matchSearch && matchType && matchDeveloper && matchStatus && matchTier;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'price_asc') return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      if (sortBy === 'price_desc') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '', 'th');
      if (sortBy === 'units_desc') return (b.unitTypes?.length || 0) - (a.unitTypes?.length || 0);
      // 'newest' default
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    return result;
  }, [properties, search, typeFilter, developerFilter, statusFilter, tierFilter, sortBy]);

  // Pagination Slice
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredProperties.length / pageSize) || 1;
  const paginatedProperties = useMemo(() => {
    if (pageSize === 'all') return filteredProperties;
    const start = (currentPage - 1) * pageSize;
    return filteredProperties.slice(start, start + pageSize);
  }, [filteredProperties, currentPage, pageSize]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, developerFilter, statusFilter, tierFilter, pageSize]);

  // Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedProperties.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedProperties.map(p => p.id)));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Force Refresh Trigger
  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (fetchProperties) await fetchProperties(true);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Single Actions
  const handleDelete = async (id, name) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบโครงการ "${name || id}"?\n(การกระทำนี้ไม่สามารถย้อนกลับได้)`)) {
      await deleteProperty(id);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleQuickStatusChange = async (prop, newStatus) => {
    if (prop.status === newStatus) return;
    const result = await updateProperty(prop.id, { ...prop, status: newStatus });
    if (result === true || result?.success) {
      if (fetchProperties) fetchProperties();
    } else {
      alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    }
  };

  const handleChangeTier = async (prop, newTier) => {
    const result = await updateProperty(prop.id, { ...prop, package_tier: newTier });
    if (result === true || result?.success) {
      if (fetchProperties) fetchProperties();
    } else {
      alert('เกิดข้อผิดพลาดในการเปลี่ยนเทียร์');
    }
  };

  // Bulk Actions
  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIds.size === 0) return;
    const actionName = newStatus === 'ฉบับร่าง' ? 'ซ่อนเป็นฉบับร่าง' : `เปลี่ยนสถานะเป็น "${newStatus}"`;
    if (!window.confirm(`ยืนยันการ${actionName} สำหรับ ${selectedIds.size} โครงการที่เลือกไว้?`)) return;

    setBulkLoading(true);
    try {
      const idsArray = Array.from(selectedIds);
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .in('id', idsArray);

      if (error) throw error;
      alert(`อัปเดต ${selectedIds.size} โครงการเรียบร้อยแล้ว!`);
      setSelectedIds(new Set());
      if (fetchProperties) fetchProperties(true);
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการดำเนินการ: ' + e.message);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkTierChange = async (newTier) => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`ยืนยันการตั้งค่าเทียร์เป็น "${newTier}" ให้กับ ${selectedIds.size} โครงการที่เลือก?`)) return;

    setBulkLoading(true);
    try {
      const idsArray = Array.from(selectedIds);
      const { error } = await supabase
        .from('properties')
        .update({ package_tier: newTier })
        .in('id', idsArray);

      if (error) throw error;
      alert(`ปรับเทียร์ ${selectedIds.size} โครงการเรียบร้อยแล้ว!`);
      setSelectedIds(new Set());
      if (fetchProperties) fetchProperties(true);
    } catch (e) {
      alert('เกิดข้อผิดพลาด: ' + e.message);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`⚠️ คำเตือน: คุณต้องการลบ ${selectedIds.size} โครงการที่เลือกออกจากฐานข้อมูลอย่างถาวรใช่หรือไม่?`)) return;

    setBulkLoading(true);
    try {
      const idsArray = Array.from(selectedIds);
      const { error } = await supabase
        .from('properties')
        .delete()
        .in('id', idsArray);

      if (error) throw error;
      alert(`ลบ ${selectedIds.size} โครงการเรียบร้อยแล้ว`);
      setSelectedIds(new Set());
      if (fetchProperties) fetchProperties(true);
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการลบ: ' + e.message);
    } finally {
      setBulkLoading(false);
    }
  };

  // Export Data (JSON & CSV)
  const exportData = (format = 'json') => {
    const dataToExport = filteredProperties.map(p => ({
      id: p.id,
      name: p.name,
      developer: p.developer,
      type: p.type,
      price: p.price,
      status: p.status,
      province: p.province,
      district: p.district,
      station: p.station || '',
      package_tier: p.package_tier || 'standard',
      total_units: p.total_units || '',
      unit_types_count: p.unitTypes?.length || 0,
      created_at: p.created_at || ''
    }));

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `findmyhome_properties_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } else {
      const headers = ['ID', 'ชื่อโครงการ', 'ผู้พัฒนา', 'ประเภท', 'ราคาเริ่มต้น (ลบ.)', 'สถานะ', 'จังหวัด', 'อำเภอ/เขต', 'สถานี', 'เทียร์', 'จำนวนยูนิตย่อย', 'วันที่สร้าง'];
      const rows = dataToExport.map(d => [
        `"${d.id}"`, `"${d.name}"`, `"${d.developer}"`, `"${d.type}"`, d.price, `"${d.status}"`,
        `"${d.province}"`, `"${d.district}"`, `"${d.station}"`, `"${d.package_tier}"`, d.unit_types_count, `"${d.created_at}"`
      ]);
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `findmyhome_properties_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const statusBadge = (status) => {
    if (status === 'พร้อมอยู่') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'เปิด Presale') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (status === 'กำลังก่อสร้าง') return 'bg-sky-50 text-sky-700 border-sky-200';
    if (status === 'ฉบับร่าง') return 'bg-slate-100 text-slate-600 border-slate-300';
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  const tierBadge = (tier) => {
    if (tier === 'super') return { label: '👑 Super', cls: 'bg-amber-500/10 text-amber-600 border-amber-300' };
    if (tier === 'sponsored') return { label: '⭐ Sponsored', cls: 'bg-blue-500/10 text-blue-600 border-blue-300' };
    if (tier === 'premium') return { label: '✅ Premium', cls: 'bg-orange-500/10 text-orange-600 border-orange-300' };
    return { label: 'Standard', cls: 'bg-slate-100 text-slate-500 border-slate-200' };
  };

  return (
    <div className="min-h-screen pb-24 text-slate-800">
      {/* ── Top Command Center Bar ── */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-20 shadow-xs px-4 sm:px-6 py-3">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Admin Management Suite
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              จัดการข้อมูลอสังหาริมทรัพย์ • สถิติ • SEO ครบวงจรในหน้าจอเดียว
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleForceRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              title="ดึงข้อมูลล่าสุดจาก Supabase"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-blue-600' : ''} />
              <span>รีเฟรช</span>
            </button>

            <button
              onClick={() => setSeoModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
              title="ดูสถานะ Sitemap และ AEO"
            >
              <Globe size={13} />
              <span>SEO</span>
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              title="เปลี่ยนภาพ Hero Banner"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>ภาพหน้าแรก</span>
            </button>

            <div className="relative group">
              <button
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              >
                <Download size={13} />
                <span>Export</span>
                <ChevronDown size={11} />
              </button>
              <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-xl py-1 hidden group-hover:block z-30">
                <button 
                  onClick={() => exportData('csv')}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-semibold"
                >
                  ดาวน์โหลด CSV
                </button>
                <button 
                  onClick={() => exportData('json')}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-semibold"
                >
                  ดาวน์โหลด JSON
                </button>
              </div>
            </div>

            <Link
              to="/admin/add"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
            >
              <Plus size={14} />
              <span>เพิ่มโครงการ</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 pt-4 pb-16">
        {/* ── KPI Interactive Metric Cards (Compact & Responsive) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2 mb-4">
          {[
            { 
              label: 'ทั้งหมด', 
              value: properties.length, 
              icon: <LayoutList size={15} />, 
              color: 'text-indigo-600', 
              bg: 'bg-indigo-50',
              active: typeFilter === 'ทั้งหมด' && statusFilter === 'ทั้งหมด' && tierFilter === 'ทั้งหมด',
              onClick: () => { setTypeFilter('ทั้งหมด'); setStatusFilter('ทั้งหมด'); setTierFilter('ทั้งหมด'); setDeveloperFilter('ทั้งหมด'); }
            },
            { 
              label: 'เผยแพร่แล้ว', 
              value: publishedCount, 
              icon: <CheckCircle2 size={15} />, 
              color: 'text-emerald-600', 
              bg: 'bg-emerald-50',
              active: statusFilter === 'เผยแพร่แล้ว',
              onClick: () => setStatusFilter(statusFilter === 'เผยแพร่แล้ว' ? 'ทั้งหมด' : 'เผยแพร่แล้ว')
            },
            { 
              label: 'ฉบับร่าง', 
              value: draftCount, 
              icon: <FileEdit size={15} />, 
              color: 'text-slate-600', 
              bg: 'bg-slate-100',
              active: statusFilter === 'ฉบับร่าง',
              onClick: () => setStatusFilter(statusFilter === 'ฉบับร่าง' ? 'ทั้งหมด' : 'ฉบับร่าง')
            },
            { 
              label: 'คอนโด', 
              value: condoCount, 
              icon: <Building2 size={15} />, 
              color: 'text-purple-600', 
              bg: 'bg-purple-50',
              active: typeFilter === 'คอนโด',
              onClick: () => setTypeFilter(typeFilter === 'คอนโด' ? 'ทั้งหมด' : 'คอนโด')
            },
            { 
              label: 'บ้าน & ทาวน์โฮม', 
              value: houseCount, 
              icon: <HomeIcon size={15} />, 
              color: 'text-teal-600', 
              bg: 'bg-teal-50',
              active: typeFilter === 'บ้าน',
              onClick: () => setTypeFilter(typeFilter === 'บ้าน' ? 'ทั้งหมด' : 'บ้าน')
            },
            { 
              label: 'Super Tier', 
              value: superCount, 
              icon: <Crown size={15} />, 
              color: 'text-amber-600', 
              bg: 'bg-amber-50',
              active: tierFilter === 'super',
              onClick: () => setTierFilter(tierFilter === 'super' ? 'ทั้งหมด' : 'super')
            },
            { 
              label: 'Sponsored', 
              value: sponsoredCount, 
              icon: <Star size={15} />, 
              color: 'text-blue-600', 
              bg: 'bg-blue-50',
              active: tierFilter === 'sponsored',
              onClick: () => setTierFilter(tierFilter === 'sponsored' ? 'ทั้งหมด' : 'sponsored')
            },
            { 
              label: 'ผู้เข้าชมรวม', 
              value: totalViews.toLocaleString(), 
              icon: <Eye size={15} />, 
              color: 'text-pink-600', 
              bg: 'bg-pink-50',
              active: activeTab === 'analytics',
              onClick: () => setActiveTab('analytics')
            },
          ].map((card, idx) => (
            <div
              key={idx}
              onClick={card.onClick}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                card.active 
                  ? 'bg-white border-blue-500 shadow-xs ring-2 ring-blue-400/20' 
                  : 'bg-white/90 border-slate-200/80 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">
                  {card.label}
                </span>
                <div className={`w-6 h-6 rounded-lg ${card.bg} ${card.color} flex items-center justify-center flex-shrink-0`}>
                  {card.icon}
                </div>
              </div>
              <div className="text-base font-black text-slate-900 leading-none">
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Primary Workspace Tabs ── */}
        <div className="flex items-center gap-1 border-b border-slate-200/80 mb-4 overflow-x-auto pb-px">
          {[
            { id: 'properties', label: 'ตารางจัดการโครงการ', icon: <LayoutList size={15} />, count: filteredProperties.length },
            { id: 'developers', label: 'จำแนกตามผู้พัฒนา', icon: <Building2 size={15} />, count: developerList.length },
            { id: 'analytics', label: 'สถิติการเข้าชม', icon: <BarChart3 size={15} /> },
            { id: 'system', label: 'ความปลอดภัย & SEO', icon: <Shield size={15} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB 1: PROPERTIES TABLE & CONTROLS ── */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden w-full">
            {/* Filter & Toolbar Area */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
              {/* Row 1: Search & Dropdowns */}
              <div className="flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ค้นหาชื่อ, บริษัท, ทำเล, สถานี, ID..."
                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Developer Dropdown */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1">
                    <Building2 size={13} className="text-slate-400" />
                    <select
                      value={developerFilter}
                      onChange={(e) => setDeveloperFilter(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer max-w-[130px]"
                    >
                      <option value="ทั้งหมด">ทุกบริษัท ({properties.length})</option>
                      {developerList.map(([dev, count]) => (
                        <option key={dev} value={dev}>{dev} ({count})</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                    >
                      <option value="ทั้งหมด">ทุกสถานะ</option>
                      <option value="เผยแพร่แล้ว">เผยแพร่แล้ว ({publishedCount})</option>
                      <option value="ฉบับร่าง">ฉบับร่าง ({draftCount})</option>
                      <option value="เปิด Presale">เปิด Presale</option>
                      <option value="พร้อมอยู่">พร้อมอยู่</option>
                    </select>
                  </div>

                  {/* Tier Dropdown */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1">
                    <select
                      value={tierFilter}
                      onChange={(e) => setTierFilter(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                    >
                      <option value="ทั้งหมด">ทุกเทียร์</option>
                      <option value="super">👑 Super</option>
                      <option value="sponsored">⭐ Sponsored</option>
                      <option value="premium">✅ Premium</option>
                      <option value="standard">Standard</option>
                    </select>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1">
                    <ArrowUpDown size={13} className="text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                    >
                      <option value="newest">ล่าสุด</option>
                      <option value="price_asc">ราคา ต่ำ➜สูง</option>
                      <option value="price_desc">ราคา สูง➜ต่ำ</option>
                      <option value="name_asc">ชื่อ ก-ฮ</option>
                      <option value="units_desc">ยูนิตมากสุด</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2: Type Pills & Reset */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-200/60">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 mr-1 uppercase">ประเภท:</span>
                  {['ทั้งหมด', 'คอนโด', 'บ้าน', 'ทาวน์โฮม'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold transition-colors ${
                        typeFilter === t
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {(search || typeFilter !== 'ทั้งหมด' || developerFilter !== 'ทั้งหมด' || statusFilter !== 'ทั้งหมด' || tierFilter !== 'ทั้งหมด') && (
                  <button
                    onClick={() => { setSearch(''); setTypeFilter('ทั้งหมด'); setDeveloperFilter('ทั้งหมด'); setStatusFilter('ทั้งหมด'); setTierFilter('ทั้งหมด'); }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <X size={12} /> ล้างตัวกรอง
                  </button>
                )}
              </div>
            </div>

            {/* Streamlined Table (5 Proportional Columns - ZERO Horizontal Scroll) */}
            <div className="w-full">
              <table className="w-full text-left text-xs border-collapse table-auto">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={paginatedProperties.length > 0 && selectedIds.size === paginatedProperties.length}
                        onChange={toggleSelectAll}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-3">โครงการ & ผู้พัฒนา</th>
                    <th className="p-3 w-36">ราคา / ยูนิต</th>
                    <th className="p-3 w-36">สถานะ</th>
                    <th className="p-3 w-32">แพ็กเกจเทียร์</th>
                    <th className="p-3 w-28 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedProperties.map((prop) => {
                    const isSelected = selectedIds.has(prop.id);
                    const tierInfo = tierBadge(prop.package_tier);
                    const imgUrl = prop.image ? (Array.isArray(prop.image) ? prop.image[0] : (typeof prop.image === 'string' ? prop.image.split(',')[0] : '')) : '';

                    return (
                      <tr 
                        key={prop.id} 
                        className={`hover:bg-blue-50/40 transition-colors ${isSelected ? 'bg-blue-50/70' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="p-3 text-center align-middle">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(prop.id)}
                            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* Combined Project Details: Image + Name + Developer + Type + Location */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={imgUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80'}
                              alt={prop.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 flex-shrink-0 bg-slate-100"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80'; }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Link
                                  to={`/property/${prop.id}`}
                                  target="_blank"
                                  className="font-extrabold text-slate-900 text-xs hover:text-blue-600 transition-colors"
                                  title={prop.name}
                                >
                                  {prop.name}
                                </Link>
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                  {prop.type || '-'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 flex-wrap">
                                <button
                                  onClick={() => setDeveloperFilter(prop.developer?.trim() || 'ไม่ระบุผู้พัฒนา')}
                                  className="font-bold text-blue-600 hover:underline"
                                >
                                  {prop.developer || 'ไม่ระบุผู้พัฒนา'}
                                </button>
                                <span>•</span>
                                <span>{prop.district ? `${prop.district}, ` : ''}{prop.province || '-'}</span>
                                <span>•</span>
                                <span className="font-mono text-[10px] text-slate-400">{prop.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price & Unit Types */}
                        <td className="p-3 align-middle">
                          <div className="space-y-0.5">
                            <span className="font-extrabold text-slate-900 text-xs block">
                              {prop.price ? `${prop.price} ลบ.` : 'ติดต่อสอบถาม'}
                            </span>
                            <button
                              onClick={() => setManagingProp(prop)}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors"
                              title="คลิกเพื่อจัดการแบบบ้าน/แปลนห้อง"
                            >
                              <Layers size={10} />
                              <span>{prop.unitTypes?.length || 0} แบบ</span>
                            </button>
                          </div>
                        </td>

                        {/* Status Select */}
                        <td className="p-3 align-middle">
                          <select
                            value={prop.status || 'พร้อมอยู่'}
                            onChange={(e) => handleQuickStatusChange(prop, e.target.value)}
                            className={`w-full px-2 py-1 rounded-lg text-[11px] font-bold border outline-none cursor-pointer ${statusBadge(prop.status)}`}
                          >
                            <option value="พร้อมอยู่">พร้อมอยู่</option>
                            <option value="เปิด Presale">เปิด Presale</option>
                            <option value="กำลังก่อสร้าง">กำลังก่อสร้าง</option>
                            <option value="ฉบับร่าง">ฉบับร่าง (Draft)</option>
                          </select>
                        </td>

                        {/* Tier Select */}
                        <td className="p-3 align-middle">
                          <select
                            value={prop.package_tier || 'standard'}
                            onChange={(e) => handleChangeTier(prop, e.target.value)}
                            className={`w-full px-2 py-1 rounded-lg text-[11px] font-bold border outline-none cursor-pointer ${tierInfo.cls}`}
                          >
                            <option value="super">👑 Super</option>
                            <option value="sponsored">⭐ Sponsored</option>
                            <option value="premium">✅ Premium</option>
                            <option value="standard">Standard</option>
                          </select>
                        </td>

                        {/* Action Buttons */}
                        <td className="p-3 text-right align-middle">
                          <div className="inline-flex items-center justify-end gap-1">
                            <Link
                              to={`/property/${prop.id}`}
                              target="_blank"
                              title="ดูหน้าเว็บจริง"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <ExternalLink size={14} />
                            </Link>

                            <Link
                              to={`/admin/edit/${prop.id}`}
                              title="แก้ไขรายละเอียด"
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <Edit size={14} />
                            </Link>

                            <Link
                              to={`/admin/add`}
                              state={{ duplicateFrom: prop }}
                              title="คัดลอกสร้างใหม่ (Duplicate)"
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                              <Copy size={14} />
                            </Link>

                            <button
                              onClick={() => handleDelete(prop.id, prop.name)}
                              title="ลบโครงการ"
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Empty Search Result */}
              {paginatedProperties.length === 0 && (
                <div className="py-16 text-center text-slate-400">
                  <LayoutList size={48} className="mx-auto mb-3 text-slate-300" />
                  <p className="font-bold text-sm text-slate-700">ไม่พบโครงการตามเงื่อนไขที่เลือก</p>
                  <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือปรับตัวกรองประเภท/สถานะใหม่</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <span>แสดง</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 outline-none"
                >
                  <option value={25}>25 รายการ</option>
                  <option value={50}>50 รายการ</option>
                  <option value={100}>100 รายการ</option>
                  <option value="all">ทั้งหมด ({filteredProperties.length})</option>
                </select>
                <span>จากทั้งหมด {filteredProperties.length} โครงการ</span>
              </div>

              {pageSize !== 'all' && totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-bold px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
                    หน้า {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: DEVELOPER DIRECTORY HUB ── */}
        {activeTab === 'developers' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="text-blue-600" size={20} />
                  ศูนย์ข้อมูลบริษัทผู้พัฒนาและผู้รับเหมา (Developer Hub)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  รวม {developerList.length} บริษัท พร้อมสถิติโครงการที่เผยแพร่และฉบับร่าง
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {developerList.map(([devName, count]) => {
                const devProps = properties.filter(p => (p.developer?.trim() || 'ไม่ระบุผู้พัฒนา') === devName);
                const published = devProps.filter(p => p.status !== 'ฉบับร่าง').length;
                const drafts = devProps.filter(p => p.status === 'ฉบับร่าง').length;
                const prices = devProps.map(p => parseFloat(p.price) || 0).filter(p => p > 0);
                const minPrice = prices.length ? Math.min(...prices) : 0;
                const maxPrice = prices.length ? Math.max(...prices) : 0;
                const percentPublished = Math.round((published / count) * 100) || 0;

                return (
                  <div 
                    key={devName}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black text-sm">
                            <Building2 size={20} />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{devName}</h4>
                            <span className="text-[11px] text-slate-400 font-medium">รวม {count} โครงการ</span>
                          </div>
                        </div>
                      </div>

                      {/* Ratio Bar */}
                      <div className="space-y-1.5 my-3">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-emerald-700">เผยแพร่แล้ว {published}</span>
                          <span className="text-slate-500">ฉบับร่าง {drafts}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                          <div style={{ width: `${percentPublished}%` }} className="bg-emerald-500 h-full"></div>
                          <div style={{ width: `${100 - percentPublished}%` }} className="bg-slate-300 h-full"></div>
                        </div>
                      </div>

                      {/* Price Range */}
                      {minPrice > 0 && (
                        <p className="text-[11px] text-slate-600 mb-4">
                          ช่วงราคา: <strong className="text-slate-900">{minPrice} - {maxPrice}</strong> ล้านบาท
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setDeveloperFilter(devName);
                        setActiveTab('properties');
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Filter size={13} />
                      <span>กรองดูโครงการของบริษัทนี้ ({count})</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 3: ANALYTICS & INSIGHTS ── */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Views Bar Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-600" />
                ยอดผู้เข้าชมรายวัน (7 วันล่าสุด)
              </h3>
              <div className="flex items-end gap-2.5 h-48 pt-4 pb-2">
                {dailyViews.length > 0 ? (
                  dailyViews.map((item, idx) => {
                    const maxDaily = Math.max(...dailyViews.map(d => d.views), 1);
                    const heightPercent = Math.max((item.views / maxDaily) * 100, 5);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full">
                        <div className="w-full flex-1 flex items-end justify-center">
                          <div 
                            style={{ height: `${heightPercent}%` }} 
                            className="w-4/5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-500 hover:opacity-80"
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                          {new Date(item.view_date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-xs font-black text-slate-800">{item.views}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs italic">
                    ยังไม่มีข้อมูลสถิติรายวัน
                  </div>
                )}
              </div>
            </div>

            {/* Top Searches */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Search size={18} className="text-indigo-600" />
                คำค้นหายอดฮิต (Top Searches)
              </h3>
              <div className="space-y-3">
                {topSearches.length > 0 ? (
                  topSearches.map((item, idx) => {
                    const maxCount = topSearches[0]?.count || 1;
                    const percent = Math.round((item.count / maxCount) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-800">{item.term}</span>
                          <span className="text-slate-500">{item.count} ครั้ง</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div style={{ width: `${percent}%` }} className="h-full bg-indigo-500 rounded-full"></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs italic">
                    ยังไม่มีข้อมูลคำค้นหา
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: SYSTEM & SEO HEALTH ── */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Shield className="text-emerald-600" size={20} />
                ระบบความปลอดภัย (Security Controls)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <strong className="text-emerald-900 block font-bold">Row Level Security (RLS)</strong>
                    <span className="text-emerald-700">ฐานข้อมูลถูกล็อกด้วย RLS อนุญาตเฉพาะแอดมินเท่านั้น</span>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200">เปิดใช้งานแล้ว</span>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <div>
                    <strong className="text-blue-900 block font-bold">Security Response Headers</strong>
                    <span className="text-blue-700">X-Frame-Options (DENY), nosniff, Referrer Policy</span>
                  </div>
                  <span className="text-xs font-black text-blue-700 bg-white px-2.5 py-1 rounded-full border border-blue-200">Active</span>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                  <div>
                    <strong className="text-purple-900 block font-bold">Draft Leak Protection</strong>
                    <span className="text-purple-700">คัดกรองโครงการฉบับร่างออกจากหน้าเว็บผู้ใช้ทั่วไป 100%</span>
                  </div>
                  <span className="text-xs font-black text-purple-700 bg-white px-2.5 py-1 rounded-full border border-purple-200">Protected</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Globe className="text-indigo-600" size={20} />
                สถานะ SEO & Answer Engine Optimization (AEO)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                  <div>
                    <strong className="text-indigo-900 block font-bold">XML Sitemap</strong>
                    <span className="text-indigo-700">บรรจุ 217 หน้า (ครอบคลุมทุกโครงการที่เผยแพร่)</span>
                  </div>
                  <a 
                    href="/sitemap.xml" 
                    target="_blank"
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>เปิดดู</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div>
                    <strong className="text-amber-900 block font-bold">Schema.org JSON-LD</strong>
                    <span className="text-amber-700">RealEstateListing + FAQPage Schema + Breadcrumbs</span>
                  </div>
                  <span className="text-xs font-black text-amber-700 bg-white px-2.5 py-1 rounded-full border border-amber-200">สมบูรณ์</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block font-bold">AI Crawlers Allowed</strong>
                    <span className="text-slate-600">GPTBot, PerplexityBot, ClaudeBot, Google-Extended</span>
                  </div>
                  <a 
                    href="/robots.txt" 
                    target="_blank"
                    className="text-xs font-bold text-slate-600 hover:underline flex items-center gap-1"
                  >
                    <span>robots.txt</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── STICKY FLOATING BULK ACTIONS TOOLBAR ── */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <CheckSquare size={18} className="text-blue-400" />
            <span className="text-xs font-extrabold whitespace-nowrap">
              เลือกอยู่: <span className="text-blue-400">{selectedIds.size}</span> โครงการ
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700"></div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBulkStatusChange('เปิด Presale')}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1"
            >
              <Send size={13} />
              <span>เผยแพร่ (Publish)</span>
            </button>

            <button
              onClick={() => handleBulkStatusChange('ฉบับร่าง')}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs transition-colors flex items-center gap-1"
            >
              <EyeOff size={13} />
              <span>ซ่อนเป็นดราฟต์</span>
            </button>

            <button
              onClick={() => handleBulkTierChange('super')}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors flex items-center gap-1"
            >
              <Crown size={13} />
              <span>ตั้งเป็น Super</span>
            </button>

            <button
              onClick={() => handleBulkTierChange('sponsored')}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1"
            >
              <Star size={13} />
              <span>ตั้งเป็น Sponsored</span>
            </button>

            <button
              onClick={handleBulkDelete}
              disabled={bulkLoading}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-1"
            >
              <Trash2 size={13} />
              <span>ลบที่เลือก</span>
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="ยกเลิกการเลือก"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── UNIT TYPES MODAL ── */}
      {managingProp && (
        <UnitTypesModal
          prop={managingProp}
          onClose={() => setManagingProp(null)}
          onSaved={() => { if (fetchProperties) fetchProperties(); }}
        />
      )}

      {/* ── SEO & SITEMAP MODAL ── */}
      {seoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Globe className="text-blue-600" size={18} />
                สถานะ Sitemap & AEO Optimization
              </h3>
              <button onClick={() => setSeoModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                ระบบได้ติดตั้ง Sitemap และ Structured Data ให้กับทุกโครงการที่เผยแพร่แล้วโดยอัตโนมัติ เพื่อให้ Google และ AI Search Engines (ChatGPT, Perplexity, Gemini) นำไปแสดงผลในผลการค้นหา
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sitemap URL:</span>
                  <a href="/sitemap.xml" target="_blank" className="text-blue-600 font-bold hover:underline">/sitemap.xml</a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">URLs ใน Sitemap:</span>
                  <span className="font-bold text-slate-800">217 หน้า</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Robots.txt:</span>
                  <a href="/robots.txt" target="_blank" className="text-blue-600 font-bold hover:underline">/robots.txt</a>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSeoModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO IMAGE SETTINGS MODAL ── */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-base">
                เลือกภาพพื้นหลังหน้าแรก (Hero Background)
              </h3>
              <button onClick={() => setSettingsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80',
                  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80',
                  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=80',
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
                  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=2000&q=80',
                  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2000&q=80',
                  'https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?auto=format&fit=crop&w=2000&q=80',
                  'https://images.unsplash.com/photo-1605276374104-caa14152554a?auto=format&fit=crop&w=2000&q=80',
                  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=2000&q=80',
                  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2000&q=80'
                ].map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setHeroImage(img)}
                    className={`relative rounded-xl overflow-hidden h-28 cursor-pointer border-2 transition-all ${
                      heroImage === img 
                        ? 'border-blue-600 shadow-lg shadow-blue-500/30 scale-102' 
                        : 'border-transparent hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="Hero option" className="w-full h-full object-cover" />
                    {heroImage === img && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
              >
                บันทึกเรียบร้อย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
