'use client'

import { useState, useRef } from 'react'

interface ImageGalleryProps {
  onImageSelect?: (imageUrl: string) => void
  className?: string
}

export default function ImageGallery({ onImageSelect, className = '' }: ImageGalleryProps) {
  const [images, setImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIsUploading(true)
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          setImages(prev => [...prev, imageUrl])
        }
        reader.readAsDataURL(file)
      }
    })
    
    setIsUploading(false)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleImageClick = (imageUrl: string) => {
    if (onImageSelect) {
      onImageSelect(imageUrl)
    }
  }

  return (
    <div className={`image-gallery ${className}`}>
      <div className="gallery-header">
        <h3>Image Gallery</h3>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="upload-btn"
          disabled={isUploading}
        >
          <i className="fas fa-plus"></i>
          {isUploading ? 'Uploading...' : 'Upload Images'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {images.length > 0 ? (
        <div className="gallery-grid">
          {images.map((imageUrl, index) => (
            <div key={index} className="gallery-item">
              <img
                src={imageUrl}
                alt={`Gallery image ${index + 1}`}
                onClick={() => handleImageClick(imageUrl)}
                className="gallery-image"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="remove-btn"
                title="Remove image"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="gallery-empty">
          <i className="fas fa-images"></i>
          <p>No images uploaded yet</p>
          <p className="gallery-hint">Click "Upload Images" to add images to your gallery</p>
        </div>
      )}
    </div>
  )
}
