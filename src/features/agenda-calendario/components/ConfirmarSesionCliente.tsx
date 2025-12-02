import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { Card, Button, Modal, Textarea } from '../../../components/componentsreutilizables';
import { Cita } from '../types';
import {
  confirmarAsistenciaCliente,
  cancelarAsistenciaCliente,
  solicitarReprogramacion,
} from '../api/confirmacionCliente';
import { getCitas } from '../api/calendario';

interface ConfirmarSesionClienteProps {
  citaId: string;
  accion: 'confirmar' | 'cancelar';
}

export const ConfirmarSesionCliente: React.FC<ConfirmarSesionClienteProps> = ({
  citaId,
  accion,
}) => {
  const [cita, setCita] = useState<Cita | null>(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mostrarReprogramacion, setMostrarReprogramacion] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [fechaPreferida, setFechaPreferida] = useState('');
  const [horaPreferida, setHoraPreferida] = useState('');
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarCita();
  }, [citaId]);

  const cargarCita = async () => {
    setLoading(true);
    try {
      const ahora = new Date();
      const fechaFin = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000);
      const citas = await getCitas(ahora, fechaFin, 'entrenador');
      const citaEncontrada = citas.find((c) => c.id === citaId);
      setCita(citaEncontrada || null);
    } catch (error) {
      console.error('Error cargando cita:', error);
      setError('Error al cargar la información de la sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async () => {
    if (!cita?.clienteId) return;
    setProcesando(true);
    setError(null);

    try {
      await confirmarAsistenciaCliente(citaId, cita.clienteId);
      setExito(true);
    } catch (error) {
      console.error('Error confirmando asistencia:', error);
      setError('Error al confirmar la asistencia. Por favor, intenta de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  const handleCancelar = async () => {
    if (!cita?.clienteId) return;

    if (mostrarReprogramacion) {
      // Solicitar reprogramación
      setProcesando(true);
      setError(null);

      try {
        const fechaPreferidaDate = fechaPreferida ? new Date(fechaPreferida) : undefined;
        await solicitarReprogramacion(
          citaId,
          cita.clienteId,
          motivo,
          fechaPreferidaDate,
          horaPreferida
        );
        setExito(true);
        setMostrarReprogramacion(false);
      } catch (error) {
        console.error('Error solicitando reprogramación:', error);
        setError('Error al solicitar la reprogramación. Por favor, intenta de nuevo.');
      } finally {
        setProcesando(false);
      }
    } else {
      // Cancelar directamente
      setProcesando(true);
      setError(null);

      try {
        await cancelarAsistenciaCliente(citaId, cita.clienteId, motivo);
        setExito(true);
      } catch (error) {
        console.error('Error cancelando sesión:', error);
        setError('Error al cancelar la sesión. Por favor, intenta de nuevo.');
      } finally {
        setProcesando(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="bg-white shadow-lg p-8">
          <div className="text-center">Cargando información de la sesión...</div>
        </Card>
      </div>
    );
  }

  if (!cita) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="bg-white shadow-lg p-8">
          <div className="text-center text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-semibold">Sesión no encontrada</p>
            <p className="text-sm text-gray-600 mt-2">
              La sesión que estás intentando confirmar no existe o ya no está disponible.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (exito) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="bg-white shadow-lg p-8 max-w-md">
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {accion === 'confirmar' ? '¡Confirmación exitosa!' : 'Solicitud enviada'}
            </h2>
            <p className="text-gray-600 mb-6">
              {accion === 'confirmar'
                ? 'Tu asistencia ha sido confirmada. ¡Te esperamos!'
                : 'Tu solicitud ha sido enviada al entrenador. Te contactaremos pronto.'}
            </p>
            <Button variant="primary" onClick={() => window.close()}>
              Cerrar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const fechaInicio = new Date(cita.fechaInicio);
  const fechaFin = new Date(cita.fechaFin);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="bg-white shadow-lg p-8 max-w-md w-full">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {accion === 'confirmar' ? 'Confirmar Asistencia' : 'Cancelar Sesión'}
            </h2>
            <p className="text-gray-600">
              {accion === 'confirmar'
                ? 'Confirma que asistirás a esta sesión'
                : '¿No puedes asistir a esta sesión?'}
            </p>
          </div>

          {/* Información de la sesión */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">
                {fechaInicio.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">
                {fechaInicio.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                -{' '}
                {fechaFin.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">{cita.titulo}</span>
            </div>
            {cita.ubicacion && (
              <div className="text-sm text-gray-600">
                Ubicación: {cita.ubicacion}
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {accion === 'confirmar' ? (
            <div className="space-y-4">
              <Button
                variant="primary"
                onClick={handleConfirmar}
                disabled={procesando}
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {procesando ? 'Confirmando...' : 'Confirmo mi asistencia'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo (opcional)
                </label>
                <Textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Explica brevemente por qué no puedes asistir..."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reprogramar"
                  checked={mostrarReprogramacion}
                  onChange={(e) => setMostrarReprogramacion(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="reprogramar" className="text-sm text-gray-700">
                  Solicitar reprogramación
                </label>
              </div>

              {mostrarReprogramacion && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha preferida
                    </label>
                    <input
                      type="date"
                      value={fechaPreferida}
                      onChange={(e) => setFechaPreferida(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora preferida
                    </label>
                    <input
                      type="time"
                      value={horaPreferida}
                      onChange={(e) => setHoraPreferida(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <Button
                variant="danger"
                onClick={handleCancelar}
                disabled={procesando}
                className="w-full"
              >
                <XCircle className="w-4 h-4 mr-2" />
                {procesando
                  ? 'Procesando...'
                  : mostrarReprogramacion
                  ? 'Solicitar Reprogramación'
                  : 'No puedo asistir'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};


