import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkplaceContext = createContext();

export const useWorkplace = () => useContext(WorkplaceContext);

// 8 Popular Bangkok & Perimeter Office Hub Presets
export const OFFICE_PRESETS = [
  {
    id: 'sathorn',
    name: 'สาทร / สีลม',
    landmark: 'อาคารเอ็มไพร์ทาวเวอร์ (Empire Tower)',
    lat: 13.7208,
    lng: 100.5283,
    area: 'สาทร, กรุงเทพฯ',
    icon: '🏢'
  },
  {
    id: 'asoke',
    name: 'อโศก / สุขุมวิท',
    landmark: 'อาคารอินเตอร์เชนจ์ 21 (Interchange 21)',
    lat: 13.7371,
    lng: 100.5604,
    area: 'วัฒนา, กรุงเทพฯ',
    icon: '💼'
  },
  {
    id: 'rama9',
    name: 'พระราม 9 / รัชดา',
    landmark: 'อาคาร จี ทาวเวอร์ (G Tower Rama 9)',
    lat: 13.7578,
    lng: 100.5663,
    area: 'ห้วยขวาง, กรุงเทพฯ',
    icon: '🌆'
  },
  {
    id: 'ploenchit',
    name: 'เพลินจิต / วัน แบงค็อก',
    landmark: 'วัน แบงค็อก (One Bangkok) / ออลซีซั่นส์',
    lat: 13.7285,
    lng: 100.5472,
    area: 'ปทุมวัน, กรุงเทพฯ',
    icon: '✨'
  },
  {
    id: 'ladprao',
    name: 'ห้าแยกลาดพร้าว / จตุจักร',
    landmark: 'เอสซีบี ปาร์ค พลาซ่า (SCB Park Plaza)',
    lat: 13.8262,
    lng: 100.5623,
    area: 'จตุจักร, กรุงเทพฯ',
    icon: '🏛️'
  },
  {
    id: 'ari',
    name: 'อารีย์ / พญาไท',
    landmark: 'เพิร์ล แบงค็อก (Pearl Bangkok)',
    lat: 13.7801,
    lng: 100.5447,
    area: 'พญาไท, กรุงเทพฯ',
    icon: '🌿'
  },
  {
    id: 'bangna',
    name: 'บางนา / ปุณณวิถี',
    landmark: 'ทรู ดิจิทัล พาร์ค (True Digital Park)',
    lat: 13.6868,
    lng: 100.6105,
    area: 'พระโขนง, กรุงเทพฯ',
    icon: '🚀'
  },
  {
    id: 'chaengwattana',
    name: 'แจ้งวัฒนะ / ดอนเมือง',
    landmark: 'ศูนย์ราชการเฉลิมพระเกียรติฯ แจ้งวัฒนะ',
    lat: 13.8824,
    lng: 100.5658,
    area: 'หลักสี่, กรุงเทพฯ',
    icon: '📑'
  }
];

// Haversine formula to compute great-circle distance in kilometers
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const WorkplaceProvider = ({ children }) => {
  const [workplace, setWorkplaceState] = useState(() => {
    try {
      const saved = localStorage.getItem('fmh_user_workplace');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isWorkplaceModalOpen, setIsWorkplaceModalOpen] = useState(false);

  const setWorkplace = (place) => {
    setWorkplaceState(place);
    if (place) {
      localStorage.setItem('fmh_user_workplace', JSON.stringify(place));
    } else {
      localStorage.removeItem('fmh_user_workplace');
    }
  };

  const clearWorkplace = () => {
    setWorkplace(null);
  };

  /**
   * Calculate commute estimates from property to workplace
   * Returns: { distanceKm, driveMinutes, transitMinutes, tier, tierColor, googleMapsUrl, workplaceName }
   */
  const calculateCommute = (propLat, propLng) => {
    if (!workplace || !propLat || !propLng) return null;

    const lat1 = parseFloat(propLat);
    const lng1 = parseFloat(propLng);
    const lat2 = parseFloat(workplace.lat);
    const lng2 = parseFloat(workplace.lng);

    if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) return null;

    const straightLine = getHaversineDistance(lat1, lng1, lat2, lng2);
    
    // Urban Bangkok Road Detour Factor (~1.25x of straight line)
    const roadDistanceKm = parseFloat((straightLine * 1.25).toFixed(1));

    // Bangkok Traffic Driving Estimation (~25-30 km/h average with stoplights)
    // 5 min base + 2.3 min per km
    const driveMinutes = Math.max(5, Math.round(5 + roadDistanceKm * 2.3));

    // Public Transit / BTS / MRT Estimation (~2.5 min/km + 10 min station access/waiting)
    const transitMinutes = Math.max(10, Math.round(10 + roadDistanceKm * 2.6));

    let tier = 'ปานกลาง';
    let tierColor = 'text-amber-600 bg-amber-50 border-amber-200';
    if (roadDistanceKm <= 5) {
      tier = 'ใกล้มาก';
      tierColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (roadDistanceKm <= 12) {
      tier = 'เดินทางสะดวก';
      tierColor = 'text-blue-700 bg-blue-50 border-blue-200';
    } else if (roadDistanceKm > 20) {
      tier = 'ค่อนข้างไกล';
      tierColor = 'text-slate-600 bg-slate-100 border-slate-200';
    }

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${lat1},${lng1}&destination=${lat2},${lng2}&travelmode=driving`;

    return {
      distanceKm: roadDistanceKm,
      driveMinutes,
      transitMinutes,
      tier,
      tierColor,
      googleMapsUrl,
      workplaceName: workplace.name
    };
  };

  return (
    <WorkplaceContext.Provider value={{
      workplace,
      setWorkplace,
      clearWorkplace,
      calculateCommute,
      isWorkplaceModalOpen,
      setIsWorkplaceModalOpen,
      OFFICE_PRESETS
    }}>
      {children}
    </WorkplaceContext.Provider>
  );
};
