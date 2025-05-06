// src/components/products/ImageUploader.tsx
import { useState, useEffect, ChangeEvent } from 'react';
import React from "react";

type ImageItem = File | string; // File mới hoặc URL cũ
interface ImageUploaderProps {
  onImagesUpdate: (images: File[], existing: string[]) => void;
  initialImages?: string[] | File[];
}

const ImageUploader = ({ onImagesUpdate, initialImages = [] }: ImageUploaderProps) => {
  const [images, setImages] = useState<ImageItem[]>([...initialImages]);
  const [previews, setPreviews] = useState<string[]>([]);
  console.log("images",images)

  useEffect(() => {
    setImages([...initialImages])
  }, [initialImages])
  // Tạo previews khi images thay đổi
  useEffect(() => {
    // Xóa previews cũ để tránh memory leak
    previews.forEach(URL.revokeObjectURL);
    
    // Tạo previews mới
    const newPreviews = images.map(file => 
      typeof file === 'string'
      ? file
      :URL.createObjectURL(file));
    setPreviews(newPreviews);
    
    // Callback để truyền images ra ngoài
    const files = images.filter(img => img instanceof File) as File[];
    const exsiting = images.filter(img => img === 'string') as string[];
    onImagesUpdate(files, exsiting);
    
    // Cleanup khi component unmount
    return () => {
      newPreviews.forEach(URL.revokeObjectURL);
    };
  }, [images]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...filesArray]);
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