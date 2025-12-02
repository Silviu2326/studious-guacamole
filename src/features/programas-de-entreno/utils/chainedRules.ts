/**
 * Sistema de reglas encadenadas con condicionales avanzados
 * User Story: Como coach quiero definir reglas encadenadas con condicionales (si/entonces, y/o, limite),
 * para modificar duración, intensidad, modalidad o notas según múltiples factores.
 */

import type {
  ReglaEncadenada,
  CondicionAvanzada,
  AccionModificacion,
  OperadorLogico,
  DaySession,
  DayPlan,
  ContextoCliente,
} from '../types';

const STORAGE_KEY = 'chained-rules';

/**
 * Obtener todas las reglas encadenadas
 */
export function obtenerReglasEncadenadas(): ReglaEncadenada[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error cargando reglas encadenadas:', error);
  }
  return [];
}

/**
 * Guardar reglas encadenadas
 */
export function guardarReglasEncadenadas(reglas: ReglaEncadenada[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reglas));
  } catch (error) {
    console.warn('Error guardando reglas encadenadas:', error);
  }
}

/**
 * Crear una nueva regla encadenada
 */
export function crearReglaEncadenada(
  regla: Omit<ReglaEncadenada, 'id' | 'fechaCreacion' | 'fechaActualizacion'>
): ReglaEncadenada {
  const nuevaRegla: ReglaEncadenada = {
    ...regla,
    id: `regla-encadenada-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  };

  const reglas = obtenerReglasEncadenadas();
  reglas.push(nuevaRegla);
  guardarReglasEncadenadas(reglas);

  return nuevaRegla;
}

/**
 * Actualizar una regla encadenada
 */
export function actualizarReglaEncadenada(
  id: string,
  actualizaciones: Partial<ReglaEncadenada>
): ReglaEncadenada | null {
  const reglas = obtenerReglasEncadenadas();
  const index = reglas.findIndex((r) => r.id === id);

  if (index === -1) return null;

  reglas[index] = {
    ...reglas[index],
    ...actualizaciones,
    fechaActualizacion: new Date().toISOString(),
  };

  guardarReglasEncadenadas(reglas);
  return reglas[index];
}

/**
 * Eliminar una regla encadenada
 */
export function eliminarReglaEncadenada(id: string): boolean {
  const reglas = obtenerReglasEncadenadas();
  const filtradas = reglas.filter((r) => r.id !== id);

  if (filtradas.length === reglas.length) return false;

  guardarReglasEncadenadas(filtradas);
  return true;
}

/**
 * Evaluar una condición individual
 */
function evaluarCondicion(
  condicion: CondicionAvanzada,
  contexto: {
    sesion?: DaySession;
    diaPlan?: DayPlan;
    contextoCliente?: ContextoCliente;
    datosAdicionales?: Record<string, any>;
  }
): boolean {
  const { tipo, operador, valor, valor2 } = condicion;
  let valorContexto: string | number | undefined;

  // Obtener el valor del contexto según el tipo de condición
  switch (tipo) {
    case 'lesion':
      valorContexto = contexto.contextoCliente?.lesiones
        .map((l) => l.nombre.toLowerCase())
        .join(' ') || '';
      break;
    case 'patron':
      valorContexto = contexto.sesion?.block?.toLowerCase() || '';
      break;
    case 'modalidad':
      valorContexto = contexto.sesion?.modality?.toLowerCase() || '';
      break;
    case 'intensidad':
      valorContexto = contexto.sesion?.intensity?.toLowerCase() || '';
      break;
    case 'duracion':
      // Extraer número de duración (ej: "40 min" -> 40)
      const duracionStr = contexto.sesion?.duration || '';
      valorContexto = parseInt(duracionStr.replace(/\D/g, '')) || 0;
      break;
    case 'equipamiento':
      valorContexto = contexto.contextoCliente?.disponibilidadMaterial
        .filter((m) => m.disponible)
        .map((m) => m.material.toLowerCase())
        .join(' ') || '';
      break;
    case 'tag':
      const tags = [
        ...(contexto.sesion?.tags || []),
        ...(contexto.diaPlan?.tags || []),
      ];
      if (operador === 'tiene_tag' || operador === 'no_tiene_tag') {
        const tagBuscado = String(valor).toLowerCase();
        const tieneTag = tags.some((tag) => tag.toLowerCase() === tagBuscado);
        return operador === 'tiene_tag' ? tieneTag : !tieneTag;
      }
      valorContexto = tags.join(' ').toLowerCase();
      break;
    case 'peso_cliente':
      valorContexto = contexto.contextoCliente?.datosBiometricos.peso?.valor || 0;
      break;
    case 'imc':
      valorContexto = contexto.contextoCliente?.datosBiometricos.imc || 0;
      break;
    case 'adherencia':
      // Calcular adherencia promedio de hábitos
      const habitos = contexto.contextoCliente?.habitos || [];
      if (habitos.length === 0) {
        valorContexto = 0;
      } else {
        valorContexto =
          habitos.reduce((sum, h) => sum + h.cumplimiento, 0) / habitos.length;
      }
      break;
    case 'progreso':
      valorContexto = contexto.datosAdicionales?.progreso || 0;
      break;
    case 'dias_semana':
      const diaActual = new Date().getDay(); // 0 = domingo, 1 = lunes, etc.
      const diasMap: Record<string, number> = {
        domingo: 0,
        lunes: 1,
        martes: 2,
        miercoles: 3,
        jueves: 4,
        viernes: 5,
        sabado: 6,
      };
      valorContexto = diaActual;
      const valorEsperado = diasMap[String(valor).toLowerCase()];
      return operador === 'igual' ? valorContexto === valorEsperado : false;
    case 'hora_dia':
      const horaActual = new Date().getHours();
      valorContexto = horaActual;
      break;
    default:
      return false;
  }

  // Evaluar el operador de comparación
  if (typeof valorContexto === 'string' && typeof valor === 'string') {
    const valorBusqueda = valor.toLowerCase();
    const valorContextoLower = valorContexto.toLowerCase();

    switch (operador) {
      case 'contiene':
        return valorContextoLower.includes(valorBusqueda);
      case 'igual':
        return valorContextoLower === valorBusqueda;
      case 'no_contiene':
        return !valorContextoLower.includes(valorBusqueda);
      default:
        return false;
    }
  } else if (typeof valorContexto === 'number' && typeof valor === 'number') {
    switch (operador) {
      case 'igual':
        return valorContexto === valor;
      case 'mayor_que':
        return valorContexto > valor;
      case 'menor_que':
        return valorContexto < valor;
      case 'mayor_igual':
        return valorContexto >= valor;
      case 'menor_igual':
        return valorContexto <= valor;
      case 'entre':
        if (valor2 !== undefined) {
          return valorContexto >= valor && valorContexto <= valor2;
        }
        return false;
      default:
        return false;
    }
  }

  return false;
}

/**
 * Evaluar todas las condiciones encadenadas con lógica AND/OR
 */
function evaluarCondicionesEncadenadas(
  condiciones: CondicionAvanzada[],
  contexto: {
    sesion?: DaySession;
    diaPlan?: DayPlan;
    contextoCliente?: ContextoCliente;
    datosAdicionales?: Record<string, any>;
  }
): boolean {
  if (condiciones.length === 0) return true;
  if (condiciones.length === 1) {
    return evaluarCondicion(condiciones[0], contexto);
  }

  // Evaluar la primera condición
  let resultado = evaluarCondicion(condiciones[0], contexto);

  // Evaluar las siguientes condiciones según el operador lógico
  for (let i = 1; i < condiciones.length; i++) {
    const condicionActual = condiciones[i];
    const resultadoActual = evaluarCondicion(condicionActual, contexto);
    const operadorLogico = condiciones[i - 1].operadorLogico || 'AND';

    if (operadorLogico === 'AND') {
      resultado = resultado && resultadoActual;
    } else if (operadorLogico === 'OR') {
      resultado = resultado || resultadoActual;
    }
  }

  return resultado;
}

/**
 * Aplicar una acción de modificación a una sesión
 */
function aplicarAccionModificacion(
  accion: AccionModificacion,
  sesion: DaySession
): DaySession {
  const sesionModificada = { ...sesion };

  switch (accion.tipo) {
    case 'duracion':
      if (accion.accion === 'establecer') {
        sesionModificada.duration = String(accion.valor);
      } else if (accion.accion === 'aumentar') {
        const duracionActual = parseInt(sesion.duration.replace(/\D/g, '')) || 0;
        const incremento = typeof accion.valor === 'number' ? accion.valor : parseInt(String(accion.valor).replace(/\D/g, '')) || 0;
        let nuevaDuracion = duracionActual + incremento;
        if (accion.limites?.maximo) {
          nuevaDuracion = Math.min(nuevaDuracion, Number(accion.limites.maximo));
        }
        if (accion.limites?.minimo) {
          nuevaDuracion = Math.max(nuevaDuracion, Number(accion.limites.minimo));
        }
        sesionModificada.duration = `${nuevaDuracion} min`;
      } else if (accion.accion === 'disminuir') {
        const duracionActual = parseInt(sesion.duration.replace(/\D/g, '')) || 0;
        const decremento = typeof accion.valor === 'number' ? accion.valor : parseInt(String(accion.valor).replace(/\D/g, '')) || 0;
        let nuevaDuracion = duracionActual - decremento;
        if (accion.limites?.minimo) {
          nuevaDuracion = Math.max(nuevaDuracion, Number(accion.limites.minimo));
        }
        if (accion.limites?.maximo) {
          nuevaDuracion = Math.min(nuevaDuracion, Number(accion.limites.maximo));
        }
        sesionModificada.duration = `${nuevaDuracion} min`;
      } else if (accion.accion === 'multiplicar') {
        const duracionActual = parseInt(sesion.duration.replace(/\D/g, '')) || 0;
        const factor = typeof accion.valor === 'number' ? accion.valor : parseFloat(String(accion.valor)) || 1;
        let nuevaDuracion = Math.round(duracionActual * factor);
        if (accion.limites?.maximo) {
          nuevaDuracion = Math.min(nuevaDuracion, Number(accion.limites.maximo));
        }
        if (accion.limites?.minimo) {
          nuevaDuracion = Math.max(nuevaDuracion, Number(accion.limites.minimo));
        }
        sesionModificada.duration = `${nuevaDuracion} min`;
      } else if (accion.accion === 'limitar') {
        const duracionActual = parseInt(sesion.duration.replace(/\D/g, '')) || 0;
        let nuevaDuracion = duracionActual;
        if (accion.limites?.maximo) {
          nuevaDuracion = Math.min(nuevaDuracion, Number(accion.limites.maximo));
        }
        if (accion.limites?.minimo) {
          nuevaDuracion = Math.max(nuevaDuracion, Number(accion.limites.minimo));
        }
        sesionModificada.duration = `${nuevaDuracion} min`;
      }
      break;

    case 'intensidad':
      if (accion.accion === 'establecer') {
        sesionModificada.intensity = String(accion.valor);
      } else if (accion.accion === 'aumentar') {
        // Extraer RPE o valor numérico
        const rpeMatch = sesion.intensity.match(/RPE\s*(\d+(?:\.\d+)?)/i);
        if (rpeMatch) {
          const rpeActual = parseFloat(rpeMatch[1]);
          const incremento = typeof accion.valor === 'number' ? accion.valor : parseFloat(String(accion.valor)) || 0;
          let nuevoRPE = rpeActual + incremento;
          if (accion.limites?.maximo) {
            nuevoRPE = Math.min(nuevoRPE, Number(accion.limites.maximo));
          }
          if (accion.limites?.minimo) {
            nuevoRPE = Math.max(nuevoRPE, Number(accion.limites.minimo));
          }
          sesionModificada.intensity = `RPE ${nuevoRPE.toFixed(1)}`;
        }
      } else if (accion.accion === 'disminuir') {
        const rpeMatch = sesion.intensity.match(/RPE\s*(\d+(?:\.\d+)?)/i);
        if (rpeMatch) {
          const rpeActual = parseFloat(rpeMatch[1]);
          const decremento = typeof accion.valor === 'number' ? accion.valor : parseFloat(String(accion.valor)) || 0;
          let nuevoRPE = rpeActual - decremento;
          if (accion.limites?.minimo) {
            nuevoRPE = Math.max(nuevoRPE, Number(accion.limites.minimo));
          }
          if (accion.limites?.maximo) {
            nuevoRPE = Math.min(nuevoRPE, Number(accion.limites.maximo));
          }
          sesionModificada.intensity = `RPE ${nuevoRPE.toFixed(1)}`;
        }
      }
      break;

    case 'modalidad':
      if (accion.accion === 'establecer') {
        sesionModificada.modality = String(accion.valor);
      }
      break;

    case 'notas':
      if (accion.accion === 'establecer') {
        sesionModificada.notes = String(accion.valor);
      } else if (accion.accion === 'aumentar') {
        sesionModificada.notes = `${sesion.notes || ''}\n${accion.valor}`.trim();
      }
      break;
  }

  return sesionModificada;
}

/**
 * Aplicar reglas encadenadas a una sesión
 */
export function aplicarReglasEncadenadas(
  sesion: DaySession,
  contexto: {
    diaPlan?: DayPlan;
    contextoCliente?: ContextoCliente;
    datosAdicionales?: Record<string, any>;
    programaId?: string;
    clienteId?: string;
  }
): {
  modificado: boolean;
  sesionModificada?: DaySession;
  reglasAplicadas: ReglaEncadenada[];
} {
  const reglas = obtenerReglasEncadenadas().filter((r) => r.activa);

  // Filtrar reglas por programa/cliente si se especifica
  const reglasAplicables = reglas.filter((r) => {
    if (r.programaId && contexto.programaId && r.programaId !== contexto.programaId) {
      return false;
    }
    if (r.clienteId && contexto.clienteId && r.clienteId !== contexto.clienteId) {
      return false;
    }
    return true;
  });

  // Ordenar por prioridad (mayor primero)
  reglasAplicables.sort((a, b) => b.prioridad - a.prioridad);

  let sesionModificada = { ...sesion };
  const reglasAplicadas: ReglaEncadenada[] = [];

  for (const regla of reglasAplicables) {
    const cumpleCondiciones = evaluarCondicionesEncadenadas(regla.condiciones, {
      sesion: sesionModificada,
      diaPlan: contexto.diaPlan,
      contextoCliente: contexto.contextoCliente,
      datosAdicionales: contexto.datosAdicionales,
    });

    if (cumpleCondiciones) {
      // Aplicar todas las acciones de la regla
      for (const accion of regla.acciones) {
        sesionModificada = aplicarAccionModificacion(accion, sesionModificada);
      }
      reglasAplicadas.push(regla);
    }
  }

  return {
    modificado: reglasAplicadas.length > 0,
    sesionModificada: reglasAplicadas.length > 0 ? sesionModificada : undefined,
    reglasAplicadas,
  };
}

