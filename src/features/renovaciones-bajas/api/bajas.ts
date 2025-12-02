import { Baja, MotivoBaja, CreateMotivoBajaRequest, UpdateMotivoBajaRequest, FiltrosBajas, EstadisticasBajas } from '../types';

// ============================================================================
// DATOS MOCK - MOTIVOS DE BAJA
// ============================================================================

const datosFalsosMotivos: MotivoBaja[] = [
  {
    id: 'mot-001',
    categoria: 'insatisfaccion',
    descripcion: 'Instalaciones necesitan mejoras',
    esEditable: true,
  },
  {
    id: 'mot-002',
    categoria: 'precio',
    descripcion: 'Precio elevado de la membresía',
    esEditable: true,
  },
  {
    id: 'mot-003',
    categoria: 'no_uso',
    descripcion: 'Horarios no disponibles',
    esEditable: true,
  },
  {
    id: 'mot-004',
    categoria: 'otros',
    descripcion: 'Falta de tiempo',
    esEditable: true,
  },
  {
    id: 'mot-005',
    categoria: 'ubicacion',
    descripcion: 'Cambio de residencia',
    esEditable: true,
  },
  {
    id: 'mot-006',
    categoria: 'salud',
    descripcion: 'Problema de salud',
    esEditable: true,
  },
  {
    id: 'mot-007',
    categoria: 'no_uso',
    descripcion: 'Falta de motivación',
    esEditable: true,
  },
  {
    id: 'mot-008',
    categoria: 'competencia',
    descripcion: 'Encontró mejor alternativa en otro gimnasio',
    esEditable: true,
  },
];

// ============================================================================
// DATOS MOCK - BAJAS
// ============================================================================

const datosFalsosBajas: Baja[] = [
  {
    id: 'baj-001',
    clienteId: 'cl-101',
    suscripcionId: 'sub-101',
    fechaSolicitud: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    fechaEfectiva: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    tipoEfecto: 'fin_periodo',
    motivoPrincipalId: 'mot-002',
    otrosMotivosIds: ['mot-008'],
    intentoRetencionRealizado: true,
    resultadoRetencion: 'no_retenido',
    comentarios: 'Cliente encontró una alternativa más económica en otro gimnasio. Se ofreció descuento del 15% pero rechazó.',
  },
  {
    id: 'baj-002',
    clienteId: 'cl-102',
    suscripcionId: 'sub-102',
    fechaSolicitud: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    fechaEfectiva: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tipoEfecto: 'inmediata',
    motivoPrincipalId: 'mot-005',
    intentoRetencionRealizado: false,
    comentarios: 'Se mudó a otra ciudad por trabajo. No aplica retención.',
  },
  {
    id: 'baj-003',
    clienteId: 'cl-103',
    suscripcionId: 'sub-103',
    fechaSolicitud: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    fechaEfectiva: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tipoEfecto: 'fin_periodo',
    motivoPrincipalId: 'mot-003',
    intentoRetencionRealizado: true,
    resultadoRetencion: 'retenido',
    comentarios: 'Los horarios de clases no coinciden. Se ajustó el horario y el cliente aceptó continuar.',
  },
  {
    id: 'baj-004',
    clienteId: 'cl-104',
    suscripcionId: 'sub-104',
    fechaSolicitud: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    fechaEfectiva: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    tipoEfecto: 'inmediata',
    motivoPrincipalId: 'mot-006',
    intentoRetencionRealizado: true,
    resultadoRetencion: 'no_retenido',
    comentarios: 'Lesión en rodilla, debe hacer reposo prolongado. Se ofreció pausa de membresía pero prefirió cancelar.',
  },
  {
    id: 'baj-005',
    clienteId: 'cl-105',
    suscripcionId: 'sub-105',
    fechaSolicitud: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    fechaEfectiva: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    tipoEfecto: 'fin_periodo',
    motivoPrincipalId: 'mot-004',
    otrosMotivosIds: ['mot-007'],
    intentoRetencionRealizado: true,
    resultadoRetencion: 'no_retenido',
    comentarios: 'Trabajo exigente no le permite dedicar tiempo al gimnasio. Perdió motivación.',
  },
  {
    id: 'baj-006',
    clienteId: 'cl-106',
    suscripcionId: 'sub-106',
    fechaSolicitud: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    fechaEfectiva: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tipoEfecto: 'inmediata',
    motivoPrincipalId: 'mot-001',
    intentoRetencionRealizado: false,
    comentarios: 'Espacios muy pequeños y equipo anticuado. Cliente muy insatisfecho.',
  },
  {
    id: 'baj-007',
    clienteId: 'cl-107',
    suscripcionId: 'sub-107',
    fechaSolicitud: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    fechaEfectiva: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    tipoEfecto: 'fin_periodo',
    motivoPrincipalId: 'mot-002',
    intentoRetencionRealizado: true,
    resultadoRetencion: 'retenido',
    comentarios: 'Precio elevado. Se negoció un plan más económico y el cliente aceptó.',
  },
  {
    id: 'baj-008',
    clienteId: 'cl-108',
    suscripcionId: 'sub-108',
    fechaSolicitud: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    fechaEfectiva: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
    tipoEfecto: 'fin_periodo',
    motivoPrincipalId: 'mot-008',
    intentoRetencionRealizado: true,
    resultadoRetencion: 'no_retenido',
    comentarios: 'Competencia ofreció mejor precio y más servicios.',
  },
  {
    id: 'baj-009',
    clienteId: 'cl-109',
    suscripcionId: 'sub-109',
    fechaSolicitud: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    fechaEfectiva: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tipoEfecto: 'inmediata',
    motivoPrincipalId: 'mot-006',
    intentoRetencionRealizado: false,
    comentarios: 'Problema de salud temporal. Cliente prefiere cancelar y volver cuando se recupere.',
  },
  {
    id: 'baj-010',
    clienteId: 'cl-110',
    suscripcionId: 'sub-110',
    fechaSolicitud: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    fechaEfectiva: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tipoEfecto: 'fin_periodo',
    motivoPrincipalId: 'mot-003',
    otrosMotivosIds: ['mot-004'],
    intentoRetencionRealizado: true,
    resultadoRetencion: 'retenido',
    comentarios: 'Horarios y falta de tiempo. Se ofreció flexibilidad en horarios y el cliente aceptó.',
  },
];

// ============================================================================
// FUNCIONES DE API - BAJAS
// ============================================================================

/**
 * Registra una nueva baja de cliente
 * @param data Datos de la baja sin el id (se genera automáticamente)
 * @returns La baja registrada con su id
 */
export async function registrarBaja(data: Omit<Baja, 'id'>): Promise<Baja> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevaBaja: Baja = {
    id: `baj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...data,
  };
  
  datosFalsosBajas.push(nuevaBaja);
  return nuevaBaja;
}

/**
 * Obtiene las bajas aplicando filtros opcionales
 * @param filtros Filtros opcionales para la búsqueda
 * @returns Lista de bajas que cumplen los filtros
 */
export async function getBajas(filtros?: FiltrosBajas): Promise<Baja[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let resultado = [...datosFalsosBajas];
  
  if (filtros) {
    // Filtro por rango de fechas
    if (filtros.fechaDesde) {
      const fechaDesde = new Date(filtros.fechaDesde).getTime();
      resultado = resultado.filter(baja => 
        new Date(baja.fechaSolicitud).getTime() >= fechaDesde
      );
    }
    
    if (filtros.fechaHasta) {
      const fechaHasta = new Date(filtros.fechaHasta).getTime();
      resultado = resultado.filter(baja => 
        new Date(baja.fechaSolicitud).getTime() <= fechaHasta
      );
    }
    
    // Filtro por motivo principal
    if (filtros.motivoPrincipalId) {
      resultado = resultado.filter(baja => 
        baja.motivoPrincipalId === filtros.motivoPrincipalId
      );
    }
    
    // Filtro por resultado de retención
    if (filtros.resultadoRetencion) {
      resultado = resultado.filter(baja => 
        baja.resultadoRetencion === filtros.resultadoRetencion
      );
    }
    
    // Filtro por tipo de efecto
    if (filtros.tipoEfecto) {
      resultado = resultado.filter(baja => 
        baja.tipoEfecto === filtros.tipoEfecto
      );
    }
  }
  
  // Ordenar por fecha de solicitud (más recientes primero)
  resultado.sort((a, b) => 
    new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime()
  );
  
  return resultado;
}

/**
 * Obtiene las bajas más recientes
 * @param limit Número máximo de bajas a retornar (por defecto 10)
 * @returns Lista de bajas más recientes
 */
export async function getBajasRecientes(limit: number = 10): Promise<Baja[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const todasLasBajas = [...datosFalsosBajas];
  
  // Ordenar por fecha de solicitud (más recientes primero)
  todasLasBajas.sort((a, b) => 
    new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime()
  );
  
  return todasLasBajas.slice(0, limit);
}

/**
 * Actualiza el resultado de un intento de retención
 * @param idBaja Identificador de la baja
 * @param resultado Resultado del intento de retención
 * @param comentarios Comentarios adicionales sobre el intento (opcional)
 * @returns La baja actualizada
 */
export async function actualizarIntentoRetencion(
  idBaja: string,
  resultado: 'retenido' | 'no_retenido',
  comentarios?: string
): Promise<Baja> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = datosFalsosBajas.findIndex(b => b.id === idBaja);
  
  if (index === -1) {
    throw new Error(`Baja con id ${idBaja} no encontrada`);
  }
  
  const bajaActualizada: Baja = {
    ...datosFalsosBajas[index],
    intentoRetencionRealizado: true,
    resultadoRetencion: resultado,
    comentarios: comentarios || datosFalsosBajas[index].comentarios,
  };
  
  datosFalsosBajas[index] = bajaActualizada;
  
  return bajaActualizada;
}

/**
 * Obtiene estadísticas de bajas para un período determinado
 * @param periodo Período de análisis (año y mes opcional)
 * @returns Estadísticas de bajas
 */
export async function getEstadisticasBajas(
  periodo: { anio: number; mes?: number }
): Promise<EstadisticasBajas> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Filtrar bajas por período
  let bajasEnPeriodo = datosFalsosBajas.filter(baja => {
    const fechaBaja = new Date(baja.fechaSolicitud);
    const anioBaja = fechaBaja.getFullYear();
    const mesBaja = fechaBaja.getMonth() + 1; // getMonth() es 0-indexed
    
    if (periodo.mes !== undefined) {
      return anioBaja === periodo.anio && mesBaja === periodo.mes;
    }
    return anioBaja === periodo.anio;
  });
  
  const totalBajas = bajasEnPeriodo.length;
  const bajasInmediatas = bajasEnPeriodo.filter(b => b.tipoEfecto === 'inmediata').length;
  const bajasFinPeriodo = bajasEnPeriodo.filter(b => b.tipoEfecto === 'fin_periodo').length;
  
  // Calcular tasas de retención
  const bajasConIntentoRetencion = bajasEnPeriodo.filter(b => b.intentoRetencionRealizado).length;
  const tasaRetencionIntentada = totalBajas > 0 
    ? (bajasConIntentoRetencion / totalBajas) * 100 
    : 0;
  
  const bajasRetenidas = bajasEnPeriodo.filter(b => b.resultadoRetencion === 'retenido').length;
  const tasaRetencionExitosa = bajasConIntentoRetencion > 0
    ? (bajasRetenidas / bajasConIntentoRetencion) * 100
    : 0;
  
  return {
    totalBajas,
    bajasInmediatas,
    bajasFinPeriodo,
    tasaRetencionIntentada: Math.round(tasaRetencionIntentada * 100) / 100,
    tasaRetencionExitosa: Math.round(tasaRetencionExitosa * 100) / 100,
  };
}

// ============================================================================
// FUNCIONES DE API - MOTIVOS DE BAJA (mantenidas para compatibilidad)
// ============================================================================

export async function getMotivosBaja(): Promise<MotivoBaja[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...datosFalsosMotivos];
}

export async function crearMotivoBaja(data: CreateMotivoBajaRequest): Promise<MotivoBaja | null> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mapear CategoriaMotivoBaja a la categoría de MotivoBaja
  const categoriaMap: Record<string, MotivoBaja['categoria']> = {
    'Motivos Economicos': 'precio',
    'Motivos Personales': 'otros',
    'Motivos de Servicio': 'insatisfaccion',
    'Motivos de Ubicacion': 'ubicacion',
    'Motivos de Salud': 'salud',
  };
  
  const nuevoMotivo: MotivoBaja = {
    id: `mot-${Date.now()}`,
    categoria: categoriaMap[data.categoria] || 'otros',
    descripcion: data.nombre + (data.descripcion ? ` - ${data.descripcion}` : ''),
    esEditable: true,
  };
  
  datosFalsosMotivos.push(nuevoMotivo);
  return nuevoMotivo;
}

export async function actualizarMotivoBaja(
  id: string,
  data: UpdateMotivoBajaRequest
): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = datosFalsosMotivos.findIndex(m => m.id === id);
  if (index !== -1) {
    if (data.categoria) {
      const categoriaMap: Record<string, MotivoBaja['categoria']> = {
        'Motivos Economicos': 'precio',
        'Motivos Personales': 'otros',
        'Motivos de Servicio': 'insatisfaccion',
        'Motivos de Ubicacion': 'ubicacion',
        'Motivos de Salud': 'salud',
      };
      datosFalsosMotivos[index].categoria = categoriaMap[data.categoria] || 'otros';
    }
    if (data.nombre || data.descripcion) {
      datosFalsosMotivos[index].descripcion = data.nombre || datosFalsosMotivos[index].descripcion;
    }
    return true;
  }
  return false;
}

export async function eliminarMotivoBaja(id: string): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = datosFalsosMotivos.findIndex(m => m.id === id);
  if (index !== -1) {
    datosFalsosMotivos.splice(index, 1);
    return true;
  }
  return false;
}

// ============================================================================
// FUNCIONES LEGACY (mantenidas para compatibilidad con componentes existentes)
// ============================================================================

/**
 * @deprecated Usar getBajas() en su lugar
 */
export async function procesarBaja(
  id: string,
  motivoId?: string,
  motivoTexto?: string
): Promise<Baja | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const baja = datosFalsosBajas.find(b => b.id === id);
  return baja || null;
}

/**
 * @deprecated Usar registrarBaja() y luego actualizarIntentoRetencion() en su lugar
 */
export async function cancelarBaja(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = datosFalsosBajas.findIndex(b => b.id === id);
  if (index !== -1) {
    datosFalsosBajas.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * @deprecated Esta función necesita acceso a datos de clientes para funcionar correctamente
 */
export async function exportarBajas(): Promise<Blob | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Crear un blob CSV simple con los datos disponibles
  const csv = 'ID,Cliente ID,Suscripción ID,Fecha Solicitud,Fecha Efectiva,Tipo Efecto,Motivo Principal,Resultado Retención\n' +
    datosFalsosBajas.map(b => 
      `"${b.id}","${b.clienteId}","${b.suscripcionId || ''}","${b.fechaSolicitud}","${b.fechaEfectiva}","${b.tipoEfecto}","${b.motivoPrincipalId}","${b.resultadoRetencion || 'N/A'}"`
    ).join('\n');
  
  return new Blob([csv], { type: 'text/csv' });
}
