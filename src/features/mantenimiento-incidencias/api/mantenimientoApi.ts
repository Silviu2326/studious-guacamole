// API para mantenimiento e incidencias

import { 
  Incidencia, 
  TareaMantenimiento, 
  Checklist, 
  Reparacion, 
  AlertaMantenimiento,
  EstadisticasMantenimiento,
  Equipamiento
} from '../types';

const API_BASE = '/api/operaciones';

// Simulación de datos - En producción esto se conectaría al backend real
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockEquipamiento: Equipamiento[] = [
  {
    id: '1',
    nombre: 'Cinta de Correr 1',
    tipo: 'Cardio',
    ubicacion: 'Sala Principal',
    estado: 'operativo',
    fechaInstalacion: '2023-01-15',
    ultimoMantenimiento: '2024-11-01',
    proximoMantenimiento: '2024-12-01',
    modelo: 'TR-500',
    marca: 'TechFitness'
  },
  {
    id: '2',
    nombre: 'Máquina de Pesas Multifunción',
    tipo: 'Fuerza',
    ubicacion: 'Sala de Pesas',
    estado: 'fuera_de_servicio',
    fechaInstalacion: '2022-06-20',
    ultimoMantenimiento: '2024-09-15',
    modelo: 'MP-200',
    marca: 'StrongGym'
  },
  {
    id: '3',
    nombre: 'Bicicleta Elíptica 3',
    tipo: 'Cardio',
    ubicacion: 'Sala Principal',
    estado: 'mantenimiento',
    fechaInstalacion: '2023-03-10',
    ultimoMantenimiento: '2024-10-15',
    proximoMantenimiento: '2024-12-15',
    modelo: 'BE-300',
    marca: 'CardioPro'
  }
];

const mockIncidencias: Incidencia[] = [
  {
    id: '1',
    titulo: 'Cinta de correr con ruido anormal',
    descripcion: 'La cinta emite un sonido metálico constante durante el uso',
    equipamientoId: '1',
    tipo: 'general',
    prioridad: 'media',
    estado: 'pendiente',
    fechaReporte: '2024-11-20'
  },
  {
    id: '2',
    titulo: 'Máquina de pesas completamente rota',
    descripcion: 'El mecanismo de resistencia no funciona, equipo fuera de servicio',
    equipamientoId: '2',
    tipo: 'general',
    prioridad: 'critica',
    estado: 'en_proceso',
    tecnicoAsignado: 'tech-1',
    tecnicoNombre: 'Juan Pérez',
    fechaReporte: '2024-11-18'
  }
];

export const mantenimientoApi = {
  // Mantenimiento
  obtenerMantenimientos: async (filtros?: {
    estado?: string;
    tipo?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<TareaMantenimiento[]> => {
    await delay(500);
    return [];
  },

  crearMantenimiento: async (mantenimiento: Partial<TareaMantenimiento>): Promise<TareaMantenimiento> => {
    await delay(500);
    return {
      id: Date.now().toString(),
      titulo: mantenimiento.titulo || '',
      descripcion: mantenimiento.descripcion || '',
      equipamientoId: mantenimiento.equipamientoId || '',
      tipo: mantenimiento.tipo || 'preventivo',
      fechaProgramada: mantenimiento.fechaProgramada || new Date().toISOString(),
      estado: 'programado'
    };
  },

  actualizarMantenimiento: async (id: string, datos: Partial<TareaMantenimiento>): Promise<TareaMantenimiento> => {
    await delay(500);
    throw new Error('No implementado');
  },

  // Incidencias
  obtenerIncidencias: async (filtros?: {
    estado?: string;
    prioridad?: string;
    tipo?: string;
  }): Promise<Incidencia[]> => {
    await delay(500);
    return mockIncidencias.map(inc => ({
      ...inc,
      equipamiento: mockEquipamiento.find(eq => eq.id === inc.equipamientoId)
    }));
  },

  crearIncidencia: async (incidencia: Partial<Incidencia>): Promise<Incidencia> => {
    await delay(500);
    return {
      id: Date.now().toString(),
      titulo: incidencia.titulo || '',
      descripcion: incidencia.descripcion || '',
      equipamientoId: incidencia.equipamientoId || '',
      tipo: incidencia.tipo || 'general',
      prioridad: incidencia.prioridad || 'media',
      estado: 'pendiente',
      fechaReporte: new Date().toISOString(),
      equipamiento: mockEquipamiento.find(eq => eq.id === incidencia.equipamientoId)
    };
  },

  actualizarIncidencia: async (id: string, datos: Partial<Incidencia>): Promise<Incidencia> => {
    await delay(500);
    throw new Error('No implementado');
  },

  // Checklists
  obtenerChecklists: async (): Promise<Checklist[]> => {
    await delay(500);
    return [];
  },

  obtenerChecklistPorTipo: async (tipoEquipamiento: string, frecuencia: string): Promise<Checklist | null> => {
    await delay(500);
    return null;
  },

  // Reparaciones
  obtenerReparaciones: async (): Promise<Reparacion[]> => {
    await delay(500);
    return [];
  },

  crearReparacion: async (reparacion: Partial<Reparacion>): Promise<Reparacion> => {
    await delay(500);
    throw new Error('No implementado');
  },

  // Equipamiento
  obtenerEquipamiento: async (): Promise<Equipamiento[]> => {
    await delay(500);
    return mockEquipamiento;
  },

  obtenerEquipamientoPorId: async (id: string): Promise<Equipamiento | null> => {
    await delay(500);
    return mockEquipamiento.find(eq => eq.id === id) || null;
  },

  // Alertas
  obtenerAlertas: async (filtros?: { resuelta?: boolean }): Promise<AlertaMantenimiento[]> => {
    await delay(500);
    return [];
  },

  marcarAlertaResuelta: async (id: string): Promise<void> => {
    await delay(500);
  },

  // Estadísticas
  obtenerEstadisticas: async (): Promise<EstadisticasMantenimiento> => {
    await delay(500);
    return {
      totalEquipamiento: 3,
      equipamientoOperativo: 1,
      equipamientoFueraServicio: 1,
      incidenciasPendientes: 2,
      incidenciasCriticas: 1,
      mantenimientosProgramados: 5,
      mantenimientosAtrasados: 0,
      reparacionesEnCurso: 1,
      costoTotalMes: 1500000,
      alertasPendientes: 3
    };
  }
};

