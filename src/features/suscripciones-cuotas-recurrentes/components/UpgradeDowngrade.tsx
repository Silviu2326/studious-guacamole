import React, { useState, useMemo } from 'react';
import { 
  Suscripcion, 
  PlanSuscripcion, 
  ComparacionPlanes, 
  CalculoProrrateo,
  ImpactoMRR,
  CambioPlanRequest 
} from '../types';
import { Card, Button, Modal, Select, Badge } from '../../../components/componentsreutilizables';
import { cambiarPlanSuscripcion } from '../api/suscripciones';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Info, 
  CheckCircle, 
  XCircle,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';

interface UpgradeDowngradeProps {
  suscripcion: Suscripcion;
  onSuccess?: () => void;
}

// Planes disponibles para gimnasios
const PLANES_GIMNASIO: PlanSuscripcion[] = [
  {
    id: 'basico',
    nombre: 'Membresía Básica',
    tipo: 'basico',
    nivel: 1,
    precio: 35,
    precioMensual: 35,
    frecuenciaPago: 'mensual',
    beneficios: [
      'Acceso a sala de pesas',
      'Acceso a zona cardio',
      'Horario estándar',
    ],
    descripcion: 'Acceso a instalaciones básicas del gimnasio',
    activo: true,
    permiteFreeze: true,
    permiteMultisesion: false,
  },
  {
    id: 'premium',
    nombre: 'Membresía Premium',
    tipo: 'premium',
    nivel: 2,
    precio: 55,
    precioMensual: 55,
    frecuenciaPago: 'mensual',
    beneficios: [
      'Acceso a sala de pesas',
      'Acceso a zona cardio',
      'Acceso a piscina y sauna',
      'Clases grupales ilimitadas',
      'Horario extendido',
    ],
    descripcion: 'Acceso completo con clases grupales incluidas',
    activo: true,
    permiteFreeze: true,
    permiteMultisesion: true,
    serviciosAcceso: ['Sala de pesas', 'Cardio', 'Piscina', 'Sauna', 'Clases grupales'],
  },
  {
    id: 'vip',
    nombre: 'Membresía VIP',
    tipo: 'vip',
    nivel: 3,
    precio: 95,
    precioMensual: 95,
    frecuenciaPago: 'mensual',
    beneficios: [
      'Acceso a todas las instalaciones',
      'Clases premium ilimitadas',
      'Servicio de toalla',
      'Lockers VIP',
      'Acceso a spa',
      'Acceso 24/7',
      'Invitados incluidos',
    ],
    descripcion: 'Acceso exclusivo con beneficios premium',
    activo: true,
    permiteFreeze: true,
    permiteMultisesion: true,
    serviciosAcceso: ['Todas las instalaciones', 'Servicio de toalla', 'Lockers VIP', 'Spa'],
  },
];

// Función para calcular precio mensualizado según frecuencia
const calcularPrecioMensual = (precio: number, frecuencia: string): number => {
  switch (frecuencia) {
    case 'mensual':
      return precio;
    case 'trimestral':
      return precio / 3;
    case 'semestral':
      return precio / 6;
    case 'anual':
      return precio / 12;
    default:
      return precio;
  }
};

// Función para calcular prorrateo
const calcularProrrateo = (
  suscripcion: Suscripcion,
  nuevoPlan: PlanSuscripcion,
  fechaCambio: string,
  aplicarInmediatamente: boolean
): CalculoProrrateo => {
  const hoy = new Date();
  const fechaCambioDate = aplicarInmediatamente ? hoy : new Date(fechaCambio);
  const fechaInicioPeriodo = new Date(suscripcion.fechaInicio);
  const fechaFinPeriodo = new Date(suscripcion.fechaVencimiento);
  
  // Calcular días del período actual
  const diasTotales = Math.ceil(
    (fechaFinPeriodo.getTime() - fechaInicioPeriodo.getTime()) / (1000 * 60 * 60 * 24)
  );
  const diasUsados = Math.ceil(
    (fechaCambioDate.getTime() - fechaInicioPeriodo.getTime()) / (1000 * 60 * 60 * 24)
  );
  const diasRestantes = diasTotales - diasUsados;
  
  // Precios mensualizados
  const precioMensualActual = calcularPrecioMensual(
    suscripcion.precio,
    suscripcion.frecuenciaPago
  );
  const precioMensualNuevo = calcularPrecioMensual(
    nuevoPlan.precio,
    nuevoPlan.frecuenciaPago
  );
  
  // Calcular prorrateo
  const precioPeriodoActual = (precioMensualActual * diasTotales) / 30;
  const precioPeriodoNuevo = (precioMensualNuevo * diasTotales) / 30;
  const creditoPeriodoActual = (precioMensualActual * diasRestantes) / 30;
  const cargoPeriodoNuevo = (precioMensualNuevo * diasRestantes) / 30;
  const diferenciaProrrateada = cargoPeriodoNuevo - creditoPeriodoActual;
  
  return {
    fechaCambio: fechaCambioDate.toISOString().split('T')[0],
    fechaInicioPeriodo: fechaInicioPeriodo.toISOString().split('T')[0],
    fechaFinPeriodo: fechaFinPeriodo.toISOString().split('T')[0],
    diasUsados,
    diasRestantes,
    diasTotales,
    precioPeriodoActual,
    precioPeriodoNuevo,
    creditoPeriodoActual,
    cargoPeriodoNuevo,
    diferenciaProrrateada,
    aplicarInmediatamente,
  };
};

// Función para calcular impacto en MRR
const calcularImpactoMRR = (
  suscripcion: Suscripcion,
  nuevoPlan: PlanSuscripcion
): ImpactoMRR => {
  const mrrActual = calcularPrecioMensual(
    suscripcion.precio,
    suscripcion.frecuenciaPago
  );
  const mrrNuevo = calcularPrecioMensual(
    nuevoPlan.precio,
    nuevoPlan.frecuenciaPago
  );
  const diferenciaMRR = mrrNuevo - mrrActual;
  const porcentajeCambio = mrrActual > 0 ? (diferenciaMRR / mrrActual) * 100 : 0;
  const impactoAnual = diferenciaMRR * 12;
  
  return {
    mrrActual,
    mrrNuevo,
    diferenciaMRR,
    porcentajeCambio,
    impactoAnual,
  };
};

// Función para comparar planes
const compararPlanes = (
  planActual: PlanSuscripcion,
  planDestino: PlanSuscripcion
): ComparacionPlanes => {
  const diferenciaPrecio = planDestino.precio - planActual.precio;
  const diferenciaPrecioMensual = 
    (planDestino.precioMensual || planDestino.precio) - 
    (planActual.precioMensual || planActual.precio);
  
  const esUpgrade = planDestino.nivel > planActual.nivel;
  const esDowngrade = planDestino.nivel < planActual.nivel;
  
  // Comparar beneficios
  const beneficiosGanados = planDestino.beneficios.filter(
    b => !planActual.beneficios.includes(b)
  );
  const beneficiosPerdidos = planActual.beneficios.filter(
    b => !planDestino.beneficios.includes(b)
  );
  const beneficiosMantenidos = planActual.beneficios.filter(
    b => planDestino.beneficios.includes(b)
  );
  
  return {
    planOrigen: planActual,
    planDestino,
    diferenciaPrecio,
    diferenciaPrecioMensual,
    esUpgrade,
    esDowngrade,
    beneficiosGanados,
    beneficiosPerdidos,
    beneficiosMantenidos,
  };
};

export const UpgradeDowngrade: React.FC<UpgradeDowngradeProps> = ({
  suscripcion,
  onSuccess,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoCambio, setTipoCambio] = useState<'upgrade' | 'downgrade'>('upgrade');
  const [nuevoPlanId, setNuevoPlanId] = useState<string>('');
  const [aplicarInmediatamente, setAplicarInmediatamente] = useState<boolean>(true);
  const [fechaCambio, setFechaCambio] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);

  // Determinar plan actual basado en la suscripción
  const planActual = useMemo(() => {
    const nivel = suscripcion.nivelPlan || 'basico';
    return PLANES_GIMNASIO.find(p => p.tipo === nivel) || PLANES_GIMNASIO[0];
  }, [suscripcion]);

  // Filtrar planes disponibles según tipo de cambio
  const planesDisponibles = useMemo(() => {
    return PLANES_GIMNASIO.filter(p => {
      if (p.id === planActual.id) return false;
      if (tipoCambio === 'upgrade') {
        return p.nivel > planActual.nivel;
      } else {
        return p.nivel < planActual.nivel;
      }
    });
  }, [tipoCambio, planActual]);

  const nuevoPlan = planesDisponibles.find(p => p.id === nuevoPlanId);

  // Calcular comparación
  const comparacion = useMemo(() => {
    if (!nuevoPlan) return null;
    return compararPlanes(planActual, nuevoPlan);
  }, [planActual, nuevoPlan]);

  // Calcular prorrateo
  const prorrateo = useMemo(() => {
    if (!nuevoPlan) return null;
    return calcularProrrateo(suscripcion, nuevoPlan, fechaCambio, aplicarInmediatamente);
  }, [suscripcion, nuevoPlan, fechaCambio, aplicarInmediatamente]);

  // Calcular impacto MRR
  const impactoMRR = useMemo(() => {
    if (!nuevoPlan) return null;
    return calcularImpactoMRR(suscripcion, nuevoPlan);
  }, [suscripcion, nuevoPlan]);

  const handleCambioPlan = async () => {
    if (!nuevoPlan) return;

    setLoading(true);
    try {
      const request: CambioPlanRequest = {
        suscripcionId: suscripcion.id,
        nuevoPlanId: nuevoPlan.id,
        aplicarInmediatamente,
        fechaCambio: aplicarInmediatamente ? undefined : fechaCambio,
      };

      await cambiarPlanSuscripcion(request);
      
      setModalOpen(false);
      setNuevoPlanId('');
      onSuccess?.();
    } catch (error) {
      console.error('Error cambiando plan:', error);
      alert('Error al cambiar el plan. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cambio de Plan
            </h3>
            <p className="text-base text-gray-600">
              Plan actual: <span className="font-semibold">{planActual.nombre}</span> ({planActual.precio} €/mes)
            </p>
            {suscripcion.nivelPlan && (
              <p className="text-sm text-gray-500 mt-1">
                Nivel: {suscripcion.nivelPlan.charAt(0).toUpperCase() + suscripcion.nivelPlan.slice(1)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {planesDisponibles.some(p => p.nivel > planActual.nivel) && (
            <Button
              variant="primary"
              onClick={() => {
                setTipoCambio('upgrade');
                setModalOpen(true);
              }}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
            )}
            {planesDisponibles.some(p => p.nivel < planActual.nivel) && (
            <Button
              variant="secondary"
              onClick={() => {
                setTipoCambio('downgrade');
                setModalOpen(true);
              }}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Downgrade
            </Button>
            )}
          </div>
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          if (!loading) {
            setModalOpen(false);
            setNuevoPlanId('');
          }
        }}
        title={tipoCambio === 'upgrade' ? 'Upgrade de Plan' : 'Downgrade de Plan'}
        size="xl"
      >
        <div className="space-y-6">
          {/* Plan actual */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Plan Actual</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {planActual.nombre}
                </p>
                <p className="text-sm text-gray-600">
                  {planActual.precio} €/mes
                </p>
              </div>
              <Badge color="info">Actual</Badge>
            </div>
          </div>

          {/* Selección de nuevo plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Nuevo Plan
            </label>
          <Select
              value={nuevoPlanId}
              onChange={(e) => setNuevoPlanId(e.target.value)}
              options={planesDisponibles.map(plan => ({
                value: plan.id,
                label: `${plan.nombre} - ${plan.precio} €/mes`,
              }))}
          />
          </div>

          {/* Comparación detallada */}
          {comparacion && nuevoPlan && (
            <>
              {/* Resumen del cambio */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-3">
                      Resumen del Cambio
                    </p>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex items-center justify-between">
                        <span>Nuevo plan:</span>
                        <span className="font-semibold">{nuevoPlan.nombre}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Diferencia de precio:</span>
                        <span className={`font-semibold ${
                          comparacion.diferenciaPrecioMensual > 0 
                            ? 'text-red-600' 
                            : comparacion.diferenciaPrecioMensual < 0 
                            ? 'text-green-600' 
                            : 'text-gray-600'
                        }`}>
                          {comparacion.diferenciaPrecioMensual > 0 ? '+' : ''}
                          {comparacion.diferenciaPrecioMensual.toFixed(2)} €/mes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparación visual */}
              <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {planActual.precio} €
                  </div>
                  <div className="text-xs text-gray-600">mensual</div>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    comparacion.esUpgrade ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {nuevoPlan.precio} €
                  </div>
                  <div className="text-xs text-gray-600">mensual</div>
                </div>
                {comparacion.esUpgrade && (
                  <Badge color="success" className="ml-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Upgrade
                  </Badge>
                )}
                {comparacion.esDowngrade && (
                  <Badge color="warning" className="ml-2">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    Downgrade
                  </Badge>
                )}
              </div>

              {/* Beneficios */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comparacion.beneficiosGanados.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-semibold text-green-900">
                        Beneficios Nuevos
                      </p>
                    </div>
                    <ul className="space-y-1 text-xs text-green-800">
                      {comparacion.beneficiosGanados.map((b, i) => (
                        <li key={i}>• {b}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {comparacion.beneficiosMantenidos.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-semibold text-blue-900">
                        Beneficios Mantenidos
                      </p>
                    </div>
                    <ul className="space-y-1 text-xs text-blue-800">
                      {comparacion.beneficiosMantenidos.slice(0, 3).map((b, i) => (
                        <li key={i}>• {b}</li>
                      ))}
                      {comparacion.beneficiosMantenidos.length > 3 && (
                        <li className="text-blue-600">
                          +{comparacion.beneficiosMantenidos.length - 3} más
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                {comparacion.beneficiosPerdidos.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm font-semibold text-red-900">
                        Beneficios Perdidos
                      </p>
                    </div>
                    <ul className="space-y-1 text-xs text-red-800">
                      {comparacion.beneficiosPerdidos.map((b, i) => (
                        <li key={i}>• {b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Prorrateo */}
              {prorrateo && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <p className="text-sm font-semibold text-amber-900">
                      Cálculo de Prorrateo
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-amber-800">
                    <div className="flex items-center justify-between">
                      <span>Días usados del período actual:</span>
                      <span className="font-semibold">{prorrateo.diasUsados} días</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Días restantes del período:</span>
                      <span className="font-semibold">{prorrateo.diasRestantes} días</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                      <span>Crédito por período actual:</span>
                      <span className="font-semibold text-green-600">
                        -{prorrateo.creditoPeriodoActual.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cargo por nuevo plan:</span>
                      <span className="font-semibold text-red-600">
                        +{prorrateo.cargoPeriodoNuevo.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-amber-300">
                      <span className="font-semibold">Diferencia a cobrar:</span>
                      <span className={`text-lg font-bold ${
                        prorrateo.diferenciaProrrateada > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {prorrateo.diferenciaProrrateada > 0 ? '+' : ''}
                        {prorrateo.diferenciaProrrateada.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Impacto MRR */}
              {impactoMRR && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <p className="text-sm font-semibold text-purple-900">
                      Impacto en MRR (Monthly Recurring Revenue)
              </p>
            </div>
                  <div className="space-y-2 text-sm text-purple-800">
                    <div className="flex items-center justify-between">
                      <span>MRR actual:</span>
                      <span className="font-semibold">{impactoMRR.mrrActual.toFixed(2)} €</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>MRR nuevo:</span>
                      <span className="font-semibold">{impactoMRR.mrrNuevo.toFixed(2)} €</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Diferencia MRR:</span>
                      <span className={`font-semibold ${
                        impactoMRR.diferenciaMRR > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {impactoMRR.diferenciaMRR > 0 ? '+' : ''}
                        {impactoMRR.diferenciaMRR.toFixed(2)} €/mes
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Porcentaje de cambio:</span>
                      <span className={`font-semibold ${
                        impactoMRR.porcentajeCambio > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {impactoMRR.porcentajeCambio > 0 ? '+' : ''}
                        {impactoMRR.porcentajeCambio.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-purple-200">
                      <span className="font-semibold">Impacto anual proyectado:</span>
                      <span className={`text-lg font-bold ${
                        impactoMRR.impactoAnual > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {impactoMRR.impactoAnual > 0 ? '+' : ''}
                        {impactoMRR.impactoAnual.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Opciones de aplicación */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    id="aplicarInmediato"
                    checked={aplicarInmediatamente}
                    onChange={() => setAplicarInmediatamente(true)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="aplicarInmediato" className="flex-1 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">
                      Aplicar inmediatamente
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      El cambio se aplica ahora. Se calculará el prorrateo y se ajustará la próxima cuota.
                    </p>
                  </label>
                </div>
                
                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    id="aplicarProximaRenovacion"
                    checked={!aplicarInmediatamente}
                    onChange={() => setAplicarInmediatamente(false)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="aplicarProximaRenovacion" className="flex-1 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">
                      Aplicar en la próxima renovación
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      El cambio se aplicará cuando se renueve la suscripción.
                    </p>
                  </label>
                </div>
              </div>

              {!aplicarInmediatamente && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de cambio
                  </label>
                  <input
                    type="date"
                    value={fechaCambio}
                    onChange={(e) => setFechaCambio(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </>
          )}
          
          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                setNuevoPlanId('');
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCambioPlan}
              disabled={!nuevoPlanId || loading}
            >
              {loading ? 'Procesando...' : 'Confirmar Cambio'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
