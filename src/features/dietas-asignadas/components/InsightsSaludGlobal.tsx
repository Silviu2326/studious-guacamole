import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import {
  DollarSign,
  Leaf,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Target,
  BarChart3,
  Info,
} from 'lucide-react';
import type { Dieta, InsightsSaludGlobal, NivelProcesamiento } from '../types';
import { getInsightsSaludGlobal } from '../api/insightsSaludGlobal';

interface InsightsSaludGlobalProps {
  dieta: Dieta;
}

export const InsightsSaludGlobal: React.FC<InsightsSaludGlobalProps> = ({ dieta }) => {
  const [insights, setInsights] = useState<InsightsSaludGlobal | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarInsights();
  }, [dieta.id]);

  const cargarInsights = async () => {
    setCargando(true);
    try {
      const data = await getInsightsSaludGlobal(dieta.id);
      setInsights(data);
    } catch (error) {
      console.error('Error cargando insights de salud global:', error);
    } finally {
      setCargando(false);
    }
  };

  const getColorPuntuacion = (puntuacion: number) => {
    if (puntuacion >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (puntuacion >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getLabelNivelProcesamiento = (nivel: NivelProcesamiento) => {
    switch (nivel) {
      case 'sin-procesar':
        return 'Sin Procesar';
      case 'minimamente-procesado':
        return 'Mínimamente Procesado';
      case 'procesado':
        return 'Procesado';
      case 'ultra-procesado':
        return 'Ultra-Procesado';
    }
  };

  const getColorNivelProcesamiento = (nivel: NivelProcesamiento) => {
    switch (nivel) {
      case 'sin-procesar':
        return 'bg-green-100 text-green-800';
      case 'minimamente-procesado':
        return 'bg-blue-100 text-blue-800';
      case 'procesado':
        return 'bg-yellow-100 text-yellow-800';
      case 'ultra-procesado':
        return 'bg-red-100 text-red-800';
    }
  };

  if (cargando) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Cargando insights...</span>
        </div>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card className="p-6">
        <p className="text-sm text-gray-600 text-center">No hay insights disponibles</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Insights de Salud Global</h3>
            <p className="text-sm text-gray-600">Análisis de coste, variedad y procesamiento</p>
          </div>
        </div>
        <Badge className={getColorPuntuacion(insights.puntuacionGeneral)}>
          Puntuación: {insights.puntuacionGeneral}/100
        </Badge>
      </div>

      {/* Resumen */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Resumen Ejecutivo</p>
            <p className="text-sm text-blue-800">{insights.resumen}</p>
          </div>
        </div>
      </Card>

      {/* Grid de 3 columnas para los 3 insights principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insight 1: Coste */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">Coste Total</h4>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {insights.coste.costePorDia.toFixed(2)}€
              </div>
              <div className="text-xs text-gray-500">por día</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-600">Semanal</div>
                <div className="font-semibold">{insights.coste.costeTotalSemanal.toFixed(2)}€</div>
              </div>
              <div>
                <div className="text-gray-600">Mensual</div>
                <div className="font-semibold">{insights.coste.costeTotalMensual.toFixed(2)}€</div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">vs. Promedio</span>
                <div className="flex items-center gap-1">
                  {insights.coste.comparacionMercado.diferencia > 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  )}
                  <span
                    className={
                      insights.coste.comparacionMercado.diferencia > 0
                        ? 'text-red-600 font-semibold'
                        : 'text-green-600 font-semibold'
                    }
                  >
                    {insights.coste.comparacionMercado.porcentajeDiferencia > 0 ? '+' : ''}
                    {insights.coste.comparacionMercado.porcentajeDiferencia.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Promedio mercado: {insights.coste.comparacionMercado.promedio.toFixed(2)}€/día
              </div>
            </div>

            {insights.coste.recomendaciones.length > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-2">Recomendaciones:</div>
                <ul className="space-y-1">
                  {insights.coste.recomendaciones.slice(0, 2).map((rec, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Insight 2: Variedad Nutricional */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">Variedad Nutricional</h4>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {insights.variedadNutricional.puntuacionVariedad.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500">puntuación de variedad</div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs font-medium text-gray-700 mb-2">Grupos Alimentarios:</div>
              <div className="space-y-2">
                {insights.variedadNutricional.gruposAlimentarios.slice(0, 5).map((grupo, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 capitalize">{grupo.grupo}</span>
                      {grupo.recomendado ? (
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-yellow-600" />
                      )}
                    </div>
                    <div className="text-gray-600">
                      {grupo.alimentos} alimentos ({grupo.porcentaje.toFixed(0)}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {insights.variedadNutricional.recomendaciones.length > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-2">Recomendaciones:</div>
                <ul className="space-y-1">
                  {insights.variedadNutricional.recomendaciones.slice(0, 2).map((rec, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Insight 3: Grado de Procesamiento */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-gray-900">Grado de Procesamiento</h4>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {insights.gradoProcesamiento.puntuacionProcesamiento.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500">puntuación (mayor = menos procesado)</div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs font-medium text-gray-700 mb-2">Distribución:</div>
              <div className="space-y-2">
                {insights.gradoProcesamiento.distribucion.map((dist, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <Badge className={getColorNivelProcesamiento(dist.nivel)}>
                      {getLabelNivelProcesamiento(dist.nivel)}
                    </Badge>
                    <div className="text-xs text-gray-600">
                      {dist.porcentaje.toFixed(1)}% ({dist.alimentos.length} alimentos)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {insights.gradoProcesamiento.alimentosUltraProcesados.length > 0 && (
              <div className="pt-3 border-t border-red-200 bg-red-50 rounded p-2">
                <div className="text-xs font-medium text-red-900 mb-1">
                  Alimentos Ultra-Procesados:
                </div>
                <div className="text-xs text-red-800">
                  {insights.gradoProcesamiento.alimentosUltraProcesados
                    .slice(0, 3)
                    .map((a) => a.nombre)
                    .join(', ')}
                  {insights.gradoProcesamiento.alimentosUltraProcesados.length > 3 && '...'}
                </div>
              </div>
            )}

            {insights.gradoProcesamiento.recomendaciones.length > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-2">Recomendaciones:</div>
                <ul className="space-y-1">
                  {insights.gradoProcesamiento.recomendaciones.slice(0, 2).map((rec, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recomendaciones Prioritarias */}
      {insights.recomendacionesPrioritarias.length > 0 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-yellow-700" />
            <h4 className="font-semibold text-yellow-900">Recomendaciones Prioritarias</h4>
          </div>
          <ul className="space-y-2">
            {insights.recomendacionesPrioritarias.map((rec, idx) => (
              <li key={idx} className="text-sm text-yellow-900 flex items-start gap-2">
                <span className="font-semibold text-yellow-700">{idx + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

