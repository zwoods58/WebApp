"use client";

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down more than 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-4 z-40 bg-[var(--powder-dark)] text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:bg-[var(--powder-darker)] focus:outline-none focus:ring-2 focus:ring-[var(--powder-mid)] focus:ring-offset-2 ${
        isVisible ? 'opacity-100 translate-y-0 bottom-24' : 'opacity-0 translate-y-10 pointer-events-none bottom-24'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  );
}
