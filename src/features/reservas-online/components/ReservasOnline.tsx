import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { SelectorHuecos } from './SelectorHuecos';
import { ConfirmacionReserva } from './ConfirmacionReserva';
import { Disponibilidad, Reserva } from '../types';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getConfiguracionDiasMaximosReserva } from '../api';

interface ReservasOnlineProps {
  role: 'entrenador' | 'gimnasio';
  onReservaCreada: (reserva: Reserva) => void;
  entrenadorId?: string;
}

export const ReservasOnline: React.FC<ReservasOnlineProps> = ({
  role,
  onReservaCreada,
  entrenadorId,
}) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [huecoSeleccionado, setHuecoSeleccionado] = useState<Disponibilidad | undefined>();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [diasMaximosConfig, setDiasMaximosConfig] = useState<{ activo: boolean; diasMaximos: number } | null>(null);

  // Cargar configuración de días máximos si es entrenador
  useEffect(() => {
    const cargarConfiguracion = async () => {
      if (role === 'entrenador' && entrenadorId) {
        try {
          const config = await getConfiguracionDiasMaximosReserva(entrenadorId);
          setDiasMaximosConfig({
            activo: config.activo,
            diasMaximos: config.diasMaximos,
          });
        } catch (error) {
          console.error('Error cargando configuración de días máximos:', error);
        }
      }
    };
    cargarConfiguracion();
  }, [role, entrenadorId]);

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

  // Verificar si la fecha excede el límite de días máximos
  const puedeAvanzar = () => {
    if (role !== 'entrenador' || !diasMaximosConfig || !diasMaximosConfig.activo) {
      return true; // Sin límite si no es entrenador o la configuración no está activa
    }
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaMaxima = new Date(hoy);
    fechaMaxima.setDate(fechaMaxima.getDate() + diasMaximosConfig.diasMaximos);
    
    const fechaSeleccionadaNormalizada = new Date(fechaSeleccionada);
    fechaSeleccionadaNormalizada.setHours(0, 0, 0, 0);
    
    // Permitir avanzar si la fecha seleccionada + 1 día no excede el límite
    const siguienteFecha = new Date(fechaSeleccionadaNormalizada);
    siguienteFecha.setDate(siguienteFecha.getDate() + 1);
    
    return siguienteFecha <= fechaMaxima;
  };

  // Verificar si la fecha seleccionada está dentro del rango permitido
  const estaDentroDelRango = () => {
    if (role !== 'entrenador' || !diasMaximosConfig || !diasMaximosConfig.activo) {
      return true; // Sin límite si no es entrenador o la configuración no está activa
    }
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaMaxima = new Date(hoy);
    fechaMaxima.setDate(fechaMaxima.getDate() + diasMaximosConfig.diasMaximos);
    
    const fechaSeleccionadaNormalizada = new Date(fechaSeleccionada);
    fechaSeleccionadaNormalizada.setHours(0, 0, 0, 0);
    
    return fechaSeleccionadaNormalizada <= fechaMaxima;
  };

  const cambiarFecha = (dias: number) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    
    // Verificar límite antes de cambiar la fecha
    if (dias > 0 && role === 'entrenador' && diasMaximosConfig && diasMaximosConfig.activo) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaMaxima = new Date(hoy);
      fechaMaxima.setDate(fechaMaxima.getDate() + diasMaximosConfig.diasMaximos);
      
      nuevaFecha.setHours(0, 0, 0, 0);
      if (nuevaFecha > fechaMaxima) {
        // No permitir avanzar más allá del límite
        return;
      }
    }
    
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
                disabled={!puedeAvanzar()}
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
          {role === 'entrenador' && diasMaximosConfig && diasMaximosConfig.activo && (
            <p className="text-sm text-blue-600 mb-2">
              Reservas disponibles hasta {(() => {
                const fechaMaxima = new Date();
                fechaMaxima.setDate(fechaMaxima.getDate() + diasMaximosConfig.diasMaximos);
                return fechaMaxima.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
              })()}
            </p>
          )}
          {role === 'entrenador' && diasMaximosConfig && diasMaximosConfig.activo && !estaDentroDelRango() && (
            <p className="text-sm text-red-600 mb-2">
              Esta fecha está fuera del rango permitido. Por favor, selecciona una fecha anterior.
            </p>
          )}
        </div>
      </Card>

      {!mostrarConfirmacion ? (
        <SelectorHuecos
          fecha={fechaSeleccionada}
          role={role}
          onSeleccionarHueco={handleSeleccionarHueco}
          huecoSeleccionado={huecoSeleccionado}
          entrenadorId={entrenadorId}
        />
      ) : huecoSeleccionado ? (
        <ConfirmacionReserva
          disponibilidad={huecoSeleccionado}
          role={role}
          onConfirmar={handleConfirmar}
          onCancelar={handleCancelar}
          entrenadorId={entrenadorId}
        />
      ) : null}
    </div>
  );
};
