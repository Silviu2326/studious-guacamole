import { TimelineSesiones, EventoTimeline, TipoEventoTimeline, EstadoObjetivo, TipoEntrenamiento, GrupoMuscular } from '../types';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
const MOCK_TIMELINES: Map<string, TimelineSesiones> = new Map();

const initializeMockTimeline = (clienteId: string, clienteNombre: string): TimelineSesiones => {
  const ahora = new Date();
  const eventos: EventoTimeline[] = [];

  // Generar eventos de los últimos 30 días
  for (let i = 0; i < 30; i++) {
    const fecha = new Date(ahora.getTime() - i * 24 * 60 * 60 * 1000);
    const diaSemana = fecha.getDay();

    // Sesiones (3-4 por semana)
    if (diaSemana === 1 || diaSemana === 3 || diaSemana === 5 || (diaSemana === 0 && i % 2 === 0)) {
      // User Story 2: Generar tipos de entrenamiento y grupos musculares aleatorios para las sesiones
      const tiposEntrenamiento: TipoEntrenamiento[] = ['fuerza', 'cardio', 'hiit', 'flexibilidad', 'mixto', 'recuperacion', 'resistencia'];
      const gruposMusculares: GrupoMuscular[] = ['pecho', 'espalda', 'hombros', 'brazos', 'piernas', 'gluteos', 'core', 'full-body'];
      const tipoEntrenamiento = tiposEntrenamiento[Math.floor(Math.random() * tiposEntrenamiento.length)] as TipoEntrenamiento;
      const numGrupos = Math.floor(Math.random() * 3) + 1; // 1-3 grupos musculares
      const gruposSeleccionados: GrupoMuscular[] = [];
      const gruposDisponibles = [...gruposMusculares];
      for (let j = 0; j < numGrupos && gruposDisponibles.length > 0; j++) {
        const idx = Math.floor(Math.random() * gruposDisponibles.length);
        gruposSeleccionados.push(gruposDisponibles[idx]);
        gruposDisponibles.splice(idx, 1);
      }
      
      eventos.push({
        id: `sesion-${clienteId}-${i}`,
        tipo: 'sesion',
        fecha: fecha.toISOString(),
        titulo: `Sesión de ${tipoEntrenamiento}`,
        descripcion: `Sesión de ${tipoEntrenamiento}${gruposSeleccionados.length > 0 ? ` enfocada en ${gruposSeleccionados.join(', ')}` : ''}`,
        clienteId,
        clienteNombre,
        metadata: {
          sesionId: `ses-${i}`,
          duracionMinutos: 60 + Math.floor(Math.random() * 30),
          ejerciciosCompletados: 6 + Math.floor(Math.random() * 4),
          ejerciciosTotales: 8,
          programaId: 'prog-1',
          programaNombre: 'Programa de Fuerza',
          // User Story 2: Agregar tipo de entrenamiento y grupos musculares
          tipoEntrenamiento,
          gruposMusculares: gruposSeleccionados,
        },
      });

      // Feedback post-sesión (70% de las sesiones)
      if (Math.random() > 0.3) {
        eventos.push({
          id: `feedback-${clienteId}-${i}`,
          tipo: 'feedback',
          fecha: new Date(fecha.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas después
          titulo: 'Feedback post-sesión',
          descripcion: 'El cliente ha proporcionado feedback sobre la sesión',
          clienteId,
          clienteNombre,
          metadata: {
            puntuacion: 7 + Math.floor(Math.random() * 3),
            comentarios: [
              'Excelente sesión, me sentí muy bien',
              'Un poco cansado al final, pero bien',
              'Perfecto, justo el nivel adecuado',
              'Me costó un poco más de lo normal',
            ][Math.floor(Math.random() * 4)],
            tipoFeedback: 'post-sesion',
          },
        });
      }
    }

    // Check-ins (diarios, pero solo algunos días)
    if (i % 2 === 0 && Math.random() > 0.3) {
      eventos.push({
        id: `checkin-${clienteId}-${i}`,
        tipo: 'checkin',
        fecha: fecha.toISOString(),
        titulo: 'Check-in de entrenamiento',
        descripcion: 'Check-in diario completado',
        clienteId,
        clienteNombre,
        metadata: {
          checkInId: `ci-${i}`,
          tipoCheckIn: 'entreno',
        },
      });
    }

    // Resultados (semanalmente)
    if (i % 7 === 0 && i > 0) {
      eventos.push({
        id: `resultado-${clienteId}-${i}`,
        tipo: 'resultado',
        fecha: fecha.toISOString(),
        titulo: 'Actualización de progreso',
        descripcion: 'Nuevos resultados registrados',
        clienteId,
        clienteNombre,
        metadata: {
          metrica: ['Peso', 'Grasa corporal', 'Fuerza máxima', 'Resistencia'][Math.floor(Math.random() * 4)],
          valorAnterior: 70 + Math.random() * 10,
          valorActual: 70 + Math.random() * 10,
          unidad: ['kg', '%', 'kg', 'min'][Math.floor(Math.random() * 4)],
        },
      });
    }

    // Objetivos (ocasionalmente)
    if (i % 10 === 0 && i > 0) {
      eventos.push({
        id: `objetivo-${clienteId}-${i}`,
        tipo: 'objetivo',
        fecha: fecha.toISOString(),
        titulo: 'Actualización de objetivo',
        descripcion: 'Progreso en objetivo registrado',
        clienteId,
        clienteNombre,
        metadata: {
          objetivoId: `obj-${i}`,
          estadoObjetivo: ['in_progress', 'achieved', 'at_risk'][Math.floor(Math.random() * 3)] as EstadoObjetivo,
        },
      });
    }
  }

  // Ordenar eventos por fecha (más recientes primero)
  eventos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // Calcular resumen
  const sesiones = eventos.filter(e => e.tipo === 'sesion');
  const feedbacks = eventos.filter(e => e.tipo === 'feedback');
  const sesionesCompletadas = sesiones.length;
  const promedioFeedback = feedbacks.length > 0
    ? feedbacks.reduce((sum, f) => sum + (f.metadata?.puntuacion || 0), 0) / feedbacks.length
    : 0;

  // Detectar patrones
  const patronesDetectados = [];
  
  // Patrón de adherencia
  const ultimasSesiones = sesiones.slice(0, 7);
  if (ultimasSesiones.length < 3) {
    patronesDetectados.push({
      tipo: 'adherencia' as const,
      descripcion: 'Baja adherencia detectada en las últimas semanas',
      severidad: 'alta' as const,
    });
  }

  // Patrón de fatiga
  const feedbacksRecientes = feedbacks.slice(0, 5);
  const promedioReciente = feedbacksRecientes.length > 0
    ? feedbacksRecientes.reduce((sum, f) => sum + (f.metadata?.puntuacion || 0), 0) / feedbacksRecientes.length
    : 0;
  
  if (promedioReciente < 6 && feedbacksRecientes.length >= 3) {
    patronesDetectados.push({
      tipo: 'fatiga' as const,
      descripcion: 'Posible fatiga acumulada detectada por feedbacks bajos',
      severidad: 'media' as const,
    });
  }

  return {
    clienteId,
    clienteNombre,
    eventos,
    resumen: {
      totalSesiones: sesiones.length,
      sesionesCompletadas,
      sesionesPendientes: Math.max(0, 12 - sesionesCompletadas), // Asumiendo 12 sesiones programadas
      promedioAdherencia: (sesionesCompletadas / 12) * 100,
      promedioFeedback,
      ultimaSesion: sesiones[0]?.fecha,
      patronesDetectados,
    },
    ultimaActualizacion: ahora.toISOString(),
  };
};

/**
 * Obtiene el timeline de sesiones, feedback y resultados para un cliente
 */
export const getTimelineSesiones = async (clienteId: string): Promise<TimelineSesiones | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Obtener nombre del cliente (mock)
  const clientes: Record<string, string> = {
    '1': 'Carla',
    '2': 'Miguel',
    '3': 'Ana',
  };

  const clienteNombre = clientes[clienteId] || 'Cliente';

  if (!MOCK_TIMELINES.has(clienteId)) {
    MOCK_TIMELINES.set(clienteId, initializeMockTimeline(clienteId, clienteNombre));
  }

  return MOCK_TIMELINES.get(clienteId) || null;
};

/**
 * Obtiene los eventos del timeline filtrados por tipo
 */
export const getEventosPorTipo = async (
  clienteId: string,
  tipo: TipoEventoTimeline
): Promise<EventoTimeline[]> => {
  const timeline = await getTimelineSesiones(clienteId);
  if (!timeline) return [];
  
  return timeline.eventos.filter(e => e.tipo === tipo);
};

