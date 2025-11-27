import React from 'react';
import { ds } from '../../../../../features/adherencia/ui/ds';
import { BatchConfig, BatchActionType } from '../../../hooks/useBatchTraining';
import { useProgramContext } from '../../../context/ProgramContext';
import { ArrowRight, Copy, RefreshCw, Layers, Calendar } from 'lucide-react';

interface StepConfigurationProps {
  config: BatchConfig;
  onChange: (updates: Partial<BatchConfig>) => void;
  action: BatchActionType;
}

// --- Sub-components for specific Forms ---

const DuplicateConfigForm: React.FC<StepConfigurationProps> = ({ config, onChange }) => {
  const { weeks } = useProgramContext();

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ sourceWeek: Number(e.target.value) });
  };

  const handleRangeChange = (field: 'start' | 'end', value: number) => {
    onChange({ weekRange: { ...config.weekRange, [field]: value } });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
        <h4 className="flex items-center gap-2 font-medium text-blue-900 dark:text-blue-100 mb-2">
          <Copy size={16} /> Configuración de Duplicado
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Copia el contenido exacto de una semana base hacia otras semanas del programa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Origen (Semana a copiar)
          </label>
          <select
            value={config.sourceWeek}
            onChange={handleSourceChange}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {weeks.map((_, idx) => (
              <option key={idx} value={idx + 1}>Semana {idx + 1}</option>
            ))}
          </select>
        </div>

        {/* Target Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Destino (Rango de semanas)
          </label>
          <div className="flex items-center gap-2">
            <select
              value={config.weekRange.start}
              onChange={(e) => handleRangeChange('start', Number(e.target.value))}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2"
            >
              {weeks.map((_, idx) => (
                <option key={idx} value={idx + 1}>Semana {idx + 1}</option>
              ))}
            </select>
            <span className="text-gray-400"><ArrowRight size={14}/></span>
            <select
              value={config.weekRange.end}
              onChange={(e) => handleRangeChange('end', Number(e.target.value))}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2"
            >
              {weeks.map((_, idx) => (
                <option key={idx} value={idx + 1}>Semana {idx + 1}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">Mantener pesos y RPE originales</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">Limpiar notas de los ejercicios</span>
        </label>
      </div>
    </div>
  );
};

const LinearProgressionForm: React.FC<StepConfigurationProps> = ({ config, onChange }) => {
  const { weeks } = useProgramContext();

  const updateRange = (field: 'start' | 'end', value: number) => {
    onChange({ weekRange: { ...config.weekRange, [field]: value } });
  };

  const updateIncrement = (field: keyof BatchConfig['increments'], value: number) => {
    onChange({ increments: { ...config.increments, [field]: value } });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
        <h4 className="flex items-center gap-2 font-medium text-purple-900 dark:text-purple-100 mb-2">
          <RefreshCw size={16} /> Progresión Lineal
        </h4>
        <p className="text-sm text-purple-700 dark:text-purple-300">
          Aumenta automáticamente la intensidad o volumen semana a semana.
        </p>
      </div>

      {/* Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rango de Aplicación</label>
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
           <div className="flex-1 flex items-center gap-2">
             <span className="text-xs font-bold text-gray-500 uppercase">Desde</span>
             <select
                value={config.weekRange.start}
                onChange={(e) => updateRange('start', Number(e.target.value))}
                className="w-full bg-white dark:bg-gray-700 border-none text-sm focus:ring-0 rounded"
             >
                {weeks.map((_, i) => <option key={i} value={i + 1}>Semana {i + 1}</option>)}
             </select>
           </div>
           <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
           <div className="flex-1 flex items-center gap-2">
             <span className="text-xs font-bold text-gray-500 uppercase">Hasta</span>
             <select
                value={config.weekRange.end}
                onChange={(e) => updateRange('end', Number(e.target.value))}
                className="w-full bg-white dark:bg-gray-700 border-none text-sm focus:ring-0 rounded"
             >
                {weeks.map((_, i) => <option key={i} value={i + 1}>Semana {i + 1}</option>)}
             </select>
           </div>
        </div>
      </div>

      {/* Variables */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Variables a Progresar (por semana)</label>
        
        {/* Sets */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 transition-colors">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={config.increments.sets > 0}
                    onChange={(e) => updateIncrement('sets', e.target.checked ? 1 : 0)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-900 dark:text-gray-100 font-medium">Series</span>
            </div>
            {config.increments.sets > 0 && (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                    <span className="text-xs text-gray-500">+</span>
                    <select 
                        value={config.increments.sets}
                        onChange={(e) => updateIncrement('sets', Number(e.target.value))}
                        className="text-sm bg-gray-50 border-gray-200 rounded px-2 py-1"
                    >
                        <option value="1">1 serie</option>
                        <option value="2">2 series</option>
                    </select>
                </div>
            )}
        </div>

        {/* Reps */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 transition-colors">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={config.increments.reps !== 0}
                    onChange={(e) => updateIncrement('reps', e.target.checked ? 1 : 0)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-900 dark:text-gray-100 font-medium">Repeticiones</span>
            </div>
            {config.increments.reps !== 0 && (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                    <select 
                        value={config.increments.reps}
                        onChange={(e) => updateIncrement('reps', Number(e.target.value))}
                        className="text-sm bg-gray-50 border-gray-200 rounded px-2 py-1"
                    >
                        <option value="-2">-2 reps</option>
                        <option value="-1">-1 rep</option>
                        <option value="1">+1 rep</option>
                        <option value="2">+2 reps</option>
                        <option value="5">+5 reps</option>
                    </select>
                </div>
            )}
        </div>

        {/* Load % */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 transition-colors">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={config.increments.loadPercentage > 0}
                    onChange={(e) => updateIncrement('loadPercentage', e.target.checked ? 0.025 : 0)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-gray-900 dark:text-gray-100 font-medium">Carga (%)</span>
            </div>
            {config.increments.loadPercentage > 0 && (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                    <span className="text-xs text-gray-500">+</span>
                    <select 
                        value={config.increments.loadPercentage}
                        onChange={(e) => updateIncrement('loadPercentage', Number(e.target.value))}
                        className="text-sm bg-gray-50 border-gray-200 rounded px-2 py-1"
                    >
                        <option value="0.0125">1.25%</option>
                        <option value="0.025">2.5%</option>
                        <option value="0.05">5%</option>
                        <option value="0.10">10%</option>
                    </select>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const TemplateConfigForm: React.FC<StepConfigurationProps> = ({ config, onChange }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                <h4 className="flex items-center gap-2 font-medium text-green-900 dark:text-green-100 mb-2">
                    <Layers size={16} /> Aplicar Plantilla
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                    Selecciona una estructura predefinida para aplicar a las semanas seleccionadas.
                </p>
            </div>
            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-500">Selector de Plantillas (Pendiente de implementación)</p>
            </div>
        </div>
    )
}

const MassAdjustmentForm: React.FC<StepConfigurationProps> = ({ config, onChange }) => {
    // Reusing increments structure but semantically different
    const updateIncrement = (field: keyof BatchConfig['increments'], value: number) => {
        onChange({ increments: { ...config.increments, [field]: value } });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                <h4 className="flex items-center gap-2 font-medium text-orange-900 dark:text-orange-100 mb-2">
                    <RefreshCw size={16} /> Ajuste Masivo
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                    Modifica variables específicas en todos los ejercicios seleccionados de una sola vez.
                </p>
            </div>

            <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Tipo de Ajuste</label>
                    <select 
                        value={config.adjustmentType} 
                        onChange={(e) => onChange({ adjustmentType: e.target.value as 'add' | 'set' })}
                        className="w-full border-gray-300 rounded-lg p-2"
                    >
                        <option value="add">Añadir / Restar (Relativo)</option>
                        <option value="set">Establecer Valor (Absoluto)</option>
                    </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">RPE</label>
                        <input 
                            type="number" 
                            value={config.increments.rpe}
                            onChange={(e) => updateIncrement('rpe', Number(e.target.value))}
                            className="w-full border-gray-300 rounded p-2"
                            placeholder={config.adjustmentType === 'add' ? "+/- 0" : "Valor RPE"}
                        />
                     </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Descanso (seg)</label>
                         {/* We don't have rest in increments yet, mocking UI */}
                        <input 
                            type="number" 
                            className="w-full border-gray-300 rounded p-2"
                            disabled
                            placeholder="N/A"
                        />
                     </div>
                 </div>
            </div>
        </div>
    )
}

const ReorganizeDaysForm: React.FC<StepConfigurationProps> = ({ config, onChange }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <h4 className="flex items-center gap-2 font-medium text-indigo-900 dark:text-indigo-100 mb-2">
                    <Calendar size={16} /> Reorganizar Días
                </h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    Intercambia o mueve días completos dentro de la estructura semanal.
                </p>
            </div>
             <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-500">Interfaz Drag & Drop de Días (Pendiente de implementación)</p>
            </div>
        </div>
    )
}

// --- Main Component ---

export const StepConfiguration: React.FC<StepConfigurationProps> = (props) => {
  const { action } = props;

  const renderForm = () => {
    switch (action) {
      case 'duplicate_week':
        return <DuplicateConfigForm {...props} />;
      case 'linear_progression':
        return <LinearProgressionForm {...props} />;
      case 'apply_template':
        return <TemplateConfigForm {...props} />;
      case 'mass_adjustment':
        return <MassAdjustmentForm {...props} />;
      case 'reorganize_days':
        return <ReorganizeDaysForm {...props} />;
      default:
        return <div className="p-4 text-red-500">Modo no reconocido</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          Configuración: {action?.replace('_', ' ').toUpperCase()}
        </h3>
      </div>
      
      {renderForm()}
    </div>
  );
};