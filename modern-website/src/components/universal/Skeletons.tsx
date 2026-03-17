import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonBase: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div 
      className={`bg-gray-200/60 animate-pulse rounded-md ${className}`} 
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-card p-4 space-y-3 w-full">
      <div className="flex justify-between items-center">
        <SkeletonBase className="h-5 w-1/3" />
        <SkeletonBase className="h-5 w-8 rounded-full" />
      </div>
      <SkeletonBase className="h-8 w-1/2 mt-2" />
      <div className="flex justify-between pt-2">
        <SkeletonBase className="h-4 w-1/4" />
        <SkeletonBase className="h-4 w-1/4" />
      </div>
    </div>
  );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 glass-regular rounded-xl">
          <SkeletonBase className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBase className="h-4 w-3/4" />
            <SkeletonBase className="h-3 w-1/2" />
          </div>
          <SkeletonBase className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 w-full p-4">
      {/* Target Skeleton */}
      <SkeletonBase className="h-32 w-full rounded-2xl" />
      
      {/* Buttons Row */}
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBase className="h-16 w-full rounded-2xl" />
        <SkeletonBase className="h-16 w-full rounded-2xl" />
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      
      {/* List Skeletons */}
      <div className="space-y-2 pt-4">
        <SkeletonBase className="h-5 w-32 mb-2" />
        <ListSkeleton count={2} />
      </div>
    </div>
  );
};
