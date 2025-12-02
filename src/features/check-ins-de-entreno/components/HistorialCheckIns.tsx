import React, { useMemo, useState } from 'react';
import { Card, Table } from '../../../components/componentsreutilizables';
import { Clock, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { HistorialCheckIn } from '../api/checkins';
import { SemáforoSerie } from './SemáforoSerie';
import { exportCheckInsExcel, exportCheckInsPDF } from '../utils/export';

interface HistorialCheckInsProps {
  historial: HistorialCheckIn[];
}

export const HistorialCheckIns: React.FC<HistorialCheckInsProps> = ({ historial }) => {
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [filtroSemaforo, setFiltroSemaforo] = useState<'todos' | 'verde' | 'amarillo' | 'rojo'>('todos');

  const historialFiltrado = useMemo(() => {
    return historial.filter((h) => {
      const fecha = new Date(h.checkIn.fecha);
      if (fechaInicio) {
        const ini = new Date(fechaInicio);
        if (fecha < new Date(ini.getFullYear(), ini.getMonth(), ini.getDate())) return false;
      }
      if (fechaFin) {
        const fin = new Date(fechaFin);
        // incluir todo el día fin
        const finEOD = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate(), 23, 59, 59, 999);
        if (fecha > finEOD) return false;
      }
      if (filtroSemaforo !== 'todos' && h.checkIn.semaforo !== filtroSemaforo) return false;
      return true;
    });
  }, [historial, fechaInicio, fechaFin, filtroSemaforo]);

  const columnas = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'semaforo', label: 'Estado' },
    { key: 'sensaciones', label: 'Sensaciones' },
    { key: 'media', label: 'Adjuntos' },
    { key: 'dolorLumbar', label: 'Dolor Lumbar' },
    { key: 'rpe', label: 'RPE' },
    { key: 'tendencia', label: 'Tendencia' },
  ];

  const datos = historialFiltrado.map((item) => {
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
      media: (checkIn.media && checkIn.media.length > 0) ? (
        <div className="flex items-center gap-1">
          {checkIn.media.slice(0, 3).map((m) =>
            m.type === 'image' ? (
              <span key={m.id} className="inline-block h-5 w-5 rounded border border-slate-200 overflow-hidden">
                <img src={m.thumbnailUrl || m.url} alt="m" className="h-full w-full object-cover" />
              </span>
            ) : (
              <span key={m.id} className="inline-flex h-5 w-5 items-center justify-center rounded border border-slate-200 text-[10px] text-slate-600">
                ▶
              </span>
            )
          )}
          {checkIn.media.length > 3 && (
            <span className="ml-1 text-xs text-slate-500">+{checkIn.media.length - 3}</span>
          )}
        </div>
      ) : (
        <span className="text-slate-400">-</span>
      ),
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
    total: historialFiltrado.length,
    verde: historialFiltrado.filter(h => h.checkIn.semaforo === 'verde').length,
    amarillo: historialFiltrado.filter(h => h.checkIn.semaforo === 'amarillo').length,
    rojo: historialFiltrado.filter(h => h.checkIn.semaforo === 'rojo').length,
    conDolor: historialFiltrado.filter(h => h.checkIn.dolorLumbar).length,
    promedioRPE: historialFiltrado.filter(h => h.checkIn.rpe).length > 0
      ? (historialFiltrado.filter(h => h.checkIn.rpe).reduce((sum, h) => sum + (h.checkIn.rpe || 0), 0) / 
         historialFiltrado.filter(h => h.checkIn.rpe).length).toFixed(1)
      : '-',
    mejora: historialFiltrado.filter(h => h.tendencia === 'mejora').length,
    estable: historialFiltrado.filter(h => h.tendencia === 'estable').length,
    empeora: historialFiltrado.filter(h => h.tendencia === 'empeora').length,
  };

  const rowsParaExportar = useMemo(() => {
    return historialFiltrado.map((h) => {
      const fecha = new Date(h.checkIn.fecha);
      const fechaStr = fecha.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      return {
        fecha: fechaStr,
        serie: h.checkIn.serie,
        semaforo: h.checkIn.semaforo,
        sensaciones: h.checkIn.sensaciones,
        dolorLumbar: h.checkIn.dolorLumbar,
        rpe: h.checkIn.rpe,
        observaciones: h.checkIn.observaciones,
      };
    });
  }, [historialFiltrado]);

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
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Historial Detallado
            </h3>
            <span className="text-sm text-slate-600 hidden sm:inline">
              {historialFiltrado.length} resultados
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => exportCheckInsExcel(rowsParaExportar, 'checkins')}
              disabled={rowsParaExportar.length === 0}
            >
              Exportar Excel
            </button>
            <button
              className="px-3 py-2 text-sm rounded-md bg-slate-700 text-white hover:bg-slate-800"
              onClick={() => exportCheckInsPDF(rowsParaExportar, 'checkins')}
              disabled={rowsParaExportar.length === 0}
            >
              Exportar PDF
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="flex flex-col">
            <label className="text-xs text-slate-600 mb-1">Fecha inicio</label>
            <input
              type="date"
              className="border rounded-md px-3 py-2 text-sm"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-600 mb-1">Fecha fin</label>
            <input
              type="date"
              className="border rounded-md px-3 py-2 text-sm"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-600 mb-1">Semáforo</label>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={filtroSemaforo}
              onChange={(e) => setFiltroSemaforo(e.target.value as any)}
            >
              <option value="todos">Todos</option>
              <option value="verde">Verde</option>
              <option value="amarillo">Amarillo</option>
              <option value="rojo">Rojo</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="text-sm text-slate-600 underline"
              onClick={() => {
                setFechaInicio('');
                setFechaFin('');
                setFiltroSemaforo('todos');
              }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
        <Table columns={columnas} data={datos} />
      </Card>
    </div>
  );
};

