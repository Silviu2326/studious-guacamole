import type {
  HistorialBloque,
  EntradaHistorialBloque,
  ComentarioProfesional,
  NotaBloque,
  HistorialCambioDieta,
  FeedbackCliente,
  SugerenciaColaborador,
  VersionPlan,
} from '../types';
import { getComentariosProfesionales, getComentariosPorComida } from './comentariosProfesionales';
import { obtenerNotasBloque } from './notasBloque';
import { getHistorialCambios } from './dietas';
import { getFeedbackCliente } from './feedback';
import { getSugerenciasColaborador } from './permisosColaboradores';
import { getVersionesPlan } from './versiones';

// Mock de historial almacenado (en producción vendría de la API)
let historialMock: EntradaHistorialBloque[] = [];

/**
 * Obtiene el historial cronológico completo de un bloque
 */
export async function getHistorialBloque(bloqueId: string, dietaId: string): Promise<HistorialBloque> {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Obtener todas las entradas relacionadas con este bloque
  const entradas: EntradaHistorialBloque[] = [];

  try {
    // 1. Obtener comentarios profesionales relacionados con este bloque
    const comentarios = await getComentariosPorComida(dietaId, bloqueId);
    comentarios.forEach((comentario: ComentarioProfesional) => {
      entradas.push({
        id: `hist-${comentario.id}`,
        bloqueId,
        tipo: 'comentario-profesional',
        fecha: comentario.creadoEn,
        titulo: 'Comentario profesional',
        descripcion: comentario.contenido,
        datos: {
          comentarioId: comentario.id,
          mencionaProfesionales: comentario.menciones.map(m => m.profesionalNombre),
        },
        realizadoPor: comentario.creadoPor,
        realizadoPorNombre: comentario.creadoPorNombre,
      });
    });

    // 2. Obtener notas del bloque
    const notas = await obtenerNotasBloque(bloqueId);
    notas.forEach((nota: NotaBloque) => {
      let descripcion = '';
      if (nota.tipo === 'texto' && nota.contenido) {
        descripcion = nota.contenido;
      } else if (nota.tipo === 'audio') {
        descripcion = 'Nota de audio';
      } else if (nota.tipo === 'video') {
        descripcion = 'Nota de video';
      }

      entradas.push({
        id: `hist-${nota.id}`,
        bloqueId,
        tipo: 'nota-bloque',
        fecha: nota.creadoEn,
        titulo: `Nota de ${nota.tipo}`,
        descripcion,
        datos: {
          notaId: nota.id,
          tipoNota: nota.tipo,
        },
        realizadoPor: nota.creadoPor,
      });
    });

    // 3. Obtener cambios de dieta que afecten a este bloque
    const cambios = await getHistorialCambios(dietaId);
    cambios.forEach((cambio: HistorialCambioDieta) => {
      // Filtrar cambios que afecten a este bloque específico
      const cambiosRelacionados = cambio.cambios.filter(
        c => c.campo.includes('comida') || c.descripcion?.includes(bloqueId)
      );
      
      if (cambiosRelacionados.length > 0) {
        entradas.push({
          id: `hist-${cambio.id}`,
          bloqueId,
          tipo: 'cambio-dieta',
          fecha: cambio.fechaCambio,
          titulo: `Cambio: ${cambio.tipoCambio}`,
          descripcion: cambio.descripcion,
          datos: {
            cambioId: cambio.id,
            tipoCambio: cambio.tipoCambio,
            cambiosDetalle: cambiosRelacionados,
          },
          realizadoPor: cambio.realizadoPor || 'system',
          realizadoPorNombre: cambio.realizadoPorNombre,
        });
      }
    });

    // 4. Obtener feedback del cliente relacionado con este bloque
    // Necesitamos obtener la dieta para tener el clienteId
    const { getDieta } = await import('./dietas');
    const dieta = await getDieta(dietaId);
    const feedbacks = dieta ? await getFeedbackCliente(dietaId, dieta.clienteId) : [];
    const feedbacksBloque = feedbacks.filter((f: FeedbackCliente) => f.comidaId === bloqueId);
    feedbacksBloque.forEach((feedback: FeedbackCliente) => {
      entradas.push({
        id: `hist-${feedback.id}`,
        bloqueId,
        tipo: 'feedback-cliente',
        fecha: feedback.creadoEn,
        titulo: 'Feedback del cliente',
        descripcion: feedback.comentarios || `Sensación: ${feedback.sensacion}/5, Saciedad: ${feedback.saciedad}/5`,
        datos: {
          feedbackId: feedback.id,
          sensacion: feedback.sensacion,
          saciedad: feedback.saciedad,
        },
        realizadoPor: feedback.clienteId,
      });
    });

    // 5. Obtener sugerencias de colaboradores relacionadas
    const sugerencias = await getSugerenciasColaborador(dietaId);
    const sugerenciasBloque = sugerencias.filter(
      (s: SugerenciaColaborador) => s.detalles.comidaId === bloqueId
    );
    sugerenciasBloque.forEach((sugerencia: SugerenciaColaborador) => {
      entradas.push({
        id: `hist-${sugerencia.id}`,
        bloqueId,
        tipo: 'sugerencia-colaborador',
        fecha: sugerencia.creadoEn,
        titulo: `Sugerencia: ${sugerencia.titulo}`,
        descripcion: sugerencia.descripcion,
        datos: {
          sugerenciaId: sugerencia.id,
          estadoSugerencia: sugerencia.estado,
        },
        realizadoPor: sugerencia.colaboradorId,
        realizadoPorNombre: sugerencia.colaboradorNombre,
      });
    });

    // 6. Obtener versiones del plan que incluyan cambios en este bloque
    const versiones = await getVersionesPlan(dietaId);
    versiones.forEach((version: VersionPlan) => {
      const cambiosBloque = version.cambios.filter(
        c => c.campo.includes('comida') || c.descripcion?.includes(bloqueId)
      );
      
      if (cambiosBloque.length > 0) {
        entradas.push({
          id: `hist-version-${version.id}`,
          bloqueId,
          tipo: 'version-plan',
          fecha: version.creadoEn,
          titulo: `Versión ${version.numeroVersion}: ${version.nombre || 'Sin nombre'}`,
          descripcion: version.descripcion || 'Cambios en esta versión',
          datos: {
            versionId: version.id,
            numeroVersion: version.numeroVersion,
          },
          realizadoPor: version.creadoPor,
          realizadoPorNombre: version.creadoPorNombre,
        });
      }
    });

    // Agregar entradas del mock (si hay)
    const entradasMock = historialMock.filter(e => e.bloqueId === bloqueId);
    entradas.push(...entradasMock);

    // Ordenar por fecha (más reciente primero)
    entradas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    const historial: HistorialBloque = {
      bloqueId,
      entradas,
      totalEntradas: entradas.length,
      fechaPrimeraEntrada: entradas.length > 0 ? entradas[entradas.length - 1].fecha : undefined,
      fechaUltimaEntrada: entradas.length > 0 ? entradas[0].fecha : undefined,
    };

    return historial;
  } catch (error) {
    console.error('Error obteniendo historial del bloque:', error);
    // Retornar historial vacío en caso de error
    return {
      bloqueId,
      entradas: [],
      totalEntradas: 0,
    };
  }
}

/**
 * Agrega una entrada de decisión del dietista al historial
 */
export async function agregarDecisionHistorial(
  bloqueId: string,
  decision: string,
  razon?: string
): Promise<EntradaHistorialBloque> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const nuevaEntrada: EntradaHistorialBloque = {
    id: `hist-decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    bloqueId,
    tipo: 'decision-dietista',
    fecha: new Date().toISOString(),
    titulo: 'Decisión del dietista',
    descripcion: decision,
    datos: {
      decision,
      razon,
    },
    realizadoPor: 'user-1', // En producción vendría del contexto de autenticación
  };

  historialMock.push(nuevaEntrada);

  // En producción, esto haría una llamada POST a la API
  // return await fetch('/api/historial-bloque', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(nuevaEntrada),
  // }).then(res => res.json());

  return nuevaEntrada;
}

