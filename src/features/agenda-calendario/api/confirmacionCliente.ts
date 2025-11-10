import {
  Cita,
  EstadoConfirmacionCliente,
  SolicitudReprogramacion,
  EstadisticasConfirmacionCliente,
} from '../types';
import { actualizarCita } from './calendario';
import { notificarSlotLiberado } from './listaEspera';

// Confirmar asistencia del cliente
export const confirmarAsistenciaCliente = async (
  citaId: string,
  clienteId: string
): Promise<Cita> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        // En producción, esto haría una llamada real al backend
        const citaActualizada = await actualizarCita(
          citaId,
          {
            confirmacionCliente: 'confirmada' as EstadoConfirmacionCliente,
            fechaConfirmacionCliente: new Date(),
          },
          undefined
        );

        // Notificar al entrenador (mock)
        await notificarEntrenadorConfirmacion(citaId, clienteId, 'confirmada');

        resolve(citaActualizada);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// Cancelar asistencia del cliente
export const cancelarAsistenciaCliente = async (
  citaId: string,
  clienteId: string,
  motivo?: string
): Promise<Cita> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        // En producción, esto haría una llamada real al backend
        const citaActualizada = await actualizarCita(
          citaId,
          {
            confirmacionCliente: 'cancelada' as EstadoConfirmacionCliente,
            fechaConfirmacionCliente: new Date(),
            estado: 'cancelada',
            motivoCancelacion: 'cliente',
            motivoCancelacionDetalle: motivo || 'Cancelado por el cliente',
          },
          undefined
        );

        // Notificar al entrenador (mock)
        await notificarEntrenadorConfirmacion(citaId, clienteId, 'cancelada', motivo);

        // Notificar a clientes en lista de espera si hay entrenadorId
        // Para entrenadores personales, el instructorId debería ser el entrenadorId
        if (citaActualizada.instructorId || citaActualizada.clienteId) {
          try {
            // En producción, necesitaríamos obtener el entrenadorId de la cita
            // Por ahora, asumimos que el instructorId es el entrenadorId para sesiones 1:1
            const entrenadorId = citaActualizada.instructorId || 'entrenador1'; // Mock
            await notificarSlotLiberado(citaActualizada, entrenadorId);
          } catch (error) {
            // No fallar la cancelación si hay error en la notificación de lista de espera
            console.error('Error notificando lista de espera:', error);
          }
        }

        resolve(citaActualizada);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// Solicitar reprogramación
export const solicitarReprogramacion = async (
  citaId: string,
  clienteId: string,
  motivo?: string,
  fechaPreferida?: Date,
  horaPreferida?: string
): Promise<SolicitudReprogramacion> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const solicitud: SolicitudReprogramacion = {
          id: `solicitud-${Date.now()}`,
          citaId,
          clienteId,
          fechaSolicitud: new Date(),
          motivo,
          fechaPreferida,
          horaPreferida,
          estado: 'pendiente',
        };

        // Actualizar cita con solicitud de reprogramación
        await actualizarCita(
          citaId,
          {
            confirmacionCliente: 'reprogramacion-solicitada' as EstadoConfirmacionCliente,
            solicitudReprogramacion: solicitud,
          },
          undefined
        );

        // Notificar al entrenador (mock)
        await notificarEntrenadorReprogramacion(solicitud);

        resolve(solicitud);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// Obtener estadísticas de confirmación por cliente
export const getEstadisticasConfirmacionCliente = async (
  clienteId: string
): Promise<EstadisticasConfirmacionCliente> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      // Mock data
      const estadisticas: EstadisticasConfirmacionCliente = {
        clienteId,
        clienteNombre: 'Cliente Ejemplo',
        totalSesiones: 20,
        sesionesConfirmadas: 15,
        sesionesCanceladas: 3,
        sesionesPendientes: 2,
        tasaConfirmacion: 75,
        ultimaConfirmacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        ultimaCancelacion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      };
      resolve(estadisticas);
    }, 300);
  });
};

// Obtener todas las estadísticas de confirmación
export const getTodasEstadisticasConfirmacion = async (): Promise<
  EstadisticasConfirmacionCliente[]
> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      // Mock data
      const estadisticas: EstadisticasConfirmacionCliente[] = [
        {
          clienteId: '1',
          clienteNombre: 'Juan Pérez',
          totalSesiones: 20,
          sesionesConfirmadas: 18,
          sesionesCanceladas: 1,
          sesionesPendientes: 1,
          tasaConfirmacion: 90,
          ultimaConfirmacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          clienteId: '2',
          clienteNombre: 'María García',
          totalSesiones: 15,
          sesionesConfirmadas: 12,
          sesionesCanceladas: 2,
          sesionesPendientes: 1,
          tasaConfirmacion: 80,
          ultimaConfirmacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          clienteId: '3',
          clienteNombre: 'Carlos Ruiz',
          totalSesiones: 25,
          sesionesConfirmadas: 20,
          sesionesCanceladas: 3,
          sesionesPendientes: 2,
          tasaConfirmacion: 80,
          ultimaConfirmacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      ];
      resolve(estadisticas);
    }, 300);
  });
};

// Aprobar solicitud de reprogramación
export const aprobarReprogramacion = async (
  solicitudId: string,
  citaId: string,
  nuevaFecha: Date,
  respuestaEntrenador?: string
): Promise<Cita> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        // En producción, esto haría una llamada real al backend
        const citaActualizada = await actualizarCita(
          citaId,
          {
            fechaInicio: nuevaFecha,
            confirmacionCliente: 'confirmada' as EstadoConfirmacionCliente,
          },
          undefined
        );

        resolve(citaActualizada);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// Rechazar solicitud de reprogramación
export const rechazarReprogramacion = async (
  solicitudId: string,
  citaId: string,
  respuestaEntrenador: string
): Promise<Cita> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        // En producción, esto haría una llamada real al backend
        // Aquí se podría mantener la cita en su fecha original o cancelarla
        const citaActualizada = await actualizarCita(
          citaId,
          {
            confirmacionCliente: 'cancelada' as EstadoConfirmacionCliente,
          },
          undefined
        );

        resolve(citaActualizada);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// Funciones auxiliares para notificaciones (mock)
const notificarEntrenadorConfirmacion = async (
  citaId: string,
  clienteId: string,
  estado: 'confirmada' | 'cancelada',
  motivo?: string
): Promise<void> => {
  console.log(`[confirmacionCliente] Notificación al entrenador: Cliente ${clienteId} ${estado} la cita ${citaId}`, motivo ? `Motivo: ${motivo}` : '');
  // En producción, esto enviaría una notificación real al entrenador
};

const notificarEntrenadorReprogramacion = async (
  solicitud: SolicitudReprogramacion
): Promise<void> => {
  console.log(`[confirmacionCliente] Notificación al entrenador: Solicitud de reprogramación para cita ${solicitud.citaId}`);
  // En producción, esto enviaría una notificación real al entrenador
};

