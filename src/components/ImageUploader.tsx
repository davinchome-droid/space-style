'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onImageSelect, isLoading }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-12
            transition-all duration-300 cursor-pointer
            ${isDragging
              ? 'border-[var(--accent)] bg-orange-50 scale-[1.02]'
              : 'border-gray-300 hover:border-[var(--accent)] hover:bg-gray-50'
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />

          <div className="flex flex-col items-center gap-4 text-center">
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center
              ${isDragging ? 'accent-gradient' : 'bg-gray-100'}
              transition-all duration-300
            `}>
              <Upload className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-gray-400'}`} />
            </div>

            <div>
              <p className="text-xl font-semibold text-[var(--primary)]">
                공간 사진을 업로드하세요
              </p>
              <p className="text-gray-500 mt-2">
                드래그 앤 드롭 또는 클릭하여 선택
              </p>
            </div>

            <div className="flex gap-2 mt-2">
              {['거실', '침실', '주방', '오피스'].map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src={preview}
            alt="업로드된 이미지"
            className="w-full h-auto max-h-[500px] object-cover"
          />

          {!isLoading && (
            <button
              onClick={clearImage}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70
                       rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              <p className="text-white mt-4 text-lg font-medium">AI가 공간을 분석하고 있습니다...</p>
              <p className="text-white/70 mt-2 text-sm">약 10-20초 소요됩니다</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
