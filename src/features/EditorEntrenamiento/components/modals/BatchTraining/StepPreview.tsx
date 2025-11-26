import React from 'react';
import { ds } from '../../../../../features/adherencia/ui/ds';
import { BatchConfig, BatchActionType } from '../../../hooks/useBatchTraining';

interface StepPreviewProps {
  config?: BatchConfig;
  action?: BatchActionType;
}

export const StepPreview: React.FC<StepPreviewProps> = ({ config, action }) => {
  // Mock summary derived from config if available, otherwise static
  const weekCount = config ? config.weekRange.end - config.weekRange.start + 1 : 4;
  
  const getTitle = () => {
    switch (action) {
      case 'linear_progression': return 'PROGRESIÓN LINEAL';
      case 'duplicate_week': return 'DUPLICAR SEMANA';
      case 'mass_adjustment': return 'AJUSTE MASIVO';
      case 'reorganize_days': return 'REORGANIZAR DÍAS';
      case 'apply_template': return 'APLICAR PLANTILLA';
      default: return 'CONFIGURACIÓN';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
         <span className="text-2xl">🔄</span>
         <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          {getTitle()} - Vista Previa
        </h3>
      </div>

      <p className="text-gray-600 dark:text-gray-300">
        Se aplicarán cambios en {weekCount} semanas:
      </p>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {/* Week 1 -> 2 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
             <h4 className="font-bold text-xs text-gray-500 uppercase mb-3 tracking-wider">Semana 1 → Semana 2</h4>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-700 dark:text-gray-300">• Bench Press:</span>
                    <span className="font-mono text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded">4x6 → 5x8</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-700 dark:text-gray-300">• Barbell Row:</span>
                    <span className="font-mono text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded">4x8 → 5x10</span>
                </div>
                 <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-700 dark:text-gray-300">• Overhead Press:</span>
                    <span className="font-mono text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded">3x8 → 4x10</span>
                </div>
                <div className="text-gray-400 italic mt-2 text-xs">... y 18 ejercicios más</div>
             </div>
        </div>

         {/* Week 2 -> 3 */}
        <div className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/10">
             <h4 className="font-bold text-xs text-gray-500 uppercase mb-3 tracking-wider">Semana 2 → Semana 3</h4>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center border-b border-yellow-100 dark:border-yellow-800/30 pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-700 dark:text-gray-300">• Bench Press:</span>
                    <span className="font-mono text-gray-600 dark:text-gray-400 flex items-center bg-white dark:bg-gray-800 px-2 py-0.5 rounded shadow-sm">
                        5x8 → 6x10 <span className="ml-2 text-yellow-600 font-bold text-xs">⚠️ (6 series)</span>
                    </span>
                </div>
                 <div className="flex justify-between items-center border-b border-yellow-100 dark:border-yellow-800/30 pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-gray-700 dark:text-gray-300">• Barbell Row:</span>
                    <span className="font-mono text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded shadow-sm">5x10 → 6x12</span>
                </div>
                <div className="text-gray-400 italic mt-2 text-xs">... y 18 ejercicios más</div>
             </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
            <span className="text-xl">⚠️</span>
            <div>
                <h4 className="font-bold text-orange-800 dark:text-orange-200 text-sm">ALERTAS (3):</h4>
                <ul className="list-disc list-inside text-sm text-orange-700 dark:text-orange-300 mt-1 space-y-1">
                    <li>4 ejercicios alcanzarán el límite de 6 series en Semana 3</li>
                    <li>1 ejercicio alcanzará el límite de 15 reps en Semana 4</li>
                    <li>Incremento de volumen Sem 2→3: +12% (recomendado: &lt;10%)</li>
                </ul>
            </div>
        </div>
      </div>

      <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">¿Continuar de todos modos?</p>
    </div>
  );
};
