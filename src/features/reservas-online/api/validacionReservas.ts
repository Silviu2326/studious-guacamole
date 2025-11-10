import { getConfiguracionTiempoMinimoAnticipacion } from './configuracionTiempoMinimoAnticipacion';

/**
 * Valida si una reserva cumple con el tiempo mínimo de anticipación requerido
 * @param fecha - Fecha de la reserva
 * @param horaInicio - Hora de inicio de la reserva (formato HH:mm)
 * @param entrenadorId - ID del entrenador
 * @returns Objeto con `valido` (boolean) y `mensaje` (string) si no es válido
 */
export const validarTiempoMinimoAnticipacion = async (
  fecha: Date,
  horaInicio: string,
  entrenadorId: string
): Promise<{ valido: boolean; mensaje?: string }> => {
  try {
    // Obtener configuración de tiempo mínimo de anticipación
    const config = await getConfiguracionTiempoMinimoAnticipacion(entrenadorId);
    
    // Si la configuración no está activa, la reserva es válida
    if (!config.activo) {
      return { valido: true };
    }
    
    // Calcular la fecha y hora de inicio de la reserva
    const fechaHoraReserva = new Date(fecha);
    const [horas, minutos] = horaInicio.split(':').map(Number);
    fechaHoraReserva.setHours(horas, minutos, 0, 0);
    
    // Obtener la fecha y hora actual
    const ahora = new Date();
    
    // Calcular la diferencia en milisegundos
    const diferenciaMs = fechaHoraReserva.getTime() - ahora.getTime();
    
    // Convertir a horas
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);
    
    // Verificar si cumple con el tiempo mínimo requerido
    if (diferenciaHoras < config.horasMinimasAnticipacion) {
      const horasRestantes = config.horasMinimasAnticipacion - diferenciaHoras;
      const mensaje = `Las reservas deben realizarse con al menos ${config.horasMinimasAnticipacion} hora${config.horasMinimasAnticipacion !== 1 ? 's' : ''} de anticipación. Faltan ${Math.ceil(horasRestantes)} hora${Math.ceil(horasRestantes) !== 1 ? 's' : ''}.`;
      return { valido: false, mensaje };
    }
    
    return { valido: true };
  } catch (error) {
    console.error('Error validando tiempo mínimo de anticipación:', error);
    // En caso de error, permitir la reserva (no bloquear por error de configuración)
    return { valido: true };
  }
};


