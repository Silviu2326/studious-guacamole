/**
 * Componente RendimientoMensual
 * 
 * Este componente muestra comparativas de rendimiento por mes para entrenadores y gimnasios.
 * 
 * Características:
 * - Para entrenadores: utiliza getRendimientoEntrenador para obtener métricas detalladas
 * - Para ambos roles: utiliza getComparativaMensual para mostrar métricas comparativas
 * - Muestra gráficos de evolución temporal (barras o líneas) con ingresos y beneficio (si aplica)
 * - Incluye leyenda con indicadores de tendencia general
 * 
 * Este componente se utiliza en el tab "Rendimiento" del panel financiero.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Loader2, 
  LineChart as LineChartIcon,
  Minus
} from 'lucide-react';
import { rendimientoApi } from '../api/rendimiento';
import { 
  RendimientoEntrenador, 
  MetricasFinancieras, 
  RolFinanciero,
  FiltrosComparativaMensual 
} from '../types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * Props del componente RendimientoMensual
 */
export interface RendimientoMensualProps {
  /** Rol financiero del usuario */
  rol: RolFinanciero;
  /** Filtros de período/base temporal */
  filtros?: FiltrosComparativaMensual;
}

/**
 * Componente principal de rendimiento mensual
 * 
 * Muestra métricas de rendimiento y gráficos de evolución mensual
 * diferenciados según el rol (entrenador o gimnasio).
 */
export const RendimientoMensual: React.FC<RendimientoMensualProps> = ({ 
  rol, 
  filtros 
}) => {
  const [rendimientoEntrenador, setRendimientoEntrenador] = useState<RendimientoEntrenador | null>(null);
  const [comparativaMensual, setComparativaMensual] = useState<MetricasFinancieras[]>([]);
  const [evolucionMensual, setEvolucionMensual] = useState<Array<{ mes: string; ingresos: number; beneficio?: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Para entrenadores, obtener rendimiento detallado
        if (rol === 'entrenador') {
          const ahora = new Date();
          const periodo = {
            mes: filtros?.mesInicio || ahora.getMonth() + 1,
            anio: filtros?.anioInicio || ahora.getFullYear()
          };
          const rendimiento = await rendimientoApi.getRendimientoEntrenador(periodo);
          setRendimientoEntrenador(rendimiento);
        }
        
        // Para ambos roles, obtener comparativa mensual
        const comparativa = await rendimientoApi.getComparativaMensual(rol, filtros);
        setComparativaMensual(comparativa);
        
        // Obtener evolución mensual para el gráfico
        const evolucion = await rendimientoApi.getEvolucionMensual(rol, {
          ...filtros,
          cantidadMeses: filtros?.cantidadMeses || 6
        });
        setEvolucionMensual(evolucion);
      } catch (error) {
        console.error('Error cargando rendimiento:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [rol, filtros]);

  // Obtener métricas de ingresos y beneficio de la comparativa
  const metricaIngresos = useMemo(() => 
    comparativaMensual.find(m => m.etiqueta === 'Ingresos'),
    [comparativaMensual]
  );

  const metricBeneficio = useMemo(() => 
    comparativaMensual.find(m => m.etiqueta === 'Beneficio'),
    [comparativaMensual]
  );

  // Calcular tendencia general
  const tendenciaGeneral = useMemo(() => {
    if (!metricaIngresos) return 'neutral';
    return metricaIngresos.tendencia;
  }, [metricaIngresos]);

  const getTrendIcon = (tendencia: 'up' | 'down' | 'neutral') => {
    switch (tendencia) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendColor = (tendencia: 'up' | 'down' | 'neutral') => {
    switch (tendencia) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendLabel = (tendencia: 'up' | 'down' | 'neutral') => {
    switch (tendencia) {
      case 'up':
        return 'Tendencia Alcista';
      case 'down':
        return 'Tendencia Bajista';
      default:
        return 'Tendencia Estable';
    }
  };

  // Tooltip personalizado para el gráfico
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: €${entry.value.toLocaleString('es-ES')}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando datos de rendimiento...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Leyenda con indicadores de tendencia general */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Indicadores de Tendencia
            </h2>
            <div className="flex items-center gap-2">
              {getTrendIcon(tendenciaGeneral)}
              <span className={`font-semibold ${getTrendColor(tendenciaGeneral)}`}>
                {getTrendLabel(tendenciaGeneral)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparativaMensual.map((metrica) => (
              <div 
                key={metrica.etiqueta}
                className="rounded-lg border border-gray-200 p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {metrica.etiqueta}
                  </span>
                  {getTrendIcon(metrica.tendencia)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      €{metrica.valorActual.toLocaleString('es-ES')}
                    </span>
                    <span className={`text-sm font-medium ${getTrendColor(metrica.tendencia)}`}>
                      {metrica.variacionPorcentual > 0 ? '+' : ''}
                      {metrica.variacionPorcentual.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {metrica.descripcionOpcional || 'Comparado con período anterior'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Gráfico de evolución mensual */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Evolución Mensual
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded-lg transition-colors ${
                  chartType === 'bar'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Vista de barras"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded-lg transition-colors ${
                  chartType === 'line'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Vista de líneas"
              >
                <LineChartIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {evolucionMensual.length === 0 ? (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500">No hay datos disponibles para mostrar</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'bar' ? (
                <BarChart data={evolucionMensual} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis 
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    stroke="#9CA3AF"
                    label={{ 
                      value: 'Importe (€)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#64748B', fontSize: 12 }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="ingresos" 
                    name="Ingresos" 
                    fill="#3B82F6" 
                    radius={[8, 8, 0, 0]}
                  />
                  {rol === 'gimnasio' && metricBeneficio && (
                    <Bar 
                      dataKey="beneficio" 
                      name="Beneficio" 
                      fill="#10B981" 
                      radius={[8, 8, 0, 0]}
                    />
                  )}
                </BarChart>
              ) : (
                <LineChart data={evolucionMensual} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis 
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    stroke="#9CA3AF"
                    label={{ 
                      value: 'Importe (€)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#64748B', fontSize: 12 }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="ingresos" 
                    name="Ingresos" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  {rol === 'gimnasio' && metricBeneficio && (
                    <Line 
                      type="monotone" 
                      dataKey="beneficio" 
                      name="Beneficio" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Información adicional para entrenadores */}
      {rol === 'entrenador' && rendimientoEntrenador && (
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Detalles de Rendimiento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-600 mb-1">Clientes Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {rendimientoEntrenador.numeroClientesActivos}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-600 mb-1">Ticket Medio</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{rendimientoEntrenador.ticketsMedio.toLocaleString('es-ES')}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-600 mb-1">Variación vs Mes Anterior</p>
                <div className="flex items-center gap-2">
                  {getTrendIcon(rendimientoEntrenador.tendenciaGlobal)}
                  <p className={`text-2xl font-bold ${getTrendColor(rendimientoEntrenador.tendenciaGlobal)}`}>
                    {rendimientoEntrenador.variacionVsMesAnterior > 0 ? '+' : ''}
                    {rendimientoEntrenador.variacionVsMesAnterior.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
