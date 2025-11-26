import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  message: string;
  subMessage?: string;
  isOverlay?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  progress, 
  message, 
  subMessage,
  isOverlay = false
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl max-w-md w-full mx-auto">
      <div className="relative w-20 h-20 mb-6">
         {/* Spinner ring */}
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-indigo-700">{Math.round(progress)}%</span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 text-center animate-pulse">
        {message}
      </h3>
      
      {subMessage && (
        <p className="text-sm text-gray-500 mb-6 text-center">
          {subMessage}
        </p>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-2">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-gray-400 italic text-center">
        Por favor no cierres esta ventana
      </p>
    </div>
  );

  if (isOverlay) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl transition-all duration-300">
        {content}
      </div>
    );
  }

  return content;
};
