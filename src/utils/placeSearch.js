// placeSearch.js - Google-like instant place search & autocomplete for Thailand workplaces

export const POPULAR_THAI_PLACES = [
  // Sathorn & Silom
  { name: 'อาคารเอ็มไพร์ทาวเวอร์ (Empire Tower)', secondary: 'ถนนสาทรใต้ แขวงยานนาวา เขตสาทร กรุงเทพฯ', lat: 13.7208, lng: 100.5283, type: 'office', icon: '🏢', tags: ['empire', 'sathorn', 'สาทร', 'เอ็มไพร์'] },
  { name: 'อาคารสาทรสแควร์ (Sathorn Square)', secondary: 'ถนนสาทรเหนือ แขวงสีลม เขตบางรัก กรุงเทพฯ (ติด BTS ช่องนนทรี)', lat: 13.7229, lng: 100.5292, type: 'office', icon: '🏢', tags: ['sathorn square', 'สาทรสแควร์', 'ช่องนนทรี'] },
  { name: 'คิง เพาเวอร์ มหานคร (King Power Mahanakhon)', secondary: 'ถนนนราธิวาสราชนครินทร์ แขวงสีลม เขตบางรัก กรุงเทพฯ', lat: 13.7234, lng: 100.5285, type: 'office', icon: '🏢', tags: ['mahanakhon', 'มหานคร', 'king power'] },
  { name: 'อาคารสาทร ซิตี้ ทาวเวอร์ (Sathorn City Tower)', secondary: 'ถนนสาทรใต้ แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพฯ', lat: 13.7225, lng: 100.5312, type: 'office', icon: '🏢', tags: ['sathorn city', 'สาทรซิตี้'] },
  { name: 'อาคารบางกอก ซิตี้ ทาวเวอร์ (Bangkok City Tower)', secondary: 'ถนนสาทรใต้ แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพฯ', lat: 13.7227, lng: 100.5308, type: 'office', icon: '🏢', tags: ['bangkok city'] },
  { name: 'อาคาร เอไอเอ สาทร ทาวเวอร์ (AIA Sathorn Tower)', secondary: 'ถนนสาทรใต้ แขวงยานนาวา เขตสาทร กรุงเทพฯ', lat: 13.7197, lng: 100.5244, type: 'office', icon: '🏢', tags: ['aia sathorn', 'เอไอเอ สาทร'] },
  { name: 'อาคาร ซีพี ทาวเวอร์ 1 (สีลม)', secondary: 'ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ (ติด BTS ศาลาแดง)', lat: 13.7282, lng: 100.5342, type: 'office', icon: '🏢', tags: ['cp tower', 'ซีพี สีลม', 'ศาลาแดง'] },
  { name: 'สีลม คอมเพล็กซ์ (Silom Complex)', secondary: 'ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ', lat: 13.7280, lng: 100.5350, type: 'office', icon: '🏢', tags: ['silom complex', 'สีลมคอมเพล็กซ์'] },
  { name: 'อาคารยูไนเต็ด เซ็นเตอร์ (United Center Silom)', secondary: 'ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ', lat: 13.7275, lng: 100.5322, type: 'office', icon: '🏢', tags: ['united center'] },

  // Asoke & Sukhumvit
  { name: 'อาคารอินเตอร์เชนจ์ 21 (Interchange 21)', secondary: 'แยกอโศก ถนนสุขุมวิท 21 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ', lat: 13.7371, lng: 100.5604, type: 'office', icon: '🏢', tags: ['interchange 21', 'อินเตอร์เชนจ์', 'asoke', 'อโศก'] },
  { name: 'อาคารเทอร์มินอล 21 (Terminal 21 Asok)', secondary: 'ถนนสุขุมวิท แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ', lat: 13.7376, lng: 100.5601, type: 'mall', icon: '🛍️', tags: ['terminal 21', 'เทอร์มินอล 21'] },
  { name: 'อาคารภิรัชทาวเวอร์ แอท เอ็มควอเทียร์ (Bhiraj Tower at EmQuartier)', secondary: 'ถนนสุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ (ติด BTS พร้อมพงษ์)', lat: 13.7317, lng: 100.5698, type: 'office', icon: '🏢', tags: ['bhiraj', 'emquartier', 'ภิรัช', 'พร้อมพงษ์'] },
  { name: 'สิงห์ คอมเพล็กซ์ (Singha Complex)', secondary: 'แยกอโศก-เพชรบุรี ถนนเพชรบุรีตัดใหม่ แขวงบางกะปิ เขตห้วยขวาง กรุงเทพฯ', lat: 13.7486, lng: 100.5641, type: 'office', icon: '🏢', tags: ['singha complex', 'สิงห์คอมเพล็กซ์', 'เพชรบุรี'] },
  { name: 'อาคาร จัสมิน ซิตี้ (Jasmine City Asoke)', secondary: 'ซอยสุขุมวิท 23 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ', lat: 13.7363, lng: 100.5627, type: 'office', icon: '🏢', tags: ['jasmine city', 'จัสมิน อโศก'] },
  { name: 'โอเชียน ทาวเวอร์ 1 & 2 (Ocean Tower Asoke)', secondary: 'ซอยสุขุมวิท 19 & 21 เขตวัฒนา กรุงเทพฯ', lat: 13.7420, lng: 100.5615, type: 'office', icon: '🏢', tags: ['ocean tower'] },

  // Rama 9 & Ratchada
  { name: 'อาคาร จี ทาวเวอร์ (G Tower Rama 9)', secondary: 'สี่แยกพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ (ติด MRT พระราม 9)', lat: 13.7578, lng: 100.5663, type: 'office', icon: '🏢', tags: ['g tower', 'จีทาวเวอร์', 'rama 9', 'พระราม 9'] },
  { name: 'อาคาร เดอะ ไนน์ ทาวเวอร์ส (The 9th Towers)', secondary: 'ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ', lat: 13.7565, lng: 100.5695, type: 'office', icon: '🏢', tags: ['the 9th', 'ไนน์ทาวเวอร์'] },
  { name: 'อาคาร ซีดับเบิ้ลยู ทาวเวอร์ (CW Tower Ratchada)', secondary: 'ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ (ติด MRT ศูนย์วัฒนธรรมฯ)', lat: 13.7712, lng: 100.5735, type: 'office', icon: '🏢', tags: ['cw tower', 'cyber world', 'รัชดา'] },
  { name: 'อาคาร เอไอเอ แคปปิตอล เซ็นเตอร์ (AIA Capital Center Ratchada)', secondary: 'ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ', lat: 13.7661, lng: 100.5698, type: 'office', icon: '🏢', tags: ['aia capital', 'เอไอเอ รัชดา'] },
  { name: 'ตลาดหลักทรัพย์แห่งประเทศไทย (SET Thailand)', secondary: 'ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ', lat: 13.7651, lng: 100.5693, type: 'office', icon: '🏛️', tags: ['ตลาดหลักทรัพย์', 'set', 'set thailand'] },
  { name: 'เซ็นทรัลพลาซา แกรนด์ พระราม 9 (Central Rama 9)', secondary: 'ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ', lat: 13.7588, lng: 100.5661, type: 'mall', icon: '🛍️', tags: ['central rama 9', 'เซ็นทรัลพระราม 9'] },
  { name: 'อาคารเมืองไทย-ภัทร คอมเพล็กซ์ (Muang Thai-Phatra Complex)', secondary: 'ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ (ติด MRT สุทธิสาร)', lat: 13.7892, lng: 100.5746, type: 'office', icon: '🏢', tags: ['เมืองไทยภัทร', 'สุทธิสาร'] },

  // Ploenchit, Chidlom, Siam, Rama 4 & One Bangkok
  { name: 'วัน แบงค็อก (One Bangkok)', secondary: 'ถนนวิทยุ & พระราม 4 แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ (ติด MRT ลุมพินี)', lat: 13.7285, lng: 100.5472, type: 'office', icon: '✨', tags: ['one bangkok', 'วันแบงค็อก', 'วัน แบงค็อก', 'ลุมพินี'] },
  { name: 'อาคารสินธร ทาวเวอร์ (Sindhorn Building)', secondary: 'ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ', lat: 13.7350, lng: 100.5448, type: 'office', icon: '🏢', tags: ['sindhorn', 'สินธร', 'วิทยุ'] },
  { name: 'ออล ซีซั่นส์ เพลส (All Seasons Place)', secondary: 'ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ', lat: 13.7383, lng: 100.5470, type: 'office', icon: '🏢', tags: ['all seasons', 'ออลซีซั่นส์'] },
  { name: 'อาคารปาร์ค เวนเชอร์ อีโคเพล็กซ์ (Park Ventures Ecoplex)', secondary: 'แยกเพลินจิต ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ (ติด BTS เพลินจิต)', lat: 13.7431, lng: 100.5489, type: 'office', icon: '🏢', tags: ['park ventures', 'เพลินจิต'] },
  { name: 'ดิ ออฟฟิศเศส แอท เซ็นทรัลเวิลด์ (The Offices at CentralWorld)', secondary: 'ถนนพระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ', lat: 13.7468, lng: 100.5398, type: 'office', icon: '🏢', tags: ['centralworld', 'ctw', 'เซ็นทรัลเวิลด์'] },
  { name: 'เกษร ทาวเวอร์ (Gaysorn Tower)', secondary: 'แยกราชประสงค์ ถนนเพลินจิต แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ', lat: 13.7447, lng: 100.5412, type: 'office', icon: '🏢', tags: ['gaysorn', 'เกษร'] },
  { name: 'สยามพารากอน (Siam Paragon)', secondary: 'ถนนพระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ (BTS สยาม)', lat: 13.7462, lng: 100.5347, type: 'mall', icon: '🛍️', tags: ['siam paragon', 'paragon', 'พารากอน', 'สยาม'] },
  { name: 'เดอะ ปาร์ค (The PARQ Rama 4)', secondary: 'ถนนรัชดาภิเษก-พระราม 4 แขวงคลองเตย เขตคลองเตย กรุงเทพฯ (ติด MRT ศูนย์ฯ สิริกิติ์)', lat: 13.7226, lng: 100.5583, type: 'office', icon: '🏢', tags: ['the parq', 'เดอะปาร์ค', 'พระราม 4'] },
  { name: 'เอฟวายไอ เซ็นเตอร์ (FYI Center)', secondary: 'แยกคลองเตย ถนนพระราม 4 แขวงคลองเตย เขตคลองเตย กรุงเทพฯ', lat: 13.7212, lng: 100.5594, type: 'office', icon: '🏢', tags: ['fyi center', 'เอฟวายไอ'] },

  // Phaholyothin, Ari, Ladprao & Chatuchak
  { name: 'อาคารเพิร์ล แบงค็อก (Pearl Bangkok)', secondary: 'ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ (ติด BTS อารีย์)', lat: 13.7801, lng: 100.5447, type: 'office', icon: '🏢', tags: ['pearl bangkok', 'เพิร์ล', 'ari', 'อารีย์'] },
  { name: 'อาคารอารีย์ ฮิลส์ (Ari Hills)', secondary: 'ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ', lat: 13.7828, lng: 100.5467, type: 'office', icon: '🏢', tags: ['ari hills', 'อารีย์ฮิลส์'] },
  { name: 'อาคารสปริง ทาวเวอร์ (Spring Tower Phayathai)', secondary: 'สี่แยกราชเทวี ถนนพญาไท แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ', lat: 13.7540, lng: 100.5312, type: 'office', icon: '🏢', tags: ['spring tower', 'พญาไท', 'ราชเทวี'] },
  { name: 'เอสซีบี ปาร์ค พลาซ่า (SCB Park Plaza Ratchayothin)', secondary: 'ถนนรัชดาภิเษก แขวงจตุจักร เขตจตุจักร กรุงเทพฯ (ธนาคารไทยพาณิชย์ สำนักงานใหญ่)', lat: 13.8262, lng: 100.5623, type: 'office', icon: '🏛️', tags: ['scb park', 'เอสซีบี', 'รัชโยธิน'] },
  { name: 'ปตท. สำนักงานใหญ่ (PTT Head Office)', secondary: 'ถนนวิภาวดีรังสิต แขวงจตุจักร เขตจตุจักร กรุงเทพฯ', lat: 13.8197, lng: 100.5567, type: 'office', icon: '🏢', tags: ['ptt', 'ปตท', 'วิภาวดี'] },
  { name: 'เอนเนอร์ยี่ คอมเพล็กซ์ (Energy Complex - EnCo)', secondary: 'ถนนวิภาวดีรังสิต แขวงจตุจักร เขตจตุจักร กรุงเทพฯ', lat: 13.8208, lng: 100.5577, type: 'office', icon: '🏢', tags: ['enco', 'energy complex'] },
  { name: 'อาคารซันทาวเวอร์ส (Sun Towers Vibhavadi)', secondary: 'ถนนวิภาวดีรังสิต แขวงจอมพล เขตจตุจักร กรุงเทพฯ', lat: 13.8078, lng: 100.5590, type: 'office', icon: '🏢', tags: ['sun towers', 'ซันทาวเวอร์'] },
  { name: 'อาคารทีเอสที ทาวเวอร์ (TST Tower)', secondary: 'ถนนวิภาวดีรังสิต แขวงจอมพล เขตจตุจักร กรุงเทพฯ', lat: 13.8065, lng: 100.5598, type: 'office', icon: '🏢', tags: ['tst tower'] },
  { name: 'ปูนซิเมนต์ไทย สำนักงานใหญ่ บางซื่อ (SCG Head Office Bang Sue)', secondary: 'ถนนปูนซิเมนต์ไทย แขวงบางซื่อ เขตบางซื่อ กรุงเทพฯ', lat: 13.8037, lng: 100.5367, type: 'office', icon: '🏢', tags: ['scg', 'ปูนซีเมนต์ไทย', 'บางซื่อ'] },

  // Bangna & Sukhumvit Outer
  { name: 'ทรู ดิจิทัล พาร์ค (True Digital Park)', secondary: 'สุขุมวิท 101 แขวงบางจาก เขตพระโขนง กรุงเทพฯ (ติด BTS ปุณณวิถี)', lat: 13.6868, lng: 100.6105, type: 'office', icon: '🚀', tags: ['true digital park', 'ทรูดิจิทัลพาร์ค', 'ปุณณวิถี', '101'] },
  { name: 'ภิรัชทาวเวอร์ แอท ไบเทค (Bhiraj Tower at BITEC)', secondary: 'ถนนสุขุมวิท แขวงบางนาใต้ เขตบางนา กรุงเทพฯ (ติด BTS บางนา)', lat: 13.6702, lng: 100.6062, type: 'office', icon: '🏢', tags: ['bitec', 'ไบเทค', 'bhiraj bitec', 'บางนา'] },
  { name: 'บางนา ทาวเวอร์ (Bangna Tower)', secondary: 'ถนนบางนา-ตราด กม.6.5 ต.บางแก้ว อ.บางพลี สมุทรปราการ', lat: 13.6558, lng: 100.6550, type: 'office', icon: '🏢', tags: ['bangna tower', 'บางนาทาวเวอร์'] },
  { name: 'เมกาบางนา (Mega Bangna)', secondary: 'ถนนบางนา-ตราด กม.8 ต.บางแก้ว อ.บางพลี สมุทรปราการ', lat: 13.6465, lng: 100.6800, type: 'mall', icon: '🛍️', tags: ['mega bangna', 'ikea', 'เมกาบางนา', 'อีเกีย'] },

  // Chaengwattana & Nonthaburi
  { name: 'ศูนย์ราชการเฉลิมพระเกียรติฯ แจ้งวัฒนะ (Government Complex)', secondary: 'ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพฯ', lat: 13.8824, lng: 100.5658, type: 'office', icon: '📑', tags: ['ศูนย์ราชการ', 'แจ้งวัฒนะ', 'government complex'] },
  { name: 'ซอฟต์แวร์พาร์ค (Software Park Thailand)', secondary: 'ถนนแจ้งวัฒนะ ต.คลองเกลือ อ.ปากเกร็ด นนทบุรี', lat: 13.9038, lng: 100.5283, type: 'office', icon: '🏢', tags: ['software park', 'ซอฟต์แวร์พาร์ค'] },
  { name: 'จัสมิน อินเตอร์เนชั่นแนล ทาวเวอร์ แจ้งวัฒนะ', secondary: 'ถนนแจ้งวัฒนะ ต.ปากเกร็ด อ.ปากเกร็ด นนทบุรี', lat: 13.9052, lng: 100.5183, type: 'office', icon: '🏢', tags: ['jasmine chaengwattana', 'จัสมิน แจ้งวัฒนะ'] },

  // Thonburi & Iconsiam
  { name: 'ไอคอนสยาม (ICONSIAM)', secondary: 'ถนนเจริญนคร แขวงคลองต้นไทร เขตคลองสาน กรุงเทพฯ (ติดรถไฟฟ้าสายสีทอง)', lat: 13.7267, lng: 100.5108, type: 'mall', icon: '🛍️', tags: ['iconsiam', 'icon siam', 'ไอคอนสยาม', 'เจริญนคร'] }
];

/**
 * Search places matching user query with Google-like autocomplete ranking
 * 1. Matches instant local database of popular offices & landmarks
 * 2. Fetches Photon (OSM Elasticsearch API with fuzzy typeahead)
 * 3. Fallbacks to Nominatim
 */
export async function searchPlacesLikeGoogle(query) {
  const trimmed = (query || '').trim();
  if (!trimmed || trimmed.length < 2) return [];

  const lower = trimmed.toLowerCase();

  // 1. Instant local database search
  const localMatches = POPULAR_THAI_PLACES.filter(place => {
    if (place.name.toLowerCase().includes(lower)) return true;
    if (place.secondary.toLowerCase().includes(lower)) return true;
    if (place.tags && place.tags.some(t => t.toLowerCase().includes(lower))) return true;
    return false;
  }).map(p => ({
    id: `local_${p.lat}_${p.lng}`,
    name: p.name,
    secondary: p.secondary,
    lat: p.lat,
    lng: p.lng,
    type: p.type,
    icon: p.icon || '🏢',
    isLocal: true
  }));

  // 2. Query Photon API (Fast Elasticsearch typeahead specialized for place autocomplete)
  let apiMatches = [];
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=7&lat=13.7563&lon=100.5018`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(photonUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.features)) {
        apiMatches = data.features.map((feat, idx) => {
          const props = feat.properties || {};
          const coords = feat.geometry?.coordinates || [];
          const name = props.name || props.street || props.district || trimmed;
          const secondaryParts = [
            props.street,
            props.district,
            props.city || props.county,
            props.state,
            props.country
          ].filter(Boolean);

          let icon = '📍';
          if (props.osm_key === 'building' || props.osm_value === 'office' || props.osm_value === 'commercial') icon = '🏢';
          else if (props.osm_key === 'shop' || props.osm_value === 'mall') icon = '🛍️';
          else if (props.osm_key === 'railway' || props.osm_key === 'station') icon = '🚇';
          else if (props.osm_key === 'amenity' && props.osm_value === 'hospital') icon = '🏥';
          else if (props.osm_key === 'amenity' && props.osm_value === 'university') icon = '🏫';

          return {
            id: `api_photon_${props.osm_id || idx}`,
            name: name,
            secondary: secondaryParts.length > 0 ? secondaryParts.join(', ') : 'ประเทศไทย',
            lat: coords[1],
            lng: coords[0],
            type: props.osm_value || 'place',
            icon: icon,
            isLocal: false
          };
        });
      }
    }
  } catch (err) {
    // Fail gracefully to Nominatim or local results
  }

  // 3. Fallback to Nominatim if API matches are low
  if (apiMatches.length === 0 && localMatches.length < 3) {
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&countrycodes=th&limit=6&accept-language=th`;
      const nomRes = await fetch(nomUrl);
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        if (Array.isArray(nomData)) {
          apiMatches = nomData.map((item) => {
            const parts = (item.display_name || '').split(',');
            const primaryName = parts[0] || trimmed;
            const secondaryText = parts.slice(1, 4).join(', ');
            return {
              id: `api_nom_${item.place_id}`,
              name: primaryName.trim(),
              secondary: secondaryText.trim() || 'ประเทศไทย',
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              type: item.type || 'place',
              icon: item.type === 'building' ? '🏢' : '📍',
              isLocal: false
            };
          });
        }
      }
    } catch (e) {}
  }

  // Deduplicate and combine (Local top matches first, then unique API results)
  const combined = [...localMatches];
  const seenCoords = new Set(localMatches.map(p => `${p.lat.toFixed(3)}_${p.lng.toFixed(3)}`));

  for (const item of apiMatches) {
    if (!item.lat || !item.lng) continue;
    const coordKey = `${item.lat.toFixed(3)}_${item.lng.toFixed(3)}`;
    if (!seenCoords.has(coordKey)) {
      seenCoords.add(coordKey);
      combined.push(item);
    }
  }

  return combined.slice(0, 8);
}
