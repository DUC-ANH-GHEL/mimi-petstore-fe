// src/components/products/ImageUploader.tsx
import { useState, useEffect, ChangeEvent } from 'react';
import React from "react";

type ImageItem = File | string; // File mới hoặc URL cũ
interface ImageUploaderProps {
  onImagesUpdate: (images: File[], existing: string[]) => void;
  initialImages?: Array<string | File>;
}

const ImageUploader = ({ onImagesUpdate, initialImages = [] }: ImageUploaderProps) => {
  const [images, setImages] = useState<ImageItem[]>([...initialImages]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setImages([...initialImages])
  }, [initialImages])
  // Tạo previews khi images thay đổi
  useEffect(() => {
    // Xóa previews cũ để tránh memory leak (chỉ blob URLs)
    previews.forEach((url) => {
      if (typeof url === 'string' && url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      }
    });
    
    // Tạo previews mới
    const newPreviews = images.map((file) => {
      if (typeof file === 'string') return file;
      try {
        return URL.createObjectURL(file);
      } catch {
        return '';
      }
    }).filter(Boolean);
    setPreviews(newPreviews);
    
    // Callback để truyền images ra ngoài
    const files = images.filter(img => img instanceof File) as File[];
    const existing = images.filter((img): img is string => typeof img === 'string');
    onImagesUpdate(files, existing);
    
    // Cleanup khi component unmount
    return () => {
      newPreviews.forEach((url) => {
        if (typeof url === 'string' && url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(url);
          } catch {
            // ignore
          }
        }
      });
    };
  }, [images, onImagesUpdate]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadError(null);
      const filesArray = Array.from(e.target.files);
      const valid: File[] = [];
      const rejected: string[] = [];

      filesArray.forEach((file) => {
        const isImage = (file.type ?? '').startsWith('image/');
        const maxBytes = 5 * 1024 * 1024;
        if (!isImage) {
          rejected.push(`${file.name}: không phải ảnh`);
          return;
        }
        if (file.size > maxBytes) {
          rejected.push(`${file.name}: > 5MB`);
          return;
        }
        valid.push(file);
      });

      if (rejected.length > 0) {
        setUploadError(`Ảnh không hợp lệ: ${rejected.join(' | ')}`);
      }

      if (valid.length > 0) {
        setImages((prev) => [...prev, ...valid]);
      }

      // allow selecting same file again
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Ảnh sản phẩm
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="images"
          name="images"
          className="hidden"
          onChange={handleImageUpload}
          multiple
          accept="image/*"
        />
        <label htmlFor="images" className="cursor-pointer">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-gray-500">
              Kéo thả hoặc click để chọn ảnh
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP tối đa 5MB</p>
          </div>
        </label>
      </div>

      {/* Image preview */}
      {uploadError && (
        <div className="mt-2 text-xs text-red-600">{uploadError}</div>
      )}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((src, index) => (
            <div key={index} className="relative">
              <img
                src={src}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                onClick={() => removeImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;