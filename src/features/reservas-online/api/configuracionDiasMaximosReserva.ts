import { ConfiguracionDiasMaximosReserva } from '../types';

/**
 * Obtiene la configuración de días máximos de reserva de un entrenador
 */
export const getConfiguracionDiasMaximosReserva = async (
  entrenadorId: string
): Promise<ConfiguracionDiasMaximosReserva> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulación: obtener configuración desde el backend
  // En producción, esto haría una llamada real a la API
  const configGuardada = localStorage.getItem(`configDiasMaximosReserva_${entrenadorId}`);
  
  if (configGuardada) {
    const config = JSON.parse(configGuardada);
    return {
      ...config,
      createdAt: new Date(config.createdAt),
      updatedAt: new Date(config.updatedAt),
    };
  }
  
  // Configuración por defecto: 30 días en el futuro
  const configPorDefecto: ConfiguracionDiasMaximosReserva = {
    id: `configDiasMaximosReserva_${entrenadorId}`,
    entrenadorId,
    activo: true,
    diasMaximos: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Guardar configuración por defecto
  localStorage.setItem(`configDiasMaximosReserva_${entrenadorId}`, JSON.stringify(configPorDefecto));
  return configPorDefecto;
};

/**
 * Actualiza la configuración de días máximos de reserva
 */
export const actualizarConfiguracionDiasMaximosReserva = async (
  entrenadorId: string,
  configuracion: Partial<Omit<ConfiguracionDiasMaximosReserva, 'id' | 'entrenadorId' | 'createdAt'>>
): Promise<ConfiguracionDiasMaximosReserva> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const config = await getConfiguracionDiasMaximosReserva(entrenadorId);
  
  const configActualizada: ConfiguracionDiasMaximosReserva = {
    ...config,
    ...configuracion,
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`configDiasMaximosReserva_${entrenadorId}`, JSON.stringify(configActualizada));
  return configActualizada;
};


