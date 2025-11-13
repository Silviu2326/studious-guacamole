import { EtiquetaAdherenciaRecurso, NivelAdherencia, NivelSatisfaccion, RecursoBiblioteca } from '../types';

// Mock de etiquetas de adherencia - en producción vendría de la API
const etiquetasMock: EtiquetaAdherenciaRecurso[] = [
  {
    recursoId: 'receta-1',
    nivelAdherencia: 'excelente',
    nivelSatisfaccion: 'muy-alto',
    observaciones: 'El cliente muestra excelente adherencia y alta satisfacción con esta receta',
    etiquetadoPor: 'user-1',
    etiquetadoEn: '2024-12-20T10:00:00Z',
    actualizadoEn: '2024-12-20T10:00:00Z',
  },
  {
    recursoId: 'receta-2',
    nivelAdherencia: 'muy-bueno',
    nivelSatisfaccion: 'alto',
    etiquetadoPor: 'user-1',
    etiquetadoEn: '2024-12-20T10:00:00Z',
    actualizadoEn: '2024-12-20T10:00:00Z',
  },
];

/**
 * Obtiene las etiquetas de adherencia/satisfacción para un recurso
 */
export async function getEtiquetasAdherenciaRecurso(
  recursoId: string,
  clienteId?: string
): Promise<EtiquetaAdherenciaRecurso | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const etiqueta = etiquetasMock.find(
    e => e.recursoId === recursoId && (clienteId ? e.clienteId === clienteId : !e.clienteId)
  );
  
  return etiqueta || null;
}

/**
 * Obtiene todas las etiquetas de adherencia/satisfacción
 */
export async function getEtiquetasAdherencia(
  clienteId?: string
): Promise<EtiquetaAdherenciaRecurso[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (clienteId) {
    return etiquetasMock.filter(e => e.clienteId === clienteId || !e.clienteId);
  }
  
  return etiquetasMock.filter(e => !e.clienteId); // Solo etiquetas globales si no se especifica cliente
}

/**
 * Crea o actualiza una etiqueta de adherencia/satisfacción para un recurso
 */
export async function guardarEtiquetaAdherencia(
  recursoId: string,
  datos: {
    nivelAdherencia?: NivelAdherencia;
    nivelSatisfaccion?: NivelSatisfaccion;
    observaciones?: string;
    clienteId?: string;
  }
): Promise<EtiquetaAdherenciaRecurso> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const ahora = new Date().toISOString();
  const etiquetaExistente = etiquetasMock.findIndex(
    e => e.recursoId === recursoId && (datos.clienteId ? e.clienteId === datos.clienteId : !e.clienteId)
  );
  
  const nuevaEtiqueta: EtiquetaAdherenciaRecurso = {
    recursoId,
    clienteId: datos.clienteId,
    nivelAdherencia: datos.nivelAdherencia,
    nivelSatisfaccion: datos.nivelSatisfaccion,
    observaciones: datos.observaciones,
    etiquetadoPor: 'user-1', // En producción vendría del contexto de autenticación
    etiquetadoEn: etiquetaExistente >= 0 ? etiquetasMock[etiquetaExistente].etiquetadoEn : ahora,
    actualizadoEn: ahora,
  };
  
  if (etiquetaExistente >= 0) {
    etiquetasMock[etiquetaExistente] = nuevaEtiqueta;
  } else {
    etiquetasMock.push(nuevaEtiqueta);
  }
  
  return nuevaEtiqueta;
}

/**
 * Elimina una etiqueta de adherencia/satisfacción
 */
export async function eliminarEtiquetaAdherencia(
  recursoId: string,
  clienteId?: string
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = etiquetasMock.findIndex(
    e => e.recursoId === recursoId && (clienteId ? e.clienteId === clienteId : !e.clienteId)
  );
  
  if (index >= 0) {
    etiquetasMock.splice(index, 1);
    return true;
  }
  
  return false;
}

/**
 * Obtiene recursos con sus etiquetas de adherencia aplicadas
 */
export async function aplicarEtiquetasARecursos(
  recursos: RecursoBiblioteca[],
  clienteId?: string
): Promise<RecursoBiblioteca[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const etiquetas = await getEtiquetasAdherencia(clienteId);
  
  return recursos.map(recurso => {
    const etiqueta = etiquetas.find(e => e.recursoId === recurso.id);
    if (etiqueta) {
      return {
        ...recurso,
        nivelAdherencia: etiqueta.nivelAdherencia,
        nivelSatisfaccion: etiqueta.nivelSatisfaccion,
      };
    }
    return recurso;
  });
}

