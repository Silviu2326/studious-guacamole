import type { ComentarioProfesional, RespuestaComentarioProfesional, MencionProfesional } from '../types';

// Mock de profesionales disponibles (en producción vendría de la API)
const profesionalesMock: MencionProfesional[] = [
  { profesionalId: 'entrenador-1', profesionalNombre: 'Juan Pérez', tipo: 'entrenador' },
  { profesionalId: 'entrenador-2', profesionalNombre: 'María García', tipo: 'entrenador' },
  { profesionalId: 'medico-1', profesionalNombre: 'Dr. Carlos López', tipo: 'medico' },
  { profesionalId: 'fisio-1', profesionalNombre: 'Ana Martínez', tipo: 'fisioterapeuta' },
];

// Mock de comentarios almacenados
let comentariosMock: ComentarioProfesional[] = [];

/**
 * Obtener profesionales disponibles para mencionar
 */
export async function getProfesionalesDisponibles(
  clienteId?: string
): Promise<MencionProfesional[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // En producción, filtraría por los profesionales asignados al cliente
  return profesionalesMock;
}

/**
 * Obtener comentarios para una dieta
 */
export async function getComentariosProfesionales(
  dietaId: string
): Promise<ComentarioProfesional[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const comentarios = comentariosMock.filter(c => c.dietaId === dietaId);
  return comentarios;
}

/**
 * Obtener comentarios para una comida específica
 */
export async function getComentariosPorComida(
  dietaId: string,
  comidaId: string
): Promise<ComentarioProfesional[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const comentarios = comentariosMock.filter(
    c => c.dietaId === dietaId && c.comidaId === comidaId
  );
  return comentarios;
}

/**
 * Crear un nuevo comentario para profesionales
 */
export async function crearComentarioProfesional(
  comentario: Omit<ComentarioProfesional, 'id' | 'creadoEn' | 'actualizadoEn' | 'resuelto' | 'respuestas'>
): Promise<ComentarioProfesional> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const nuevoComentario: ComentarioProfesional = {
    ...comentario,
    id: `comentario-${Date.now()}`,
    resuelto: false,
    respuestas: [],
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  
  comentariosMock.push(nuevoComentario);
  
  // En producción, notificaría a los profesionales mencionados
  // await notificarProfesionalesMencionados(nuevoComentario);
  
  return nuevoComentario;
}

/**
 * Actualizar un comentario
 */
export async function actualizarComentarioProfesional(
  comentarioId: string,
  actualizacion: Partial<ComentarioProfesional>
): Promise<ComentarioProfesional> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = comentariosMock.findIndex(c => c.id === comentarioId);
  if (index === -1) {
    throw new Error('Comentario no encontrado');
  }
  
  comentariosMock[index] = {
    ...comentariosMock[index],
    ...actualizacion,
    actualizadoEn: new Date().toISOString(),
  };
  
  return comentariosMock[index];
}

/**
 * Marcar un comentario como resuelto
 */
export async function marcarComentarioResuelto(
  comentarioId: string
): Promise<ComentarioProfesional> {
  return actualizarComentarioProfesional(comentarioId, {
    resuelto: true,
    fechaResolucion: new Date().toISOString(),
  });
}

/**
 * Agregar una respuesta a un comentario
 */
export async function agregarRespuestaComentario(
  comentarioId: string,
  respuesta: Omit<RespuestaComentarioProfesional, 'id' | 'creadoEn' | 'actualizadoEn'>
): Promise<RespuestaComentarioProfesional> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const nuevaRespuesta: RespuestaComentarioProfesional = {
    ...respuesta,
    id: `respuesta-${Date.now()}`,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  
  const index = comentariosMock.findIndex(c => c.id === comentarioId);
  if (index === -1) {
    throw new Error('Comentario no encontrado');
  }
  
  if (!comentariosMock[index].respuestas) {
    comentariosMock[index].respuestas = [];
  }
  
  comentariosMock[index].respuestas!.push(nuevaRespuesta);
  comentariosMock[index].actualizadoEn = new Date().toISOString();
  
  return nuevaRespuesta;
}

/**
 * Eliminar un comentario
 */
export async function eliminarComentarioProfesional(
  comentarioId: string
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = comentariosMock.findIndex(c => c.id === comentarioId);
  if (index === -1) {
    return false;
  }
  
  comentariosMock.splice(index, 1);
  return true;
}

