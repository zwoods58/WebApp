"use client";

import React, { useRef, useState, TouchEvent } from 'react';
import { Trash2, Edit } from 'lucide-react';

interface SwipeableItemProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
  id: string | number;
}

export const SwipeableItem: React.FC<SwipeableItemProps> = ({ 
  children, 
  onDelete, 
  onEdit, 
  id 
}) => {
  const [offsetX, setOffsetX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const startX = useRef<number>(0);
  const currentX = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ACTION_THRESHOLD = 70;
  const MAX_SWIPE = 100;

  const handleTouchStart = (e: TouchEvent) => {
    setIsSwiping(true);
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping) return;
    
    const newX = e.touches[0].clientX;
    const diff = newX - startX.current;
    currentX.current = newX;
    
    // Calculate new offset with resistance
    let newOffset = diff;
    
    // Add resistance when exceeding max swipe
    if (Math.abs(diff) > MAX_SWIPE) {
      const resistance = (Math.abs(diff) - MAX_SWIPE) * 0.3;
      newOffset = diff > 0 ? MAX_SWIPE + resistance : -MAX_SWIPE - resistance;
    }
    
    setOffsetX(newOffset);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    const distance = currentX.current - startX.current;
    
    // Swipe left for delete
    if (distance < -ACTION_THRESHOLD && onDelete) {
      // Vibrate if supported
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
      // Snap to show delete action
      setOffsetX(-MAX_SWIPE);
    } 
    // Swipe right for edit
    else if (distance > ACTION_THRESHOLD && onEdit) {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
      // Snap to show edit action
      setOffsetX(MAX_SWIPE);
    } 
    // Snap back to center
    else {
      setOffsetX(0);
    }
    
    // Auto close after 3 seconds if open
    if (Math.abs(offsetX) >= MAX_SWIPE) {
      timeoutRef.current = setTimeout(() => {
        setOffsetX(0);
      }, 3000);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setOffsetX(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
    setOffsetX(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const isOpenLeft = offsetX <= -MAX_SWIPE;
  const isOpenRight = offsetX >= MAX_SWIPE;

  return (
    <div className="relative w-full overflow-hidden mb-2 rounded-[var(--radius-button)]">
      {/* Background Actions */}
      <div className="absolute inset-0 flex justify-between items-center px-4 rounded-[var(--radius-button)] bg-gray-100">
        <button
          onClick={handleEdit}
          className={`flex items-center text-[var(--powder-dark)] h-full w-1/2 transition-opacity duration-200 ${isOpenRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Edit"
        >
          <Edit size={20} />
          <span className="ml-2 text-sm">Edit</span>
        </button>
        <button
          onClick={handleDelete}
          className={`flex items-center justify-end text-red-500 h-full w-1/2 transition-opacity duration-200 ${isOpenLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Delete"
        >
          <span className="mr-2 text-sm">Delete</span>
          <Trash2 size={20} />
        </button>
      </div>

      {/* Foreground Content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 bg-white w-full rounded-[var(--radius-button)] shadow-sm swipe-animation transform-gpu cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate3d(${offsetX}px, 0, 0)`,
          transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)'
        }}
      >
        {children}
      </div>
    </div>
  );
};