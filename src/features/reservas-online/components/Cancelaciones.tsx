import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Textarea } from '../../../components/componentsreutilizables';
import { Reserva } from '../types';
import { cancelarReserva } from '../api';
import { verificarPoliticaCancelacion, aplicarPenalizacionesCancelacion } from '../api/politicasCancelacion';
import { useAuth } from '../../../context/AuthContext';
import { XCircle, Calendar, Clock, DollarSign, AlertTriangle, Package, Shield, Info } from 'lucide-react';

interface CancelacionesProps {
  reservas: Reserva[];
  role: 'entrenador' | 'gimnasio';
  onCancelar: (reservaId: string) => void;
}

export const Cancelaciones: React.FC<CancelacionesProps> = ({
  reservas,
  role,
  onCancelar,
}) => {
  const { user } = useAuth();
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [motivo, setMotivo] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [verificacionPolitica, setVerificacionPolitica] = useState<{
    puedeCancelar: boolean;
    esCancelacionUltimoMomento: boolean;
    aplicarMulta: boolean;
    montoMulta: number;
    aplicarPenalizacionBono: boolean;
    mensaje: string;
  } | null>(null);
  const [verificandoPolitica, setVerificandoPolitica] = useState(false);

  const reservasCancelables = reservas.filter(
    (r) => r.estado === 'confirmada' || r.estado === 'pendiente'
  );

  // Verificar política cuando se selecciona una reserva (solo para entrenadores)
  useEffect(() => {
    const verificarPolitica = async () => {
      if (!reservaSeleccionada || role !== 'entrenador' || !user?.id) {
        setVerificacionPolitica(null);
        return;
      }

      setVerificandoPolitica(true);
      try {
        const verificacion = await verificarPoliticaCancelacion(
          user.id,
          reservaSeleccionada.fecha,
          reservaSeleccionada.horaInicio,
          reservaSeleccionada.precio
        );
        setVerificacionPolitica(verificacion);
      } catch (error) {
        console.error('Error verificando política de cancelación:', error);
        setVerificacionPolitica(null);
      } finally {
        setVerificandoPolitica(false);
      }
    };

    verificarPolitica();
  }, [reservaSeleccionada, role, user?.id]);

  const handleCancelar = async () => {
    if (!reservaSeleccionada) return;

    // Bloquear cancelación si está fuera del plazo permitido
    if (role === 'entrenador' && verificacionPolitica && !verificacionPolitica.puedeCancelar) {
      alert('No se puede cancelar esta reserva. ' + verificacionPolitica.mensaje);
      return;
    }

    setProcesando(true);
    try {
      // Aplicar penalizaciones si corresponde (solo para entrenadores)
      if (role === 'entrenador' && user?.id && verificacionPolitica) {
        await aplicarPenalizacionesCancelacion(
          user.id,
          reservaSeleccionada.id,
          reservaSeleccionada.fecha,
          reservaSeleccionada.horaInicio,
          reservaSeleccionada.precio,
          reservaSeleccionada.bonoId
        );
      }

      // Pasar el entrenadorId si es un entrenador cancelando
      // Esto permitirá enviar notificaciones apropiadas
      const entrenadorIdParaNotificacion = role === 'entrenador' ? user?.id : undefined;
      await cancelarReserva(reservaSeleccionada.id, motivo, entrenadorIdParaNotificacion, reservaSeleccionada);
      onCancelar(reservaSeleccionada.id);
      setReservaSeleccionada(null);
      setMotivo('');
      setVerificacionPolitica(null);
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      alert('Error al cancelar la reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: Date) => value.toLocaleDateString('es-ES'),
    },
    {
      key: 'horaInicio',
      label: 'Hora',
      render: (_: any, row: Reserva) => `${row.horaInicio} - ${row.horaFin}`,
    },
    {
      key: 'clienteNombre',
      label: role === 'entrenador' ? 'Cliente' : 'Socio',
      render: (value: string) => value,
    },
    {
      key: 'precio',
      label: 'Precio',
      render: (value: number) => `€${value.toFixed(2)}`,
      align: 'right' as const,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: Reserva) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setReservaSeleccionada(row)}
        >
          Cancelar
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Cancelaciones
            </h3>
          </div>

          {reservasCancelables.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay reservas cancelables</h3>
              <p className="text-gray-600">Todas las reservas están completadas o ya han sido canceladas</p>
            </Card>
          ) : (
            <Table
              data={reservasCancelables}
              columns={columns}
              emptyMessage="No hay reservas para cancelar"
            />
          )}
        </div>
      </Card>

      <Modal
        isOpen={!!reservaSeleccionada}
        onClose={() => {
          setReservaSeleccionada(null);
          setMotivo('');
          setVerificacionPolitica(null);
        }}
        title="Cancelar Reserva"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setReservaSeleccionada(null);
                setMotivo('');
                setVerificacionPolitica(null);
              }}
            >
              Cerrar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelar}
              loading={procesando}
              disabled={
                !motivo.trim() || 
                (role === 'entrenador' && verificacionPolitica && !verificacionPolitica.puedeCancelar) ||
                verificandoPolitica
              }
            >
              Confirmar Cancelación
            </Button>
          </div>
        }
      >
        {reservaSeleccionada && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg space-y-2 ring-1 ring-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-gray-600">
                  {reservaSeleccionada.fecha.toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-gray-600">
                  {reservaSeleccionada.horaInicio} - {reservaSeleccionada.horaFin}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-gray-600">
                  €{reservaSeleccionada.precio.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Información de política de cancelación (solo para entrenadores) */}
            {role === 'entrenador' && (
              <>
                {verificandoPolitica ? (
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Verificando política de cancelación...</span>
                  </div>
                ) : verificacionPolitica ? (
                  <div className={`p-4 rounded-lg border ${
                    !verificacionPolitica.puedeCancelar
                      ? 'bg-red-50 border-red-200'
                      : verificacionPolitica.esCancelacionUltimoMomento
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      {!verificacionPolitica.puedeCancelar ? (
                        <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      ) : verificacionPolitica.esCancelacionUltimoMomento ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-medium mb-1 ${
                          !verificacionPolitica.puedeCancelar
                            ? 'text-red-900'
                            : verificacionPolitica.esCancelacionUltimoMomento
                            ? 'text-yellow-900'
                            : 'text-green-900'
                        }`}>
                          {verificacionPolitica.puedeCancelar ? 'Política de Cancelación' : 'Cancelación no permitida'}
                        </p>
                        <p className={`text-sm ${
                          !verificacionPolitica.puedeCancelar
                            ? 'text-red-700'
                            : verificacionPolitica.esCancelacionUltimoMomento
                            ? 'text-yellow-700'
                            : 'text-green-700'
                        }`}>
                          {verificacionPolitica.mensaje}
                        </p>
                        {verificacionPolitica.aplicarMulta && (
                          <p className="text-sm font-semibold text-red-700 mt-2">
                            Multa a aplicar: €{verificacionPolitica.montoMulta.toFixed(2)}
                          </p>
                        )}
                        {verificacionPolitica.aplicarPenalizacionBono && reservaSeleccionada.bonoId && (
                          <p className="text-sm font-semibold text-orange-700 mt-2">
                            Se descontará una sesión del bono
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}

            <Textarea
              label="Motivo de Cancelación"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ingrese el motivo de la cancelación..."
              rows={4}
              required
            />
          </div>
        )}
      </Modal>
    </>
  );
};
