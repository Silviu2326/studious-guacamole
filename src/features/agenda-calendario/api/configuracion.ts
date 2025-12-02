import { ConfiguracionTiempoDescanso } from '../types';

// Obtener configuración de tiempo de descanso para un usuario
export const getConfiguracionTiempoDescanso = async (userId?: string): Promise<ConfiguracionTiempoDescanso> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      // Por defecto, 15 minutos de descanso entre sesiones
      resolve({
        id: '1',
        tiempoMinimoMinutos: 15,
        activo: true,
        permitirOverride: true,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }, 300);
  });
};

// Actualizar configuración de tiempo de descanso
export const actualizarConfiguracionTiempoDescanso = async (
  configuracion: Partial<ConfiguracionTiempoDescanso>
): Promise<ConfiguracionTiempoDescanso> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      resolve({
        id: configuracion.id || '1',
        tiempoMinimoMinutos: configuracion.tiempoMinimoMinutos ?? 15,
        activo: configuracion.activo ?? true,
        permitirOverride: configuracion.permitirOverride ?? true,
        userId: configuracion.userId,
        createdAt: configuracion.createdAt || new Date(),
        updatedAt: new Date(),
      });
    }, 300);
  });
};


