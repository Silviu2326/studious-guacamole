// API para gestión de perfil del cliente
export interface PerfilData {
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: Date;
}

export interface CambioPasswordData {
  passwordActual: string;
  passwordNuevo: string;
  passwordConfirmacion: string;
}

export const perfilAPI = {
  async actualizarPerfil(datos: Partial<PerfilData>): Promise<PerfilData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular actualización
    return {
      nombre: datos.nombre || 'Juan Pérez',
      email: datos.email || 'juan.perez@example.com',
      telefono: datos.telefono,
      direccion: datos.direccion,
      fechaNacimiento: datos.fechaNacimiento
    };
  },

  async cambiarPassword(datos: CambioPasswordData): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validaciones básicas
    if (datos.passwordNuevo !== datos.passwordConfirmacion) {
      throw new Error('Las contraseñas no coinciden');
    }
    
    if (datos.passwordNuevo.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    
    // Simular cambio de contraseña
    return;
  }
};

