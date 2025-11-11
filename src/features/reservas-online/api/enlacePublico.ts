import { EnlacePublico } from '../types';

/**
 * Genera un token único para el enlace público
 */
const generarToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Obtiene el enlace público de un entrenador
 */
export const getEnlacePublico = async (entrenadorId: string): Promise<EnlacePublico | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulación: obtener enlace público desde el backend
  // En producción, esto haría una llamada real a la API
  const enlaceGuardado = localStorage.getItem(`enlacePublico_${entrenadorId}`);
  
  if (enlaceGuardado) {
    return JSON.parse(enlaceGuardado);
  }
  
  return null;
};

/**
 * Crea o actualiza un enlace público para un entrenador
 */
export const crearOActualizarEnlacePublico = async (
  entrenadorId: string,
  datos: {
    activo?: boolean;
    nombrePersonalizado?: string;
    descripcion?: string;
  }
): Promise<EnlacePublico> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Verificar si ya existe un enlace
  const enlaceExistente = await getEnlacePublico(entrenadorId);
  
  if (enlaceExistente) {
    // Actualizar enlace existente
    const enlaceActualizado: EnlacePublico = {
      ...enlaceExistente,
      ...datos,
      updatedAt: new Date(),
    };
    
    localStorage.setItem(`enlacePublico_${entrenadorId}`, JSON.stringify(enlaceActualizado));
    return enlaceActualizado;
  }
  
  // Crear nuevo enlace
  const nuevoEnlace: EnlacePublico = {
    id: `enlace_${Date.now()}`,
    entrenadorId,
    token: generarToken(),
    activo: datos.activo ?? true,
    nombrePersonalizado: datos.nombrePersonalizado,
    descripcion: datos.descripcion,
    visitas: 0,
    reservasDesdeEnlace: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`enlacePublico_${entrenadorId}`, JSON.stringify(nuevoEnlace));
  return nuevoEnlace;
};

/**
 * Obtiene un enlace público por su token (para la página pública)
 */
export const getEnlacePublicoPorToken = async (token: string): Promise<EnlacePublico | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulación: buscar enlace por token
  // En producción, esto haría una llamada real a la API
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('enlacePublico_')) {
      const enlace: EnlacePublico = JSON.parse(localStorage.getItem(key) || '{}');
      if (enlace.token === token && enlace.activo) {
        // Incrementar contador de visitas
        enlace.visitas += 1;
        enlace.updatedAt = new Date();
        localStorage.setItem(key, JSON.stringify(enlace));
        return enlace;
      }
    }
  }
  
  return null;
};

/**
 * Incrementa el contador de reservas desde el enlace
 */
export const incrementarReservasDesdeEnlace = async (token: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Buscar y actualizar el contador
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('enlacePublico_')) {
      const enlace: EnlacePublico = JSON.parse(localStorage.getItem(key) || '{}');
      if (enlace.token === token) {
        enlace.reservasDesdeEnlace += 1;
        enlace.updatedAt = new Date();
        localStorage.setItem(key, JSON.stringify(enlace));
        break;
      }
    }
  }
};

/**
 * Regenera el token de un enlace público
 */
export const regenerarTokenEnlace = async (entrenadorId: string): Promise<EnlacePublico> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const enlace = await getEnlacePublico(entrenadorId);
  if (!enlace) {
    throw new Error('Enlace público no encontrado');
  }
  
  const enlaceActualizado: EnlacePublico = {
    ...enlace,
    token: generarToken(),
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`enlacePublico_${entrenadorId}`, JSON.stringify(enlaceActualizado));
  return enlaceActualizado;
};


