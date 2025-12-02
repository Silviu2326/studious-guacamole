/**
 * Utilidad para persistir el estado de paneles colapsados/expandidos
 * User Story: Los paneles recuerdan su estado cuando el usuario vuelve a la página
 */

import React from 'react';

const STORAGE_PREFIX = 'programasEditor_panelState_';

/**
 * Guarda el estado de un panel en localStorage
 */
export function savePanelState(panelId: string, isCollapsed: boolean): void {
  try {
    const key = `${STORAGE_PREFIX}${panelId}`;
    localStorage.setItem(key, JSON.stringify(isCollapsed));
  } catch (error) {
    console.error(`Error saving panel state for ${panelId}:`, error);
  }
}

/**
 * Obtiene el estado guardado de un panel desde localStorage
 */
export function getPanelState(panelId: string, defaultValue: boolean = false): boolean {
  try {
    const key = `${STORAGE_PREFIX}${panelId}`;
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(`Error loading panel state for ${panelId}:`, error);
  }
  return defaultValue;
}

/**
 * Guarda un conjunto de IDs expandidos (para paneles con múltiples elementos)
 */
export function saveExpandedSet(panelId: string, expandedIds: Set<string> | string[]): void {
  try {
    const key = `${STORAGE_PREFIX}${panelId}_expanded`;
    const idsArray = Array.isArray(expandedIds) ? expandedIds : Array.from(expandedIds);
    localStorage.setItem(key, JSON.stringify(idsArray));
  } catch (error) {
    console.error(`Error saving expanded set for ${panelId}:`, error);
  }
}

/**
 * Obtiene un conjunto de IDs expandidos guardados
 */
export function getExpandedSet(panelId: string, defaultValue: string[] = []): Set<string> {
  try {
    const key = `${STORAGE_PREFIX}${panelId}_expanded`;
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      const idsArray = JSON.parse(saved) as string[];
      return new Set(idsArray);
    }
  } catch (error) {
    console.error(`Error loading expanded set for ${panelId}:`, error);
  }
  return new Set(defaultValue);
}

/**
 * Hook helper para usar en componentes React
 * Retorna el estado inicial y una función para guardar cambios
 */
export function usePanelState(
  panelId: string,
  defaultValue: boolean = false
): [boolean, (isCollapsed: boolean) => void] {
  const [state, setState] = React.useState(() => getPanelState(panelId, defaultValue));

  const updateState = React.useCallback(
    (isCollapsed: boolean) => {
      setState(isCollapsed);
      savePanelState(panelId, isCollapsed);
    },
    [panelId]
  );

  return [state, updateState];
}

