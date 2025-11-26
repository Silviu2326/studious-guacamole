import { ConfiguracionAprobacionReservas } from '../types';

/**
 * Obtiene la configuración de aprobación de reservas de un entrenador
 */
export const getConfiguracionAprobacion = async (
  entrenadorId: string
): Promise<ConfiguracionAprobacionReservas> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulación: obtener configuración desde el backend
  // En producción, esto haría una llamada real a la API
  const configGuardada = localStorage.getItem(`configAprobacion_${entrenadorId}`);
  
  if (configGuardada) {
    return JSON.parse(configGuardada);
  }
  
  // Configuración por defecto: aprobación automática
  const configPorDefecto: ConfiguracionAprobacionReservas = {
    id: `config_${entrenadorId}`,
    entrenadorId,
    aprobacionAutomatica: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Guardar configuración por defecto
  localStorage.setItem(`configAprobacion_${entrenadorId}`, JSON.stringify(configPorDefecto));
  return configPorDefecto;
};

/**
 * Actualiza la configuración de aprobación de reservas
 */
export const actualizarConfiguracionAprobacion = async (
  entrenadorId: string,
  aprobacionAutomatica: boolean
): Promise<ConfiguracionAprobacionReservas> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const config = await getConfiguracionAprobacion(entrenadorId);
  
  const configActualizada: ConfiguracionAprobacionReservas = {
    ...config,
    aprobacionAutomatica,
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`configAprobacion_${entrenadorId}`, JSON.stringify(configActualizada));
  return configActualizada;
};


