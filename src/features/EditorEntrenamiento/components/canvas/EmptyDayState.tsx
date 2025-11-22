import React from 'react';
import { Copy, Sparkles, Plus } from 'lucide-react';

interface EmptyDayStateProps {
  dayName: string;
  isMonday: boolean;
  onCopyFromMonday?: () => void;
  onUseAI?: () => void;
  isCompact?: boolean;
}

export const EmptyDayState: React.FC<EmptyDayStateProps> = ({
  dayName,
  isMonday,
  onCopyFromMonday,
  onUseAI,
  isCompact = false
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center h-full w-full rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors ${isCompact ? 'p-2' : 'p-4 gap-3'}`}>
      
      {!isCompact && (
        <div className="text-gray-300">
          <Plus size={24} />
        </div>
      )}

      <div className="space-y-1">
        <p className={`font-medium text-gray-400 ${isCompact ? 'text-xs' : 'text-sm'}`}>
          {isCompact ? 'Vacío' : 'Día sin entrenamiento'}
        </p>
        {!isCompact && (
          <p className="text-xs text-gray-400">
            Arrastra bloques aquí
          </p>
        )}
      </div>

      {!isCompact && (
        <div className="flex flex-col gap-2 w-full mt-2">
          {!isMonday && onCopyFromMonday && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCopyFromMonday();
              }}
              className="flex items-center justify-center gap-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-1.5 px-2 rounded transition-colors"
            >
              <Copy size={12} />
              <span>Copiar del Lunes</span>
            </button>
          )}
          
          {onUseAI && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onUseAI();
              }}
              className="flex items-center justify-center gap-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 py-1.5 px-2 rounded transition-colors"
            >
              <Sparkles size={12} />
              <span>Asistente IA</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
