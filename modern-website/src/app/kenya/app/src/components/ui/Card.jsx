import { forwardRef } from 'react';

/**
 * Card Component - BeeZee Design System
 * 
 * Variants:
 * - default: Standard white card
 * - stat-income: Card with green left border
 * - stat-expense: Card with red left border
 * - stat-info: Card with blue left border
 * 
 * Props:
 * - hoverable: Adds hover effect
 * - onClick: Makes card clickable
 */

const Card = forwardRef(({ 
  children, 
  variant = 'default',
  hoverable = false,
  onClick,
  className = '',
  ...props 
}, ref) => {
  const baseClass = 'card';
  
  const variantClasses = {
    default: '',
    'stat-income': 'stat-card-income',
    'stat-expense': 'stat-card-expense',
    'stat-info': 'stat-card-info',
  };
  
  const hoverClass = (hoverable || onClick) ? 'card-hover' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';
  
  const classes = `
    ${baseClass}
    ${variantClasses[variant] || ''}
    ${hoverClass}
    ${clickableClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div
      ref={ref}
      className={classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;


