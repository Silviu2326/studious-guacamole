import { RecursoBiblioteca, EstiloCulinario, Alergeno } from '../types';

export interface PreferenciaDietista {
  id: string;
  dietistaId: string;
  tipo: 'aceptada' | 'rechazada';
  sugerenciaId: string;
  recursoId: string;
  recursoTipo: 'receta' | 'plantilla' | 'alimento' | 'bloque';
  razon?: string; // Razón por la que se aceptó/rechazó
  contexto?: {
    clienteId?: string;
    objetivoNutricional?: string;
    restricciones?: string[];
  };
  creadoEn: string;
}

export interface PerfilPreferenciasDietista {
  dietistaId: string;
  preferencias: {
    estilosCulinarios: EstiloCulinario[];
    alergenosEvitar: Alergeno[];
    tiposRecursoPreferidos: ('receta' | 'plantilla' | 'alimento' | 'bloque')[];
    macrosPreferidos?: {
      rangoCalorias?: { min: number; max: number };
      ratioProteina?: { min: number; max: number };
    };
    recursosAceptados: string[]; // IDs de recursos aceptados frecuentemente
    recursosRechazados: string[]; // IDs de recursos rechazados frecuentemente
  };
  patrones: {
    aceptacionesPorTipo: Record<string, number>;
    rechazosPorTipo: Record<string, number>;
    recursosMasAceptados: Array<{ recursoId: string; veces: number }>;
    recursosMasRechazados: Array<{ recursoId: string; veces: number }>;
  };
  actualizadoEn: string;
}

// Mock data storage
const preferenciasMock: PreferenciaDietista[] = [];
const perfilesMock: Map<string, PerfilPreferenciasDietista> = new Map();

/**
 * Guarda una preferencia del dietista (aceptación o rechazo de sugerencia)
 */
export async function guardarPreferenciaDietista(
  dietistaId: string,
  preferencia: Omit<PreferenciaDietista, 'id' | 'dietistaId' | 'creadoEn'>
): Promise<PreferenciaDietista> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const nuevaPreferencia: PreferenciaDietista = {
    ...preferencia,
    id: `pref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    dietistaId,
    creadoEn: new Date().toISOString(),
  };

  preferenciasMock.push(nuevaPreferencia);
  
  // Actualizar perfil de preferencias
  await actualizarPerfilPreferencias(dietistaId);

  return nuevaPreferencia;
}

/**
 * Obtiene el perfil de preferencias del dietista
 */
export async function getPerfilPreferencias(
  dietistaId: string
): Promise<PerfilPreferenciasDietista | null> {
  await new Promise(resolve => setTimeout(resolve, 150));

  let perfil = perfilesMock.get(dietistaId);

  if (!perfil) {
    // Crear perfil inicial basado en preferencias guardadas
    const preferenciasDietista = preferenciasMock.filter(p => p.dietistaId === dietistaId);
    
    if (preferenciasDietista.length === 0) {
      return null;
    }

    perfil = await calcularPerfilDesdePreferencias(dietistaId, preferenciasDietista);
    perfilesMock.set(dietistaId, perfil);
  }

  return perfil;
}

/**
 * Calcula el perfil de preferencias desde las preferencias guardadas
 */
async function calcularPerfilDesdePreferencias(
  dietistaId: string,
  preferencias: PreferenciaDietista[]
): Promise<PerfilPreferenciasDietista> {
  const aceptaciones = preferencias.filter(p => p.tipo === 'aceptada');
  const rechazos = preferencias.filter(p => p.tipo === 'rechazada');

  // Contar aceptaciones/rechazos por tipo
  const aceptacionesPorTipo: Record<string, number> = {};
  const rechazosPorTipo: Record<string, number> = {};

  aceptaciones.forEach(p => {
    aceptacionesPorTipo[p.recursoTipo] = (aceptacionesPorTipo[p.recursoTipo] || 0) + 1;
  });

  rechazos.forEach(p => {
    rechazosPorTipo[p.recursoTipo] = (rechazosPorTipo[p.recursoTipo] || 0) + 1;
  });

  // Recursos más aceptados/rechazados
  const recursosAceptadosCount: Record<string, number> = {};
  const recursosRechazadosCount: Record<string, number> = {};

  aceptaciones.forEach(p => {
    recursosAceptadosCount[p.recursoId] = (recursosAceptadosCount[p.recursoId] || 0) + 1;
  });

  rechazos.forEach(p => {
    recursosRechazadosCount[p.recursoId] = (recursosRechazadosCount[p.recursoId] || 0) + 1;
  });

  const recursosMasAceptados = Object.entries(recursosAceptadosCount)
    .map(([recursoId, veces]) => ({ recursoId, veces }))
    .sort((a, b) => b.veces - a.veces)
    .slice(0, 10);

  const recursosMasRechazados = Object.entries(recursosRechazadosCount)
    .map(([recursoId, veces]) => ({ recursoId, veces }))
    .sort((a, b) => b.veces - a.veces)
    .slice(0, 10);

  return {
    dietistaId,
    preferencias: {
      estilosCulinarios: [], // Se puede inferir de recursos aceptados
      alergenosEvitar: [],
      tiposRecursoPreferidos: Object.keys(aceptacionesPorTipo)
        .filter(tipo => (aceptacionesPorTipo[tipo] || 0) > (rechazosPorTipo[tipo] || 0))
        .map(tipo => tipo as 'receta' | 'plantilla' | 'alimento' | 'bloque'),
      recursosAceptados: recursosMasAceptados.map(r => r.recursoId),
      recursosRechazados: recursosMasRechazados.map(r => r.recursoId),
    },
    patrones: {
      aceptacionesPorTipo,
      rechazosPorTipo,
      recursosMasAceptados,
      recursosMasRechazados,
    },
    actualizadoEn: new Date().toISOString(),
  };
}

/**
 * Actualiza el perfil de preferencias del dietista
 */
async function actualizarPerfilPreferencias(dietistaId: string): Promise<void> {
  const preferenciasDietista = preferenciasMock.filter(p => p.dietistaId === dietistaId);
  const nuevoPerfil = await calcularPerfilDesdePreferencias(dietistaId, preferenciasDietista);
  perfilesMock.set(dietistaId, nuevoPerfil);
}

/**
 * Obtiene las preferencias del dietista para un recurso específico
 */
export async function getPreferenciaRecurso(
  dietistaId: string,
  recursoId: string
): Promise<'aceptada' | 'rechazada' | null> {
  const preferencias = preferenciasMock.filter(
    p => p.dietistaId === dietistaId && p.recursoId === recursoId
  );

  if (preferencias.length === 0) return null;

  // Devolver la preferencia más reciente
  const masReciente = preferencias.sort(
    (a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
  )[0];

  return masReciente.tipo;
}

