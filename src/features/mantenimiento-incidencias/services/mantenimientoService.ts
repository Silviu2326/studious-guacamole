// Servicio de mantenimiento e incidencias

import { mantenimientoApi } from '../api/mantenimientoApi';
import {
  Incidencia,
  TareaMantenimiento,
  Checklist,
  Reparacion,
  AlertaMantenimiento,
  EstadisticasMantenimiento,
  Equipamiento
} from '../types';

export class MantenimientoService {
  // Mantenimiento
  static async obtenerMantenimientos(filtros?: {
    estado?: string;
    tipo?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<TareaMantenimiento[]> {
    return mantenimientoApi.obtenerMantenimientos(filtros);
  }

  static async crearMantenimiento(
    mantenimiento: Partial<TareaMantenimiento>
  ): Promise<TareaMantenimiento> {
    return mantenimientoApi.crearMantenimiento(mantenimiento);
  }

  static async actualizarMantenimiento(
    id: string,
    datos: Partial<TareaMantenimiento>
  ): Promise<TareaMantenimiento> {
    return mantenimientoApi.actualizarMantenimiento(id, datos);
  }

  // Incidencias
  static async obtenerIncidencias(filtros?: {
    estado?: string;
    prioridad?: string;
    tipo?: string;
  }): Promise<Incidencia[]> {
    return mantenimientoApi.obtenerIncidencias(filtros);
  }

  static async crearIncidencia(
    incidencia: Partial<Incidencia>
  ): Promise<Incidencia> {
    return mantenimientoApi.crearIncidencia(incidencia);
  }

  static async actualizarIncidencia(
    id: string,
    datos: Partial<Incidencia>
  ): Promise<Incidencia> {
    return mantenimientoApi.actualizarIncidencia(id, datos);
  }

  // Checklists
  static async obtenerChecklists(): Promise<Checklist[]> {
    return mantenimientoApi.obtenerChecklists();
  }

  static async obtenerChecklistPorTipo(
    tipoEquipamiento: string,
    frecuencia: string
  ): Promise<Checklist | null> {
    return mantenimientoApi.obtenerChecklistPorTipo(tipoEquipamiento, frecuencia);
  }

  // Reparaciones
  static async obtenerReparaciones(): Promise<Reparacion[]> {
    return mantenimientoApi.obtenerReparaciones();
  }

  static async crearReparacion(
    reparacion: Partial<Reparacion>
  ): Promise<Reparacion> {
    return mantenimientoApi.crearReparacion(reparacion);
  }

  // Equipamiento
  static async obtenerEquipamiento(): Promise<Equipamiento[]> {
    return mantenimientoApi.obtenerEquipamiento();
  }

  static async obtenerEquipamientoPorId(id: string): Promise<Equipamiento | null> {
    return mantenimientoApi.obtenerEquipamientoPorId(id);
  }

  // Alertas
  static async obtenerAlertas(filtros?: { resuelta?: boolean }): Promise<AlertaMantenimiento[]> {
    return mantenimientoApi.obtenerAlertas(filtros);
  }

  static async marcarAlertaResuelta(id: string): Promise<void> {
    return mantenimientoApi.marcarAlertaResuelta(id);
  }

  // Estadísticas
  static async obtenerEstadisticas(): Promise<EstadisticasMantenimiento> {
    return mantenimientoApi.obtenerEstadisticas();
  }
}

