import React, { useState, useEffect } from 'react';

export default function AnimatedCounter({ value = 0, duration = 1200, suffix = '', prefix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = typeof value === 'number' ? value : parseInt(String(value).replace(/,/g, ''), 10) || 0;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }

    const startTime = performance.now();
    let animationFrame;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);
      
      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [value, duration]);

  const formatted = typeof value === 'number' && value > 999 
    ? displayValue.toLocaleString() 
    : displayValue;

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  );
}
