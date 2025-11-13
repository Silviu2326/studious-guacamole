import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  CheckCircle2,
  AlertCircle,
  Activity,
  Calendar,
  BarChart3,
  Loader2,
} from 'lucide-react';
import type { Dieta } from '../types';
import {
  getDashboardCompacto,
  getTendenciasSemanales,
  type DashboardCompactoData,
  type TendenciaSemanal,
} from '../api/dashboard';

interface DashboardCompactoProps {
  dieta: Dieta;
}

export const DashboardCompacto: React.FC<DashboardCompactoProps> = ({ dieta }) => {
  const [datos, setDatos] = useState<DashboardCompactoData | null>(null);
  const [tendencias, setTendencias] = useState<TendenciaSemanal[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [dieta.id, dieta.clienteId]);

  const cargarDatos = async () => {
    if (!dieta.clienteId) return;

    setCargando(true);
    try {
      const [dashboardData, tendenciasData] = await Promise.all([
        getDashboardCompacto(dieta.id, dieta.clienteId),
        getTendenciasSemanales(dieta.clienteId, 4),
      ]);
      setDatos(dashboardData);
      setTendencias(tendenciasData);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setCargando(false);
    }
  };

  const getIconoTendencia = (tendencia: 'mejora' | 'estable' | 'empeora') => {
    switch (tendencia) {
      case 'mejora':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'empeora':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getColorEstado = (estado: 'deficiente' | 'adecuado' | 'optimo') => {
    switch (estado) {
      case 'optimo':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'adecuado':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'deficiente':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const calcularPorcentajeMacro = (consumido: number, objetivo: number) => {
    return objetivo > 0 ? (consumido / objetivo) * 100 : 0;
  };

  if (cargando) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Cargando dashboard...</span>
        </div>
      </Card>
    );
  }

  if (!datos) {
    return (
      <Card className="p-6">
        <p className="text-sm text-gray-600 text-center">No hay datos disponibles</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Dashboard Compacto</h3>
            <p className="text-sm text-gray-600">Vista general del estado nutricional</p>
          </div>
        </div>
        <Badge
          className={
            datos.porcentajeDiasEnRango >= 80
              ? 'bg-green-100 text-green-800'
              : datos.porcentajeDiasEnRango >= 60
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }
        >
          {datos.porcentajeDiasEnRango.toFixed(0)}% días en rango
        </Badge>
      </div>

      {/* Macros Diarias */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900">Macros Diarias (Hoy)</h4>
          <Badge
            className={
              datos.macrosDiarias.enRango
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }
          >
            {datos.macrosDiarias.enRango ? 'En rango' : 'Fuera de rango'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Calorías */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Calorías</div>
            <div className="text-2xl font-bold text-gray-900">
              {datos.macrosDiarias.macrosConsumidos.calorias}
            </div>
            <div className="text-xs text-gray-500">
              / {datos.macrosDiarias.macrosObjetivo.calorias} kcal
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  datos.macrosDiarias.enRango ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{
                  width: `${Math.min(
                    calcularPorcentajeMacro(
                      datos.macrosDiarias.macrosConsumidos.calorias,
                      datos.macrosDiarias.macrosObjetivo.calorias
                    ),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Proteínas */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Proteínas</div>
            <div className="text-2xl font-bold text-gray-900">
              {datos.macrosDiarias.macrosConsumidos.proteinas}g
            </div>
            <div className="text-xs text-gray-500">
              / {datos.macrosDiarias.macrosObjetivo.proteinas}g
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{
                  width: `${Math.min(
                    calcularPorcentajeMacro(
                      datos.macrosDiarias.macrosConsumidos.proteinas,
                      datos.macrosDiarias.macrosObjetivo.proteinas
                    ),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Carbohidratos */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Carbohidratos</div>
            <div className="text-2xl font-bold text-gray-900">
              {datos.macrosDiarias.macrosConsumidos.carbohidratos}g
            </div>
            <div className="text-xs text-gray-500">
              / {datos.macrosDiarias.macrosObjetivo.carbohidratos}g
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-orange-500"
                style={{
                  width: `${Math.min(
                    calcularPorcentajeMacro(
                      datos.macrosDiarias.macrosConsumidos.carbohidratos,
                      datos.macrosDiarias.macrosObjetivo.carbohidratos
                    ),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Grasas */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Grasas</div>
            <div className="text-2xl font-bold text-gray-900">
              {datos.macrosDiarias.macrosConsumidos.grasas}g
            </div>
            <div className="text-xs text-gray-500">
              / {datos.macrosDiarias.macrosObjetivo.grasas}g
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-purple-500"
                style={{
                  width: `${Math.min(
                    calcularPorcentajeMacro(
                      datos.macrosDiarias.macrosConsumidos.grasas,
                      datos.macrosDiarias.macrosObjetivo.grasas
                    ),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Tendencia Semanal */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900">Tendencia Semanal</h4>
          <div className="flex items-center gap-1 ml-auto">
            {getIconoTendencia(datos.tendenciaSemanal.tendencia)}
            <span className="text-sm text-gray-600 capitalize">
              {datos.tendenciaSemanal.tendencia}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Adherencia Promedio</div>
            <div className="text-2xl font-bold text-blue-600">
              {datos.tendenciaSemanal.promedioAdherencia.toFixed(0)}%
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Días en Rango</div>
            <div className="text-2xl font-bold text-green-600">
              {datos.tendenciaSemanal.diasEnRango}/{datos.tendenciaSemanal.totalDias}
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Semana</div>
            <div className="text-lg font-bold text-purple-600">
              {datos.tendenciaSemanal.semana}
            </div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">% Días en Rango</div>
            <div className="text-2xl font-bold text-orange-600">
              {datos.porcentajeDiasEnRango.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Gráfico de tendencia (simplificado) */}
        {tendencias.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-gray-600 mb-2">Últimas 4 semanas</div>
            <div className="flex items-end gap-2 h-32">
              {tendencias.map((tendencia, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{
                      height: `${(tendencia.promedioAdherencia / 100) * 100}%`,
                    }}
                    title={`${tendencia.semana}: ${tendencia.promedioAdherencia.toFixed(0)}%`}
                  />
                  <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">
                    W{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Objetivos de Micronutrientes */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900">Objetivos de Micronutrientes</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datos.objetivosMicronutrientes.map((micronutriente) => (
            <div
              key={micronutriente.nombre}
              className={`p-4 rounded-lg border ${getColorEstado(micronutriente.estado)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-sm">{micronutriente.nombre}</div>
                {micronutriente.estado === 'optimo' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : micronutriente.estado === 'deficiente' ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Activity className="w-4 h-4" />
                )}
              </div>
              <div className="text-xs opacity-75 mb-2">
                {micronutriente.consumido.toFixed(1)} / {micronutriente.objetivo}{' '}
                {micronutriente.unidad}
              </div>
              <div className="w-full bg-white/50 rounded-full h-2 mb-1">
                <div
                  className={`h-2 rounded-full ${
                    micronutriente.estado === 'optimo'
                      ? 'bg-green-600'
                      : micronutriente.estado === 'adecuado'
                      ? 'bg-blue-600'
                      : 'bg-red-600'
                  }`}
                  style={{
                    width: `${Math.min(micronutriente.porcentaje, 100)}%`,
                  }}
                />
              </div>
              <div className="text-xs opacity-75">
                {micronutriente.porcentaje.toFixed(0)}% del objetivo
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

