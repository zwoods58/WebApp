"use client";

import React, { useState, useEffect } from 'react';

export default function DotScrollIndicator() {
  const [activeSection, setActiveSection] = useState(0);
  
  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'process', label: 'Process' },
    { id: 'cta', label: 'Get Started' },
    { id: 'footer', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight);
      const sectionIndex = Math.min(Math.floor(scrollPercentage * sections.length), sections.length - 1);
      
      setActiveSection(sectionIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const targetId = sections[index].id;
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll to percentage position
      const scrollPercentage = index / (sections.length - 1);
      const targetScroll = scrollPercentage * (document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col gap-3">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            className="group relative"
            title={section.label}
          >
            <div
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                activeSection === index
                  ? 'bg-orange-500 border-orange-500 scale-125'
                  : 'bg-white/30 border-white/50 hover:bg-white/50 hover:border-white/70 hover:scale-110'
              }`}
            />
            
            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {section.label}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
