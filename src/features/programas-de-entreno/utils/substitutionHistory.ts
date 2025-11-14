import type { DayPlan } from '../types';

type DayKey = string;

export interface SubstitutionHistoryEntry {
  id: string;
  timestamp: string;
  description: string;
  weeklyPlanBefore: Record<DayKey, DayPlan>;
  weeklyPlanAfter: Record<DayKey, DayPlan>;
}

/**
 * Gestor de historial para sustituciones con funcionalidad undo/redo
 */
export class SubstitutionHistoryManager {
  private history: SubstitutionHistoryEntry[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50;

  /**
   * Agrega una nueva entrada al historial
   */
  addEntry(
    planBefore: Record<DayKey, DayPlan>,
    planAfter: Record<DayKey, DayPlan>,
    description: string = 'Sustitución realizada'
  ): void {
    // Si estamos en medio del historial (después de un undo), eliminar las entradas futuras
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    const entry: SubstitutionHistoryEntry = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      description,
      weeklyPlanBefore: this.deepClone(planBefore),
      weeklyPlanAfter: this.deepClone(planAfter),
    };

    this.history.push(entry);
    this.currentIndex = this.history.length - 1;

    // Limitar el tamaño del historial
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  /**
   * Deshace la última sustitución
   */
  undo(): Record<DayKey, DayPlan> | null {
    if (!this.canUndo()) {
      return null;
    }

    const entry = this.history[this.currentIndex];
    this.currentIndex--;
    return this.deepClone(entry.weeklyPlanBefore);
  }

  /**
   * Rehace la última sustitución deshecha
   */
  redo(): Record<DayKey, DayPlan> | null {
    if (!this.canRedo()) {
      return null;
    }

    this.currentIndex++;
    const entry = this.history[this.currentIndex];
    return this.deepClone(entry.weeklyPlanAfter);
  }

  /**
   * Verifica si se puede deshacer
   */
  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  /**
   * Verifica si se puede rehacer
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Obtiene el historial completo
   */
  getHistory(): SubstitutionHistoryEntry[] {
    return [...this.history];
  }

  /**
   * Obtiene la entrada actual del historial
   */
  getCurrentEntry(): SubstitutionHistoryEntry | null {
    if (this.currentIndex < 0 || this.currentIndex >= this.history.length) {
      return null;
    }
    return this.history[this.currentIndex];
  }

  /**
   * Obtiene información del historial para mostrar en la UI
   */
  getHistoryInfo(): { canUndo: boolean; canRedo: boolean; currentDescription: string | null } {
    return {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      currentDescription: this.getCurrentEntry()?.description || null,
    };
  }

  /**
   * Limpia el historial
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Clona profundamente un objeto para evitar mutaciones
   */
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}

