// API service para Objetivos Financieros
// En producción, estas llamadas se harían a un backend real

import { ObjetivosFinancieros, UserRole } from '../types';

const STORAGE_KEY_PREFIX = 'objetivos_financieros_';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Obtener clave de almacenamiento según el rol
const getStorageKey = (rol: UserRole): string => {
  return `${STORAGE_KEY_PREFIX}${rol}`;
};

// Valores por defecto según el rol
const getDefaultGoals = (rol: UserRole): ObjetivosFinancieros => {
  if (rol === 'entrenador') {
    return {
      objetivoMensual: 5000,
      objetivoAnual: 60000,
      fechaActualizacion: new Date(),
      rol: 'entrenador'
    };
  } else {
    return {
      objetivoMensual: 130000,
      objetivoAnual: 1560000,
      fechaActualizacion: new Date(),
      rol: 'gimnasio'
    };
  }
};

export const objetivosApi = {
  // Obtener objetivos financieros
  async obtenerObjetivos(rol: UserRole): Promise<ObjetivosFinancieros> {
    await delay(300);
    
    try {
      const storageKey = getStorageKey(rol);
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const objetivos = JSON.parse(stored);
        return {
          ...objetivos,
          fechaActualizacion: new Date(objetivos.fechaActualizacion)
        };
      }
    } catch (error) {
      console.error('Error al obtener objetivos desde localStorage:', error);
    }
    
    // Retornar valores por defecto si no hay almacenados
    return getDefaultGoals(rol);
  },

  // Guardar objetivos financieros
  async guardarObjetivos(objetivos: ObjetivosFinancieros): Promise<ObjetivosFinancieros> {
    await delay(300);
    
    try {
      const storageKey = getStorageKey(objetivos.rol);
      const objetivosActualizados = {
        ...objetivos,
        fechaActualizacion: new Date()
      };
      localStorage.setItem(storageKey, JSON.stringify(objetivosActualizados));
      return objetivosActualizados;
    } catch (error) {
      console.error('Error al guardar objetivos en localStorage:', error);
      throw new Error('No se pudieron guardar los objetivos');
    }
  },

  // Actualizar objetivo mensual
  async actualizarObjetivoMensual(rol: UserRole, objetivoMensual: number): Promise<ObjetivosFinancieros> {
    const objetivos = await this.obtenerObjetivos(rol);
    objetivos.objetivoMensual = objetivoMensual;
    return await this.guardarObjetivos(objetivos);
  },

  // Actualizar objetivo anual
  async actualizarObjetivoAnual(rol: UserRole, objetivoAnual: number): Promise<ObjetivosFinancieros> {
    const objetivos = await this.obtenerObjetivos(rol);
    objetivos.objetivoAnual = objetivoAnual;
    return await this.guardarObjetivos(objetivos);
  },

  // Actualizar ambos objetivos
  async actualizarObjetivos(rol: UserRole, objetivoMensual: number, objetivoAnual: number): Promise<ObjetivosFinancieros> {
    const objetivos = await this.obtenerObjetivos(rol);
    objetivos.objetivoMensual = objetivoMensual;
    objetivos.objetivoAnual = objetivoAnual;
    return await this.guardarObjetivos(objetivos);
  }
};

