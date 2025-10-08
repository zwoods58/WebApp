'use client';

import React, { useEffect, useRef } from 'react';

export interface LiquidEtherProps {
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
}

const defaultColors = ['#5227FF', '#FF9FFC', '#B19EEF'];

export default function LiquidEther({
  colors = defaultColors,
  style = {},
  className = '',
}: LiquidEtherProps): React.ReactElement {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    container.style.background = `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
    container.style.backgroundSize = '400% 400%';
    container.style.animation = 'gradientShift 8s ease infinite';

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [colors]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full relative overflow-hidden ${className || ''}`}
      style={style}
    />
  );
}