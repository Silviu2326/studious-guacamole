// API para obtener datos del cliente
export interface ClienteData {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: Date;
  tarjetaActual?: {
    ultimosDigitos: string;
    tipo: string;
    fechaVencimiento: string;
  };
  membresiaActiva?: {
    nombre: string;
    fechaInicio: Date;
    fechaFin?: Date;
    estado: 'activa' | 'pausada' | 'vencida';
  };
  fechaRegistro: Date;
}

const mockClienteData: ClienteData = {
  id: 'cliente1',
  nombre: 'Juan Pérez',
  email: 'juan.perez@example.com',
  telefono: '+34 600 123 456',
  direccion: 'Calle Principal 123, Madrid',
  fechaNacimiento: new Date('1990-05-15'),
  tarjetaActual: {
    ultimosDigitos: '4242',
    tipo: 'Visa',
    fechaVencimiento: '12/25'
  },
  membresiaActiva: {
    nombre: 'Membresía Premium',
    fechaInicio: new Date('2024-01-01'),
    fechaFin: new Date('2024-12-31'),
    estado: 'activa'
  },
  fechaRegistro: new Date('2023-06-01')
};

export const clienteAPI = {
  async obtenerCliente(): Promise<ClienteData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockClienteData;
  }
};

