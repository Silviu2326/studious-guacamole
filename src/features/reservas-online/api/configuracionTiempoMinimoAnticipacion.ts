import { ConfiguracionTiempoMinimoAnticipacion } from '../types';

/**
 * Obtiene la configuración de tiempo mínimo de anticipación de un entrenador
 * 
 * @param entrenadorId - ID del entrenador
 * @returns Configuración de tiempo mínimo de anticipación
 * 
 * @remarks
 * Esta es una función mock que simplifica la obtención de configuración.
 * En producción, se conectaría con un backend que maneja configuraciones
 * por alcance (global, tipo de sesión, entrenador, centro).
 */
export const getConfiguracionTiempoMinimoAnticipacion = async (
  entrenadorId: string
): Promise<ConfiguracionTiempoMinimoAnticipacion> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulación: obtener configuración desde el backend
  // En producción, esto haría una llamada real a la API
  const configGuardada = localStorage.getItem(`configTiempoMinimoAnticipacion_${entrenadorId}`);
  
  if (configGuardada) {
    const config = JSON.parse(configGuardada);
    return {
      ...config,
      createdAt: config.createdAt ? new Date(config.createdAt) : new Date(),
      updatedAt: config.updatedAt ? new Date(config.updatedAt) : new Date(),
    };
  }
  
  // Configuración por defecto: tiempo mínimo desactivado (24 horas = 1440 minutos)
  const configPorDefecto: ConfiguracionTiempoMinimoAnticipacion = {
    id: `configTiempoMinimoAnticipacion_${entrenadorId}`,
    entrenadorId,
    activo: false,
    minutosMinimos: 1440, // 24 horas en minutos
    horasMinimasAnticipacion: 24, // Alias para compatibilidad
    aplicaA: 'global',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Guardar configuración por defecto
  localStorage.setItem(`configTiempoMinimoAnticipacion_${entrenadorId}`, JSON.stringify(configPorDefecto));
  return configPorDefecto;
};

/**
 * Actualiza la configuración de tiempo mínimo de anticipación
 * 
 * @param entrenadorId - ID del entrenador
 * @param configuracion - Configuración parcial a actualizar
 * @returns Configuración actualizada
 * 
 * @remarks
 * Esta es una función mock que simplifica el guardado de configuración.
 * En producción, se conectaría con un backend que valida y persiste los datos.
 */
export const actualizarConfiguracionTiempoMinimoAnticipacion = async (
  entrenadorId: string,
  configuracion: Partial<Omit<ConfiguracionTiempoMinimoAnticipacion, 'id' | 'entrenadorId' | 'createdAt'>>
): Promise<ConfiguracionTiempoMinimoAnticipacion> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const config = await getConfiguracionTiempoMinimoAnticipacion(entrenadorId);
  
  // Sincronizar minutosMinimos con horasMinimasAnticipacion si se actualiza uno u otro
  const horasMinimas = configuracion.horasMinimasAnticipacion ?? 
    (configuracion.minutosMinimos ? configuracion.minutosMinimos / 60 : config.horasMinimasAnticipacion);
  const minutosMinimos = configuracion.minutosMinimos ?? 
    (configuracion.horasMinimasAnticipacion ? configuracion.horasMinimasAnticipacion * 60 : config.minutosMinimos);
  
  const configActualizada: ConfiguracionTiempoMinimoAnticipacion = {
    ...config,
    ...configuracion,
    minutosMinimos: minutosMinimos,
    horasMinimasAnticipacion: horasMinimas, // Mantener alias para compatibilidad
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`configTiempoMinimoAnticipacion_${entrenadorId}`, JSON.stringify(configActualizada));
  return configActualizada;
};

/**
 * Guarda la configuración de tiempo mínimo de anticipación (alias de actualizarConfiguracionTiempoMinimoAnticipacion)
 * 
 * @param data - Configuración completa de tiempo mínimo de anticipación
 * @returns Configuración guardada
 */
export const saveConfiguracionTiempoMinimoAnticipacion = async (
  data: ConfiguracionTiempoMinimoAnticipacion
): Promise<ConfiguracionTiempoMinimoAnticipacion> => {
  if (!data.entrenadorId) {
    throw new Error('entrenadorId es requerido');
  }
  
  return await actualizarConfiguracionTiempoMinimoAnticipacion(data.entrenadorId, data);
};


