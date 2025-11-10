// Servicio para seguimiento de progreso de participantes en retos largos

import { 
  Evento, 
  Participante, 
  ProgresoParticipanteReto, 
  MetricaProgreso, 
  CheckInReto, 
  LogroReto,
  MetricaRetoConfig,
  MensajeMotivacionReto
} from '../api/events';
import { cargarEventos, guardarEventos } from '../api/events';
import { enviarMensajeGrupal, personalizarMensajeGrupal } from './mensajesGrupalesService';

/**
 * Obtiene el progreso de todos los participantes de un reto
 */
export const obtenerProgresoReto = (evento: Evento): ProgresoParticipanteReto[] => {
  if (evento.tipo !== 'reto' || !evento.participantesDetalle) {
    return [];
  }

  const participantes = evento.participantesDetalle.filter(p => !p.fechaCancelacion);
  const progresos: ProgresoParticipanteReto[] = [];

  participantes.forEach(participante => {
    if (participante.progresoReto) {
      progresos.push(participante.progresoReto);
    } else {
      // Inicializar progreso si no existe
      const progreso = inicializarProgresoParticipante(participante.id, evento);
      progresos.push(progreso);
    }
  });

  return progresos;
};

/**
 * Inicializa el progreso de un participante en un reto
 */
export const inicializarProgresoParticipante = (
  participanteId: string,
  evento: Evento
): ProgresoParticipanteReto => {
  const diasTotales = evento.duracionDias || 30;
  const metricasConfiguradas = evento.metricasRetoConfiguradas || [];
  
  const metricas: MetricaProgreso[] = metricasConfiguradas.map(config => ({
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
};

/**
 * Actualiza el progreso de un participante
 */
export const actualizarProgresoParticipante = async (
  evento: Evento,
  participanteId: string,
  metricasActualizadas: Record<string, number | boolean | string>,
  notas?: string
): Promise<{ success: boolean; mensaje: string; progreso?: ProgresoParticipanteReto }> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const eventos = cargarEventos();
  const eventoIndex = eventos.findIndex(e => e.id === evento.id);
  
  if (eventoIndex === -1) {
    return { success: false, mensaje: 'Evento no encontrado' };
  }

  const eventoActualizado = eventos[eventoIndex];
  const participanteIndex = eventoActualizado.participantesDetalle?.findIndex(p => p.id === participanteId);

  if (participanteIndex === undefined || participanteIndex === -1) {
    return { success: false, mensaje: 'Participante no encontrado' };
  }

  const participante = eventoActualizado.participantesDetalle![participanteIndex];
  
  // Inicializar progreso si no existe
  if (!participante.progresoReto) {
    participante.progresoReto = inicializarProgresoParticipante(participanteId, eventoActualizado);
  }

  const progreso = participante.progresoReto;

  // Actualizar métricas
  Object.keys(metricasActualizadas).forEach(metricaId => {
    const metrica = progreso.metricas.find(m => m.id === metricaId);
    if (metrica) {
      const valorAnterior = metrica.valor;
      metrica.valor = metricasActualizadas[metricaId];
      metrica.fechaActualizacion = new Date();
      
      // Agregar al historial
      if (!metrica.historial) {
        metrica.historial = [];
      }
      metrica.historial.push({
        fecha: new Date(),
        valor: valorAnterior,
        notas: notas,
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
  const checkIn: CheckInReto = {
    id: `checkin-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    fecha: new Date(),
    metricas: metricasActualizadas,
    notas: notas,
    completado: true,
  };

  progreso.checkIns.push(checkIn);
  progreso.ultimoCheckIn = new Date();

  // Calcular días completados (días únicos con check-ins)
  const diasUnicos = new Set(progreso.checkIns.map(c => {
    const fecha = new Date(c.fecha);
    return `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
  }));
  progreso.diasCompletados = diasUnicos.size;
  progreso.porcentajeCompletado = progreso.diasTotales > 0
    ? Math.round((progreso.diasCompletados / progreso.diasTotales) * 100)
    : 0;

  // Verificar logros
  verificarLogros(progreso, eventoActualizado);

  // Actualizar puntos (1 punto por día completado)
  progreso.puntos = progreso.diasCompletados;

  // Guardar cambios
  eventoActualizado.participantesDetalle![participanteIndex] = participante;
  eventos[eventoIndex] = eventoActualizado;
  guardarEventos(eventos);

  return { success: true, mensaje: 'Progreso actualizado exitosamente', progreso };
};

/**
 * Verifica y otorga logros al participante
 */
const verificarLogros = (progreso: ProgresoParticipanteReto, evento: Evento): void => {
  const logrosExistentes = progreso.logros.map(l => l.id);

  // Logro: Primer día completado
  if (progreso.diasCompletados === 1 && !logrosExistentes.includes('primer-dia')) {
    progreso.logros.push({
      id: 'primer-dia',
      nombre: 'Primer Paso',
      descripcion: 'Completaste tu primer día del reto',
      fechaObtencion: new Date(),
      tipo: 'dia',
      icono: '🎯',
    });
  }

  // Logro: 7 días consecutivos
  if (progreso.diasCompletados >= 7 && !logrosExistentes.includes('semana-completa')) {
    progreso.logros.push({
      id: 'semana-completa',
      nombre: 'Una Semana',
      descripcion: 'Completaste 7 días del reto',
      fechaObtencion: new Date(),
      tipo: 'consistencia',
      icono: '🔥',
    });
  }

  // Logro: 50% completado
  if (progreso.porcentajeCompletado >= 50 && !logrosExistentes.includes('mitad-camino')) {
    progreso.logros.push({
      id: 'mitad-camino',
      nombre: 'Mitad del Camino',
      descripcion: 'Has completado la mitad del reto',
      fechaObtencion: new Date(),
      tipo: 'especial',
      icono: '⭐',
    });
  }

  // Logro: Objetivo cumplido
  progreso.metricas.forEach(metrica => {
    if (metrica.cumplido && !logrosExistentes.includes(`objetivo-${metrica.id}`)) {
      progreso.logros.push({
        id: `objetivo-${metrica.id}`,
        nombre: `Objetivo: ${metrica.nombre}`,
        descripcion: `Cumpliste el objetivo de ${metrica.nombre}`,
        fechaObtencion: new Date(),
        tipo: 'metrica',
        icono: '🎉',
      });
    }
  });
};

/**
 * Calcula el ranking de participantes en un reto
 */
export const calcularRankingReto = (evento: Evento): ProgresoParticipanteReto[] => {
  const progresos = obtenerProgresoReto(evento);
  
  // Ordenar por puntos (descendente), luego por porcentaje completado
  progresos.sort((a, b) => {
    if ((b.puntos || 0) !== (a.puntos || 0)) {
      return (b.puntos || 0) - (a.puntos || 0);
    }
    return b.porcentajeCompletado - a.porcentajeCompletado;
  });

  // Asignar posiciones
  progresos.forEach((progreso, index) => {
    progreso.posicionRanking = index + 1;
  });

  return progresos;
};

/**
 * Obtiene estadísticas del reto
 */
export const obtenerEstadisticasReto = (evento: Evento): {
  totalParticipantes: number;
  participantesActivos: number;
  promedioProgreso: number;
  promedioDiasCompletados: number;
  participantesCompletados: number;
  participantesEnProgreso: number;
  participantesInactivos: number;
} => {
  const progresos = obtenerProgresoReto(evento);
  
  if (progresos.length === 0) {
    return {
      totalParticipantes: 0,
      participantesActivos: 0,
      promedioProgreso: 0,
      promedioDiasCompletados: 0,
      participantesCompletados: 0,
      participantesEnProgreso: 0,
      participantesInactivos: 0,
    };
  }

  const participantesActivos = progresos.filter(p => p.checkIns.length > 0).length;
  const promedioProgreso = progresos.reduce((sum, p) => sum + p.porcentajeCompletado, 0) / progresos.length;
  const promedioDiasCompletados = progresos.reduce((sum, p) => sum + p.diasCompletados, 0) / progresos.length;
  const participantesCompletados = progresos.filter(p => p.porcentajeCompletado >= 100).length;
  const participantesEnProgreso = progresos.filter(p => p.porcentajeCompletado > 0 && p.porcentajeCompletado < 100).length;
  const participantesInactivos = progresos.filter(p => p.checkIns.length === 0).length;

  return {
    totalParticipantes: progresos.length,
    participantesActivos,
    promedioProgreso: Math.round(promedioProgreso * 10) / 10,
    promedioDiasCompletados: Math.round(promedioDiasCompletados * 10) / 10,
    participantesCompletados,
    participantesEnProgreso,
    participantesInactivos,
  };
};

/**
 * Envía un mensaje de motivación a un participante o grupo
 */
export const enviarMensajeMotivacion = async (
  evento: Evento,
  mensaje: string,
  tipo: 'logro' | 'motivacion' | 'recordatorio' | 'apoyo',
  canal: 'email' | 'whatsapp' | 'ambos',
  participanteId?: string,
  enviadoPor: string = 'sistema',
  variablesAdicionales?: Record<string, string>
): Promise<MensajeMotivacionReto> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const mensajeMotivacion: MensajeMotivacionReto = {
    id: `msg-mot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    eventoId: evento.id,
    participanteId,
    mensaje,
    tipo,
    fechaEnvio: new Date(),
    canal,
    enviadoPor,
    leido: false,
  };

  // Si es mensaje individual, enviarlo al participante
  if (participanteId) {
    const participante = evento.participantesDetalle?.find(p => p.id === participanteId);
    if (participante) {
      const mensajePersonalizado = personalizarMensajeGrupal(
        mensaje,
        evento,
        participante,
        {
          ...variablesAdicionales,
          progreso: participante.progresoReto?.porcentajeCompletado.toString() || '0',
          diasCompletados: participante.progresoReto?.diasCompletados.toString() || '0',
          posicionRanking: participante.progresoReto?.posicionRanking?.toString() || 'N/A',
        }
      );

      console.log('[ProgresoRetosService] Enviando mensaje de motivación:', {
        participante: participante.nombre,
        tipo,
        canal,
        mensaje: mensajePersonalizado.substring(0, 100) + '...',
      });
    }
  } else {
    // Mensaje grupal a todos los participantes
    await enviarMensajeGrupal(
      evento,
      mensaje,
      canal,
      enviadoPor,
      'Sistema',
      undefined,
      'Mensaje de Motivación',
      variablesAdicionales
    );
  }

  // Guardar mensaje en el evento
  const eventos = cargarEventos();
  const eventoIndex = eventos.findIndex(e => e.id === evento.id);
  if (eventoIndex !== -1) {
    if (!eventos[eventoIndex].mensajesMotivacionEnviados) {
      eventos[eventoIndex].mensajesMotivacionEnviados = [];
    }
    eventos[eventoIndex].mensajesMotivacionEnviados!.push(mensajeMotivacion);
    guardarEventos(eventos);
  }

  return mensajeMotivacion;
};

/**
 * Obtiene mensajes de motivación enviados para un reto
 */
export const obtenerMensajesMotivacion = (evento: Evento): MensajeMotivacionReto[] => {
  return evento.mensajesMotivacionEnviados || [];
};

/**
 * Configura las métricas para un reto
 */
export const configurarMetricasReto = async (
  evento: Evento,
  metricas: MetricaRetoConfig[]
): Promise<{ success: boolean; mensaje: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const eventos = cargarEventos();
  const eventoIndex = eventos.findIndex(e => e.id === evento.id);
  
  if (eventoIndex === -1) {
    return { success: false, mensaje: 'Evento no encontrado' };
  }

  eventos[eventoIndex].metricasRetoConfiguradas = metricas;
  guardarEventos(eventos);

  return { success: true, mensaje: 'Métricas configuradas exitosamente' };
};


