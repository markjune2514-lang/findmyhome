import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, type = 'website', url }) {
  const siteName = 'Find My Home';
  const defaultTitle = 'Find My Home - ค้นหาบ้านและคอนโดที่ใช่สำหรับคุณ';
  const defaultDescription = 'Find My Home แพลตฟอร์มค้นหาบ้าน คอนโด ทาวน์โฮม และที่ดิน พร้อมรายละเอียดครบถ้วนเพื่อการตัดสินใจที่ดีที่สุดของคุณ';
  const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

  const currentTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const currentDescription = description || defaultDescription;
  const currentImage = image || defaultImage;
  const currentUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{currentTitle}</title>
      <meta name='description' content={currentDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property='og:type' content={type} />
      <meta property='og:url' content={currentUrl} />
      <meta property='og:title' content={currentTitle} />
      <meta property='og:description' content={currentDescription} />
      <meta property='og:image' content={currentImage} />
      
      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:url' content={currentUrl} />
      <meta name='twitter:title' content={currentTitle} />
      <meta name='twitter:description' content={currentDescription} />
      <meta name='twitter:image' content={currentImage} />
    </Helmet>
  );
}
