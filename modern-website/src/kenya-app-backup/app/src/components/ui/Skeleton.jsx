/**
 * Skeleton Component - BeeZee Design System
 * 
 * Loading placeholder that maintains layout
 */

export default function Skeleton({ 
  variant = 'text', // 'text' | 'circular' | 'rectangular'
  width,
  height,
  className = '',
}) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };
  
  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '40px' : '100px'),
  };
  
  return (
    <div
      className={`skeleton ${variantClasses[variant]} ${className}`}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  );
}

// Skeleton variations for common patterns
export function SkeletonCard() {
  return (
    <div className="card space-y-4">
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" height="2rem" width="60%" />
      <Skeleton variant="text" width="80%" />
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" width="48px" height="48px" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
          <Skeleton variant="text" width="80px" />
        </div>
      ))}
    </div>
  );
}


