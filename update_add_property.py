import re

with open('src/pages/AddPropertyPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update initial form data
new_form_data = """  const [formData, setFormData] = useState({
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
    transport: []
  });"""
content = re.sub(r'  const \[formData, setFormData\] = useState\(\{[\s\S]*?\}\);', new_form_data, content)

# 2. Add all options arrays
new_options = """
  const condoSizes = ['25 ตร.ม.', '25–30 ตร.ม.', '31–40 ตร.ม.', '41–60 ตร.ม.', '61–80 ตร.ม.'];
  const condoRoomTypes = ['1 Bed', '1 Bed Plus', '2 Bed', 'Loft'];
  const condoProjectTypes = ['Low Rise', 'High Rise', 'Mixed Use'];
  const condoSpecials = ['Pet Friendly'];
  const condoFacilities = ['สระว่ายน้ำ', 'Fitness', 'Co-working Space', 'Cafe', 'Garden', 'Kids Room', 'Game Room', 'Yoga Room', 'Sky Lounge', 'EV Charger', 'Smart Locker', 'Shuttle Bus', 'Co kitchen', 'Sauna / Steam', 'Meeting Room', 'Auto Parking'];
  const condoSecurities = ['Key Card Access', 'ระบบอ่านป้ายทะเบียนรถ (LPR)', 'Digital Door Lock', 'Emergency Button', 'Visitor Management'];

  const houseLandSizes = ['ไม่ต่ำกว่า 16 ตารางวา', 'ไม่ต่ำกว่า 35 ตารางวา', 'ไม่ต่ำกว่า 50 ตารางวา', '60-80 ตารางวา', '80-100 ตารางวา', '100-200 ตารางวา', 'มากกว่า 200 ตารางวา'];
  const houseSizes = ['100 ตร.ม.', '100–150 ตร.ม.', '151–200 ตร.ม.', '201–250 ตร.ม.', '251–300 ตร.ม.', '301–400 ตร.ม.', '401–500 ตร.ม.', 'มากกว่า 500 ตร.ม.'];
  const houseProjectTypes = ['บ้านเดี่ยว', 'บ้านแฝด', 'ทาวน์โฮม'];
  const houseFacilities = ['Clubhouse', 'สระว่ายน้ำ', 'Fitness', 'สวน', 'สนามเด็กเล่น', 'สนามกีฬา', 'EV Charger', 'กล้องวงจรปิด'];
  const houseSecurities = ['CCTV', 'Security 24 ชั่วโมง', 'Double Gate', 'ระบบอ่านป้ายทะเบียนรถ (LPR)'];

  const seniorSizes = ['ต่ำกว่า 35 ตร.ม.', '35–50 ตร.ม.', '51–70 ตร.ม.', '71–100 ตร.ม.'];
  const seniorLivingFormats = ['Wellness Residence', 'Senior Living Community', 'Active Aging Residence', 'Independent Living', 'Assisted Living', 'Nursing Care'];
  const seniorServices = ['Laundry service*', 'Housekeeping service*', 'Shuttle service*', 'Waste management service*', 'Delivery assistance', 'Parcel and package service', 'Electric vehicle (EV) charging stations', 'Large elevators (sized to accommodate hospital beds)'];
  const seniorFacilities = ['First-aid room', 'Treatment room', 'Exercise room for seniors', 'Healing stone court', 'Meditation room', 'สระว่ายน้ำ', 'สระ Hydrotherapy', 'Fitness', 'Walking Track', 'Bike Lane', 'Yoga Studio', 'ห้องสมุด', 'ห้องกิจกรรม', 'โปรแกรมพาเที่ยว'];
  const seniorHealthFacilities = ['บริการฉุกเฉินตลอด 24 ชั่วโมง', 'มีแพทย์ประจำ', 'กายภาพบำบัด', 'ศูนย์ฟื้นฟู', 'คลินิกในโครงการ', 'รถพยาบาลฉุกเฉิน', 'ตรวจสุขภาพประจำปี', 'มีโรงพยาบาลในเครือ'];
  const seniorSecurities = ['Emergency Call Button', 'Emergency alert system', 'CCTV', 'Security 24 ชั่วโมง'];

  const statuses = ['พร้อมอยู่', 'กำลังก่อสร้าง', 'เปิด Presale'];
"""
# Replace from `const facilityOptions =` to `const statuses = ...`
content = re.sub(r'  const facilityOptions = [\s\S]*?const statuses = \[.*?\];', new_options, content)

# 3. Add type 'ผู้สูงอายุ' to the select
type_select_replacement = """                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="คอนโด">คอนโด (Condo)</option>
                  <option value="บ้าน">บ้าน (House)</option>
                  <option value="ทาวน์โฮม">ทาวน์โฮม (Townhome)</option>
                  <option value="ผู้สูงอายุ">ผู้สูงอายุ (Senior Living)</option>
                  <option value="ที่ดิน">ที่ดินเปล่า (Land)</option>
                </select>"""
content = re.sub(r'<select name="type".*?</select>', type_select_replacement, content, flags=re.DOTALL, count=1)

# 4. We need to create a helper render for the checkboxes
checkbox_helper = """
  const renderCheckboxes = (label, field, options) => (
    <div className="form-group col-span-2">
      <label>{label}</label>
      <div className="checkbox-grid">
        {options.map(opt => (
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
    </div>
  );
  
  const renderSelect = (label, field, options) => (
    <div className="form-group">
      <label>{label}</label>
      <select name={field} value={formData[field]} onChange={handleChange}>
        <option value="">เลือก{label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
"""
content = content.replace('const handleChange = (e) => {', checkbox_helper + '\n  const handleChange = (e) => {')

# 5. Overhaul the "รายละเอียด" and "สิ่งอำนวยความสะดวก" sections
dynamic_sections = """
          <section className="form-section">
            <h3 className="section-title">รายละเอียดอสังหาฯ (ตามประเภทที่เลือก)</h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.type === 'คอนโด' && (
                <>
                  {renderSelect('ประเภทย่อย (Project Type)', 'projectType', condoProjectTypes)}
                  {renderSelect('ขนาด (ตร.ม.)', 'size', condoSizes)}
                  {renderSelect('รูปแบบห้อง', 'roomType', condoRoomTypes)}
                  {renderCheckboxes('จุดเด่นพิเศษ', 'special', condoSpecials)}
                  {renderCheckboxes('สิ่งอำนวยความสะดวก (Facilities)', 'facilities', condoFacilities)}
                  {renderCheckboxes('ระบบรักษาความปลอดภัย', 'security', condoSecurities)}
                </>
              )}
              {(formData.type === 'บ้าน' || formData.type === 'ทาวน์โฮม') && (
                <>
                  {renderSelect('ประเภทย่อย (Project Type)', 'projectType', houseProjectTypes)}
                  {renderSelect('ขนาดที่ดิน', 'landSize', houseLandSizes)}
                  {renderSelect('พื้นที่ใช้สอย', 'size', houseSizes)}
                  {renderCheckboxes('สิ่งอำนวยความสะดวก (Facilities)', 'facilities', houseFacilities)}
                  {renderCheckboxes('ระบบรักษาความปลอดภัย', 'security', houseSecurities)}
                </>
              )}
              {formData.type === 'ผู้สูงอายุ' && (
                <>
                  {renderSelect('รูปแบบการอยู่อาศัย', 'livingFormat', seniorLivingFormats)}
                  {renderSelect('ขนาดห้อง (ตร.ม.)', 'size', seniorSizes)}
                  {renderCheckboxes('บริการทั่วไป (Services)', 'services', seniorServices)}
                  {renderCheckboxes('สิ่งอำนวยความสะดวกส่วนกลาง', 'facilities', seniorFacilities)}
                  {renderCheckboxes('บริการทางการแพทย์', 'healthFacilities', seniorHealthFacilities)}
                  {renderCheckboxes('ระบบรักษาความปลอดภัย', 'security', seniorSecurities)}
                </>
              )}
            </div>
          </section>

          <div className="form-actions mt-8 pb-12">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>ยกเลิก</button>
            <button type="submit" className="btn btn-primary flex items-center gap-2">
              <Save size={18} /> บันทึกข้อมูล
            </button>
          </div>
        </form>
"""
content = re.sub(r'<section className="form-section">\s*<h3 className="section-title">รายละเอียด.*?<\/form>', dynamic_sections.strip(), content, flags=re.DOTALL)

with open('src/pages/AddPropertyPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
