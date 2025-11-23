import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
}

interface FeatureTourProps {
  steps: TourStep[];
  storageKey: string;
  onFinish?: () => void;
  // If true, forces the tour to check storage and potentially start. 
  // If false, it won't render. 
  isActive: boolean; 
}

export const FeatureTour: React.FC<FeatureTourProps> = ({ steps, storageKey, onFinish, isActive }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (isActive) {
      const hasSeen = localStorage.getItem(storageKey);
      if (!hasSeen) {
        setIsVisible(true);
      }
    } else {
        setIsVisible(false);
    }
  }, [isActive, storageKey]);

  const updateTargetRect = useCallback(() => {
    if (!isVisible) return;
    
    const step = steps[currentStep];
    const element = document.getElementById(step.targetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect(rect);
      }
    } else {
        // Fallback if element not found: Center or use window
        // For now, just null to hide spotlight, or we could show center modal
        console.warn(`FeatureTour: Target element ${step.targetId} not found.`);
        // Optional: setTargetRect(null) or handle gracefully
    }
  }, [currentStep, isVisible, steps]);

  useEffect(() => {
    if (isVisible) {
      // Delay to allow modal/content to render
      const timer = setTimeout(updateTargetRect, 300);
      window.addEventListener('resize', updateTargetRect);
      window.addEventListener('scroll', updateTargetRect, true);
      
      return () => {
        window.removeEventListener('resize', updateTargetRect);
        window.removeEventListener('scroll', updateTargetRect, true);
        clearTimeout(timer);
      };
    }
  }, [isVisible, currentStep, updateTargetRect]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(storageKey, 'true');
    if (onFinish) onFinish();
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isVisible || !targetRect) return null;

  const step = steps[currentStep];
  const position = step.position || 'bottom';

  // Calculate Tooltip Position
  let tooltipStyle: React.CSSProperties = {};
  const offset = 16;
  const tooltipWidth = 320;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  switch (position) {
    case 'right':
      tooltipStyle = {
        top: targetRect.top + (targetRect.height / 2) - 100,
        left: targetRect.right + offset,
      };
      break;
    case 'left':
      tooltipStyle = {
        top: targetRect.top + (targetRect.height / 2) - 100,
        left: targetRect.left - tooltipWidth - offset,
      };
      break;
    case 'top':
      tooltipStyle = {
        top: targetRect.top - offset - 200, // Approximate height of tooltip
        left: targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2),
      };
      break;
    case 'bottom':
      tooltipStyle = {
        top: targetRect.bottom + offset,
        left: targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2),
      };
      break;
    case 'center':
    default:
        tooltipStyle = {
            top: windowHeight / 2 - 100,
            left: windowWidth / 2 - (tooltipWidth / 2),
        };
        break;
  }

  // Boundary adjustments
  if ((tooltipStyle.left as number) < 10) tooltipStyle.left = 10;
  if ((tooltipStyle.left as number) + tooltipWidth > windowWidth - 10) {
    tooltipStyle.left = windowWidth - tooltipWidth - 10;
  }
  if ((tooltipStyle.top as number) < 10) tooltipStyle.top = 10;
  // Simple bottom check
  if ((tooltipStyle.top as number) > windowHeight - 100) tooltipStyle.top = windowHeight - 300;


  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* Spotlight Overlay */}
      <div className="absolute inset-0 bg-black/50 transition-opacity duration-500" />
      
      {/* Spotlight Hole */}
      <div 
        className="absolute transition-all duration-300 ease-in-out border-2 border-white/50 rounded-lg box-content"
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
        }}
      />

      {/* Tooltip */}
      <div 
        className="absolute bg-white p-5 rounded-xl shadow-2xl w-80 pointer-events-auto flex flex-col animate-in fade-in zoom-in-95 duration-200"
        style={tooltipStyle}
      >
        <button 
          onClick={handleSkip}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
          aria-label="Cerrar tour"
        >
          <X size={16} />
        </button>

        <div className="mb-3">
            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-2">
                Tip {currentStep + 1}/{steps.length}
            </span>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {step.title}
            </h3>
        </div>

        <p className="text-gray-600 text-sm mb-5 leading-relaxed">
          {step.content}
        </p>

        <div className="flex justify-between items-center mt-auto">
            {steps.length > 1 ? (
                <div className="flex gap-2">
                     <button 
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${currentStep === 0 ? 'text-gray-300 pointer-events-none' : 'text-gray-600'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={handleNext}
                         className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-blue-600"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            ) : (
                <div /> // Spacer
            )}
         
            <button 
                onClick={handleNext}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
                {currentStep === steps.length - 1 ? 'Entendido' : 'Siguiente'}
            </button>
        </div>
      </div>
    </div>
  );
};
