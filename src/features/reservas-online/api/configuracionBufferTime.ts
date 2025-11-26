import { ConfiguracionBufferTime } from '../types';

/**
 * Obtiene la configuración de buffer time de un entrenador
 */
export const getConfiguracionBufferTime = async (
  entrenadorId: string
): Promise<ConfiguracionBufferTime> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulación: obtener configuración desde el backend
  // En producción, esto haría una llamada real a la API
  const configGuardada = localStorage.getItem(`configBufferTime_${entrenadorId}`);
  
  if (configGuardada) {
    const config = JSON.parse(configGuardada);
    return {
      ...config,
      createdAt: new Date(config.createdAt),
      updatedAt: new Date(config.updatedAt),
    };
  }
  
  // Configuración por defecto: buffer time desactivado
  const configPorDefecto: ConfiguracionBufferTime = {
    id: `configBufferTime_${entrenadorId}`,
    entrenadorId,
    activo: false,
    minutosBuffer: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Guardar configuración por defecto
  localStorage.setItem(`configBufferTime_${entrenadorId}`, JSON.stringify(configPorDefecto));
  return configPorDefecto;
};

/**
 * Actualiza la configuración de buffer time
 */
export const actualizarConfiguracionBufferTime = async (
  entrenadorId: string,
  configuracion: Partial<Omit<ConfiguracionBufferTime, 'id' | 'entrenadorId' | 'createdAt'>>
): Promise<ConfiguracionBufferTime> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const config = await getConfiguracionBufferTime(entrenadorId);
  
  const configActualizada: ConfiguracionBufferTime = {
    ...config,
    ...configuracion,
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`configBufferTime_${entrenadorId}`, JSON.stringify(configActualizada));
  return configActualizada;
};


