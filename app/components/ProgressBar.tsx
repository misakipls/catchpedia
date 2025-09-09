'use client'

interface ProgressBarProps {
  progress: number // 0-100
  size?: 'small' | 'medium' | 'large'
  color?: string
  showPercentage?: boolean
  className?: string
}

export default function ProgressBar({ 
  progress, 
  size = 'medium',
  color = 'var(--prussian-blue)',
  showPercentage = false,
  className = '' 
}: ProgressBarProps) {
  const sizeClasses = {
    small: 'progress-small',
    medium: 'progress-medium',
    large: 'progress-large'
  }

  return (
    <div className={`progress-container ${sizeClasses[size]} ${className}`}>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${Math.min(100, Math.max(0, progress))}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
      {showPercentage && (
        <span className="progress-text">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}
