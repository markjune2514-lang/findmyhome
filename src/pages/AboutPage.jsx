import React from 'react';
import { Search, Info, Scale, Calculator, Phone, Mail, MessageCircle, MapPin, Share2, Link as LinkIcon, Hash } from 'lucide-react';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="about-hero">
        <div className="hero-text">
          <h2 className="mb-2">เกี่ยวกับเรา</h2>
          <h1 className="text-primary mb-4" style={{ fontSize: '3rem' }}>Find My Home</h1>
          <h3 className="mb-6">ที่อยู่ที่ใช่ เริ่มต้นที่นี่</h3>
          <p className="text-light">
            เราเชื่อว่าการมีบ้านที่ดี คือจุดเริ่มต้นของชีวิตที่ดี<br/>
            Find My Home คือแพลตฟอร์มที่ช่วยให้คุณค้นหาบ้าน<br/>
            คอนโดที่ใช่ เปรียบเทียบอย่างมั่นใจ และวางแผนการเงิน<br/>
            ได้ครบจบในที่เดียว
          </p>
        </div>
      </div>

      <div className="core-values flex justify-center gap-12 py-12">
        <div className="value-item text-center">
          <div className="icon-wrapper"><Search size={32} color="var(--primary)" /></div>
          <h4>ค้นหาง่าย</h4>
          <p className="text-xs text-light">ด้วยแผนที่และตัวกรองละเอียด</p>
        </div>
        <div className="value-item text-center">
          <div className="icon-wrapper"><Info size={32} color="var(--primary)" /></div>
          <h4>ข้อมูลครบถ้วน</h4>
          <p className="text-xs text-light">อัปเดตจากผู้พัฒนาโครงการจริง</p>
        </div>
        <div className="value-item text-center">
          <div className="icon-wrapper"><Scale size={32} color="var(--primary)" /></div>
          <h4>เปรียบเทียบได้</h4>
          <p className="text-xs text-light">ตัดสินใจได้มั่นใจขึ้น</p>
        </div>
        <div className="value-item text-center">
          <div className="icon-wrapper"><Calculator size={32} color="var(--primary)" /></div>
          <h4>วางแผนการเงิน</h4>
          <p className="text-xs text-light">คำนวณค่าใช้จ่ายตามจริง</p>
        </div>
      </div>

      <div className="contact-section flex gap-8">
        <div className="contact-info flex-1">
          <h3 className="mb-6">ติดต่อเรา</h3>
          
          <div className="contact-item flex items-center gap-4 mb-4">
            <Phone size={20} color="var(--primary)" />
            <span>02-123-4567</span>
          </div>
          <div className="contact-item flex items-center gap-4 mb-4">
            <Mail size={20} color="var(--primary)" />
            <span>hello@findmyhome.co.th</span>
          </div>
          <div className="contact-item flex items-center gap-4 mb-6">
            <MessageCircle size={20} color="var(--primary)" />
            <span>@findmyhome</span>
          </div>

          <div className="social-icons flex gap-4">
            <button className="social-btn"><Share2 size={20} /></button>
            <button className="social-btn"><LinkIcon size={20} /></button>
            <button className="social-btn"><Hash size={20} /></button>
          </div>
        </div>

        <div className="contact-map flex-2">
          {/* Static Map Image for demo purposes */}
          <div className="map-placeholder">
            <MapPin size={48} color="var(--primary)" />
            <div className="map-card">
              <h4>Find My Home Co., Ltd.</h4>
              <p className="text-xs text-light">Bangkok, Thailand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
