import { ColeccionRecursos, TipoRecurso } from '../types';

// Mock de colecciones - en producción vendría de la API
const coleccionesMock: ColeccionRecursos[] = [
  {
    id: '1',
    nombre: 'Recetas Rápidas',
    descripcion: 'Recetas que se preparan en menos de 20 minutos',
    color: '#3B82F6',
    recursos: [
      { id: 'receta-1', tipo: 'receta', agregadoEn: '2024-12-20T10:00:00Z' },
      { id: 'receta-2', tipo: 'receta', agregadoEn: '2024-12-20T10:05:00Z' },
    ],
    creadoEn: '2024-12-20T10:00:00Z',
    actualizadoEn: '2024-12-20T10:05:00Z',
    creadoPor: 'user-1',
  },
  {
    id: '2',
    nombre: 'Plantillas Altas en Proteína',
    descripcion: 'Plantillas ideales para ganancia muscular',
    color: '#10B981',
    recursos: [
      { id: 'plan-2200', tipo: 'plantilla', agregadoEn: '2024-12-19T15:00:00Z' },
    ],
    creadoEn: '2024-12-19T15:00:00Z',
    actualizadoEn: '2024-12-19T15:00:00Z',
    creadoPor: 'user-1',
  },
];

/**
 * Obtiene todas las colecciones del usuario
 */
export async function getColecciones(): Promise<ColeccionRecursos[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...coleccionesMock];
}

/**
 * Obtiene una colección por ID
 */
export async function getColeccion(id: string): Promise<ColeccionRecursos | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return coleccionesMock.find(c => c.id === id) || null;
}

/**
 * Crea una nueva colección
 */
export async function crearColeccion(
  nombre: string,
  descripcion?: string,
  color?: string
): Promise<ColeccionRecursos> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const nuevaColeccion: ColeccionRecursos = {
    id: Date.now().toString(),
    nombre,
    descripcion,
    color: color || '#3B82F6',
    recursos: [],
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    creadoPor: 'user-1', // En producción vendría del contexto de autenticación
  };
  coleccionesMock.push(nuevaColeccion);
  return nuevaColeccion;
}

/**
 * Actualiza una colección
 */
export async function actualizarColeccion(
  id: string,
  datos: Partial<Pick<ColeccionRecursos, 'nombre' | 'descripcion' | 'color'>>
): Promise<ColeccionRecursos | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const coleccion = coleccionesMock.find(c => c.id === id);
  if (!coleccion) return null;

  Object.assign(coleccion, {
    ...datos,
    actualizadoEn: new Date().toISOString(),
  });
  return coleccion;
}

/**
 * Elimina una colección
 */
export async function eliminarColeccion(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = coleccionesMock.findIndex(c => c.id === id);
  if (index === -1) return false;
  coleccionesMock.splice(index, 1);
  return true;
}

/**
 * Agrega un recurso a una colección
 */
export async function agregarRecursoAColeccion(
  coleccionId: string,
  recursoId: string,
  tipo: TipoRecurso
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const coleccion = coleccionesMock.find(c => c.id === coleccionId);
  if (!coleccion) return false;

  // Verificar que no esté ya agregado
  if (coleccion.recursos.some(r => r.id === recursoId && r.tipo === tipo)) {
    return false;
  }

  coleccion.recursos.push({
    id: recursoId,
    tipo,
    agregadoEn: new Date().toISOString(),
  });
  coleccion.actualizadoEn = new Date().toISOString();
  return true;
}

/**
 * Remueve un recurso de una colección
 */
export async function removerRecursoDeColeccion(
  coleccionId: string,
  recursoId: string,
  tipo: TipoRecurso
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const coleccion = coleccionesMock.find(c => c.id === coleccionId);
  if (!coleccion) return false;

  const index = coleccion.recursos.findIndex(
    r => r.id === recursoId && r.tipo === tipo
  );
  if (index === -1) return false;

  coleccion.recursos.splice(index, 1);
  coleccion.actualizadoEn = new Date().toISOString();
  return true;
}

/**
 * Ancla/desancla un recurso como favorito
 */
export async function toggleFavoritoRecurso(
  recursoId: string,
  tipo: TipoRecurso,
  esFavorito: boolean
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  // En producción, esto actualizaría el estado del recurso en la base de datos
  // Por ahora solo simulamos la operación
  return true;
}

