import { useState, useEffect, RefObject } from 'react';

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

export const useSwipe = (
  handlers: SwipeHandlers,
  options: UseSwipeOptions = {}
) => {
  const { threshold = 50, preventDefault = false, elementRef } = options;
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = threshold;

  useEffect(() => {
    const element = elementRef?.current || window;
    if (!element) return;

    const onTouchStart = (e: TouchEvent) => {
      if (preventDefault && e.cancelable) {
        e.preventDefault();
      }
      setTouchEnd(null);
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    };

    const onTouchMove = (e: TouchEvent) => {
      if (preventDefault && e.cancelable) {
        e.preventDefault();
      }
      setTouchEnd({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) {
        setTouchStart(null);
        setTouchEnd(null);
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
        if (isLeftSwipe && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        }
        if (isRightSwipe && handlers.onSwipeRight) {
          handlers.onSwipeRight();
        }
      } else {
        if (isUpSwipe && handlers.onSwipeUp) {
          handlers.onSwipeUp();
        }
        if (isDownSwipe && handlers.onSwipeDown) {
          handlers.onSwipeDown();
        }
      }

      setTouchStart(null);
      setTouchEnd(null);
    };

    element.addEventListener('touchstart', onTouchStart, { passive: !preventDefault });
    element.addEventListener('touchmove', onTouchMove, { passive: !preventDefault });
    element.addEventListener('touchend', onTouchEnd, { passive: !preventDefault });

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [touchStart, touchEnd, handlers, preventDefault, minSwipeDistance, elementRef]);
};

