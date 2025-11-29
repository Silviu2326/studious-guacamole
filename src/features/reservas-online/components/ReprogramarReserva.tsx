import React, { useState, useEffect } from 'react';
import { Modal, Button, Textarea, Card } from '../../../components/componentsreutilizables';
import { Reserva, Disponibilidad } from '../types';
import { reprogramarReserva, ReprogramacionReserva, enviarNotificacionReprogramacion } from '../api';
import { SelectorHuecos } from './SelectorHuecos';
import { Calendar, Clock, User, AlertCircle, CheckCircle } from 'lucide-react';

interface ReprogramarReservaProps {
  reserva: Reserva;
  isOpen: boolean;
  onClose: () => void;
  onReprogramar: (reservaActualizada: Reserva) => void;
  entrenadorId?: string;
  role: 'entrenador' | 'gimnasio';
}

export const ReprogramarReserva: React.FC<ReprogramarReservaProps> = ({
  reserva,
  isOpen,
  onClose,
  onReprogramar,
  entrenadorId,
  role,
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(reserva.fecha);
  const [huecoSeleccionado, setHuecoSeleccionado] = useState<Disponibilidad | undefined>();
  const [motivo, setMotivo] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  // Resetear estado cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFechaSeleccionada(reserva.fecha);
      setHuecoSeleccionado(undefined);
      setMotivo('');
      setError(null);
      setExito(false);
    }
  }, [isOpen, reserva]);

  // Cuando cambia la fecha, limpiar la selección de hueco
  useEffect(() => {
    setHuecoSeleccionado(undefined);
  }, [fechaSeleccionada]);

  const handleReprogramar = async () => {
    if (!huecoSeleccionado) {
      setError('Por favor, selecciona un horario disponible');
      return;
    }

    setProcesando(true);
    setError(null);
    setExito(false);

    try {
      const reprogramacion: ReprogramacionReserva = {
        fecha: fechaSeleccionada,
        horaInicio: huecoSeleccionado.horaInicio,
        horaFin: huecoSeleccionado.horaFin,
        motivo: motivo.trim() || undefined,
      };

      // Reprogramar la reserva
      const reservaActualizada = await reprogramarReserva(
        reserva.id,
        reprogramacion,
        entrenadorId,
        reserva // Pasar la reserva actual para evitar búsquedas innecesarias
      );

      // Enviar notificación al cliente
      try {
        await enviarNotificacionReprogramacion(
          reserva,
          reprogramacion,
          motivo.trim() || undefined,
          'todos'
        );
      } catch (notifError) {
        console.error('Error al enviar notificación:', notifError);
        // No fallar la reprogramación si falla la notificación
      }

      setExito(true);
      
      // Esperar un momento para mostrar el mensaje de éxito
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onReprogramar(reservaActualizada);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reprogramar la reserva');
    } finally {
      setProcesando(false);
    }
  };

  const formatearFechaAnterior = () => {
    return reserva.fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearFechaSeleccionada = () => {
    return fechaSeleccionada.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Función para avanzar/retroceder días
  const cambiarDia = (dias: number) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaSeleccionada(nuevaFecha);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reprogramar Reserva"
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={procesando}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleReprogramar}
            loading={procesando}
            disabled={!huecoSeleccionado || procesando}
          >
            {procesando ? 'Reprogramando...' : 'Confirmar Reprogramación'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Información de la reserva actual */}
        <Card className="p-4 bg-slate-50 border border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-slate-600" />
              <h4 className="font-semibold text-gray-900">Cliente: {reserva.clienteNombre}</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Fecha actual</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-gray-900">{formatearFechaAnterior()}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Hora actual</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-gray-900">
                    {reserva.horaInicio} - {reserva.horaFin}
                  </span>
                </div>
              </div>
            </div>

            {reserva.tipoSesion && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tipo de sesión</p>
                <span className="text-sm text-gray-900">
                  {reserva.tipoSesion === 'presencial' ? 'Presencial' : 'Videollamada'}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Selector de nueva fecha */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Nueva Fecha y Hora</h4>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => cambiarDia(-1)}
                disabled={procesando}
              >
                ←
              </Button>
              <span className="text-sm font-medium text-gray-700 min-w-[200px] text-center">
                {formatearFechaSeleccionada()}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => cambiarDia(1)}
                disabled={procesando}
              >
                →
              </Button>
            </div>
          </div>

          {/* Selector de horarios disponibles */}
          <SelectorHuecos
            fecha={fechaSeleccionada}
            role={role}
            onSeleccionarHueco={setHuecoSeleccionado}
            huecoSeleccionado={huecoSeleccionado}
            entrenadorId={entrenadorId}
          />
        </div>

        {/* Motivo opcional */}
        <div>
          <Textarea
            label="Motivo del cambio (opcional)"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Cambio de horario por imprevisto personal..."
            rows={3}
            disabled={procesando}
          />
          <p className="text-xs text-gray-500 mt-1">
            El cliente recibirá una notificación con esta información
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {exito && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">¡Reserva reprogramada!</p>
              <p className="text-sm text-green-700">
                El cliente ha sido notificado automáticamente.
              </p>
            </div>
          </div>
        )}

        {/* Información sobre la notificación */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Notificación automática</p>
              <p className="text-sm text-blue-700">
                El cliente recibirá automáticamente una notificación con los nuevos datos de la sesión.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

