import React, { useState } from 'react';
import { Card, MetricCards, Badge, Table, Select } from '../../../components/componentsreutilizables';
import { 
  FileText, 
  TrendingUp, 
  Users, 
  Star,
  BarChart3,
  Target,
  Award,
  Activity,
  Filter,
  TrendingDown,
  CheckCircle
} from 'lucide-react';
import { EstadisticasPlantillas, PlantillaDieta } from '../types';
import type { SelectOption, MetricCardData } from '../../../components/componentsreutilizables';

interface AnalyticsPlantillasProps {
  estadisticas: EstadisticasPlantillas;
}

export const AnalyticsPlantillas: React.FC<AnalyticsPlantillasProps> = ({
  estadisticas,
}) => {
  const [vistaGraficos, setVistaGraficos] = useState<string>('mensual');

  const vistas: SelectOption[] = [
    { value: 'semanal', label: 'Vista Semanal' },
    { value: 'mensual', label: 'Vista Mensual' },
    { value: 'trimestral', label: 'Vista Trimestral' },
  ];

  const datosEvolucion = [
    { periodo: 'Ene', creacion: 2, uso: 180 },
    { periodo: 'Feb', creacion: 3, uso: 245 },
    { periodo: 'Mar', creacion: 5, uso: 310 },
    { periodo: 'Abr', creacion: 4, uso: 280 },
    { periodo: 'May', creacion: 3, uso: 265 },
    { periodo: 'Jun', creacion: 2, uso: 190 },
  ];
  const metricas = [
    {
      title: 'Total Plantillas',
      value: estadisticas.totalPlantillas.toString(),
      icon: <FileText className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'blue' as const,
    },
    {
      title: 'Plantillas Públicas',
      value: estadisticas.plantillasPublicadas.toString(),
      icon: <Star className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'yellow' as const,
    },
    {
      title: 'Uso Total',
      value: estadisticas.usoTotal.toString(),
      icon: <Users className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'green' as const,
    },
    {
      title: 'Efectividad Promedio',
      value: `${estadisticas.efectividadPromedio}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'purple' as const,
    },
  ];

  const renderGraficoBarras = () => {
    const maxValor = Math.max(...datosEvolucion.flatMap(d => [d.creacion, d.uso]));
    const maxAltura = 120;
    
    return (
      <div className="mt-4">
        <div className="flex items-end justify-between gap-2 h-40">
          {datosEvolucion.map((dato, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex items-end gap-1 h-full w-full">
                <div 
                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                  style={{ height: `${(dato.creacion / maxValor) * maxAltura}px` }}
                  title={`Creación: ${dato.creacion}`}
                />
                <div 
                  className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                  style={{ height: `${(dato.uso / maxValor) * maxAltura}px` }}
                  title={`Uso: ${dato.uso}`}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">{dato.periodo}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Nuevas plantillas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Uso total</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <MetricCards data={metricas} columns={4} />

      {/* Gráfico de evolución */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity size={24} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Evolución Temporal</h3>
          </div>
          <Select
            value={vistaGraficos}
            onChange={e => setVistaGraficos(e.target.value)}
            options={vistas}
            className="w-48"
          />
        </div>
        {renderGraficoBarras()}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plantilla Más Usada */}
        {estadisticas.plantillaMasUsada && (
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Award size={24} className="text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Plantilla Más Popular
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {estadisticas.plantillaMasUsada.nombre}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-blue-500" />
                    {estadisticas.plantillaMasUsada.usoCount} usos totales
                  </span>
                  {estadisticas.plantillaMasUsada.efectividad && (
                    <span className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-green-500" />
                      {estadisticas.plantillaMasUsada.efectividad.tasaExito}% éxito
                    </span>
                  )}
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                  <div className="text-sm font-semibold text-yellow-900 mb-1">
                    Categoría: {estadisticas.plantillaMasUsada.categoria.replace('-', ' ')}
                  </div>
                  <div className="text-sm text-yellow-800">
                    {estadisticas.plantillaMasUsada.calorias} kcal - Versión {estadisticas.plantillaMasUsada.version}
                  </div>
                </div>
              </div>
              {estadisticas.plantillaMasUsada.efectividad && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg text-center border border-blue-200">
                    <div className="text-2xl font-bold text-blue-900">{estadisticas.plantillaMasUsada.efectividad.tasaExito}%</div>
                    <div className="text-xs text-blue-700 font-medium">Tasa Éxito</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center border border-green-200">
                    <div className="text-2xl font-bold text-green-900">{estadisticas.plantillaMasUsada.efectividad.satisfaccionPromedio}/5</div>
                    <div className="text-xs text-green-700 font-medium">Satisfacción</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center border border-purple-200">
                    <div className="text-2xl font-bold text-purple-900">{estadisticas.plantillaMasUsada.efectividad.seguimientoPromedio}%</div>
                    <div className="text-xs text-purple-700 font-medium">Seguimiento</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Categoría Más Popular */}
        {estadisticas.categoriaMasPopular && (
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Target size={24} className="text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Categoría Más Popular
              </h3>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="purple" className="text-xl px-4 py-3">
                    {estadisticas.categoriaMasPopular.replace('-', ' ')}
                  </Badge>
                  <CheckCircle size={24} className="text-purple-600" />
                </div>
                <div className="text-sm text-purple-800">
                  Categoría con mayor adopción entre todas las plantillas
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                  <div className="text-3xl font-bold text-gray-900">{estadisticas.plantillasPublicadas}</div>
                  <div className="text-xs text-gray-600 font-medium">Plantillas Públicas</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
                  <div className="text-3xl font-bold text-gray-900">{estadisticas.efectividadPromedio}%</div>
                  <div className="text-xs text-gray-600 font-medium">Efectividad Media</div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

