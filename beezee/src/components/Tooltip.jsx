import { useState, useEffect, useRef } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { announceToScreenReader } from '../utils/accessibility';

/**
 * Tooltip Component
 * Shows helpful hints for first-time users
 */
export default function Tooltip({ 
  children, 
  content, 
  position = 'top',
  showOnHover = false,
  persistent = false,
  id,
  ariaLabel,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    // Check if tooltip was previously dismissed
    const dismissedKey = `tooltip-dismissed-${id}`;
    if (id && localStorage.getItem(dismissedKey)) {
      setIsDismissed(true);
      return;
    }

    // Show tooltip on mount if not persistent
    if (!persistent && !showOnHover) {
      setIsVisible(true);
      if (content) {
        announceToScreenReader(content);
      }
    }
  }, [id, persistent, showOnHover, content]);

  useEffect(() => {
    if (!isVisible || !tooltipRef.current) return;

    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        if (!persistent) {
          setIsVisible(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible, persistent]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    
    if (id) {
      localStorage.setItem(`tooltip-dismissed-${id}`, 'true');
    }
  };

  const handleMouseEnter = () => {
    if (showOnHover) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (showOnHover && !persistent) {
      setIsVisible(false);
    }
  };

  if (isDismissed && !persistent) {
    return children;
  }

  const positionClasses = {
    top: 'tooltip-top',
    bottom: 'tooltip-bottom',
    left: 'tooltip-left',
    right: 'tooltip-right',
  };

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={triggerRef} className="tooltip-trigger">
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`tooltip ${positionClasses[position] || positionClasses.top}`}
          role="tooltip"
          aria-label={ariaLabel || content}
          id={id ? `tooltip-${id}` : undefined}
        >
          <div className="tooltip-content">
            {content}
          </div>
          {!persistent && (
            <button
              onClick={handleDismiss}
              className="tooltip-close"
              aria-label="Close tooltip"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Help Icon with Tooltip
 */
export function HelpTooltip({ content, position = 'top', id }) {
  return (
    <Tooltip content={content} position={position} id={id} showOnHover>
      <button
        type="button"
        className="help-tooltip-trigger"
        aria-label="Help"
      >
        <HelpCircle size={16} />
      </button>
    </Tooltip>
  );
}

/**
 * First Time Hint Component
 * Shows hints for first-time users that can be dismissed
 */
export function FirstTimeHint({ 
  id, 
  content, 
  children, 
  position = 'top',
  storageKey,
}) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const key = storageKey || `hint-${id}`;
    const wasShown = localStorage.getItem(key);
    
    if (!wasShown) {
      setShowHint(true);
    }
  }, [id, storageKey]);

  const handleDismiss = () => {
    setShowHint(false);
    const key = storageKey || `hint-${id}`;
    localStorage.setItem(key, 'true');
  };

  if (!showHint) {
    return children;
  }

  return (
    <Tooltip
      content={content}
      position={position}
      id={id}
      persistent
    >
      {children}
    </Tooltip>
  );
}






