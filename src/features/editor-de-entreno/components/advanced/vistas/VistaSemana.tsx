import React from 'react';
import { PlanificacionSemana, Restricciones, HeatmapData } from '../../../types/advanced';
import { Heatmap } from '../Heatmap';

interface VistaSemanaProps {
  planificacion: PlanificacionSemana;
  onPlanificacionChange: (plan: PlanificacionSemana) => void;
  diaSeleccionado: keyof PlanificacionSemana;
  onDiaSeleccionado: (dia: keyof PlanificacionSemana) => void;
  restricciones?: Restricciones;
  onSmartFill: (restricciones: Restricciones) => void;
}

export const VistaSemana: React.FC<VistaSemanaProps> = ({
  planificacion,
  onPlanificacionChange,
  diaSeleccionado,
  onDiaSeleccionado,
  restricciones,
  onSmartFill,
}) => {
  const dias = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ] as const;

  // Heatmap data (ejemplo - en producción vendría de API)
  const heatmapData: HeatmapData[] = dias.map((dia, idx) => ({
    dia: new Date(Date.now() + idx * 24 * 60 * 60 * 1000),
    cumplimiento: Math.random() * 100,
    feedbackDolor: Math.random() > 0.7 ? 'verde' : Math.random() > 0.4 ? 'amarillo' : 'rojo',
  }));

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Heatmap de fatiga/adherencia */}
      <Heatmap planificacion={planificacion} datos={heatmapData} />

      {/* Grid de días con drag-and-drop */}
      <div className="grid grid-cols-7 gap-3">
        {dias.map(dia => {
          const sesion = planificacion[dia.key];
          const datosDia = heatmapData.find((_, idx) => dias[idx].key === dia.key);
          const colorCumplimiento = datosDia?.cumplimiento
            ? datosDia.cumplimiento >= 80 ? 'green'
            : datosDia.cumplimiento >= 60 ? 'yellow'
            : datosDia.cumplimiento >= 40 ? 'orange' : 'red'
            : 'gray';

          return (
            <div
              key={dia.key}
              className={`border-2 rounded-lg p-3 min-h-[200px] ${
                diaSeleccionado === dia.key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => onDiaSeleccionado(dia.key)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('dia', dia.key);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const diaOrigen = e.dataTransfer.getData('dia');
                if (diaOrigen && diaOrigen !== dia.key) {
                  // Copiar estructura, no cargas
                  const sesionOrigen = planificacion[diaOrigen as keyof PlanificacionSemana];
                  if (sesionOrigen) {
                    const sesionCopiada = {
                      ...sesionOrigen,
                      id: undefined,
                      nombre: `${sesionOrigen.nombre} (Copia)`,
                    };
                    onPlanificacionChange({
                      ...planificacion,
                      [dia.key]: sesionCopiada,
                    });
                  }
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-sm text-gray-900">{dia.label}</div>
                {datosDia && (
                  <div className={`w-3 h-3 rounded-full ${
                    colorCumplimiento === 'green' ? 'bg-green-500' :
                    colorCumplimiento === 'yellow' ? 'bg-yellow-500' :
                    colorCumplimiento === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                  }`} title={`Adherencia: ${Math.round(datosDia.cumplimiento)}%`} />
                )}
              </div>
              {sesion ? (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-700">{sesion.nombre}</div>
                  <div className="text-xs text-gray-500">
                    {sesion.ejercicios?.length || 0} ejercicios
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic">Vacío</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

