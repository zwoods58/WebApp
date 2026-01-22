/**
 * Badge Component - BeeZee Design System
 * 
 * Small status indicators
 */

export default function Badge({ children, variant = 'neutral', className = '' }) {
  const variantClasses = {
    success: 'badge-success',
    danger: 'badge-danger',
    info: 'badge-info',
    neutral: 'badge-neutral',
  };
  
  const classes = `
    badge
    ${variantClasses[variant] || variantClasses.neutral}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
}


