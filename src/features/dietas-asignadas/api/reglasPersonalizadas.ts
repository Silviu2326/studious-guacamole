import type {
  ReglaPersonalizada,
  EjecucionRegla,
  CondicionRegla,
  AccionRegla,
  Dieta,
  Comida,
  TipoComida,
  FeedbackCliente,
} from '../types';
import { getDieta, actualizarDieta, getDietas } from './dietas';
import { getFeedbackCliente } from './feedback';

// Mock storage para reglas personalizadas
const reglasPersonalizadasMock: ReglaPersonalizada[] = [
  {
    id: '1',
    dietistaId: 'dietista1',
    nombre: 'Postre en día libre',
    descripcion: 'Añadir postre libre los sábados y domingos',
    activa: true,
    condicion: {
      tipo: 'dia-semana',
      parametros: { dias: ['sabado', 'domingo'] },
    },
    accion: {
      tipo: 'añadir-postre',
      parametros: {
        nombre: 'Postre libre',
        tipoComida: 'postre',
        calorias: 200,
        proteinas: 5,
        carbohidratos: 30,
        grasas: 8,
      },
    },
    frecuencia: 'recurrente',
    patronRecurrencia: {
      tipo: 'semanal',
      dias: ['sabado', 'domingo'],
    },
    aplicarATodas: false,
    dietaIds: ['1', '2'],
    vecesEjecutada: 12,
    ultimaEjecucion: new Date().toISOString(),
    requiereConfirmacion: false,
    notificarDietista: false,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
];

// Mock storage para ejecuciones
const ejecucionesMock: EjecucionRegla[] = [];

/**
 * Obtiene todas las reglas personalizadas de un dietista
 */
export async function getReglasPersonalizadas(dietistaId: string): Promise<ReglaPersonalizada[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return reglasPersonalizadasMock.filter(r => r.dietistaId === dietistaId);
}

/**
 * Obtiene una regla personalizada por ID
 */
export async function getReglaPersonalizada(id: string): Promise<ReglaPersonalizada | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return reglasPersonalizadasMock.find(r => r.id === id) || null;
}

/**
 * Crea una nueva regla personalizada
 */
export async function crearReglaPersonalizada(
  regla: Omit<ReglaPersonalizada, 'id' | 'creadoEn' | 'actualizadoEn' | 'vecesEjecutada'>
): Promise<ReglaPersonalizada> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const nuevaRegla: ReglaPersonalizada = {
    ...regla,
    id: `regla-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    vecesEjecutada: 0,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  reglasPersonalizadasMock.push(nuevaRegla);
  return nuevaRegla;
}

/**
 * Actualiza una regla personalizada
 */
export async function actualizarReglaPersonalizada(
  id: string,
  regla: Partial<ReglaPersonalizada>
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = reglasPersonalizadasMock.findIndex(r => r.id === id);
  if (index === -1) return false;
  reglasPersonalizadasMock[index] = {
    ...reglasPersonalizadasMock[index],
    ...regla,
    actualizadoEn: new Date().toISOString(),
  };
  return true;
}

/**
 * Elimina una regla personalizada
 */
export async function eliminarReglaPersonalizada(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = reglasPersonalizadasMock.findIndex(r => r.id === id);
  if (index === -1) return false;
  reglasPersonalizadasMock.splice(index, 1);
  return true;
}

/**
 * Evalúa si una condición se cumple para una dieta
 * USER STORY 2: Soporta condiciones basadas en eventos (feedback negativo, ingesta fuera de rango)
 */
async function evaluarCondicion(
  condicion: CondicionRegla,
  dieta: Dieta,
  dia?: string,
  contextoEvento?: {
    feedback?: FeedbackCliente;
    ingestaMacros?: {
      calorias: number;
      proteinas: number;
      carbohidratos: number;
      grasas: number;
    };
    cumplimiento?: number;
  }
): Promise<boolean> {
  switch (condicion.tipo) {
    case 'dia-semana':
      if (!dia) return false;
      const diasPermitidos = condicion.parametros.dias as string[];
      return diasPermitidos.includes(dia);

    case 'dia-libre':
      // Verificar si el día tiene tag de "día libre"
      if (!dia) return false;
      const metadatosDia = dieta.metadatosDia?.find(m => m.dia === dia);
      return metadatosDia?.tags?.includes('dia-libre') || false;

    case 'tag-dia':
      if (!dia) return false;
      const tagsRequeridos = condicion.parametros.tags as string[];
      const metadatos = dieta.metadatosDia?.find(m => m.dia === dia);
      return tagsRequeridos.some(tag => metadatos?.tags?.includes(tag)) || false;

    case 'adherencia-baja':
      const porcentajeMinimo = condicion.parametros.porcentajeMinimo as number || 70;
      return (dieta.adherencia || 0) < porcentajeMinimo;

    // USER STORY 2: Condiciones basadas en eventos
    case 'feedback-negativo': {
      if (!contextoEvento?.feedback) {
        // Si no hay feedback en el contexto, buscar feedback reciente
        const feedbacks = await getFeedbackCliente(dieta.id, dieta.clienteId);
        if (feedbacks.length === 0) return false;
        
        // Buscar feedback negativo reciente (últimas 24 horas)
        const ahora = new Date();
        const feedbacksRecientes = feedbacks.filter(f => {
          const fechaFeedback = new Date(f.fecha);
          const horasDiferencia = (ahora.getTime() - fechaFeedback.getTime()) / (1000 * 60 * 60);
          return horasDiferencia <= 24;
        });

        // Feedback negativo: sensación < 3 o saciedad < 3
        const umbralSensacion = condicion.parametros.umbralSensacion as number || 3;
        const umbralSaciedad = condicion.parametros.umbralSaciedad as number || 3;
        return feedbacksRecientes.some(f => 
          f.sensacion < umbralSensacion || f.saciedad < umbralSaciedad
        );
      }
      
      const umbralSensacion = condicion.parametros.umbralSensacion as number || 3;
      const umbralSaciedad = condicion.parametros.umbralSaciedad as number || 3;
      return contextoEvento.feedback.sensacion < umbralSensacion || 
             contextoEvento.feedback.saciedad < umbralSaciedad;
    }

    case 'feedback-bajo': {
      if (!contextoEvento?.feedback) {
        const feedbacks = await getFeedbackCliente(dieta.id, dieta.clienteId);
        if (feedbacks.length === 0) return false;
        
        const ahora = new Date();
        const feedbacksRecientes = feedbacks.filter(f => {
          const fechaFeedback = new Date(f.fecha);
          const horasDiferencia = (ahora.getTime() - fechaFeedback.getTime()) / (1000 * 60 * 60);
          return horasDiferencia <= 24;
        });

        const umbralSensacion = condicion.parametros.umbralSensacion as number || 2;
        const umbralSaciedad = condicion.parametros.umbralSaciedad as number || 2;
        return feedbacksRecientes.some(f => 
          f.sensacion <= umbralSensacion || f.saciedad <= umbralSaciedad
        );
      }
      
      const umbralSensacion = condicion.parametros.umbralSensacion as number || 2;
      const umbralSaciedad = condicion.parametros.umbralSaciedad as number || 2;
      return contextoEvento.feedback.sensacion <= umbralSensacion || 
             contextoEvento.feedback.saciedad <= umbralSaciedad;
    }

    case 'ingesta-fuera-rango': {
      if (!contextoEvento?.ingestaMacros) {
        // Si no hay ingesta en el contexto, calcular desde la dieta actual
        const macrosActuales = dieta.comidas.reduce((acc, comida) => ({
          calorias: acc.calorias + comida.calorias,
          proteinas: acc.proteinas + comida.proteinas,
          carbohidratos: acc.carbohidratos + comida.carbohidratos,
          grasas: acc.grasas + comida.grasas,
        }), { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });
        
        const margenError = condicion.parametros.margenError as number || 10; // Porcentaje
        const macrosObjetivo = dieta.macros;
        
        // Verificar si está fuera del rango objetivo
        const caloriasFuera = Math.abs(macrosActuales.calorias - macrosObjetivo.calorias) > 
          (macrosObjetivo.calorias * margenError / 100);
        const proteinasFuera = Math.abs(macrosActuales.proteinas - macrosObjetivo.proteinas) > 
          (macrosObjetivo.proteinas * margenError / 100);
        const carbohidratosFuera = Math.abs(macrosActuales.carbohidratos - macrosObjetivo.carbohidratos) > 
          (macrosObjetivo.carbohidratos * margenError / 100);
        const grasasFuera = Math.abs(macrosActuales.grasas - macrosObjetivo.grasas) > 
          (macrosObjetivo.grasas * margenError / 100);
        
        return caloriasFuera || proteinasFuera || carbohidratosFuera || grasasFuera;
      }
      
      const margenError = condicion.parametros.margenError as number || 10;
      const macrosObjetivo = dieta.macros;
      const macrosIngesta = contextoEvento.ingestaMacros;
      
      const caloriasFuera = Math.abs(macrosIngesta.calorias - macrosObjetivo.calorias) > 
        (macrosObjetivo.calorias * margenError / 100);
      const proteinasFuera = Math.abs(macrosIngesta.proteinas - macrosObjetivo.proteinas) > 
        (macrosObjetivo.proteinas * margenError / 100);
      const carbohidratosFuera = Math.abs(macrosIngesta.carbohidratos - macrosObjetivo.carbohidratos) > 
        (macrosObjetivo.carbohidratos * margenError / 100);
      const grasasFuera = Math.abs(macrosIngesta.grasas - macrosObjetivo.grasas) > 
        (macrosObjetivo.grasas * margenError / 100);
      
      return caloriasFuera || proteinasFuera || carbohidratosFuera || grasasFuera;
    }

    case 'cumplimiento-bajo': {
      const porcentajeMinimo = condicion.parametros.porcentajeMinimo as number || 70;
      if (contextoEvento?.cumplimiento !== undefined) {
        return contextoEvento.cumplimiento < porcentajeMinimo;
      }
      return (dieta.adherencia || 0) < porcentajeMinimo;
    }

    default:
      return false;
  }
}

/**
 * Ejecuta una acción sobre una dieta
 */
async function ejecutarAccion(
  accion: AccionRegla,
  dieta: Dieta,
  dia?: string
): Promise<{ exito: boolean; cambios: string[]; error?: string }> {
  const cambios: string[] = [];

  try {
    switch (accion.tipo) {
      case 'añadir-comida':
      case 'añadir-postre': {
        const tipoComida = accion.parametros.tipoComida as TipoComida || 'postre';
        const nuevaComida: Comida = {
          id: `comida-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          nombre: accion.parametros.nombre as string || 'Nueva comida',
          tipo: tipoComida,
          alimentos: [],
          calorias: accion.parametros.calorias as number || 0,
          proteinas: accion.parametros.proteinas as number || 0,
          carbohidratos: accion.parametros.carbohidratos as number || 0,
          grasas: accion.parametros.grasas as number || 0,
          dia: dia,
        };

        const comidasActualizadas = [...dieta.comidas, nuevaComida];
        await actualizarDieta(dieta.id, { comidas: comidasActualizadas });
        cambios.push(`Añadida comida: ${nuevaComida.nombre}`);
        return { exito: true, cambios };
      }

      case 'ajustar-macros': {
        const ajustes = accion.parametros;
        const nuevosMacros = {
          calorias: dieta.macros.calorias + (ajustes.calorias as number || 0),
          proteinas: dieta.macros.proteinas + (ajustes.proteinas as number || 0),
          carbohidratos: dieta.macros.carbohidratos + (ajustes.carbohidratos as number || 0),
          grasas: dieta.macros.grasas + (ajustes.grasas as number || 0),
        };
        await actualizarDieta(dieta.id, { macros: nuevosMacros });
        cambios.push('Macros ajustados');
        return { exito: true, cambios };
      }

      case 'eliminar-comida': {
        const tipoComidaEliminar = accion.parametros.tipoComida as TipoComida;
        const comidasFiltradas = dieta.comidas.filter(
          c => !(c.tipo === tipoComidaEliminar && (!dia || c.dia === dia))
        );
        await actualizarDieta(dieta.id, { comidas: comidasFiltradas });
        cambios.push(`Eliminadas comidas de tipo: ${tipoComidaEliminar}`);
        return { exito: true, cambios };
      }

      default:
        return { exito: false, cambios: [], error: 'Tipo de acción no implementado' };
    }
  } catch (error) {
    return {
      exito: false,
      cambios: [],
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Ejecuta una regla personalizada bajo demanda
 * USER STORY 2: Soporta contexto de evento para reglas activadas por eventos
 */
export async function ejecutarReglaPersonalizada(
  reglaId: string,
  dietaId: string,
  dia?: string,
  confirmada: boolean = false,
  contextoEvento?: {
    feedback?: FeedbackCliente;
    ingestaMacros?: {
      calorias: number;
      proteinas: number;
      carbohidratos: number;
      grasas: number;
    };
    cumplimiento?: number;
  }
): Promise<EjecucionRegla> {
  const regla = await getReglaPersonalizada(reglaId);
  if (!regla) {
    throw new Error('Regla no encontrada');
  }

  if (!regla.activa) {
    throw new Error('La regla no está activa');
  }

  const dieta = await getDieta(dietaId);
  if (!dieta) {
    throw new Error('Dieta no encontrada');
  }

  // Verificar si la regla aplica a esta dieta
  if (!regla.aplicarATodas && !regla.dietaIds?.includes(dietaId)) {
    throw new Error('La regla no aplica a esta dieta');
  }

  // Verificar si requiere confirmación
  if (regla.requiereConfirmacion && !confirmada) {
    throw new Error('La regla requiere confirmación antes de ejecutarse');
  }

  // Evaluar condición (ahora es async para soportar eventos)
  const condicionCumplida = await evaluarCondicion(regla.condicion, dieta, dia, contextoEvento);
  if (!condicionCumplida) {
    const ejecucion: EjecucionRegla = {
      id: `ejecucion-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      reglaId,
      dietaId,
      fechaEjecucion: new Date().toISOString(),
      exito: false,
      error: 'La condición de la regla no se cumple',
      confirmada,
    };
    ejecucionesMock.push(ejecucion);
    return ejecucion;
  }

  // Ejecutar acción
  const resultado = await ejecutarAccion(regla.accion, dieta, dia);

  // Registrar ejecución
  const ejecucion: EjecucionRegla = {
    id: `ejecucion-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    reglaId,
    dietaId,
    fechaEjecucion: new Date().toISOString(),
    exito: resultado.exito,
    resultado: resultado.exito
      ? {
          cambiosAplicados: resultado.cambios.length,
          detalles: resultado.cambios,
        }
      : undefined,
    error: resultado.error,
    confirmada,
  };
  ejecucionesMock.push(ejecucion);

  // Actualizar contador de ejecuciones de la regla
  if (resultado.exito) {
    await actualizarReglaPersonalizada(reglaId, {
      vecesEjecutada: regla.vecesEjecutada + 1,
      ultimaEjecucion: new Date().toISOString(),
    });
  }

  return ejecucion;
}

/**
 * Obtiene el historial de ejecuciones de una regla
 */
export async function getHistorialEjecuciones(reglaId: string): Promise<EjecucionRegla[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return ejecucionesMock.filter(e => e.reglaId === reglaId).reverse();
}

/**
 * Ejecuta todas las reglas recurrentes que deben ejecutarse
 */
export async function ejecutarReglasRecurrentes(): Promise<EjecucionRegla[]> {
  const ahora = new Date();
  const diaSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][
    ahora.getDay()
  ];
  const diaMes = ahora.getDate();

  const reglasRecurrentes = reglasPersonalizadasMock.filter(
    r =>
      r.activa &&
      r.frecuencia === 'recurrente' &&
      r.patronRecurrencia &&
      ((r.patronRecurrencia.tipo === 'diaria') ||
        (r.patronRecurrencia.tipo === 'semanal' &&
          r.patronRecurrencia.dias?.includes(diaSemana)) ||
        (r.patronRecurrencia.tipo === 'mensual' && r.patronRecurrencia.diaMes === diaMes))
  );

  const ejecuciones: EjecucionRegla[] = [];

  for (const regla of reglasRecurrentes) {
    const dietas = regla.aplicarATodas
      ? await getDietas()
      : await Promise.all(
          (regla.dietaIds || []).map(id => getDieta(id))
        ).then(dietas => dietas.filter((d): d is Dieta => d !== null));

    for (const dieta of dietas) {
      try {
        const ejecucion = await ejecutarReglaPersonalizada(regla.id, dieta.id, diaSemana, true);
        ejecuciones.push(ejecucion);
      } catch (error) {
        // Continuar con la siguiente dieta si hay error
        console.error(`Error ejecutando regla ${regla.id} en dieta ${dieta.id}:`, error);
      }
    }
  }

  return ejecuciones;
}

/**
 * USER STORY 2: Ejecuta reglas activadas por eventos
 * Se llama automáticamente cuando ocurre un evento (feedback negativo, ingesta fuera de rango, etc.)
 */
export async function ejecutarReglasPorEvento(
  evento: {
    tipo: 'feedback-negativo' | 'feedback-bajo' | 'ingesta-fuera-rango' | 'cumplimiento-bajo';
    dietaId: string;
    feedback?: FeedbackCliente;
    ingestaMacros?: {
      calorias: number;
      proteinas: number;
      carbohidratos: number;
      grasas: number;
    };
    cumplimiento?: number;
  }
): Promise<EjecucionRegla[]> {
  const dieta = await getDieta(evento.dietaId);
  if (!dieta) {
    throw new Error('Dieta no encontrada');
  }

  // Obtener todas las reglas activas que se activan por eventos
  const reglasEvento = reglasPersonalizadasMock.filter(
    r => r.activa && 
         r.condicion.tipo === evento.tipo &&
         (r.aplicarATodas || r.dietaIds?.includes(evento.dietaId))
  );

  const ejecuciones: EjecucionRegla[] = [];

  for (const regla of reglasEvento) {
    try {
      // Crear contexto de evento
      const contextoEvento = {
        feedback: evento.feedback,
        ingestaMacros: evento.ingestaMacros,
        cumplimiento: evento.cumplimiento,
      };

      // Evaluar condición con contexto de evento
      const condicionCumplida = await evaluarCondicion(
        regla.condicion,
        dieta,
        undefined,
        contextoEvento
      );

      if (condicionCumplida) {
        // Si requiere confirmación, no ejecutar automáticamente
        if (regla.requiereConfirmacion) {
          // En producción, se podría notificar al dietista para confirmación
          console.log(`Regla ${regla.id} requiere confirmación antes de ejecutarse`);
          continue;
        }

        // Ejecutar la regla con contexto de evento
        const ejecucion = await ejecutarReglaPersonalizada(
          regla.id,
          evento.dietaId,
          undefined,
          true,
          contextoEvento
        );
        ejecuciones.push(ejecucion);

        // Si la regla está configurada para notificar, se podría enviar una notificación
        if (regla.notificarDietista) {
          // En producción, se enviaría una notificación al dietista
          console.log(`Regla ${regla.id} ejecutada automáticamente y notificando al dietista`);
        }
      }
    } catch (error) {
      console.error(`Error ejecutando regla ${regla.id} por evento:`, error);
    }
  }

  return ejecuciones;
}

