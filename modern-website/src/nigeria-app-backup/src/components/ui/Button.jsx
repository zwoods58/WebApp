import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button Component - BeeZee Design System
 * 
 * Variants:
 * - primary (default): Green background, white text
 * - secondary: Transparent with green border
 * - danger: Red background, white text
 * - info: Blue background, white text
 * 
 * Sizes:
 * - default: 56px height (full button size)
 * - sm: 48px height (touch minimum)
 * - icon: 56px x 56px (circular)
 */

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'default',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    info: 'btn-info',
  };
  
  const sizeClasses = {
    default: '',
    sm: 'btn-sm',
    icon: 'btn-icon',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const classes = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || ''}
    ${widthClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          {children && <span>Loading...</span>}
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;


