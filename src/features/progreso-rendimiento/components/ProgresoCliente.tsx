import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { MetricCards } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import {
  TrendingUp,
  Dumbbell,
  Activity,
  Camera,
  Search,
  Filter,
  X,
  Plus,
  User,
  Calendar,
} from 'lucide-react';
import type { ResumenProgreso } from '../types';

export const ProgresoCliente: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [filtrosAvanzados, setFiltrosAvanzados] = useState(false);
  const [filtrosActivos, setFiltrosActivos] = useState(0);

  // Datos de ejemplo - en producción vendrían de la API
  const metricas = [
    {
      id: '1',
      title: 'Clientes Activos',
      value: '24',
      color: 'info' as const,
    },
    {
      id: '2',
      title: 'Progreso Promedio',
      value: '68%',
      color: 'success' as const,
    },
    {
      id: '3',
      title: 'Con Métricas Registradas',
      value: '18',
      color: 'info' as const,
    },
    {
      id: '4',
      title: 'Necesitan Atención',
      value: '3',
      color: 'warning' as const,
    },
  ];

  const clientesEjemplo: ResumenProgreso[] = [
    {
      clienteId: '1',
      clienteNombre: 'Juan Pérez',
      progresoId: 'p1',
      fuerzaPromedio: 85,
      repeticionesPromedio: 12,
      rangoMovimientoPromedio: 92,
      fotosTotales: 8,
      fechaInicio: '2024-01-15',
      fechaUltimaActualizacion: '2025-01-15',
      progresoGeneral: 78,
    },
  ];

  const hayFiltros = filtrosActivos > 0;

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => {}} leftIcon={<Plus size={20} />}>
          Nuevo Progreso
        </Button>
      </div>

      {/* Tarjetas de Métricas */}
      <MetricCards data={metricas} columns={4} />

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              {/* Input de búsqueda */}
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>

              {/* Botón de filtros */}
              <Button
                variant={filtrosAvanzados ? 'primary' : 'secondary'}
                onClick={() => {
                  setFiltrosAvanzados(!filtrosAvanzados);
                }}
              >
                <Filter size={18} className="mr-2" />
                Filtros
                {hayFiltros && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs">
                    {filtrosActivos}
                  </span>
                )}
              </Button>

              {/* Botón limpiar */}
              {hayFiltros && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFiltrosActivos(0);
                  }}
                >
                  <X size={18} className="mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Panel de Filtros Avanzados */}
          {filtrosAvanzados && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro Estado */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <select className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5">
                    <option>Todos</option>
                    <option>Activo</option>
                    <option>Completado</option>
                    <option>Pausado</option>
                  </select>
                </div>

                {/* Filtro Fecha */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>

                {/* Filtro Progreso */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <TrendingUp size={16} className="inline mr-1" />
                    Progreso Mínimo
                  </label>
                  <input
                    type="number"
                    placeholder="0%"
                    min="0"
                    max="100"
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumen de Resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{clientesEjemplo.length} resultados encontrados</span>
            {hayFiltros && <span>{filtrosActivos} filtros aplicados</span>}
          </div>
        </div>
      </Card>

      {/* Lista de Clientes */}
      <div className="space-y-4">
        {clientesEjemplo.map((cliente) => (
          <Card
            key={cliente.clienteId}
            variant="hover"
            className="h-full flex flex-col transition-shadow overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {cliente.clienteNombre}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Progreso desde {new Date(cliente.fechaInicio).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {cliente.progresoGeneral}%
                  </div>
                  <p className="text-xs text-gray-500">Progreso General</p>
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Dumbbell size={16} className="text-blue-600" />
                    <span className="text-xs text-gray-600">Fuerza</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {cliente.fuerzaPromedio}kg
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Activity size={16} className="text-green-600" />
                    <span className="text-xs text-gray-600">Repeticiones</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {cliente.repeticionesPromedio}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Camera size={16} className="text-purple-600" />
                    <span className="text-xs text-gray-600">Fotos</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {cliente.fotosTotales}
                  </div>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Rango de Movimiento</span>
                  <span>{cliente.rangoMovimientoPromedio}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${cliente.rangoMovimientoPromedio}%` }}
                  />
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                <Button variant="primary" size="sm" className="flex-1">
                  Ver Detalles
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  Editar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

