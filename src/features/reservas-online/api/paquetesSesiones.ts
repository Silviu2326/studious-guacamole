import { PaqueteSesiones } from '../types';

// Simulación de almacenamiento en memoria (en producción sería una base de datos)
let paquetesStorage: PaqueteSesiones[] = [
  {
    id: 'p1',
    entrenadorId: '1',
    nombre: 'Paquete Básico 5 Sesiones',
    descripcion: 'Perfecto para comenzar tu entrenamiento personalizado',
    numeroSesiones: 5,
    precioPorSesion: 50,
    precioTotal: 225,
    descuento: 10,
    validezMeses: 3,
    tipoSesion: 'ambos',
    tipoEntrenamiento: 'sesion-1-1',
    activo: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'p2',
    entrenadorId: '1',
    nombre: 'Paquete Estándar 10 Sesiones',
    descripcion: 'La opción más popular para entrenamientos regulares',
    numeroSesiones: 10,
    precioPorSesion: 50,
    precioTotal: 425,
    descuento: 15,
    validezMeses: 6,
    tipoSesion: 'ambos',
    tipoEntrenamiento: 'sesion-1-1',
    activo: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'p3',
    entrenadorId: '1',
    nombre: 'Paquete Premium 20 Sesiones',
    descripcion: 'Máximo valor para entrenamientos intensivos',
    numeroSesiones: 20,
    precioPorSesion: 50,
    precioTotal: 800,
    descuento: 20,
    validezMeses: 12,
    tipoSesion: 'ambos',
    tipoEntrenamiento: 'sesion-1-1',
    activo: true,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
];

/**
 * Obtener todos los paquetes de sesiones de un entrenador
 */
export const getPaquetesSesiones = async (entrenadorId: string): Promise<PaqueteSesiones[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return paquetesStorage.filter(p => p.entrenadorId === entrenadorId);
};

/**
 * Obtener paquetes activos de un entrenador
 */
export const getPaquetesSesionesActivos = async (entrenadorId: string): Promise<PaqueteSesiones[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return paquetesStorage.filter(p => p.entrenadorId === entrenadorId && p.activo);
};

/**
 * Obtener un paquete por ID
 */
export const getPaqueteSesionesPorId = async (
  entrenadorId: string,
  paqueteId: string
): Promise<PaqueteSesiones | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const paquete = paquetesStorage.find(
    p => p.id === paqueteId && p.entrenadorId === entrenadorId
  );
  return paquete || null;
};

/**
 * Crear un nuevo paquete de sesiones
 */
export const crearPaqueteSesiones = async (
  entrenadorId: string,
  paquete: Omit<PaqueteSesiones, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>
): Promise<PaqueteSesiones> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevoPaquete: PaqueteSesiones = {
    ...paquete,
    id: `p${Date.now()}`,
    entrenadorId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  paquetesStorage.push(nuevoPaquete);
  return nuevoPaquete;
};

/**
 * Actualizar un paquete de sesiones
 */
export const actualizarPaqueteSesiones = async (
  entrenadorId: string,
  paqueteId: string,
  datos: Partial<Omit<PaqueteSesiones, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>>
): Promise<PaqueteSesiones> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const indice = paquetesStorage.findIndex(
    p => p.id === paqueteId && p.entrenadorId === entrenadorId
  );
  
  if (indice === -1) {
    throw new Error('Paquete no encontrado');
  }
  
  paquetesStorage[indice] = {
    ...paquetesStorage[indice],
    ...datos,
    updatedAt: new Date(),
  };
  
  return paquetesStorage[indice];
};

/**
 * Eliminar un paquete de sesiones (soft delete - desactivar)
 */
export const eliminarPaqueteSesiones = async (
  entrenadorId: string,
  paqueteId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const indice = paquetesStorage.findIndex(
    p => p.id === paqueteId && p.entrenadorId === entrenadorId
  );
  
  if (indice === -1) {
    throw new Error('Paquete no encontrado');
  }
  
  // Soft delete - desactivar en lugar de eliminar
  paquetesStorage[indice] = {
    ...paquetesStorage[indice],
    activo: false,
    updatedAt: new Date(),
  };
};


