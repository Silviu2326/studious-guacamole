import React from 'react';
import { ds } from '../../../../../features/adherencia/ui/ds';
import { BatchConfig, BatchActionType } from '../../../hooks/useBatchTraining';

interface StepConfigurationProps {
  config: BatchConfig;
  onChange: (updates: Partial<BatchConfig>) => void;
  action: BatchActionType;
}

export const StepConfiguration: React.FC<StepConfigurationProps> = ({ config, onChange, action }) => {
  
  const updateRange = (field: 'start' | 'end', value: number) => {
    onChange({ 
      weekRange: { ...config.weekRange, [field]: value } 
    });
  };

  const updateIncrement = (field: keyof BatchConfig['increments'], value: number) => {
    onChange({
      increments: { ...config.increments, [field]: value }
    });
  };

  const weekOptions = Array.from({ length: 12 }, (_, i) => i + 1);

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
          {getTitle()} - Configuración
        </h3>
      </div>

      {/* 1. Range Selection */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700 dark:text-gray-300">1️⃣ Selecciona el rango de semanas:</label>
        <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Desde:</span>
                <select 
                  value={config.weekRange.start}
                  onChange={(e) => updateRange('start', Number(e.target.value))}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm"
                >
                    {weekOptions.map(w => <option key={w} value={w}>Semana {w}</option>)}
                </select>
            </div>
             <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Hasta:</span>
                <select 
                  value={config.weekRange.end}
                  onChange={(e) => updateRange('end', Number(e.target.value))}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm"
                >
                    {weekOptions.map(w => <option key={w} value={w}>Semana {w}</option>)}
                </select>
            </div>
        </div>
         <p className="text-sm text-gray-500">
           📊 {Math.max(0, config.weekRange.end - config.weekRange.start + 1)} semanas seleccionadas
         </p>
      </div>

      {/* 2. Progression Targets */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700 dark:text-gray-300">2️⃣ ¿Qué quieres progresar?</label>
        <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
             <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.increments.sets > 0} 
                      onChange={(e) => updateIncrement('sets', e.target.checked ? 1 : 0)}
                      className="rounded text-blue-600 w-4 h-4" 
                    />
                    <span className="text-gray-700 dark:text-gray-200">Series</span>
                </label>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Incremento:</span>
                    <select 
                      value={config.increments.sets}
                      onChange={(e) => updateIncrement('sets', Number(e.target.value))}
                      disabled={config.increments.sets === 0}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 w-24 text-sm disabled:opacity-50"
                    >
                        <option value="0">0</option>
                        <option value="1">+1</option>
                        <option value="2">+2</option>
                    </select>
                    <span>por semana</span>
                </div>
             </div>
             
             <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.increments.reps > 0}
                      onChange={(e) => updateIncrement('reps', e.target.checked ? 2 : 0)}
                      className="rounded text-blue-600 w-4 h-4" 
                    />
                    <span className="text-gray-700 dark:text-gray-200">Repeticiones</span>
                </label>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Incremento:</span>
                     <select 
                       value={config.increments.reps}
                       onChange={(e) => updateIncrement('reps', Number(e.target.value))}
                       disabled={config.increments.reps === 0}
                       className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 w-24 text-sm disabled:opacity-50"
                     >
                        <option value="0">0</option>
                        <option value="1">+1</option>
                        <option value="2">+2</option>
                        <option value="5">+5</option>
                    </select>
                    <span>por semana</span>
                </div>
             </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.increments.loadPercentage > 0}
                      onChange={(e) => updateIncrement('loadPercentage', e.target.checked ? 0.025 : 0)}
                      className="rounded text-blue-600 w-4 h-4" 
                    />
                    <span className="text-gray-700 dark:text-gray-200">Carga</span>
                </label>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Incremento:</span>
                     <select 
                       value={config.increments.loadPercentage}
                       onChange={(e) => updateIncrement('loadPercentage', Number(e.target.value))}
                       disabled={config.increments.loadPercentage === 0}
                       className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 w-24 text-sm disabled:opacity-50"
                     >
                        <option value="0">0%</option>
                        <option value="0.025">+2.5%</option>
                        <option value="0.05">+5%</option>
                        <option value="0.10">+10%</option>
                    </select>
                    <span>por semana</span>
                </div>
             </div>
        </div>
      </div>

      {/* 3. Filters */}
      <div className="space-y-2">
         <label className="block font-medium text-gray-700 dark:text-gray-300">3️⃣ Filtrar ejercicios (opcional):</label>
         <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="filter" 
                  id="all" 
                  checked={config.filters.applyToAll}
                  onChange={() => onChange({ filters: { ...config.filters, applyToAll: true } })}
                  className="text-blue-600" 
                />
                <label htmlFor="all" className="text-sm text-gray-700 dark:text-gray-300">Aplicar a todos los ejercicios</label>
            </div>
            <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="filter" 
                  id="tags" 
                  checked={!config.filters.applyToAll}
                  onChange={() => onChange({ filters: { ...config.filters, applyToAll: false } })}
                  className="text-blue-600" 
                />
                <label htmlFor="tags" className="text-sm text-gray-700 dark:text-gray-300">Aplicar solo a ejercicios con tags:</label>
            </div>
            {!config.filters.applyToAll && (
              <div className="ml-6 flex flex-wrap gap-2">
                  {/* Mock tags for UI demo since we don't have tag selector context here easily yet */}
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm flex items-center border border-blue-200 dark:border-blue-800">
                      #Fuerza <button className="ml-1 hover:text-blue-600">×</button>
                  </span>
                  <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">+ Agregar tag</button>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};
