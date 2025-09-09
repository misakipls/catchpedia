'use client'

interface SkeletonLoaderProps {
  type?: 'text' | 'card' | 'list' | 'image'
  lines?: number
  className?: string
}

export default function SkeletonLoader({ 
  type = 'text', 
  lines = 3,
  className = '' 
}: SkeletonLoaderProps) {
  if (type === 'card') {
    return (
      <div className={`skeleton-card ${className}`}>
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
        </div>
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className={`skeleton-list ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="skeleton-list-item">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-list-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'image') {
    return (
      <div className={`skeleton-image ${className}`}></div>
    )
  }

  // Default text skeleton
  return (
    <div className={`skeleton-text-container ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index} 
          className={`skeleton-text ${index === lines - 1 ? 'short' : ''}`}
        ></div>
      ))}
    </div>
  )
}
