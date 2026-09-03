import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  image, 
  type = 'website', 
  url, 
  canonical, 
  keywords, 
  noindex = false,
  jsonLd = null 
}) {
  const siteName = 'Find My Home';
  const defaultTitle = 'Find My Home - ค้นหาบ้านและคอนโดที่ใช่สำหรับคุณ';
  const defaultDescription = 'Find My Home แพลตฟอร์มค้นหาบ้าน คอนโด ทาวน์โฮม และที่ดิน พร้อมรายละเอียดครบถ้วนเพื่อการตัดสินใจที่ดีที่สุดของคุณ';
  const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  const defaultKeywords = 'ซื้อบ้าน, คอนโด, ทาวน์โฮม, อสังหาริมทรัพย์, หาบ้าน, บ้านมือหนึ่ง, คอนโดใกล้รถไฟฟ้า, บ้านเดี่ยว, ค้นหาบ้าน';

  const currentTitle = title ? (title.includes(siteName) ? title : `${title} | ${siteName}`) : defaultTitle;
  const currentDescription = description || defaultDescription;
  const currentImage = image || defaultImage;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://findmyhome.in.th');
  const canonicalUrl = canonical || currentUrl;
  const currentKeywords = keywords || defaultKeywords;
  const robotsDirectives = noindex 
    ? 'noindex, nofollow' 
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{currentTitle}</title>
      <meta name='description' content={currentDescription} />
      <meta name='keywords' content={currentKeywords} />
      <meta name='robots' content={robotsDirectives} />
      <link rel='canonical' href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property='og:site_name' content={siteName} />
      <meta property='og:type' content={type} />
      <meta property='og:url' content={currentUrl} />
      <meta property='og:title' content={currentTitle} />
      <meta property='og:description' content={currentDescription} />
      <meta property='og:image' content={currentImage} />
      <meta property='og:locale' content='th_TH' />
      
      {/* Twitter Card */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:url' content={currentUrl} />
      <meta name='twitter:title' content={currentTitle} />
      <meta name='twitter:description' content={currentDescription} />
      <meta name='twitter:image' content={currentImage} />

      {/* JSON-LD Structured Data for Search & Answer Engines (AEO) */}
      {jsonLd && (
        Array.isArray(jsonLd) ? (
          jsonLd.map((schema, idx) => (
            <script key={idx} type='application/ld+json'>
              {JSON.stringify(schema)}
            </script>
          ))
        ) : (
          <script type='application/ld+json'>
            {JSON.stringify(jsonLd)}
          </script>
        )
      )}
    </Helmet>
  );
}
