import { FiltroPersonalizado, FiltrosBiblioteca } from '../types';

// Mock de filtros personalizados - en producción vendría de la API
const filtrosPersonalizadosMock: FiltroPersonalizado[] = [
  {
    id: '1',
    nombre: 'Recetas altas en proteína veganas < 20 min',
    descripcion: 'Recetas veganas con alto contenido proteico y preparación rápida',
    filtros: {
      tiposRecurso: ['receta'],
      proteinasMin: 20,
      tiempoPreparacionMax: 20,
      estilosCulinarios: ['vegano'],
    },
    creadoEn: '2024-12-20T10:00:00Z',
    actualizadoEn: '2024-12-20T10:00:00Z',
    usadoCount: 5,
    creadoPor: 'user-1',
  },
  {
    id: '2',
    nombre: 'Plantillas Keto',
    descripcion: 'Plantillas bajas en carbohidratos',
    filtros: {
      tiposRecurso: ['plantilla'],
      estilosCulinarios: ['keto'],
      carbohidratosMax: 50,
    },
    creadoEn: '2024-12-19T15:00:00Z',
    actualizadoEn: '2024-12-19T15:00:00Z',
    usadoCount: 3,
    creadoPor: 'user-1',
  },
];

/**
 * Obtiene todos los filtros personalizados del usuario
 */
export async function getFiltrosPersonalizados(): Promise<FiltroPersonalizado[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...filtrosPersonalizadosMock];
}

/**
 * Obtiene un filtro personalizado por ID
 */
export async function getFiltroPersonalizado(id: string): Promise<FiltroPersonalizado | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return filtrosPersonalizadosMock.find(f => f.id === id) || null;
}

/**
 * Guarda un nuevo filtro personalizado
 */
export async function guardarFiltroPersonalizado(
  nombre: string,
  filtros: FiltrosBiblioteca,
  descripcion?: string
): Promise<FiltroPersonalizado> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const nuevoFiltro: FiltroPersonalizado = {
    id: Date.now().toString(),
    nombre,
    descripcion,
    filtros,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    usadoCount: 0,
    creadoPor: 'user-1', // En producción vendría del contexto de autenticación
  };
  filtrosPersonalizadosMock.push(nuevoFiltro);
  return nuevoFiltro;
}

/**
 * Actualiza un filtro personalizado
 */
export async function actualizarFiltroPersonalizado(
  id: string,
  datos: Partial<Pick<FiltroPersonalizado, 'nombre' | 'descripcion' | 'filtros'>>
): Promise<FiltroPersonalizado | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const filtro = filtrosPersonalizadosMock.find(f => f.id === id);
  if (!filtro) return null;

  Object.assign(filtro, {
    ...datos,
    actualizadoEn: new Date().toISOString(),
  });
  return filtro;
}

/**
 * Elimina un filtro personalizado
 */
export async function eliminarFiltroPersonalizado(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = filtrosPersonalizadosMock.findIndex(f => f.id === id);
  if (index === -1) return false;
  filtrosPersonalizadosMock.splice(index, 1);
  return true;
}

/**
 * Incrementa el contador de uso de un filtro personalizado
 */
export async function usarFiltroPersonalizado(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const filtro = filtrosPersonalizadosMock.find(f => f.id === id);
  if (!filtro) return false;
  filtro.usadoCount++;
  filtro.actualizadoEn = new Date().toISOString();
  return true;
}

