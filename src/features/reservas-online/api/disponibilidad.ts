import { Disponibilidad, Reserva } from '../types';
import { getHorarioSemanal, getHorariosDisponiblesDia, estaDisponibleEnHorario } from './schedules';
import { esFechaNoDisponible } from './fechasNoDisponibles';
import { getDuracionesSesion } from './duracionesSesion';
import { getReservas } from './reservas';
import { getConfiguracionBufferTime } from './configuracionBufferTime';
import { getConfiguracionTiempoMinimoAnticipacion } from './configuracionTiempoMinimoAnticipacion';
import { getConfiguracionDiasMaximosReserva } from './configuracionDiasMaximosReserva';

export const getDisponibilidad = async (
  fecha: Date,
  role: 'entrenador' | 'gimnasio',
  entrenadorId?: string
): Promise<Disponibilidad[]> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const disponibilidad: Disponibilidad[] = [];
      
      if (role === 'entrenador' && entrenadorId) {
        // Verificar si la fecha está marcada como no disponible
        const fechaNoDisponible = await esFechaNoDisponible(fecha, entrenadorId);
        if (fechaNoDisponible) {
          // Si la fecha está marcada como no disponible, no generar slots
          resolve(disponibilidad);
          return;
        }

        // Verificar si la fecha excede el límite de días máximos configurado
        const configDiasMaximos = await getConfiguracionDiasMaximosReserva(entrenadorId);
        if (configDiasMaximos.activo) {
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          const fechaMaxima = new Date(hoy);
          fechaMaxima.setDate(fechaMaxima.getDate() + (configDiasMaximos.diasMaximos ?? configDiasMaximos.maxDiasEnFuturo ?? 30));
          
          const fechaNormalizada = new Date(fecha);
          fechaNormalizada.setHours(0, 0, 0, 0);
          
          if (fechaNormalizada > fechaMaxima) {
            // Si la fecha excede el límite de días máximos, no generar slots
            resolve(disponibilidad);
            return;
          }
        }

        // Obtener duraciones de sesión configuradas
        const duracionesSesion = await getDuracionesSesion(entrenadorId);
        const duracionesActivas = duracionesSesion
          .filter(d => d.activo)
          .sort((a, b) => a.orden - b.orden);

        // Si no hay duraciones configuradas, usar duración por defecto de 60 minutos
        if (duracionesActivas.length === 0) {
          duracionesActivas.push({
            id: 'default-60',
            entrenadorId,
            duracionMinutos: 60,
            nombre: '1 hora',
            activo: true,
            orden: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        // Obtener reservas existentes para esta fecha
        const fechaInicio = new Date(fecha);
        fechaInicio.setHours(0, 0, 0, 0);
        const fechaFin = new Date(fecha);
        fechaFin.setHours(23, 59, 59, 999);
        
        const reservasExistentes = await getReservas(fechaInicio, fechaFin, 'entrenador');
        // Filtrar solo las reservas de este entrenador (en producción, la API debería filtrar por entrenadorId)
        const reservasDelEntrenador = reservasExistentes.filter(r => 
          r.tipo === 'sesion-1-1' || r.tipo === 'fisio' || r.tipo === 'nutricion' || r.tipo === 'masaje'
        );

        // Obtener configuraciones
        const configBufferTime = await getConfiguracionBufferTime(entrenadorId);
        const configTiempoMinimo = await getConfiguracionTiempoMinimoAnticipacion(entrenadorId);

        // Obtener horario semanal del entrenador
        const horarioSemanal = await getHorarioSemanal(entrenadorId);
        
        // Calcular la fecha/hora mínima permitida para reservas
        const ahora = new Date();
        const minutosMinimos = configTiempoMinimo.activo 
          ? (configTiempoMinimo.minutosMinimos ?? (configTiempoMinimo.horasMinimasAnticipacion ?? 0) * 60)
          : 0;
        const fechaHoraMinima = new Date(ahora.getTime() + minutosMinimos * 60 * 1000);
        
        if (horarioSemanal && horarioSemanal.activo) {
          // Obtener bloques horarios disponibles para este día
          const bloquesDisponibles = getHorariosDisponiblesDia(horarioSemanal, fecha);
          
          // Generar slots de disponibilidad basados en los bloques configurados y duraciones
          bloquesDisponibles.forEach((bloque, bloqueIndex) => {
            const bloqueInicioMinutos = convertirHoraAMinutos(bloque.horaInicio);
            const bloqueFinMinutos = convertirHoraAMinutos(bloque.horaFin);

            // Para cada duración configurada, generar slots
            duracionesActivas.forEach((duracion, duracionIndex) => {
              let horaActualMinutos = bloqueInicioMinutos;

              while (horaActualMinutos + duracion.duracionMinutos <= bloqueFinMinutos) {
                const horaInicio = minutosAHora(horaActualMinutos);
                const horaFin = minutosAHora(horaActualMinutos + duracion.duracionMinutos);

                // Verificar que el slot esté disponible según el horario
                if (estaDisponibleEnHorario(horarioSemanal, fecha, horaInicio, horaFin)) {
                  // Verificar que no se solape con reservas existentes (incluyendo buffer time)
                  const disponible = !seSolapaConReserva(
                    fecha, 
                    horaInicio, 
                    horaFin, 
                    reservasDelEntrenador,
                    {
                      activo: configBufferTime.activo ?? false,
                      minutosAntes: configBufferTime.minutosAntes ?? 0,
                      minutosDespues: configBufferTime.minutosDespues ?? configBufferTime.minutosBuffer ?? 0,
                      minutosBuffer: configBufferTime.minutosDespues ?? configBufferTime.minutosBuffer ?? 0, // Alias para compatibilidad
                    }
                  );
                  
                  // Verificar tiempo mínimo de anticipación
                  const cumpleTiempoMinimo = cumpleConTiempoMinimoAnticipacion(
                    fecha,
                    horaInicio,
                    fechaHoraMinima
                  );
                  
                  if (disponible && cumpleTiempoMinimo) {
                    disponibilidad.push({
                      id: `disp-${bloqueIndex}-${duracionIndex}-${horaActualMinutos}`,
                      fecha,
                      horaInicio,
                      horaFin,
                      disponible: true,
                      tipo: 'sesion-1-1',
                      duracionMinutos: duracion.duracionMinutos,
                    });
                  }
                }

                // Avanzar en incrementos de la duración para evitar solapamientos
                horaActualMinutos += duracion.duracionMinutos;
              }
            });
          });
        } else {
          // Si no hay horario configurado, usar horario por defecto (9:00-18:00)
          const duracionPorDefecto = duracionesActivas[0] || {
            duracionMinutos: 60,
            nombre: '1 hora',
          };

          const horasInicio = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
          let configBufferTime;
          let fechaHoraMinima = new Date();

          try {
            configBufferTime = await getConfiguracionBufferTime(entrenadorId);
            const configTiempoMinimo = await getConfiguracionTiempoMinimoAnticipacion(entrenadorId);
            const ahora = new Date();
            const minutosMinimos = configTiempoMinimo.activo 
              ? (configTiempoMinimo.minutosMinimos ?? (configTiempoMinimo.horasMinimasAnticipacion ?? 0) * 60)
              : 0;
            fechaHoraMinima = new Date(ahora.getTime() + minutosMinimos * 60 * 1000);
          } catch {
            // Si no hay entrenadorId, usar configuración por defecto (sin buffer, sin tiempo mínimo)
            configBufferTime = { activo: false, minutosBuffer: 0, minutosDespues: 0, minutosAntes: 0 };
          }

          for (const [index, hora] of horasInicio.entries()) {
            const horaInicioMinutos = convertirHoraAMinutos(hora);
            const horaFinMinutos = horaInicioMinutos + duracionPorDefecto.duracionMinutos;
            const horaFin = minutosAHora(horaFinMinutos);

            // Solo agregar si no excede las 18:00
            if (horaFinMinutos <= convertirHoraAMinutos('18:00')) {
              // Verificar que no se solape con reservas existentes (incluyendo buffer time)
              const disponible = !seSolapaConReserva(
                fecha,
                hora,
                horaFin,
                reservasDelEntrenador,
                {
                  activo: configBufferTime.activo ?? false,
                  minutosAntes: configBufferTime.minutosAntes ?? 0,
                  minutosDespues: configBufferTime.minutosDespues ?? configBufferTime.minutosBuffer ?? 0,
                  minutosBuffer: configBufferTime.minutosDespues ?? configBufferTime.minutosBuffer ?? 0, // Alias para compatibilidad
                }
              );

              // Verificar tiempo mínimo de anticipación
              const cumpleTiempoMinimo = cumpleConTiempoMinimoAnticipacion(fecha, hora, fechaHoraMinima);

              if (disponible && cumpleTiempoMinimo) {
                disponibilidad.push({
                  id: `disp-${index}`,
                  fecha,
                  horaInicio: hora,
                  horaFin,
                  disponible: true,
                  tipo: 'sesion-1-1',
                  duracionMinutos: duracionPorDefecto.duracionMinutos,
                });
              }
            }
          }
        }
      } else if (role === 'entrenador') {
        // Si no hay entrenadorId, usar horario por defecto
        const horas = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
        horas.forEach((hora, index) => {
          disponibilidad.push({
            id: `disp-${index}`,
            fecha,
            horaInicio: hora,
            horaFin: `${String(parseInt(hora.split(':')[0]) + 1).padStart(2, '0')}:00`,
            disponible: index % 3 !== 0, // Simula algunos horarios ocupados
            tipo: 'sesion-1-1',
            duracionMinutos: 60, // Duración por defecto
          });
        });
      } else {
        // Para gimnasios: horarios de clases grupales (sin cambios)
        const clases = [
          { hora: '10:00', tipo: 'spinning' },
          { hora: '12:00', tipo: 'boxeo' },
          { hora: '14:00', tipo: 'hiit' },
          { hora: '16:00', tipo: 'fisio' },
        ];
        
        clases.forEach((clase, index) => {
          disponibilidad.push({
            id: `disp-${index}`,
            fecha,
            horaInicio: clase.hora,
            horaFin: `${String(parseInt(clase.hora.split(':')[0]) + 1).padStart(2, '0')}:00`,
            disponible: true,
            tipo: 'clase-grupal',
            claseId: `clase-${index}`,
            claseNombre: clase.tipo.charAt(0).toUpperCase() + clase.tipo.slice(1),
            capacidad: 20,
            ocupacion: index === 0 ? 18 : 10,
          });
        });
      }
      
      resolve(disponibilidad);
    }, 300);
  });
};

// Funciones auxiliares para conversión de horas
const convertirHoraAMinutos = (hora: string): number => {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
};

const minutosAHora = (minutos: number): string => {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Verifica si un slot de disponibilidad se solapa con alguna reserva existente
 * Incluye verificación de buffer time si está configurado
 * 
 * @remarks
 * Esta función considera los buffers antes y después de cada reserva.
 * En producción, se optimizaría para manejar múltiples reservas de forma eficiente.
 */
const seSolapaConReserva = (
  slotFecha: Date,
  slotHoraInicio: string,
  slotHoraFin: string,
  reservas: Reserva[],
  configBufferTime?: { activo: boolean; minutosBuffer?: number; minutosAntes?: number; minutosDespues?: number }
): boolean => {
  const slotFechaNormalizada = new Date(slotFecha);
  slotFechaNormalizada.setHours(0, 0, 0, 0);
  
  const slotInicioMinutos = convertirHoraAMinutos(slotHoraInicio);
  const slotFinMinutos = convertirHoraAMinutos(slotHoraFin);

  // Obtener minutos de buffer (usar minutosDespues/minutosAntes si están disponibles, sino usar minutosBuffer)
  const minutosAntes = (configBufferTime?.activo && configBufferTime.minutosAntes) || 0;
  const minutosDespues = (configBufferTime?.activo && configBufferTime.minutosDespues) || 
                        (configBufferTime?.activo && configBufferTime.minutosBuffer) || 0;

  return reservas.some(reserva => {
    // Solo considerar reservas confirmadas o pendientes
    if (reserva.estado !== 'confirmada' && reserva.estado !== 'pendiente') {
      return false;
    }

    // Normalizar fecha de la reserva
    const reservaFechaNormalizada = new Date(reserva.fecha);
    reservaFechaNormalizada.setHours(0, 0, 0, 0);

    // Verificar si es la misma fecha
    if (reservaFechaNormalizada.getTime() !== slotFechaNormalizada.getTime()) {
      return false;
    }

    // Verificar solapamiento de horarios
    const reservaInicioMinutos = convertirHoraAMinutos(reserva.horaInicio);
    const reservaFinMinutos = convertirHoraAMinutos(reserva.horaFin);

    // Si hay buffer time activo, aplicarlo:
    // - Antes de cada reserva (reservaInicioMinutos - minutosAntes)
    // - Después de cada reserva (reservaFinMinutos + minutosDespues)
    // El buffer time crea una zona no disponible alrededor de cada reserva
    if (configBufferTime?.activo && (minutosAntes > 0 || minutosDespues > 0)) {
      // Calcular el rango completo incluyendo buffer: [inicio - bufferAntes, fin + bufferDespues]
      const reservaInicioConBuffer = reservaInicioMinutos - minutosAntes;
      const reservaFinConBuffer = reservaFinMinutos + minutosDespues;
      
      // Verificar si el slot se solapa con el rango completo (reserva + buffer)
      // Hay conflicto si el slot se intersecta con el rango [reservaInicioConBuffer, reservaFinConBuffer]
      // Esto significa que el slot no puede empezar antes de reservaFinConBuffer Y terminar después de reservaInicioConBuffer
      const hayConflicto = !(slotFinMinutos <= reservaInicioConBuffer || slotInicioMinutos >= reservaFinConBuffer);
      
      return hayConflicto;
    }

    // Sin buffer time: hay solapamiento si los intervalos se intersectan
    return !(slotFinMinutos <= reservaInicioMinutos || slotInicioMinutos >= reservaFinMinutos);
  });
};

/**
 * Verifica si un slot cumple con el tiempo mínimo de anticipación
 */
const cumpleConTiempoMinimoAnticipacion = (
  slotFecha: Date,
  slotHoraInicio: string,
  fechaHoraMinima: Date
): boolean => {
  // Si fechaHoraMinima es igual a ahora (sin tiempo mínimo configurado), permitir todos los slots
  const ahora = new Date();
  if (fechaHoraMinima.getTime() === ahora.getTime()) {
    return true;
  }
  
  // Calcular la fecha y hora de inicio del slot
  const fechaHoraSlot = new Date(slotFecha);
  const [horas, minutos] = slotHoraInicio.split(':').map(Number);
  fechaHoraSlot.setHours(horas, minutos, 0, 0);
  
  // El slot debe ser posterior a la fecha/hora mínima
  return fechaHoraSlot.getTime() >= fechaHoraMinima.getTime();
};

export const verificarDisponibilidad = async (
  fecha: Date,
  horaInicio: string,
  tipo: 'sesion-1-1' | 'clase-grupal',
  claseId?: string,
  entrenadorId?: string,
  horaFin?: string
): Promise<boolean> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      // Para entrenadores, verificar contra el horario semanal configurado
      if (tipo === 'sesion-1-1' && entrenadorId && horaFin) {
        const horarioSemanal = await getHorarioSemanal(entrenadorId);
        if (horarioSemanal && horarioSemanal.activo) {
          const disponible = estaDisponibleEnHorario(horarioSemanal, fecha, horaInicio, horaFin);
          resolve(disponible);
          return;
        }
      }
      // Para otros casos, simular verificación
      resolve(true);
    }, 200);
  });
};

/**
 * Parámetros para calcular disponibilidad
 */
export interface ParametrosCalculoDisponibilidad {
  fecha: Date;
  role: 'entrenador' | 'gimnasio';
  entrenadorId?: string;
  centroId?: string;
  tipoSesionId?: string; // Opcional: para filtrar por tipo de sesión
  duracionMinutos?: number; // Opcional: duración específica a buscar
}

/**
 * Calcula la disponibilidad respetando todas las configuraciones y restricciones
 * 
 * @param params - Parámetros para el cálculo de disponibilidad
 * @returns Lista de disponibilidades (slots) disponibles
 * 
 * @remarks
 * Esta función consolida toda la lógica de cálculo de disponibilidad:
 * - Respeta los horarios configurados (schedules)
 * - Aplica buffers entre sesiones
 * - Verifica tiempo mínimo de anticipación
 * - Respeta días máximos en el futuro
 * - Excluye fechas no disponibles
 * - Considera reservas existentes
 * 
 * Esta es una función mock que simplifica el cálculo. En producción, se conectaría
 * con un backend que optimiza el cálculo y maneja múltiples contextos de forma eficiente.
 */
export const calcularDisponibilidad = async (
  params: ParametrosCalculoDisponibilidad
): Promise<Disponibilidad[]> => {
  const { fecha, role, entrenadorId, centroId, tipoSesionId, duracionMinutos } = params;
  
  // Usar la función existente getDisponibilidad como base
  // y aplicar filtros adicionales si es necesario
  const disponibilidad = await getDisponibilidad(fecha, role, entrenadorId);
  
  // Si se especifica un tipoSesionId, filtrar por ese tipo (si la disponibilidad lo soporta)
  // Esto es una simplificación del mock - en producción se consultaría la configuración
  // específica del tipo de sesión
  
  // Si se especifica una duración específica, filtrar slots que coincidan
  if (duracionMinutos) {
    return disponibilidad.filter(d => 
      d.duracionMinutos === duracionMinutos || 
      !d.duracionMinutos // Si no tiene duración definida, incluir
    );
  }
  
  return disponibilidad;
};
