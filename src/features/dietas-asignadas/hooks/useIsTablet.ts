import { useState, useEffect } from 'react';

export const useIsTablet = (minWidth: number = 768, maxWidth: number = 1024): boolean => {
  const [isTablet, setIsTablet] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const width = window.innerWidth;
    return width >= minWidth && width < maxWidth;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsTablet(width >= minWidth && width < maxWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [minWidth, maxWidth]);

  return isTablet;
};

