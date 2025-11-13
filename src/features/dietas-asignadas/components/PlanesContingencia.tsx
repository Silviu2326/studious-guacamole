import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import {
  AlertTriangle,
  Plane,
  Users,
  Heart,
  Clock,
  CheckCircle2,
  X,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  ChevronRight,
  RefreshCw,
  Info,
} from 'lucide-react';
import type {
  CondicionExterna,
  PlanContingencia,
  TipoCondicionExterna,
} from '../types';
import {
  detectarCondicionesExternas,
  getPlanesContingenciaPorDieta,
  generarPlanContingencia,
  aplicarPlanContingencia,
  confirmarCondicionExterna,
} from '../api/planesContingencia';

interface PlanesContingenciaProps {
  dietaId: string;
  clienteId: string;
  onPlanAplicado?: (plan: PlanContingencia) => void;
}

const iconosCondiciones: Record<TipoCondicionExterna, React.ReactNode> = {
  viaje: <Plane className="w-5 h-5" />,
  'evento-social': <Users className="w-5 h-5" />,
  lesion: <Heart className="w-5 h-5" />,
  enfermedad: <AlertTriangle className="w-5 h-5" />,
  'cambio-horario': <Clock className="w-5 h-5" />,
  'restriccion-temporal': <X className="w-5 h-5" />,
  otro: <Info className="w-5 h-5" />,
};

const coloresCondiciones: Record<TipoCondicionExterna, string> = {
  viaje: 'bg-blue-100 text-blue-700 border-blue-300',
  'evento-social': 'bg-purple-100 text-purple-700 border-purple-300',
  lesion: 'bg-red-100 text-red-700 border-red-300',
  enfermedad: 'bg-orange-100 text-orange-700 border-orange-300',
  'cambio-horario': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'restriccion-temporal': 'bg-gray-100 text-gray-700 border-gray-300',
  otro: 'bg-gray-100 text-gray-700 border-gray-300',
};

export const PlanesContingencia: React.FC<PlanesContingenciaProps> = ({
  dietaId,
  clienteId,
  onPlanAplicado,
}) => {
  const [condiciones, setCondiciones] = useState<CondicionExterna[]>([]);
  const [planes, setPlanes] = useState<PlanContingencia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [detectando, setDetectando] = useState(false);
  const [mostrarDetallePlan, setMostrarDetallePlan] = useState<PlanContingencia | null>(null);
  const [mostrarConfirmarCondicion, setMostrarConfirmarCondicion] = useState<CondicionExterna | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [dietaId, clienteId]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [condicionesData, planesData] = await Promise.all([
        detectarCondicionesExternas(dietaId, clienteId),
        getPlanesContingenciaPorDieta(dietaId),
      ]);
      setCondiciones(condicionesData);
      setPlanes(planesData);
    } catch (error) {
      console.error('Error cargando condiciones y planes:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleDetectarCondiciones = async () => {
    setDetectando(true);
    try {
      const nuevasCondiciones = await detectarCondicionesExternas(dietaId, clienteId);
      setCondiciones(nuevasCondiciones);
      
      // Generar planes para condiciones nuevas sin plan
      for (const condicion of nuevasCondiciones) {
        const tienePlan = planes.some(p => p.condicionId === condicion.id);
        if (!tienePlan && !condicion.confirmado) {
          try {
            const nuevoPlan = await generarPlanContingencia(
              condicion.id,
              dietaId,
              clienteId
            );
            setPlanes(prev => [...prev, nuevoPlan]);
          } catch (error) {
            console.error('Error generando plan para condición:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error detectando condiciones:', error);
    } finally {
      setDetectando(false);
    }
  };

  const handleAplicarPlan = async (planId: string) => {
    try {
      const planAplicado = await aplicarPlanContingencia(planId);
      setPlanes(prev =>
        prev.map(p => (p.id === planId ? planAplicado : p))
      );
      onPlanAplicado?.(planAplicado);
      setMostrarDetallePlan(null);
    } catch (error) {
      console.error('Error aplicando plan:', error);
    }
  };

  const handleConfirmarCondicion = async (condicionId: string) => {
    try {
      const condicionConfirmada = await confirmarCondicionExterna(condicionId);
      setCondiciones(prev =>
        prev.map(c => (c.id === condicionId ? condicionConfirmada : c))
      );
      
      // Generar plan si no existe
      const tienePlan = planes.some(p => p.condicionId === condicionId);
      if (!tienePlan) {
        const nuevoPlan = await generarPlanContingencia(
          condicionId,
          dietaId,
          clienteId
        );
        setPlanes(prev => [...prev, nuevoPlan]);
      }
      
      setMostrarConfirmarCondicion(null);
    } catch (error) {
      console.error('Error confirmando condición:', error);
    }
  };

  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: fechaObj.getFullYear(),
    });
  };

  const formatearRangoFechas = (inicio: string, fin?: string) => {
    if (fin) {
      return `${formatearFecha(inicio)} - ${formatearFecha(fin)}`;
    }
    return formatearFecha(inicio);
  };

  const condicionesSinConfirmar = condiciones.filter(c => !c.confirmado);
  const planesNoAplicados = planes.filter(p => !p.aplicado);

  if (cargando) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando planes de contingencia...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Planes de Contingencia</h2>
          <p className="text-sm text-gray-600">
            Adapta el plan sin empezar de cero cuando detectamos condiciones externas
          </p>
        </div>
        <Button
          onClick={handleDetectarCondiciones}
          disabled={detectando}
          leftIcon={detectando ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
        >
          {detectando ? 'Detectando...' : 'Detectar Condiciones'}
        </Button>
      </div>

      {/* Condiciones detectadas sin confirmar */}
      {condicionesSinConfirmar.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Condiciones Detectadas
          </h3>
          <div className="space-y-3">
            {condicionesSinConfirmar.map(condicion => (
              <Card
                key={condicion.id}
                className="border-2 border-yellow-300 bg-yellow-50/30"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${coloresCondiciones[condicion.tipo]}`}>
                        {iconosCondiciones[condicion.tipo]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{condicion.titulo}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatearRangoFechas(condicion.fechaInicio, condicion.fechaFin)}
                          </span>
                          {condicion.detalles?.destino && (
                            <>
                              <MapPin className="w-4 h-4 ml-2" />
                              <span>{condicion.detalles.destino}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={
                        condicion.severidad === 'alta'
                          ? 'bg-red-100 text-red-700'
                          : condicion.severidad === 'media'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {condicion.severidad}
                    </Badge>
                  </div>

                  {condicion.descripcion && (
                    <p className="text-sm text-gray-600 mb-3">{condicion.descripcion}</p>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleConfirmarCondicion(condicion.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Confirmar y Generar Plan
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setMostrarConfirmarCondicion(condicion)}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Planes de contingencia sugeridos */}
      {planesNoAplicados.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Planes Sugeridos
          </h3>
          <div className="space-y-4">
            {planesNoAplicados
              .sort((a, b) => b.relevancia - a.relevancia)
              .map(plan => {
                const condicion = condiciones.find(c => c.id === plan.condicionId);
                return (
                  <Card
                    key={plan.id}
                    className={`border-2 ${
                      plan.prioridad === 'alta'
                        ? 'border-red-300 bg-red-50/30'
                        : plan.prioridad === 'media'
                        ? 'border-yellow-300 bg-yellow-50/30'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {condicion && (
                              <div className={`p-1.5 rounded ${coloresCondiciones[condicion.tipo]}`}>
                                {iconosCondiciones[condicion.tipo]}
                              </div>
                            )}
                            <h4 className="font-semibold text-gray-900">{plan.nombre}</h4>
                            <Badge className="bg-blue-100 text-blue-700">
                              {plan.relevancia}% relevante
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{plan.descripcion}</p>
                          {condicion && (
                            <div className="text-xs text-gray-500">
                              Para: {condicion.titulo} ({formatearRangoFechas(condicion.fechaInicio, condicion.fechaFin)})
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ajustes de macros */}
                      {plan.ajustes.macros && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs font-semibold text-gray-700 mb-2">
                            Ajustes de Macros:
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-sm">
                            {plan.ajustes.macros.calorias !== undefined && (
                              <div className="flex items-center gap-1">
                                {plan.ajustes.macros.calorias > 0 ? (
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                                <span className="text-gray-700">
                                  Calorías: {plan.ajustes.macros.calorias > 0 ? '+' : ''}
                                  {plan.ajustes.macros.calorias} kcal
                                </span>
                              </div>
                            )}
                            {plan.ajustes.macros.proteinas !== undefined && (
                              <div className="flex items-center gap-1">
                                {plan.ajustes.macros.proteinas > 0 ? (
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                                <span className="text-gray-700">
                                  Proteínas: {plan.ajustes.macros.proteinas > 0 ? '+' : ''}
                                  {plan.ajustes.macros.proteinas}g
                                </span>
                              </div>
                            )}
                            {plan.ajustes.macros.carbohidratos !== undefined && (
                              <div className="flex items-center gap-1">
                                {plan.ajustes.macros.carbohidratos > 0 ? (
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                                <span className="text-gray-700">
                                  Carbohidratos: {plan.ajustes.macros.carbohidratos > 0 ? '+' : ''}
                                  {plan.ajustes.macros.carbohidratos}g
                                </span>
                              </div>
                            )}
                            {plan.ajustes.macros.grasas !== undefined && (
                              <div className="flex items-center gap-1">
                                {plan.ajustes.macros.grasas > 0 ? (
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                                <span className="text-gray-700">
                                  Grasas: {plan.ajustes.macros.grasas > 0 ? '+' : ''}
                                  {plan.ajustes.macros.grasas}g
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Recomendaciones */}
                      {plan.ajustes.recomendaciones && plan.ajustes.recomendaciones.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs font-semibold text-gray-700 mb-2">
                            Recomendaciones:
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {plan.ajustes.recomendaciones.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Razones */}
                      {plan.razones && plan.razones.length > 0 && (
                        <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                          <strong>Por qué se sugiere:</strong>{' '}
                          {plan.razones.join(' • ')}
                        </div>
                      )}

                      {/* Días afectados */}
                      {plan.diasAfectados && plan.diasAfectados.length > 0 && (
                        <div className="mb-3 text-xs text-gray-600">
                          <strong>Días afectados:</strong>{' '}
                          {plan.diasAfectados.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                        </div>
                      )}

                      {/* Acciones */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        <Button
                          size="sm"
                          onClick={() => handleAplicarPlan(plan.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Aplicar Plan
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setMostrarDetallePlan(plan)}
                        >
                          Ver Detalles Completos
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* Sin condiciones ni planes */}
      {condicionesSinConfirmar.length === 0 && planesNoAplicados.length === 0 && (
        <Card className="p-8 text-center">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            No se han detectado condiciones externas que requieran ajustes
          </p>
          <p className="text-sm text-gray-500">
            Haz clic en "Detectar Condiciones" para buscar viajes, eventos o cambios que puedan afectar el plan
          </p>
        </Card>
      )}

      {/* Modal de detalle del plan */}
      {mostrarDetallePlan && (
        <Modal
          isOpen={!!mostrarDetallePlan}
          onClose={() => setMostrarDetallePlan(null)}
          title={mostrarDetallePlan.nombre}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
              <p className="text-sm text-gray-600">{mostrarDetallePlan.descripcion}</p>
            </div>

            {mostrarDetallePlan.ajustes.macros && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Ajustes de Macros</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(mostrarDetallePlan.ajustes.macros).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1 capitalize">{key}</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {value && value > 0 ? '+' : ''}
                        {value}
                        {key === 'calorias' ? ' kcal' : 'g'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mostrarDetallePlan.ajustes.recomendaciones && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recomendaciones</h4>
                <ul className="space-y-2">
                  {mostrarDetallePlan.ajustes.recomendaciones.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2 pt-4 border-t">
              <Button onClick={() => handleAplicarPlan(mostrarDetallePlan.id)}>
                Aplicar Plan
              </Button>
              <Button variant="ghost" onClick={() => setMostrarDetallePlan(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

