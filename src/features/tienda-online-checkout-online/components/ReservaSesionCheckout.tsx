import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { CarritoItem } from '../types';
import { getDisponibilidad } from '../../../features/reservas-online/api/disponibilidad';
import { crearReserva } from '../../../features/reservas-online/api/reservas';
import { Disponibilidad } from '../../../features/reservas-online/types';
import { Calendar, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';

interface ReservaSesionCheckoutProps {
  carritoItems: CarritoItem[];
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  entrenadorId: string;
  onReservaCompletada: () => void;
  onOmitir: () => void;
}

export const ReservaSesionCheckout: React.FC<ReservaSesionCheckoutProps> = ({
  carritoItems,
  clienteNombre,
  clienteEmail,
  clienteTelefono,
  entrenadorId,
  onReservaCompletada,
  onOmitir,
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [slotSeleccionado, setSlotSeleccionado] = useState<Disponibilidad | null>(null);
  const [cargando, setCargando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservaCompletada, setReservaCompletada] = useState(false);

  // Obtener el primer producto de sesión o bono del carrito
  const productoReserva = carritoItems.find(
    (item) =>
      item.producto.tipo === 'servicio' &&
      (item.producto.metadatos?.sesiones || item.producto.metadatos?.esBono)
  )?.producto;

  useEffect(() => {
    if (fechaSeleccionada) {
      cargarDisponibilidad();
    }
  }, [fechaSeleccionada, entrenadorId]);

  const cargarDisponibilidad = async () => {
    if (!fechaSeleccionada) return;

    setCargando(true);
    setError(null);
    try {
      const disp = await getDisponibilidad(fechaSeleccionada, 'entrenador', entrenadorId);
      setDisponibilidad(disp.filter((d) => d.disponible && d.tipo === 'sesion-1-1'));
    } catch (err) {
      setError('Error al cargar disponibilidad. Intenta de nuevo.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleConfirmarReserva = async () => {
    if (!slotSeleccionado || !fechaSeleccionada) {
      setError('Por favor selecciona una fecha y hora');
      return;
    }

    setProcesando(true);
    setError(null);

    try {
      // Calcular hora de fin basada en la duración del slot
      const [horaInicio, minutoInicio] = slotSeleccionado.horaInicio.split(':').map(Number);
      const duracionMinutos = slotSeleccionado.duracionMinutos || 60;
      const fechaInicio = new Date(fechaSeleccionada);
      fechaInicio.setHours(horaInicio, minutoInicio, 0, 0);
      
      const fechaFin = new Date(fechaInicio);
      fechaFin.setMinutes(fechaFin.getMinutes() + duracionMinutos);

      const horaFin = `${String(fechaFin.getHours()).padStart(2, '0')}:${String(fechaFin.getMinutes()).padStart(2, '0')}`;

      await crearReserva(
        {
          clienteId: `cliente-${Date.now()}`,
          clienteNombre,
          fecha: fechaSeleccionada,
          horaInicio: slotSeleccionado.horaInicio,
          horaFin,
          tipo: 'sesion-1-1',
          tipoSesion: 'presencial',
          estado: 'confirmada',
          precio: productoReserva?.precio || 0,
          pagado: true,
          duracionMinutos,
          observaciones: `Reserva automática después de compra: ${productoReserva?.nombre || 'Sesión'}`,
        },
        entrenadorId
      );

      setReservaCompletada(true);
    } catch (err) {
      setError('Error al crear la reserva. Intenta de nuevo.');
      console.error(err);
    } finally {
      setProcesando(false);
    }
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
              Tu primera sesión ha sido reservada exitosamente.
            </p>
            {slotSeleccionado && fechaSeleccionada && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Fecha:</strong> {formatearFecha(fechaSeleccionada)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Hora:</strong> {slotSeleccionado.horaInicio} - {slotSeleccionado.horaFin}
                </p>
              </div>
            )}
          </div>
          <Button variant="primary" onClick={onReservaCompletada} fullWidth>
            Continuar
          </Button>
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
                Reserva tu Primera Sesión
              </h2>
              <p className="text-sm text-gray-600">
                Selecciona la fecha y hora para tu primera sesión
              </p>
            </div>
          </div>
          <button
            onClick={onOmitir}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Omitir reserva"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

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
                  onClick={() => setFechaSeleccionada(fecha)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    seleccionada
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
            {cargando ? (
              <div className="text-center py-8 text-gray-500">
                Cargando disponibilidad...
              </div>
            ) : disponibilidad.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay horarios disponibles para esta fecha
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {disponibilidad.map((slot) => {
                  const seleccionado = slotSeleccionado?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSlotSeleccionado(slot)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        seleccionado
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <Clock size={16} className="mx-auto mb-1" />
                      <div className="text-sm font-medium">
                        {slot.horaInicio}
                      </div>
                      {slot.duracionMinutos && (
                        <div className="text-xs text-gray-500 mt-1">
                          {slot.duracionMinutos} min
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onOmitir}
            disabled={procesando}
          >
            Omitir por ahora
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmarReserva}
            loading={procesando}
            disabled={!slotSeleccionado || !fechaSeleccionada}
            fullWidth
          >
            Confirmar Reserva
          </Button>
        </div>
      </div>
    </Card>
  );
};

