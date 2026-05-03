"use client";

import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export default function PhoneFrame({ children, className = "" }: PhoneFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Phone Frame */}
      <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
        {/* Screen */}
        <div className="bg-black rounded-[2.5rem] overflow-hidden">
          {/* Notch */}
          <div className="relative h-6 bg-black">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-black rounded-full"></div>
          </div>
          
          {/* Content Area */}
          <div className="bg-white" style={{ height: '600px' }}>
            {children}
          </div>
        </div>
        
        {/* Side Buttons */}
        <div className="absolute right-0 top-24 w-1 h-12 bg-gray-800 rounded-r"></div>
        <div className="absolute right-0 top-40 w-1 h-16 bg-gray-800 rounded-r"></div>
        <div className="absolute right-0 top-60 w-1 h-12 bg-gray-800 rounded-r"></div>
        
        {/* Volume Buttons */}
        <div className="absolute left-0 top-32 w-1 h-10 bg-gray-800 rounded-l"></div>
        <div className="absolute left-0 top-44 w-1 h-10 bg-gray-800 rounded-l"></div>
      </div>
    </div>
  );
}
