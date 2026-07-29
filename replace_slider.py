import re

file_path = 'src/pages/SearchPage.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
content = content.replace("import './SearchPage.css';", "import './SearchPage.css';\nimport Slider from 'rc-slider';\nimport 'rc-slider/assets/index.css';")

# Update initial state
content = content.replace("priceSlider: 20", "priceRange: [1, 50]")
content = content.replace("priceSlider: 50", "priceRange: [1, 50]")

# Remove the modal slider I added earlier
modal_slider_regex = r'<div className=\"filter-section-block mb-4\">\s*<h4>งบประมาณไม่เกิน \(ล้านบาท\)</h4>\s*<div className=\"price-slider-container px-2 pt-2\">\s*<input type=\"range\".*?/>\s*<div.*?</div>\s*</div>\s*</div>'
content = re.sub(modal_slider_regex, '', content, flags=re.DOTALL)

# Replace the sidebar slider
sidebar_slider_regex = r'<div className=\"filter-group mb-6\">\s*<label>งบประมาณ \(ไม่เกิน \{filters\.priceSlider\} ล้านบาท\)</label>\s*<div className=\"price-slider-container\">\s*<input type=\"range\".*?/>\s*<div className=\"flex justify-between text-xs text-light mt-1\">\s*<span>1\.0M</span>\s*<span>20M\+</span>\s*</div>\s*</div>\s*</div>'
new_sidebar_slider = '''          <div className="filter-group mb-6">
            <label>งบประมาณ ({filters.priceRange[0]} - {filters.priceRange[1]} ล้านบาท)</label>
            <div className="price-slider-container" style={{ padding: '0 8px', marginTop: '16px' }}>
              <Slider
                range
                min={1}
                max={50}
                value={filters.priceRange}
                onChange={(val) => setFilters(prev => ({...prev, priceRange: val}))}
                trackStyle={[{ backgroundColor: 'var(--primary)' }]}
                handleStyle={[
                  { borderColor: 'var(--primary)', backgroundColor: 'var(--primary)' },
                  { borderColor: 'var(--primary)', backgroundColor: 'var(--primary)' }
                ]}
              />
              <div className="flex justify-between text-xs text-light mt-2" style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                <span>1M</span>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{filters.priceRange[0]}M - {filters.priceRange[1]}M</span>
                <span>50M+</span>
              </div>
            </div>
          </div>'''
content = re.sub(sidebar_slider_regex, new_sidebar_slider, content, flags=re.DOTALL)

# Update filter logic
logic_regex = r'// Price logic\s*if \(filters\.priceSlider.*?return false;'
new_logic = r'// Price logic\n    if (prop.price < filters.priceRange[0] || prop.price > filters.priceRange[1]) return false;'
content = re.sub(logic_regex, new_logic, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Dual-thumb slider integrated successfully!")
