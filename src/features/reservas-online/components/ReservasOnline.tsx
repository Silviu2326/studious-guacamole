import React, { useState } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { SelectorHuecos } from './SelectorHuecos';
import { ConfirmacionReserva } from './ConfirmacionReserva';
import { Disponibilidad, Reserva } from '../types';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReservasOnlineProps {
  role: 'entrenador' | 'gimnasio';
  onReservaCreada: (reserva: Reserva) => void;
}

export const ReservasOnline: React.FC<ReservasOnlineProps> = ({
  role,
  onReservaCreada,
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [huecoSeleccionado, setHuecoSeleccionado] = useState<Disponibilidad | undefined>();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const handleSeleccionarHueco = (disponibilidad: Disponibilidad) => {
    setHuecoSeleccionado(disponibilidad);
    setMostrarConfirmacion(true);
  };

  const handleConfirmar = (reserva: Reserva) => {
    onReservaCreada(reserva);
    setMostrarConfirmacion(false);
    setHuecoSeleccionado(undefined);
  };

  const handleCancelar = () => {
    setMostrarConfirmacion(false);
    setHuecoSeleccionado(undefined);
  };

  const cambiarFecha = (dias: number) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaSeleccionada(nuevaFecha);
    setHuecoSeleccionado(undefined);
    setMostrarConfirmacion(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                {role === 'entrenador' ? 'Nueva Sesión 1 a 1' : 'Nueva Reserva de Clase'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cambiarFecha(-1)}
              >
                <ChevronLeft size={16} className="mr-1" />
                Anterior
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cambiarFecha(1)}
              >
                Siguiente
                <ChevronRight size={16} className="ml-1" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFechaSeleccionada(new Date())}
              >
                Hoy
              </Button>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            {role === 'entrenador'
              ? 'Selecciona un horario disponible para tu sesión personal'
              : 'Selecciona una clase disponible para reservar tu plaza'}
          </p>
        </div>
      </Card>

      {!mostrarConfirmacion ? (
        <SelectorHuecos
          fecha={fechaSeleccionada}
          role={role}
          onSeleccionarHueco={handleSeleccionarHueco}
          huecoSeleccionado={huecoSeleccionado}
        />
      ) : huecoSeleccionado ? (
        <ConfirmacionReserva
          disponibilidad={huecoSeleccionado}
          role={role}
          onConfirmar={handleConfirmar}
          onCancelar={handleCancelar}
        />
      ) : null}
    </div>
  );
};
