import React, { useState } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { CheckInConfig } from '../api';
import { Circle } from 'lucide-react';

interface CheckInsSemaforoProps {
  config: CheckInConfig;
  onChange: (config: CheckInConfig) => void;
}

export const CheckInsSemaforo: React.FC<CheckInsSemaforoProps> = ({ config, onChange }) => {
  const tiposCheckIn = [
    { id: 'energia', label: 'Energía', color: 'yellow' },
    { id: 'dolor', label: 'Dolor', color: 'red' },
    { id: 'satisfaccion', label: 'Satisfacción', color: 'green' },
    { id: 'dificultad', label: 'Dificultad', color: 'orange' },
  ];

  const toggleTipo = (tipo: 'energia' | 'dolor' | 'satisfaccion' | 'dificultad') => {
    const tipos = config.tipos || [];
    const nuevosTipos = tipos.includes(tipo)
      ? tipos.filter((t) => t !== tipo)
      : [...tipos, tipo];
    onChange({ ...config, tipos: nuevosTipos });
  };

  const colores = {
    rojo: 'bg-red-500',
    amarillo: 'bg-yellow-500',
    verde: 'bg-green-500',
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Check-ins Semáforo
          </h3>
          <p className="text-sm text-gray-600">
            Configura los tipos de check-ins para evaluar la sesión
          </p>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.habilitado}
              onChange={(e) => onChange({ ...config, habilitado: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-900">Habilitar check-ins</span>
          </label>
        </div>

        {config.habilitado && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {tiposCheckIn.map((tipo) => (
                <Button
                  key={tipo.id}
                  variant={config.tipos?.includes(tipo.id as 'energia' | 'dolor' | 'satisfaccion' | 'dificultad') ? 'primary' : 'secondary'}
                  onClick={() => toggleTipo(tipo.id as 'energia' | 'dolor' | 'satisfaccion' | 'dificultad')}
                  fullWidth
                >
                  {tipo.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
              <div className="flex flex-col items-center gap-2">
                <Circle className="w-8 h-8 bg-red-500 rounded-full" />
                <span className="text-xs text-gray-600">Bajo</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Circle className="w-8 h-8 bg-yellow-500 rounded-full" />
                <span className="text-xs text-gray-600">Medio</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Circle className="w-8 h-8 bg-green-500 rounded-full" />
                <span className="text-xs text-gray-600">Alto</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

