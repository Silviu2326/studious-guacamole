import React, { useMemo } from 'react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { Activity, Flame, TrendingUp, Clock, AlertCircle, Plus } from 'lucide-react';
import { ActividadEjercicio, TipoComida } from '../types';

interface ImpactoEjercicioProps {
  actividades: ActividadEjercicio[];
  dia?: string;
  onAjustarIngesta?: (actividadId: string, ajuste: { calorias: number; proteinas?: number; carbohidratos?: number; tipoComida?: TipoComida }) => void;
  className?: string;
}

export const ImpactoEjercicio: React.FC<ImpactoEjercicioProps> = ({
  actividades,
  dia,
  onAjustarIngesta,
  className = '',
}) => {
  // Filtrar actividades por día si se especifica
  const actividadesFiltradas = useMemo(() => {
    if (!dia) return actividades;
    return actividades.filter((act) => act.dia === dia);
  }, [actividades, dia]);

  // Calcular totales
  const totales = useMemo(() => {
    return actividadesFiltradas.reduce(
      (acc, act) => ({
        caloriasTotales: acc.caloriasTotales + act.caloriasTotales,
        caloriasPorHora: acc.caloriasPorHora + act.caloriasPorHora,
        duracionTotal: acc.duracionTotal + act.duracion,
      }),
      { caloriasTotales: 0, caloriasPorHora: 0, duracionTotal: 0 }
    );
  }, [actividadesFiltradas]);

  // Calcular promedio de calorías por hora
  const promedioCaloriasPorHora = useMemo(() => {
    if (actividadesFiltradas.length === 0) return 0;
    return Math.round(totales.caloriasPorHora / actividadesFiltradas.length);
  }, [actividadesFiltradas, totales]);

  if (actividadesFiltradas.length === 0) {
    return null;
  }

  const getIntensidadColor = (intensidad: ActividadEjercicio['intensidad']) => {
    switch (intensidad) {
      case 'baja':
        return 'bg-green-100 text-green-700';
      case 'moderada':
        return 'bg-yellow-100 text-yellow-700';
      case 'alta':
        return 'bg-orange-100 text-orange-700';
      case 'muy-alta':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTipoIcon = (tipo: ActividadEjercicio['tipo']) => {
    switch (tipo) {
      case 'cardio':
        return <Activity className="w-4 h-4 text-red-500" />;
      case 'fuerza':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Resumen de impacto */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 border-l-4 border-l-orange-500">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-semibold text-orange-900">
              Impacto de Ejercicio Adicional
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-orange-600 mb-1">Calorías Totales</div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-lg font-bold text-orange-900">
                  {totales.caloriasTotales}
                </span>
                <span className="text-xs text-orange-600">kcal</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-orange-600 mb-1">Promedio / Hora</div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-lg font-bold text-orange-900">
                  {promedioCaloriasPorHora}
                </span>
                <span className="text-xs text-orange-600">kcal/h</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-orange-600 mb-1">Duración Total</div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-lg font-bold text-orange-900">
                  {totales.duracionTotal}
                </span>
                <span className="text-xs text-orange-600">min</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de actividades */}
      <div className="space-y-2">
        {actividadesFiltradas.map((actividad) => (
          <Card
            key={actividad.id}
            className="bg-white border border-gray-200 hover:border-orange-300 transition-colors"
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTipoIcon(actividad.tipo)}
                    <h4 className="text-sm font-semibold text-gray-900">
                      {actividad.nombre}
                    </h4>
                    <Badge className={getIntensidadColor(actividad.intensidad)}>
                      {actividad.intensidad}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Duración:</span>{' '}
                      {actividad.duracion} min
                    </div>
                    <div>
                      <span className="font-medium">Calorías/hora:</span>{' '}
                      {actividad.caloriasPorHora} kcal/h
                    </div>
                    <div>
                      <span className="font-medium">Total:</span>{' '}
                      <span className="font-semibold text-orange-600">
                        {actividad.caloriasTotales} kcal
                      </span>
                    </div>
                  </div>
                  {actividad.horarioInicio && actividad.horarioFin && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                      <Clock className="w-3 h-3" />
                      <span>
                        {actividad.horarioInicio} - {actividad.horarioFin}
                      </span>
                    </div>
                  )}
                  {actividad.notas && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      {actividad.notas}
                    </p>
                  )}
                </div>
              </div>

              {/* Ajuste recomendado */}
              {actividad.requiereAjusteIngesta && actividad.ajusteRecomendado && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-semibold text-gray-700">
                          Ajuste de Ingesta Recomendado
                        </span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-4 text-xs">
                          <div>
                            <span className="text-gray-600">Calorías adicionales:</span>{' '}
                            <span className="font-semibold text-blue-900">
                              +{actividad.ajusteRecomendado.calorias} kcal
                            </span>
                          </div>
                          {actividad.ajusteRecomendado.proteinas && (
                            <div>
                              <span className="text-gray-600">Proteínas:</span>{' '}
                              <span className="font-semibold text-blue-900">
                                +{actividad.ajusteRecomendado.proteinas}g
                              </span>
                            </div>
                          )}
                          {actividad.ajusteRecomendado.carbohidratos && (
                            <div>
                              <span className="text-gray-600">Carbohidratos:</span>{' '}
                              <span className="font-semibold text-blue-900">
                                +{actividad.ajusteRecomendado.carbohidratos}g
                              </span>
                            </div>
                          )}
                          {actividad.ajusteRecomendado.tipoComidaRecomendada && (
                            <div>
                              <span className="text-gray-600">Recomendado en:</span>{' '}
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                {actividad.ajusteRecomendado.tipoComidaRecomendada}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {onAjustarIngesta && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          onAjustarIngesta(actividad.id, {
                            calorias: actividad.ajusteRecomendado!.calorias,
                            proteinas: actividad.ajusteRecomendado!.proteinas,
                            carbohidratos: actividad.ajusteRecomendado!.carbohidratos,
                            tipoComida: actividad.ajusteRecomendado!.tipoComidaRecomendada,
                          })
                        }
                        className="flex items-center gap-1"
                        leftIcon={<Plus className="w-4 h-4" />}
                      >
                        Aplicar Ajuste
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

