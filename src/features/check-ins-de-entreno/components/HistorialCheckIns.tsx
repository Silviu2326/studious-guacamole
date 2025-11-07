import React from 'react';
import { Card, Table } from '../../../components/componentsreutilizables';
import { Clock, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { HistorialCheckIn } from '../api/checkins';
import { SemáforoSerie } from './SemáforoSerie';

interface HistorialCheckInsProps {
  historial: HistorialCheckIn[];
}

export const HistorialCheckIns: React.FC<HistorialCheckInsProps> = ({ historial }) => {
  const columnas = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'semaforo', label: 'Estado' },
    { key: 'sensaciones', label: 'Sensaciones' },
    { key: 'dolorLumbar', label: 'Dolor Lumbar' },
    { key: 'rpe', label: 'RPE' },
    { key: 'tendencia', label: 'Tendencia' },
  ];

  const datos = historial.map((item) => {
    const checkIn = item.checkIn;
    const fecha = new Date(checkIn.fecha);
    
    return {
      fecha: fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      semaforo: (
        <SemáforoSerie
          estado={checkIn.semaforo}
          serie={checkIn.serie}
          size="sm"
        />
      ),
      sensaciones: checkIn.sensaciones || '-',
      dolorLumbar: checkIn.dolorLumbar ? (
        <span className="text-red-600 font-medium">Sí</span>
      ) : (
        <span className="text-slate-500">No</span>
      ),
      rpe: checkIn.rpe ? (
        <span className="font-semibold text-gray-900">{checkIn.rpe}</span>
      ) : (
        <span className="text-slate-400">-</span>
      ),
      tendencia: item.tendencia ? (
        <div className="flex items-center gap-1">
          {item.tendencia === 'mejora' && (
            <>
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 text-sm">Mejora</span>
            </>
          )}
          {item.tendencia === 'empeora' && (
            <>
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-red-600 text-sm">Empeora</span>
            </>
          )}
          {item.tendencia === 'estable' && (
            <>
              <Minus className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600 text-sm">Estable</span>
            </>
          )}
        </div>
      ) : (
        <span className="text-slate-400">-</span>
      ),
    };
  });

  if (historial.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Clock size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sin Historial
        </h3>
        <p className="text-gray-600">No hay historial de check-ins disponible</p>
      </Card>
    );
  }

  // Estadísticas del historial
  const estadisticas = {
    total: historial.length,
    verde: historial.filter(h => h.checkIn.semaforo === 'verde').length,
    amarillo: historial.filter(h => h.checkIn.semaforo === 'amarillo').length,
    rojo: historial.filter(h => h.checkIn.semaforo === 'rojo').length,
    conDolor: historial.filter(h => h.checkIn.dolorLumbar).length,
    promedioRPE: historial.filter(h => h.checkIn.rpe).length > 0
      ? (historial.filter(h => h.checkIn.rpe).reduce((sum, h) => sum + (h.checkIn.rpe || 0), 0) / 
         historial.filter(h => h.checkIn.rpe).length).toFixed(1)
      : '-',
    mejora: historial.filter(h => h.tendencia === 'mejora').length,
    estable: historial.filter(h => h.tendencia === 'estable').length,
    empeora: historial.filter(h => h.tendencia === 'empeora').length,
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas del Historial */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={20} className="text-blue-600" />
          Resumen del Historial
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{estadisticas.verde}</div>
            <div className="text-xs text-slate-600">Check-ins Verde</div>
          </div>
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{estadisticas.amarillo}</div>
            <div className="text-xs text-slate-600">Check-ins Amarillo</div>
          </div>
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="text-2xl font-bold text-red-600 mb-1">{estadisticas.rojo}</div>
            <div className="text-xs text-slate-600">Check-ins Rojo</div>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">{estadisticas.promedioRPE}</div>
            <div className="text-xs text-slate-600">RPE Promedio</div>
          </div>
        </div>
        {estadisticas.conDolor > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Incidencias de Dolor Lumbar:</span>
              <span className="text-lg font-bold text-red-600">
                {estadisticas.conDolor} ({Math.round((estadisticas.conDolor / estadisticas.total) * 100)}%)
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Tabla de Historial */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-blue-600" />
            Historial Detallado
          </h3>
          <span className="text-sm text-slate-600">Últimos {historial.length} check-ins</span>
        </div>
        <Table columns={columnas} data={datos} />
      </Card>
    </div>
  );
};

