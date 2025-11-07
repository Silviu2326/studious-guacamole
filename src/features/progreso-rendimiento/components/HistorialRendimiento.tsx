import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import {
  History,
  Search,
  Filter,
  Calendar,
  Dumbbell,
  Camera,
  Activity,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { HistorialRendimiento } from '../types';

export const HistorialRendimiento: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [filtrosAvanzados, setFiltrosAvanzados] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');

  // Datos de ejemplo
  const historialEjemplo: HistorialRendimiento[] = [
    {
      id: '1',
      progresoId: 'p1',
      fecha: '2025-01-15',
      tipo: 'fuerza',
      datos: { ejercicio: 'Press Banca', peso: 85, repeticiones: 8 },
      notas: 'Buen progreso en la técnica',
    },
    {
      id: '2',
      progresoId: 'p1',
      fecha: '2025-01-14',
      tipo: 'foto',
      datos: { tipo: 'frente', url: '/fotos/frente.jpg' },
    },
    {
      id: '3',
      progresoId: 'p1',
      fecha: '2025-01-13',
      tipo: 'check_in',
      datos: { peso: 75.5, grasa: 18 },
    },
  ];

  const getTipoIcon = (tipo: HistorialRendimiento['tipo']) => {
    switch (tipo) {
      case 'fuerza':
        return <Dumbbell size={20} className="text-blue-600" />;
      case 'repeticiones':
        return <Activity size={20} className="text-green-600" />;
      case 'foto':
        return <Camera size={20} className="text-purple-600" />;
      case 'rango_movimiento':
        return <Activity size={20} className="text-orange-600" />;
      case 'check_in':
        return <FileText size={20} className="text-gray-600" />;
    }
  };

  const getTipoLabel = (tipo: HistorialRendimiento['tipo']) => {
    switch (tipo) {
      case 'fuerza':
        return 'Fuerza';
      case 'repeticiones':
        return 'Repeticiones';
      case 'foto':
        return 'Foto Comparativa';
      case 'rango_movimiento':
        return 'Rango de Movimiento';
      case 'check_in':
        return 'Check-in';
    }
  };

  const historialFiltrado =
    tipoFiltro === 'todos'
      ? historialEjemplo
      : historialEjemplo.filter((h) => h.tipo === tipoFiltro);

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => {}} leftIcon={<History size={20} />}>
          Exportar Historial
        </Button>
      </div>

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Buscar en historial..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              <Button
                variant={filtrosAvanzados ? 'primary' : 'secondary'}
                onClick={() => setFiltrosAvanzados(!filtrosAvanzados)}
              >
                <Filter size={18} className="mr-2" />
                Filtros
                {filtrosAvanzados ? (
                  <ChevronUp size={16} className="ml-2" />
                ) : (
                  <ChevronDown size={16} className="ml-2" />
                )}
              </Button>
            </div>
          </div>

          {/* Panel de Filtros Avanzados */}
          {filtrosAvanzados && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro Tipo */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <History size={16} className="inline mr-1" />
                    Tipo de Registro
                  </label>
                  <select
                    value={tipoFiltro}
                    onChange={(e) => setTipoFiltro(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  >
                    <option value="todos">Todos</option>
                    <option value="fuerza">Fuerza</option>
                    <option value="repeticiones">Repeticiones</option>
                    <option value="rango_movimiento">Rango de Movimiento</option>
                    <option value="foto">Fotos</option>
                    <option value="check_in">Check-ins</option>
                  </select>
                </div>

                {/* Filtro Fecha Desde */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Desde
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>

                {/* Filtro Fecha Hasta */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Hasta
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumen de Resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{historialFiltrado.length} registros encontrados</span>
          </div>
        </div>
      </Card>

      {/* Lista de Historial */}
      <div className="space-y-4">
        {historialFiltrado.map((registro) => (
          <Card key={registro.id} variant="hover" className="transition-shadow">
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  {getTipoIcon(registro.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getTipoLabel(registro.tipo)}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Calendar size={14} />
                        {new Date(registro.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Datos del registro */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(registro.datos).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="text-gray-900 font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {registro.notas && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                      <p className="text-sm text-gray-700">{registro.notas}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Estado vacío */}
      {historialFiltrado.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <History size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay registros en el historial
          </h3>
          <p className="text-gray-600 mb-4">
            Los registros de progreso aparecerán aquí
          </p>
        </Card>
      )}
    </div>
  );
};

