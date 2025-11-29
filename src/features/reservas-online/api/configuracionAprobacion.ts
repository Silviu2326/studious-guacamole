import { ConfiguracionAprobacionReservas } from '../types';

/**
 * Obtiene la configuración de aprobación de reservas de un entrenador
 * 
 * GETTER: Obtiene la configuración completa de aprobación
 */
export const getConfiguracionAprobacion = async (
  entrenadorId: string
): Promise<ConfiguracionAprobacionReservas> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulación: obtener configuración desde el backend
  // En producción, esto haría una llamada real a la API
  const configGuardada = localStorage.getItem(`configAprobacion_${entrenadorId}`);
  
  if (configGuardada) {
    const parsed = JSON.parse(configGuardada);
    // Asegurar que las fechas sean objetos Date
    parsed.createdAt = new Date(parsed.createdAt);
    parsed.updatedAt = new Date(parsed.updatedAt);
    return parsed;
  }
  
  // Configuración por defecto: aprobación automática
  const configPorDefecto: ConfiguracionAprobacionReservas = {
    id: `config_${entrenadorId}`,
    entrenadorId,
    aprobacionAutomatica: true,
    excepcionesPorTipoSesion: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Guardar configuración por defecto
  localStorage.setItem(`configAprobacion_${entrenadorId}`, JSON.stringify(configPorDefecto));
  return configPorDefecto;
};

/**
 * GETTER: Obtiene el valor de aprobación automática global
 */
export const getAprobacionAutomatica = async (
  entrenadorId: string
): Promise<boolean> => {
  const config = await getConfiguracionAprobacion(entrenadorId);
  return config.aprobacionAutomatica;
};

/**
 * GETTER: Obtiene la configuración de aprobación para un tipo de sesión específico
 * Retorna la excepción si existe, o la configuración global si no hay excepción
 */
export const getAprobacionPorTipoSesion = async (
  entrenadorId: string,
  tipoSesionId: string
): Promise<boolean> => {
  const config = await getConfiguracionAprobacion(entrenadorId);
  
  // Si hay una excepción para este tipo de sesión, usar esa
  if (config.excepcionesPorTipoSesion && config.excepcionesPorTipoSesion[tipoSesionId] !== undefined) {
    return config.excepcionesPorTipoSesion[tipoSesionId];
  }
  
  // Si no hay excepción, usar la configuración global
  return config.aprobacionAutomatica;
};

/**
 * SETTER: Actualiza la configuración global de aprobación automática
 */
export const setAprobacionAutomatica = async (
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

/**
 * SETTER: Establece una excepción de aprobación para un tipo de sesión específico
 * 
 * @param tipoSesionId - ID del tipo de sesión o nombre del tipo (ej: 'presencial', 'videollamada', 'fisio')
 * @param aprobacionAutomatica - true para auto-aprobar, false para requerir aprobación manual
 */
export const setExcepcionPorTipoSesion = async (
  entrenadorId: string,
  tipoSesionId: string,
  aprobacionAutomatica: boolean
): Promise<ConfiguracionAprobacionReservas> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const config = await getConfiguracionAprobacion(entrenadorId);
  
  const excepciones = config.excepcionesPorTipoSesion || {};
  excepciones[tipoSesionId] = aprobacionAutomatica;
  
  const configActualizada: ConfiguracionAprobacionReservas = {
    ...config,
    excepcionesPorTipoSesion: excepciones,
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`configAprobacion_${entrenadorId}`, JSON.stringify(configActualizada));
  return configActualizada;
};

/**
 * SETTER: Elimina una excepción por tipo de sesión (vuelve a usar la configuración global)
 */
export const eliminarExcepcionPorTipoSesion = async (
  entrenadorId: string,
  tipoSesionId: string
): Promise<ConfiguracionAprobacionReservas> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const config = await getConfiguracionAprobacion(entrenadorId);
  
  if (config.excepcionesPorTipoSesion) {
    const excepciones = { ...config.excepcionesPorTipoSesion };
    delete excepciones[tipoSesionId];
    
    const configActualizada: ConfiguracionAprobacionReservas = {
      ...config,
      excepcionesPorTipoSesion: Object.keys(excepciones).length > 0 ? excepciones : undefined,
      updatedAt: new Date(),
    };
    
    localStorage.setItem(`configAprobacion_${entrenadorId}`, JSON.stringify(configActualizada));
    return configActualizada;
  }
  
  return config;
};

/**
 * GETTER: Obtiene todas las excepciones por tipo de sesión
 */
export const getExcepcionesPorTipoSesion = async (
  entrenadorId: string
): Promise<Record<string, boolean>> => {
  const config = await getConfiguracionAprobacion(entrenadorId);
  return config.excepcionesPorTipoSesion || {};
};

/**
 * Actualiza la configuración de aprobación de reservas (método legacy, mantenido para compatibilidad)
 * 
 * @deprecated Usar setAprobacionAutomatica en su lugar
 */
export const actualizarConfiguracionAprobacion = async (
  entrenadorId: string,
  aprobacionAutomatica: boolean
): Promise<ConfiguracionAprobacionReservas> => {
  return setAprobacionAutomatica(entrenadorId, aprobacionAutomatica);
};

/**
 * Verifica si una reserva debe ser auto-aprobada según la configuración
 * 
 * @param entrenadorId - ID del entrenador
 * @param tipoSesionId - ID del tipo de sesión (opcional)
 * @returns true si debe auto-aprobarse, false si requiere aprobación manual
 */
export const debeAutoAprobarReserva = async (
  entrenadorId: string,
  tipoSesionId?: string
): Promise<boolean> => {
  if (tipoSesionId) {
    return getAprobacionPorTipoSesion(entrenadorId, tipoSesionId);
  }
  return getAprobacionAutomatica(entrenadorId);
};


