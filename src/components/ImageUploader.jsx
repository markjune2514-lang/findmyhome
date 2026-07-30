import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';

export default function ImageUploader({ images = [], onChange, label = 'รูปภาพ', multiple = true }) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [mode, setMode] = useState('file'); // 'file' or 'url'

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const newUrls = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          newUrls.push(data.publicUrl);
        }
      }

      if (newUrls.length > 0) {
        if (multiple) {
          onChange([...images, ...newUrls]);
        } else {
          onChange([newUrls[newUrls.length - 1]]);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ' + error.message);
    } finally {
      setUploading(false);
      // Reset input value so same file can be selected again
      if (e.target) e.target.value = '';
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onChange([...images, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleRemove = (indexToRemove) => {
    onChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="image-uploader border rounded-lg p-4 bg-gray-50/50">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-semibold text-gray-700">{label} ({images.length})</label>
        <div className="flex gap-1 bg-gray-200 p-1 rounded-md">
          <button 
            type="button" 
            className={`text-xs px-3 py-1 rounded-md transition-colors ${mode === 'file' ? 'bg-white shadow-sm font-semibold text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setMode('file')}
          >
            ไฟล์
          </button>
          <button 
            type="button" 
            className={`text-xs px-3 py-1 rounded-md transition-colors ${mode === 'url' ? 'bg-white shadow-sm font-semibold text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setMode('url')}
          >
            URL
          </button>
        </div>
      </div>

      <div className="mb-4">
        {mode === 'file' ? (
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-white hover:border-primary/50 transition-colors text-center cursor-pointer group bg-white">
            <input 
              type="file" 
              accept="image/*" 
              multiple={multiple}
              onChange={handleFileUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-primary">
                <Loader2 className="animate-spin" size={24} />
                <span className="text-sm">กำลังอัปโหลด...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-primary transition-colors">
                <Upload size={24} />
                <span className="text-sm">คลิกเพื่อเลือกไฟล์จากอุปกรณ์</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="url" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
              />
            </div>
            <button 
              type="button" 
              onClick={handleAddUrl}
              className="btn btn-secondary text-sm px-4"
              disabled={!urlInput.trim()}
            >
              เพิ่ม
            </button>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-[4/3] rounded-md overflow-hidden bg-gray-100 border">
              <img src={img} alt={`${label} ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Error'} />
              <button 
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 bg-white/90 text-red-500 hover:bg-red-50 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
