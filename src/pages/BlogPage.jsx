import React from 'react';
import { blogArticles } from '../mockData';
import { Search } from 'lucide-react';
import './BlogPage.css';

export default function BlogPage() {
  const featured = blogArticles.find(a => a.isFeatured);
  const trending = blogArticles.filter(a => a.isTrending).sort((a, b) => a.trendRank - b.trendRank);
  const latest = blogArticles.filter(a => !a.isFeatured && !a.isTrending);

  return (
    <div className="container py-8">
      <div className="blog-header flex justify-between items-center mb-8">
        <div>
          <h2>บทความและข่าวสาร</h2>
          <p>อัปเดตทุกเรื่องราวอสังหาริมทรัพย์เพื่อการตัดสินใจที่ดีกว่า</p>
        </div>
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="ค้นหาบทความ..." className="search-input" />
        </div>
      </div>

      <div className="categories flex gap-4 mb-8 overflow-x-auto">
        <button className="badge active">ทั้งหมด</button>
        <button className="badge">บ้านหลังแรก</button>
        <button className="badge">ลงทุน</button>
        <button className="badge">ทำเล</button>
        <button className="badge">กฎหมาย-สินเชื่อ</button>
        <button className="badge">ไลฟ์สไตล์</button>
      </div>

      <div className="featured-section flex gap-6 mb-12">
        <div className="hero-article" style={{ backgroundImage: `url(${featured.image})` }}>
          <div className="hero-content">
            <span className="badge">{featured.category}</span>
            <h1 className="text-white mt-4">{featured.title}</h1>
            <p className="text-white mt-2 mb-6">{featured.description}</p>
            <div className="flex items-center gap-4">
              <div className="author-info text-white">
                <span className="text-sm">By {featured.author}</span>
                <span className="text-sm block">{featured.date}</span>
              </div>
            </div>
            <button className="btn btn-primary mt-6">อ่านต่อ</button>
          </div>
        </div>
        
        <div className="trending-sidebar">
          <h3 className="mb-4">TRENDING</h3>
          <div className="trending-list flex-col gap-4">
            {trending.map(article => (
              <div key={article.id} className="trending-item flex gap-4 items-start">
                <div className="trend-number">{article.trendRank}</div>
                <img src={article.image} alt={article.title} />
                <div>
                  <h4 className="text-sm">{article.title}</h4>
                  <p className="text-xs text-light mt-1">{article.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className="mb-6">LATEST ARTICLES</h3>
      <div className="latest-grid">
        {latest.map(article => (
          <div key={article.id} className="article-card">
            <div className="img-wrapper">
              <span className="badge absolute-badge">{article.category}</span>
              <img src={article.image} alt={article.title} />
            </div>
            <h4 className="mt-4">{article.title}</h4>
            <p className="text-xs text-light mt-2">{article.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
