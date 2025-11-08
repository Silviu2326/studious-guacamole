import React from 'react';
import { HeatmapData, PlanificacionSemana } from '../../types/advanced';
import { Calendar } from 'lucide-react';

interface HeatmapProps {
  planificacion: PlanificacionSemana;
  datos: HeatmapData[];
}

/**
 * Heatmap de adherencia y fatiga en el editor
 * Color por día/ejercicio según cumplimiento, feedback de dolor, sueño, estrés
 */
export const Heatmap: React.FC<HeatmapProps> = ({ planificacion, datos }) => {
  const getColorPorCumplimiento = (cumplimiento: number): string => {
    if (cumplimiento >= 80) return 'bg-green-500';
    if (cumplimiento >= 60) return 'bg-yellow-500';
    if (cumplimiento >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getColorPorDolor = (dolor?: 'verde' | 'amarillo' | 'rojo'): string => {
    if (!dolor) return 'bg-gray-200';
    if (dolor === 'verde') return 'bg-green-500';
    if (dolor === 'amarillo') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const dias = [
    { key: 'lunes', label: 'L' },
    { key: 'martes', label: 'M' },
    { key: 'miercoles', label: 'X' },
    { key: 'jueves', label: 'J' },
    { key: 'viernes', label: 'V' },
    { key: 'sabado', label: 'S' },
    { key: 'domingo', label: 'D' },
  ] as const;

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900">Heatmap de Adherencia</h3>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {dias.map(dia => {
          const datosDia = datos.find(d => {
            const diaKey = dia.key;
            // TODO: Comparar fechas correctamente
            return true; // Placeholder
          });
          
          const cumplimiento = datosDia?.cumplimiento || 0;
          const color = datosDia?.feedbackDolor
            ? getColorPorDolor(datosDia.feedbackDolor)
            : getColorPorCumplimiento(cumplimiento);
          
          return (
            <div
              key={dia.key}
              className={`aspect-square rounded ${color} flex items-center justify-center text-white text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity`}
              title={`${dia.label}: ${cumplimiento}% cumplimiento`}
            >
              {cumplimiento > 0 ? Math.round(cumplimiento) : ''}
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span>≥80%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded" />
          <span>60-79%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded" />
          <span>40-59%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span>&lt;40%</span>
        </div>
      </div>
    </div>
  );
};






