import React, { useState } from 'react';
import { Suscripcion } from '../types';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import {
  Eye,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  Info,
  X,
  Mail,
  Phone,
  Gift,
  Sparkles,
} from 'lucide-react';

interface VistaClienteSuscripcionProps {
  suscripcion: Suscripcion;
  onClose?: () => void;
}

export const VistaClienteSuscripcion: React.FC<VistaClienteSuscripcionProps> = ({
  suscripcion,
  onClose,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'info' }> = {
      activa: { label: 'Activa', color: 'success' },
      pausada: { label: 'Pausada', color: 'warning' },
      cancelada: { label: 'Cancelada', color: 'error' },
      vencida: { label: 'Vencida', color: 'error' },
      pendiente: { label: 'Pendiente', color: 'info' },
    };
    
    const estadoData = estados[estado] || estados.pendiente;
    return <Badge color={estadoData.color}>{estadoData.label}</Badge>;
  };

  const getFrecuenciaLabel = (frecuencia: string) => {
    const labels: Record<string, string> = {
      mensual: 'Mensual',
      trimestral: 'Trimestral',
      semestral: 'Semestral',
      anual: 'Anual',
    };
    return labels[frecuencia] || frecuencia;
  };

  const calcularDiasRestantes = (fechaVencimiento: string) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const diasRestantes = calcularDiasRestantes(suscripcion.fechaVencimiento);
  const precioConDescuento = suscripcion.descuento
    ? suscripcion.descuento.tipo === 'porcentaje'
      ? suscripcion.precio * (1 - suscripcion.descuento.valor / 100)
      : suscripcion.precio - suscripcion.descuento.valor
    : suscripcion.precio;

  return (
    <>
      {onClose ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setModalOpen(true)}
          title="Ver vista del cliente"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Vista Cliente
        </Button>
      ) : (
        <Card className="bg-white shadow-sm p-6">
          {renderVistaCliente()}
        </Card>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          onClose?.();
        }}
        title="Vista del Cliente - Información de Suscripción"
        size="xl"
        footer={
          <Button variant="primary" onClick={() => {
            setModalOpen(false);
            onClose?.();
          }}>
            Cerrar
          </Button>
        }
      >
        {renderVistaCliente()}
      </Modal>
    </>
  );

  function renderVistaCliente() {
    return (
      <div className="space-y-6">
        {/* Header con estado y plan */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{suscripcion.planNombre}</h2>
              {getEstadoBadge(suscripcion.estado)}
              {suscripcion.isTrial && (
                <Badge color="info" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Prueba
                </Badge>
              )}
            </div>
            <p className="text-gray-600">
              {suscripcion.tipo === 'pt-mensual'
                ? 'Suscripción de Entrenador Personal'
                : 'Membresía de Gimnasio'}
            </p>
          </div>
        </div>

        {/* Información de sesiones (para PT) */}
        {suscripcion.tipo === 'pt-mensual' && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Sesiones</h3>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {suscripcion.sesionesIncluidas || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Incluidas/mes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {suscripcion.sesionesUsadas || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Usadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {suscripcion.sesionesDisponibles || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Disponibles</div>
              </div>
            </div>
            {suscripcion.sesionesBonus && suscripcion.sesionesBonus > 0 && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2">
                <Gift className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {suscripcion.sesionesBonus} sesiones bonus disponibles
                </span>
              </div>
            )}
          </Card>
        )}

        {/* Información de precio y pago */}
        <Card className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Información de Pago</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Precio base:</span>
              <span className="font-semibold text-gray-900">
                {suscripcion.precioOriginal || suscripcion.precio} €/{getFrecuenciaLabel(suscripcion.frecuenciaPago).toLowerCase()}
              </span>
            </div>
            {suscripcion.descuento && (
              <>
                <div className="flex items-center justify-between text-red-600">
                  <span>Descuento aplicado:</span>
                  <span className="font-semibold">
                    {suscripcion.descuento.tipo === 'porcentaje'
                      ? `-${suscripcion.descuento.valor}%`
                      : `-${suscripcion.descuento.valor} €`}
                  </span>
                </div>
                {suscripcion.descuento.motivo && (
                  <div className="text-xs text-gray-500 italic">
                    Motivo: {suscripcion.descuento.motivo}
                  </div>
                )}
              </>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Precio final:</span>
              <span className="text-2xl font-bold text-blue-600">
                {precioConDescuento.toFixed(2)} €/{getFrecuenciaLabel(suscripcion.frecuenciaPago).toLowerCase()}
              </span>
            </div>
            {suscripcion.pagoRecurrente && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Pago Recurrente Activo</span>
                </div>
                <div className="text-sm text-gray-600">
                  Método de pago: {suscripcion.pagoRecurrente.metodoPago}
                  {suscripcion.pagoRecurrente.numeroTarjeta && (
                    <span className="ml-2">•••• {suscripcion.pagoRecurrente.numeroTarjeta}</span>
                  )}
                </div>
                {suscripcion.pagoRecurrente.fechaProximoCargo && (
                  <div className="text-sm text-gray-600 mt-1">
                    Próximo cargo: {new Date(suscripcion.pagoRecurrente.fechaProximoCargo).toLocaleDateString('es-ES')}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Fechas importantes */}
        <Card className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Fechas Importantes</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Fecha de inicio:</span>
              <span className="font-medium text-gray-900">
                {new Date(suscripcion.fechaInicio).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Fecha de vencimiento:</span>
              <span className="font-medium text-gray-900">
                {new Date(suscripcion.fechaVencimiento).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {suscripcion.proximaRenovacion && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Próxima renovación:</span>
                <span className="font-medium text-blue-600">
                  {new Date(suscripcion.proximaRenovacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  {diasRestantes > 0
                    ? `Tu suscripción vence en ${diasRestantes} días`
                    : diasRestantes === 0
                    ? 'Tu suscripción vence hoy'
                    : `Tu suscripción venció hace ${Math.abs(diasRestantes)} días`}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Información adicional para gimnasios */}
        {suscripcion.tipo === 'membresia-gimnasio' && (
          <Card className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Beneficios del Plan</h3>
            </div>
            <div className="space-y-2">
              {suscripcion.nivelPlan && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Nivel: {suscripcion.nivelPlan.charAt(0).toUpperCase() + suscripcion.nivelPlan.slice(1)}
                  </span>
                </div>
              )}
              {suscripcion.permiteFreeze && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Permite pausar membresía (Freeze)</span>
                </div>
              )}
              {suscripcion.permiteMultisesion && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Acceso a múltiples servicios</span>
                </div>
              )}
              {suscripcion.serviciosAcceso && suscripcion.serviciosAcceso.length > 0 && (
                <div className="mt-3">
                  <span className="text-sm font-medium text-gray-700">Servicios incluidos:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {suscripcion.serviciosAcceso.map((servicio, index) => (
                      <Badge key={index} color="info">
                        {servicio}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Estado de freeze (si está activo) */}
        {suscripcion.freezeActivo && (
          <Card className="bg-amber-50 border border-amber-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-amber-900">Suscripción Pausada</h3>
            </div>
            <div className="text-sm text-amber-800">
              Tu suscripción está pausada desde el {suscripcion.fechaFreezeInicio && new Date(suscripcion.fechaFreezeInicio).toLocaleDateString('es-ES')}
              {suscripcion.fechaFreezeFin && (
                <> hasta el {new Date(suscripcion.fechaFreezeFin).toLocaleDateString('es-ES')}</>
              )}
              {suscripcion.reanudacionAutomatica && (
                <div className="mt-2">
                  Se reanudará automáticamente al finalizar el período de pausa.
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Información de prueba (si es trial) */}
        {suscripcion.isTrial && (
          <Card className="bg-purple-50 border border-purple-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-900">Suscripción de Prueba</h3>
            </div>
            <div className="text-sm text-purple-800 space-y-1">
              <div>
                Esta es una suscripción de prueba con {suscripcion.trialSessions || suscripcion.sesionesIncluidas} sesiones.
              </div>
              {suscripcion.trialEndDate && (
                <div>
                  La prueba finaliza el {new Date(suscripcion.trialEndDate).toLocaleDateString('es-ES')}
                </div>
              )}
              <div className="mt-2 font-medium">
                Precio de prueba: {suscripcion.trialPrice || precioConDescuento} €
              </div>
            </div>
          </Card>
        )}

        {/* Contacto */}
        <Card className="bg-gray-50 border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">¿Necesitas ayuda?</p>
            <p>Si tienes alguna pregunta sobre tu suscripción, no dudes en contactarnos.</p>
          </div>
        </Card>
      </div>
    );
  }
};

