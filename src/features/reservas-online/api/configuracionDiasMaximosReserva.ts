import { ConfiguracionDiasMaximosReserva } from '../types';

/**
 * Obtiene la configuración de días máximos de reserva de un entrenador
 * 
 * @param entrenadorId - ID del entrenador
 * @returns Configuración de días máximos de reserva
 * 
 * @remarks
 * Esta es una función mock que simplifica la obtención de configuración.
 * En producción, se conectaría con un backend que maneja configuraciones
 * por alcance (global, tipo de sesión, entrenador, centro).
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
      createdAt: config.createdAt ? new Date(config.createdAt) : new Date(),
      updatedAt: config.updatedAt ? new Date(config.updatedAt) : new Date(),
    };
  }
  
  // Configuración por defecto: 30 días en el futuro
  const configPorDefecto: ConfiguracionDiasMaximosReserva = {
    id: `configDiasMaximosReserva_${entrenadorId}`,
    entrenadorId,
    activo: true,
    maxDiasEnFuturo: 30,
    diasMaximos: 30, // Alias para compatibilidad
    aplicaA: 'global',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Guardar configuración por defecto
  localStorage.setItem(`configDiasMaximosReserva_${entrenadorId}`, JSON.stringify(configPorDefecto));
  return configPorDefecto;
};

/**
 * Actualiza la configuración de días máximos de reserva
 * 
 * @param entrenadorId - ID del entrenador
 * @param configuracion - Configuración parcial a actualizar
 * @returns Configuración actualizada
 * 
 * @remarks
 * Esta es una función mock que simplifica el guardado de configuración.
 * En producción, se conectaría con un backend que valida y persiste los datos.
 */
export const actualizarConfiguracionDiasMaximosReserva = async (
  entrenadorId: string,
  configuracion: Partial<Omit<ConfiguracionDiasMaximosReserva, 'id' | 'entrenadorId' | 'createdAt'>>
): Promise<ConfiguracionDiasMaximosReserva> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const config = await getConfiguracionDiasMaximosReserva(entrenadorId);
  
  // Sincronizar maxDiasEnFuturo con diasMaximos si se actualiza uno u otro
  const maxDias = configuracion.maxDiasEnFuturo ?? configuracion.diasMaximos ?? config.maxDiasEnFuturo;
  const diasMaximos = configuracion.diasMaximos ?? maxDias;
  
  const configActualizada: ConfiguracionDiasMaximosReserva = {
    ...config,
    ...configuracion,
    maxDiasEnFuturo: maxDias,
    diasMaximos: diasMaximos, // Mantener alias para compatibilidad
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`configDiasMaximosReserva_${entrenadorId}`, JSON.stringify(configActualizada));
  return configActualizada;
};

/**
 * Guarda la configuración de días máximos de reserva (alias de actualizarConfiguracionDiasMaximosReserva)
 * 
 * @param data - Configuración completa de días máximos de reserva
 * @returns Configuración guardada
 */
export const saveConfiguracionDiasMaximosReserva = async (
  data: ConfiguracionDiasMaximosReserva
): Promise<ConfiguracionDiasMaximosReserva> => {
  if (!data.entrenadorId) {
    throw new Error('entrenadorId es requerido');
  }
  
  return await actualizarConfiguracionDiasMaximosReserva(data.entrenadorId, data);
};


