import React, { useState } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Calendar, Clock, CheckCircle, X } from 'lucide-react';

import { CarritoItem } from '../types';

interface ReservaSesionCheckoutProps {
  productoId?: string;
  carritoItems?: CarritoItem[];
  clienteNombre?: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  entrenadorId?: string;
  onSesionReservada?: (detalle: { fecha: string; hora: string }) => void;
  onReservaCompletada?: () => void;
  onOmitir?: () => void;
}

export const ReservaSesionCheckout: React.FC<ReservaSesionCheckoutProps> = ({
  productoId,
  carritoItems,
  clienteNombre,
  clienteEmail,
  clienteTelefono,
  entrenadorId,
  onSesionReservada,
  onReservaCompletada,
  onOmitir,
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>('');
  const [reservaCompletada, setReservaCompletada] = useState(false);

  // Horarios disponibles mock (en producción vendrían de una API)
  const horariosDisponibles = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00',
  ];

  const handleConfirmarReserva = () => {
    if (!fechaSeleccionada || !horaSeleccionada) {
      return;
    }

    // Formatear fecha como string (YYYY-MM-DD)
    const fechaStr = fechaSeleccionada.toISOString().split('T')[0];

    // Llamar al callback con los detalles
    if (onSesionReservada) {
      onSesionReservada({
        fecha: fechaStr,
        hora: horaSeleccionada,
      });
    }

    if (onReservaCompletada) {
      onReservaCompletada();
    }

    setReservaCompletada(true);
  };

  const generarFechasDisponibles = () => {
    const fechas: Date[] = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Generar fechas para los próximos 30 días
    for (let i = 1; i <= 30; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + i);
      fechas.push(fecha);
    }

    return fechas;
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const esHoy = (fecha: Date) => {
    const hoy = new Date();
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  };

  if (reservaCompletada) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-600" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¡Reserva Confirmada!
            </h3>
            <p className="text-gray-600 mb-4">
              La información de la sesión ha sido guardada.
            </p>
            {fechaSeleccionada && horaSeleccionada && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Fecha:</strong> {formatearFecha(fechaSeleccionada)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Hora:</strong> {horaSeleccionada}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Reserva tu Sesión
              </h2>
              <p className="text-sm text-gray-600">
                Selecciona la fecha y hora para tu sesión
              </p>
            </div>
          </div>
          {onOmitir && (
            <button
              onClick={onOmitir}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Omitir reserva"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Selector de Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecciona una fecha
          </label>
          <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
            {generarFechasDisponibles().map((fecha, index) => {
              const fechaStr = fecha.toISOString().split('T')[0];
              const seleccionada =
                fechaSeleccionada?.toISOString().split('T')[0] === fechaStr;
              const esHoyFecha = esHoy(fecha);

              return (
                <button
                  key={index}
                  onClick={() => {
                    setFechaSeleccionada(fecha);
                    setHoraSeleccionada(''); // Reset hora al cambiar fecha
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${seleccionada
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                >
                  <div className="text-xs font-medium">
                    {fecha.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-bold mt-1">
                    {fecha.getDate()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {fecha.toLocaleDateString('es-ES', { month: 'short' })}
                  </div>
                  {esHoyFecha && (
                    <div className="text-xs text-blue-600 font-medium mt-1">
                      Hoy
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selector de Hora */}
        {fechaSeleccionada && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Selecciona una hora
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              {horariosDisponibles.map((hora) => {
                const seleccionada = horaSeleccionada === hora;
                return (
                  <button
                    key={hora}
                    onClick={() => setHoraSeleccionada(hora)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${seleccionada
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                  >
                    <Clock size={16} className="mx-auto mb-1" />
                    <div className="text-sm font-medium">
                      {hora}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {onOmitir && (
            <Button
              variant="secondary"
              onClick={onOmitir}
            >
              Omitir por ahora
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleConfirmarReserva}
            disabled={!horaSeleccionada || !fechaSeleccionada}
            fullWidth
          >
            Confirmar Reserva
          </Button>
        </div>
      </div>
    </Card>
  );
};

