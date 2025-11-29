import React from 'react';
import { PlanificacionSemana, SesionEntrenamiento } from '../../types/advanced';

export interface Version {
  id: string;
  timestamp: Date;
  label: string;
  planificacion: PlanificacionSemana;
  metadata?: {
    action?: string;
    usuario?: string;
    cambios?: string[];
  };
}

/**
 * Sistema de Autosave + Versionado
 * Recuperar versiones: "Hace 10 min", "Antes de aplicar plantilla"
 */
export class AutosaveVersioning {
  private static readonly STORAGE_KEY = 'editor-entreno-versions';
  private static readonly MAX_VERSIONS = 50;
  private static readonly AUTOSAVE_INTERVAL = 30000; // 30 segundos

  static saveVersion(
    planificacion: PlanificacionSemana,
    label?: string,
    metadata?: Version['metadata']
  ): Version {
    const version: Version = {
      id: `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      label: label || this.generateLabel(new Date()),
      planificacion: JSON.parse(JSON.stringify(planificacion)), // Deep copy
      metadata,
    };

    const versions = this.getVersions();
    versions.unshift(version); // Add to beginning
    
    // Keep only last MAX_VERSIONS
    if (versions.length > this.MAX_VERSIONS) {
      versions.splice(this.MAX_VERSIONS);
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(versions));
    } catch (error) {
      console.warn('Error saving version to localStorage:', error);
    }

    return version;
  }

  static getVersions(): Version[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const versions = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return versions.map((v: any) => ({
        ...v,
        timestamp: new Date(v.timestamp),
        planificacion: v.planificacion, // Already parsed
      }));
    } catch (error) {
      console.warn('Error loading versions from localStorage:', error);
      return [];
    }
  }

  static getVersion(id: string): Version | null {
    const versions = this.getVersions();
    return versions.find(v => v.id === id) || null;
  }

  static restoreVersion(id: string): PlanificacionSemana | null {
    const version = this.getVersion(id);
    return version ? version.planificacion : null;
  }

  static getRecentVersions(limit: number = 10): Version[] {
    const versions = this.getVersions();
    return versions.slice(0, limit);
  }

  static deleteVersion(id: string): boolean {
    const versions = this.getVersions();
    const filtered = versions.filter(v => v.id !== id);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.warn('Error deleting version:', error);
      return false;
    }
  }

  static clearAllVersions(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Error clearing versions:', error);
    }
  }

  private static generateLabel(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace unos segundos';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  static formatVersionLabel(version: Version): string {
    if (version.label) return version.label;
    return this.generateLabel(version.timestamp);
  }
}

/**
 * Hook para autosave automático
 */
export function useAutosave(
  planificacion: PlanificacionSemana,
  enabled: boolean = true,
  interval: number = AutosaveVersioning.AUTOSAVE_INTERVAL
) {
  React.useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      AutosaveVersioning.saveVersion(planificacion, undefined, {
        action: 'autosave',
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [planificacion, enabled, interval]);
}

