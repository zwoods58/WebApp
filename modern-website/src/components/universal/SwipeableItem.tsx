"use client";

import React, { useRef, useState } from 'react';
import { motion, useAnimation, useMotionValue, PanInfo } from 'framer-motion';
import { Trash2, Edit } from 'lucide-react';

interface SwipeableItemProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
  id: string | number;
}

export const SwipeableItem: React.FC<SwipeableItemProps> = ({ children, onDelete, onEdit, id }) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const ACTION_THRESHOLD = 70;

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsSwiping(false);
    
    // Swipe left for delete
    if (info.offset.x < -ACTION_THRESHOLD && onDelete) {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
      controls.start({ x: -100, transition: { type: 'spring', stiffness: 300, damping: 25 } });
      // Keep open or trigger delete immediately depending on UX preference
      // Here we snap it open to reveal the button fully
    } 
    // Swipe right for edit
    else if (info.offset.x > ACTION_THRESHOLD && onEdit) {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
      controls.start({ x: 100, transition: { type: 'spring', stiffness: 300, damping: 25 } });
    } 
    // Snap back
    else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } });
    }
  };

  const handleDragStart = () => {
    setIsSwiping(true);
  };

  return (
    <div className="relative w-full overflow-hidden mb-2 rounded-[var(--radius-button)]">
      {/* Background Actions */}
      <div className="absolute inset-0 flex justify-between items-center px-4 rounded-[var(--radius-button)] bg-gray-100">
        <div className="flex items-center text-[var(--powder-dark)] h-full w-1/2">
          {onEdit && <Edit size={20} />}
        </div>
        <div className="flex items-center justify-end text-red-500 h-full w-1/2">
          {onDelete && <Trash2 size={20} />}
        </div>
      </div>

      {/* Foreground Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: onDelete ? -100 : 0, right: onEdit ? 100 : 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="relative z-10 bg-white w-full rounded-[var(--radius-button)] shadow-sm"
      >
        {children}
      </motion.div>
    </div>
  );
};
