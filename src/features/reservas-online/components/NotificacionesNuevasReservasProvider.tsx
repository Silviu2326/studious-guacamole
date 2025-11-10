import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNotificacionesNuevasReservas } from '../hooks/useNotificacionesNuevasReservas';
import { NotificacionNuevaReservaToast } from './NotificacionNuevaReservaToast';

/**
 * Provider de notificaciones de nuevas reservas
 * Se encarga de escuchar nuevas reservas y mostrarlas como notificaciones toast
 */
export const NotificacionesNuevasReservasProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';

  const { nuevaReserva, limpiarNuevaReserva, notificaciones, marcarComoLeida } = useNotificacionesNuevasReservas({
    entrenadorId: esEntrenador ? user?.id : undefined,
    intervaloVerificacion: 10000, // Verificar cada 10 segundos
    autoMarcarComoLeida: false, // No marcar automáticamente, dejar que el usuario la cierre
  });

  const handleCerrarNotificacion = () => {
    if (nuevaReserva && esEntrenador && user?.id) {
      // Buscar la notificación correspondiente a esta reserva y marcarla como leída
      const notificacion = notificaciones.find(n => n.reservaId === nuevaReserva.id && !n.leida);
      if (notificacion) {
        marcarComoLeida(notificacion.id);
      }
    }
    limpiarNuevaReserva();
  };

  return (
    <>
      {children}
      {/* Mostrar notificación toast cuando hay una nueva reserva */}
      {esEntrenador && nuevaReserva && (
        <NotificacionNuevaReservaToast
          reserva={nuevaReserva}
          onCerrar={handleCerrarNotificacion}
          duracion={8000}
        />
      )}
    </>
  );
};

