import React from 'react';
import { TriggerOption, TriggerEvent } from '../api/surveys';
import { Clock, Zap } from 'lucide-react';

interface AutomationTriggerConfigProps {
  availableTriggers: TriggerOption[];
  value: {
    triggerId: TriggerEvent;
    delay: number;
    unit: 'hours' | 'days';
  };
  onChange: (newValue: { triggerId: TriggerEvent; delay: number; unit: 'hours' | 'days' }) => void;
}

/**
 * Componente de formulario para configurar cuándo se debe enviar una encuesta.
 */
export const AutomationTriggerConfig: React.FC<AutomationTriggerConfigProps> = ({
  availableTriggers,
  value,
  onChange
}) => {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Configurar Automatización</h3>
      </div>

      {/* Selector de evento disparador */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Evento Disparador
        </label>
        <select
          value={value.triggerId}
          onChange={(e) => onChange({
            ...value,
            triggerId: e.target.value as TriggerEvent
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {availableTriggers.map((trigger) => (
            <option key={trigger.id} value={trigger.id}>
              {trigger.name}
            </option>
          ))}
        </select>
        {availableTriggers.find(t => t.id === value.triggerId) && (
          <p className="mt-1 text-xs text-gray-500">
            {availableTriggers.find(t => t.id === value.triggerId)?.description}
          </p>
        )}
      </div>

      {/* Configuración de retraso */}
      {value.triggerId !== 'manual' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Retraso antes del Envío
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={value.delay}
              onChange={(e) => onChange({
                ...value,
                delay: Number(e.target.value) || 0
              })}
              min="0"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select
              value={value.unit}
              onChange={(e) => onChange({
                ...value,
                unit: e.target.value as 'hours' | 'days'
              })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="hours">Horas</option>
              <option value="days">Días</option>
            </select>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              La encuesta se enviará {value.delay === 0 ? 'inmediatamente' : `después de ${value.delay} ${value.unit === 'hours' ? 'hora(s)' : 'día(s)'}`} cuando ocurra el evento seleccionado.
            </span>
          </div>
        </div>
      )}

      {value.triggerId === 'manual' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p>Esta encuesta se enviará manualmente por el entrenador.</p>
        </div>
      )}
    </div>
  );
};


