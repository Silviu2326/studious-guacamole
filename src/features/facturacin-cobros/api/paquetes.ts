import { PaquetePrepago, DescuentoSesion } from '../types/paquetes';

// Mock data para desarrollo
const mockPaquetes: PaquetePrepago[] = [
  {
    id: 'paq1',
    clienteId: 'cliente1',
    clienteNombre: 'Juan Pérez',
    nombrePaquete: 'Paquete 10 Sesiones',
    sesionesTotales: 10,
    sesionesUsadas: 3,
    sesionesDisponibles: 7,
    precioTotal: 450000,
    precioPorSesion: 45000,
    fechaCompra: new Date('2024-01-01'),
    fechaVencimiento: new Date('2024-07-01'),
    estado: 'activo',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'paq2',
    clienteId: 'cliente2',
    clienteNombre: 'María García',
    nombrePaquete: 'Paquete 20 Sesiones',
    sesionesTotales: 20,
    sesionesUsadas: 15,
    sesionesDisponibles: 5,
    precioTotal: 850000,
    precioPorSesion: 42500,
    fechaCompra: new Date('2023-12-01'),
    fechaVencimiento: new Date('2024-06-01'),
    estado: 'activo',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-10'),
  },
];

export const paquetesAPI = {
  // Obtener paquetes de un cliente
  async obtenerPaquetesCliente(clienteId: string): Promise<PaquetePrepago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPaquetes.filter(p => p.clienteId === clienteId && p.estado === 'activo');
  },

  // Obtener un paquete por ID
  async obtenerPaquete(id: string): Promise<PaquetePrepago | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPaquetes.find(p => p.id === id) || null;
  },

  // Descontar una sesión de un paquete
  async descontarSesion(paqueteId: string): Promise<DescuentoSesion> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const paquete = mockPaquetes.find(p => p.id === paqueteId);
    if (!paquete) {
      throw new Error('Paquete no encontrado');
    }
    
    if (paquete.sesionesDisponibles <= 0) {
      throw new Error('No hay sesiones disponibles en el paquete');
    }
    
    const sesionesAntes = paquete.sesionesDisponibles;
    paquete.sesionesUsadas += 1;
    paquete.sesionesDisponibles -= 1;
    
    if (paquete.sesionesDisponibles === 0) {
      paquete.estado = 'agotado';
    }
    
    paquete.updatedAt = new Date();
    
    return {
      paqueteId: paquete.id,
      sesionesAntes,
      sesionesDespues: paquete.sesionesDisponibles,
      sesionesDescontadas: 1,
      fechaDescuento: new Date(),
    };
  },

  // Crear un nuevo paquete
  async crearPaquete(paquete: Omit<PaquetePrepago, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaquetePrepago> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nuevoPaquete: PaquetePrepago = {
      ...paquete,
      id: `paq${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockPaquetes.push(nuevoPaquete);
    return nuevoPaquete;
  },
};


