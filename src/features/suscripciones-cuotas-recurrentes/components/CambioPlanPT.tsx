import React, { useState, useMemo } from 'react';
import { Suscripcion, CambioEntrenadorRequest } from '../types';
import { Card, Button, Modal, Select, Badge, Textarea } from '../../../components/componentsreutilizables';
import { cambiarPlanPT, cambiarEntrenadorSuscripcion } from '../api/suscripciones';
import { ArrowRight, TrendingUp, TrendingDown, Info, User, Calendar, Clock } from 'lucide-react';

interface CambioPlanPTProps {
  suscripcion: Suscripcion;
  onSuccess?: () => void;
}

// Mock de entrenadores disponibles (en producción vendría de una API)
const ENTRENADORES_DISPONIBLES = [
  { id: 'trainer1', nombre: 'Carlos Rodríguez', especialidad: 'Hipertrofia', disponible: true },
  { id: 'trainer2', nombre: 'Ana Martínez', especialidad: 'Pérdida de peso', disponible: true },
  { id: 'trainer3', nombre: 'Luis Fernández', especialidad: 'Rehabilitación', disponible: true },
  { id: 'trainer4', nombre: 'María García', especialidad: 'Atletismo', disponible: true },
];

// Mock de sesiones programadas (en producción vendría de la API de calendario)
interface SesionProgramada {
  id: string;
  fecha: string;
  hora: string;
  tipo: string;
  estado: 'programada' | 'confirmada' | 'cancelada';
}

const obtenerSesionesProgramadas = (suscripcionId: string): SesionProgramada[] => {
  // Mock data - en producción esto vendría de la API
  return [
    {
      id: 'ses1',
      fecha: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hora: '10:00',
      tipo: 'Presencial',
      estado: 'programada',
    },
    {
      id: 'ses2',
      fecha: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hora: '18:00',
      tipo: 'Presencial',
      estado: 'confirmada',
    },
    {
      id: 'ses3',
      fecha: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hora: '11:00',
      tipo: 'Online',
      estado: 'programada',
    },
  ];
};

// Planes PT disponibles
const PLANES_PT = [
  {
    id: 'pt-4',
    nombre: 'Paquete Mensual 4 Sesiones',
    sesiones: 4,
    precio: 150,
    descripcion: 'Ideal para mantenimiento',
  },
  {
    id: 'pt-8',
    nombre: 'Paquete Mensual 8 Sesiones',
    sesiones: 8,
    precio: 280,
    descripcion: 'La opción más popular',
  },
  {
    id: 'pt-12',
    nombre: 'Paquete Mensual 12 Sesiones',
    sesiones: 12,
    precio: 480,
    descripcion: 'Máxima intensidad',
  },
];

export const CambioPlanPT: React.FC<CambioPlanPTProps> = ({
  suscripcion,
  onSuccess,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoCambio, setTipoCambio] = useState<'plan' | 'entrenador'>('plan');
  const [nuevoPlanId, setNuevoPlanId] = useState<string>('');
  const [nuevoEntrenadorId, setNuevoEntrenadorId] = useState<string>('');
  const [aplicarInmediatamente, setAplicarInmediatamente] = useState<boolean>(true);
  const [fechaCambio, setFechaCambio] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [mantenerSesionesProgramadas, setMantenerSesionesProgramadas] = useState<boolean>(true);
  const [reasignarSesiones, setReasignarSesiones] = useState<boolean>(false);
  const [motivo, setMotivo] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Obtener sesiones programadas
  const sesionesProgramadas = useMemo(() => {
    return obtenerSesionesProgramadas(suscripcion.id);
  }, [suscripcion.id]);

  const planActual = PLANES_PT.find(p => p.id === suscripcion.planId);
  const nuevoPlan = PLANES_PT.find(p => p.id === nuevoPlanId);

  // Filtrar planes disponibles (excluir el actual)
  const planesDisponibles = PLANES_PT.filter(p => p.id !== suscripcion.planId);

  const esUpgrade = nuevoPlan && planActual 
    ? nuevoPlan.sesiones > planActual.sesiones
    : false;
  const esDowngrade = nuevoPlan && planActual
    ? nuevoPlan.sesiones < planActual.sesiones
    : false;

  const handleCambioPlan = async () => {
    if (tipoCambio === 'plan') {
      if (!nuevoPlanId || !nuevoPlan) return;

      setLoading(true);
      try {
        await cambiarPlanPT({
          suscripcionId: suscripcion.id,
          nuevoPlanId: nuevoPlanId,
          nuevoPrecio: nuevoPlan.precio,
          nuevoSesiones: nuevoPlan.sesiones,
          aplicarInmediatamente,
          motivo: motivo || undefined,
        });
        
        setModalOpen(false);
        setNuevoPlanId('');
        setMotivo('');
        setAplicarInmediatamente(true);
        onSuccess?.();
      } catch (error) {
        console.error('Error cambiando plan:', error);
        alert('Error al cambiar el plan. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    } else {
      // Cambio de entrenador
      if (!nuevoEntrenadorId) return;

      setLoading(true);
      try {
        const nuevoEntrenador = ENTRENADORES_DISPONIBLES.find(e => e.id === nuevoEntrenadorId);
        if (!nuevoEntrenador) return;

        const request: CambioEntrenadorRequest = {
          suscripcionId: suscripcion.id,
          nuevoEntrenadorId: nuevoEntrenador.id,
          nuevoEntrenadorNombre: nuevoEntrenador.nombre,
          fechaCambio: aplicarInmediatamente 
            ? new Date().toISOString().split('T')[0] 
            : fechaCambio,
          mantenerSesionesProgramadas,
          reasignarSesiones,
          motivo: motivo || undefined,
        };

        await cambiarEntrenadorSuscripcion(request);
        
        setModalOpen(false);
        setNuevoEntrenadorId('');
        setMotivo('');
        setMantenerSesionesProgramadas(true);
        setReasignarSesiones(false);
        onSuccess?.();
      } catch (error) {
        console.error('Error cambiando entrenador:', error);
        alert('Error al cambiar el entrenador. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Calcular diferencia de precio y sesiones
  const diferenciaPrecio = nuevoPlan && planActual
    ? nuevoPlan.precio - planActual.precio
    : 0;
  
  const diferenciaSesiones = nuevoPlan && planActual
    ? nuevoPlan.sesiones - planActual.sesiones
    : 0;

  // Calcular sesiones que se transferirán o ajustarán
  const sesionesActualesDisponibles = suscripcion.sesionesDisponibles || 0;
  const sesionesActualesIncluidas = suscripcion.sesionesIncluidas || 0;
  
  // Si es downgrade, las sesiones disponibles se mantienen hasta que se usen
  // Si es upgrade, se añaden las nuevas sesiones
  const nuevasSesionesDisponibles = aplicarInmediatamente
    ? esUpgrade
      ? sesionesActualesDisponibles + diferenciaSesiones
      : Math.min(sesionesActualesDisponibles, nuevoPlan?.sesiones || 0)
    : sesionesActualesDisponibles;

  return (
    <>
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cambio de Plan / Entrenador
            </h3>
            <p className="text-base text-gray-600 mb-3">
              Plan actual: <span className="font-semibold">{suscripcion.planNombre}</span>
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                {planActual?.sesiones || 0} sesiones/mes
              </span>
              <span>•</span>
              <span>
                {planActual?.precio || 0} €/mes
              </span>
              <span>•</span>
              <span>
                {sesionesActualesDisponibles} sesiones disponibles
              </span>
              {suscripcion.entrenadorId && (
                <>
                  <span>•</span>
                  <span>
                    Entrenador: {ENTRENADORES_DISPONIBLES.find(e => e.id === suscripcion.entrenadorId)?.nombre || 'N/A'}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setTipoCambio('plan');
                setModalOpen(true);
              }}
            >
              Cambiar Plan
            </Button>
            {suscripcion.entrenadorId && (
              <Button
                variant="secondary"
                onClick={() => {
                  setTipoCambio('entrenador');
                  setModalOpen(true);
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Cambiar PT
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
            setNuevoEntrenadorId('');
            setMotivo('');
          }
        }}
        title={tipoCambio === 'plan' ? 'Cambiar Plan del Cliente' : 'Cambiar Entrenador Personal'}
        size="lg"
      >
        <div className="space-y-6">
          {tipoCambio === 'plan' ? (
            <>
              {/* Plan actual */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Plan Actual</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {suscripcion.planNombre}
                    </p>
                    <p className="text-sm text-gray-600">
                      {planActual?.sesiones || 0} sesiones/mes • {planActual?.precio || 0} €/mes
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
                    label: `${plan.nombre} - ${plan.sesiones} sesiones/mes - ${plan.precio} €/mes`,
                  }))}
                />
                {planesDisponibles.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No hay otros planes disponibles
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Entrenador actual */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Entrenador Actual</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {ENTRENADORES_DISPONIBLES.find(e => e.id === suscripcion.entrenadorId)?.nombre || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {ENTRENADORES_DISPONIBLES.find(e => e.id === suscripcion.entrenadorId)?.especialidad || ''}
                    </p>
                  </div>
                  <Badge color="info">Actual</Badge>
                </div>
              </div>

              {/* Selección de nuevo entrenador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Nuevo Entrenador Personal
                </label>
                <Select
                  value={nuevoEntrenadorId}
                  onChange={(e) => setNuevoEntrenadorId(e.target.value)}
                  options={ENTRENADORES_DISPONIBLES
                    .filter(e => e.id !== suscripcion.entrenadorId && e.disponible)
                    .map(entrenador => ({
                      value: entrenador.id,
                      label: `${entrenador.nombre} - ${entrenador.especialidad}`,
                    }))}
                />
              </div>

              {/* Sesiones programadas */}
              {sesionesProgramadas.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <p className="text-sm font-semibold text-amber-900">
                      Sesiones Programadas ({sesionesProgramadas.length})
                    </p>
                  </div>
                  <div className="space-y-2 mb-4">
                    {sesionesProgramadas.map(sesion => (
                      <div key={sesion.id} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {new Date(sesion.fecha).toLocaleDateString('es-ES')} a las {sesion.hora}
                          </span>
                          <Badge color={sesion.estado === 'confirmada' ? 'success' : 'info'} size="sm">
                            {sesion.estado}
                          </Badge>
                        </div>
                        <span className="text-gray-500 text-xs">{sesion.tipo}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Opciones de gestión de sesiones */}
                  <div className="space-y-3 pt-3 border-t border-amber-200">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="mantenerSesiones"
                        checked={mantenerSesionesProgramadas}
                        onChange={(e) => {
                          setMantenerSesionesProgramadas(e.target.checked);
                          if (e.target.checked) setReasignarSesiones(false);
                        }}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="mantenerSesiones" className="flex-1 cursor-pointer">
                        <p className="text-sm font-medium text-amber-900">
                          Mantener sesiones programadas con el entrenador actual
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Las sesiones se mantendrán con el entrenador actual hasta completarlas.
                        </p>
                      </label>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="reasignarSesiones"
                        checked={reasignarSesiones}
                        onChange={(e) => {
                          setReasignarSesiones(e.target.checked);
                          if (e.target.checked) setMantenerSesionesProgramadas(false);
                        }}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="reasignarSesiones" className="flex-1 cursor-pointer">
                        <p className="text-sm font-medium text-amber-900">
                          Reasignar sesiones al nuevo entrenador
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Las sesiones programadas se transferirán al nuevo entrenador. El cliente será notificado.
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Información del cambio - Solo para cambio de plan */}
          {tipoCambio === 'plan' && nuevoPlan && (
            <>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      Resumen del Cambio
                    </p>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex items-center justify-between">
                        <span>Nuevo plan:</span>
                        <span className="font-semibold">{nuevoPlan.nombre}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Diferencia de sesiones:</span>
                        <span className={`font-semibold ${diferenciaSesiones > 0 ? 'text-green-600' : diferenciaSesiones < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {diferenciaSesiones > 0 ? '+' : ''}{diferenciaSesiones} sesiones/mes
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Diferencia de precio:</span>
                        <span className={`font-semibold ${diferenciaPrecio > 0 ? 'text-red-600' : diferenciaPrecio < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                          {diferenciaPrecio > 0 ? '+' : ''}{diferenciaPrecio} €/mes
                        </span>
                      </div>
                      {aplicarInmediatamente && (
                        <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                          <span>Nuevas sesiones disponibles:</span>
                          <span className="font-semibold">{nuevasSesionesDisponibles}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicador visual del cambio */}
              <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {planActual?.sesiones || 0}
                  </div>
                  <div className="text-xs text-gray-600">sesiones</div>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="text-center">
                  <div className={`text-2xl font-bold ${esUpgrade ? 'text-green-600' : esDowngrade ? 'text-orange-600' : 'text-gray-900'}`}>
                    {nuevoPlan.sesiones}
                  </div>
                  <div className="text-xs text-gray-600">sesiones</div>
                </div>
                {esUpgrade && (
                  <Badge color="success" className="ml-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Upgrade
                  </Badge>
                )}
                {esDowngrade && (
                  <Badge color="warning" className="ml-2">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    Downgrade
                  </Badge>
                )}
              </div>

              {/* Opciones de aplicación - Solo para cambio de plan */}
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
                      El cambio se aplica ahora. Las sesiones disponibles se ajustarán según el nuevo plan.
                      {esUpgrade && ` Se añadirán ${diferenciaSesiones} sesiones adicionales.`}
                      {esDowngrade && ` Las sesiones actuales se mantendrán hasta usarlas, pero no se renovarán.`}
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
                      El cambio se aplicará cuando se renueve la suscripción ({suscripcion.proximaRenovacion ? new Date(suscripcion.proximaRenovacion).toLocaleDateString('es-ES') : 'próxima fecha'}).
                      El cliente podrá seguir usando sus sesiones actuales hasta entonces.
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

          {/* Opciones de aplicación para cambio de entrenador */}
          {tipoCambio === 'entrenador' && nuevoEntrenadorId && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                <input
                  type="radio"
                  id="aplicarInmediatoPT"
                  checked={aplicarInmediatamente}
                  onChange={() => setAplicarInmediatamente(true)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="aplicarInmediatoPT" className="flex-1 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">
                    Aplicar inmediatamente
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    El cambio de entrenador se aplica ahora. Las sesiones futuras se programarán con el nuevo entrenador.
                  </p>
                </label>
              </div>
              
              <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                <input
                  type="radio"
                  id="aplicarProximaRenovacionPT"
                  checked={!aplicarInmediatamente}
                  onChange={() => setAplicarInmediatamente(false)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="aplicarProximaRenovacionPT" className="flex-1 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">
                    Aplicar en fecha específica
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    El cambio se aplicará en la fecha seleccionada.
                  </p>
                </label>
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
            </div>
          )}

              {/* Motivo (opcional) */}
              <div>
                <Textarea
                  label="Motivo del cambio (opcional)"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: Cliente necesita más sesiones para preparar competición"
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                setNuevoPlanId('');
                setMotivo('');
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCambioPlan}
              disabled={
                (tipoCambio === 'plan' && !nuevoPlanId) || 
                (tipoCambio === 'entrenador' && !nuevoEntrenadorId) || 
                loading
              }
            >
              {loading ? 'Procesando...' : 'Confirmar Cambio'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

