/**
 * Componente para comparar ejercicios con sesión anterior
 * User Story: Como coach quiero comparar cualquier ejercicio con su versión en la sesión anterior
 */

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import type { ComparacionEjercicio, TipoCambio } from '../types';

type ExerciseComparisonProps = {
  comparacion: ComparacionEjercicio;
  onClose?: () => void;
};

export function ExerciseComparison({ comparacion, onClose }: ExerciseComparisonProps) {
  const [expanded, setExpanded] = useState(true);

  const getTipoCambioIcon = (tipo: TipoCambio) => {
    switch (tipo) {
      case 'mejora':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'retroceso':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  const getTipoCambioColor = (tipo: TipoCambio) => {
    switch (tipo) {
      case 'mejora':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'retroceso':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getTipoCambioLabel = (tipo: TipoCambio) => {
    switch (tipo) {
      case 'mejora':
        return 'Mejora';
      case 'retroceso':
        return 'Retroceso';
      default:
        return 'Sin cambio';
    }
  };

  if (!comparacion.sesionAnterior) {
    return (
      <Card className="border-2 border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-800">{comparacion.ejercicioNombre}</h4>
            <p className="text-sm text-slate-500">No hay sesión anterior para comparar</p>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-indigo-200 bg-white shadow-lg">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold text-slate-900">{comparacion.ejercicioNombre}</h4>
              {comparacion.resumen.tieneMejoras && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Mejoras
                </Badge>
              )}
              {comparacion.resumen.tieneRetrocesos && (
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  Retrocesos
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Comparación con sesión anterior
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-8 w-8 p-0"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4">
            {/* Resumen destacado */}
            {(comparacion.resumen.mejorasDestacadas.length > 0 ||
              comparacion.resumen.retrocesosDestacados.length > 0) && (
              <div className="space-y-2">
                {comparacion.resumen.mejorasDestacadas.length > 0 && (
                  <div className="rounded-lg bg-green-50 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Mejoras destacadas</span>
                    </div>
                    <ul className="space-y-1">
                      {comparacion.resumen.mejorasDestacadas.map((mejora, idx) => (
                        <li key={idx} className="text-sm text-green-700">
                          • {mejora}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {comparacion.resumen.retrocesosDestacados.length > 0 && (
                  <div className="rounded-lg bg-red-50 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-semibold text-red-800">Retrocesos destacados</span>
                    </div>
                    <ul className="space-y-1">
                      {comparacion.resumen.retrocesosDestacados.map((retroceso, idx) => (
                        <li key={idx} className="text-sm text-red-700">
                          • {retroceso}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Detalles de comparación */}
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-slate-700">Detalles de comparación</h5>
              <div className="grid gap-2">
                {/* Series */}
                {comparacion.cambios.series && (
                  <div
                    className={`flex items-center justify-between rounded-lg border p-2 ${getTipoCambioColor(
                      comparacion.cambios.series.tipo
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      {getTipoCambioIcon(comparacion.cambios.series.tipo)}
                      <span className="text-sm font-medium">Series</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {comparacion.cambios.series.anterior !== undefined && (
                        <span className="text-sm text-slate-500">
                          {comparacion.cambios.series.anterior} →
                        </span>
                      )}
                      <span className="text-sm font-semibold">{comparacion.cambios.series.actual}</span>
                      <Badge variant="secondary" className="text-xs">
                        {getTipoCambioLabel(comparacion.cambios.series.tipo)}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Repeticiones */}
                {comparacion.cambios.repeticiones && (
                  <div
                    className={`flex items-center justify-between rounded-lg border p-2 ${getTipoCambioColor(
                      comparacion.cambios.repeticiones.tipo
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      {getTipoCambioIcon(comparacion.cambios.repeticiones.tipo)}
                      <span className="text-sm font-medium">Repeticiones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {comparacion.cambios.repeticiones.anterior && (
                        <span className="text-sm text-slate-500">
                          {comparacion.cambios.repeticiones.anterior} →
                        </span>
                      )}
                      <span className="text-sm font-semibold">
                        {comparacion.cambios.repeticiones.actual || 'N/A'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Peso */}
                {comparacion.cambios.peso && (
                  <div
                    className={`flex items-center justify-between rounded-lg border p-2 ${getTipoCambioColor(
                      comparacion.cambios.peso.tipo
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      {getTipoCambioIcon(comparacion.cambios.peso.tipo)}
                      <span className="text-sm font-medium">Peso</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {comparacion.cambios.peso.anterior !== undefined && (
                        <span className="text-sm text-slate-500">
                          {comparacion.cambios.peso.anterior}kg →
                        </span>
                      )}
                      <span className="text-sm font-semibold">
                        {comparacion.cambios.peso.actual !== undefined
                          ? `${comparacion.cambios.peso.actual}kg`
                          : 'N/A'}
                      </span>
                      {comparacion.cambios.peso.cambioPorcentual !== undefined && (
                        <span
                          className={`text-xs font-semibold ${
                            comparacion.cambios.peso.cambioPorcentual > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {comparacion.cambios.peso.cambioPorcentual > 0 ? '+' : ''}
                          {comparacion.cambios.peso.cambioPorcentual.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tempo */}
                {comparacion.cambios.tempo && (
                  <div
                    className={`flex items-center justify-between rounded-lg border p-2 ${getTipoCambioColor(
                      comparacion.cambios.tempo.tipo
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      {getTipoCambioIcon(comparacion.cambios.tempo.tipo)}
                      <span className="text-sm font-medium">Tempo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {comparacion.cambios.tempo.anterior && (
                        <span className="text-sm text-slate-500">
                          {comparacion.cambios.tempo.anterior} →
                        </span>
                      )}
                      <span className="text-sm font-semibold">
                        {comparacion.cambios.tempo.actual || 'N/A'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Descanso */}
                {comparacion.cambios.descanso && (
                  <div
                    className={`flex items-center justify-between rounded-lg border p-2 ${getTipoCambioColor(
                      comparacion.cambios.descanso.tipo
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      {getTipoCambioIcon(comparacion.cambios.descanso.tipo)}
                      <span className="text-sm font-medium">Descanso</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {comparacion.cambios.descanso.anterior !== undefined && (
                        <span className="text-sm text-slate-500">
                          {comparacion.cambios.descanso.anterior}s →
                        </span>
                      )}
                      <span className="text-sm font-semibold">
                        {comparacion.cambios.descanso.actual !== undefined
                          ? `${comparacion.cambios.descanso.actual}s`
                          : 'N/A'}
                      </span>
                      {comparacion.cambios.descanso.cambioPorcentual !== undefined && (
                        <span
                          className={`text-xs font-semibold ${
                            comparacion.cambios.descanso.cambioPorcentual < 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {comparacion.cambios.descanso.cambioPorcentual > 0 ? '+' : ''}
                          {comparacion.cambios.descanso.cambioPorcentual.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Material alternativo */}
                {comparacion.cambios.materialAlternativo && (
                  <div
                    className={`flex items-center justify-between rounded-lg border p-2 ${getTipoCambioColor(
                      comparacion.cambios.materialAlternativo.tipo
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      {getTipoCambioIcon(comparacion.cambios.materialAlternativo.tipo)}
                      <span className="text-sm font-medium">Material alternativo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {comparacion.cambios.materialAlternativo.anterior && (
                        <span className="text-sm text-slate-500">
                          {comparacion.cambios.materialAlternativo.anterior} →
                        </span>
                      )}
                      <span className="text-sm font-semibold">
                        {comparacion.cambios.materialAlternativo.actual || 'N/A'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

