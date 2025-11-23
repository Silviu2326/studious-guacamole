import { Restricciones } from '../utils/SmartFill';

const STORAGE_KEY = 'smartfill_preferences';

export interface SmartFillPreferences {
    tiempo?: number;
    material?: string[];
    molestias?: string[];
    lastUsed?: string; // ISO timestamp
}

export class SmartFillPreferencesService {
    /**
     * Save SmartFill preferences to localStorage
     */
    static savePreferences(restricciones: Restricciones): void {
        try {
            const preferences: SmartFillPreferences = {
                tiempo: restricciones.tiempoDisponible,
                material: restricciones.materialDisponible,
                molestias: restricciones.molestias,
                lastUsed: new Date().toISOString()
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        } catch (error) {
            console.error('Error saving SmartFill preferences:', error);
        }
    }

    /**
     * Retrieve last used SmartFill preferences from localStorage
     */
    static getPreferences(): Restricciones | null {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return null;

            const preferences: SmartFillPreferences = JSON.parse(stored);

            // Convert back to Restricciones format
            const restricciones: Restricciones = {};

            if (preferences.tiempo !== undefined) {
                restricciones.tiempoDisponible = preferences.tiempo;
            }

            if (preferences.material && preferences.material.length > 0) {
                restricciones.materialDisponible = preferences.material;
            }

            if (preferences.molestias && preferences.molestias.length > 0) {
                restricciones.molestias = preferences.molestias;
            }

            return Object.keys(restricciones).length > 0 ? restricciones : null;
        } catch (error) {
            console.error('Error retrieving SmartFill preferences:', error);
            return null;
        }
    }

    /**
     * Clear saved preferences
     */
    static clearPreferences(): void {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing SmartFill preferences:', error);
        }
    }

    /**
     * Check if user has used SmartFill before
     */
    static hasUsedBefore(): boolean {
        try {
            return localStorage.getItem(STORAGE_KEY) !== null;
        } catch (error) {
            return false;
        }
    }
}
