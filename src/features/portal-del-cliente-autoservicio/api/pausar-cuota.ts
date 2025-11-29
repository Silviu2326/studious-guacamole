// API para pausar cuota temporalmente
export interface PausarCuotaData {
  fechaInicio: Date;
  fechaFin: Date;
  motivo?: string;
}

export interface EstadoPausa {
  estaPausada: boolean;
  fechaInicioPausa?: Date;
  fechaFinPausa?: Date;
  motivo?: string;
}

let estadoPausaActual: EstadoPausa = {
  estaPausada: false
};

export const pausarCuotaAPI = {
  async obtenerEstadoPausa(): Promise<EstadoPausa> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return estadoPausaActual;
  },

  async pausarCuota(datos: PausarCuotaData): Promise<EstadoPausa> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Validaciones
    if (datos.fechaInicio >= datos.fechaFin) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }
    
    const fechaActual = new Date();
    if (datos.fechaInicio < fechaActual) {
      throw new Error('La fecha de inicio no puede ser anterior a hoy');
    }
    
    const diasDiferencia = Math.floor((datos.fechaFin.getTime() - datos.fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    if (diasDiferencia > 90) {
      throw new Error('La pausa no puede exceder 90 días');
    }
    
    // Actualizar estado
    estadoPausaActual = {
      estaPausada: true,
      fechaInicioPausa: datos.fechaInicio,
      fechaFinPausa: datos.fechaFin,
      motivo: datos.motivo
    };
    
    return estadoPausaActual;
  },

  async reactivarCuota(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    estadoPausaActual = {
      estaPausada: false
    };
  }
};

