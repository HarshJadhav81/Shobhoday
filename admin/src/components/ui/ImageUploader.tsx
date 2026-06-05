import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { MediaService } from '../../services/media.service';

interface ImageUploaderProps {
  folder: 'products' | 'categories' | 'banners' | 'blogs' | 'users' | 'variants';
  onUploadSuccess: (mediaId: string, url: string) => void;
  onUploadError?: (error: string) => void;
  defaultPreview?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  folder, 
  onUploadSuccess, 
  onUploadError,
  defaultPreview,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      onUploadError?.('File size exceeds 5MB limit');
      return;
    }

    try {
      setIsUploading(true);
      const media = await MediaService.upload(file, folder);
      setPreview(media.secureUrl);
      onUploadSuccess(media._id, media.secureUrl);
    } catch (error: any) {
      onUploadError?.(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    setPreview(null);
    onUploadSuccess('', ''); // Notify parent that image is removed
  };

  return (
    <div className={`relative ${className}`}>
      {preview ? (
        <div className="relative group w-full h-48 rounded-lg overflow-hidden border border-gray-200">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleClear}
              className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-black transition-colors cursor-pointer bg-gray-50 relative"
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 mb-1">Click to upload</span>
              <span className="text-xs">PNG, JPG, WEBP up to 5MB</span>
            </div>
          )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp, image/gif"
        className="hidden"
      />
    </div>
  );
};
