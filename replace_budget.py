import re

file_path = 'src/pages/SearchPage.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove condo budget block
content = re.sub(
    r'<div className="filter-section-block">\s*<h4>ข้อมูลพื้นฐาน \(งบประมาณ\)</h4>\s*<div className="pill-grid">\s*\{\[\'1–2 ล้านบาท\', \'2–3 ล้านบาท\', \'3–5 ล้านบาท\', \'5–8 ล้านบาท\', \'8–10 ล้านบาท\', \'10–15 ล้านบาท\', \'15–20 ล้านบาท\'\]\.map\(opt => \(\s*<button key=\{opt\} className=\{`pill-btn \$\{filters\.budget\.includes\(opt\) \? \'active\' : \'\'\}`\} onClick=\{\(\) => toggleFilter\(\'budget\', opt\)\}>\{opt\}</button>\s*\)\)\}\s*</div>\s*</div>',
    '',
    content
)

# Remove house budget block
content = re.sub(
    r'<div className="filter-section-block">\s*<h4>ข้อมูลพื้นฐาน \(งบประมาณ\)</h4>\s*<div className="pill-grid">\s*\{\[\'2–3 ล้านบาท\', \'3–5 ล้านบาท\', \'5–8 ล้านบาท\', \'8–10 ล้านบาท\', \'10–15 ล้านบาท\', \'15–20 ล้านบาท\'\]\.map\(opt => \(\s*<button key=\{opt\} className=\{`pill-btn \$\{filters\.budget\.includes\(opt\) \? \'active\' : \'\'\}`\} onClick=\{\(\) => toggleFilter\(\'budget\', opt\)\}>\{opt\}</button>\s*\)\)\}\s*</div>\s*</div>',
    '',
    content
)

# Remove senior budget block
content = re.sub(
    r'<div className="filter-section-block">\s*<h4>งบประมาณ</h4>\s*<div className="pill-grid">\s*\{\[\'ต่ำกว่า 3 ล้านบาท\', \'3–5 ล้านบาท\', \'5–8 ล้านบาท\', \'8–10 ล้านบาท\', \'10–15 ล้านบาท\', \'15–20 ล้านบาท\'\]\.map\(opt => \(\s*<button key=\{opt\} className=\{`pill-btn \$\{filters\.budget\.includes\(opt\) \? \'active\' : \'\'\}`\} onClick=\{\(\) => toggleFilter\(\'budget\', opt\)\}>\{opt\}</button>\s*\)\)\}\s*</div>\s*</div>',
    '',
    content
)

slider_code = '''              <div className="filter-section-block mb-4">
                <h4>งบประมาณไม่เกิน (ล้านบาท)</h4>
                <div className="price-slider-container px-2 pt-2">
                  <input type="range" min="1" max="50" className="range-slider" style={{ width: '100%' }} value={filters.priceSlider} onChange={(e) => setFilterSingle('priceSlider', e.target.value)} />
                  <div className="flex justify-between text-xs text-light mt-2" style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                    <span>1M</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{filters.priceSlider}M</span>
                    <span>50M+</span>
                  </div>
                </div>
              </div>
'''

content = content.replace('<div className="modal-content" style={{ maxHeight: \'60vh\', overflowY: \'auto\' }}>', 
                          '<div className="modal-content" style={{ maxHeight: \'60vh\', overflowY: \'auto\' }}>\n' + slider_code)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Budget replaced with slider!")
