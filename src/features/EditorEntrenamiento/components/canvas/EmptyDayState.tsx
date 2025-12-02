import React from 'react';
import { Copy, Sparkles, Plus } from 'lucide-react';

interface EmptyDayStateProps {
  dayName: string;
  isMonday: boolean;
  onCopyFromMonday?: () => void;
  onSmartFill?: () => void;
  isCompact?: boolean;
}

export const EmptyDayState: React.FC<EmptyDayStateProps> = ({
  dayName,
  isMonday,
  onCopyFromMonday,
  onSmartFill,
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
          {/* Prominent SmartFill Button */}
          {onSmartFill && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSmartFill();
              }}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles size={16} className="animate-pulse" />
              <span>Rellenar con IA</span>
            </button>
          )}

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
        </div>
      )}
    </div>
  );
};
