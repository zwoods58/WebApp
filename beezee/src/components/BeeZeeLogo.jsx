import { memo } from 'react';
import '../styles/beezee-logo.css';

/**
 * BeeZee Logo Component
 * Displays the BeeZee logo with bee emoji and app name
 * Memoized to prevent unnecessary re-renders
 * Uses inline styles and CSS classes to ensure it always renders
 */
const BeeZeeLogo = memo(function BeeZeeLogo({ className = '' }) {
  return (
    <div 
      className={`beezee-logo-container flex items-center gap-2 ${className}`}
      style={{ 
        minHeight: '32px',
        minWidth: '100px',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        visibility: 'visible',
        opacity: 1
      }}
    >
      <div 
        className="beezee-logo-emoji text-2xl" 
        style={{ 
          display: 'inline-block', 
          lineHeight: '1',
          visibility: 'visible',
          opacity: 1
        }}
      >
        🐝
      </div>
      <span 
        className="beezee-logo-text text-xl font-black text-gray-900" 
        style={{ 
          display: 'inline-block', 
          whiteSpace: 'nowrap',
          visibility: 'visible',
          opacity: 1
        }}
      >
        BeeZee
      </span>
    </div>
  );
});

BeeZeeLogo.displayName = 'BeeZeeLogo';

export default BeeZeeLogo;

