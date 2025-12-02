import React from 'react';
import { Copy, Sparkles, LayoutTemplate, ArrowRight } from 'lucide-react';

interface EmptyWeekStateProps {
  weekNumber: number;
  onCopyPreviousWeek?: () => void;
  onUseAI?: () => void;
  onLoadTemplate?: () => void;
}

export const EmptyWeekState: React.FC<EmptyWeekStateProps> = ({
  weekNumber,
  onCopyPreviousWeek,
  onUseAI,
  onLoadTemplate
}) => {
  return (
    <div className="w-full p-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/30 flex flex-col items-center justify-center text-center gap-4 my-4">
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-semibold text-gray-600">
          Semana {weekNumber} está vacía
        </h3>
        <p className="text-sm text-gray-500">
          Comienza añadiendo ejercicios manualmente a los días o utiliza estas herramientas rápidas para estructurar tu semana.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-2">
        {onCopyPreviousWeek && weekNumber > 1 && (
          <button 
            onClick={onCopyPreviousWeek}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all"
          >
            <Copy size={16} className="text-blue-500" />
            Copiar Semana {weekNumber - 1}
          </button>
        )}

        {onUseAI && (
          <button 
            onClick={onUseAI}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:border-purple-300 hover:text-purple-600 transition-all"
          >
            <Sparkles size={16} className="text-purple-500" />
            Generar con IA
          </button>
        )}

        {onLoadTemplate && (
          <button 
            onClick={onLoadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:border-green-300 hover:text-green-600 transition-all"
          >
            <LayoutTemplate size={16} className="text-green-500" />
            Cargar Plantilla
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
        <span>O arrastra bloques directamente al grid inferior</span>
        <ArrowRight size={12} className="rotate-90" />
      </div>
    </div>
  );
};
