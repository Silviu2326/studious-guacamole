import type { DayPlan } from '../types';

type DayKey = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

export interface SubstitutionReplacement {
  day: DayKey;
  sessionId: string;
  newBlock: Partial<import('../types').DaySession>;
}

export interface SubstitutionPreset {
  id: string;
  name: string;
  description?: string;
  replacements: SubstitutionReplacement[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

const STORAGE_KEY = 'programas_entreno_substitution_presets';

/**
 * Gestor de presets para combinaciones de sustituciones frecuentes
 */
export class SubstitutionPresetsManager {
  /**
   * Obtiene todos los presets guardados
   */
  static getAllPresets(): SubstitutionPreset[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as SubstitutionPreset[];
    } catch (error) {
      console.error('Error al leer presets:', error);
      return [];
    }
  }

  /**
   * Guarda un nuevo preset
   */
  static savePreset(
    name: string,
    replacements: SubstitutionReplacement[],
    description?: string,
    tags?: string[]
  ): SubstitutionPreset {
    const presets = this.getAllPresets();
    const now = new Date().toISOString();

    const newPreset: SubstitutionPreset = {
      id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      replacements: this.deepClone(replacements),
      createdAt: now,
      updatedAt: now,
      tags: tags || [],
    };

    presets.push(newPreset);
    this.savePresets(presets);

    return newPreset;
  }

  /**
   * Actualiza un preset existente
   */
  static updatePreset(
    id: string,
    updates: Partial<Pick<SubstitutionPreset, 'name' | 'description' | 'replacements' | 'tags'>>
  ): SubstitutionPreset | null {
    const presets = this.getAllPresets();
    const index = presets.findIndex((p) => p.id === id);

    if (index === -1) {
      return null;
    }

    presets[index] = {
      ...presets[index],
      ...updates,
      replacements: updates.replacements ? this.deepClone(updates.replacements) : presets[index].replacements,
      updatedAt: new Date().toISOString(),
    };

    this.savePresets(presets);
    return presets[index];
  }

  /**
   * Elimina un preset
   */
  static deletePreset(id: string): boolean {
    const presets = this.getAllPresets();
    const filtered = presets.filter((p) => p.id !== id);

    if (filtered.length === presets.length) {
      return false; // No se encontró el preset
    }

    this.savePresets(filtered);
    return true;
  }

  /**
   * Obtiene un preset por ID
   */
  static getPresetById(id: string): SubstitutionPreset | null {
    const presets = this.getAllPresets();
    return presets.find((p) => p.id === id) || null;
  }

  /**
   * Busca presets por nombre o tags
   */
  static searchPresets(query: string): SubstitutionPreset[] {
    const presets = this.getAllPresets();
    const queryLower = query.toLowerCase();

    return presets.filter(
      (preset) =>
        preset.name.toLowerCase().includes(queryLower) ||
        preset.description?.toLowerCase().includes(queryLower) ||
        preset.tags?.some((tag) => tag.toLowerCase().includes(queryLower))
    );
  }

  /**
   * Guarda los presets en localStorage
   */
  private static savePresets(presets: SubstitutionPreset[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    } catch (error) {
      console.error('Error al guardar presets:', error);
    }
  }

  /**
   * Clona profundamente un objeto para evitar mutaciones
   */
  private static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}

