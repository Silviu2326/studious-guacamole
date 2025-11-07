import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { FinancialSummary as FinancialSummaryType } from '../api/financial';

interface FinancialSummaryProps {
  data: FinancialSummaryType;
  role: 'entrenador' | 'gimnasio';
  loading?: boolean;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  data,
  role,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  const TrendIcon = data.tendencia === 'up' ? TrendingUp : TrendingDown;
  const trendColor = data.tendencia === 'up' ? 'text-green-600' : 'text-red-600';

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Resumen Financiero
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          {role === 'entrenador' ? 'Estado de tu negocio' : 'Estado financiero del centro'}
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-gray-50 ring-1 ring-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Ingresos del Mes
            </span>
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-xs font-medium">
                {data.porcentajeVariacion}%
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            €{data.ingresosMes.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            vs €{data.ingresosMesAnterior.toLocaleString('es-ES', { minimumFractionDigits: 2 })} el mes anterior
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-lg bg-gray-50 ring-1 ring-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Gastos del Mes
            </p>
            <p className="text-lg font-semibold text-gray-900">
              €{data.gastosMes.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-green-100 ring-1 ring-green-200">
            <p className="text-sm font-medium text-green-700 mb-1">
              Ganancia Neta
            </p>
            <p className="text-lg font-semibold text-green-700">
              €{data.gananciaNeta.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {(data.proximosVencimientos > 0 || data.montoPendiente > 0) && (
          <div className="p-4 rounded-lg bg-yellow-100 ring-1 ring-yellow-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-700">
                {data.proximosVencimientos} {data.proximosVencimientos === 1 ? 'vencimiento' : 'vencimientos'} próximos
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                €{data.montoPendiente.toLocaleString('es-ES', { minimumFractionDigits: 2 })} pendiente
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
