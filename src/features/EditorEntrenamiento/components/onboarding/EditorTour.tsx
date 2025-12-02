import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position: 'left' | 'right' | 'top' | 'bottom' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-editor-canvas',
    title: 'Panel Central',
    content: 'Aquí es donde trabajarás. Puedes ver tu programa en 3 vistas diferentes.',
    position: 'center', 
  },
  {
    targetId: 'tour-library-panel',
    title: 'Biblioteca',
    content: 'Aquí tienes tu biblioteca de ejercicios, bloques y plantillas. Arrastra y suelta.',
    position: 'right',
  },
  {
    targetId: 'tour-fitcoach-panel',
    title: 'FitCoach IA',
    content: 'FitCoach es tu asistente IA. Te ayuda a optimizar y crear programas.',
    position: 'left',
  },
];

export const EditorTour: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setIsVisible(true);
    }
  }, []);

  const updateTargetRect = useCallback(() => {
    const step = TOUR_STEPS[currentStep];
    const element = document.getElementById(step.targetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      // Ensure we have a valid rect (sometimes elements are hidden or 0 size)
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect(rect);
      }
    }
  }, [currentStep]);

  useEffect(() => {
    if (isVisible && mounted) {
      // Small delay to ensure layout is stable
      const timer = setTimeout(updateTargetRect, 200);
      window.addEventListener('resize', updateTargetRect);
      window.addEventListener('scroll', updateTargetRect, true); // Capture scroll events
      
      return () => {
        window.removeEventListener('resize', updateTargetRect);
        window.removeEventListener('scroll', updateTargetRect, true);
        clearTimeout(timer);
      };
    }
  }, [isVisible, currentStep, updateTargetRect, mounted]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  if (!isVisible || !targetRect) return null;

  const step = TOUR_STEPS[currentStep];

  // Calculate Tooltip Position
  let tooltipStyle: React.CSSProperties = {};
  const offset = 16;
  const tooltipWidth = 320;
  const windowWidth = window.innerWidth;

  if (step.position === 'right') {
    tooltipStyle = {
      top: targetRect.top + (targetRect.height / 2) - 100,
      left: targetRect.right + offset,
    };
  } else if (step.position === 'left') {
    tooltipStyle = {
      top: targetRect.top + (targetRect.height / 2) - 100,
      left: targetRect.left - tooltipWidth - offset,
    };
  } else {
    // Center/Default
    tooltipStyle = {
      top: targetRect.top + (targetRect.height / 2) - 100,
      left: targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2),
    };
  }

  // Boundary checks
  if ((tooltipStyle.left as number) < 10) tooltipStyle.left = 10;
  if ((tooltipStyle.left as number) + tooltipWidth > windowWidth - 10) {
    tooltipStyle.left = windowWidth - tooltipWidth - 10;
  }
  
  // Vertical boundary check
  if ((tooltipStyle.top as number) < 10) tooltipStyle.top = 10;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden pointer-events-none">
      {/* Spotlight Effect (The dark overlay with hole) */}
      <div 
        className="absolute transition-all duration-500 ease-in-out border-2 border-blue-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
        }}
      />

      {/* Tooltip */}
      <div 
        className="absolute bg-white p-6 rounded-xl shadow-2xl w-80 pointer-events-auto transition-all duration-500 ease-in-out flex flex-col"
        style={tooltipStyle}
      >
        <button 
          onClick={handleFinish}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Cerrar tour"
        >
          <X size={16} />
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                {currentStep + 1}
            </span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                / {TOUR_STEPS.length}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900">
            {step.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {step.content}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <button 
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center text-sm font-medium transition-colors ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            {currentStep === TOUR_STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}
            {currentStep < TOUR_STEPS.length - 1 && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
