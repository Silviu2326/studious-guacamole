import React from 'react';
import { Badge } from '../../../components/componentsreutilizables';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import type { IndicadorAdherenciaDia } from '../types';

interface IndicadorAdherenciaDiaProps {
  indicador: IndicadorAdherenciaDia;
  mostrarDetalles?: boolean;
}

export const IndicadorAdherenciaDia: React.FC<IndicadorAdherenciaDiaProps> = ({
  indicador,
  mostrarDetalles = false,
}) => {
  const getColorRiesgo = () => {
    switch (indicador.nivelRiesgo) {
      case 'bajo':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medio':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'alto':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getIconoRiesgo = () => {
    switch (indicador.nivelRiesgo) {
      case 'bajo':
        return <TrendingUp className="w-3 h-3" />;
      case 'medio':
        return <Minus className="w-3 h-3" />;
      case 'alto':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Info className="w-3 h-3" />;
    }
  };

  const getIconoTendencia = () => {
    if (!indicador.feedbackHistorico) return null;
    
    switch (indicador.feedbackHistorico.tendencia) {
      case 'mejora':
        return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'empeora':
        return <TrendingDown className="w-3 h-3 text-red-600" />;
      default:
        return <Minus className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge className={`${getColorRiesgo()} text-xs px-2 py-1 flex items-center gap-1`}>
          {getIconoRiesgo()}
          <span className="font-semibold">{indicador.adherenciaPrevista}%</span>
          <span className="text-[10px] opacity-75">prevista</span>
        </Badge>
        
        {indicador.feedbackHistorico && (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            {getIconoTendencia()}
            <span className="text-[10px]">
              {indicador.feedbackHistorico.adherenciaPromedio}% histórico
            </span>
          </div>
        )}
      </div>

      {mostrarDetalles && indicador.factoresRiesgo.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-700">Factores de riesgo:</p>
          <ul className="text-xs text-slate-600 space-y-1">
            {indicador.factoresRiesgo.map((factor, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mostrarDetalles && indicador.feedbackHistorico && (
        <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
          <p>
            Basado en {indicador.feedbackHistorico.diasSimilares} días similares en el historial
          </p>
        </div>
      )}
    </div>
  );
};

