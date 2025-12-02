import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import type { Tendencia, RecomendacionProgreso } from '../types';

export const AnalizadorTendencias: React.FC = () => {
  const [periodo, setPeriodo] = useState<'7d' | '30d' | '90d'>('30d');

  // Datos de ejemplo
  const tendenciasEjemplo: Tendencia[] = [
    {
      id: '1',
      progresoId: 'p1',
      tipo: 'fuerza',
      ejercicioId: 'e1',
      direccion: 'mejora',
      porcentajeCambio: 12.5,
      periodo: '30 días',
      fecha: '2025-01-15',
    },
    {
      id: '2',
      progresoId: 'p1',
      tipo: 'repeticiones',
      ejercicioId: 'e2',
      direccion: 'estancamiento',
      porcentajeCambio: 0,
      periodo: '30 días',
      fecha: '2025-01-15',
    },
  ];

  const recomendacionesEjemplo: RecomendacionProgreso[] = [
    {
      id: '1',
      progresoId: 'p1',
      tipo: 'aumentar_carga',
      titulo: 'Aumentar carga en Press Banca',
      descripcion: 'El cliente ha mostrado mejora consistente. Considera aumentar la carga en 5kg.',
      prioridad: 'alta',
      fecha: '2025-01-15',
      aplicada: false,
    },
    {
      id: '2',
      progresoId: 'p1',
      tipo: 'periodo_descanso',
      titulo: 'Considerar período de descanso',
      descripcion: 'Se detectó posible fatiga acumulada. Sugerencia de descanso activo.',
      prioridad: 'media',
      fecha: '2025-01-14',
      aplicada: false,
    },
  ];

  const getTendenciaIcon = (direccion: Tendencia['direccion']) => {
    switch (direccion) {
      case 'mejora':
        return <TrendingUp size={20} className="text-green-600" />;
      case 'regresion':
        return <TrendingDown size={20} className="text-red-600" />;
      case 'estancamiento':
        return <Minus size={20} className="text-yellow-600" />;
    }
  };

  const getTendenciaColor = (direccion: Tendencia['direccion']) => {
    switch (direccion) {
      case 'mejora':
        return 'bg-green-100 text-green-800';
      case 'regresion':
        return 'bg-red-100 text-red-800';
      case 'estancamiento':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPrioridadColor = (prioridad: RecomendacionProgreso['prioridad']) => {
    switch (prioridad) {
      case 'alta':
        return 'red';
      case 'media':
        return 'yellow';
      case 'baja':
        return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Selector de período */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Período:</span>
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setPeriodo('7d')}
              className={`px-3 py-1.5 text-sm transition-all ${
                periodo === '7d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              7 días
            </button>
            <button
              onClick={() => setPeriodo('30d')}
              className={`px-3 py-1.5 text-sm transition-all border-l ${
                periodo === '30d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              30 días
            </button>
            <button
              onClick={() => setPeriodo('90d')}
              className={`px-3 py-1.5 text-sm transition-all border-l ${
                periodo === '90d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              90 días
            </button>
          </div>
        </div>

        <Button variant="secondary" onClick={() => {}}>
          <RefreshCw size={16} className="mr-2" />
          Actualizar Análisis
        </Button>
      </div>

      {/* Resumen de Tendencias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mejoras</h3>
                <p className="text-sm text-gray-600">
                  {tendenciasEjemplo.filter((t) => t.direccion === 'mejora').length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Minus size={20} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Estancamientos</h3>
                <p className="text-sm text-gray-600">
                  {tendenciasEjemplo.filter((t) => t.direccion === 'estancamiento').length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Regresiones</h3>
                <p className="text-sm text-gray-600">
                  {tendenciasEjemplo.filter((t) => t.direccion === 'regresion').length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de Tendencias */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tendencias Detectadas</h2>
          <div className="space-y-4">
            {tendenciasEjemplo.map((tendencia) => (
              <div
                key={tendencia.id}
                className="p-4 rounded-xl bg-gray-50 ring-1 ring-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getTendenciaIcon(tendencia.direccion)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {tendencia.tipo === 'fuerza'
                            ? 'Fuerza'
                            : tendencia.tipo === 'repeticiones'
                            ? 'Repeticiones'
                            : 'Rango de Movimiento'}
                        </h3>
                        <Badge
                          variant={getPrioridadColor('media') as any}
                          className={getTendenciaColor(tendencia.direccion)}
                        >
                          {tendencia.direccion === 'mejora'
                            ? 'Mejora'
                            : tendencia.direccion === 'regresion'
                            ? 'Regresión'
                            : 'Estancamiento'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {tendencia.ejercicioId && `Ejercicio: ${tendencia.ejercicioId}`}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          {tendencia.direccion === 'mejora' ? '+' : ''}
                          {tendencia.porcentajeCambio > 0
                            ? `${tendencia.porcentajeCambio}%`
                            : 'Sin cambio'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {tendencia.periodo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recomendaciones */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recomendaciones</h2>
            <Badge variant="yellow" leftIcon={<AlertTriangle size={12} />}>
              {recomendacionesEjemplo.filter((r) => !r.aplicada).length} pendientes
            </Badge>
          </div>
          <div className="space-y-4">
            {recomendacionesEjemplo.map((recomendacion) => (
              <div
                key={recomendacion.id}
                className="p-4 rounded-xl bg-white ring-1 ring-slate-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {recomendacion.titulo}
                      </h3>
                      <Badge variant={getPrioridadColor(recomendacion.prioridad) as any}>
                        {recomendacion.prioridad}
                      </Badge>
                      {recomendacion.aplicada && (
                        <Badge variant="green" leftIcon={<CheckCircle2 size={12} />}>
                          Aplicada
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{recomendacion.descripcion}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} />
                      {new Date(recomendacion.fecha).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {!recomendacion.aplicada && (
                      <Button variant="primary" size="sm" onClick={() => {}}>
                        Aplicar
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => {}}>
                      Descartar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

