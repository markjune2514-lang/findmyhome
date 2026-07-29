import sys

file_path = 'src/pages/SearchPage.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if '<div className="modal-content">' in line:
        start_idx = i
        break

for i in range(start_idx, len(lines)):
    if '<div className="modal-footer' in lines[i]:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_content = '''            <div className="modal-content" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {activePropertyType === 'condo' && (
                <>
                  <div className="filter-section-block">
                    <h4>ข้อมูลพื้นฐาน (งบประมาณ)</h4>
                    <div className="pill-grid">
                      {['1–2 ล้านบาท', '2–3 ล้านบาท', '3–5 ล้านบาท', '5–8 ล้านบาท', '8–10 ล้านบาท', '10–15 ล้านบาท', '15–20 ล้านบาท'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.budget.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('budget', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>พื้นที่ใช้สอย</h4>
                    <div className="pill-grid">
                      {['25 ตร.ม.', '25–30 ตร.ม.', '31–40 ตร.ม.', '41–60 ตร.ม.', '61–80 ตร.ม.'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.size.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('size', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>ประเภทห้อง</h4>
                    <div className="pill-grid">
                      {['1 Bed', '1 Bed Plus', '2 Bed', 'Loft'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.roomType.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('roomType', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>ประเภทโครงการ</h4>
                    <div className="pill-grid">
                      {['Low Rise', 'High Rise', 'Mixed Use'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.projectType.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('projectType', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>จุดเด่นพิเศษ</h4>
                    <div className="pill-grid">
                      {['Pet Friendly'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.special.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('special', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>สิ่งอำนวยความสะดวก</h4>
                    <div className="pill-grid">
                      {['สระว่ายน้ำ', 'Fitness', 'Co-working Space', 'Cafe', 'Garden', 'Kids Room', 'Game Room', 'Yoga Room', 'Sky Lounge', 'EV Charger', 'Smart Locker', 'Shuttle Bus', 'Co kitchen', 'Sauna / Steam', 'Meeting Room', 'Auto Parking'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.facilities.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('facilities', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block mb-8">
                    <h4>การรักษาความปลอดภัย</h4>
                    <div className="pill-grid">
                      {['Key Card Access', 'ระบบอ่านป้ายทะเบียนรถ (LPR)', 'Digital Door Lock', 'Emergency Button', 'Visitor Management'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.security.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('security', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activePropertyType === 'house' && (
                <>
                  <div className="filter-section-block">
                    <h4>ข้อมูลพื้นฐาน (งบประมาณ)</h4>
                    <div className="pill-grid">
                      {['2–3 ล้านบาท', '3–5 ล้านบาท', '5–8 ล้านบาท', '8–10 ล้านบาท', '10–15 ล้านบาท', '15–20 ล้านบาท'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.budget.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('budget', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>ขนาดที่ดิน</h4>
                    <div className="pill-grid">
                      {['ไม่ต่ำกว่า 16 ตารางวา', 'ไม่ต่ำกว่า 35 ตารางวา', 'ไม่ต่ำกว่า 50 ตารางวา', '60-80 ตารางวา', '80-100 ตารางวา', '100-200 ตารางวา', 'มากกว่า 200 ตารางวา'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.landSize.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('landSize', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>พื้นที่ใช้สอย</h4>
                    <div className="pill-grid">
                      {['100 ตร.ม.', '100–150 ตร.ม.', '151–200 ตร.ม.', '201–250 ตร.ม.', '251–300 ตร.ม.', '301–400 ตร.ม.', '401–500 ตร.ม.', 'มากกว่า 500 ตร.ม.'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.size.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('size', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>ประเภทโครงการ</h4>
                    <div className="pill-grid">
                      {['บ้านเดี่ยว', 'บ้านแฝด', 'ทาวน์โฮม'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.projectType.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('projectType', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>สิ่งอำนวยความสะดวก</h4>
                    <div className="pill-grid">
                      {['Clubhouse', 'สระว่ายน้ำ', 'Fitness', 'สวน', 'สนามเด็กเล่น', 'สนามกีฬา', 'EV Charger', 'กล้องวงจรปิด'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.facilities.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('facilities', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block mb-8">
                    <h4>การรักษาความปลอดภัย</h4>
                    <div className="pill-grid">
                      {['CCTV', 'Security 24 ชั่วโมง', 'Double Gate', 'ระบบอ่านป้ายทะเบียนรถ (LPR)'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.security.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('security', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activePropertyType === 'senior' && (
                <>
                  <div className="filter-section-block">
                    <h4>งบประมาณ</h4>
                    <div className="pill-grid">
                      {['ต่ำกว่า 3 ล้านบาท', '3–5 ล้านบาท', '5–8 ล้านบาท', '8–10 ล้านบาท', '10–15 ล้านบาท', '15–20 ล้านบาท'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.budget.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('budget', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>พื้นที่ใช้สอย</h4>
                    <div className="pill-grid">
                      {['ต่ำกว่า 35 ตร.ม.', '35–50 ตร.ม.', '51–70 ตร.ม.', '71–100 ตร.ม.'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.size.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('size', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>รูปแบบการอยู่อาศัย</h4>
                    <div className="pill-grid">
                      {['Wellness Residence', 'Senior Living Community', 'Active Aging Residence', 'Independent Living', 'Assisted Living', 'Nursing Care'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.livingFormat.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('livingFormat', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>สิ่งอำนวยความสะดวกพื้นฐาน</h4>
                    <div className="pill-grid">
                      {['Laundry service*', 'Housekeeping service*', 'Shuttle service*', 'Waste management service*', 'Delivery assistance', 'Parcel and package service', 'Electric vehicle (EV) charging stations', 'Large elevators (sized to accommodate hospital beds)'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.services.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('services', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>สิ่งอำนวยความสะดวกด้านสุขภาพและสันทนาการ</h4>
                    <div className="pill-grid">
                      {['First-aid room', 'Treatment room', 'Exercise room for seniors', 'Healing stone court', 'Meditation room', 'สระว่ายน้ำ', 'สระ Hydrotherapy', 'Fitness', 'Walking Track', 'Bike Lane', 'Yoga Studio', 'ห้องสมุด', 'ห้องกิจกรรม', 'โปรแกรมพาเที่ยว'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.healthFacilities.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('healthFacilities', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block">
                    <h4>บริการและระบบฉุกเฉิน</h4>
                    <div className="pill-grid">
                      {['บริการฉุกเฉินตลอด 24 ชั่วโมง', 'มีแพทย์ประจำ', 'กายภาพบำบัด', 'ศูนย์ฟื้นฟู', 'คลินิกในโครงการ', 'รถพยาบาลฉุกเฉิน', 'ตรวจสุขภาพประจำปี', 'มีโรงพยาบาลในเครือ'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.special.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('special', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-section-block mb-8">
                    <h4>การรักษาความปลอดภัย</h4>
                    <div className="pill-grid">
                      {['Emergency Call Button', 'Emergency alert system', 'CCTV', 'Security 24 ชั่วโมง'].map(opt => (
                        <button key={opt} className={`pill-btn ${filters.security.includes(opt) ? 'active' : ''}`} onClick={() => toggleFilter('security', opt)}>{opt}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
\n'''
    new_lines = lines[:start_idx] + [new_content] + lines[end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Successfully replaced modal content")
else:
    print("Could not find start or end index for modal content")
