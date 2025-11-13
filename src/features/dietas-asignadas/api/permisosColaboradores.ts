import {
  PermisoColaborador,
  TipoPermisoDieta,
  SugerenciaColaborador,
  HistorialPermisos,
  ComentarioSugerencia,
} from '../types';

// Mock data para desarrollo
const permisosMock: PermisoColaborador[] = [];
const sugerenciasMock: SugerenciaColaborador[] = [];
const historialMock: HistorialPermisos[] = [];

/**
 * Obtiene los permisos de una dieta
 */
export const getPermisosDieta = async (dietaId: string): Promise<PermisoColaborador[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return permisosMock.filter(p => p.dietaId === dietaId && p.activo);
};

/**
 * Obtiene un permiso por ID
 */
export const getPermiso = async (permisoId: string): Promise<PermisoColaborador | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const permiso = permisosMock.find(p => p.id === permisoId);
  return permiso || null;
};

/**
 * Asigna un permiso a un colaborador
 */
export const asignarPermiso = async (
  datos: Omit<PermisoColaborador, 'id' | 'asignadoEn' | 'actualizadoEn'>
): Promise<PermisoColaborador> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generar permisos según el tipo
  const permisos = getPermisosPorTipo(datos.tipo);
  
  const nuevoPermiso: PermisoColaborador = {
    ...datos,
    id: `permiso_${Date.now()}`,
    permisos,
    asignadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    activo: true,
  };
  
  permisosMock.push(nuevoPermiso);
  
  // Registrar en historial
  historialMock.push({
    id: `historial_${Date.now()}`,
    dietaId: datos.dietaId,
    colaboradorId: datos.colaboradorId,
    accion: 'asignado',
    permisosNuevos: datos.tipo,
    realizadoPor: datos.asignadoPor,
    realizadoPorNombre: datos.asignadoPorNombre,
    fecha: new Date().toISOString(),
  });
  
  return nuevoPermiso;
};

/**
 * Actualiza un permiso
 */
export const actualizarPermiso = async (
  permisoId: string,
  actualizaciones: Partial<PermisoColaborador>
): Promise<PermisoColaborador> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = permisosMock.findIndex(p => p.id === permisoId);
  if (index === -1) {
    throw new Error('Permiso no encontrado');
  }
  
  const permisoAnterior = { ...permisosMock[index] };
  
  permisosMock[index] = {
    ...permisosMock[index],
    ...actualizaciones,
    actualizadoEn: new Date().toISOString(),
  };
  
  // Si cambió el tipo, actualizar permisos
  if (actualizaciones.tipo && actualizaciones.tipo !== permisoAnterior.tipo) {
    permisosMock[index].permisos = getPermisosPorTipo(actualizaciones.tipo);
    
    // Registrar en historial
    historialMock.push({
      id: `historial_${Date.now()}`,
      dietaId: permisosMock[index].dietaId,
      colaboradorId: permisosMock[index].colaboradorId,
      accion: 'modificado',
      permisosAnteriores: permisoAnterior.tipo,
      permisosNuevos: actualizaciones.tipo,
      realizadoPor: actualizaciones.asignadoPor || permisoAnterior.asignadoPor,
      realizadoPorNombre: actualizaciones.asignadoPorNombre || permisoAnterior.asignadoPorNombre,
      fecha: new Date().toISOString(),
    });
  }
  
  return permisosMock[index];
};

/**
 * Revoca un permiso
 */
export const revocarPermiso = async (
  permisoId: string,
  realizadoPor: string,
  realizadoPorNombre?: string,
  razon?: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = permisosMock.findIndex(p => p.id === permisoId);
  if (index === -1) {
    throw new Error('Permiso no encontrado');
  }
  
  const permiso = permisosMock[index];
  permiso.activo = false;
  permiso.actualizadoEn = new Date().toISOString();
  
  // Registrar en historial
  historialMock.push({
    id: `historial_${Date.now()}`,
    dietaId: permiso.dietaId,
    colaboradorId: permiso.colaboradorId,
    accion: 'revocado',
    permisosAnteriores: permiso.tipo,
    realizadoPor,
    realizadoPorNombre,
    fecha: new Date().toISOString(),
    razon,
  });
};

/**
 * Obtiene las sugerencias de un colaborador
 */
export const getSugerenciasColaborador = async (
  dietaId: string,
  colaboradorId?: string
): Promise<SugerenciaColaborador[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let sugerencias = sugerenciasMock.filter(s => s.dietaId === dietaId);
  
  if (colaboradorId) {
    sugerencias = sugerencias.filter(s => s.colaboradorId === colaboradorId);
  }
  
  return sugerencias;
};

/**
 * Crea una sugerencia
 */
export const crearSugerencia = async (
  datos: Omit<SugerenciaColaborador, 'id' | 'estado' | 'creadoEn' | 'actualizadoEn' | 'comentarios'>
): Promise<SugerenciaColaborador> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevaSugerencia: SugerenciaColaborador = {
    ...datos,
    id: `sugerencia_${Date.now()}`,
    estado: 'pendiente',
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    comentarios: [],
  };
  
  sugerenciasMock.push(nuevaSugerencia);
  
  return nuevaSugerencia;
};

/**
 * Aprueba una sugerencia
 */
export const aprobarSugerencia = async (
  sugerenciaId: string,
  aprobadoPor: string,
  aprobadoPorNombre?: string
): Promise<SugerenciaColaborador> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = sugerenciasMock.findIndex(s => s.id === sugerenciaId);
  if (index === -1) {
    throw new Error('Sugerencia no encontrada');
  }
  
  sugerenciasMock[index].estado = 'aprobada';
  sugerenciasMock[index].aprobadaPor = aprobadoPor;
  sugerenciasMock[index].aprobadaPorNombre = aprobadoPorNombre;
  sugerenciasMock[index].fechaAprobacion = new Date().toISOString();
  sugerenciasMock[index].actualizadoEn = new Date().toISOString();
  
  return sugerenciasMock[index];
};

/**
 * Rechaza una sugerencia
 */
export const rechazarSugerencia = async (
  sugerenciaId: string,
  rechazadoPor: string,
  razonRechazo?: string
): Promise<SugerenciaColaborador> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = sugerenciasMock.findIndex(s => s.id === sugerenciaId);
  if (index === -1) {
    throw new Error('Sugerencia no encontrada');
  }
  
  sugerenciasMock[index].estado = 'rechazada';
  sugerenciasMock[index].rechazadaPor = rechazadoPor;
  sugerenciasMock[index].fechaRechazo = new Date().toISOString();
  sugerenciasMock[index].razonRechazo = razonRechazo;
  sugerenciasMock[index].actualizadoEn = new Date().toISOString();
  
  return sugerenciasMock[index];
};

/**
 * Aplica una sugerencia
 */
export const aplicarSugerencia = async (
  sugerenciaId: string,
  aplicadoPor: string
): Promise<SugerenciaColaborador> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = sugerenciasMock.findIndex(s => s.id === sugerenciaId);
  if (index === -1) {
    throw new Error('Sugerencia no encontrada');
  }
  
  sugerenciasMock[index].estado = 'aplicada';
  sugerenciasMock[index].aplicadaPor = aplicadoPor;
  sugerenciasMock[index].fechaAplicacion = new Date().toISOString();
  sugerenciasMock[index].actualizadoEn = new Date().toISOString();
  
  return sugerenciasMock[index];
};

/**
 * Añade un comentario a una sugerencia
 */
export const añadirComentarioSugerencia = async (
  sugerenciaId: string,
  comentario: Omit<ComentarioSugerencia, 'id' | 'sugerenciaId' | 'creadoEn'>
): Promise<ComentarioSugerencia> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = sugerenciasMock.findIndex(s => s.id === sugerenciaId);
  if (index === -1) {
    throw new Error('Sugerencia no encontrada');
  }
  
  const nuevoComentario: ComentarioSugerencia = {
    ...comentario,
    id: `comentario_${Date.now()}`,
    sugerenciaId,
    creadoEn: new Date().toISOString(),
  };
  
  if (!sugerenciasMock[index].comentarios) {
    sugerenciasMock[index].comentarios = [];
  }
  
  sugerenciasMock[index].comentarios!.push(nuevoComentario);
  sugerenciasMock[index].actualizadoEn = new Date().toISOString();
  
  return nuevoComentario;
};

/**
 * Obtiene el historial de permisos de una dieta
 */
export const getHistorialPermisos = async (dietaId: string): Promise<HistorialPermisos[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return historialMock
    .filter(h => h.dietaId === dietaId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
};

/**
 * Obtiene los permisos por tipo
 */
function getPermisosPorTipo(tipo: TipoPermisoDieta): PermisoColaborador['permisos'] {
  switch (tipo) {
    case 'solo-lectura':
      return {
        ver: true,
        sugerir: false,
        editar: false,
        eliminar: false,
        asignar: false,
        publicar: false,
        comentar: true,
      };
    case 'sugerencias':
      return {
        ver: true,
        sugerir: true,
        editar: false,
        eliminar: false,
        asignar: false,
        publicar: false,
        comentar: true,
      };
    case 'edicion-completa':
      return {
        ver: true,
        sugerir: true,
        editar: true,
        eliminar: true,
        asignar: true,
        publicar: true,
        comentar: true,
      };
    default:
      return {
        ver: false,
        sugerir: false,
        editar: false,
        eliminar: false,
        asignar: false,
        publicar: false,
        comentar: false,
      };
  }
}

/**
 * Verifica si un colaborador tiene un permiso específico
 */
export const tienePermiso = (
  permiso: PermisoColaborador,
  accion: keyof PermisoColaborador['permisos']
): boolean => {
  if (!permiso.activo) {
    return false;
  }
  
  // Verificar fecha de vigencia
  if (permiso.fechaFin && new Date(permiso.fechaFin) < new Date()) {
    return false;
  }
  
  if (permiso.fechaInicio && new Date(permiso.fechaInicio) > new Date()) {
    return false;
  }
  
  return permiso.permisos[accion];
};

/**
 * Obtiene los permisos de un colaborador para una dieta
 */
export const getPermisosColaborador = async (
  dietaId: string,
  colaboradorId: string
): Promise<PermisoColaborador | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const permiso = permisosMock.find(
    p => p.dietaId === dietaId && p.colaboradorId === colaboradorId && p.activo
  );
  
  return permiso || null;
};

