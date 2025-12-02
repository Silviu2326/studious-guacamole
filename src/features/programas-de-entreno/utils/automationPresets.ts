/**
 * Sistema de presets de automatizaciones
 * User Story: Como coach quiero guardar, versionar y compartir presets de automatizaciones con otros entrenadores,
 * para reutilizar procesos validados por el equipo.
 */

import type {
  PresetAutomatizacion,
  VersionPreset,
  ReglaEncadenada,
  AutomatizacionRecurrente,
} from '../types';
import { obtenerReglasEncadenadas } from './chainedRules';
import { obtenerAutomatizaciones } from './recurringAutomations';

const STORAGE_KEY = 'automation-presets';
const VERSIONS_STORAGE_KEY = 'automation-preset-versions';

/**
 * Obtener todos los presets
 */
export function obtenerPresets(): PresetAutomatizacion[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error cargando presets:', error);
  }
  return [];
}

/**
 * Guardar presets
 */
export function guardarPresets(presets: PresetAutomatizacion[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.warn('Error guardando presets:', error);
  }
}

/**
 * Obtener todas las versiones de presets
 */
export function obtenerVersionesPresets(): VersionPreset[] {
  try {
    const stored = localStorage.getItem(VERSIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error cargando versiones de presets:', error);
  }
  return [];
}

/**
 * Guardar versiones de presets
 */
export function guardarVersionesPresets(versiones: VersionPreset[]): void {
  try {
    localStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify(versiones));
  } catch (error) {
    console.warn('Error guardando versiones de presets:', error);
  }
}

/**
 * Crear un nuevo preset
 */
export function crearPreset(
  preset: Omit<PresetAutomatizacion, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'estadisticas'>
): PresetAutomatizacion {
  const nuevoPreset: PresetAutomatizacion = {
    ...preset,
    id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    estadisticas: {
      vecesUsado: 0,
      vecesCompartido: 0,
    },
  };

  const presets = obtenerPresets();
  presets.push(nuevoPreset);
  guardarPresets(presets);

  return nuevoPreset;
}

/**
 * Actualizar un preset
 */
export function actualizarPreset(
  id: string,
  actualizaciones: Partial<PresetAutomatizacion>
): PresetAutomatizacion | null {
  const presets = obtenerPresets();
  const index = presets.findIndex((p) => p.id === id);

  if (index === -1) return null;

  const presetAnterior = presets[index];
  const nuevaVersion = incrementarVersion(presetAnterior.version);

  // Guardar versión anterior si hay cambios significativos
  if (actualizaciones.reglasEncadenadas || actualizaciones.automatizacionesRecurrentes) {
    guardarVersionPreset(presetAnterior);
  }

  presets[index] = {
    ...presets[index],
    ...actualizaciones,
    version: actualizaciones.version || nuevaVersion,
    fechaActualizacion: new Date().toISOString(),
  };

  guardarPresets(presets);
  return presets[index];
}

/**
 * Eliminar un preset
 */
export function eliminarPreset(id: string): boolean {
  const presets = obtenerPresets();
  const filtrados = presets.filter((p) => p.id !== id);

  if (filtrados.length === presets.length) return false;

  guardarPresets(filtrados);
  return true;
}

/**
 * Incrementar versión (formato semántico: major.minor.patch)
 */
function incrementarVersion(version: string, tipo: 'major' | 'minor' | 'patch' = 'minor'): string {
  const partes = version.split('.').map(Number);
  if (partes.length !== 3) return '1.0.0';

  switch (tipo) {
    case 'major':
      return `${partes[0] + 1}.0.0`;
    case 'minor':
      return `${partes[0]}.${partes[1] + 1}.0`;
    case 'patch':
      return `${partes[0]}.${partes[1]}.${partes[2] + 1}`;
  }
}

/**
 * Guardar una versión de un preset
 */
export function guardarVersionPreset(preset: PresetAutomatizacion): VersionPreset {
  const version: VersionPreset = {
    id: `version-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    presetId: preset.id,
    version: preset.version,
    cambios: `Versión ${preset.version}`,
    fechaCreacion: new Date().toISOString(),
    creadoPor: preset.creadoPor,
    datos: {
      nombre: preset.nombre,
      descripcion: preset.descripcion,
      reglasEncadenadas: preset.reglasEncadenadas,
      automatizacionesRecurrentes: preset.automatizacionesRecurrentes,
      tags: preset.tags,
      categoria: preset.categoria,
      publico: preset.publico,
      compartidoCon: preset.compartidoCon,
      creadoPor: preset.creadoPor,
      creadoPorNombre: preset.creadoPorNombre,
    },
  };

  const versiones = obtenerVersionesPresets();
  versiones.push(version);
  guardarVersionesPresets(versiones);

  return version;
}

/**
 * Obtener versiones de un preset
 */
export function obtenerVersionesPreset(presetId: string): VersionPreset[] {
  const versiones = obtenerVersionesPresets();
  return versiones.filter((v) => v.presetId === presetId).sort((a, b) => {
    // Ordenar por fecha descendente
    return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
  });
}

/**
 * Restaurar una versión anterior de un preset
 */
export function restaurarVersionPreset(
  presetId: string,
  versionId: string,
  usuarioId: string
): PresetAutomatizacion | null {
  const versiones = obtenerVersionesPresets();
  const version = versiones.find((v) => v.id === versionId && v.presetId === presetId);

  if (!version) return null;

  const presets = obtenerPresets();
  const index = presets.findIndex((p) => p.id === presetId);

  if (index === -1) return null;

  // Guardar versión actual antes de restaurar
  guardarVersionPreset(presets[index]);

  // Restaurar desde la versión
  const nuevaVersion = incrementarVersion(presets[index].version, 'major');
  presets[index] = {
    ...presets[index],
    ...version.datos,
    version: nuevaVersion,
    fechaActualizacion: new Date().toISOString(),
  };

  guardarPresets(presets);
  return presets[index];
}

/**
 * Compartir preset con otros usuarios
 */
export function compartirPreset(
  presetId: string,
  usuarioIds: string[]
): PresetAutomatizacion | null {
  const presets = obtenerPresets();
  const index = presets.findIndex((p) => p.id === presetId);

  if (index === -1) return null;

  const preset = presets[index];
  const nuevosCompartidos = [...new Set([...preset.compartidoCon, ...usuarioIds])];

  presets[index] = {
    ...preset,
    compartidoCon: nuevosCompartidos,
    estadisticas: {
      ...preset.estadisticas,
      vecesCompartido: (preset.estadisticas?.vecesCompartido || 0) + usuarioIds.length,
    },
    fechaActualizacion: new Date().toISOString(),
  };

  guardarPresets(presets);
  return presets[index];
}

/**
 * Obtener presets compartidos con un usuario
 */
export function obtenerPresetsCompartidos(usuarioId: string): PresetAutomatizacion[] {
  const presets = obtenerPresets();
  return presets.filter(
    (p) => p.publico || p.compartidoCon.includes(usuarioId) || p.creadoPor === usuarioId
  );
}

/**
 * Obtener presets públicos
 */
export function obtenerPresetsPublicos(): PresetAutomatizacion[] {
  const presets = obtenerPresets();
  return presets.filter((p) => p.publico);
}

/**
 * Usar un preset (incrementar contador de uso)
 */
export function usarPreset(presetId: string): void {
  const presets = obtenerPresets();
  const index = presets.findIndex((p) => p.id === presetId);

  if (index === -1) return;

  presets[index] = {
    ...presets[index],
    estadisticas: {
      ...presets[index].estadisticas,
      vecesUsado: (presets[index].estadisticas?.vecesUsado || 0) + 1,
    },
  };

  guardarPresets(presets);
}

/**
 * Exportar preset a JSON
 */
export function exportarPreset(presetId: string): string | null {
  const presets = obtenerPresets();
  const preset = presets.find((p) => p.id === presetId);

  if (!preset) return null;

  // Obtener datos completos de reglas y automatizaciones
  const reglas = obtenerReglasEncadenadas();
  const automatizaciones = obtenerAutomatizaciones();

  const presetCompleto = {
    ...preset,
    reglasEncadenadasCompletas: preset.reglasEncadenadas
      .map((id) => reglas.find((r) => r.id === id))
      .filter(Boolean),
    automatizacionesRecurrentesCompletas: preset.automatizacionesRecurrentes
      .map((id) => automatizaciones.find((a) => a.id === id))
      .filter(Boolean),
  };

  return JSON.stringify(presetCompleto, null, 2);
}

/**
 * Importar preset desde JSON
 */
export function importarPreset(
  jsonString: string,
  usuarioId: string,
  usuarioNombre: string
): PresetAutomatizacion | null {
  try {
    const datos = JSON.parse(jsonString);

    // Si tiene datos completos, extraer solo los IDs
    const reglasIds = datos.reglasEncadenadasCompletas
      ? datos.reglasEncadenadasCompletas.map((r: ReglaEncadenada) => r.id)
      : datos.reglasEncadenadas || [];

    const automatizacionesIds = datos.automatizacionesRecurrentesCompletas
      ? datos.automatizacionesRecurrentesCompletas.map((a: AutomatizacionRecurrente) => a.id)
      : datos.automatizacionesRecurrentes || [];

    const nuevoPreset = crearPreset({
      nombre: datos.nombre || 'Preset Importado',
      descripcion: datos.descripcion || '',
      version: datos.version || '1.0.0',
      reglasEncadenadas: reglasIds,
      automatizacionesRecurrentes: automatizacionesIds,
      tags: datos.tags || [],
      categoria: datos.categoria,
      publico: false, // Por defecto no público al importar
      compartidoCon: [],
      creadoPor: usuarioId,
      creadoPorNombre: usuarioNombre,
    });

    return nuevoPreset;
  } catch (error) {
    console.error('Error importando preset:', error);
    return null;
  }
}

