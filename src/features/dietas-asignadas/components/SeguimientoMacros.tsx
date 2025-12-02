import React from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { SeguimientoMacros as SeguimientoMacrosType } from '../types';
import { ds } from '../../adherencia/ui/ds';

interface SeguimientoMacrosProps {
  seguimiento: SeguimientoMacrosType;
}

export const SeguimientoMacros: React.FC<SeguimientoMacrosProps> = ({ seguimiento }) => {
  const getMacroStatus = (porcentaje: number) => {
    if (porcentaje >= 95 && porcentaje <= 105) return 'success';
    if (porcentaje >= 85 && porcentaje < 95) return 'warning';
    if (porcentaje > 105 && porcentaje <= 115) return 'warning';
    return 'error';
  };

  const getMacroColor = (porcentaje: number) => {
    const status = getMacroStatus(porcentaje);
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return '';
    }
  };

  const renderMacro = (
    label: string,
    objetivo: number,
    consumido: number,
    diferencia: number,
    unidad: string = 'g'
  ) => {
    const porcentaje = objetivo > 0 ? (consumido / objetivo) * 100 : 0;
    const diffPorcentaje = objetivo > 0 ? (diferencia / objetivo) * 100 : 0;

    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {label}
          </span>
          <Badge className={getMacroStatus(porcentaje) === 'success' ? 'bg-green-100 text-green-800' : getMacroStatus(porcentaje) === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
            {porcentaje.toFixed(1)}%
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className={ds.color.textSecondary}>Objetivo:</span>
            <span className="font-semibold">{objetivo} {unidad}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className={ds.color.textSecondary}>Consumido:</span>
            <span className="font-semibold">{consumido.toFixed(1)} {unidad}</span>
          </div>
          <div className={`flex justify-between text-sm ${getMacroColor(porcentaje)}`}>
            <span>Diferencia:</span>
            <span className="font-semibold">
              {diferencia > 0 ? '+' : ''}{diferencia.toFixed(1)} {unidad} ({diffPorcentaje > 0 ? '+' : ''}{diffPorcentaje.toFixed(1)}%)
            </span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-500" />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Seguimiento de Macros
            </h3>
          </div>
          <Badge
            className={
              seguimiento.porcentajeCumplimiento >= 90
                ? 'bg-green-100 text-green-800'
                : seguimiento.porcentajeCumplimiento >= 70
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }
          >
            {seguimiento.porcentajeCumplimiento.toFixed(1)}% Cumplimiento
          </Badge>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Fecha: {new Date(seguimiento.fecha).toLocaleDateString('es-ES')}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMacro(
          'Proteínas',
          seguimiento.macrosObjetivo.proteinas,
          seguimiento.macrosConsumidos.proteinas,
          seguimiento.diferencia.proteinas
        )}
        {renderMacro(
          'Carbohidratos',
          seguimiento.macrosObjetivo.carbohidratos,
          seguimiento.macrosConsumidos.carbohidratos,
          seguimiento.diferencia.carbohidratos
        )}
        {renderMacro(
          'Grasas',
          seguimiento.macrosObjetivo.grasas,
          seguimiento.macrosConsumidos.grasas,
          seguimiento.diferencia.grasas
        )}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Calorías
            </span>
            <Badge
              className={
                seguimiento.porcentajeCumplimiento >= 90
                  ? 'bg-green-100 text-green-800'
                  : seguimiento.porcentajeCumplimiento >= 70
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }
            >
              {seguimiento.porcentajeCumplimiento.toFixed(1)}%
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={ds.color.textSecondary}>Objetivo:</span>
              <span className="font-semibold">{seguimiento.macrosObjetivo.calorias} kcal</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={ds.color.textSecondary}>Consumido:</span>
              <span className="font-semibold">{seguimiento.macrosConsumidos.calorias.toFixed(0)} kcal</span>
            </div>
            <div className={`flex justify-between text-sm ${getMacroColor((seguimiento.macrosConsumidos.calorias / seguimiento.macrosObjetivo.calorias) * 100)}`}>
              <span>Diferencia:</span>
              <span className="font-semibold">
                {seguimiento.diferencia.calorias > 0 ? '+' : ''}{seguimiento.diferencia.calorias.toFixed(0)} kcal
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

