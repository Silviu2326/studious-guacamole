import { Objective, ObjectiveFilters, ObjectiveStatus } from '../types';

/**
 * Utilidad para calcular el progreso de un objetivo basado en valorActual y valorObjetivo
 * 
 * Esta función calcula el porcentaje de progreso de un objetivo usando los campos
 * valorActual y valorObjetivo (con soporte para alias en inglés: currentValue y targetValue).
 * 
 * La función garantiza:
 * - El progreso nunca excede el 100%
 * - Maneja valores negativos o cero de forma segura
 * - Soporta tanto campos en español como en inglés para compatibilidad
 * 
 * @param objective - El objetivo del cual calcular el progreso
 * @returns El porcentaje de progreso (0-100)
 * 
 * @example
 * const objetivo = {
 *   valorActual: 35000,
 *   valorObjetivo: 50000,
 *   // ... otros campos
 * };
 * const progreso = calculateObjectiveProgress(objetivo); // 70
 */
export const calculateObjectiveProgress = (objective: Objective): number => {
  // Soporta tanto campos en español (valorActual, valorObjetivo) como en inglés (currentValue, targetValue)
  const valorActual = objective.valorActual ?? objective.currentValue ?? 0;
  const valorObjetivo = objective.valorObjetivo ?? objective.targetValue ?? 0;

  // Validación: si el valor objetivo es 0 o negativo, retornar 0
  if (valorObjetivo <= 0) {
    return 0;
  }

  // Calcular el progreso y limitarlo al 100%
  const progreso = (valorActual / valorObjetivo) * 100;
  return Math.min(Math.max(progreso, 0), 100);
};

// ============================================================================
// DATOS MOCK
// ============================================================================

/**
 * Mock data - En producción esto sería llamadas a una API real
 * 
 * Estos objetivos de ejemplo cubren diferentes tipos de métricas y estados:
 * - Objetivos de facturación mensual
 * - Objetivos de retención trimestral
 * - Objetivos de sesiones por cliente
 * - Diferentes estados: on_track, at_risk, completed, in_progress
 */
const mockObjectives: Objective[] = [
  {
    id: '1',
    title: 'Facturación Mensual',
    nombre: 'Facturación Mensual',
    description: 'Alcanzar objetivo de facturación mensual de €50,000',
    descripcion: 'Alcanzar objetivo de facturación mensual de €50,000',
    metric: 'facturacion',
    tipo: 'facturacion',
    periodo: '2024-12',
    targetValue: 50000,
    valorObjetivo: 50000,
    currentValue: 35000,
    valorActual: 35000,
    unit: '€',
    deadline: '2024-12-31',
    fechaFin: '2024-12-31',
    fechaInicio: '2024-12-01',
    status: 'in_progress',
    responsible: 'user-001',
    responsable: 'user-001',
    category: 'financiero',
    progress: 70,
    progreso: 70,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
    tags: ['facturacion', 'mensual', 'financiero'],
  },
  {
    id: '2',
    title: 'Adherencia de Clientes',
    nombre: 'Adherencia de Clientes',
    description: 'Mantener adherencia superior al 80%',
    descripcion: 'Mantener adherencia superior al 80%',
    metric: 'adherencia',
    tipo: 'adherencia',
    periodo: '2024-12',
    targetValue: 80,
    valorObjetivo: 80,
    currentValue: 75,
    valorActual: 75,
    unit: '%',
    deadline: '2024-12-31',
    fechaFin: '2024-12-31',
    fechaInicio: '2024-12-01',
    status: 'on_track',
    responsible: 'user-002',
    responsable: 'user-002',
    category: 'operacional',
    progress: 93.75,
    progreso: 93.75,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
    tags: ['adherencia', 'clientes'],
  },
  {
    id: '3',
    title: 'Retención Trimestral',
    nombre: 'Retención Trimestral Q4',
    description: 'Mantener tasa de retención de clientes superior al 85% en Q4 2024',
    descripcion: 'Mantener tasa de retención de clientes superior al 85% en Q4 2024',
    metric: 'retencion',
    tipo: 'retencion',
    periodo: '2024-Q4',
    targetValue: 85,
    valorObjetivo: 85,
    currentValue: 68,
    valorActual: 68,
    unit: '%',
    deadline: '2024-12-31',
    fechaFin: '2024-12-31',
    fechaInicio: '2024-10-01',
    status: 'at_risk',
    responsible: 'user-001',
    responsable: 'user-001',
    category: 'clientes',
    progress: 80,
    progreso: 80,
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
    tags: ['retencion', 'trimestral', 'clientes'],
  },
  {
    id: '4',
    title: 'Sesiones por Cliente',
    nombre: 'Promedio de Sesiones por Cliente',
    description: 'Alcanzar un promedio de 8 sesiones activas por cliente al mes',
    descripcion: 'Alcanzar un promedio de 8 sesiones activas por cliente al mes',
    metric: 'sesiones_por_cliente',
    tipo: 'operacional',
    periodo: '2024-12',
    targetValue: 8,
    valorObjetivo: 8,
    currentValue: 10,
    valorActual: 10,
    unit: 'sesiones',
    deadline: '2024-12-31',
    fechaFin: '2024-12-31',
    fechaInicio: '2024-12-01',
    status: 'completed',
    responsible: 'user-003',
    responsable: 'user-003',
    category: 'operacional',
    progress: 100,
    progreso: 100,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
    tags: ['sesiones', 'clientes', 'operacional'],
  },
  {
    id: '5',
    title: 'Facturación Q4 Completada',
    nombre: 'Facturación Q4 Completada',
    description: 'Objetivo de facturación trimestral completado exitosamente',
    descripcion: 'Objetivo de facturación trimestral completado exitosamente',
    metric: 'facturacion',
    tipo: 'facturacion',
    periodo: '2024-Q4',
    targetValue: 150000,
    valorObjetivo: 150000,
    currentValue: 152000,
    valorActual: 152000,
    unit: '€',
    deadline: '2024-12-31',
    fechaFin: '2024-12-31',
    fechaInicio: '2024-10-01',
    status: 'completed',
    responsible: 'user-001',
    responsable: 'user-001',
    category: 'financiero',
    progress: 100,
    progreso: 100,
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-12-20T15:45:00Z',
    tags: ['facturacion', 'trimestral', 'completado'],
  },
  {
    id: '6',
    title: 'Captación de Nuevos Clientes',
    nombre: 'Captación de Nuevos Clientes Diciembre',
    description: 'Captar 25 nuevos clientes durante diciembre',
    descripcion: 'Captar 25 nuevos clientes durante diciembre',
    metric: 'leads',
    tipo: 'leads',
    periodo: '2024-12',
    targetValue: 25,
    valorObjetivo: 25,
    currentValue: 12,
    valorActual: 12,
    unit: 'clientes',
    deadline: '2024-12-31',
    fechaFin: '2024-12-31',
    fechaInicio: '2024-12-01',
    status: 'at_risk',
    responsible: 'user-004',
    responsable: 'user-004',
    category: 'marketing',
    progress: 48,
    progreso: 48,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
    tags: ['leads', 'marketing', 'nuevos-clientes'],
  },
];

// Flag para objetivos archivados (soft delete)
const archivedObjectiveIds = new Set<string>();

// ============================================================================
// FUNCIONES CRUD
// ============================================================================

/**
 * Obtiene una lista de objetivos con filtros opcionales
 * 
 * Filtros soportados:
 * - status/estado: Filtrar por estado del objetivo
 * - category/categoria/tipo: Filtrar por categoría o tipo
 * - responsible/responsable: Filtrar por responsable asignado
 * - periodo: Filtrar por período del objetivo (ej: '2024-12', '2024-Q4')
 * - deadlineFrom/fechaDesde: Filtrar por fecha límite desde
 * - deadlineTo/fechaHasta: Filtrar por fecha límite hasta
 * - tags: Filtrar por tags (debe incluir todos los tags especificados)
 * 
 * @param filters - Filtros opcionales para la búsqueda
 * @param role - Rol del usuario para filtrar objetivos según permisos
 * @returns Lista de objetivos que cumplen los filtros
 * 
 * @example
 * // Obtener todos los objetivos en progreso
 * const objetivos = await getObjectives({ status: 'in_progress' });
 * 
 * // Obtener objetivos de un período específico
 * const objetivos = await getObjectives({ periodo: '2024-12' });
 * 
 * // Obtener objetivos de un responsable
 * const objetivos = await getObjectives({ responsible: 'user-001' });
 */
export const getObjectives = async (
  filters?: ObjectiveFilters,
  role?: 'entrenador' | 'gimnasio'
): Promise<Objective[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));

  let filtered = [...mockObjectives].filter(obj => !archivedObjectiveIds.has(obj.id));

  // Filtrar por estado
  if (filters?.status || filters?.estado) {
    const status = filters.status || filters.estado;
    filtered = filtered.filter(obj => obj.status === status);
  }

  // Filtrar por categoría o tipo
  if (filters?.category || filters?.categoria || filters?.tipo) {
    const category = filters.category || filters.categoria || filters.tipo;
    filtered = filtered.filter(
      obj => obj.category === category || obj.tipo === category || obj.metric === category
    );
  }

  // Filtrar por responsable
  if (filters?.responsible || filters?.responsable) {
    const responsable = filters.responsible || filters.responsable;
    filtered = filtered.filter(
      obj => obj.responsible === responsable || obj.responsable === responsable
    );
  }

  // Filtrar por período
  if (filters?.periodo) {
    filtered = filtered.filter(obj => obj.periodo === filters.periodo);
  }

  // Filtrar por fecha límite desde
  if (filters?.deadlineFrom || filters?.fechaDesde) {
    const fechaDesde = filters.deadlineFrom || filters.fechaDesde;
    filtered = filtered.filter(obj => obj.deadline >= fechaDesde);
  }

  // Filtrar por fecha límite hasta
  if (filters?.deadlineTo || filters?.fechaHasta) {
    const fechaHasta = filters.deadlineTo || filters.fechaHasta;
    filtered = filtered.filter(obj => obj.deadline <= fechaHasta);
  }

  // Filtrar por tags (debe incluir todos los tags especificados)
  if (filters?.tags && filters.tags.length > 0) {
    filtered = filtered.filter(obj => {
      if (!obj.tags) return false;
      return filters.tags!.every(tag => obj.tags!.includes(tag));
    });
  }

  // Filtrar por rol - ajustar objetivos según el tipo de usuario
  if (role === 'entrenador') {
    filtered = filtered.filter(obj =>
      ['facturacion', 'adherencia', 'retencion'].includes(obj.metric)
    );
  } else if (role === 'gimnasio') {
    filtered = filtered.filter(obj =>
      ['facturacion', 'ocupacion', 'tasa_bajas', 'objetivos_comerciales'].includes(obj.metric)
    );
  }

  // Asegurar que todos los objetivos tienen el progreso calculado correctamente
  return filtered.map(obj => ({
    ...obj,
    progress: calculateObjectiveProgress(obj),
    progreso: calculateObjectiveProgress(obj),
  }));
};

/**
 * Obtiene un objetivo específico por su ID
 * 
 * @param id - ID del objetivo a obtener
 * @returns El objetivo encontrado o null si no existe
 */
export const getObjective = async (id: string): Promise<Objective | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const objective = mockObjectives.find(obj => obj.id === id && !archivedObjectiveIds.has(obj.id));
  
  if (!objective) {
    return null;
  }

  // Asegurar que el progreso está calculado correctamente
  return {
    ...objective,
    progress: calculateObjectiveProgress(objective),
    progreso: calculateObjectiveProgress(objective),
  };
};

/**
 * Crea un nuevo objetivo
 * 
 * El progreso se calcula automáticamente basado en valorActual y valorObjetivo
 * usando la función calculateObjectiveProgress.
 * 
 * @param objectiveData - Datos del objetivo a crear (sin id, createdAt, updatedAt, progress)
 * @returns El objetivo creado con todos los campos completos
 * 
 * @example
 * const nuevoObjetivo = await createObjective({
 *   title: 'Nuevo Objetivo',
 *   description: 'Descripción del objetivo',
 *   metric: 'facturacion',
 *   targetValue: 10000,
 *   currentValue: 0,
 *   unit: '€',
 *   deadline: '2024-12-31',
 *   status: 'not_started',
 *   responsible: 'user-001',
 *   category: 'financiero',
 * });
 */
export const createObjective = async (
  objectiveData: Omit<Objective, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'progreso'>
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const now = new Date().toISOString();
  
  // Normalizar campos (soporta tanto español como inglés)
  const valorActual = objectiveData.valorActual ?? objectiveData.currentValue ?? 0;
  const valorObjetivo = objectiveData.valorObjetivo ?? objectiveData.targetValue ?? 0;

  const newObjective: Objective = {
    ...objectiveData,
    // Asegurar que ambos campos (español e inglés) están presentes
    currentValue: valorActual,
    valorActual,
    targetValue: valorObjetivo,
    valorObjetivo,
    id: `obj-${Date.now()}`,
    progress: calculateObjectiveProgress({
      ...objectiveData,
      currentValue: valorActual,
      valorActual,
      targetValue: valorObjetivo,
      valorObjetivo,
    } as Objective),
    progreso: calculateObjectiveProgress({
      ...objectiveData,
      currentValue: valorActual,
      valorActual,
      targetValue: valorObjetivo,
      valorObjetivo,
    } as Objective),
    createdAt: now,
    updatedAt: now,
  };

  // Ajustar el estado inicial si no se proporciona
  if (!newObjective.status) {
    if (newObjective.progress >= 100) {
      newObjective.status = 'completed';
    } else if (newObjective.progress > 0) {
      newObjective.status = 'in_progress';
    } else {
      newObjective.status = 'not_started';
    }
  }

  mockObjectives.push(newObjective);
  return newObjective;
};

/**
 * Actualiza un objetivo existente
 * 
 * Cuando se actualizan valorActual o valorObjetivo, el progreso se recalcula
 * automáticamente usando calculateObjectiveProgress. El estado también se
 * ajusta automáticamente según el progreso:
 * - Si progreso >= 100: estado = 'completed'
 * - Si progreso < 50 y estaba en progreso: estado = 'at_risk'
 * 
 * @param objectiveId - ID del objetivo a actualizar
 * @param changes - Campos a actualizar (parciales)
 * @returns El objetivo actualizado
 * @throws Error si el objetivo no existe o está archivado
 * 
 * @example
 * // Actualizar el valor actual
 * const actualizado = await updateObjective('obj-1', {
 *   currentValue: 40000,
 *   valorActual: 40000,
 * });
 * 
 * // Actualizar múltiples campos
 * const actualizado = await updateObjective('obj-1', {
 *   title: 'Nuevo Título',
 *   status: 'on_track',
 * });
 */
export const updateObjective = async (
  objectiveId: string,
  changes: Partial<Objective>
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockObjectives.findIndex(obj => obj.id === objectiveId);
  if (index === -1 || archivedObjectiveIds.has(objectiveId)) {
    throw new Error('Objective not found or has been archived');
  }

  const existingObjective = mockObjectives[index];
  
  // Normalizar valores actuales y objetivo en los cambios
  const valorActual = changes.valorActual ?? changes.currentValue ?? existingObjective.valorActual ?? existingObjective.currentValue ?? 0;
  const valorObjetivo = changes.valorObjetivo ?? changes.targetValue ?? existingObjective.valorObjetivo ?? existingObjective.targetValue ?? 0;

  const updated: Objective = {
    ...existingObjective,
    ...changes,
    // Asegurar que ambos campos están actualizados
    currentValue: valorActual,
    valorActual,
    targetValue: valorObjetivo,
    valorObjetivo,
    updatedAt: new Date().toISOString(),
  };

  // Recalcular progreso si se modificaron valores
  if (changes.currentValue !== undefined || changes.valorActual !== undefined ||
      changes.targetValue !== undefined || changes.valorObjetivo !== undefined) {
    updated.progress = calculateObjectiveProgress(updated);
    updated.progreso = calculateObjectiveProgress(updated);

    // Ajustar estado según el progreso
    if (updated.progress >= 100) {
      updated.status = 'completed';
    } else if (updated.progress < 50 && (existingObjective.status === 'in_progress' || existingObjective.status === 'on_track')) {
      updated.status = 'at_risk';
    } else if (updated.progress > 0 && updated.status === 'not_started') {
      updated.status = 'in_progress';
    }
  }

  mockObjectives[index] = updated;
  return updated;
};

/**
 * Elimina un objetivo (soft delete)
 * 
 * En lugar de eliminar físicamente el objetivo, lo marca como archivado.
 * Los objetivos archivados no aparecen en las búsquedas normales, pero
 * se pueden recuperar si es necesario.
 * 
 * Para una eliminación permanente, se podría implementar una función
 * adicional `permanentlyDeleteObjective`, pero por defecto se usa
 * archivado suave para mantener el historial.
 * 
 * @param objectiveId - ID del objetivo a eliminar/archivar
 * @returns Promise que se resuelve cuando el objetivo ha sido archivado
 * @throws Error si el objetivo no existe
 * 
 * @example
 * await deleteObjective('obj-1');
 */
export const deleteObjective = async (objectiveId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const objective = mockObjectives.find(obj => obj.id === objectiveId);
  if (!objective) {
    throw new Error('Objective not found');
  }

  // Soft delete: marcar como archivado en lugar de eliminar físicamente
  archivedObjectiveIds.add(objectiveId);

  // Opcional: También podríamos marcar el estado como 'archived' si queremos
  // mantenerlo visible pero marcado como archivado
  // const index = mockObjectives.findIndex(obj => obj.id === objectiveId);
  // if (index !== -1) {
  //   mockObjectives[index].status = 'archived' as any;
  // }
};

/**
 * Obtiene el progreso y estado de un objetivo
 * 
 * @param id - ID del objetivo
 * @returns Objeto con el progreso y estado del objetivo
 * @throws Error si el objetivo no existe
 */
export const getObjectiveProgress = async (
  id: string
): Promise<{ progress: number; status: string }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const objective = mockObjectives.find(obj => obj.id === id && !archivedObjectiveIds.has(obj.id));
  if (!objective) {
    throw new Error('Objective not found');
  }

  const progress = calculateObjectiveProgress(objective);
  
  return {
    progress,
    status: objective.status,
  };
};

// ============================================================================
// DOCUMENTACIÓN: Sincronización con otros módulos
// ============================================================================

/**
 * SINCRONIZACIÓN CON OTROS MÓDULOS
 * 
 * Los objetivos definidos en este módulo pueden sincronizarse e integrarse
 * con otros módulos del sistema de las siguientes maneras:
 * 
 * 1. OBJETIVOS VINCULADOS A CAMPAÑAS DE MARKETING
 *    - Los objetivos de tipo 'leads' o 'captacion' pueden vincularse a
 *      campañas de marketing activas del módulo de Campañas y Automatización.
 *    - Cuando una campaña genera nuevos leads, el valorActual del objetivo
 *      correspondiente se actualiza automáticamente.
 *    - Implementación sugerida:
 *      * En el módulo de campañas, después de registrar un nuevo lead,
 *        llamar a updateObjective() con el nuevo currentValue.
 *      * Crear un webhook o servicio de sincronización que actualice
 *        objetivos cuando cambien las métricas de campañas.
 * 
 * 2. OBJETIVOS DE NÚMERO DE CLIENTES ACTIVOS
 *    - Los objetivos de tipo 'retencion' o 'clientes_activos' pueden
 *      vincularse al módulo de Gestión de Clientes.
 *    - El valorActual se puede calcular en tiempo real consultando
 *      la base de datos de clientes activos.
 *    - Implementación sugerida:
 *      * Crear un servicio que calcule periódicamente el número de
 *        clientes activos y actualice los objetivos correspondientes.
 *      * Usar un scheduler (cron job) que ejecute esta actualización
 *        diariamente o en tiempo real mediante eventos.
 * 
 * 3. OBJETIVOS DE FACTURACIÓN
 *    - Los objetivos de tipo 'facturacion' pueden sincronizarse con
 *      sistemas de facturación o módulos financieros.
 *    - El valorActual puede obtenerse de facturas procesadas en el
 *      período correspondiente al objetivo.
 *    - Implementación sugerida:
 *      * Consultar la base de datos de facturas/finanzas al calcular
 *        el progreso del objetivo.
 *      * Actualizar automáticamente cuando se emite una nueva factura.
 * 
 * 4. OBJETIVOS DE SESIONES Y ADHERENCIA
 *    - Los objetivos relacionados con sesiones por cliente pueden
 *      sincronizarse con el módulo de Programas de Entreno.
 *    - El valorActual puede calcularse sumando sesiones completadas
 *      de clientes activos en el período.
 *    - Implementación sugerida:
 *      * Integrar con el registro de sesiones de entrenamiento.
 *      * Actualizar el objetivo cuando se registra una nueva sesión.
 * 
 * 5. SISTEMA DE EVENTOS Y WEBHOOKS
 *    - Para mantener la sincronización en tiempo real, se puede
 *      implementar un sistema de eventos:
 *      * Cuando cambia una métrica relevante (nuevo cliente, factura,
 *        sesión), emitir un evento.
 *      * El módulo de objetivos escucha estos eventos y actualiza
 *        automáticamente el valorActual de objetivos relacionados.
 * 
 * EJEMPLO DE INTEGRACIÓN:
 * 
 * ```typescript
 * // En el módulo de campañas de marketing
 * import { updateObjective } from '@/features/objetivos-rendimiento/api/objectives';
 * 
 * async function onNewLeadGenerated(campaignId: string, leadData: Lead) {
 *   // Procesar el lead...
 *   
 *   // Actualizar objetivo de leads si existe uno para esta campaña
 *   const objetivo = await getObjectiveByCampaignId(campaignId);
 *   if (objetivo) {
 *     await updateObjective(objetivo.id, {
 *       currentValue: objetivo.currentValue + 1,
 *       valorActual: objetivo.valorActual + 1,
 *     });
 *   }
 * }
 * ```
 * 
 * NOTAS IMPORTANTES:
 * - Los objetivos deben usar campos consistentes: tanto valorActual/valorObjetivo
 *   (español) como currentValue/targetValue (inglés) para máxima compatibilidad.
 * - El progreso se calcula siempre usando calculateObjectiveProgress() para
 *   garantizar consistencia.
 * - Los cambios en objetivos pueden generar alertas en el módulo de alertas
 *   si un objetivo entra en estado 'at_risk' o se completa.
 */