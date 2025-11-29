/**
 * Servicio mock para seguimiento de progreso de retos
 * 
 * Este servicio soporta la parte de dashboards de retos y seguimiento de progreso.
 * Proporciona funciones para obtener progreso de retos, actualizar métricas y obtener rankings.
 */

import { ChallengeProgress, ParticipantRanking } from '../types';
import { cargarEventos, guardarEventos, Evento, Participante, ProgresoParticipanteReto } from '../api/events';

/**
 * Datos para actualizar métricas de un reto
 */
export interface DatosMetricasReto {
  participanteId?: string; // Si se proporciona, actualiza métricas de un participante específico
  metricas?: Record<string, number | boolean | string>; // Métricas a actualizar
  notas?: string; // Notas adicionales
}

/**
 * Obtiene el progreso de un reto
 * 
 * @param eventId - ID del evento (reto)
 * @returns Progreso del reto con estadísticas agregadas
 */
export const obtenerProgresoReto = async (
  eventId: string
): Promise<ChallengeProgress> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // Cargar eventos
    const eventos = cargarEventos();
    const evento = eventos.find(e => e.id === eventId);

    if (!evento) {
      throw new Error(`Evento con ID ${eventId} no encontrado`);
    }

    if (evento.tipo !== 'reto') {
      throw new Error(`El evento ${eventId} no es un reto`);
    }

    // Obtener participantes activos (no cancelados)
    const participantesActivos = evento.participantesDetalle?.filter(
      p => !p.fechaCancelacion && p.confirmado
    ) || [];

    // Calcular progreso agregado
    let porcentajeCompletadoMedio = 0;
    const rankingParticipantes: ParticipantRanking[] = [];

    participantesActivos.forEach((participante, index) => {
      const progreso = participante.progresoReto;

      if (progreso) {
        porcentajeCompletadoMedio += progreso.porcentajeCompletado;

        // Agregar al ranking
        rankingParticipantes.push({
          participanteId: participante.id,
          nombre: participante.nombre,
          puntos: progreso.puntos || 0,
          porcentajeCompletado: progreso.porcentajeCompletado,
          posicion: progreso.posicionRanking || index + 1,
          avatar: participante.foto,
        });
      }
    });

    // Calcular promedio
    if (participantesActivos.length > 0) {
      porcentajeCompletadoMedio = Math.round(
        porcentajeCompletadoMedio / participantesActivos.length
      );
    }

    // Ordenar ranking por puntos y porcentaje
    rankingParticipantes.sort((a, b) => {
      if (b.puntos !== a.puntos) {
        return b.puntos - a.puntos;
      }
      return b.porcentajeCompletado - a.porcentajeCompletado;
    });

    // Actualizar posiciones
    rankingParticipantes.forEach((entry, index) => {
      entry.posicion = index + 1;
    });

    const progreso: ChallengeProgress = {
      challengeId: eventId,
      participantesActivos: participantesActivos.length,
      porcentajeCompletadoMedio,
      rankingParticipantes,
      fechaUltimaActualizacion: new Date(),
    };

    console.log(`[ProgresoRetosService] Progreso obtenido para reto ${eventId}:`, {
      participantesActivos: progreso.participantesActivos,
      porcentajeMedio: progreso.porcentajeCompletadoMedio,
    });

    return progreso;
  } catch (error) {
    console.error('Error obteniendo progreso de reto:', error);
    throw error;
  }
};

/**
 * Actualiza las métricas de un reto
 * 
 * @param eventId - ID del evento (reto)
 * @param datosNuevos - Datos de métricas a actualizar
 * @returns Resultado de la actualización
 */
export const actualizarMetricasReto = async (
  eventId: string,
  datosNuevos: DatosMetricasReto
): Promise<{
  success: boolean;
  progreso?: ProgresoParticipanteReto;
  error?: string;
}> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));

  try {
    // Cargar eventos
    const eventos = cargarEventos();
    const eventoIndex = eventos.findIndex(e => e.id === eventId);

    if (eventoIndex === -1) {
      return {
        success: false,
        error: `Evento con ID ${eventId} no encontrado`,
      };
    }

    const evento = eventos[eventoIndex];

    if (evento.tipo !== 'reto') {
      return {
        success: false,
        error: `El evento ${eventId} no es un reto`,
      };
    }

    // Si se especifica un participante, actualizar sus métricas
    if (datosNuevos.participanteId) {
      const participanteIndex = evento.participantesDetalle?.findIndex(
        p => p.id === datosNuevos.participanteId
      );

      if (participanteIndex === undefined || participanteIndex === -1) {
        return {
          success: false,
          error: `Participante con ID ${datosNuevos.participanteId} no encontrado`,
        };
      }

      const participante = evento.participantesDetalle![participanteIndex];

      // Inicializar progreso si no existe
      if (!participante.progresoReto) {
        participante.progresoReto = inicializarProgresoParticipante(
          participante.id,
          evento
        );
      }

      const progreso = participante.progresoReto;

      // Actualizar métricas si se proporcionan
      if (datosNuevos.metricas) {
        Object.keys(datosNuevos.metricas).forEach(metricaId => {
          const metrica = progreso.metricas.find(m => m.id === metricaId);
          if (metrica) {
            const valorAnterior = metrica.valor;
            metrica.valor = datosNuevos.metricas![metricaId];
            metrica.fechaActualizacion = new Date();

            // Agregar al historial
            if (!metrica.historial) {
              metrica.historial = [];
            }
            metrica.historial.push({
              fecha: new Date(),
              valor: valorAnterior,
              notas: datosNuevos.notas,
            });

            // Verificar si se cumplió el objetivo
            if (metrica.objetivo !== undefined) {
              if (metrica.tipo === 'numero' || metrica.tipo === 'porcentaje') {
                metrica.cumplido = Number(metrica.valor) >= Number(metrica.objetivo);
              } else if (metrica.tipo === 'boolean') {
                metrica.cumplido = metrica.valor === true;
              }
            }
          }
        });

        // Crear check-in
        const checkIn = {
          id: `checkin-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          fecha: new Date(),
          metricas: datosNuevos.metricas,
          notas: datosNuevos.notas,
          completado: true,
        };

        progreso.checkIns.push(checkIn);
        progreso.ultimoCheckIn = new Date();

        // Calcular días completados (días únicos con check-ins)
        const diasUnicos = new Set(
          progreso.checkIns.map(c => {
            const fecha = new Date(c.fecha);
            return `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
          })
        );
        progreso.diasCompletados = diasUnicos.size;
        progreso.porcentajeCompletado = progreso.diasTotales > 0
          ? Math.round((progreso.diasCompletados / progreso.diasTotales) * 100)
          : 0;

        // Actualizar puntos (1 punto por día completado)
        progreso.puntos = progreso.diasCompletados;
      }

      // Guardar cambios
      evento.participantesDetalle![participanteIndex] = participante;
      eventos[eventoIndex] = evento;
      guardarEventos(eventos);

      console.log(`[ProgresoRetosService] Métricas actualizadas para participante ${datosNuevos.participanteId} en reto ${eventId}`);

      return {
        success: true,
        progreso,
      };
    }

    // Si no se especifica participante, retornar error
    return {
      success: false,
      error: 'Se debe especificar un participanteId para actualizar métricas',
    };
  } catch (error) {
    console.error('Error actualizando métricas de reto:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al actualizar métricas',
    };
  }
};

/**
 * Obtiene el ranking de participantes de un reto ordenado por progreso
 * 
 * @param eventId - ID del evento (reto)
 * @returns Ranking de participantes ordenado por progreso
 */
export const obtenerRankingReto = async (
  eventId: string
): Promise<ParticipantRanking[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // Obtener progreso del reto (que incluye el ranking)
    const progreso = await obtenerProgresoReto(eventId);

    console.log(`[ProgresoRetosService] Ranking obtenido para reto ${eventId}: ${progreso.rankingParticipantes.length} participantes`);

    return progreso.rankingParticipantes;
  } catch (error) {
    console.error('Error obteniendo ranking de reto:', error);
    throw error;
  }
};

/**
 * Calcula el ranking de participantes de un reto (versión síncrona)
 * 
 * @param evento - El evento (reto)
 * @returns Array de progresos ordenados por ranking
 */
export const calcularRankingReto = (evento: Evento): ProgresoParticipanteReto[] => {
  if (evento.tipo !== 'reto') {
    return [];
  }

  const participantesActivos = evento.participantesDetalle?.filter(
    p => !p.fechaCancelacion && p.confirmado && p.progresoReto
  ) || [];

  const progresos = participantesActivos
    .map(p => p.progresoReto!)
    .sort((a, b) => {
      // Ordenar por puntos primero, luego por porcentaje
      if (b.puntos !== a.puntos) {
        return (b.puntos || 0) - (a.puntos || 0);
      }
      return b.porcentajeCompletado - a.porcentajeCompletado;
    });

  // Actualizar posiciones
  progresos.forEach((progreso, index) => {
    progreso.posicionRanking = index + 1;
  });

  return progresos;
};

/**
 * Obtiene estadísticas agregadas de un reto
 * 
 * @param evento - El evento (reto)
 * @returns Estadísticas del reto
 */
export const obtenerEstadisticasReto = (evento: Evento): {
  totalParticipantes: number;
  participantesActivos: number;
  participantesCompletados: number;
  participantesEnProgreso: number;
  promedioProgreso: number;
  promedioDiasCompletados: number;
} => {
  if (evento.tipo !== 'reto') {
    return {
      totalParticipantes: 0,
      participantesActivos: 0,
      participantesCompletados: 0,
      participantesEnProgreso: 0,
      promedioProgreso: 0,
      promedioDiasCompletados: 0,
    };
  }

  const participantes = evento.participantesDetalle || [];
  const participantesActivos = participantes.filter(p => !p.fechaCancelacion && p.confirmado);
  const participantesConProgreso = participantesActivos.filter(p => p.progresoReto);

  let sumaProgreso = 0;
  let sumaDias = 0;
  let completados = 0;

  participantesConProgreso.forEach(p => {
    const progreso = p.progresoReto!;
    sumaProgreso += progreso.porcentajeCompletado;
    sumaDias += progreso.diasCompletados;
    if (progreso.porcentajeCompletado >= 100) {
      completados++;
    }
  });

  const totalConProgreso = participantesConProgreso.length;
  const promedioProgreso = totalConProgreso > 0
    ? Math.round((sumaProgreso / totalConProgreso) * 10) / 10
    : 0;
  const promedioDias = totalConProgreso > 0
    ? Math.round((sumaDias / totalConProgreso) * 10) / 10
    : 0;

  return {
    totalParticipantes: participantes.length,
    participantesActivos: participantesActivos.length,
    participantesCompletados: completados,
    participantesEnProgreso: totalConProgreso - completados,
    promedioProgreso,
    promedioDiasCompletados: promedioDias,
  };
};

/**
 * Envía un mensaje de motivación a participantes de un reto
 * 
 * @param evento - El evento (reto)
 * @param mensaje - Texto del mensaje
 * @param tipo - Tipo de mensaje
 * @param canal - Canal de envío
 * @param participanteId - ID del participante (opcional, si es undefined se envía a todos)
 * @param enviadoPor - ID del usuario que envía el mensaje
 * @returns Resultado del envío
 */
export const enviarMensajeMotivacion = async (
  evento: Evento,
  mensaje: string,
  tipo: 'logro' | 'motivacion' | 'recordatorio' | 'apoyo',
  canal: 'email' | 'whatsapp' | 'ambos',
  participanteId?: string,
  enviadoPor?: string
): Promise<{ success: boolean; enviados: number; error?: string }> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    if (evento.tipo !== 'reto') {
      return {
        success: false,
        enviados: 0,
        error: 'El evento no es un reto',
      };
    }

    const participantes = evento.participantesDetalle || [];
    const destinatarios = participanteId
      ? participantes.filter(p => p.id === participanteId)
      : participantes.filter(p => !p.fechaCancelacion && p.confirmado);

    // Simular envío (en producción esto llamaría a un servicio de email/WhatsApp)
    const enviados = destinatarios.length;

    // Guardar mensaje en el historial del evento
    if (!evento.mensajesMotivacionEnviados) {
      evento.mensajesMotivacionEnviados = [];
    }

    // Crear un mensaje por cada destinatario o uno grupal
    if (participanteId) {
      // Mensaje individual
      evento.mensajesMotivacionEnviados.push({
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        eventoId: evento.id,
        participanteId,
        mensaje,
        tipo,
        fechaEnvio: new Date(),
        canal,
        enviadoPor: enviadoPor || 'sistema',
      });
    } else {
      // Mensaje grupal (sin participanteId específico)
      evento.mensajesMotivacionEnviados.push({
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        eventoId: evento.id,
        mensaje,
        tipo,
        fechaEnvio: new Date(),
        canal,
        enviadoPor: enviadoPor || 'sistema',
      });
    }

    // Guardar cambios
    const eventos = cargarEventos();
    const eventoIndex = eventos.findIndex(e => e.id === evento.id);
    if (eventoIndex !== -1) {
      eventos[eventoIndex] = evento;
      guardarEventos(eventos);
    }

    console.log(`[ProgresoRetosService] Mensaje de ${tipo} enviado a ${enviados} participantes del reto ${evento.id}`);

    return {
      success: true,
      enviados,
    };
  } catch (error) {
    console.error('Error enviando mensaje de motivación:', error);
    return {
      success: false,
      enviados: 0,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

/**
 * Configura las métricas de seguimiento de un reto
 * 
 * @param evento - El evento (reto)
 * @param metricas - Array de configuraciones de métricas
 * @returns Resultado de la configuración
 */
export const configurarMetricasReto = async (
  evento: Evento,
  metricas: Array<{
    id: string;
    nombre: string;
    tipo: 'numero' | 'porcentaje' | 'boolean' | 'texto';
    unidad?: string;
    objetivo?: number | string;
    requerida: boolean;
  }>
): Promise<{ success: boolean; error?: string }> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    if (evento.tipo !== 'reto') {
      return {
        success: false,
        error: 'El evento no es un reto',
      };
    }

    // Actualizar métricas configuradas
    evento.metricasRetoConfiguradas = metricas.map(m => ({
      id: m.id,
      nombre: m.nombre,
      tipo: m.tipo,
      unidad: m.unidad,
      objetivo: m.objetivo,
      requerida: m.requerida,
      orden: 0, // Se puede mejorar para mantener orden
    }));

    // Inicializar métricas para participantes existentes
    const participantes = evento.participantesDetalle || [];
    participantes.forEach(participante => {
      if (!participante.progresoReto) {
        participante.progresoReto = inicializarProgresoParticipante(participante.id, evento);
      } else {
        // Actualizar métricas existentes o agregar nuevas
        metricas.forEach(metricaConfig => {
          const metricaExistente = participante.progresoReto!.metricas.find(m => m.id === metricaConfig.id);
          if (!metricaExistente) {
            participante.progresoReto!.metricas.push({
              id: metricaConfig.id,
              nombre: metricaConfig.nombre,
              tipo: metricaConfig.tipo,
              valor: metricaConfig.tipo === 'numero' ? 0 : metricaConfig.tipo === 'boolean' ? false : metricaConfig.tipo === 'porcentaje' ? 0 : '',
              unidad: metricaConfig.unidad,
              fechaActualizacion: new Date(),
              historial: [],
              objetivo: metricaConfig.objetivo,
              cumplido: false,
            });
          } else {
            // Actualizar configuración de métrica existente
            metricaExistente.nombre = metricaConfig.nombre;
            metricaExistente.unidad = metricaConfig.unidad;
            metricaExistente.objetivo = metricaConfig.objetivo;
          }
        });
      }
    });

    // Guardar cambios
    const eventos = cargarEventos();
    const eventoIndex = eventos.findIndex(e => e.id === evento.id);
    if (eventoIndex !== -1) {
      eventos[eventoIndex] = evento;
      guardarEventos(eventos);
    }

    console.log(`[ProgresoRetosService] Métricas configuradas para reto ${evento.id}: ${metricas.length} métricas`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error configurando métricas de reto:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

/**
 * Función auxiliar para inicializar progreso de un participante
 */
function inicializarProgresoParticipante(
  participanteId: string,
  evento: Evento
): ProgresoParticipanteReto {
  const diasTotales = evento.duracionDias || 30;
  const metricasConfiguradas = evento.metricasRetoConfiguradas || [];

  const metricas = metricasConfiguradas.map(config => ({
    id: config.id,
    nombre: config.nombre,
    tipo: config.tipo,
    valor: config.tipo === 'numero' ? 0 : config.tipo === 'boolean' ? false : config.tipo === 'porcentaje' ? 0 : '',
    unidad: config.unidad,
    fechaActualizacion: new Date(),
    historial: [],
    objetivo: config.objetivo,
    cumplido: false,
  }));

  return {
    participanteId,
    eventoId: evento.id,
    metricas,
    diasCompletados: 0,
    diasTotales,
    porcentajeCompletado: 0,
    checkIns: [],
    logros: [],
    puntos: 0,
    posicionRanking: undefined,
  };
}
