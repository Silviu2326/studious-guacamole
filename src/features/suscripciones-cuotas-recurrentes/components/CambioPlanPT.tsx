import React, { useState } from 'react';
import { Suscripcion } from '../types';
import { Card, Button, Modal, Select, Badge, Textarea } from '../../../components/componentsreutilizables';
import { cambiarPlanPT } from '../api/suscripciones';
import { ArrowRight, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface CambioPlanPTProps {
  suscripcion: Suscripcion;
  onSuccess?: () => void;
}

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
  const [nuevoPlanId, setNuevoPlanId] = useState<string>('');
  const [aplicarInmediatamente, setAplicarInmediatamente] = useState<boolean>(true);
  const [motivo, setMotivo] = useState<string>('');
  const [loading, setLoading] = useState(false);

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
              Cambio de Plan
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
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setModalOpen(true)}
          >
            Cambiar Plan
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          if (!loading) {
            setModalOpen(false);
            setNuevoPlanId('');
            setMotivo('');
          }
        }}
        title="Cambiar Plan del Cliente"
        size="lg"
      >
        <div className="space-y-6">
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

          {/* Información del cambio */}
          {nuevoPlan && (
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

