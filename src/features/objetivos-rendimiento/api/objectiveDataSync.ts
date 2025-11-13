// User Story: API para alimentación automática de objetivos desde otras áreas
import { Objective, ObjectiveDataSource, ERPSource, ERPSyncData } from '../types';
import { getERPSyncData } from './sync';
import { getObjectives, updateObjective } from './objectives';

/**
 * Sincroniza un objetivo con su fuente de datos automática
 */
export const syncObjectiveData = async (objectiveId: string): Promise<Objective | null> => {
  // Obtener el objetivo
  const objectives = await getObjectives();
  const objective = objectives.find(obj => obj.id === objectiveId);
  
  if (!objective || !objective.dataSource || !objective.dataSource.enabled) {
    return null;
  }
  
  const dataSource = objective.dataSource;
  
  try {
    // Obtener datos de la fuente ERP
    const syncData = await getERPSyncData(dataSource.source, dataSource.sourceMetric);
    
    if (!syncData) {
      console.warn(`No se encontraron datos para la métrica ${dataSource.sourceMetric} en ${dataSource.source}`);
      return objective;
    }
    
    // Aplicar transformación si existe
    let value = syncData.value;
    if (dataSource.transformation?.formula) {
      // Evaluar fórmula simple de forma segura
      try {
        // Reemplazar 'value' con el valor numérico en la fórmula
        const formula = dataSource.transformation.formula.replace(/value/g, value.toString());
        // Evaluar de forma segura usando Function constructor (más seguro que eval)
        // Solo permitir operaciones matemáticas básicas
        if (/^[0-9+\-*/().\s]+$/.test(formula)) {
          value = Function(`"use strict"; return (${formula})`)();
        } else {
          console.warn('Fórmula contiene caracteres no permitidos:', formula);
        }
      } catch (e) {
        console.error('Error evaluando fórmula de transformación:', e);
      }
    }
    
    // Actualizar el objetivo con el nuevo valor y la fecha de sincronización
    const updatedDataSource = {
      ...dataSource,
      lastSync: new Date().toISOString(),
    };
    
    const updatedObjective = await updateObjective(objectiveId, {
      currentValue: value,
      dataSource: updatedDataSource,
      updatedAt: new Date().toISOString(),
    });
    
    return updatedObjective;
  } catch (error) {
    console.error('Error sincronizando objetivo:', error);
    throw error;
  }
};

/**
 * Sincroniza todos los objetivos que tienen alimentación automática habilitada
 */
export const syncAllObjectivesWithDataSource = async (): Promise<{
  objectiveId: string;
  success: boolean;
  updatedValue?: number;
  error?: string;
}[]> => {
  const objectives = await getObjectives();
  const objectivesWithDataSource = objectives.filter(
    obj => obj.dataSource?.enabled && obj.dataSource?.autoSync
  );
  
  const results = await Promise.allSettled(
    objectivesWithDataSource.map(async (objective) => {
      try {
        const updated = await syncObjectiveData(objective.id);
        return {
          objectiveId: objective.id,
          success: !!updated,
          updatedValue: updated?.currentValue,
        };
      } catch (error) {
        return {
          objectiveId: objective.id,
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        };
      }
    })
  );
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      objectiveId: objectivesWithDataSource[index].id,
      success: false,
      error: result.reason?.message || 'Error desconocido',
    };
  });
};

/**
 * Configura la fuente de datos automática para un objetivo
 */
export const configureObjectiveDataSource = async (
  objectiveId: string,
  dataSource: ObjectiveDataSource
): Promise<Objective> => {
  const objective = await getObjectives().then(objectives => 
    objectives.find(obj => obj.id === objectiveId)
  );
  
  if (!objective) {
    throw new Error('Objetivo no encontrado');
  }
  
  // Verificar que la métrica existe en la fuente
  const syncData = await getERPSyncData(dataSource.source, dataSource.sourceMetric);
  if (!syncData) {
    throw new Error(`La métrica ${dataSource.sourceMetric} no existe en ${dataSource.source}`);
  }
  
  // Actualizar el objetivo con la configuración de fuente de datos
  const updated = await updateObjective(objectiveId, {
    dataSource: {
      ...dataSource,
      lastSync: dataSource.lastSync || new Date().toISOString(),
    },
    // Actualizar también la unidad si es diferente
    unit: syncData.unit !== objective.unit ? syncData.unit : objective.unit,
  });
  
  // Si está habilitado y auto-sync, hacer una sincronización inmediata
  if (dataSource.enabled && dataSource.autoSync) {
    await syncObjectiveData(objectiveId);
  }
  
  return updated;
};

/**
 * Deshabilita la fuente de datos automática para un objetivo
 */
export const disableObjectiveDataSource = async (objectiveId: string): Promise<Objective> => {
  const objectives = await getObjectives();
  const objective = objectives.find(obj => obj.id === objectiveId);
  
  if (!objective || !objective.dataSource) {
    throw new Error('Objetivo no encontrado o no tiene fuente de datos configurada');
  }
  
  return await updateObjective(objectiveId, {
    dataSource: {
      ...objective.dataSource,
      enabled: false,
    },
  });
};

/**
 * Verifica si un objetivo necesita sincronización
 */
export const shouldSyncObjective = (objective: Objective): boolean => {
  if (!objective.dataSource || !objective.dataSource.enabled || !objective.dataSource.autoSync) {
    return false;
  }
  
  if (!objective.dataSource.lastSync) {
    return true;
  }
  
  const lastSync = new Date(objective.dataSource.lastSync);
  const now = new Date();
  const secondsSinceLastSync = (now.getTime() - lastSync.getTime()) / 1000;
  
  return secondsSinceLastSync >= objective.dataSource.syncInterval;
};

/**
 * Obtiene objetivos que necesitan sincronización
 */
export const getObjectivesNeedingSync = async (): Promise<Objective[]> => {
  const objectives = await getObjectives();
  return objectives.filter(shouldSyncObjective);
};

