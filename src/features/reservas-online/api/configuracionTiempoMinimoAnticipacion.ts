import { ConfiguracionTiempoMinimoAnticipacion } from '../types';

/**
 * Obtiene la configuración de tiempo mínimo de anticipación de un entrenador
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
      createdAt: new Date(config.createdAt),
      updatedAt: new Date(config.updatedAt),
    };
  }
  
  // Configuración por defecto: tiempo mínimo desactivado
  const configPorDefecto: ConfiguracionTiempoMinimoAnticipacion = {
    id: `configTiempoMinimoAnticipacion_${entrenadorId}`,
    entrenadorId,
    activo: false,
    horasMinimasAnticipacion: 24,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Guardar configuración por defecto
  localStorage.setItem(`configTiempoMinimoAnticipacion_${entrenadorId}`, JSON.stringify(configPorDefecto));
  return configPorDefecto;
};

/**
 * Actualiza la configuración de tiempo mínimo de anticipación
 */
export const actualizarConfiguracionTiempoMinimoAnticipacion = async (
  entrenadorId: string,
  configuracion: Partial<Omit<ConfiguracionTiempoMinimoAnticipacion, 'id' | 'entrenadorId' | 'createdAt'>>
): Promise<ConfiguracionTiempoMinimoAnticipacion> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const config = await getConfiguracionTiempoMinimoAnticipacion(entrenadorId);
  
  const configActualizada: ConfiguracionTiempoMinimoAnticipacion = {
    ...config,
    ...configuracion,
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`configTiempoMinimoAnticipacion_${entrenadorId}`, JSON.stringify(configActualizada));
  return configActualizada;
};


