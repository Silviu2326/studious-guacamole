import { BonoActivo } from '../types';

// Simulación de almacenamiento en memoria (en producción sería una base de datos)
// Los bonos se crean cuando un cliente compra un paquete
let bonosStorage: BonoActivo[] = [
  {
    id: 'b1',
    paqueteId: 'p1',
    paqueteNombre: 'Paquete Básico 5 Sesiones',
    clienteId: 'client_1',
    clienteNombre: 'Juan Pérez',
    sesionesTotal: 5,
    sesionesUsadas: 2,
    sesionesRestantes: 3,
    fechaCompra: new Date('2024-01-20'),
    fechaVencimiento: new Date('2024-04-20'),
    estado: 'activo',
    precio: 225,
  },
  {
    id: 'b2',
    paqueteId: 'p2',
    paqueteNombre: 'Paquete Estándar 10 Sesiones',
    clienteId: 'client_2',
    clienteNombre: 'María García',
    sesionesTotal: 10,
    sesionesUsadas: 7,
    sesionesRestantes: 3,
    fechaCompra: new Date('2024-01-15'),
    fechaVencimiento: new Date('2024-07-15'),
    estado: 'activo',
    precio: 425,
  },
  {
    id: 'b3',
    paqueteId: 'p3',
    paqueteNombre: 'Paquete Premium 20 Sesiones',
    clienteId: 'client_1',
    clienteNombre: 'Juan Pérez',
    sesionesTotal: 20,
    sesionesUsadas: 0,
    sesionesRestantes: 20,
    fechaCompra: new Date('2024-02-01'),
    fechaVencimiento: new Date('2025-02-01'),
    estado: 'activo',
    precio: 800,
  },
  {
    id: 'b4',
    paqueteId: 'p2',
    paqueteNombre: 'Paquete Estándar 10 Sesiones',
    clienteId: 'client_4',
    clienteNombre: 'Ana Martínez',
    sesionesTotal: 10,
    sesionesUsadas: 3,
    sesionesRestantes: 7,
    fechaCompra: new Date('2024-02-10'),
    fechaVencimiento: new Date('2024-08-10'),
    estado: 'activo',
    precio: 425,
  },
];

/**
 * Obtener bonos activos de un cliente
 */
export const getBonosActivosCliente = async (
  clienteId: string,
  entrenadorId?: string
): Promise<BonoActivo[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let bonos = bonosStorage.filter(
    b => b.clienteId === clienteId && b.estado === 'activo'
  );
  
  // Verificar si los bonos están vencidos o agotados
  const ahora = new Date();
  bonos = bonos.map(bono => {
    if (bono.sesionesRestantes === 0) {
      return { ...bono, estado: 'agotado' as const };
    }
    if (bono.fechaVencimiento < ahora) {
      return { ...bono, estado: 'vencido' as const };
    }
    return bono;
  });
  
  // Actualizar el storage con los estados actualizados
  bonos.forEach(bonoActualizado => {
    const indice = bonosStorage.findIndex(b => b.id === bonoActualizado.id);
    if (indice !== -1) {
      bonosStorage[indice] = bonoActualizado;
    }
  });
  
  // Filtrar solo los activos
  return bonos.filter(b => b.estado === 'activo');
};

/**
 * Obtener un bono por ID
 */
export const getBonoPorId = async (bonoId: string): Promise<BonoActivo | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return bonosStorage.find(b => b.id === bonoId) || null;
};

/**
 * Crear un nuevo bono (cuando un cliente compra un paquete)
 */
export const crearBono = async (
  bono: Omit<BonoActivo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<BonoActivo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevoBono: BonoActivo = {
    ...bono,
    id: `b${Date.now()}`,
  };
  
  bonosStorage.push(nuevoBono);
  return nuevoBono;
};

/**
 * Usar una sesión de un bono (descontar una sesión)
 */
export const usarSesionBono = async (bonoId: string): Promise<BonoActivo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const indice = bonosStorage.findIndex(b => b.id === bonoId);
  
  if (indice === -1) {
    throw new Error('Bono no encontrado');
  }
  
  const bono = bonosStorage[indice];
  
  if (bono.sesionesRestantes <= 0) {
    throw new Error('El bono no tiene sesiones disponibles');
  }
  
  if (bono.fechaVencimiento < new Date()) {
    throw new Error('El bono está vencido');
  }
  
  if (bono.estado !== 'activo') {
    throw new Error('El bono no está activo');
  }
  
  // Descontar una sesión
  bonosStorage[indice] = {
    ...bono,
    sesionesUsadas: bono.sesionesUsadas + 1,
    sesionesRestantes: bono.sesionesRestantes - 1,
    estado: bono.sesionesRestantes - 1 === 0 ? 'agotado' : 'activo',
  };
  
  return bonosStorage[indice];
};

/**
 * Reembolsar una sesión de un bono (si se cancela una reserva)
 */
export const reembolsarSesionBono = async (bonoId: string): Promise<BonoActivo> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const indice = bonosStorage.findIndex(b => b.id === bonoId);
  
  if (indice === -1) {
    throw new Error('Bono no encontrado');
  }
  
  const bono = bonosStorage[indice];
  
  // Reembolsar una sesión
  bonosStorage[indice] = {
    ...bono,
    sesionesUsadas: Math.max(0, bono.sesionesUsadas - 1),
    sesionesRestantes: Math.min(bono.sesionesTotal, bono.sesionesRestantes + 1),
    estado: 'activo', // Reactivar si estaba agotado
  };
  
  return bonosStorage[indice];
};

