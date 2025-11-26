import { useState, useEffect, useCallback } from 'react';
import {
  getNotificacionesNuevasReservas,
  getNumeroNotificacionesNoLeidas,
  marcarNotificacionComoLeida,
  verificarNuevasReservas,
  NotificacionNuevaReserva,
} from '../api/notificacionesNuevasReservas';
import { Reserva } from '../types';

interface UseNotificacionesNuevasReservasOptions {
  entrenadorId?: string;
  intervaloVerificacion?: number; // En milisegundos, por defecto 30 segundos
  autoMarcarComoLeida?: boolean; // Si se deben marcar automáticamente como leídas después de mostrarse
  tiempoMostrarNotificacion?: number; // Tiempo en ms antes de marcar como leída (si autoMarcarComoLeida es true)
}

export interface UseNotificacionesNuevasReservasReturn {
  notificaciones: NotificacionNuevaReserva[];
  numeroNoLeidas: number;
  nuevaReserva: Reserva | null;
  cargando: boolean;
  marcarComoLeida: (notificacionId: string) => Promise<void>;
  limpiarNuevaReserva: () => void;
}

export const useNotificacionesNuevasReservas = (
  options: UseNotificacionesNuevasReservasOptions = {}
): UseNotificacionesNuevasReservasReturn => {
  const {
    entrenadorId,
    intervaloVerificacion = 30000, // 30 segundos por defecto
    autoMarcarComoLeida = false,
    tiempoMostrarNotificacion = 5000, // 5 segundos por defecto
  } = options;

  const [notificaciones, setNotificaciones] = useState<NotificacionNuevaReserva[]>([]);
  const [numeroNoLeidas, setNumeroNoLeidas] = useState(0);
  const [nuevaReserva, setNuevaReserva] = useState<Reserva | null>(null);
  const [cargando, setCargando] = useState(true);
  const [ultimaReservaId, setUltimaReservaId] = useState<string | undefined>();

  const cargarNotificaciones = useCallback(async () => {
    if (!entrenadorId) {
      setCargando(false);
      return;
    }

    try {
      const [notifs, numero] = await Promise.all([
        getNotificacionesNuevasReservas(entrenadorId, { noLeidas: false, limite: 10 }),
        getNumeroNotificacionesNoLeidas(entrenadorId),
      ]);

      setNotificaciones(notifs);
      setNumeroNoLeidas(numero);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setCargando(false);
    }
  }, [entrenadorId]);

  const verificarNuevas = useCallback(async () => {
    if (!entrenadorId) return;

    try {
      const resultado = await verificarNuevasReservas(entrenadorId, ultimaReservaId);

      if (resultado.hayNuevas && resultado.nuevaReserva) {
        // Solo establecer nueva reserva si es diferente a la actual
        setNuevaReserva(prev => {
          if (prev?.id === resultado.nuevaReserva?.id) {
            return prev; // Ya está mostrando esta reserva
          }
          return resultado.nuevaReserva || null;
        });
        
        if (resultado.nuevaReserva) {
          setUltimaReservaId(resultado.nuevaReserva.id);
        }

        // Recargar notificaciones
        await cargarNotificaciones();

        // Si autoMarcarComoLeida está activado, marcar después de un tiempo
        if (autoMarcarComoLeida && resultado.nuevaReserva) {
          setTimeout(async () => {
            const notifs = await getNotificacionesNuevasReservas(entrenadorId, { noLeidas: true, limite: 10 });
            const notif = notifs.find(n => n.reservaId === resultado.nuevaReserva?.id);
            if (notif) {
              await marcarNotificacionComoLeida(notif.id, entrenadorId);
              await cargarNotificaciones();
            }
          }, tiempoMostrarNotificacion);
        }
      }
    } catch (error) {
      console.error('Error verificando nuevas reservas:', error);
    }
  }, [entrenadorId, ultimaReservaId, autoMarcarComoLeida, tiempoMostrarNotificacion, cargarNotificaciones]);

  const marcarComoLeida = useCallback(
    async (notificacionId: string) => {
      if (!entrenadorId) return;

      try {
        await marcarNotificacionComoLeida(notificacionId, entrenadorId);
        await cargarNotificaciones();
      } catch (error) {
        console.error('Error marcando notificación como leída:', error);
      }
    },
    [entrenadorId, cargarNotificaciones]
  );

  const limpiarNuevaReserva = useCallback(() => {
    setNuevaReserva(null);
  }, []);

  // Cargar notificaciones iniciales
  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  // Verificar nuevas reservas periódicamente
  useEffect(() => {
    if (!entrenadorId) return;

    // Verificación inicial
    verificarNuevas();

    // Configurar intervalo de verificación
    const intervalo = setInterval(verificarNuevas, intervaloVerificacion);

    return () => clearInterval(intervalo);
  }, [entrenadorId, intervaloVerificacion, verificarNuevas]);

  return {
    notificaciones,
    numeroNoLeidas,
    nuevaReserva,
    cargando,
    marcarComoLeida,
    limpiarNuevaReserva,
  };
};

