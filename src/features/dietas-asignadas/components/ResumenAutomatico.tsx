import React, { useMemo } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { BarChart3, TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import type { Dieta, TipoMetricaExcel } from '../types';

export interface CeldaSeleccionada {
  dia: string;
  tipoComida: string;
  columna: string;
  valor: string | number;
}

export interface RangoSeleccionado {
  celdas: CeldaSeleccionada[];
  inicio: { dia: string; tipoComida: string; columna: string };
  fin: { dia: string; tipoComida: string; columna: string };
}

interface ResumenAutomaticoProps {
  dieta: Dieta;
  rangoSeleccionado: RangoSeleccionado;
  onCerrar: () => void;
}

export const ResumenAutomatico: React.FC<ResumenAutomaticoProps> = ({
  dieta,
  rangoSeleccionado,
  onCerrar,
}) => {
  // Calcular resúmenes automáticos basados en el rango seleccionado
  const resumenes = useMemo(() => {
    const valores = rangoSeleccionado.celdas
      .map((celda) => {
        const num = typeof celda.valor === 'string' ? parseFloat(celda.valor) : celda.valor;
        return isNaN(num) ? null : num;
      })
      .filter((v): v is number => v !== null);

    if (valores.length === 0) {
      return null;
    }

    // Agrupar por columna (métrica)
    const porColumna: Record<string, number[]> = {};
    rangoSeleccionado.celdas.forEach((celda) => {
      if (!porColumna[celda.columna]) {
        porColumna[celda.columna] = [];
      }
      const num = typeof celda.valor === 'string' ? parseFloat(celda.valor) : celda.valor;
      if (!isNaN(num)) {
        porColumna[celda.columna].push(num);
      }
    });

    // Agrupar por día
    const porDia: Record<string, number> = {};
    rangoSeleccionado.celdas.forEach((celda) => {
      if (!porDia[celda.dia]) {
        porDia[celda.dia] = 0;
      }
      const num = typeof celda.valor === 'string' ? parseFloat(celda.valor) : celda.valor;
      if (!isNaN(num)) {
        porDia[celda.dia] += num;
      }
    });

    // Agrupar por tipo de comida
    const porTipoComida: Record<string, number> = {};
    rangoSeleccionado.celdas.forEach((celda) => {
      if (!porTipoComida[celda.tipoComida]) {
        porTipoComida[celda.tipoComida] = 0;
      }
      const num = typeof celda.valor === 'string' ? parseFloat(celda.valor) : celda.valor;
      if (!isNaN(num)) {
        porTipoComida[celda.tipoComida] += num;
      }
    });

    // Calcular estadísticas generales
    const suma = valores.reduce((acc, v) => acc + v, 0);
    const promedio = suma / valores.length;
    const minimo = Math.min(...valores);
    const maximo = Math.max(...valores);
    const mediana = valores.sort((a, b) => a - b)[Math.floor(valores.length / 2)];

    // Calcular promedio de saciedad si hay datos de feedback
    // (esto sería ideal si tenemos acceso a FeedbackCliente, pero por ahora lo simulamos)
    const promedioSaciedad = dieta.comidas.length > 0 
      ? dieta.comidas.reduce((acc, c) => {
          // Simulamos saciedad basada en proteínas y fibra
          const saciedadEstimada = Math.min(5, (c.proteinas / 30) * 2 + (c.carbohidratos / 50) * 1.5);
          return acc + saciedadEstimada;
        }, 0) / dieta.comidas.length
      : null;

    return {
      estadisticas: {
        suma,
        promedio,
        minimo,
        maximo,
        mediana,
        cantidad: valores.length,
      },
      porColumna,
      porDia,
      porTipoComida,
      promedioSaciedad,
    };
  }, [rangoSeleccionado, dieta]);

  if (!resumenes) {
    return null;
  }

  const columnasUnicas = Object.keys(resumenes.porColumna);
  const diasUnicos = Object.keys(resumenes.porDia);
  const tiposComidaUnicos = Object.keys(resumenes.porTipoComida);

  return (
    <Card className="bg-white border border-blue-200 shadow-lg">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Resumen Automático</h3>
        </div>
        <button
          onClick={onCerrar}
          className="p-1 hover:bg-slate-100 rounded transition-colors"
          aria-label="Cerrar resumen"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Estadísticas Generales */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Estadísticas Generales</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Promedio</div>
              <div className="text-lg font-semibold text-gray-900">
                {resumenes.estadisticas.promedio.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Suma</div>
              <div className="text-lg font-semibold text-gray-900">
                {resumenes.estadisticas.suma.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Mínimo</div>
              <div className="text-lg font-semibold text-gray-900">
                {resumenes.estadisticas.minimo.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Máximo</div>
              <div className="text-lg font-semibold text-gray-900">
                {resumenes.estadisticas.maximo.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Mediana</div>
              <div className="text-lg font-semibold text-gray-900">
                {resumenes.estadisticas.mediana.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Cantidad</div>
              <div className="text-lg font-semibold text-gray-900">
                {resumenes.estadisticas.cantidad}
              </div>
            </div>
          </div>
        </div>

        {/* Promedio de Saciedad */}
        {resumenes.promedioSaciedad !== null && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Promedio de Saciedad</h4>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-blue-600">
                  {resumenes.promedioSaciedad.toFixed(1)}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">Escala 1-5</div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(resumenes.promedioSaciedad / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Por Columna (Métrica) */}
        {columnasUnicas.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Por Métrica</h4>
            <div className="space-y-2">
              {columnasUnicas.map((columna) => {
                const valores = resumenes.porColumna[columna];
                const suma = valores.reduce((acc, v) => acc + v, 0);
                const promedio = suma / valores.length;
                // Mapear IDs a etiquetas más descriptivas
                const etiquetas: Record<string, string> = {
                  'calorias': 'Calorías',
                  'proteinas': 'Proteínas (g)',
                  'carbohidratos': 'Carbohidratos (g)',
                  'grasas': 'Grasas (g)',
                  'fibra': 'Fibra (g)',
                  'azucares': 'Azúcares (g)',
                  'sodio': 'Sodio (mg)',
                  'ratio-proteina': 'Ratio Proteína (g/kg)',
                  'vasos-agua': 'Vasos de Agua',
                  'adherencia': 'Adherencia (%)',
                  'tiempo-preparacion': 'Tiempo Preparación (min)',
                  'coste': 'Coste (€)',
                  'satisfaccion-prevista': 'Satisfacción Prevista',
                };
                const etiqueta = etiquetas[columna] || columna;
                return (
                  <div key={columna} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{etiqueta}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Suma: {suma.toFixed(2)}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        Promedio: {promedio.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Por Día */}
        {diasUnicos.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Volumen por Día</h4>
            <div className="space-y-2">
              {diasUnicos.map((dia) => (
                <div key={dia} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">{dia}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {resumenes.porDia[dia].toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Por Tipo de Comida */}
        {tiposComidaUnicos.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Por Tipo de Comida</h4>
            <div className="space-y-2">
              {tiposComidaUnicos.map((tipo) => (
                <div key={tipo} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {tipo.replace('-', ' ')}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {resumenes.porTipoComida[tipo].toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

