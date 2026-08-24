import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';
import ImageCropper from './ImageCropper';

export default function ImageUploader({ images = [], onChange, label = 'รูปภาพ', multiple = true, isLogo = false }) {
  const safeImages = Array.isArray(images) ? images : (images && typeof images === 'string' ? images.split(',').filter(Boolean) : []);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [mode, setMode] = useState('file'); // 'file' or 'url'

  const [pendingFiles, setPendingFiles] = useState([]);
  const [currentCropIndex, setCurrentCropIndex] = useState(0);
  const [isCropping, setIsCropping] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setPendingFiles(files);
    setCurrentCropIndex(0);
    setIsCropping(true);

    if (e.target) e.target.value = '';
  };

  const handleCropDone = async (croppedBlob) => {
    try {
      setUploading(true);
      const originalFile = pendingFiles[currentCropIndex];
      const fileExt = originalFile?.name ? originalFile.name.split('.').pop() : 'jpg';
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload blob or fallback to original file if blob is invalid
      const uploadPayload = croppedBlob || originalFile;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, uploadPayload, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        if (multiple) {
          onChange([...safeImages, data.publicUrl]);
        } else {
          onChange([data.publicUrl]);
        }
      }

      if (currentCropIndex < pendingFiles.length - 1) {
        setCurrentCropIndex(prev => prev + 1);
      } else {
        setIsCropping(false);
        setPendingFiles([]);
        setCurrentCropIndex(0);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ' + (error.message || error.error_description || JSON.stringify(error)));
      setIsCropping(false);
      setPendingFiles([]);
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setPendingFiles([]);
    setCurrentCropIndex(0);
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      if (multiple) {
        onChange([...safeImages, trimmed]);
      } else {
        onChange([trimmed]);
      }
      setUrlInput('');
    }
  };

  const handleRemove = (indexToRemove) => {
    onChange(safeImages.filter((_, index) => index !== indexToRemove));
  };

  const currentObjectUrl = React.useMemo(() => {
    if (isCropping && pendingFiles[currentCropIndex]) {
      return URL.createObjectURL(pendingFiles[currentCropIndex]);
    }
    return null;
  }, [isCropping, pendingFiles, currentCropIndex]);

  React.useEffect(() => {
    return () => {
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [currentObjectUrl]);

  return (
    <div className="image-uploader border rounded-lg p-4 bg-gray-50/50">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-semibold text-gray-700">{label} ({safeImages.length})</label>
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
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors bg-white">
              <input
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id={`image-upload-${label}`}
              />
              <label
                htmlFor={`image-upload-${label}`}
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-600">
                  {uploading ? 'กำลังอัปโหลด...' : 'คลิกเพื่อเลือกรูปภาพ'}
                </span>
                <span className="text-xs text-gray-400">
                  รองรับ JPG, PNG, WEBP (เลือกได้หลายไฟล์)
                </span>
              </label>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                placeholder="วางลิงก์รูปภาพ (URL)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button
              type="button"
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              เพิ่ม
            </button>
          </div>
        )}
      </div>

      {safeImages.length > 0 && (
        <div className={`grid gap-3 mt-4 ${isLogo ? 'grid-cols-3 sm:grid-cols-4 max-w-sm' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'}`}>
          {safeImages.map((img, idx) => (
            <div 
              key={idx} 
              className={`relative rounded-lg overflow-hidden border border-gray-200 bg-white group shadow-sm flex items-center justify-center ${isLogo ? 'h-24 p-2 bg-white' : 'h-28'}`}
            >
              <img 
                src={img} 
                alt={`Uploaded ${idx}`} 
                className={`w-full h-full ${isLogo ? 'object-contain' : 'object-cover'}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/400x300?text=Invalid+Image';
                }}
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className={`absolute bg-white/90 text-red-500 hover:bg-red-50 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm ${isLogo ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full' : 'top-1 right-1'}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {isCropping && currentObjectUrl && (
        <ImageCropper
          imageSrc={currentObjectUrl}
          onCropDone={handleCropDone}
          onCropCancel={handleCropCancel}
          onSkipCrop={() => handleCropDone(pendingFiles[currentCropIndex])}
        />
      )}
    </div>
  );
}
