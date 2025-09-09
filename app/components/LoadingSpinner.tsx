'use client'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = 'var(--prussian-blue)',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }

  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`}>
      <div className="spinner-ring" style={{ borderColor: color }}>
        <div className="spinner-ring-fill" style={{ borderColor: color }}></div>
      </div>
    </div>
  )
}
