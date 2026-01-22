/**
 * LoadingSpinner Component - BeeZee Design System
 * 
 * Simple loading spinner
 */

export default function LoadingSpinner({ size = 'default', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <div 
      className={`spinner ${sizeClasses[size] || sizeClasses.default} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}


