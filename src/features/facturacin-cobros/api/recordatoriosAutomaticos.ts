import { ConfiguracionRecordatoriosAutomaticos } from '../types';

// Mock data para desarrollo
let configuracionActual: ConfiguracionRecordatoriosAutomaticos | null = null;

export const recordatoriosAutomaticosAPI = {
  // Obtener configuración actual
  async obtenerConfiguracion(): Promise<ConfiguracionRecordatoriosAutomaticos | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!configuracionActual) {
      // Configuración por defecto
      return {
        id: 'config-default',
        activo: false,
        recordatorio3DiasAntes: true,
        recordatorioDiaVencimiento: true,
        recordatorio3DiasDespues: true,
        mediosEnvio: ['email'],
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        usuarioCreacion: 'system'
      };
    }
    
    return configuracionActual;
  },

  // Guardar configuración
  async guardarConfiguracion(
    configuracion: Omit<ConfiguracionRecordatoriosAutomaticos, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'usuarioCreacion'>
  ): Promise<ConfiguracionRecordatoriosAutomaticos> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const ahora = new Date();
    
    if (!configuracionActual) {
      configuracionActual = {
        ...configuracion,
        id: 'config-' + Date.now(),
        fechaCreacion: ahora,
        fechaActualizacion: ahora,
        usuarioCreacion: 'system'
      };
    } else {
      configuracionActual = {
        ...configuracionActual,
        ...configuracion,
        fechaActualizacion: ahora
      };
    }
    
    console.log('[Recordatorios Automáticos] Configuración guardada:', configuracionActual);
    
    return configuracionActual;
  },

  // Activar/desactivar recordatorios automáticos
  async activarRecordatorios(activo: boolean): Promise<ConfiguracionRecordatoriosAutomaticos> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const config = await this.obtenerConfiguracion();
    if (!config) {
      throw new Error('Configuración no encontrada');
    }
    
    return this.guardarConfiguracion({
      ...config,
      activo
    });
  }
};


