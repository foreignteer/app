'use client';

import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/Button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compress image before upload
  const compressImage = (file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas to Blob conversion failed'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Image loading failed'));
      };
      reader.onerror = () => reject(new Error('File reading failed'));
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const storage = getStorage();
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }

        // TEMPORARILY DISABLED COMPRESSION FOR DEBUGGING
        console.log('Starting upload for:', file.name, 'Size:', file.size);

        // Create unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const extension = file.name.split('.').pop() || 'jpg';
        const filename = `experiences/${timestamp}-${randomString}.${extension}`;

        console.log('Uploading to:', filename);

        // Upload original file to Firebase Storage (NO COMPRESSION)
        const storageRef = ref(storage, filename);
        console.log('Storage ref created, starting upload...');

        await uploadBytes(storageRef, file);
        console.log('Upload complete, getting download URL...');

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Download URL obtained:', downloadURL);
        return downloadURL;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
    } catch (err) {
      console.error('Upload error:', err);
      // Show detailed error message
      const errorMessage = err instanceof Error
        ? err.message
        : typeof err === 'object' && err !== null && 'code' in err
        ? `Firebase error: ${(err as any).code} - ${(err as any).message}`
        : 'Failed to upload images';
      setError(errorMessage);
      alert(`Upload failed: ${errorMessage}`); // Show alert for debugging
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Experience Images
        </label>
        <p className="text-sm text-text-muted mb-3">
          Upload up to {maxImages} high-quality images. First image is used as the thumbnail (384×216px on cards) and banner (1200×675px on detail page). Recommended: landscape photos, min. 1200px wide.
        </p>

        {/* Upload Button */}
        {images.length < maxImages && (
          <div>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <label htmlFor="image-upload">
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                isLoading={uploading}
                onClick={() => document.getElementById('image-upload')?.click()}
                as="span"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Images'}
              </Button>
            </label>
          </div>
        )}

        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video relative rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={url}
                  alt={`Experience image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-text-muted">
            No images uploaded yet
          </p>
        </div>
      )}
    </div>
  );
}
