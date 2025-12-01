import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '../../../components/componentsreutilizables';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Video,
  MapPin
} from 'lucide-react';
import { getReservas } from '../api/reservas';
import { actualizarReserva, cancelarReserva } from '../api/reservas';
import { validarTokenConfirmacion, marcarTokenComoUsado } from '../api/tokensConfirmacion';
import { Reserva, InfoReservaToken } from '../types';

export default function ConfirmarReservaPage() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const accion = (searchParams.get('accion') || 'confirmar') as 'confirmar' | 'cancelar';
  
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [infoReserva, setInfoReserva] = useState<InfoReservaToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      cargarDatos();
    }
  }, [token]);

  const cargarDatos = async () => {
    if (!token) {
      setError('Token no válido');
      setLoading(false);
      return;
    }

    try {
      // Validar token y obtener información de la reserva
      const info = await validarTokenConfirmacion(token);
      
      if (!info) {
        setError('Token de confirmación no válido o expirado');
        setLoading(false);
        return;
      }

      setInfoReserva(info);

      // Obtener reserva completa para mostrar todos los detalles
      const ahora = new Date();
      const fechaFin = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000);
      const reservas = await getReservas({ fechaInicio: ahora, fechaFin }, 'entrenador');
      const reservaEncontrada = reservas.find(r => r.id === info.reservaId);

      if (reservaEncontrada) {
        setReserva(reservaEncontrada);
      } else {
        // Si no encontramos la reserva completa, crear un objeto básico desde la info del token
        const reservaBasica: Reserva = {
          id: info.reservaId,
          clienteId: info.clienteId,
          entrenadorId: info.entrenadorId,
          clienteNombre: info.clienteNombre,
          fecha: info.fechaInicio,
          fechaInicio: info.fechaInicio,
          fechaFin: info.fechaFin,
          horaInicio: info.fechaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          horaFin: info.fechaFin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          estado: info.estado,
          tipoSesion: info.tipoSesion,
          precio: info.precio,
          origen: 'enlacePublico',
          esOnline: info.tipoSesion === 'videollamada',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setReserva(reservaBasica);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar la información de la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async () => {
    if (!reserva || !token) return;

    setProcesando(true);
    setError(null);

    try {
      // Marcar token como usado
      await marcarTokenComoUsado(token, 'confirmar');

      // Actualizar reserva a confirmada si estaba pendiente
      if (reserva.estado === 'pendiente') {
        await actualizarReserva(reserva.id, { estado: 'confirmada' });
      }

      setExito(true);
    } catch (error) {
      console.error('Error confirmando reserva:', error);
      setError('Error al confirmar la reserva. Por favor, intenta de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  const handleCancelar = async () => {
    if (!reserva || !token) return;

    setProcesando(true);
    setError(null);

    try {
      // Marcar token como usado
      await marcarTokenComoUsado(token, 'cancelar');

      // Cancelar reserva
      // Nota: En un sistema real, aquí obtendríamos el entrenadorId del token o de la reserva
      // Por ahora, pasamos undefined y el sistema no enviará notificación (simulado)
      // En producción, el entrenadorId debería estar en el token o en la reserva
      await cancelarReserva(reserva.id, 'Cancelado por el cliente desde el recordatorio', undefined, reserva);

      setExito(true);
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      setError('Error al cancelar la reserva. Por favor, intenta de nuevo.');
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !reserva || !infoReserva) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'No se pudo cargar la información de la reserva'}</p>
            <p className="text-sm text-gray-500 mb-4">
              Este enlace puede haber expirado o ya haber sido utilizado.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (exito) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {accion === 'confirmar' ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-orange-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {accion === 'confirmar' ? '¡Asistencia Confirmada!' : 'Sesión Cancelada'}
          </h2>
          <p className="text-gray-600 mb-6">
            {accion === 'confirmar'
              ? 'Perfecto, tu asistencia ha sido confirmada. Te esperamos en la fecha y hora acordadas. Recibirás un recordatorio antes de la sesión.'
              : 'Tu sesión ha sido cancelada correctamente. Si necesitas reprogramar o tienes alguna pregunta, no dudes en contactarnos.'}
          </p>
          <div className="p-4 bg-gray-50 rounded-lg mb-4 text-left">
            <p className="text-sm text-gray-600 mb-1">Reserva</p>
            <p className="text-base font-semibold text-gray-900">{reserva.clienteNombre}</p>
            <p className="text-sm text-gray-600 mt-2">
              {reserva.fecha.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-600">
              {reserva.horaInicio} - {reserva.horaFin}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const fechaInicio = new Date(reserva.fecha);
  fechaInicio.setHours(
    parseInt(reserva.horaInicio.split(':')[0]),
    parseInt(reserva.horaInicio.split(':')[1])
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
      <Card className="bg-white shadow-lg p-8 max-w-md w-full">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {accion === 'confirmar' ? 'Confirmar tu Asistencia' : 'Cancelar tu Sesión'}
            </h2>
            <p className="text-gray-600">
              {accion === 'confirmar'
                ? 'Por favor, confirma que asistirás a esta sesión. Esto nos ayuda a prepararnos mejor.'
                : '¿No puedes asistir a esta sesión? Puedes cancelarla aquí.'}
            </p>
          </div>

          {/* Información de la reserva */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">{reserva.clienteNombre}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">
                {reserva.fecha.toLocaleDateString('es-ES', {
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
                {reserva.horaInicio} - {reserva.horaFin}
              </span>
            </div>
            {reserva.tipoSesion && (
              <div className="flex items-center gap-2">
                {reserva.tipoSesion === 'videollamada' ? (
                  <Video className="w-5 h-5 text-blue-600" />
                ) : (
                  <MapPin className="w-5 h-5 text-blue-600" />
                )}
                <span className="text-gray-700 capitalize">
                  {reserva.tipoSesion === 'videollamada' ? 'Videollamada' : 'Presencial'}
                </span>
              </div>
            )}
            {reserva.tipoSesion === 'videollamada' && reserva.enlaceVideollamada && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800 mb-1">Enlace de videollamada:</p>
                <a
                  href={reserva.enlaceVideollamada}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                >
                  {reserva.enlaceVideollamada}
                </a>
              </div>
            )}
          </div>

          {accion === 'confirmar' ? (
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={handleConfirmar}
                disabled={procesando}
                loading={procesando}
                fullWidth
                leftIcon={<CheckCircle className="w-5 h-5" />}
              >
                Confirmar Asistencia
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate(`/confirmar-reserva/${token}?accion=cancelar`)}
                fullWidth
              >
                Cancelar Sesión
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Al cancelar, tu sesión será marcada como cancelada. Si necesitas reprogramar,
                  por favor contacta con nosotros.
                </p>
              </div>
              <Button
                variant="danger"
                onClick={handleCancelar}
                disabled={procesando}
                loading={procesando}
                fullWidth
                leftIcon={<XCircle className="w-5 h-5" />}
              >
                Cancelar Sesión
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate(`/confirmar-reserva/${token}?accion=confirmar`)}
                fullWidth
              >
                Confirmar Asistencia
              </Button>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

