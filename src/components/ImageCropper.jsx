import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { Check, X, Maximize, RefreshCcw } from 'lucide-react';

export default function ImageCropper({ imageSrc, onCropDone, onCropCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      setIsProcessing(false);
      onCropDone(croppedBlob);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
      alert('เกิดข้อผิดพลาดในการตัดรูปภาพ');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">ปรับแต่งรูปภาพ (Crop Image)</h3>
          <button type="button" onClick={onCropCancel} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-gray-100 min-h-[400px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
          />
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-50 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Aspect Ratios */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">สัดส่วนภาพ</label>
              <div className="flex gap-2">
                {[
                  { label: '16:9 (หน้าปก)', value: 16 / 9 },
                  { label: '4:3', value: 4 / 3 },
                  { label: '1:1 (จัตุรัส)', value: 1 },
                  { label: '3:2', value: 3 / 2 },
                  { label: '9:16 (แนวตั้ง)', value: 9 / 16 },
                ].map((ratio) => (
                  <button
                    key={ratio.label}
                    type="button"
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`px-3 py-1 text-xs rounded-md border ${
                      aspectRatio === ratio.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rotation */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">หมุนภาพ</label>
              <button 
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="flex items-center gap-1 px-3 py-1 text-xs rounded-md border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                <RefreshCcw size={14} /> 90°
              </button>
            </div>
            
          </div>
          
          {/* Zoom Slider */}
          <div className="flex items-center gap-4">
            <Maximize size={18} className="text-gray-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="flex-1 accent-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button"
              onClick={onCropCancel}
              className="px-6 py-2 rounded-lg font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              type="button"
              onClick={showCroppedImage}
              disabled={isProcessing}
              className="px-6 py-2 rounded-lg font-semibold text-white bg-primary hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              {isProcessing ? 'กำลังประมวลผล...' : <><Check size={18} /> ยืนยันการตัดภาพ</>}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
