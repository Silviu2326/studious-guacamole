import {
  HabitPanelData,
  HabitPoints,
  Habit,
  HabitCompletion,
  ClientBadge,
  Badge,
  HabitStreak,
  PREDEFINED_BADGES,
} from '../types/habits';

// Mock data storage (en producción esto vendría de una base de datos)
const MOCK_HABIT_POINTS: Map<string, HabitPoints> = new Map();
const MOCK_CLIENT_BADGES: Map<string, ClientBadge[]> = new Map();
const MOCK_HABITS: Map<string, Habit[]> = new Map();
const MOCK_COMPLETIONS: Map<string, HabitCompletion[]> = new Map();
const MOCK_STREAKS: Map<string, HabitStreak> = new Map();

// Inicializar datos mock para un cliente
const initializeMockData = (clienteId: string) => {
  if (!MOCK_HABIT_POINTS.has(clienteId)) {
    MOCK_HABIT_POINTS.set(clienteId, {
      clienteId,
      puntosTotales: 250,
      puntosSemanaActual: 45,
      puntosMesActual: 180,
      nivel: 3,
      proximoNivel: 500,
      progresoNivel: 50,
      historial: [
        { fecha: new Date().toISOString().split('T')[0], puntos: 10, motivo: 'Sesión completada' },
        { fecha: new Date(Date.now() - 86400000).toISOString().split('T')[0], puntos: 10, motivo: 'Sesión completada' },
        { fecha: new Date(Date.now() - 172800000).toISOString().split('T')[0], puntos: 15, motivo: 'Rutina semanal completada' },
      ],
    });
  }

  if (!MOCK_CLIENT_BADGES.has(clienteId)) {
    MOCK_CLIENT_BADGES.set(clienteId, [
      {
        id: 'cb1',
        badgeId: 'badge-primera-sesion',
        clienteId,
        fechaObtenido: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        id: 'cb2',
        badgeId: 'badge-semana-completa',
        clienteId,
        fechaObtenido: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        id: 'cb3',
        badgeId: 'badge-100-puntos',
        clienteId,
        fechaObtenido: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    ]);
  }

  if (!MOCK_HABITS.has(clienteId)) {
    MOCK_HABITS.set(clienteId, [
      {
        id: 'h1',
        clienteId,
        nombre: 'Rutina Semanal',
        descripcion: 'Completa 4 sesiones por semana',
        tipo: 'rutina-semanal',
        objetivo: 4,
        unidad: 'sesiones',
        activo: true,
        fechaCreacion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0],
      },
      {
        id: 'h2',
        clienteId,
        nombre: 'Constancia Diaria',
        descripcion: 'Entrena al menos 5 días a la semana',
        tipo: 'consistencia',
        objetivo: 5,
        unidad: 'dias',
        activo: true,
        fechaCreacion: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0],
      },
    ]);
  }

  if (!MOCK_COMPLETIONS.has(clienteId)) {
    MOCK_COMPLETIONS.set(clienteId, []);
  }

  if (!MOCK_STREAKS.has(clienteId)) {
    MOCK_STREAKS.set(clienteId, {
      clienteId,
      rachaActual: 5,
      rachaMaxima: 12,
      tipoRacha: 'diaria',
      fechaInicioRacha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  }
};

/**
 * Obtiene el panel completo de hábitos para un cliente
 */
export const getHabitPanel = async (clienteId: string): Promise<HabitPanelData> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  initializeMockData(clienteId);

  const habitPoints = MOCK_HABIT_POINTS.get(clienteId)!;
  const clientBadges = MOCK_CLIENT_BADGES.get(clienteId)! || [];
  const habits = MOCK_HABITS.get(clienteId)! || [];
  const completions = MOCK_COMPLETIONS.get(clienteId)! || [];
  const streak = MOCK_STREAKS.get(clienteId)!;

  // Obtener información completa de los badges
  const badgesWithInfo = clientBadges.map(cb => {
    const badge = PREDEFINED_BADGES.find(b => b.id === cb.badgeId);
    return {
      ...cb,
      badge: badge || PREDEFINED_BADGES[0],
    };
  });

  // Calcular estadísticas
  const ahora = new Date();
  const inicioSemana = new Date(ahora);
  inicioSemana.setDate(ahora.getDate() - ahora.getDay());

  const sesionesEstaSemana = completions.filter(c => {
    const fecha = new Date(c.fecha);
    return fecha >= inicioSemana && c.completado;
  }).length;

  const estadisticas = {
    sesionesEstaSemana,
    sesionesObjetivoSemana: 4,
    diasConsecutivos: streak.rachaActual,
    semanasConsecutivas: Math.floor(streak.rachaActual / 7),
    mejorRacha: streak.rachaMaxima,
  };

  return {
    habitPoints,
    badges: badgesWithInfo,
    habitos: habits,
    completions,
    streaks: [streak],
    estadisticas,
  };
};

/**
 * Registra la finalización de un hábito y otorga puntos
 */
export const completeHabit = async (
  clienteId: string,
  habitId: string,
  completado: boolean = true,
  notas?: string
): Promise<HabitCompletion> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  initializeMockData(clienteId);

  const habitPoints = MOCK_HABIT_POINTS.get(clienteId)!;
  const habit = MOCK_HABITS.get(clienteId)?.find(h => h.id === habitId);

  if (!habit) {
    throw new Error('Hábito no encontrado');
  }

  // Calcular puntos según el tipo de hábito
  let puntos = 10; // Puntos base
  if (habit.tipo === 'rutina-semanal' && completado) {
    puntos = 15;
  } else if (habit.tipo === 'consistencia' && completado) {
    puntos = 20;
  }

  const completion: HabitCompletion = {
    id: `comp-${Date.now()}`,
    habitId,
    clienteId,
    fecha: new Date().toISOString().split('T')[0],
    completado,
    puntos: completado ? puntos : 0,
    notas,
  };

  // Agregar completion
  const completions = MOCK_COMPLETIONS.get(clienteId)!;
  completions.push(completion);
  MOCK_COMPLETIONS.set(clienteId, completions);

  // Actualizar puntos
  habitPoints.puntosTotales += completion.puntos;
  habitPoints.puntosSemanaActual += completion.puntos;
  habitPoints.puntosMesActual += completion.puntos;

  // Actualizar historial
  habitPoints.historial.unshift({
    fecha: completion.fecha,
    puntos: completion.puntos,
    motivo: `Hábito: ${habit.nombre}`,
  });

  // Actualizar nivel
  const niveles = [0, 100, 250, 500, 1000, 2500, 5000];
  const nivelActual = niveles.findIndex(n => habitPoints.puntosTotales < n) - 1;
  if (nivelActual > habitPoints.nivel) {
    habitPoints.nivel = nivelActual;
  }
  habitPoints.proximoNivel = niveles[habitPoints.nivel + 1] || niveles[niveles.length - 1];
  habitPoints.progresoNivel = (habitPoints.puntosTotales / habitPoints.proximoNivel) * 100;

  // Verificar y otorgar badges
  await checkAndAwardBadges(clienteId, habitPoints);

  // Actualizar racha
  await updateStreak(clienteId, completado);

  return completion;
};

/**
 * Verifica y otorga badges según los logros del cliente
 */
const checkAndAwardBadges = async (clienteId: string, habitPoints: HabitPoints): Promise<void> => {
  const clientBadges = MOCK_CLIENT_BADGES.get(clienteId)! || [];
  const streak = MOCK_STREAKS.get(clienteId)!;

  for (const badge of PREDEFINED_BADGES) {
    // Verificar si el cliente ya tiene este badge
    if (clientBadges.some(cb => cb.badgeId === badge.id)) {
      continue;
    }

    let shouldAward = false;

    switch (badge.requisitos.tipo) {
      case 'puntos-totales':
        shouldAward = habitPoints.puntosTotales >= badge.requisitos.valor;
        break;
      case 'dias-consecutivos':
        shouldAward = streak.rachaActual >= badge.requisitos.valor;
        break;
      case 'semanas-consecutivas':
        shouldAward = Math.floor(streak.rachaActual / 7) >= badge.requisitos.valor;
        break;
      case 'sesiones-completadas':
        const completions = MOCK_COMPLETIONS.get(clienteId)! || [];
        const sesionesCompletadas = completions.filter(c => c.completado).length;
        shouldAward = sesionesCompletadas >= badge.requisitos.valor;
        break;
    }

    if (shouldAward) {
      const newBadge: ClientBadge = {
        id: `cb-${Date.now()}-${badge.id}`,
        badgeId: badge.id,
        clienteId,
        fechaObtenido: new Date().toISOString().split('T')[0],
      };
      clientBadges.push(newBadge);
      MOCK_CLIENT_BADGES.set(clienteId, clientBadges);
    }
  }
};

/**
 * Actualiza la racha del cliente
 */
const updateStreak = async (clienteId: string, completado: boolean): Promise<void> => {
  const streak = MOCK_STREAKS.get(clienteId)!;

  if (completado) {
    const hoy = new Date().toISOString().split('T')[0];
    const ultimaFecha = new Date(streak.fechaInicioRacha);
    const diasDiferencia = Math.floor(
      (new Date(hoy).getTime() - ultimaFecha.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diasDiferencia === 1) {
      // Continuar la racha
      streak.rachaActual += 1;
    } else if (diasDiferencia > 1) {
      // Reiniciar la racha
      streak.rachaActual = 1;
      streak.fechaInicioRacha = hoy;
    }
    // Si diasDiferencia === 0, ya se registró hoy, no hacer nada

    if (streak.rachaActual > streak.rachaMaxima) {
      streak.rachaMaxima = streak.rachaActual;
    }
  } else {
    // Si no se completó, mantener la racha pero no incrementarla
    // La racha se romperá si no hay actividad al día siguiente
  }

  MOCK_STREAKS.set(clienteId, streak);
};

/**
 * Obtiene los puntos y nivel del cliente
 */
export const getHabitPoints = async (clienteId: string): Promise<HabitPoints> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  initializeMockData(clienteId);
  return MOCK_HABIT_POINTS.get(clienteId)!;
};

/**
 * Obtiene los badges del cliente
 */
export const getClientBadges = async (clienteId: string): Promise<Array<ClientBadge & { badge: Badge }>> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  initializeMockData(clienteId);
  const clientBadges = MOCK_CLIENT_BADGES.get(clienteId)! || [];

  return clientBadges.map(cb => {
    const badge = PREDEFINED_BADGES.find(b => b.id === cb.badgeId);
    return {
      ...cb,
      badge: badge || PREDEFINED_BADGES[0],
    };
  });
};

/**
 * Crea un nuevo hábito para un cliente
 */
export const createHabit = async (habit: Omit<Habit, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<Habit> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const newHabit: Habit = {
    ...habit,
    id: `h-${Date.now()}`,
    fechaCreacion: new Date().toISOString().split('T')[0],
    fechaActualizacion: new Date().toISOString().split('T')[0],
  };

  const habits = MOCK_HABITS.get(habit.clienteId) || [];
  habits.push(newHabit);
  MOCK_HABITS.set(habit.clienteId, habits);

  return newHabit;
};

/**
 * Obtiene todos los badges disponibles
 */
export const getAllBadges = async (): Promise<Badge[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return PREDEFINED_BADGES;
};

