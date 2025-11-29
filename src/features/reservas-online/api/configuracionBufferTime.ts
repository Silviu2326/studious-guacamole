import { ConfiguracionBufferTime } from '../types';

/**
 * Obtiene la configuración de buffer time de un entrenador
 * 
 * @param entrenadorId - ID del entrenador
 * @returns Configuración de buffer time
 * 
 * @remarks
 * Esta es una función mock que simplifica la obtención de configuración.
 * En producción, se conectaría con un backend que maneja configuraciones
 * por alcance (global, tipo de sesión, entrenador, centro).
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
      createdAt: config.createdAt ? new Date(config.createdAt) : new Date(),
      updatedAt: config.updatedAt ? new Date(config.updatedAt) : new Date(),
    };
  }
  
  // Configuración por defecto: buffer time desactivado
  const configPorDefecto: ConfiguracionBufferTime = {
    id: `configBufferTime_${entrenadorId}`,
    entrenadorId,
    activo: false,
    minutosAntes: 0,
    minutosDespues: 15, // 15 minutos de buffer después de cada sesión
    minutosBuffer: 15, // Alias para compatibilidad
    aplicaA: 'global',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Guardar configuración por defecto
  localStorage.setItem(`configBufferTime_${entrenadorId}`, JSON.stringify(configPorDefecto));
  return configPorDefecto;
};

/**
 * Actualiza la configuración de buffer time
 * 
 * @param entrenadorId - ID del entrenador
 * @param configuracion - Configuración parcial a actualizar
 * @returns Configuración actualizada
 * 
 * @remarks
 * Esta es una función mock que simplifica el guardado de configuración.
 * En producción, se conectaría con un backend que valida y persiste los datos.
 */
export const actualizarConfiguracionBufferTime = async (
  entrenadorId: string,
  configuracion: Partial<Omit<ConfiguracionBufferTime, 'id' | 'entrenadorId' | 'createdAt'>>
): Promise<ConfiguracionBufferTime> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const config = await getConfiguracionBufferTime(entrenadorId);
  
  // Sincronizar minutosBuffer con minutosDespues si se actualiza uno u otro
  const minutosDespues = configuracion.minutosDespues ?? configuracion.minutosBuffer ?? config.minutosDespues;
  const minutosBuffer = configuracion.minutosBuffer ?? minutosDespues;
  
  const configActualizada: ConfiguracionBufferTime = {
    ...config,
    ...configuracion,
    minutosDespues: minutosDespues,
    minutosBuffer: minutosBuffer, // Mantener alias para compatibilidad
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`configBufferTime_${entrenadorId}`, JSON.stringify(configActualizada));
  return configActualizada;
};

/**
 * Guarda la configuración de buffer time (alias de actualizarConfiguracionBufferTime)
 * 
 * @param data - Configuración completa de buffer time
 * @returns Configuración guardada
 */
export const saveConfiguracionBufferTime = async (
  data: ConfiguracionBufferTime
): Promise<ConfiguracionBufferTime> => {
  if (!data.entrenadorId) {
    throw new Error('entrenadorId es requerido');
  }
  
  return await actualizarConfiguracionBufferTime(data.entrenadorId, data);
};


