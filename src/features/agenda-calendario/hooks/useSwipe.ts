import { useEffect, RefObject, useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface UseSwipeOptions {
  threshold?: number; // Distancia mínima en píxeles para considerar un swipe
  preventDefault?: boolean;
  elementRef?: RefObject<HTMLElement>;
}

/**
 * Hook para detectar gestos de swipe (deslizamiento) en dispositivos táctiles
 * @param handlers - Objeto con callbacks para cada dirección de swipe
 * @param options - Opciones de configuración (threshold, preventDefault, elementRef)
 */
export const useSwipe = (
  handlers: SwipeHandlers,
  options: UseSwipeOptions = {}
) => {
  const { threshold = 50, preventDefault = false, elementRef } = options;
  const minSwipeDistance = threshold;
  
  // Usar refs para almacenar posiciones sin causar re-renders
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);
  const handlersRef = useRef(handlers);

  // Actualizar handlers ref cuando cambien
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const element = elementRef?.current || (typeof window !== 'undefined' ? window : null);
    if (!element) return;

    const onTouchStart = (e: TouchEvent) => {
      if (preventDefault && e.cancelable) {
        e.preventDefault();
      }
      touchEndRef.current = null;
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (preventDefault && e.cancelable) {
        e.preventDefault();
      }
      touchEndRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const onTouchEnd = () => {
      const touchStart = touchStartRef.current;
      const touchEnd = touchEndRef.current;
      
      if (!touchStart || !touchEnd) {
        touchStartRef.current = null;
        touchEndRef.current = null;
        return;
      }

      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;
      const isLeftSwipe = distanceX > minSwipeDistance;
      const isRightSwipe = distanceX < -minSwipeDistance;
      const isUpSwipe = distanceY > minSwipeDistance;
      const isDownSwipe = distanceY < -minSwipeDistance;

      // Priorizar swipe horizontal sobre vertical
      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        if (isLeftSwipe && handlersRef.current.onSwipeLeft) {
          handlersRef.current.onSwipeLeft();
        }
        if (isRightSwipe && handlersRef.current.onSwipeRight) {
          handlersRef.current.onSwipeRight();
        }
      } else {
        if (isUpSwipe && handlersRef.current.onSwipeUp) {
          handlersRef.current.onSwipeUp();
        }
        if (isDownSwipe && handlersRef.current.onSwipeDown) {
          handlersRef.current.onSwipeDown();
        }
      }

      touchStartRef.current = null;
      touchEndRef.current = null;
    };

    const passiveOption = !preventDefault;
    element.addEventListener('touchstart', onTouchStart, { passive: passiveOption });
    element.addEventListener('touchmove', onTouchMove, { passive: passiveOption });
    element.addEventListener('touchend', onTouchEnd, { passive: passiveOption });

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [preventDefault, minSwipeDistance, elementRef]);
};

