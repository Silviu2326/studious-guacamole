import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import { getPagosFallidos, gestionarPagoFallido } from '../api/cuotas';
import { createAlert } from '../../../features/tareas-alertas/api/alerts';
import { PagoFallido, GestionarPagoFallidoRequest } from '../types';
import { AlertCircle, RefreshCw, CreditCard, Mail, Phone, CheckCircle, XCircle, User, Calendar } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface GestionPagosFallidosProps {
  onSuccess?: () => void;
}

export const GestionPagosFallidos: React.FC<GestionPagosFallidosProps> = ({
  onSuccess,
}) => {
  const { user } = useAuth();
  const [pagosFallidos, setPagosFallidos] = useState<PagoFallido[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoFallido | null>(null);
  const [accionSeleccionada, setAccionSeleccionada] = useState<GestionarPagoFallidoRequest['accion'] | null>(null);
  const [nuevoMetodoPago, setNuevoMetodoPago] = useState<'tarjeta' | 'transferencia' | 'domiciliacion' | ''>('');
  const [notas, setNotas] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    loadPagosFallidos();
    
    // Verificar cada 5 minutos
    const interval = setInterval(loadPagosFallidos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const loadPagosFallidos = async () => {
    setLoading(true);
    try {
      const data = await getPagosFallidos(user?.id);
      setPagosFallidos(data);
      
      // Crear alertas automáticas para nuevos pagos fallidos
      for (const pago of data) {
        await createAlert({
          type: 'pago-pendiente',
          title: `Pago fallido: ${pago.clienteNombre}`,
          message: `El pago automático de ${pago.monto}€ de ${pago.clienteNombre} ha fallado. Motivo: ${pago.motivoFallo || 'Desconocido'}`,
          priority: 'alta',
          role: 'entrenador',
          actionUrl: `/suscripciones-cuotas-recurrentes?tab=pagos-fallidos`,
          relatedEntityId: pago.cuotaId,
          relatedEntityType: 'pago',
          userId: user?.id,
        });
      }
    } catch (error) {
      console.error('Error cargando pagos fallidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (pago: PagoFallido, accion: GestionarPagoFallidoRequest['accion']) => {
    setPagoSeleccionado(pago);
    setAccionSeleccionada(accion);
    setNuevoMetodoPago('');
    setNotas('');
    setModalOpen(true);
  };

  const handleGestionarPago = async () => {
    if (!pagoSeleccionado || !accionSeleccionada) return;

    setProcesando(true);
    try {
      const request: GestionarPagoFallidoRequest = {
        cuotaId: pagoSeleccionado.cuotaId,
        accion: accionSeleccionada,
        nuevoMetodoPago: nuevoMetodoPago || undefined,
        notas: notas || undefined,
      };

      await gestionarPagoFallido(request);
      
      setModalOpen(false);
      await loadPagosFallidos();
      onSuccess?.();
    } catch (error) {
      console.error('Error gestionando pago fallido:', error);
      alert('Error al gestionar el pago. Por favor, intenta de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  const handleContactarCliente = (pago: PagoFallido) => {
    if (pago.clienteEmail) {
      window.location.href = `mailto:${pago.clienteEmail}?subject=Pago fallido - ${pago.monto}€&body=Hola ${pago.clienteNombre}, el pago automático de ${pago.monto}€ ha fallado. Por favor, actualiza tu método de pago o contacta con nosotros.`;
    }
  };

  const getMotivoFalloColor = (motivo?: string) => {
    if (!motivo) return 'error';
    if (motivo.toLowerCase().includes('expirada')) return 'warning';
    if (motivo.toLowerCase().includes('insuficientes')) return 'error';
    return 'error';
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pagos fallidos...</p>
        </div>
      </Card>
    );
  }

  if (pagosFallidos.length === 0) {
    return (
      <Card className="bg-white shadow-sm p-6">
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay pagos fallidos
          </h3>
          <p className="text-gray-600">
            Todos los pagos automáticos se están procesando correctamente.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Gestión de Pagos Fallidos
              </h3>
              <p className="text-sm text-gray-600">
                {pagosFallidos.length} pago(s) fallido(s) requieren atención
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={loadPagosFallidos}
          >
            Actualizar
          </Button>
        </div>

        <div className="space-y-4">
          {pagosFallidos.map((pago) => (
            <div
              key={pago.cuotaId}
              className="border border-red-200 rounded-lg p-4 bg-red-50/50 hover:border-red-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      {pago.clienteNombre}
                    </h4>
                    <Badge color="error">
                      Pago Fallido
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard className="w-4 h-4" />
                      <span>
                        Monto: <strong>{pago.monto}€</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Vencimiento: {new Date(pago.fechaVencimiento).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>
                        Intentos: <strong>{pago.intentos}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Badge color={getMotivoFalloColor(pago.motivoFallo)}>
                      {pago.motivoFallo || 'Motivo desconocido'}
                    </Badge>
                    {pago.metodoPago && (
                      <span className="ml-2 text-sm text-gray-600">
                        Método: {pago.metodoPago}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {pago.clienteEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{pago.clienteEmail}</span>
                      </div>
                    )}
                    {pago.clienteTelefono && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{pago.clienteTelefono}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAbrirModal(pago, 'reintentar')}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAbrirModal(pago, 'actualizar_metodo')}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Actualizar Método
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleContactarCliente(pago)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contactar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAbrirModal(pago, 'marcar_resuelto')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar Resuelto
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          accionSeleccionada === 'reintentar'
            ? 'Reintentar Pago'
            : accionSeleccionada === 'actualizar_metodo'
            ? 'Actualizar Método de Pago'
            : accionSeleccionada === 'marcar_resuelto'
            ? 'Marcar como Resuelto'
            : 'Gestionar Pago Fallido'
        }
        size="md"
      >
        {pagoSeleccionado && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Cliente:</p>
              <p className="font-semibold text-gray-900">{pagoSeleccionado.clienteNombre}</p>
              <p className="text-sm text-gray-600 mt-2 mb-1">Monto:</p>
              <p className="font-semibold text-gray-900">{pagoSeleccionado.monto}€</p>
              <p className="text-sm text-gray-600 mt-2 mb-1">Motivo del fallo:</p>
              <p className="text-sm text-gray-900">{pagoSeleccionado.motivoFallo || 'Desconocido'}</p>
            </div>

            {accionSeleccionada === 'actualizar_metodo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo Método de Pago
                </label>
                <select
                  value={nuevoMetodoPago}
                  onChange={(e) => setNuevoMetodoPago(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un método</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="domiciliacion">Domiciliación</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Añade notas sobre esta acción..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setModalOpen(false)}
                disabled={procesando}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleGestionarPago}
                disabled={procesando || (accionSeleccionada === 'actualizar_metodo' && !nuevoMetodoPago)}
              >
                {procesando ? 'Procesando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

