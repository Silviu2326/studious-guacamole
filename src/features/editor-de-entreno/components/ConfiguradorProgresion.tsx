import React from 'react';
import { Card, Input, Select } from '../../../components/componentsreutilizables';
import { ProgresionConfig } from '../api';
import { TrendingUp } from 'lucide-react';

interface ConfiguradorProgresionProps {
  config: ProgresionConfig;
  onChange: (config: ProgresionConfig) => void;
}

export const ConfiguradorProgresion: React.FC<ConfiguradorProgresionProps> = ({
  config,
  onChange,
}) => {
  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Progresión Automática
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.habilitada}
            onChange={(e) => onChange({ ...config, habilitada: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="text-gray-900">Habilitar progresión automática</label>
        </div>

        {config.habilitada && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <Select
              label="Tipo de Progresión"
              value={config.tipo || 'automatica'}
              onChange={(e) =>
                onChange({ ...config, tipo: e.target.value as 'automatica' | 'manual' })
              }
              options={[
                { value: 'automatica', label: 'Automática' },
                { value: 'manual', label: 'Manual' },
              ]}
            />

            <Select
              label="Frecuencia"
              value={config.frecuencia || 'semanal'}
              onChange={(e) =>
                onChange({
                  ...config,
                  frecuencia: e.target.value as 'semanal' | 'quincenal' | 'mensual',
                })
              }
              options={[
                { value: 'semanal', label: 'Semanal' },
                { value: 'quincenal', label: 'Quincenal' },
                { value: 'mensual', label: 'Mensual' },
              ]}
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Incremento Peso (%)"
                type="number"
                value={config.incrementoPeso || ''}
                onChange={(e) =>
                  onChange({
                    ...config,
                    incrementoPeso: parseFloat(e.target.value) || 0,
                  })
                }
                fullWidth={false}
              />

              <Input
                label="Incremento Repeticiones"
                type="number"
                value={config.incrementoRepeticiones || ''}
                onChange={(e) =>
                  onChange({
                    ...config,
                    incrementoRepeticiones: parseInt(e.target.value) || 0,
                  })
                }
                fullWidth={false}
              />

              <Input
                label="Incremento RPE"
                type="number"
                value={config.incrementoRPE || ''}
                onChange={(e) =>
                  onChange({
                    ...config,
                    incrementoRPE: parseFloat(e.target.value) || 0,
                  })
                }
                fullWidth={false}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

