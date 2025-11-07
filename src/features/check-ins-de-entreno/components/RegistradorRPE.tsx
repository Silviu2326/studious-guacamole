import React, { useState } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Gauge, TrendingUp } from 'lucide-react';

interface RegistradorRPEProps {
  onRegistrar: (rpe: number) => void;
  valorInicial?: number;
  ejercicioNombre?: string;
}

export const RegistradorRPE: React.FC<RegistradorRPEProps> = ({
  onRegistrar,
  valorInicial,
  ejercicioNombre,
}) => {
  const [rpe, setRpe] = useState(valorInicial || 0);

  const escalaRPE = [
    { valor: 6, label: 'Muy Fácil' },
    { valor: 7, label: 'Muy Fácil' },
    { valor: 8, label: 'Fácil' },
    { valor: 9, label: 'Fácil' },
    { valor: 10, label: 'Algo Fácil' },
    { valor: 11, label: 'Algo Fácil' },
    { valor: 12, label: 'Algo Difícil' },
    { valor: 13, label: 'Difícil' },
    { valor: 14, label: 'Muy Difícil' },
    { valor: 15, label: 'Máximo' },
    { valor: 16, label: 'Máximo' },
    { valor: 17, label: 'Máximo' },
    { valor: 18, label: 'Máximo' },
    { valor: 19, label: 'Máximo' },
    { valor: 20, label: 'Máximo Esfuerzo' },
  ];

  const getColorRPE = (valor: number) => {
    if (valor <= 9) return { bg: 'bg-green-500', border: 'border-green-500' };
    if (valor <= 12) return { bg: 'bg-yellow-500', border: 'border-yellow-500' };
    if (valor <= 15) return { bg: 'bg-orange-500', border: 'border-orange-500' };
    return { bg: 'bg-red-500', border: 'border-red-500' };
  };

  return (
    <Card className="p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Gauge size={20} className="text-blue-600" />
        RPE - Rate of Perceived Exertion
        {ejercicioNombre && <span className="text-sm font-normal text-slate-600">({ejercicioNombre})</span>}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Selecciona tu nivel de esfuerzo percibido
          </label>
          <div className="grid grid-cols-5 gap-2">
            {escalaRPE.map((item) => {
              const colorClasses = getColorRPE(item.valor);
              return (
                <button
                  key={item.valor}
                  onClick={() => setRpe(item.valor)}
                  className={`
                    p-3 rounded-xl border-2 transition-all
                    ${rpe === item.valor
                      ? `${colorClasses.border} shadow-md`
                      : 'border-slate-200 hover:border-slate-300'
                    }
                    ${colorClasses.bg}
                    text-white font-bold
                    flex flex-col items-center
                  `}
                >
                  <span className="text-lg">{item.valor}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {rpe > 0 && (
          <div className={`p-4 rounded-lg ${getColorRPE(rpe).bg} text-white`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">RPE: {rpe}</span>
            </div>
            <p className="text-sm opacity-90">
              {escalaRPE.find((e) => e.valor === rpe)?.label}
            </p>
          </div>
        )}

        <Button
          onClick={() => onRegistrar(rpe)}
          disabled={rpe === 0}
          fullWidth
        >
          Registrar RPE
        </Button>
      </div>
    </Card>
  );
};

