import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { MetricCards } from '../../../components/componentsreutilizables';
import {
  Dumbbell,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import type { MetricaFuerza } from '../types';

export const MetricasFuerza: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Datos de ejemplo
  const metricasEjemplo: MetricaFuerza[] = [
    {
      id: '1',
      progresoId: 'p1',
      ejercicioId: 'e1',
      ejercicioNombre: 'Press Banca',
      pesoMaximo: 85,
      repeticionesMaximas: 8,
      fecha: '2025-01-15',
      notas: 'Última sesión con buena técnica',
    },
    {
      id: '2',
      progresoId: 'p1',
      ejercicioId: 'e2',
      ejercicioNombre: 'Sentadilla',
      pesoMaximo: 120,
      repeticionesMaximas: 6,
      fecha: '2025-01-14',
    },
  ];

  const metricasResumen = [
    {
      id: '1',
      title: 'Peso Máximo Promedio',
      value: `${Math.round(
        metricasEjemplo.reduce((acc, m) => acc + m.pesoMaximo, 0) /
          metricasEjemplo.length
      )}kg`,
      color: 'info' as const,
    },
    {
      id: '2',
      title: 'Ejercicios Registrados',
      value: metricasEjemplo.length.toString(),
      color: 'success' as const,
    },
    {
      id: '3',
      title: 'Mejora Semanal',
      value: '+5%',
      color: 'success' as const,
    },
    {
      id: '4',
      title: 'Última Actualización',
      value: 'Hoy',
      color: 'info' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button
          onClick={() => setMostrarFormulario(true)}
          leftIcon={<Plus size={20} />}
        >
          Registrar Métrica
        </Button>
      </div>

      {/* Tarjetas de Métricas */}
      <MetricCards data={metricasResumen} columns={4} />

      {/* Sistema de Búsqueda */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Buscar ejercicio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            <Button variant="secondary">
              <Filter size={18} className="mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de Métricas */}
      <div className="space-y-4">
        {metricasEjemplo.map((metrica) => (
          <Card
            key={metrica.id}
            variant="hover"
            className="transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Dumbbell size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {metrica.ejercicioNombre}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(metrica.fecha).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="rounded-xl bg-blue-50 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={16} className="text-blue-600" />
                        <span className="text-xs text-gray-600">Peso Máximo</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {metrica.pesoMaximo}kg
                      </div>
                    </div>
                    <div className="rounded-xl bg-green-50 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Dumbbell size={16} className="text-green-600" />
                        <span className="text-xs text-gray-600">Repeticiones</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {metrica.repeticionesMaximas}
                      </div>
                    </div>
                  </div>

                  {metrica.notas && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-700">{metrica.notas}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => {}}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {}}>
                    <Trash2 size={16} className="text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Estado vacío */}
      {metricasEjemplo.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Dumbbell size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay métricas registradas
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza registrando tu primera métrica de fuerza
          </p>
          <Button onClick={() => setMostrarFormulario(true)}>
            Registrar Métrica
          </Button>
        </Card>
      )}
    </div>
  );
};

