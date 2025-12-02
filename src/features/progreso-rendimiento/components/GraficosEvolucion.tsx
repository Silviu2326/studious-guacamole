import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import {
  LineChart,
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Dumbbell,
  Activity,
} from 'lucide-react';
import type { DatosGrafico } from '../types';

export const GraficosEvolucion: React.FC = () => {
  const [periodo, setPeriodo] = useState<'7d' | '30d' | '90d' | '1a'>('30d');
  const [tipoGrafico, setTipoGrafico] = useState<'linea' | 'barras'>('linea');

  // Datos de ejemplo
  const datosEjemplo: DatosGrafico[] = [
    { fecha: '2024-12-01', valor: 65, tipo: 'fuerza' },
    { fecha: '2024-12-15', valor: 72, tipo: 'fuerza' },
    { fecha: '2025-01-01', valor: 78, tipo: 'fuerza' },
    { fecha: '2025-01-15', valor: 85, tipo: 'fuerza' },
  ];

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
            <button
              onClick={() => setPeriodo('1a')}
              className={`px-3 py-1.5 text-sm transition-all border-l ${
                periodo === '1a'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              1 año
            </button>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          <Button
            variant={tipoGrafico === 'linea' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTipoGrafico('linea')}
          >
            <LineChart size={16} />
          </Button>
          <Button
            variant={tipoGrafico === 'barras' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setTipoGrafico('barras')}
          >
            <BarChart3 size={16} />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => {}}>
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Fuerza */}
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Dumbbell size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Evolución de Fuerza
                  </h3>
                  <p className="text-sm text-gray-600">Peso máximo por ejercicio</p>
                </div>
              </div>
            </div>

            {/* Área del gráfico - placeholder */}
            <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <LineChart size={48} className="mx-auto text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Gráfico de evolución</p>
                <p className="text-xs text-gray-500 mt-1">
                  {datosEjemplo.length} puntos de datos
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Gráfico de Repeticiones */}
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Evolución de Repeticiones
                  </h3>
                  <p className="text-sm text-gray-600">Repeticiones máximas</p>
                </div>
              </div>
            </div>

            {/* Área del gráfico - placeholder */}
            <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Gráfico de evolución</p>
                <p className="text-xs text-gray-500 mt-1">
                  {datosEjemplo.length} puntos de datos
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Gráfico de Rango de Movimiento */}
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Rango de Movimiento
                  </h3>
                  <p className="text-sm text-gray-600">Flexibilidad y movilidad</p>
                </div>
              </div>
            </div>

            {/* Área del gráfico - placeholder */}
            <div className="h-64 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <LineChart size={48} className="mx-auto text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">Gráfico de evolución</p>
                <p className="text-xs text-gray-500 mt-1">
                  {datosEjemplo.length} puntos de datos
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Gráfico Comparativo */}
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 size={20} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Comparativa General
                  </h3>
                  <p className="text-sm text-gray-600">Vista completa del progreso</p>
                </div>
              </div>
            </div>

            {/* Área del gráfico - placeholder */}
            <div className="h-64 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto text-orange-600 mb-2" />
                <p className="text-sm text-gray-600">Gráfico comparativo</p>
                <p className="text-xs text-gray-500 mt-1">
                  Múltiples métricas
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

