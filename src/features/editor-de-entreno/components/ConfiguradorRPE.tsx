import React from 'react';
import { Card, Input } from '../../../components/componentsreutilizables';
import { Serie } from '../api';
import { AlertCircle } from 'lucide-react';

interface ConfiguradorRPEProps {
  serie: Serie;
  onChange: (rpe: number) => void;
}

export const ConfiguradorRPE: React.FC<ConfiguradorRPEProps> = ({ serie, onChange }) => {
  const escalaRPE = [
    { valor: 1, descripcion: 'Reposo completo' },
    { valor: 2, descripcion: 'Muy ligero' },
    { valor: 3, descripcion: 'Ligero' },
    { valor: 4, descripcion: 'Moderado' },
    { valor: 5, descripcion: 'Algo duro' },
    { valor: 6, descripcion: 'Duro' },
    { valor: 7, descripcion: 'Muy duro' },
    { valor: 8, descripcion: 'Extremadamente duro' },
    { valor: 9, descripcion: 'Casi máximo esfuerzo' },
    { valor: 10, descripcion: 'Máximo esfuerzo absoluto' },
  ];

  const descripcionActual = escalaRPE.find((e) => e.valor === (serie.rpe || 6))?.descripcion || '';

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Rate of Perceived Exertion (RPE)
          </h3>
          <p className="text-sm text-gray-600">
            Escala de esfuerzo percibido de 1 a 10
          </p>
        </div>

        <Input
          label="RPE"
          type="number"
          min="1"
          max="10"
          value={serie.rpe || 6}
          onChange={(e) => onChange(parseInt(e.target.value) || 6)}
          fullWidth={false}
          className="w-32"
        />

        {serie.rpe && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800 text-sm">
                  Nivel {serie.rpe}: {descripcionActual}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          {escalaRPE.map((item) => (
            <div
              key={item.valor}
              className={`p-2 rounded ${
                item.valor === (serie.rpe || 6)
                  ? 'bg-blue-100 border border-blue-300'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="font-semibold">{item.valor}:</div>
              <div className="text-gray-600">{item.descripcion}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

