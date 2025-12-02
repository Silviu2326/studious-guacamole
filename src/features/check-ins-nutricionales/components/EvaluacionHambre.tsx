import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Droplet, Droplets } from 'lucide-react';

interface EvaluacionHambreProps {
  tipo: 'hambre' | 'saciedad';
  valor: number;
  onChange: (valor: number) => void;
  soloLectura?: boolean;
  label?: string;
}

export const EvaluacionHambre: React.FC<EvaluacionHambreProps> = ({
  tipo,
  valor,
  onChange,
  soloLectura = false,
  label,
}) => {
  const escala = Array.from({ length: 10 }, (_, i) => i + 1);
  const labels = tipo === 'hambre'
    ? ['Sin hambre', '', '', '', '', '', '', '', '', 'Muy hambriento']
    : ['Sin saciedad', '', '', '', '', '', '', '', '', 'Muy saciado'];

  const getColor = (nivel: number) => {
    if (tipo === 'hambre') {
      if (nivel <= 3) return 'bg-green-500';
      if (nivel <= 6) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      if (nivel <= 3) return 'bg-red-500';
      if (nivel <= 6) return 'bg-yellow-500';
      return 'bg-green-500';
    }
  };

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {tipo === 'hambre' ? (
              <Droplet size={20} className="text-blue-600" />
            ) : (
              <Droplets size={20} className="text-green-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              {label || (tipo === 'hambre' ? 'Nivel de Hambre' : 'Nivel de Saciedad')}
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            Evalúa tu sensación en una escala del 1 al 10
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {escala.map((nivel) => (
            <div
              key={nivel}
              className="flex items-center gap-4"
            >
              <div className="w-16">
                <span className="text-sm font-semibold text-gray-900">
                  {nivel}
                </span>
              </div>
              <button
                onClick={() => !soloLectura && onChange(nivel)}
                disabled={soloLectura}
                className={`
                  flex-1 h-10 rounded-xl transition-all duration-200
                  ${valor === nivel ? `${getColor(nivel)} text-white shadow-md scale-105` : 'bg-gray-200 hover:bg-gray-300'}
                  ${soloLectura ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-medium">
                    {labels[nivel - 1] || ''}
                  </span>
                  {valor === nivel && (
                    <span className="text-sm font-bold">
                      {tipo === 'hambre' ? 'Hambre' : 'Saciedad'}
                    </span>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>

        {valor > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Nivel seleccionado:
              </span>
              <span className="text-lg font-bold text-gray-900">
                {valor}/10
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

