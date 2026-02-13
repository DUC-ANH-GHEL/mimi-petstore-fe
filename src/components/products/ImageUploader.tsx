// src/components/products/ImageUploader.tsx
import { useState, useEffect, ChangeEvent } from 'react';
import React from "react";
import imageCompression from 'browser-image-compression';

type ImageItem = File | string; // File mới hoặc URL cũ
interface ImageUploaderProps {
  onImagesUpdate: (images: File[], existing: string[]) => void;
  initialImages?: Array<string | File>;
  label?: string;
  helpText?: string;
  requiredPrimary?: boolean;
}

const ImageUploader = ({ onImagesUpdate, initialImages = [], label = 'Ảnh sản phẩm', helpText, requiredPrimary }: ImageUploaderProps) => {
  const [images, setImages] = useState<ImageItem[]>([...initialImages]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const dragIndexRef = React.useRef<number | null>(null);

  // Keep stable object URLs per File to avoid blob: URL churn and revoke-too-early issues
  const objectUrlMapRef = React.useRef<Map<File, string>>(new Map());

  useEffect(() => {
    setImages([...initialImages])
  }, [initialImages])

  // Tạo previews khi images thay đổi
  useEffect(() => {
    const map = objectUrlMapRef.current;

    // Revoke object URLs for Files that are no longer in the list
    const currentFiles = new Set<File>();
    images.forEach((img) => {
      if (img instanceof File) currentFiles.add(img);
    });
    for (const [file, url] of map.entries()) {
      if (!currentFiles.has(file)) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
        map.delete(file);
      }
    }

    // Build previews (reuse existing object URLs)
    const nextPreviews: string[] = images
      .map((img) => {
        if (typeof img === 'string') return img;
        const existing = map.get(img);
        if (existing) return existing;
        try {
          const created = URL.createObjectURL(img);
          map.set(img, created);
          return created;
        } catch {
          return '';
        }
      })
      .filter(Boolean);

    setPreviews(nextPreviews);
    
    // Callback để truyền images ra ngoài
    const files = images.filter(img => img instanceof File) as File[];
    const existing = images.filter((img): img is string => typeof img === 'string');
    onImagesUpdate(files, existing);
    
    // Cleanup khi component unmount
    return () => {
      // Do not revoke here; revoke is handled by removal + final unmount cleanup below.
    };
  }, [images, onImagesUpdate]);

  // Final unmount cleanup
  useEffect(() => {
    return () => {
      const map = objectUrlMapRef.current;
      for (const url of map.values()) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      }
      map.clear();
    };
  }, []);

  const compressIfNeeded = async (file: File): Promise<File> => {
    const maxBytes = 10 * 1024 * 1024;
    if (file.size <= maxBytes) return file;

    // SVG isn't reliably compressible via canvas; reject if too large
    if ((file.type ?? '') === 'image/svg+xml') {
      throw new Error(`${file.name}: SVG > 10MB không hỗ trợ nén`);
    }

    // Try to compress under 10MB
    const compressed = await imageCompression(file, {
      maxSizeMB: 10,
      maxWidthOrHeight: 2560,
      useWebWorker: true,
      initialQuality: 0.85,
    });

    // Library returns a File; keep original name for UX
    const result = compressed instanceof File
      ? compressed
      : new File([compressed], file.name, { type: file.type || 'image/jpeg' });

    if (result.size > maxBytes) {
      throw new Error(`${file.name}: không nén xuống <= 10MB (hiện ${(result.size / (1024 * 1024)).toFixed(1)}MB)`);
    }

    return result;
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    // allow selecting same file again
    const filesArray = Array.from(e.target.files);
    e.target.value = '';

    setUploadError(null);

    // Process asynchronously so UI doesn't freeze
    (async () => {
      const accepted: File[] = [];
      const rejected: string[] = [];

      for (const file of filesArray) {
        const isImage = (file.type ?? '').startsWith('image/');
        if (!isImage) {
          rejected.push(`${file.name}: không phải ảnh`);
          continue;
        }
        try {
          const finalFile = await compressIfNeeded(file);
          accepted.push(finalFile);
        } catch (err: any) {
          rejected.push(err?.message ? String(err.message) : `${file.name}: lỗi nén ảnh`);
        }
      }

      if (rejected.length > 0) {
        setUploadError(rejected.join(' | '));
      }

      if (accepted.length > 0) {
        setImages((prev) => [...prev, ...accepted]);
      }
    })();
  };

  const handleDropFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    (async () => {
      const accepted: File[] = [];
      const rejected: string[] = [];

      for (const file of files) {
        const isImage = (file.type ?? '').startsWith('image/');
        if (!isImage) {
          rejected.push(`${file.name}: không phải ảnh`);
          continue;
        }
        try {
          const finalFile = await compressIfNeeded(file);
          accepted.push(finalFile);
        } catch (err: any) {
          rejected.push(err?.message ? String(err.message) : `${file.name}: lỗi nén ảnh`);
        }
      }

      if (rejected.length > 0) setUploadError(rejected.join(' | '));
      if (accepted.length > 0) setImages((prev) => [...prev, ...accepted]);
    })();
  };

  const reorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
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
        {label}{requiredPrimary ? ' *' : ''}
      </label>
      {helpText && <div className="text-xs text-gray-500 mb-2">{helpText}</div>}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const dt = e.dataTransfer;
          const dropped = Array.from(dt?.files ?? []);
          handleDropFiles(dropped);
        }}
      >
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
            <p className="text-xs text-gray-500">Ảnh &gt; 10MB sẽ tự nén về &le; 10MB</p>
            <p className="text-xs text-gray-500">Kéo thả thumbnail để sắp xếp (ảnh đầu tiên là ảnh chính)</p>
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
            <div
              key={index}
              className="relative"
              draggable
              onDragStart={() => {
                dragIndexRef.current = index;
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={() => {
                const from = dragIndexRef.current;
                if (typeof from === 'number') reorder(from, index);
                dragIndexRef.current = null;
              }}
            >
              <img
                src={src}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover rounded-md"
              />
              {index === 0 && (
                <div className="absolute bottom-1 left-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-600 text-white">
                  Chính
                </div>
              )}
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